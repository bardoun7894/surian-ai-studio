<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSuggestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|regex:/^09[0-9]{8}$/',
            'directorate_id' => 'nullable|exists:directorates,id',
            'title' => 'required|string|max:500',
            'description' => 'required|string|min:20|max:5000',
            'attachments' => 'nullable|array|max:3',
            'attachments.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'recaptcha_token' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'الاسم مطلوب',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'phone.regex' => 'رقم الهاتف يجب أن يبدأ بـ 09',
            'title.required' => 'عنوان المقترح مطلوب',
            'description.required' => 'وصف المقترح مطلوب',
            'description.min' => 'وصف المقترح يجب أن يكون 20 حرفاً على الأقل',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'الاسم',
            'email' => 'البريد الإلكتروني',
            'phone' => 'رقم الهاتف',
            'directorate_id' => 'الجهة',
            'title' => 'العنوان',
            'description' => 'الوصف',
            'attachments' => 'المرفقات',
        ];
    }
}
