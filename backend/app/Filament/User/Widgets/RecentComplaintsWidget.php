<?php

namespace App\Filament\User\Widgets;

use App\Models\Complaint;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentComplaintsWidget extends BaseWidget
{
    protected static ?int $sort = 2;
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('آخر النشاطات')
            ->query(
                Complaint::query()
                    ->where('user_id', auth()->id())
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('tracking_number')
                    ->label('رقم التتبع')
                    ->icon('heroicon-m-ticket')
                    ->iconColor('primary')
                    ->copyable()
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('title')
                    ->label('العنوان')
                    ->limit(30)
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('directorate.name')
                    ->label('المديرية')
                    ->badge()
                    ->color('gray'),
                    
                Tables\Columns\TextColumn::make('status')
                    ->label('الحالة')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'warning',
                        'in_progress' => 'info',
                        'resolved' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'new' => 'جديدة',
                        'in_progress' => 'قيد المعالجة',
                        'resolved' => 'تمت المعالجة',
                        'rejected' => 'مرفوضة',
                        default => $state,
                    }),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->label('التاريخ')
                    ->dateTime('Y-m-d')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label('عرض')
                    ->url(fn (Complaint $record): string => 
                        route('filament.user.resources.complaints.view', ['record' => $record])
                    ),
            ]);
    }
}
