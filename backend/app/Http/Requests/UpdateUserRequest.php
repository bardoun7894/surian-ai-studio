<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'first_name' => 'sometimes|required|string|max:255',
            'father_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => "sometimes|required|email|unique:users,email,{$userId}|max:255",
            'phone' => "nullable|string|regex:/^09[0-9]{8}$/|unique:users,phone,{$userId}",
            'national_id' => "nullable|string|size:11|unique:users,national_id,{$userId}",
            'password' => ['nullable', 'confirmed', Password::min(8)->letters()->numbers()],
            'role_id' => 'sometimes|required|exists:roles,id',
            'directorate_id' => 'nullable|exists:directorates,id',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'الاسم الأول مطلوب',
            'father_name.required' => 'اسم الأب مطلوب',
            'last_name.required' => 'الكنية مطلوبة',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.unique' => 'البريد الإلكتروني مستخدم مسبقاً',
            'phone.unique' => 'رقم الهاتف مستخدم مسبقاً',
            'national_id.unique' => 'الرقم الوطني مستخدم مسبقاً',
            'password.confirmed' => 'تأكيد كلمة المرور غير متطابق',
        ];
    }
}
