<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ComplaintTemplateResource\Pages;
use App\Models\ComplaintTemplate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ComplaintTemplateResource extends Resource
{
    protected static ?string $model = ComplaintTemplate::class;

    public static function canViewAny(): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('complaints.view') || $user?->hasPermission('complaints.*') || $user?->hasRole('super_admin');
    }

    public static function canCreate(): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('complaints.manage') || $user?->hasPermission('complaints.*') || $user?->hasRole('super_admin');
    }

    public static function canEdit($record): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('complaints.manage') || $user?->hasPermission('complaints.*') || $user?->hasRole('super_admin');
    }

    public static function canDelete($record): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('complaints.manage') || $user?->hasPermission('complaints.*') || $user?->hasRole('super_admin');
    }

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'الشكاوى';

    protected static ?string $navigationLabel = 'قوالب الشكاوى';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('معلومات القالب')
                    ->schema([
                        Forms\Components\TextInput::make('name_ar')
                            ->label('الاسم (عربي)')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('name_en')
                            ->label('الاسم (إنجليزي)')
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('description_ar')
                            ->label('الوصف (عربي)')
                            ->rows(3)
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('description_en')
                            ->label('الوصف (إنجليزي)')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('حقول القالب')
                    ->schema([
                        Forms\Components\KeyValue::make('fields')
                            ->label('الحقول المخصصة')
                            ->keyLabel('اسم الحقل')
                            ->valueLabel('النوع (text/textarea/select/file)')
                            ->reorderable()
                            ->addButtonLabel('إضافة حقل')
                            ->columnSpanFull()
                            ->helperText('أضف حقول مخصصة لهذا القالب (مثل: رقم الهوية, تاريخ الحادثة, إلخ)'),
                    ]),

                Forms\Components\Section::make('الإعدادات')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('مفعّل')
                            ->required()
                            ->default(true)
                            ->helperText('عند التعطيل، لن يظهر القالب للمستخدمين'),

                        Forms\Components\Toggle::make('requires_attachments')
                            ->label('يتطلب مرفقات')
                            ->default(false)
                            ->helperText('حدد إذا كانت هذه الشكوى تتطلب مرفقات إلزامية'),

                        Forms\Components\TextInput::make('display_order')
                            ->label('ترتيب العرض')
                            ->numeric()
                            ->default(0)
                            ->helperText('ترتيب ظهور القالب في القائمة (الأقل أولاً)'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('معلومات إضافية')
                    ->schema([
                        Forms\Components\Placeholder::make('created_at')
                            ->label('تاريخ الإنشاء')
                            ->content(fn (?ComplaintTemplate $record): string => $record ? $record->created_at->format('Y-m-d H:i:s') : '-'),

                        Forms\Components\Placeholder::make('updated_at')
                            ->label('آخر تحديث')
                            ->content(fn (?ComplaintTemplate $record): string => $record ? $record->updated_at->format('Y-m-d H:i:s') : '-'),
                    ])
                    ->columns(2)
                    ->visibleOn('edit'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name_ar')
                    ->label('الاسم')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('name_en')
                    ->label('Name')
                    ->searchable()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('description_ar')
                    ->label('الوصف')
                    ->limit(50)
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('الحالة')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),

                Tables\Columns\IconColumn::make('requires_attachments')
                    ->label('يتطلب مرفقات')
                    ->boolean()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('display_order')
                    ->label('الترتيب')
                    ->sortable()
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('complaints_count')
                    ->label('عدد الشكاوى')
                    ->counts('complaints')
                    ->sortable()
                    ->alignCenter()
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('تاريخ الإنشاء')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('آخر تحديث')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('display_order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('الحالة')
                    ->placeholder('الكل')
                    ->trueLabel('مفعّل')
                    ->falseLabel('معطّل'),

                Tables\Filters\TernaryFilter::make('requires_attachments')
                    ->label('يتطلب مرفقات')
                    ->placeholder('الكل')
                    ->trueLabel('نعم')
                    ->falseLabel('لا'),

                Tables\Filters\TrashedFilter::make()
                    ->label('المؤرشف')
                    ->placeholder('بدون مؤرشف')
                    ->trueLabel('المؤرشف فقط')
                    ->falseLabel('الكل'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),

                Tables\Actions\DeleteAction::make()
                    ->label('أرشفة')
                    ->modalHeading('أرشفة القالب')
                    ->successNotificationTitle('تم أرشفة القالب'),

                Tables\Actions\RestoreAction::make()
                    ->label('استعادة')
                    ->successNotificationTitle('تم استعادة القالب'),

                Tables\Actions\ForceDeleteAction::make()
                    ->label('حذف نهائي')
                    ->modalHeading('حذف القالب نهائياً')
                    ->successNotificationTitle('تم حذف القالب نهائياً'),

                Tables\Actions\Action::make('toggle_status')
                    ->label(fn (ComplaintTemplate $record) => $record->is_active ? 'تعطيل' : 'تفعيل')
                    ->icon(fn (ComplaintTemplate $record) => $record->is_active ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle')
                    ->color(fn (ComplaintTemplate $record) => $record->is_active ? 'danger' : 'success')
                    ->requiresConfirmation()
                    ->action(function (ComplaintTemplate $record) {
                        $record->is_active = !$record->is_active;
                        $record->save();
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->label('أرشفة المحدد')
                        ->modalHeading('أرشفة القوالب المحددة')
                        ->successNotificationTitle('تم أرشفة القوالب'),

                    Tables\Actions\RestoreBulkAction::make()
                        ->label('استعادة المحدد')
                        ->successNotificationTitle('تم استعادة القوالب'),

                    Tables\Actions\ForceDeleteBulkAction::make()
                        ->label('حذف نهائي للمحدد')
                        ->modalHeading('حذف القوالب نهائياً')
                        ->successNotificationTitle('تم حذف القوالب نهائياً'),

                    Tables\Actions\BulkAction::make('activate')
                        ->label('تفعيل المحدد')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each->update(['is_active' => true]);
                        }),

                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('تعطيل المحدد')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each->update(['is_active' => false]);
                        }),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListComplaintTemplates::route('/'),
            'create' => Pages\CreateComplaintTemplate::route('/create'),
            'edit' => Pages\EditComplaintTemplate::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_active', true)->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
