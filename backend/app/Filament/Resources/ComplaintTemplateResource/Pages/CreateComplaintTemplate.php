<?php

namespace App\Filament\Resources\ComplaintTemplateResource\Pages;

use App\Filament\Resources\ComplaintTemplateResource;
use Filament\Resources\Pages\CreateRecord;

class CreateComplaintTemplate extends CreateRecord
{
    protected static string $resource = ComplaintTemplateResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
