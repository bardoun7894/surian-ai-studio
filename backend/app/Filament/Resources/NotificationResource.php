<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NotificationResource\Pages;
use App\Models\Notification;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkAction;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class NotificationResource extends Resource
{
    protected static ?string $model = Notification::class;

    protected static ?string $navigationIcon = 'heroicon-o-bell';

    protected static ?string $navigationGroup = 'إدارة النظام';

    protected static ?int $navigationSort = 4;

    protected static ?string $modelLabel = 'إشعار';

    protected static ?string $pluralModelLabel = 'الإشعارات';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('معلومات الإشعار')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('المستخدم')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('type')
                            ->label('النوع')
                            ->options([
                                Notification::TYPE_SYSTEM => 'إشعار نظام',
                                Notification::TYPE_COMPLAINT_NEW => 'شكوى جديدة',
                                Notification::TYPE_COMPLAINT_STATUS => 'تغيير حالة شكوى',
                                Notification::TYPE_COMPLAINT_RESPONSE => 'رد على شكوى',
                                Notification::TYPE_COMPLAINT_OVERDUE => 'شكوى متأخرة',
                                Notification::TYPE_SECURITY_ALERT => 'تنبيه أمني',
                            ])
                            ->required()
                            ->default(Notification::TYPE_SYSTEM),
                        Forms\Components\TextInput::make('title')
                            ->label('العنوان')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('body')
                            ->label('المحتوى')
                            ->required()
                            ->rows(4)
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('is_read')
                            ->label('مقروء')
                            ->default(false),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('المستخدم')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('type')
                    ->label('النوع')
                    ->colors([
                        'info' => Notification::TYPE_SYSTEM,
                        'primary' => Notification::TYPE_COMPLAINT_NEW,
                        'warning' => Notification::TYPE_COMPLAINT_STATUS,
                        'success' => Notification::TYPE_COMPLAINT_RESPONSE,
                        'danger' => Notification::TYPE_COMPLAINT_OVERDUE,
                        'danger' => Notification::TYPE_SECURITY_ALERT,
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        Notification::TYPE_SYSTEM => 'نظام',
                        Notification::TYPE_COMPLAINT_NEW => 'شكوى جديدة',
                        Notification::TYPE_COMPLAINT_STATUS => 'تغيير حالة',
                        Notification::TYPE_COMPLAINT_RESPONSE => 'رد',
                        Notification::TYPE_COMPLAINT_OVERDUE => 'متأخرة',
                        Notification::TYPE_SECURITY_ALERT => 'أمني',
                        default => $state,
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('title')
                    ->label('العنوان')
                    ->searchable()
                    ->limit(50),
                Tables\Columns\IconColumn::make('is_read')
                    ->label('مقروء')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('التاريخ')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('النوع')
                    ->options([
                        Notification::TYPE_SYSTEM => 'نظام',
                        Notification::TYPE_COMPLAINT_NEW => 'شكوى جديدة',
                        Notification::TYPE_COMPLAINT_STATUS => 'تغيير حالة',
                        Notification::TYPE_COMPLAINT_RESPONSE => 'رد',
                        Notification::TYPE_COMPLAINT_OVERDUE => 'متأخرة',
                        Notification::TYPE_SECURITY_ALERT => 'أمني',
                    ]),
                Tables\Filters\TernaryFilter::make('is_read')
                    ->label('مقروء'),
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('المستخدم')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Action::make('markRead')
                    ->label('تعيين كمقروء')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn ($record) => !$record->is_read)
                    ->action(function ($record) {
                        $record->markAsRead();
                        FilamentNotification::make()->title('تم التعيين كمقروء')->success()->send();
                    }),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    BulkAction::make('markAllRead')
                        ->label('تعيين الكل كمقروء')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->action(function (Collection $records) {
                            $records->each(fn ($r) => $r->markAsRead());
                            FilamentNotification::make()->title('تم تعيين ' . $records->count() . ' إشعار كمقروء')->success()->send();
                        }),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNotifications::route('/'),
            'create' => Pages\CreateNotification::route('/create'),
            'view' => Pages\ViewNotification::route('/{record}'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::where('is_read', false)->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }
}
