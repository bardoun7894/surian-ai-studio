<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SystemSettingResource\Pages;
use App\Models\SystemSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SystemSettingResource extends Resource
{
    protected static ?string $model = SystemSetting::class;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationGroup = 'إدارة النظام';

    protected static ?string $modelLabel = 'إعدادات النظام';
    protected static ?string $pluralModelLabel = 'إعدادات النظام';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Setting Details')
                    ->schema([
                        Forms\Components\TextInput::make('key')
                            ->disabled()
                            ->required(),
                        Forms\Components\TextInput::make('group')
                            ->disabled()
                            ->required(),
                        Forms\Components\TextInput::make('label_ar')
                            ->label('Label (Arabic)')
                            ->required(),
                        Forms\Components\TextInput::make('label_en')
                            ->label('Label (English)')
                            ->required(),
                        Forms\Components\Textarea::make('description_ar')
                            ->label('Description (Arabic)')
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('description_en')
                            ->label('Description (English)')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Configuration')
                    ->schema([
                        Forms\Components\TextInput::make('type')
                            ->disabled(),
                        Forms\Components\Toggle::make('is_public')
                            ->disabled(),
                        
                        // Dynamic Value Field
                        Forms\Components\TextInput::make('value')
                            ->label('Setting Value')
                            ->helperText(fn (SystemSetting $record) => "Type: " . $record->type)
                            ->required(),

                        Forms\Components\KeyValue::make('settings')
                            ->label('Metadata / Extra Config')
                            ->schema([
                                // KeyValue uses default schema of key/value inputs
                            ])
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('group')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('label_ar')
                    ->label('الاسم')
                    ->searchable(),
                Tables\Columns\TextColumn::make('label_en')
                    ->label('Label')
                    ->searchable(),
                Tables\Columns\TextColumn::make('key')
                    ->fontFamily('mono')
                    ->copyable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('value')
                    ->limit(50),
                Tables\Columns\IconColumn::make('is_public')
                    ->label('Public API')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('group')
                    ->options([
                        'ui' => 'UI Settings',
                        'feature_flags' => 'Feature Flags',
                        'ai' => 'AI Configuration',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                // Settings shouldn't be bulk deleted usually
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSystemSettings::route('/'),
            'edit' => Pages\EditSystemSetting::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false; // Typically settings are seeded
    }
}
