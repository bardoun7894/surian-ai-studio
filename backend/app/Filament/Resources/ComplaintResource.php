<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ComplaintResource\Pages;
use App\Filament\Resources\ComplaintResource\RelationManagers;
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

    protected static ?string $navigationIcon = 'heroicon-m-clipboard-document-list';

    protected static ?string $navigationGroup = 'الشكاوى';

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        // FR-26: Staff sees only their directorate's complaints
        $user = auth()->user();
        if ($user && ! $user->hasRole('admin') && $user->directorate_id) {
            $query->where('directorate_id', $user->directorate_id);
        }

        return $query;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Complaint Details')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->columnSpanFull(),
                                Forms\Components\Textarea::make('description')
                                    ->rows(5)
                                    ->required()
                                    ->columnSpanFull(),
                            ]),
                        Forms\Components\Section::make('Citizen Information')
                            ->schema([
                                Forms\Components\TextInput::make('full_name')->disabled(),
                                Forms\Components\TextInput::make('national_id')->disabled(),
                                Forms\Components\TextInput::make('phone')->disabled(),
                                Forms\Components\TextInput::make('email')->disabled(),
                            ])->columns(2),
                    ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Status & Processing')
                            ->schema([
                                Forms\Components\TextInput::make('tracking_number')->disabled(),
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'new' => 'New',
                                        'pending' => 'Pending',
                                        'processing' => 'Processing',
                                        'resolved' => 'Resolved',
                                        'rejected' => 'Rejected',
                                    ])
                                    ->required(),
                                Forms\Components\Select::make('priority')
                                    ->options([
                                        'low' => 'Low',
                                        'medium' => 'Medium',
                                        'high' => 'High',
                                        'urgent' => 'Urgent',
                                    ])
                                    ->required(),
                                Forms\Components\Select::make('directorate_id')
                                    ->relationship('directorate', 'name_ar')
                                    ->searchable()
                                    ->preload(),
                            ]),
                        Forms\Components\Section::make('AI Analysis')
                            ->schema([
                                Forms\Components\Textarea::make('ai_summary')
                                    ->disabled()
                                    ->rows(3),
                                Forms\Components\TextInput::make('ai_category')->disabled(),
                                Forms\Components\TextInput::make('ai_priority')->disabled(),
                            ])->collapsed(),
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('tracking_number')
                    ->searchable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('full_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('directorate.name_ar')
                    ->label('Directorate')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'gray',
                        'pending' => 'warning',
                        'processing' => 'info',
                        'resolved' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('priority')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'high', 'urgent' => 'danger',
                        'medium' => 'warning',
                        'low' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'new' => 'New',
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'resolved' => 'Resolved',
                        'rejected' => 'Rejected',
                    ]),
                Tables\Filters\SelectFilter::make('priority')
                    ->options([
                        'low' => 'Low',
                        'medium' => 'Medium',
                        'high' => 'High',
                        'urgent' => 'Urgent',
                    ]),
                Tables\Filters\SelectFilter::make('directorate')
                    ->relationship('directorate', 'name_ar'),
            ])
            ->actions([
                Tables\Actions\Action::make('print')
                    ->label('طباعة')
                    ->icon('heroicon-o-printer')
                    ->color('success')
                    ->url(fn ($record) => url("/api/v1/complaints/{$record->tracking_number}/pdf"))
                    ->openUrlInNewTab(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ResponsesRelationManager::class,
            RelationManagers\AttachmentsRelationManager::class,
        ];
    }

    public static function getNavigationLabel(): string
    {
        return 'All Complaints'; // Or 'كل الشكاوى' if keeping Arabic primary
    }
    
    public static function getPluralModelLabel(): string
    {
        return 'Complaints';
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListComplaints::route('/'),
            'create' => Pages\CreateComplaint::route('/create'),
            'edit' => Pages\EditComplaint::route('/{record}/edit'),
        ];
    }
}
