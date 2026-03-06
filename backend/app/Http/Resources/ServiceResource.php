<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'description' => app()->getLocale() === 'ar' ? $this->description_ar : $this->description_en,
            'icon' => $this->icon,
            'category' => $this->category,
            'is_digital' => $this->is_digital,
            'is_instant' => $this->is_instant,
            'is_active' => $this->is_active,
            'url' => $this->url,
            'requirements' => $this->requirements,
            'fees' => $this->fees,
            'estimated_time' => $this->estimated_time,
            'directorate' => $this->whenLoaded('directorate', fn() => new DirectorateResource($this->directorate)),
            'created_at' => $this->created_at,
        ];
    }
}
