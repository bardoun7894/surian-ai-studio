<?php

namespace App\Filament\Resources\FaqSuggestionResource\Pages;

use App\Filament\Resources\FaqSuggestionResource;
use App\Services\FaqSuggestionService;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Notifications\Notification;

class ListFaqSuggestions extends ListRecords
{
    protected static string $resource = FaqSuggestionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('analyze_conversations')
                ->label('تحليل المحادثات')
                ->icon('heroicon-o-magnifying-glass')
                ->color('info')
                ->requiresConfirmation()
                ->modalHeading('تحليل محادثات المساعد الذكي')
                ->modalDescription('سيقوم النظام بتحليل المحادثات الأخيرة واستخراج اقتراحات للأسئلة الشائعة')
                ->form([
                    \Filament\Forms\Components\TextInput::make('hours')
                        ->label('عدد الساعات للرجوع')
                        ->numeric()
                        ->default(24)
                        ->required()
                        ->minValue(1)
                        ->maxValue(168),
                ])
                ->action(function (array $data) {
                    $service = app(FaqSuggestionService::class);
                    $result = $service->analyzeConversations((int) $data['hours']);

                    Notification::make()
                        ->success()
                        ->title('اكتمل التحليل')
                        ->body("تم تحليل {$result['analyzed']} محادثة وإنشاء {$result['suggestions']} اقتراح جديد")
                        ->send();
                }),

            Actions\CreateAction::make()
                ->label('اقتراح يدوي'),
        ];
    }
}
