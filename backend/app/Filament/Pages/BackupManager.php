<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class BackupManager extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-server-stack';

    protected static ?string $navigationGroup = 'إعدادات النظام';

    protected static ?int $navigationSort = 5;

    protected static ?string $title = 'إدارة النسخ الاحتياطية';

    protected static ?string $navigationLabel = 'النسخ الاحتياطية';

    protected static string $view = 'filament.pages.backup-manager';

    public function getBackups(): array
    {
        $disk = Storage::disk('local');
        $path = 'backups';

        if (!$disk->exists($path)) {
            return [];
        }

        $files = $disk->files($path);
        $backups = [];

        foreach ($files as $file) {
            $backups[] = [
                'filename' => basename($file),
                'path' => $file,
                'size' => number_format($disk->size($file) / 1024 / 1024, 2) . ' MB',
                'date' => date('Y-m-d H:i:s', $disk->lastModified($file)),
            ];
        }

        usort($backups, fn ($a, $b) => strcmp($b['date'], $a['date']));

        return $backups;
    }

    public function createBackup(): void
    {
        try {
            Artisan::call('backup:run', ['--only-db' => true]);

            Notification::make()
                ->title('تم إنشاء النسخة الاحتياطية بنجاح')
                ->success()
                ->send();
        } catch (\Exception $e) {
            Notification::make()
                ->title('فشل إنشاء النسخة الاحتياطية')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function downloadBackup(string $filename): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return Storage::disk('local')->download('backups/' . $filename);
    }

    public function deleteBackup(string $filename): void
    {
        Storage::disk('local')->delete('backups/' . $filename);

        Notification::make()
            ->title('تم حذف النسخة الاحتياطية')
            ->success()
            ->send();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('createBackup')
                ->label('إنشاء نسخة احتياطية')
                ->icon('heroicon-o-plus-circle')
                ->color('primary')
                ->requiresConfirmation()
                ->modalHeading('إنشاء نسخة احتياطية جديدة')
                ->modalDescription('سيتم إنشاء نسخة احتياطية لقاعدة البيانات. هل تريد المتابعة؟')
                ->action(fn () => $this->createBackup()),
        ];
    }
}
