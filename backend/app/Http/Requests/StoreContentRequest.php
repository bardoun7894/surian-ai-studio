<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->hasRole('admin') || $this->user()->hasRole('staff'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'type' => [
                'required',
                Rule::in(['news', 'announcement', 'decree', 'circular', 'law']),
            ],
            'title_ar' => 'required|string|max:500',
            'title_en' => 'nullable|string|max:500',
            'body_ar' => 'required|string',
            'body_en' => 'nullable|string',
            'excerpt_ar' => 'nullable|string|max:500',
            'excerpt_en' => 'nullable|string|max:500',
            'directorate_id' => 'nullable|exists:directorates,id',
            'featured_image' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'is_breaking' => 'boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
            'metadata' => 'nullable|array',
            // Decree-specific fields
            'decree_number' => 'nullable|string|max:50',
            'decree_year' => 'nullable|integer|min:1900|max:2100',
            'decree_date' => 'nullable|date',
            'pdf_url' => 'nullable|url|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'type.required' => 'نوع المحتوى مطلوب',
            'type.in' => 'نوع المحتوى غير صالح',
            'title_ar.required' => 'العنوان بالعربية مطلوب',
            'body_ar.required' => 'المحتوى بالعربية مطلوب',
            'expires_at.after' => 'تاريخ الانتهاء يجب أن يكون بعد تاريخ النشر',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'type' => 'النوع',
            'title_ar' => 'العنوان بالعربية',
            'title_en' => 'العنوان بالإنجليزية',
            'body_ar' => 'المحتوى بالعربية',
            'body_en' => 'المحتوى بالإنجليزية',
            'directorate_id' => 'الجهة',
            'published_at' => 'تاريخ النشر',
            'expires_at' => 'تاريخ الانتهاء',
        ];
    }
}
