<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;

class AuditService
{
    public function log($user, string $action, ?string $entityType = null, ?int $entityId = null, ?array $changes = null): AuditLog
    {
        return AuditLog::create([
            'user_id' => $user ? $user->id : null,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'changes' => $changes,
            'ip_address' => Request::ip(),
        ]);
    }
}
