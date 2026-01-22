<?php

namespace App\Filament\Resources\SubDirectorateResource\Pages;

use App\Filament\Resources\SubDirectorateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSubDirectorates extends ListRecords
{
    protected static string $resource = SubDirectorateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
