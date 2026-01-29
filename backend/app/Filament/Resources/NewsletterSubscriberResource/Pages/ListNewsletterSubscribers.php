<?php

namespace App\Filament\Resources\NewsletterSubscriberResource\Pages;

use App\Filament\Resources\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use Filament\Actions;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Mail;

class ListNewsletterSubscribers extends ListRecords
{
    protected static string $resource = NewsletterSubscriberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('sendNewsletter')
                ->label('إرسال نشرة بريدية')
                ->icon('heroicon-o-paper-airplane')
                ->color('primary')
                ->form([
                    Forms\Components\TextInput::make('subject')
                        ->label('الموضوع')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\RichEditor::make('body')
                        ->label('المحتوى')
                        ->required()
                        ->columnSpanFull(),
                ])
                ->requiresConfirmation()
                ->modalHeading('إرسال نشرة بريدية')
                ->modalDescription(fn () => 'سيتم الإرسال إلى ' . NewsletterSubscriber::where('status', 'active')->count() . ' مشترك نشط')
                ->action(function (array $data) {
                    $subscribers = NewsletterSubscriber::where('status', 'active')->pluck('email');

                    foreach ($subscribers as $email) {
                        try {
                            Mail::html($data['body'], function ($message) use ($email, $data) {
                                $message->to($email)
                                    ->subject($data['subject']);
                            });
                        } catch (\Exception $e) {
                            // Log and continue
                            \Illuminate\Support\Facades\Log::error("Newsletter send failed for {$email}: {$e->getMessage()}");
                        }
                    }

                    Notification::make()
                        ->title('تم إرسال النشرة البريدية إلى ' . $subscribers->count() . ' مشترك')
                        ->success()
                        ->send();
                }),
            Actions\CreateAction::make()
                ->label('إضافة مشترك'),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            NewsletterSubscriberResource\Widgets\NewsletterStatsOverview::class,
        ];
    }
}
