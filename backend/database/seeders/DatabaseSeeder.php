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
            AdminUserSeeder::class,      // Create default admin user
            DirectoratesSeeder::class,   // Ministries and departments
            SubDirectoratesSeeder::class, // Sub-departments for featured directorates
            ServicesSeeder::class,       // Government services
            ComplaintTemplatesSeeder::class,
            SettingsSeeder::class,       // System Settings
            ContentSeeder::class,        // News, Announcements, Decrees, Services, Media
            FaqSeeder::class,            // FAQs for the portal
            AnalyticsSeeder::class,      // Trend Data for Dashboard
            InvestmentSeeder::class,     // Investment opportunities
            PromotionalSectionSeeder::class, // Homepage promotional sections
            QuickLinkSeeder::class,      // Quick links for homepage/footer
            StaticPageSeeder::class,     // Static pages content
        ]);
    }
}
