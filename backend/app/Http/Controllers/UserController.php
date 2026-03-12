<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Mail\TwoFactorCode;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

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
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('father_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
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
            'first_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'role_id' => 'nullable|exists:roles,id',
            'directorate_id' => 'nullable|exists:directorates,id',
            'national_id' => ['nullable', 'string', 'size:11', 'regex:/^\d{11}$/', Rule::unique('users')->ignore($user->id)],
            'birth_date' => 'nullable|date',
            'governorate' => 'nullable|string|max:255',
        ], [
            'phone.unique' => 'رقم الهاتف مستخدم مسبقاً في النظام / This phone number is already registered.',
            'national_id.size' => 'الرقم الوطني يجب أن يتكون من 11 رقماً بالضبط',
            'national_id.regex' => 'الرقم الوطني يجب أن يحتوي على أرقام فقط',
            'national_id.unique' => 'الرقم الوطني مسجل مسبقاً في النظام',
        ]);

        $oldData = $user->only(['first_name', 'father_name', 'last_name', 'email', 'phone', 'role_id', 'directorate_id', 'national_id', 'birth_date', 'governorate']);

        $user->update($request->only([
            'first_name',
            'father_name',
            'last_name',
            'email',
            'phone',
            'role_id',
            'directorate_id',
            'national_id',
            'birth_date',
            'governorate',
        ]));

        $this->auditService->log($request->user(), 'user_updated', 'user', $user->id, [
            'old' => $oldData,
            'new' => $user->only(['first_name', 'father_name', 'last_name', 'email', 'phone', 'role_id', 'directorate_id', 'national_id', 'birth_date', 'governorate'])
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
            'first_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            'directorate_id' => 'nullable|exists:directorates,id',
            // 'password' generated automatically
        ]);

        $role = Role::find($request->role_id);

        $tempPassword = \Illuminate\Support\Str::random(10);

        $user = User::create([
            'first_name' => $request->first_name,
            'father_name' => $request->father_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($tempPassword),
            'role_id' => $request->role_id,
            'directorate_id' => $request->directorate_id,
            'is_active' => true,
        ]);

        $this->auditService->log($request->user(), 'user_created', 'user', $user->id, [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
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

        $rules = [
            'first_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => ['nullable', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'birth_date' => 'nullable|date',
            'governorate' => 'nullable|string|max:255',
            'password' => ['nullable', 'min:8', 'confirmed', 'regex:/[0-9]/'],
        ];

        // Require current_password when changing password
        if ($request->filled('password')) {
            $rules['current_password'] = 'required|string';
        }

        $request->validate($rules, [
            'phone.unique' => 'رقم الهاتف مستخدم مسبقاً في النظام / This phone number is already registered.',
            'password.min' => __('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
            'password.confirmed' => __('تأكيد كلمة المرور غير مطابق'),
            'password.regex' => __('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'),
            'current_password.required' => __('يجب إدخال كلمة المرور الحالية'),
        ]);

        // Verify current password before allowing change
        if ($request->filled('password')) {
            if (! Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => [__('كلمة المرور الحالية غير صحيحة')],
                ]);
            }
        }

        $oldData = $user->only(['first_name', 'father_name', 'last_name', 'phone', 'email', 'birth_date', 'governorate']);

        $updateData = [
            'first_name' => $request->first_name,
            'father_name' => $request->father_name,
            'last_name' => $request->last_name,
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
            'new' => $user->only(['first_name', 'father_name', 'last_name', 'phone', 'email', 'birth_date', 'governorate']),
            'password_changed' => $request->filled('password'),
        ]);

        $message = $request->filled('password')
            ? 'تم تحديث البيانات وكلمة المرور بنجاح'
            : 'تم تحديث البيانات بنجاح';

        return response()->json([
            'message' => $message,
            'message_en' => $request->filled('password')
                ? 'Profile and password updated successfully.'
                : 'Profile updated successfully.',
            'password_changed' => $request->filled('password'),
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

    // User: Request Email Change (T064)
    public function requestEmailChange(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['كلمة المرور الحالية غير صحيحة'],
            ]);
        }

        // Generate 6-digit OTP
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store pending email change data in cache (expires in 15 minutes)
        \Illuminate\Support\Facades\Cache::put(
            "email_change:{$user->id}",
            [
                'new_email' => $request->email,
                'code' => $code,
                'attempts' => 0,
            ],
            now()->addMinutes(15)
        );

        // Send verification code via email
        try {
            \Illuminate\Support\Facades\Mail::raw(
                "رمز التحقق لتغيير البريد الإلكتروني: {$code}\nVerification code for email change: {$code}",
                function ($message) use ($request) {
                    $message->to($request->email)
                        ->subject('رمز التحقق - Email Verification Code');
                }
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send email change verification', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        $this->auditService->log($user, 'email_change_requested', 'user', $user->id, [
            'new_email' => $request->email,
        ]);

        return response()->json([
            'message' => 'تم إرسال رمز التحقق إلى بريدك الإلكتروني الجديد',
            'message_en' => 'Verification code sent to your new email',
            'requires_verification' => true,
        ]);
    }

    // User: Verify Email Change (T065)
    public function verifyEmailChange(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $cacheKey = "email_change:{$user->id}";
        $pending = \Illuminate\Support\Facades\Cache::get($cacheKey);

        if (!$pending) {
            return response()->json([
                'message' => 'لا يوجد طلب تغيير بريد إلكتروني أو انتهت صلاحية الرمز',
                'message_en' => 'No pending email change request or code expired',
            ], 422);
        }

        // Check attempts
        if (($pending['attempts'] ?? 0) >= 5) {
            \Illuminate\Support\Facades\Cache::forget($cacheKey);
            return response()->json([
                'message' => 'تم تجاوز عدد المحاولات المسموحة. يرجى إعادة الطلب.',
                'message_en' => 'Too many attempts. Please request a new code.',
            ], 422);
        }

        if ($pending['code'] !== $request->code) {
            // Increment attempts
            $pending['attempts'] = ($pending['attempts'] ?? 0) + 1;
            \Illuminate\Support\Facades\Cache::put($cacheKey, $pending, now()->addMinutes(15));

            return response()->json([
                'message' => 'رمز التحقق غير صحيح',
                'message_en' => 'Invalid verification code',
            ], 422);
        }

        $oldEmail = $user->email;
        $user->email = $pending['new_email'];
        $user->save();

        \Illuminate\Support\Facades\Cache::forget($cacheKey);

        $this->auditService->log($user, 'email_changed', 'user', $user->id, [
            'old_email' => $oldEmail,
            'new_email' => $pending['new_email'],
        ]);

        return response()->json([
            'message' => 'تم تحديث البريد الإلكتروني بنجاح',
            'message_en' => 'Email updated successfully',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
            ],
        ]);
    }

    // Public: Register Citizen
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|min:2|max:255',
            'father_name' => 'required|string|min:2|max:255',
            'last_name' => 'required|string|min:2|max:255',
            'email' => 'required|email:rfc,dns|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',      // At least one uppercase letter
                'regex:/[a-z]/',      // At least one lowercase letter
                'regex:/[0-9]/',      // At least one number
                'regex:/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?`~]/', // At least one special character
            ],
            'national_id' => 'required|string|size:11|regex:/^\d{11}$/|unique:users,national_id',
            'phone' => 'required|string|min:7|max:20|unique:users,phone',
            'birth_date' => 'required|date|before:today',
            'governorate' => 'required|string|max:255',
            'recaptcha_token' => 'nullable|string',
        ], [
            // Name fields
            'first_name.required' => __('validation.required', ['attribute' => __('validation.attributes.first_name', [], 'ar') ?: 'الاسم الأول']),
            'first_name.min' => __('validation.min.string', ['attribute' => __('validation.attributes.first_name', [], 'ar') ?: 'الاسم الأول', 'min' => 2]),
            'father_name.required' => __('validation.required', ['attribute' => __('validation.attributes.father_name', [], 'ar') ?: 'اسم الأب']),
            'father_name.min' => __('validation.min.string', ['attribute' => __('validation.attributes.father_name', [], 'ar') ?: 'اسم الأب', 'min' => 2]),
            'last_name.required' => __('validation.required', ['attribute' => __('validation.attributes.last_name', [], 'ar') ?: 'الكنية']),
            'last_name.min' => __('validation.min.string', ['attribute' => __('validation.attributes.last_name', [], 'ar') ?: 'الكنية', 'min' => 2]),
            // Email
            'email.required' => __('validation.required', ['attribute' => __('validation.attributes.email')]),
            'email.email' => __('validation.email', ['attribute' => __('validation.attributes.email')]),
            'email.unique' => __('validation.unique', ['attribute' => __('validation.attributes.email')]),
            // Password
            'password.required' => __('validation.required', ['attribute' => __('validation.attributes.password')]),
            'password.min' => __('validation.min.string', ['attribute' => __('validation.attributes.password'), 'min' => 8]),
            'password.confirmed' => __('validation.confirmed', ['attribute' => __('validation.attributes.password')]),
            'password.regex' => __('validation.regex', ['attribute' => __('validation.attributes.password')]),
            // National ID
            'national_id.required' => 'الرقم الوطني مطلوب',
            'national_id.size' => 'الرقم الوطني يجب أن يتكون من 11 رقماً بالضبط',
            'national_id.regex' => 'الرقم الوطني يجب أن يحتوي على أرقام فقط',
            'national_id.unique' => 'الرقم الوطني مسجل مسبقاً في النظام',
            // Phone
            'phone.required' => __('validation.required', ['attribute' => __('validation.attributes.phone')]),
            'phone.min' => __('validation.min.string', ['attribute' => __('validation.attributes.phone'), 'min' => 7]),
            'phone.max' => __('validation.max.string', ['attribute' => __('validation.attributes.phone'), 'max' => 20]),
            'phone.unique' => 'رقم الهاتف مستخدم مسبقاً في النظام / This phone number is already registered.',
            // Birth date
            'birth_date.required' => __('validation.required', ['attribute' => __('validation.attributes.birth_date')]),
            'birth_date.date' => __('validation.date', ['attribute' => __('validation.attributes.birth_date')]),
            'birth_date.before' => __('validation.before', ['attribute' => __('validation.attributes.birth_date'), 'date' => 'today']),
            // Governorate
            'governorate.required' => __('validation.required', ['attribute' => __('validation.attributes.governorate')]),
        ]);

        $citizenRole = Role::where('name', 'citizen')->first();

        $user = User::create([
            'first_name' => $request->first_name,
            'father_name' => $request->father_name,
            'last_name' => $request->last_name,
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

        $this->auditService->log($user, 'registered', 'user', $user->id);

        // Generate OTP for 2FA verification
        $otp = (string) random_int(100000, 999999);
        $user->otp = Hash::make($otp);
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        Log::info("OTP sent for new user {$user->email}");
        Mail::to($user->email)->send(new TwoFactorCode($otp));

        return response()->json([
            'message' => __('auth.register_success'),
            'require_2fa' => true,
            'email' => $user->email,
        ], 201);
    }
}
