<?php

namespace App\Filament\Resources\PromotionalSectionResource\Pages;

use App\Filament\Resources\PromotionalSectionResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePromotionalSection extends CreateRecord
{
    protected static string $resource = PromotionalSectionResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
