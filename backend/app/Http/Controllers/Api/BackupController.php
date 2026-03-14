<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{
    /**
     * NFR-05: Create manual database backup snapshot
     *
     * POST /api/v1/admin/backup/create
     */
    public function create(Request $request)
    {
        try {
            $timestamp = now()->format('Y-m-d_H-i-s');
            $filename = "backup_{$timestamp}.sql";
            $backupPath = storage_path("app/backups/{$filename}");

            // Ensure backups directory exists
            if (!is_dir(storage_path('app/backups'))) {
                mkdir(storage_path('app/backups'), 0755, true);
            }

            // Get database connection details
            $host = config('database.connections.pgsql.host');
            $port = config('database.connections.pgsql.port', 5432);
            $database = config('database.connections.pgsql.database');
            $username = config('database.connections.pgsql.username');
            $password = config('database.connections.pgsql.password');

            // Set PGPASSWORD environment variable for pg_dump
            putenv("PGPASSWORD={$password}");

            // Create backup using pg_dump
            // Exclude sensitive tables from backup
            $excludeTables = ['personal_access_tokens', 'password_reset_tokens', 'sessions', 'failed_jobs'];
            $excludeArgs = implode(' ', array_map(fn($t) => '--exclude-table=' . escapeshellarg($t), $excludeTables));
            
            $command = sprintf(
                'pg_dump -h %s -p %s -U %s -d %s %s -F p > %s 2>&1',
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($username),
                escapeshellarg($database),
                $excludeArgs,
                escapeshellarg($backupPath)
            );

            exec($command, $output, $returnCode);

            // Clear password from environment
            putenv("PGPASSWORD");

            if ($returnCode !== 0) {
                Log::error('Backup failed', ['output' => $output, 'code' => $returnCode]);

                // Fallback: Use Laravel's DB facade for basic export
                return $this->fallbackBackup($filename);
            }

            // Get file size
            $fileSize = filesize($backupPath);

            // Log the backup creation
            Log::info('Database backup created', [
                'filename' => $filename,
                'size' => $fileSize,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'تم إنشاء النسخة الاحتياطية بنجاح',
                'filename' => $filename,
                'size' => $this->formatBytes($fileSize),
                'created_at' => now()->toIso8601String(),
            ]);

        } catch (\Exception $e) {
            Log::error('Backup creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'فشل إنشاء النسخة الاحتياطية',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List available backups
     *
     * GET /api/v1/admin/backup/list
     */
    public function list()
    {
        $backupsPath = storage_path('app/backups');

        if (!is_dir($backupsPath)) {
            return response()->json(['backups' => []]);
        }

        $files = glob("{$backupsPath}/*.sql");
        $backups = [];

        foreach ($files as $file) {
            $backups[] = [
                'filename' => basename($file),
                'size' => $this->formatBytes(filesize($file)),
                'created_at' => date('Y-m-d H:i:s', filemtime($file)),
            ];
        }

        // Sort by creation date descending
        usort($backups, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));

        return response()->json([
            'backups' => $backups,
            'count' => count($backups),
        ]);
    }

    /**
     * Download a backup file
     *
     * GET /api/v1/admin/backup/download/{filename}
     */
    public function download(string $filename)
    {
        // Sanitize filename to prevent path traversal
        $filename = basename($filename);
        $path = storage_path("app/backups/{$filename}");

        if (!file_exists($path)) {
            return response()->json(['message' => 'Backup not found'], 404);
        }

        Log::info('Backup downloaded', [
            'filename' => $filename,
            'user_id' => auth()->id(),
        ]);

        return response()->download($path, $filename, [
            'Content-Type' => 'application/sql',
        ]);
    }

    /**
     * Delete a backup file
     *
     * DELETE /api/v1/admin/backup/{filename}
     */
    public function destroy(string $filename)
    {
        $filename = basename($filename);
        $path = storage_path("app/backups/{$filename}");

        if (!file_exists($path)) {
            return response()->json(['message' => 'Backup not found'], 404);
        }

        unlink($path);

        Log::info('Backup deleted', [
            'filename' => $filename,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'تم حذف النسخة الاحتياطية',
        ]);
    }

    /**
     * Export data as JSON (alternative backup method)
     *
     * POST /api/v1/admin/backup/export
     */
    public function export(Request $request)
    {
        $allowedTables = ['complaints', 'contents', 'faqs', 'directorates', 'categories', 'settings'];
        $tables = array_intersect($request->input('tables', $allowedTables), $allowedTables);
        $timestamp = now()->format('Y-m-d_H-i-s');
        $filename = "export_{$timestamp}.json";

        $data = [
            'exported_at' => now()->toIso8601String(),
            'tables' => [],
        ];

        foreach ($tables as $table) {
            try {
                $data['tables'][$table] = DB::table($table)->get()->toArray();
            } catch (\Exception $e) {
                $data['tables'][$table] = ['error' => $e->getMessage()];
            }
        }

        $path = storage_path("app/backups/{$filename}");

        if (!is_dir(storage_path('app/backups'))) {
            mkdir(storage_path('app/backups'), 0755, true);
        }

        file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return response()->json([
            'message' => 'تم تصدير البيانات بنجاح',
            'filename' => $filename,
            'tables' => array_keys($data['tables']),
        ]);
    }

    /**
     * Fallback backup using DB queries
     */
    protected function fallbackBackup(string $filename): \Illuminate\Http\JsonResponse
    {
        $path = storage_path("app/backups/{$filename}");

        // Get all tables
        $tables = DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");

        $sql = "-- Backup created at " . now()->toIso8601String() . "\n\n";

        $sensitiveTableNames = ['users', 'personal_access_tokens', 'password_reset_tokens', 'sessions', 'failed_jobs'];
        foreach ($tables as $table) {
            $tableName = $table->tablename;
            if (in_array($tableName, $sensitiveTableNames)) {
                continue;
            }
            $rows = DB::table($tableName)->get();

            if ($rows->isNotEmpty()) {
                $sql .= "-- Table: {$tableName}\n";
                foreach ($rows as $row) {
                    $values = array_map(function ($val) {
                        if (is_null($val)) return 'NULL';
                        if (is_bool($val)) return $val ? 'TRUE' : 'FALSE';
                        return "'" . addslashes($val) . "'";
                    }, (array) $row);

                    $columns = implode(', ', array_keys((array) $row));
                    $values = implode(', ', $values);
                    $sql .= "INSERT INTO {$tableName} ({$columns}) VALUES ({$values});\n";
                }
                $sql .= "\n";
            }
        }

        file_put_contents($path, $sql);

        return response()->json([
            'message' => 'تم إنشاء النسخة الاحتياطية (طريقة بديلة)',
            'filename' => $filename,
            'size' => $this->formatBytes(filesize($path)),
            'created_at' => now()->toIso8601String(),
        ]);
    }

    /**
     * Format bytes to human readable
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
