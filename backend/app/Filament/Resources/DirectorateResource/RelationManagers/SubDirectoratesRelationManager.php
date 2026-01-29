<?php

namespace App\Filament\Resources\DirectorateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class SubDirectoratesRelationManager extends RelationManager
{
    protected static string $relationship = 'subDirectorates';

    protected static ?string $title = 'الإدارات الفرعية';

    protected static ?string $modelLabel = 'إدارة فرعية';

    protected static ?string $pluralModelLabel = 'إدارات فرعية';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name_ar')
                    ->label('الاسم (عربي)')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('name_en')
                    ->label('الاسم (إنجليزي)')
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->label('الوصف')
                    ->rows(3)
                    ->columnSpanFull(),
                Forms\Components\Toggle::make('is_active')
                    ->label('نشطة')
                    ->default(true),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name_ar')
            ->columns([
                Tables\Columns\TextColumn::make('name_ar')
                    ->label('الاسم (عربي)')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name_en')
                    ->label('الاسم (إنجليزي)')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('نشطة')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('التاريخ')
                    ->dateTime('Y-m-d')
                    ->sortable(),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
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
