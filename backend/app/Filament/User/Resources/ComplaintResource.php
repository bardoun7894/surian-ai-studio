<?php

namespace App\Filament\User\Resources;

use App\Filament\User\Resources\ComplaintResource\Pages;
use App\Filament\User\Resources\ComplaintResource\RelationManagers;
use App\Models\Complaint;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ComplaintResource extends Resource
{
    protected static ?string $model = Complaint::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Hidden::make('user_id')
                    ->default(auth()->id()),
                    
                Forms\Components\Section::make('تفاصيل الشكوى')
                    ->schema([
                        Forms\Components\Select::make('directorate_id')
                            ->relationship('directorate', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->label('المديرية المعنية'),
                            
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->label('عنوان الشكوى'),
                            
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->rows(5)
                            ->label('نص الشكوى')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('معلومات الاتصال')
                    ->description('يرجى التأكد من صحة المعلومات لضمان التواصل معكم')
                    ->schema([
                        Forms\Components\TextInput::make('full_name')
                            ->required()
                            ->maxLength(255)
                            ->default(fn () => auth()->user()->name)
                            ->label('الاسم الكامل'),
                            
                        Forms\Components\TextInput::make('national_id')
                            ->required()
                            ->maxLength(11)
                            ->label('الرقم الوطني'),
                            
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->required()
                            ->maxLength(20)
                            ->label('رقم الهاتف'),
                            
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->default(fn () => auth()->user()->email)
                            ->label('البريد الإلكتروني'),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tracking_number')
                    ->searchable()
                    ->copyable()
                    ->label('رقم التتبع'),
                    
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->limit(30)
                    ->label('العنوان'),
                    
                Tables\Columns\TextColumn::make('directorate.name')
                    ->sortable()
                    ->label('المديرية'),
                    
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'gray',
                        'in_progress' => 'warning',
                        'resolved' => 'success',
                        'rejected' => 'danger',
                        default => 'primary',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'new' => 'جديدة',
                        'in_progress' => 'قيد المعالجة',
                        'resolved' => 'تمت المعالجة',
                        'rejected' => 'مرفوضة',
                        default => $state,
                    })
                    ->label('الحالة'),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('تاريخ التقديم'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'new' => 'جديدة',
                        'in_progress' => 'قيد المعالجة',
                        'resolved' => 'تمت المعالجة',
                    ])
                    ->label('الحالة'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([]);
    }
    
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('user_id', auth()->id());
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
            'index' => Pages\ListComplaints::route('/'),
            'create' => Pages\CreateComplaint::route('/create'),
            'view' => Pages\ViewComplaint::route('/{record}'),
        ];
    }
    
    public static function getNavigationLabel(): string
    {
        return 'شكاواية';
    }
    
    public static function getModelLabel(): string
    {
        return 'شكوى';
    }
    
    public static function getPluralModelLabel(): string
    {
        return 'الشكاوى';
    }
}
