<?php

namespace App\Filament\Resources\SuggestionResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;

class AttachmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'attachments';

    protected static ?string $title = 'المرفقات';

    protected static ?string $modelLabel = 'مرفق';

    protected static ?string $pluralModelLabel = 'مرفقات';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('path')
                    ->label('الملف')
                    ->required()
                    ->directory('suggestion-attachments')
                    ->acceptedFileTypes(['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                    ->maxSize(10240)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('original_name')
                    ->label('اسم الملف')
                    ->disabled(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('original_name')
            ->columns([
                Tables\Columns\TextColumn::make('original_name')
                    ->label('اسم الملف')
                    ->searchable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('mime_type')
                    ->label('النوع')
                    ->badge()
                    ->color(fn ($state) => match (true) {
                        str_contains($state ?? '', 'image') => 'success',
                        str_contains($state ?? '', 'pdf') => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('size')
                    ->label('الحجم')
                    ->formatStateUsing(fn ($state) => number_format(($state ?? 0) / 1024, 2) . ' KB'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('تاريخ الرفع')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()->label('إضافة مرفق'),
            ])
            ->actions([
                Tables\Actions\Action::make('download')
                    ->label('تحميل')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success')
                    ->url(fn ($record) => Storage::url($record->path))
                    ->openUrlInNewTab(),
                Tables\Actions\DeleteAction::make()->label('حذف'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
