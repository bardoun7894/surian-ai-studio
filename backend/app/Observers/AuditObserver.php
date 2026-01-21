<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditObserver
{
    public function created(Model $model): void
    {
        $this->log($model, 'created', $model->getAttributes());
    }

    public function updated(Model $model): void
    {
        $this->log($model, 'updated', $model->getChanges());
    }

    public function deleted(Model $model): void
    {
        $this->log($model, 'deleted', $model->getAttributes());
    }

    protected function log(Model $model, string $action, array $changes): void
    {
        // Don't audit AuditLog itself
        if ($model instanceof AuditLog) {
            return;
        }

        $user = Auth::user();

        AuditLog::create([
            'user_id' => $user ? $user->id : null,
            'action' => $action,
            'entity_type' => get_class($model),
            'entity_id' => $model->getKey(),
            'changes' => $changes,
            'ip_address' => Request::ip(),
        ]);
    }
}
