<?php

namespace App\Filament\Resources\PromotionalSectionResource\Pages;

use App\Filament\Resources\PromotionalSectionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPromotionalSections extends ListRecords
{
    protected static string $resource = PromotionalSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
