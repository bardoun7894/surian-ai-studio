<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubDirectorateResource extends JsonResource
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
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'name' => app()->getLocale() === 'ar' ? $this->name_ar : $this->name_en,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'icon' => $this->icon,
            'is_active' => $this->is_active,
            'directorate_id' => $this->directorate_id,
            'directorate' => $this->whenLoaded('directorate', fn() => new DirectorateResource($this->directorate)),
        ];
    }
}
