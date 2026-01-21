<?php

namespace App\Filament\Resources\ComplaintTemplateResource\Pages;

use App\Filament\Resources\ComplaintTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditComplaintTemplate extends EditRecord
{
    protected static string $resource = ComplaintTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
