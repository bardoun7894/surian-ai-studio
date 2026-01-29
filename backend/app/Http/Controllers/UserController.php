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

    // Admin: List All Users with Filters
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $query = User::with(['role', 'directorate']);

        // Filter by role
        if ($request->has('role_id') && $request->role_id !== '') {
            $query->where('role_id', $request->role_id);
        }

        // Filter by status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        // Filter by directorate
        if ($request->has('directorate_id') && $request->directorate_id !== '') {
            $query->where('directorate_id', $request->directorate_id);
        }

        // Search by name or email
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Order by
        $orderBy = $request->input('order_by', 'created_at');
        $orderDir = $request->input('order_dir', 'desc');
        $query->orderBy($orderBy, $orderDir);

        // Pagination
        $perPage = $request->input('per_page', 15);
        $users = $query->paginate($perPage);

        return response()->json($users);
    }

    // Admin: Get Single User Details
    public function show(Request $request, $id)
    {
        $user = User::with(['role', 'directorate'])->findOrFail($id);

        return response()->json([
            'user' => $user,
            'statistics' => [
                'complaints_count' => $user->complaints()->count(),
                'suggestions_count' => $user->suggestions()->count(),
                'last_login' => $user->last_login_at,
                'account_age_days' => $user->created_at->diffInDays(now()),
            ]
        ]);
    }

    // Admin: Update User Details
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'role_id' => 'nullable|exists:roles,id',
            'directorate_id' => 'nullable|exists:directorates,id',
            'national_id' => ['nullable', Rule::unique('users')->ignore($user->id)],
        ]);

        $oldData = $user->only(['name', 'email', 'phone', 'role_id', 'directorate_id']);

        $user->update($request->only([
            'name',
            'email',
            'phone',
            'role_id',
            'directorate_id',
            'national_id'
        ]));

        $this->auditService->log($request->user(), 'user_updated', 'user', $user->id, [
            'old' => $oldData,
            'new' => $user->only(['name', 'email', 'phone', 'role_id', 'directorate_id'])
        ]);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user->load('role', 'directorate')
        ]);
    }

    // Admin: Create Employee
    public function store(Request $request)
    {
        $this->authorize('create', User::class);

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
            'birth_date' => 'nullable|date',
            'governorate' => 'nullable|string|max:255',
            'password' => 'nullable|min:8|confirmed',
        ]);
        
        $oldData = $user->only(['name', 'phone', 'email', 'birth_date', 'governorate']);

        $updateData = [
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'birth_date' => $request->birth_date,
            'governorate' => $request->governorate,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);
        
        $this->auditService->log($user, 'profile_updated', 'user', $user->id, [
            'old' => $oldData,
            'new' => $user->only(['name', 'phone', 'email', 'birth_date', 'governorate'])
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
        $this->authorize('toggleActive', $user);

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
            'birth_date' => 'nullable|date',
            'governorate' => 'nullable|string|max:255',
        ]);

        $citizenRole = Role::where('name', 'citizen')->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'national_id' => $request->national_id,
            'phone' => $request->phone,
            'birth_date' => $request->birth_date,
            'governorate' => $request->governorate,
            'two_factor_enabled' => $request->boolean('two_factor_enabled'),
            'is_active' => true,
            'role_id' => $citizenRole ? $citizenRole->id : null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        
        $this->auditService->log($user, 'registered', 'user', $user->id);

        return response()->json([
            'message' => 'Account created successfully.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('role')
        ], 201);
    }
}
