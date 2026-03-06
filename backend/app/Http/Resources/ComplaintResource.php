<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
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
            'subject' => $this->subject,
            'body' => $this->body,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'priority' => $this->priority,
            'priority_label' => $this->getPriorityLabel(),
            'category' => $this->category,
            'ai_classification' => $this->when($request->user()?->hasRole('admin'), $this->ai_classification),
            'complainant' => [
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'father_name' => $this->father_name,
                'national_id' => $this->when($request->user(), $this->national_id),
                'phone' => $this->when($request->user(), $this->phone),
                'email' => $this->when($request->user(), $this->email),
            ],
            'directorate' => $this->whenLoaded('directorate', fn() => new DirectorateResource($this->directorate)),
            'attachments' => $this->whenLoaded('attachments', fn() => ComplaintAttachmentResource::collection($this->attachments)),
            'responses' => $this->whenLoaded('responses', fn() => ComplaintResponseResource::collection($this->responses)),
            'is_snoozed' => $this->isSnoozed(),
            'snoozed_until' => $this->snoozed_until,
            'user_rating' => $this->user_rating,
            'user_feedback' => $this->user_feedback,
            'can_be_rated' => $this->canBeRated(),
            'assigned_to' => $this->whenLoaded('assignedTo', fn() => new UserResource($this->assignedTo)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'resolved_at' => $this->resolved_at,
        ];
    }

    /**
     * Get status label in Arabic.
     */
    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'new' => 'جديد',
            'received' => 'تم الاستلام',
            'in_progress' => 'قيد المعالجة',
            'resolved' => 'تم الحل',
            'rejected' => 'مرفوض',
            'closed' => 'مغلق',
            default => $this->status,
        };
    }

    /**
     * Get priority label in Arabic.
     */
    private function getPriorityLabel(): string
    {
        return match ($this->priority) {
            'low' => 'منخفض',
            'medium' => 'متوسط',
            'high' => 'عالي',
            'urgent' => 'عاجل',
            default => $this->priority ?? 'متوسط',
        };
    }
}
