<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RoleResource\Pages;
use App\Models\Role;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class RoleResource extends Resource
{
    protected static ?string $model = Role::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $navigationGroup = 'إدارة النظام';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'دور';

    protected static ?string $pluralModelLabel = 'الأدوار';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('معلومات الدور')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('اسم الدور')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->placeholder('e.g., admin.super, staff.complaints'),
                        Forms\Components\TextInput::make('label')
                            ->label('التسمية')
                            ->maxLength(255)
                            ->placeholder('e.g., مدير النظام'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('الصلاحيات')
                    ->schema([
                        Forms\Components\CheckboxList::make('permissions')
                            ->label('الصلاحيات')
                            ->options([
                                // User permissions
                                'users.view' => 'عرض المستخدمين',
                                'users.create' => 'إنشاء مستخدمين',
                                'users.edit' => 'تعديل المستخدمين',
                                'users.delete' => 'حذف المستخدمين',
                                // Complaint permissions
                                'complaints.view' => 'عرض الشكاوى',
                                'complaints.manage' => 'إدارة الشكاوى',
                                'complaints.delete' => 'حذف الشكاوى',
                                'complaints.assign' => 'تعيين الشكاوى',
                                'complaints.respond' => 'الرد على الشكاوى',
                                // Content permissions
                                'content.view' => 'عرض المحتوى',
                                'content.create' => 'إنشاء محتوى',
                                'content.edit' => 'تعديل المحتوى',
                                'content.delete' => 'حذف المحتوى',
                                'content.publish' => 'نشر المحتوى',
                                'content.feature' => 'تمييز المحتوى',
                                // Suggestion permissions
                                'suggestions.view' => 'عرض المقترحات',
                                'suggestions.manage' => 'إدارة المقترحات',
                                'suggestions.respond' => 'الرد على المقترحات',
                                // Service permissions
                                'services.view' => 'عرض الخدمات',
                                'services.manage' => 'إدارة الخدمات',
                                // Directorate permissions
                                'directorates.view' => 'عرض الإدارات',
                                'directorates.manage' => 'إدارة الإدارات',
                                // System permissions
                                'settings.manage' => 'إدارة الإعدادات',
                                'reports.view' => 'عرض التقارير',
                                'backups.manage' => 'إدارة النسخ الاحتياطية',
                                'audit.view' => 'عرض سجلات التدقيق',
                            ])
                            ->columns(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('اسم الدور')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('label')
                    ->label('التسمية')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('permissions')
                    ->label('عدد الصلاحيات')
                    ->formatStateUsing(fn ($state) => is_array($state) ? count($state) : 0)
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('users_count')
                    ->label('المستخدمون')
                    ->counts('users')
                    ->sortable()
                    ->badge()
                    ->color('info'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('تاريخ الإنشاء')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
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

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRoles::route('/'),
            'create' => Pages\CreateRole::route('/create'),
            'edit' => Pages\EditRole::route('/{record}/edit'),
        ];
    }
}
