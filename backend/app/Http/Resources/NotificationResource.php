<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'data' => $this->data,
            'title' => $this->data['title'] ?? null,
            'message' => $this->data['message'] ?? $this->data['body'] ?? null,
            'action_url' => $this->data['action_url'] ?? null,
            'read_at' => $this->read_at,
            'is_read' => (bool) $this->read_at,
            'created_at' => $this->created_at,
        ];
    }

    /**
     * Get type label in Arabic.
     */
    private function getTypeLabel(): string
    {
        $type = str_replace('App\\Notifications\\', '', $this->type);

        return match ($type) {
            'ComplaintStatusChanged' => 'تحديث شكوى',
            'SuggestionStatusChanged' => 'تحديث مقترح',
            'NewComplaintAssigned' => 'شكوى جديدة',
            'SystemNotification' => 'إشعار نظام',
            default => 'إشعار',
        };
    }
}
