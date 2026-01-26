<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InvestmentResource\Pages;
use App\Models\Investment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InvestmentResource extends Resource
{
    protected static ?string $model = Investment::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationGroup = 'Investment Portal';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Investments';

    protected static ?string $modelLabel = 'Investment';

    protected static ?string $pluralModelLabel = 'Investments';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Investment Details')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Basic Information')
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('title_ar')
                                            ->required()
                                            ->maxLength(255)
                                            ->label('Title (Arabic)'),
                                        Forms\Components\TextInput::make('title_en')
                                            ->required()
                                            ->maxLength(255)
                                            ->label('Title (English)'),
                                    ]),
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\Textarea::make('description_ar')
                                            ->rows(3)
                                            ->label('Description (Arabic)'),
                                        Forms\Components\Textarea::make('description_en')
                                            ->rows(3)
                                            ->label('Description (English)'),
                                    ]),
                                Forms\Components\Grid::make(4)
                                    ->schema([
                                        Forms\Components\Select::make('category')
                                            ->options([
                                                'opportunities' => 'Investment Opportunities',
                                                'one-stop' => 'One-Stop Shop Services',
                                                'licenses' => 'Investment Licenses',
                                                'guide' => 'Investor Guide',
                                            ])
                                            ->required()
                                            ->default('opportunities')
                                            ->label('Category'),
                                        Forms\Components\Select::make('status')
                                            ->options([
                                                'available' => 'Available',
                                                'under_review' => 'Under Review',
                                                'closed' => 'Closed',
                                            ])
                                            ->required()
                                            ->default('available')
                                            ->label('Status'),
                                        Forms\Components\Toggle::make('is_active')
                                            ->default(true)
                                            ->label('Active'),
                                        Forms\Components\Toggle::make('is_featured')
                                            ->label('Featured'),
                                    ]),
                            ]),

                        Forms\Components\Tabs\Tab::make('Location & Sector')
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('sector_ar')
                                            ->required()
                                            ->maxLength(255)
                                            ->label('Sector (Arabic)'),
                                        Forms\Components\TextInput::make('sector_en')
                                            ->required()
                                            ->maxLength(255)
                                            ->label('Sector (English)'),
                                    ]),
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('location_ar')
                                            ->required()
                                            ->maxLength(255)
                                            ->label('Location (Arabic)'),
                                        Forms\Components\TextInput::make('location_en')
                                            ->required()
                                            ->maxLength(255)
                                            ->label('Location (English)'),
                                    ]),
                            ]),

                        Forms\Components\Tabs\Tab::make('Financial Details')
                            ->schema([
                                Forms\Components\Grid::make(3)
                                    ->schema([
                                        Forms\Components\TextInput::make('investment_amount')
                                            ->numeric()
                                            ->prefix('$')
                                            ->label('Investment Amount'),
                                        Forms\Components\Select::make('currency')
                                            ->options([
                                                'USD' => 'US Dollar (USD)',
                                                'SYP' => 'Syrian Pound (SYP)',
                                                'EUR' => 'Euro (EUR)',
                                            ])
                                            ->default('USD')
                                            ->label('Currency'),
                                        Forms\Components\TextInput::make('fee')
                                            ->maxLength(100)
                                            ->label('Fee/Cost')
                                            ->helperText('e.g., 50,000 ل.س'),
                                    ]),
                            ]),

                        Forms\Components\Tabs\Tab::make('Requirements & Contact')
                            ->schema([
                                Forms\Components\KeyValue::make('requirements')
                                    ->keyLabel('Language')
                                    ->valueLabel('Requirements (comma separated)')
                                    ->reorderable()
                                    ->label('Requirements'),
                                Forms\Components\Grid::make(3)
                                    ->schema([
                                        Forms\Components\TextInput::make('processing_time')
                                            ->maxLength(100)
                                            ->label('Processing Time')
                                            ->helperText('e.g., 3-5 working days'),
                                        Forms\Components\TextInput::make('contact_email')
                                            ->email()
                                            ->maxLength(255)
                                            ->label('Contact Email'),
                                        Forms\Components\TextInput::make('contact_phone')
                                            ->tel()
                                            ->maxLength(50)
                                            ->label('Contact Phone'),
                                    ]),
                            ]),

                        Forms\Components\Tabs\Tab::make('Display Settings')
                            ->schema([
                                Forms\Components\Grid::make(3)
                                    ->schema([
                                        Forms\Components\Select::make('icon')
                                            ->options([
                                                'Zap' => 'Zap (Energy)',
                                                'Factory' => 'Factory (Industry)',
                                                'Building' => 'Building (Tourism)',
                                                'Building2' => 'Building2 (Commerce)',
                                                'Shield' => 'Shield (Healthcare)',
                                                'Wheat' => 'Wheat (Agriculture)',
                                                'FileText' => 'FileText (Documents)',
                                                'FileCheck' => 'FileCheck (Licenses)',
                                                'Banknote' => 'Banknote (Finance)',
                                                'Users' => 'Users (HR)',
                                                'Truck' => 'Truck (Logistics)',
                                                'Briefcase' => 'Briefcase (Business)',
                                                'TrendingUp' => 'TrendingUp (Growth)',
                                                'Globe' => 'Globe (International)',
                                            ])
                                            ->default('Zap')
                                            ->searchable()
                                            ->label('Icon'),
                                        Forms\Components\FileUpload::make('image')
                                            ->image()
                                            ->directory('investments')
                                            ->label('Image'),
                                        Forms\Components\TextInput::make('order')
                                            ->numeric()
                                            ->default(0)
                                            ->label('Display Order'),
                                    ]),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title_ar')
                    ->label('Title (AR)')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'opportunities' => 'success',
                        'one-stop' => 'info',
                        'licenses' => 'warning',
                        'guide' => 'gray',
                        default => 'gray',
                    })
                    ->label('Category'),
                Tables\Columns\TextColumn::make('sector_ar')
                    ->label('Sector')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('location_ar')
                    ->label('Location')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('investment_amount')
                    ->numeric()
                    ->money('USD')
                    ->sortable()
                    ->label('Amount')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'available' => 'success',
                        'under_review' => 'warning',
                        'closed' => 'danger',
                        default => 'gray',
                    })
                    ->label('Status'),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),
                Tables\Columns\TextColumn::make('order')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'opportunities' => 'Investment Opportunities',
                        'one-stop' => 'One-Stop Shop',
                        'licenses' => 'Investment Licenses',
                        'guide' => 'Investor Guide',
                    ])
                    ->label('Category'),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'available' => 'Available',
                        'under_review' => 'Under Review',
                        'closed' => 'Closed',
                    ])
                    ->label('Status'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('order', 'asc');
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInvestments::route('/'),
            'create' => Pages\CreateInvestment::route('/create'),
            'view' => Pages\ViewInvestment::route('/{record}'),
            'edit' => Pages\EditInvestment::route('/{record}/edit'),
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
