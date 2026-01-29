<?php

namespace App\Filament\Resources\ContentResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Illuminate\Database\Eloquent\Builder;

class VersionsRelationManager extends RelationManager
{
    protected static string $relationship = 'versions';

    protected static ?string $title = 'سجل الإصدارات';

    protected static ?string $modelLabel = 'إصدار';

    protected static ?string $pluralModelLabel = 'إصدارات';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('version_number')
                    ->label('رقم الإصدار')
                    ->disabled(),
            ]);
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('معلومات الإصدار')
                    ->schema([
                        Infolists\Components\TextEntry::make('version_number')
                            ->label('رقم الإصدار')
                            ->badge()
                            ->color('primary'),
                        Infolists\Components\TextEntry::make('editor.name')
                            ->label('المحرر')
                            ->default('غير معروف'),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('تاريخ الإنشاء')
                            ->dateTime('Y-m-d H:i:s'),
                    ])
                    ->columns(3),
                Infolists\Components\Section::make('محتوى الإصدار')
                    ->schema([
                        Infolists\Components\TextEntry::make('snapshot.title_ar')
                            ->label('العنوان (عربي)'),
                        Infolists\Components\TextEntry::make('snapshot.title_en')
                            ->label('العنوان (إنجليزي)'),
                        Infolists\Components\TextEntry::make('snapshot.status')
                            ->label('الحالة')
                            ->badge(),
                    ])
                    ->columns(3),
                Infolists\Components\Section::make('التغييرات')
                    ->schema([
                        Infolists\Components\KeyValueEntry::make('changes')
                            ->label('')
                            ->getStateUsing(fn ($record) => $record->getChanges())
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('version_number')
            ->columns([
                Tables\Columns\TextColumn::make('version_number')
                    ->label('الإصدار')
                    ->badge()
                    ->color('primary')
                    ->sortable(),
                Tables\Columns\TextColumn::make('editor.name')
                    ->label('المحرر')
                    ->default('غير معروف')
                    ->sortable(),
                Tables\Columns\TextColumn::make('snapshot.title_ar')
                    ->label('العنوان')
                    ->limit(40)
                    ->tooltip(fn ($record) => $record->snapshot['title_ar'] ?? ''),
                Tables\Columns\TextColumn::make('snapshot.status')
                    ->label('الحالة')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        'archived' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('التاريخ')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                // No create - versions are created automatically
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label('عرض'),
                Action::make('restore')
                    ->label('استعادة')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('استعادة الإصدار')
                    ->modalDescription('هل أنت متأكد من استعادة هذا الإصدار؟ سيتم استبدال المحتوى الحالي.')
                    ->modalSubmitActionLabel('نعم، استعادة')
                    ->action(function ($record) {
                        $record->restore();

                        Notification::make()
                            ->title('تم استعادة الإصدار بنجاح')
                            ->body('تم استعادة الإصدار رقم ' . $record->version_number)
                            ->success()
                            ->send();
                    }),
                Action::make('compare')
                    ->label('مقارنة')
                    ->icon('heroicon-o-arrows-right-left')
                    ->color('info')
                    ->modalHeading('مقارنة الإصدارات')
                    ->modalContent(function ($record) {
                        $changes = $record->getChanges();

                        if (isset($changes['created']) && $changes['created']) {
                            return view('filament.components.version-diff', [
                                'message' => 'هذا هو الإصدار الأول - لا توجد نسخة سابقة للمقارنة',
                                'changes' => [],
                            ]);
                        }

                        return view('filament.components.version-diff', [
                            'changes' => $changes,
                        ]);
                    })
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('إغلاق'),
            ])
            ->bulkActions([
                // No bulk actions for versions
            ])
            ->defaultSort('version_number', 'desc');
    }
}
