<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class VirusScanService
{
    /**
     * Scan a file for viruses using ClamAV.
     * Returns true if file is clean, false if infected.
     * If ClamAV is disabled or unavailable, returns true (allow).
     */
    public function scan(UploadedFile $file): bool
    {
        if (!config('services.clamav.enabled', false)) {
            return true;
        }

        $filePath = $file->getRealPath();
        if (!$filePath || !file_exists($filePath)) {
            return true;
        }

        try {
            $output = [];
            $exitCode = 0;
            exec(
                sprintf('clamdscan --no-summary %s 2>&1', escapeshellarg($filePath)),
                $output,
                $exitCode
            );

            // clamdscan exit codes: 0 = clean, 1 = infected, 2 = error
            if ($exitCode === 1) {
                Log::warning('Virus detected in uploaded file', [
                    'file' => $file->getClientOriginalName(),
                    'scan_output' => implode("\n", $output),
                ]);
                return false;
            }

            if ($exitCode === 2) {
                Log::error('ClamAV scan error', [
                    'file' => $file->getClientOriginalName(),
                    'scan_output' => implode("\n", $output),
                ]);
                // On error, allow the file (fail-open) to not block uploads when ClamAV is misconfigured
                return true;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('ClamAV scan exception: ' . $e->getMessage());
            return true; // Fail-open
        }
    }

    /**
     * Scan multiple files. Returns array of filenames that failed scanning.
     */
    public function scanFiles(array $files): array
    {
        $infected = [];
        foreach ($files as $file) {
            if ($file instanceof UploadedFile && !$this->scan($file)) {
                $infected[] = $file->getClientOriginalName();
            }
        }
        return $infected;
    }
}
