<?php

namespace App\Filament\Resources\ComplaintResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Builder;

class ResponsesRelationManager extends RelationManager
{
    protected static string $relationship = 'responses';

    protected static ?string $title = 'الردود';

    protected static ?string $modelLabel = 'رد';

    protected static ?string $pluralModelLabel = 'ردود';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\RichEditor::make('content')
                    ->label('محتوى الرد')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\Toggle::make('is_internal')
                    ->label('رد داخلي')
                    ->helperText('الردود الداخلية لا تظهر للمواطن')
                    ->default(false),
                Forms\Components\Toggle::make('is_resolution')
                    ->label('رد الحل النهائي')
                    ->helperText('تحديد هذا الرد كحل نهائي للشكوى')
                    ->default(false),
                Forms\Components\Hidden::make('user_id')
                    ->default(fn () => auth()->id()),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('content')
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('المستجيب')
                    ->sortable()
                    ->default('النظام'),
                Tables\Columns\TextColumn::make('content')
                    ->label('الرد')
                    ->html()
                    ->limit(100)
                    ->tooltip(fn ($record) => strip_tags($record->content)),
                Tables\Columns\IconColumn::make('is_internal')
                    ->label('داخلي')
                    ->boolean()
                    ->trueIcon('heroicon-o-lock-closed')
                    ->falseIcon('heroicon-o-lock-open')
                    ->trueColor('warning')
                    ->falseColor('success'),
                Tables\Columns\IconColumn::make('is_resolution')
                    ->label('حل نهائي')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-minus-circle')
                    ->trueColor('success')
                    ->falseColor('gray'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('التاريخ')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_internal')
                    ->label('نوع الرد')
                    ->placeholder('الكل')
                    ->trueLabel('داخلي فقط')
                    ->falseLabel('عام فقط'),
                Tables\Filters\TernaryFilter::make('is_resolution')
                    ->label('الحل النهائي')
                    ->placeholder('الكل')
                    ->trueLabel('ردود الحل')
                    ->falseLabel('ردود عادية'),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('إضافة رد')
                    ->mutateFormDataUsing(function (array $data): array {
                        $data['user_id'] = auth()->id();
                        return $data;
                    })
                    ->after(function ($record) {
                        // If marked as resolution, optionally update complaint status
                        if ($record->is_resolution) {
                            $complaint = $record->complaint;
                            if ($complaint->status !== 'resolved') {
                                Notification::make()
                                    ->title('تذكير')
                                    ->body('تم تحديد هذا الرد كحل نهائي. هل ترغب في تحديث حالة الشكوى إلى "تم الحل"؟')
                                    ->warning()
                                    ->actions([
                                        \Filament\Notifications\Actions\Action::make('resolve')
                                            ->label('تحديث الحالة')
                                            ->url(route('filament.admin.resources.complaints.edit', $complaint))
                                            ->button(),
                                    ])
                                    ->persistent()
                                    ->send();
                            }
                        }
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label('عرض'),
                Tables\Actions\EditAction::make()
                    ->label('تعديل'),
                Action::make('toggleVisibility')
                    ->label(fn ($record) => $record->is_internal ? 'جعله عام' : 'جعله داخلي')
                    ->icon(fn ($record) => $record->is_internal ? 'heroicon-o-lock-open' : 'heroicon-o-lock-closed')
                    ->color(fn ($record) => $record->is_internal ? 'success' : 'warning')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->is_internal = !$record->is_internal;
                        $record->save();

                        $status = $record->is_internal ? 'داخلي' : 'عام';
                        Notification::make()
                            ->title("تم تغيير نوع الرد إلى: {$status}")
                            ->success()
                            ->send();
                    }),
                Action::make('markAsResolution')
                    ->label('تحديد كحل نهائي')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => !$record->is_resolution)
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        // Unmark any previous resolution
                        $record->complaint->responses()
                            ->where('id', '!=', $record->id)
                            ->where('is_resolution', true)
                            ->update(['is_resolution' => false]);

                        $record->is_resolution = true;
                        $record->save();

                        Notification::make()
                            ->title('تم تحديد هذا الرد كحل نهائي')
                            ->success()
                            ->send();
                    }),
                Tables\Actions\DeleteAction::make()
                    ->label('حذف'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
