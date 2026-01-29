<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FaqSuggestionResource\Pages;
use App\Models\FaqSuggestion;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class FaqSuggestionResource extends Resource
{
    protected static ?string $model = FaqSuggestion::class;

    public static function canViewAny(): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('faq.view') || $user?->hasPermission('faq.*') || $user?->hasRole('super_admin');
    }

    public static function canCreate(): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('faq.manage') || $user?->hasPermission('faq.*') || $user?->hasRole('super_admin');
    }

    public static function canEdit($record): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('faq.manage') || $user?->hasPermission('faq.*') || $user?->hasRole('super_admin');
    }

    public static function canDelete($record): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('faq.manage') || $user?->hasPermission('faq.*') || $user?->hasRole('super_admin');
    }

    protected static ?string $navigationIcon = 'heroicon-o-light-bulb';

    protected static ?string $navigationGroup = 'المساعد الذكي';

    protected static ?string $navigationLabel = 'اقتراحات الأسئلة الشائعة';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('السؤال')
                    ->schema([
                        Forms\Components\Textarea::make('question_ar')
                            ->label('السؤال (عربي)')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('question_en')
                            ->label('السؤال (إنجليزي)')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('الإجابة')
                    ->schema([
                        Forms\Components\Textarea::make('answer_ar')
                            ->label('الإجابة (عربي)')
                            ->required()
                            ->rows(5)
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('answer_en')
                            ->label('الإجابة (إنجليزي)')
                            ->rows(5)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('معلومات إضافية')
                    ->schema([
                        Forms\Components\TextInput::make('category')
                            ->label('التصنيف')
                            ->maxLength(255),

                        Forms\Components\Select::make('status')
                            ->label('الحالة')
                            ->options([
                                'pending' => 'قيد المراجعة',
                                'approved' => 'تمت الموافقة',
                                'rejected' => 'مرفوض',
                            ])
                            ->required()
                            ->default('pending'),

                        Forms\Components\TextInput::make('occurrence_count')
                            ->label('عدد التكرارات')
                            ->numeric()
                            ->disabled(),

                        Forms\Components\TextInput::make('confidence_score')
                            ->label('درجة الثقة')
                            ->numeric()
                            ->disabled()
                            ->suffix('%')
                            ->formatStateUsing(fn ($state) => $state ? round($state * 100, 1) : 0),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('المراجعة')
                    ->schema([
                        Forms\Components\Textarea::make('review_notes')
                            ->label('ملاحظات المراجعة')
                            ->rows(3)
                            ->columnSpanFull(),

                        Forms\Components\Placeholder::make('reviewed_by')
                            ->label('تمت المراجعة بواسطة')
                            ->content(fn (?FaqSuggestion $record): string =>
                                $record && $record->reviewer ? $record->reviewer->name : '-'
                            ),

                        Forms\Components\Placeholder::make('reviewed_at')
                            ->label('تاريخ المراجعة')
                            ->content(fn (?FaqSuggestion $record): string =>
                                $record && $record->reviewed_at ? $record->reviewed_at->format('Y-m-d H:i') : '-'
                            ),
                    ])
                    ->columns(2)
                    ->visibleOn('edit')
                    ->hidden(fn (?FaqSuggestion $record): bool => !$record || $record->status === 'pending'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('question_ar')
                    ->label('السؤال')
                    ->limit(60)
                    ->searchable()
                    ->weight('bold')
                    ->wrap(),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('الحالة')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'قيد المراجعة',
                        'approved' => 'تمت الموافقة',
                        'rejected' => 'مرفوض',
                        default => $state,
                    }),

                Tables\Columns\TextColumn::make('occurrence_count')
                    ->label('التكرارات')
                    ->sortable()
                    ->alignCenter()
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('confidence_score')
                    ->label('الثقة')
                    ->sortable()
                    ->formatStateUsing(fn ($state) => $state ? round($state * 100, 1) . '%' : '-')
                    ->color(fn ($state) => match (true) {
                        $state >= 0.7 => 'success',
                        $state >= 0.5 => 'warning',
                        default => 'danger',
                    }),

                Tables\Columns\TextColumn::make('category')
                    ->label('التصنيف')
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('reviewer.name')
                    ->label('المراجع')
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('تاريخ الإنشاء')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->defaultSort('occurrence_count', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('الحالة')
                    ->options([
                        'pending' => 'قيد المراجعة',
                        'approved' => 'تمت الموافقة',
                        'rejected' => 'مرفوض',
                    ]),

                Tables\Filters\Filter::make('high_confidence')
                    ->label('ثقة عالية (>70%)')
                    ->query(fn (Builder $query): Builder => $query->where('confidence_score', '>=', 0.7)),

                Tables\Filters\Filter::make('frequent')
                    ->label('متكرر (≥3)')
                    ->query(fn (Builder $query): Builder => $query->where('occurrence_count', '>=', 3)),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('موافقة')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (FaqSuggestion $record): bool => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('notes')
                            ->label('ملاحظات (اختياري)')
                            ->rows(2),
                    ])
                    ->action(function (FaqSuggestion $record, array $data) {
                        $faq = $record->approve(auth()->id(), $data['notes'] ?? null);

                        \Filament\Notifications\Notification::make()
                            ->success()
                            ->title('تمت الموافقة')
                            ->body("تم إنشاء سؤال شائع جديد بنجاح")
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label('رفض')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (FaqSuggestion $record): bool => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('notes')
                            ->label('سبب الرفض')
                            ->required()
                            ->rows(2),
                    ])
                    ->action(function (FaqSuggestion $record, array $data) {
                        $record->reject(auth()->id(), $data['notes']);

                        \Filament\Notifications\Notification::make()
                            ->success()
                            ->title('تم الرفض')
                            ->body("تم رفض الاقتراح")
                            ->send();
                    }),

                Tables\Actions\Action::make('view_faq')
                    ->label('عرض السؤال')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->visible(fn (FaqSuggestion $record): bool => $record->status === 'approved' && $record->created_faq_id)
                    ->url(fn (FaqSuggestion $record): string =>
                        route('filament.admin.resources.faqs.edit', ['record' => $record->created_faq_id])
                    )
                    ->openUrlInNewTab(),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('موافقة المحدد')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $approvedCount = 0;
                            foreach ($records as $record) {
                                if ($record->status === 'pending') {
                                    $record->approve(auth()->id());
                                    $approvedCount++;
                                }
                            }

                            \Filament\Notifications\Notification::make()
                                ->success()
                                ->title('تمت الموافقة')
                                ->body("تمت الموافقة على {$approvedCount} اقتراح")
                                ->send();
                        }),

                    Tables\Actions\BulkAction::make('reject_selected')
                        ->label('رفض المحدد')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->form([
                            Forms\Components\Textarea::make('notes')
                                ->label('سبب الرفض')
                                ->required()
                                ->rows(2),
                        ])
                        ->action(function ($records, array $data) {
                            $rejectedCount = 0;
                            foreach ($records as $record) {
                                if ($record->status === 'pending') {
                                    $record->reject(auth()->id(), $data['notes']);
                                    $rejectedCount++;
                                }
                            }

                            \Filament\Notifications\Notification::make()
                                ->success()
                                ->title('تم الرفض')
                                ->body("تم رفض {$rejectedCount} اقتراح")
                                ->send();
                        }),

                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFaqSuggestions::route('/'),
            'create' => Pages\CreateFaqSuggestion::route('/create'),
            'edit' => Pages\EditFaqSuggestion::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with(['reviewer', 'createdFaq']);
    }
}
