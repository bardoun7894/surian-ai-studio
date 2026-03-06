<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComplaintStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Staff/Admin authorization checked via middleware
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                Rule::in(['new', 'received', 'in_progress', 'resolved', 'rejected', 'closed']),
            ],
            'internal_note' => 'nullable|string|max:2000',
            'response_to_user' => 'nullable|string|max:2000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'حالة الشكوى مطلوبة',
            'status.in' => 'حالة الشكوى غير صالحة',
        ];
    }
}
