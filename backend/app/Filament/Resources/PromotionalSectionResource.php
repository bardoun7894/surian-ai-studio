<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PromotionalSectionResource\Pages;
use App\Models\PromotionalSection;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PromotionalSectionResource extends Resource
{
    protected static ?string $model = PromotionalSection::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-group';

    protected static ?string $navigationGroup = 'إدارة المحتوى';

    protected static ?int $navigationSort = 5;

    protected static ?string $navigationLabel = 'الأقسام الترويجية';

    protected static ?string $modelLabel = 'قسم ترويجي';

    protected static ?string $pluralModelLabel = 'الأقسام الترويجية';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Promotional Section')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('المحتوى العربي')
                            ->schema([
                                Forms\Components\TextInput::make('title_ar')
                                    ->required()
                                    ->maxLength(255)
                                    ->label('العنوان'),
                                Forms\Components\Textarea::make('description_ar')
                                    ->rows(3)
                                    ->label('الوصف'),
                                Forms\Components\TextInput::make('button_text_ar')
                                    ->maxLength(100)
                                    ->label('نص الزر'),
                            ]),

                        Forms\Components\Tabs\Tab::make('English Content')
                            ->schema([
                                Forms\Components\TextInput::make('title_en')
                                    ->required()
                                    ->maxLength(255)
                                    ->label('Title'),
                                Forms\Components\Textarea::make('description_en')
                                    ->rows(3)
                                    ->label('Description'),
                                Forms\Components\TextInput::make('button_text_en')
                                    ->maxLength(100)
                                    ->label('Button Text'),
                            ]),

                        Forms\Components\Tabs\Tab::make('الإعدادات')
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\Select::make('type')
                                            ->options([
                                                'banner' => 'بانر',
                                                'video' => 'فيديو',
                                                'promo' => 'ترويجي',
                                                'stats' => 'إحصائيات',
                                            ])
                                            ->required()
                                            ->default('promo')
                                            ->label('النوع'),
                                        Forms\Components\Select::make('position')
                                            ->options([
                                                'hero' => 'الرئيسي',
                                                'grid_main' => 'الشبكة الرئيسية',
                                                'grid_side' => 'الشبكة الجانبية',
                                                'grid_bottom' => 'أسفل الشبكة',
                                            ])
                                            ->required()
                                            ->default('grid_bottom')
                                            ->label('الموقع'),
                                    ]),
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\ColorPicker::make('background_color')
                                            ->default('#1A2E1A')
                                            ->label('لون الخلفية'),
                                        Forms\Components\Select::make('icon')
                                            ->options([
                                                'Play' => 'Play (تشغيل)',
                                                'Users' => 'Users (مستخدمون)',
                                                'TrendingUp' => 'TrendingUp (نمو)',
                                                'Star' => 'Star (نجمة)',
                                                'Award' => 'Award (جائزة)',
                                                'Zap' => 'Zap (طاقة)',
                                                'Target' => 'Target (هدف)',
                                                'Heart' => 'Heart (قلب)',
                                                'ThumbsUp' => 'ThumbsUp (إعجاب)',
                                                'MessageCircle' => 'MessageCircle (رسالة)',
                                                'FileText' => 'FileText (مستند)',
                                                'Calendar' => 'Calendar (تقويم)',
                                                'Globe' => 'Globe (عالمي)',
                                                'Shield' => 'Shield (حماية)',
                                                'Briefcase' => 'Briefcase (عمل)',
                                            ])
                                            ->default('Play')
                                            ->searchable()
                                            ->label('الأيقونة'),
                                    ]),
                                Forms\Components\TextInput::make('button_url')
                                    ->url()
                                    ->maxLength(500)
                                    ->label('رابط الزر'),
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\Toggle::make('is_active')
                                            ->default(true)
                                            ->label('نشط'),
                                        Forms\Components\TextInput::make('display_order')
                                            ->numeric()
                                            ->default(0)
                                            ->label('ترتيب العرض'),
                                    ]),
                            ]),

                        Forms\Components\Tabs\Tab::make('الوسائط والجدولة')
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->image()
                                    ->directory('promotional-sections')
                                    ->imageEditor()
                                    ->label('الصورة'),
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\DateTimePicker::make('published_at')
                                            ->label('تاريخ النشر'),
                                        Forms\Components\DateTimePicker::make('expires_at')
                                            ->label('تاريخ الانتهاء'),
                                    ]),
                                Forms\Components\KeyValue::make('metadata')
                                    ->label('بيانات إضافية')
                                    ->helperText('بيانات JSON إضافية للقسم'),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('الصورة')
                    ->circular()
                    ->defaultImageUrl(fn () => 'https://ui-avatars.com/api/?name=P&background=1A2E1A&color=fff'),
                Tables\Columns\TextColumn::make('title_ar')
                    ->label('العنوان')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'banner' => 'info',
                        'video' => 'danger',
                        'promo' => 'success',
                        'stats' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'banner' => 'بانر',
                        'video' => 'فيديو',
                        'promo' => 'ترويجي',
                        'stats' => 'إحصائيات',
                        default => $state,
                    })
                    ->label('النوع'),
                Tables\Columns\TextColumn::make('position')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'hero' => 'الرئيسي',
                        'grid_main' => 'الشبكة الرئيسية',
                        'grid_side' => 'الشبكة الجانبية',
                        'grid_bottom' => 'أسفل الشبكة',
                        default => $state,
                    })
                    ->label('الموقع'),
                Tables\Columns\ColorColumn::make('background_color')
                    ->label('اللون'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('نشط'),
                Tables\Columns\TextColumn::make('display_order')
                    ->sortable()
                    ->label('الترتيب'),
                Tables\Columns\TextColumn::make('published_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('تاريخ النشر'),
                Tables\Columns\TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('تاريخ الانتهاء'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('تاريخ الإنشاء'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'banner' => 'بانر',
                        'video' => 'فيديو',
                        'promo' => 'ترويجي',
                        'stats' => 'إحصائيات',
                    ])
                    ->label('النوع'),
                Tables\Filters\SelectFilter::make('position')
                    ->options([
                        'hero' => 'الرئيسي',
                        'grid_main' => 'الشبكة الرئيسية',
                        'grid_side' => 'الشبكة الجانبية',
                        'grid_bottom' => 'أسفل الشبكة',
                    ])
                    ->label('الموقع'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('نشط'),
                Tables\Filters\TrashedFilter::make()
                    ->label('المحذوفة'),
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
            ->reorderable('display_order')
            ->defaultSort('display_order', 'asc');
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
            'index' => Pages\ListPromotionalSections::route('/'),
            'create' => Pages\CreatePromotionalSection::route('/create'),
            'view' => Pages\ViewPromotionalSection::route('/{record}'),
            'edit' => Pages\EditPromotionalSection::route('/{record}/edit'),
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
