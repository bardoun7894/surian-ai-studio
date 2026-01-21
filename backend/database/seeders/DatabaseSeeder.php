<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesSeeder::class,
            AdminUserSeeder::class, // Create default admin user
            DirectoratesSeeder::class,
            ServicesSeeder::class,
            ComplaintTemplatesSeeder::class,
            ContentSeeder::class,     // News, Announcements, Decrees, Services, Media
            FaqSeeder::class,          // FAQs for the portal
            AnalyticsSeeder::class,    // Trend Data for Dashboard
        ]);
    }
}
