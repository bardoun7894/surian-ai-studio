<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    protected $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    // Admin: Create Employee
    public function store(Request $request)
    {
        // Permission check is handled by middleware on routes
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            'directorate_id' => 'nullable|exists:directorates,id',
            // 'password' generated automatically
        ]);

        $role = Role::find($request->role_id);
        
        $tempPassword = \Illuminate\Support\Str::random(10);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($tempPassword),
            'role_id' => $request->role_id,
            'directorate_id' => $request->directorate_id,
            'is_active' => true,
        ]);

        $this->auditService->log($request->user(), 'user_created', 'user', $user->id, [
            'name' => $user->name,
            'email' => $user->email,
            'role_id' => $user->role_id
        ]);

        // In production: Send email with temp password
        // Mail::to($user->email)->send(new WelcomeEmail($tempPassword));

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user->load('role', 'directorate'),
            'temp_password' => $tempPassword // Return only for dev convenience
        ], 201);
    }

    // User: Update Own Profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        ]);
        
        $oldData = $user->only(['name', 'phone', 'email']);

        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
        ]);
        
        $this->auditService->log($user, 'profile_updated', 'user', $user->id, [
            'old' => $oldData,
            'new' => $user->only(['name', 'phone', 'email'])
        ]);

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $user->load('role', 'directorate')
        ]);
    }

    // Admin: Disable/Enable Account
    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent self-lockout
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot disable your own account.'], 400);
        }

        $user->is_active = !$user->is_active;
        $user->save();
        
        if (!$user->is_active) {
            $user->tokens()->delete(); // Revoke tokens
        }

        $this->auditService->log($request->user(), $user->is_active ? 'user_enabled' : 'user_disabled', 'user', $user->id);

        return response()->json([
            'message' => $user->is_active ? 'User enabled.' : 'User disabled.',
            'is_active' => $user->is_active
        ]);
    }
    
    // Auth: Password Reset (Authenticated)
    public function resetPassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();
        
        $this->auditService->log($user, 'password_reset', 'user', $user->id);

        return response()->json(['message' => 'Password changed successfully.']);
    }
    
    // User: Get Notification Preferences
    public function getNotificationPreferences(Request $request)
    {
        $user = $request->user();

        $defaultPreferences = [
            'email_enabled' => true,
            'email_complaint_updates' => true,
            'email_new_responses' => true,
            'email_status_changes' => true,
            'email_weekly_digest' => false,
            'push_enabled' => true,
            'push_complaint_updates' => true,
            'push_new_responses' => true,
            'push_status_changes' => true,
            'sms_enabled' => false,
            'sms_urgent_only' => true,
        ];

        $preferences = array_merge($defaultPreferences, $user->notification_preferences ?? []);

        return response()->json([
            'preferences' => $preferences,
        ]);
    }

    // User: Update Notification Preferences
    public function updateNotificationPreferences(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'preferences' => 'required|array',
            'preferences.email_enabled' => 'boolean',
            'preferences.email_complaint_updates' => 'boolean',
            'preferences.email_new_responses' => 'boolean',
            'preferences.email_status_changes' => 'boolean',
            'preferences.email_weekly_digest' => 'boolean',
            'preferences.push_enabled' => 'boolean',
            'preferences.push_complaint_updates' => 'boolean',
            'preferences.push_new_responses' => 'boolean',
            'preferences.push_status_changes' => 'boolean',
            'preferences.sms_enabled' => 'boolean',
            'preferences.sms_urgent_only' => 'boolean',
        ]);

        $user->notification_preferences = $request->input('preferences');
        $user->save();

        $this->auditService->log($user, 'notification_preferences_updated', 'user', $user->id);

        return response()->json([
            'message' => 'Notification preferences updated.',
            'preferences' => $user->notification_preferences,
        ]);
    }

    // Public: Register Citizen
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'national_id' => 'required|unique:users,national_id',
            'phone' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'national_id' => $request->national_id,
            'phone' => $request->phone,
            'is_active' => true,
            // role_id null means Citizen/Guest, or assign a specific Citizen role if exists
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        
        // $this->auditService->log($user, 'registered', 'user', $user->id); // Log action?

        return response()->json([
            'message' => 'Account created successfully.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }
}
