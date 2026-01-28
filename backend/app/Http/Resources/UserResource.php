<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'national_id' => $this->when($request->user()?->hasRole('admin'), $this->national_id),
            'role' => $this->whenLoaded('role', fn() => [
                'id' => $this->role->id,
                'name' => $this->role->name,
                'display_name' => $this->role->display_name,
            ]),
            'directorate' => $this->whenLoaded('directorate', fn() => new DirectorateResource($this->directorate)),
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at,
            'two_factor_enabled' => (bool) $this->two_factor_secret,
            'last_login_at' => $this->last_login_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
