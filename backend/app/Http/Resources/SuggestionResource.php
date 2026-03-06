<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SuggestionResource extends JsonResource
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
            'tracking_number' => $this->tracking_number,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'submitter' => [
                'name' => $this->name,
                'email' => $this->when($request->user(), $this->email),
                'phone' => $this->when($request->user(), $this->phone),
            ],
            'directorate' => $this->whenLoaded('directorate', fn() => new DirectorateResource($this->directorate)),
            'attachments' => $this->whenLoaded('attachments', fn() => SuggestionAttachmentResource::collection($this->attachments)),
            'admin_notes' => $this->when($request->user()?->hasRole('admin'), $this->admin_notes),
            'reviewed_by' => $this->whenLoaded('reviewedBy', fn() => new UserResource($this->reviewedBy)),
            'reviewed_at' => $this->reviewed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get status label in Arabic.
     */
    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'قيد المراجعة',
            'under_review' => 'قيد الدراسة',
            'approved' => 'مقبول',
            'rejected' => 'مرفوض',
            'implemented' => 'تم التنفيذ',
            default => $this->status,
        };
    }
}
