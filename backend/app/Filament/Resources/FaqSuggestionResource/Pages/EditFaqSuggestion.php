<?php

namespace App\Filament\Resources\FaqSuggestionResource\Pages;

use App\Filament\Resources\FaqSuggestionResource;
use App\Services\FaqSuggestionService;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Filament\Notifications\Notification;

class EditFaqSuggestion extends EditRecord
{
    protected static string $resource = FaqSuggestionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('enhance_with_ai')
                ->label('تحسين بالذكاء الاصطناعي')
                ->icon('heroicon-o-sparkles')
                ->color('info')
                ->visible(fn () => $this->record->status === 'pending')
                ->requiresConfirmation()
                ->action(function () {
                    $service = app(FaqSuggestionService::class);
                    $enhanced = $service->enhanceSuggestion($this->record);

                    // Update form with enhanced content
                    $this->form->fill([
                        'question_ar' => $enhanced['question_ar'],
                        'question_en' => $enhanced['question_en'],
                        'answer_ar' => $enhanced['answer_ar'],
                        'answer_en' => $enhanced['answer_en'],
                    ]);

                    Notification::make()
                        ->success()
                        ->title('تم التحسين')
                        ->body('تم تحسين السؤال والإجابة باستخدام الذكاء الاصطناعي')
                        ->send();
                }),

            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
