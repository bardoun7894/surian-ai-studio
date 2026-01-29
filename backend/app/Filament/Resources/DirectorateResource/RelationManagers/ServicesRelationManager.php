<?php

namespace App\Filament\Resources\DirectorateResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ServicesRelationManager extends RelationManager
{
    protected static string $relationship = 'services';

    protected static ?string $title = 'الخدمات';

    protected static ?string $modelLabel = 'خدمة';

    protected static ?string $pluralModelLabel = 'خدمات';

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
                Forms\Components\Toggle::make('is_digital')
                    ->label('إلكترونية')
                    ->default(false),
                Forms\Components\Toggle::make('is_active')
                    ->label('نشطة')
                    ->default(true),
                Forms\Components\Textarea::make('description_ar')
                    ->label('الوصف')
                    ->rows(3)
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name_ar')
            ->columns([
                Tables\Columns\TextColumn::make('name_ar')
                    ->label('الاسم')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_digital')
                    ->label('إلكترونية')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('نشطة')
                    ->boolean(),
                Tables\Columns\TextColumn::make('display_order')
                    ->label('الترتيب')
                    ->sortable(),
            ])
            ->defaultSort('display_order')
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
