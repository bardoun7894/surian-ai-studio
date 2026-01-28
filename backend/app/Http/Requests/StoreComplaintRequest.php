<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
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
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'father_name' => 'nullable|string|max:100',
            'national_id' => 'required|string|size:11|regex:/^[0-9]+$/',
            'dob' => 'nullable|date|before:today',
            'phone' => 'required|string|regex:/^09[0-9]{8}$/',
            'email' => 'nullable|email|max:255',
            'directorate_id' => 'nullable|exists:directorates,id',
            'subject' => 'required|string|max:500',
            'body' => 'required|string|min:20|max:5000',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'otp_verified' => 'nullable|boolean',
            'recaptcha_token' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'الاسم الأول مطلوب',
            'last_name.required' => 'الاسم الأخير مطلوب',
            'national_id.required' => 'الرقم الوطني مطلوب',
            'national_id.size' => 'الرقم الوطني يجب أن يكون 11 خانة',
            'national_id.regex' => 'الرقم الوطني يجب أن يحتوي على أرقام فقط',
            'phone.required' => 'رقم الهاتف مطلوب',
            'phone.regex' => 'رقم الهاتف يجب أن يبدأ بـ 09 ويتكون من 10 أرقام',
            'subject.required' => 'موضوع الشكوى مطلوب',
            'body.required' => 'تفاصيل الشكوى مطلوبة',
            'body.min' => 'تفاصيل الشكوى يجب أن تكون 20 حرفاً على الأقل',
            'attachments.max' => 'الحد الأقصى للمرفقات هو 5 ملفات',
            'attachments.*.max' => 'حجم الملف يجب ألا يتجاوز 5 ميغابايت',
            'attachments.*.mimes' => 'صيغة الملف غير مدعومة',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'الاسم الأول',
            'last_name' => 'الاسم الأخير',
            'father_name' => 'اسم الأب',
            'national_id' => 'الرقم الوطني',
            'dob' => 'تاريخ الميلاد',
            'phone' => 'رقم الهاتف',
            'email' => 'البريد الإلكتروني',
            'directorate_id' => 'الجهة',
            'subject' => 'الموضوع',
            'body' => 'التفاصيل',
            'attachments' => 'المرفقات',
        ];
    }
}
