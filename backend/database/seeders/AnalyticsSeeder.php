<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Complaint;
use App\Models\User;
use App\Models\Content;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        // Get a valid user ID (first admin user)
        $userId = User::first()?->id;
        if (!$userId) {
            $this->command->warn('No users found, skipping AnalyticsSeeder.');
            return;
        }

        // 1. Seed Past 30 Days of Complaints (for Trend Chart)
        $statuses = ['new', 'processing', 'resolved', 'rejected'];
        $priorities = ['low', 'medium', 'high', 'urgent'];
        
        $startDate = Carbon::now()->subDays(30);
        
        for ($i = 0; $i < 30; $i++) {
            $date = $startDate->copy()->addDays($i);
            
            // Random volume for each day (0-5 complaints)
            $dailyCount = rand(0, 5);
            
            for ($j = 0; $j < $dailyCount; $j++) {
                Complaint::create([
                    'tracking_number' => 'CMP-' . $date->format('Ymd') . '-' . strtoupper(substr(md5(rand()), 0, 5)),
                    'user_id' => $userId,
                    'directorate_id' => 'd' . rand(1, 5),
                    'template_id' => null,
                    'title' => 'Complaint from ' . $date->format('Y-m-d'),
                    'description' => 'Simulated complaint description for analytics testing.',
                    'status' => $statuses[array_rand($statuses)],
                    'priority' => $priorities[array_rand($priorities)],
                    'national_id' => '010100' . rand(10000, 99999),
                    'full_name' => 'Citizen ' . rand(1, 100),
                    'phone' => '09' . rand(10000000, 99999999),
                    'created_at' => $date->setTime(rand(8, 16), rand(0, 59)),
                    'updated_at' => $date->setTime(rand(17, 20), rand(0, 59)),
                ]);
            }
        }
    }
}
