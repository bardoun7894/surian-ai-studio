<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionalSectionResource extends JsonResource
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
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'title' => $this->getTitle(),
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'description' => $this->getDescription(),
            'button_text_ar' => $this->button_text_ar,
            'button_text_en' => $this->button_text_en,
            'button_text' => $this->getButtonText(),
            'button_url' => $this->button_url,
            'image' => $this->image_url,
            'video_url' => $this->video_url,
            'background_color' => $this->background_color,
            'icon' => $this->icon,
            'type' => $this->type,
            'type_label' => $this->type_label,
            'position' => $this->position,
            'position_label' => $this->position_label,
            'display_order' => $this->display_order,
            'is_active' => $this->is_active,
            'is_visible' => $this->isVisible(),
            'published_at' => $this->published_at,
            'expires_at' => $this->expires_at,
            'metadata' => $this->metadata,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
