<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DirectorateResource extends JsonResource
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
            'slug' => $this->slug,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'description' => app()->getLocale() === 'ar' ? $this->description_ar : $this->description_en,
            'icon' => $this->icon,
            'color' => $this->color,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'display_order' => $this->display_order,
            'contact' => [
                'phone' => $this->phone,
                'email' => $this->email,
                'address' => $this->address,
                'website' => $this->website,
            ],
            'sub_directorates' => $this->whenLoaded('subDirectorates', fn() => SubDirectorateResource::collection($this->subDirectorates)),
            'services' => $this->whenLoaded('services', fn() => ServiceResource::collection($this->services)),
            'services_count' => $this->whenCounted('services'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
