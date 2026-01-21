<?php

namespace App\Filament\Resources\ComplaintTemplateResource\Pages;

use App\Filament\Resources\ComplaintTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListComplaintTemplates extends ListRecords
{
    protected static string $resource = ComplaintTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('قالب جديد'),
        ];
    }
}
