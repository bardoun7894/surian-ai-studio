<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubDirectorateResource\Pages;
use App\Models\SubDirectorate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SubDirectorateResource extends Resource
{
    protected static ?string $model = SubDirectorate::class;

    public static function canViewAny(): bool
    {
        $user = auth()->user();
        return $user?->hasPermission('directorates.view') || $user?->hasPermission('directorates.*') || $user?->hasRole('super_admin');
    }

    public static function canCreate(): bool
    {
        $user = auth()->user();
        return $user?->hasRole('super_admin') || $user?->hasPermission('directorates.manage') || $user?->hasPermission('directorates.*');
    }

    public static function canEdit($record): bool
    {
        $user = auth()->user();
        return $user?->hasRole('super_admin') || $user?->hasPermission('directorates.manage') || $user?->hasPermission('directorates.*');
    }

    public static function canDelete($record): bool
    {
        return auth()->user()?->hasRole('super_admin') ?? false;
    }

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';

    protected static ?string $navigationGroup = 'إدارة النظام';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Sub-Directorates';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Sub-Directorate Information')
                    ->schema([
                        Forms\Components\Select::make('parent_directorate_id')
                            ->relationship('directorate', 'name_ar')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->label('Parent Directorate'),
                        Forms\Components\TextInput::make('name_ar')
                            ->required()
                            ->maxLength(255)
                            ->label('Name (Arabic)'),
                        Forms\Components\TextInput::make('name_en')
                            ->required()
                            ->maxLength(255)
                            ->label('Name (English)'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Link Configuration')
                    ->schema([
                        Forms\Components\TextInput::make('url')
                            ->required()
                            ->maxLength(255)
                            ->label('URL')
                            ->helperText('Internal path (e.g., /services/apps) or external URL'),
                        Forms\Components\Toggle::make('is_external')
                            ->label('External Link')
                            ->helperText('Enable if URL points to external website'),
                        Forms\Components\TextInput::make('order')
                            ->numeric()
                            ->default(0)
                            ->required()
                            ->label('Display Order'),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true)
                            ->label('Active'),
                    ])
                    ->columns(4),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('directorate.name_ar')
                    ->label('Directorate')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name_ar')
                    ->label('Name (AR)')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name_en')
                    ->label('Name (EN)')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('url')
                    ->label('URL')
                    ->limit(40)
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\IconColumn::make('is_external')
                    ->boolean()
                    ->label('External')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('order')
                    ->sortable()
                    ->label('Order'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable()
                    ->label('Active'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('parent_directorate_id')
                    ->relationship('directorate', 'name_ar')
                    ->label('Directorate'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status'),
                Tables\Filters\TernaryFilter::make('is_external')
                    ->label('External Links'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('order', 'asc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubDirectorates::route('/'),
            'create' => Pages\CreateSubDirectorate::route('/create'),
            'edit' => Pages\EditSubDirectorate::route('/{record}/edit'),
        ];
    }
}
