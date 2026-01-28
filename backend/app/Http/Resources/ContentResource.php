<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'type_label' => $this->getTypeLabel(),
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'title' => app()->getLocale() === 'ar' ? $this->title_ar : $this->title_en,
            'body_ar' => $this->body_ar,
            'body_en' => $this->body_en,
            'body' => app()->getLocale() === 'ar' ? $this->body_ar : $this->body_en,
            'excerpt_ar' => $this->excerpt_ar,
            'excerpt_en' => $this->excerpt_en,
            'excerpt' => app()->getLocale() === 'ar' ? $this->excerpt_ar : $this->excerpt_en,
            'slug' => $this->slug,
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'tags' => $this->tags,
            'is_published' => $this->is_published,
            'is_featured' => $this->is_featured,
            'is_breaking' => $this->is_breaking,
            'published_at' => $this->published_at,
            'expires_at' => $this->expires_at,
            // Decree-specific fields
            'decree_number' => $this->decree_number,
            'decree_year' => $this->decree_year,
            'decree_date' => $this->decree_date,
            'pdf_url' => $this->pdf_url,
            'directorate' => $this->whenLoaded('directorate', fn() => new DirectorateResource($this->directorate)),
            'author' => $this->whenLoaded('author', fn() => new UserResource($this->author)),
            'attachments' => $this->whenLoaded('attachments', fn() => ContentAttachmentResource::collection($this->attachments)),
            'versions_count' => $this->whenCounted('versions'),
            'views_count' => $this->views_count ?? 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get type label in Arabic.
     */
    private function getTypeLabel(): string
    {
        return match ($this->type) {
            'news' => 'خبر',
            'announcement' => 'إعلان',
            'decree' => 'مرسوم',
            'circular' => 'تعميم',
            'law' => 'قانون',
            default => $this->type,
        };
    }
}
