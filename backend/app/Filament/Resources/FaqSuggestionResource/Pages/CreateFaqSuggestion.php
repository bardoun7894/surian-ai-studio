<?php

namespace App\Filament\Resources\FaqSuggestionResource\Pages;

use App\Filament\Resources\FaqSuggestionResource;
use Filament\Resources\Pages\CreateRecord;

class CreateFaqSuggestion extends CreateRecord
{
    protected static string $resource = FaqSuggestionResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
