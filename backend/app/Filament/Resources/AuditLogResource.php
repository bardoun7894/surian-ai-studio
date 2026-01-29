<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AuditLogResource\Pages;
use App\Models\AuditLog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Illuminate\Database\Eloquent\Builder;

class AuditLogResource extends Resource
{
    protected static ?string $model = AuditLog::class;

    public static function canViewAny(): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('audit.view') || $user?->hasPermission('audit.*') || $user?->hasRole('super_admin');
    }

    public static function canEdit($record): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $navigationGroup = 'التقارير وسجلات التدقيق';

    protected static ?int $navigationSort = 10;

    protected static ?string $modelLabel = 'سجل التدقيق';

    protected static ?string $pluralModelLabel = 'سجلات التدقيق';

    // Disable create - this is a read-only resource
    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('معلومات السجل')
                    ->schema([
                        Forms\Components\TextInput::make('action')
                            ->label('الإجراء')
                            ->disabled(),
                        Forms\Components\TextInput::make('entity_type')
                            ->label('نوع الكيان')
                            ->disabled(),
                        Forms\Components\TextInput::make('entity_id')
                            ->label('معرف الكيان')
                            ->disabled(),
                        Forms\Components\TextInput::make('ip_address')
                            ->label('عنوان IP')
                            ->disabled(),
                        Forms\Components\Select::make('user_id')
                            ->label('المستخدم')
                            ->relationship('user', 'name')
                            ->disabled(),
                        Forms\Components\DateTimePicker::make('created_at')
                            ->label('التاريخ')
                            ->disabled(),
                    ])
                    ->columns(2),
                Forms\Components\Section::make('التغييرات')
                    ->schema([
                        Forms\Components\KeyValue::make('changes')
                            ->label('البيانات المتغيرة')
                            ->disabled()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('معلومات السجل')
                    ->schema([
                        Infolists\Components\TextEntry::make('action')
                            ->label('الإجراء')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'created' => 'success',
                                'updated' => 'warning',
                                'deleted' => 'danger',
                                'login' => 'info',
                                'logout' => 'gray',
                                default => 'primary',
                            }),
                        Infolists\Components\TextEntry::make('entity_type')
                            ->label('نوع الكيان')
                            ->formatStateUsing(fn ($state) => class_basename($state)),
                        Infolists\Components\TextEntry::make('entity_id')
                            ->label('معرف الكيان'),
                        Infolists\Components\TextEntry::make('user.name')
                            ->label('المستخدم')
                            ->default('نظام'),
                        Infolists\Components\TextEntry::make('ip_address')
                            ->label('عنوان IP')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('التاريخ والوقت')
                            ->dateTime('Y-m-d H:i:s'),
                    ])
                    ->columns(3),
                Infolists\Components\Section::make('التغييرات')
                    ->schema([
                        Infolists\Components\KeyValueEntry::make('changes')
                            ->label('')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('التاريخ')
                    ->dateTime('Y-m-d H:i:s')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('المستخدم')
                    ->searchable()
                    ->sortable()
                    ->default('نظام'),
                Tables\Columns\BadgeColumn::make('action')
                    ->label('الإجراء')
                    ->colors([
                        'success' => 'created',
                        'warning' => 'updated',
                        'danger' => 'deleted',
                        'info' => 'login',
                        'gray' => 'logout',
                    ])
                    ->sortable(),
                Tables\Columns\TextColumn::make('entity_type')
                    ->label('نوع الكيان')
                    ->formatStateUsing(fn ($state) => class_basename($state))
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('entity_id')
                    ->label('معرف الكيان')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('عنوان IP')
                    ->searchable()
                    ->toggleable()
                    ->copyable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('action')
                    ->label('الإجراء')
                    ->options([
                        'created' => 'إنشاء',
                        'updated' => 'تحديث',
                        'deleted' => 'حذف',
                        'login' => 'تسجيل دخول',
                        'logout' => 'تسجيل خروج',
                    ]),
                Tables\Filters\SelectFilter::make('entity_type')
                    ->label('نوع الكيان')
                    ->options(function () {
                        return AuditLog::select('entity_type')
                            ->distinct()
                            ->pluck('entity_type', 'entity_type')
                            ->mapWithKeys(fn ($value, $key) => [$key => class_basename($value)]);
                    }),
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('المستخدم')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')
                            ->label('من تاريخ'),
                        Forms\Components\DatePicker::make('until')
                            ->label('إلى تاريخ'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                // No bulk actions - read only
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListAuditLogs::route('/'),
            'view' => Pages\ViewAuditLog::route('/{record}'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        $todayCount = static::getModel()::whereDate('created_at', today())->count();
        return $todayCount > 0 ? (string) $todayCount : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
    }
}
