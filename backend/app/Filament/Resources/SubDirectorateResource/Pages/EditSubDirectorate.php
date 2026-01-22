<?php

namespace App\Filament\Resources\SubDirectorateResource\Pages;

use App\Filament\Resources\SubDirectorateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSubDirectorate extends EditRecord
{
    protected static string $resource = SubDirectorateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
