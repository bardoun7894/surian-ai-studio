<?php

namespace App\Filament\Resources\ContentResource\RelationManagers;

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
                Forms\Components\FileUpload::make('file_path')
                    ->label('الملف')
                    ->required()
                    ->directory('content-attachments')
                    ->maxSize(10240)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('file_name')
                    ->label('اسم الملف')
                    ->maxLength(255),
                Forms\Components\TextInput::make('title')
                    ->label('العنوان')
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->label('الوصف')
                    ->rows(2)
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('file_name')
            ->columns([
                Tables\Columns\TextColumn::make('file_name')
                    ->label('اسم الملف')
                    ->searchable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('title')
                    ->label('العنوان')
                    ->searchable(),
                Tables\Columns\TextColumn::make('file_type')
                    ->label('النوع')
                    ->badge(),
                Tables\Columns\TextColumn::make('file_size')
                    ->label('الحجم')
                    ->formatStateUsing(fn ($state) => number_format(($state ?? 0) / 1024, 2) . ' KB'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('التاريخ')
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
                    ->url(fn ($record) => Storage::url($record->file_path))
                    ->openUrlInNewTab(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
