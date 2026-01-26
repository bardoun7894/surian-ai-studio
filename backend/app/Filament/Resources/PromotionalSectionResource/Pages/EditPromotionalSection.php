<?php

namespace App\Filament\Resources\PromotionalSectionResource\Pages;

use App\Filament\Resources\PromotionalSectionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPromotionalSection extends EditRecord
{
    protected static string $resource = PromotionalSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
            Actions\RestoreAction::make(),
            Actions\ForceDeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
