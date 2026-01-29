<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Directorate;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?string $navigationGroup = 'إدارة المحتوى';

    protected static ?string $modelLabel = 'خدمة';

    protected static ?string $pluralModelLabel = 'الخدمات';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('معلومات الخدمة')
                    ->schema([
                        Forms\Components\TextInput::make('name_ar')
                            ->label('الاسم (عربي)')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('name_en')
                            ->label('الاسم (إنجليزي)')
                            ->maxLength(255),
                        Forms\Components\Select::make('directorate_id')
                            ->label('الإدارة')
                            ->options(Directorate::pluck('name_ar', 'id'))
                            ->searchable()
                            ->required(),
                        Forms\Components\TextInput::make('icon')
                            ->label('الأيقونة')
                            ->placeholder('e.g., FileText, Shield, Building2')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('category')
                            ->label('التصنيف')
                            ->maxLength(255),
                        Forms\Components\Toggle::make('is_digital')
                            ->label('خدمة إلكترونية')
                            ->default(false),
                        Forms\Components\Toggle::make('is_active')
                            ->label('نشطة')
                            ->default(true),
                        Forms\Components\TextInput::make('url')
                            ->label('رابط الخدمة')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('fees')
                            ->label('الرسوم')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('estimated_time')
                            ->label('الوقت المتوقع')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('display_order')
                            ->label('ترتيب العرض')
                            ->numeric()
                            ->default(0),
                    ])->columns(2),

                Forms\Components\Section::make('الوصف والمتطلبات')
                    ->schema([
                        Forms\Components\RichEditor::make('description_ar')
                            ->label('الوصف (عربي)')
                            ->columnSpanFull(),
                        Forms\Components\RichEditor::make('description_en')
                            ->label('الوصف (إنجليزي)')
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('requirements')
                            ->label('المتطلبات')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name_ar')
                    ->label('الاسم')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('directorate.name_ar')
                    ->label('الإدارة')
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->label('التصنيف')
                    ->badge(),
                Tables\Columns\IconColumn::make('is_digital')
                    ->label('إلكترونية')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('نشطة')
                    ->boolean(),
                Tables\Columns\TextColumn::make('display_order')
                    ->label('الترتيب')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('display_order')
            ->reorderable('display_order')
            ->filters([
                Tables\Filters\SelectFilter::make('directorate_id')
                    ->label('الإدارة')
                    ->options(Directorate::pluck('name_ar', 'id')),
                Tables\Filters\TernaryFilter::make('is_digital')
                    ->label('إلكترونية'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('نشطة'),
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

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        $query = parent::getEloquentQuery();
        $user = auth()->user();

        if ($user && !$user->hasRole('super_admin') && $user->directorate_id) {
            $query->where('directorate_id', $user->directorate_id);
        }

        return $query;
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
