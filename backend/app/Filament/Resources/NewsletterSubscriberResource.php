<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterSubscriberResource\Pages;
use App\Models\NewsletterSubscriber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Filament\Notifications\Notification;

class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationGroup = 'إدارة المحتوى';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'مشترك النشرة البريدية';

    protected static ?string $pluralModelLabel = 'مشتركو النشرة البريدية';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('معلومات المشترك')
                    ->schema([
                        Forms\Components\TextInput::make('email')
                            ->label('البريد الإلكتروني')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\Select::make('status')
                            ->label('الحالة')
                            ->options([
                                'active' => 'نشط',
                                'unsubscribed' => 'ألغى الاشتراك',
                            ])
                            ->required()
                            ->default('active'),
                        Forms\Components\DateTimePicker::make('subscribed_at')
                            ->label('تاريخ الاشتراك')
                            ->default(now()),
                        Forms\Components\DateTimePicker::make('unsubscribed_at')
                            ->label('تاريخ إلغاء الاشتراك')
                            ->visible(fn ($record) => $record?->status === 'unsubscribed'),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->label('البريد الإلكتروني')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('الحالة')
                    ->colors([
                        'success' => 'active',
                        'danger' => 'unsubscribed',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'active' => 'نشط',
                        'unsubscribed' => 'ألغى الاشتراك',
                        default => $state,
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('subscribed_at')
                    ->label('تاريخ الاشتراك')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('unsubscribed_at')
                    ->label('تاريخ الإلغاء')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->placeholder('-')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('تاريخ الإنشاء')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('الحالة')
                    ->options([
                        'active' => 'نشط',
                        'unsubscribed' => 'ألغى الاشتراك',
                    ]),
                Tables\Filters\Filter::make('subscribed_this_month')
                    ->label('اشتراكات هذا الشهر')
                    ->query(fn (Builder $query): Builder => $query
                        ->whereMonth('subscribed_at', now()->month)
                        ->whereYear('subscribed_at', now()->year)),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Action::make('resubscribe')
                    ->label('إعادة الاشتراك')
                    ->icon('heroicon-o-arrow-path')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'unsubscribed')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->subscribe();
                        Notification::make()
                            ->title('تم إعادة الاشتراك بنجاح')
                            ->success()
                            ->send();
                    }),
                Action::make('unsubscribe')
                    ->label('إلغاء الاشتراك')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'active')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->unsubscribe();
                        Notification::make()
                            ->title('تم إلغاء الاشتراك')
                            ->warning()
                            ->send();
                    }),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    BulkAction::make('bulkUnsubscribe')
                        ->label('إلغاء اشتراك المحدد')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function (Collection $records) {
                            $records->each(fn ($record) => $record->unsubscribe());
                            Notification::make()
                                ->title('تم إلغاء اشتراك ' . $records->count() . ' مشترك')
                                ->success()
                                ->send();
                        }),
                    BulkAction::make('bulkResubscribe')
                        ->label('إعادة اشتراك المحدد')
                        ->icon('heroicon-o-arrow-path')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (Collection $records) {
                            $records->each(fn ($record) => $record->subscribe());
                            Notification::make()
                                ->title('تم إعادة اشتراك ' . $records->count() . ' مشترك')
                                ->success()
                                ->send();
                        }),
                ]),
            ])
            ->headerActions([
                Tables\Actions\Action::make('export')
                    ->label('تصدير CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->action(function () {
                        return response()->streamDownload(function () {
                            $subscribers = NewsletterSubscriber::orderBy('subscribed_at', 'desc')->get();

                            echo "Email,Status,Subscribed At,Unsubscribed At\n";

                            foreach ($subscribers as $subscriber) {
                                echo sprintf(
                                    "%s,%s,%s,%s\n",
                                    $subscriber->email,
                                    $subscriber->status,
                                    $subscriber->subscribed_at?->format('Y-m-d H:i:s') ?? '',
                                    $subscriber->unsubscribed_at?->format('Y-m-d H:i:s') ?? ''
                                );
                            }
                        }, 'newsletter_subscribers_' . date('Y-m-d') . '.csv');
                    }),
            ])
            ->defaultSort('subscribed_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterSubscribers::route('/'),
            'create' => Pages\CreateNewsletterSubscriber::route('/create'),
            'view' => Pages\ViewNewsletterSubscriber::route('/{record}'),
            'edit' => Pages\EditNewsletterSubscriber::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'active')->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }

    public static function getWidgets(): array
    {
        return [
            NewsletterSubscriberResource\Widgets\NewsletterStatsOverview::class,
        ];
    }
}
