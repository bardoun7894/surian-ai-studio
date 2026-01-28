<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePromotionalSectionRequest extends FormRequest
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
        return [
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string|max:1000',
            'description_en' => 'nullable|string|max:1000',
            'button_text_ar' => 'nullable|string|max:100',
            'button_text_en' => 'nullable|string|max:100',
            'button_url' => 'nullable|string|max:500',
            'image' => 'nullable|string|max:500',
            'video_url' => 'nullable|url|max:500',
            'background_color' => 'nullable|string|max:20|regex:/^#[0-9A-Fa-f]{6}$/',
            'icon' => 'nullable|string|max:100',
            'type' => [
                'required',
                Rule::in(['banner', 'video', 'promo', 'stats']),
            ],
            'position' => [
                'required',
                Rule::in(['hero', 'grid_main', 'grid_side', 'grid_bottom']),
            ],
            'display_order' => 'integer|min:0',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
            'metadata' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title_ar.required' => 'العنوان بالعربية مطلوب',
            'title_en.required' => 'العنوان بالإنجليزية مطلوب',
            'type.required' => 'النوع مطلوب',
            'type.in' => 'النوع غير صالح',
            'position.required' => 'الموقع مطلوب',
            'position.in' => 'الموقع غير صالح',
            'background_color.regex' => 'لون الخلفية يجب أن يكون بصيغة HEX (مثال: #1a4d3e)',
            'video_url.url' => 'رابط الفيديو غير صالح',
        ];
    }
}
