<?php

namespace Database\Seeders;

use App\Models\PromotionalSection;
use Illuminate\Database\Seeder;

class PromotionalSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing promotional sections
        PromotionalSection::truncate();

        // ──────────────────────────────────────────────────────────
        // 1) Video: Syria's New Currency & Economic Renaissance
        //    Real YouTube video: OMunUpaYK0I (Shams TV – Syria's new currency features)
        // ──────────────────────────────────────────────────────────
        PromotionalSection::create([
            'title_ar' => 'العملة السورية الجديدة: ملامح النهضة الاقتصادية',
            'title_en' => "Syria's New Currency: Signs of Economic Renaissance",
            'description_ar' => 'تعرّف على مميزات العملة السورية الجديدة التي تعكس هوية سوريا الحضارية وانطلاقتها الاقتصادية.',
            'description_en' => "Discover the features of Syria's new currency reflecting its civilizational identity and economic rebirth.",
            'button_text_ar' => 'شاهد الآن',
            'button_text_en' => 'Watch Now',
            'background_color' => '#1A4D3E',
            'icon' => 'Play',
            'button_url' => '/media',
            'video_url' => 'https://www.youtube.com/watch?v=OMunUpaYK0I',
            'image' => 'https://img.youtube.com/vi/OMunUpaYK0I/maxresdefault.jpg',
            'type' => 'video',
            'position' => 'grid_bottom',
            'display_order' => 1,
            'is_active' => true,
            'published_at' => now(),
            'metadata' => [
                'badge_ar' => 'اقتصاد سوريا الجديدة',
                'badge_en' => "New Syria Economy",
                'duration' => '3:00',
                'source' => 'Shams TV',
            ],
        ]);

        // ──────────────────────────────────────────────────────────
        // 2) Video: Syria's Economy 2025 – Technology & Regional Outlook
        //    Real YouTube video: 4ttOV5C2yfI (Shams TV – Economy 2025 outlook)
        // ──────────────────────────────────────────────────────────
        PromotionalSection::create([
            'title_ar' => 'اقتصاد سوريا 2025: بين الاستثمار وإعادة الإعمار',
            'title_en' => "Syria's Economy 2025: Investment & Reconstruction",
            'description_ar' => 'نظرة شاملة على مستقبل الاقتصاد السوري في ظل التحولات الإقليمية وتدفق الاستثمارات.',
            'description_en' => "A comprehensive look at Syria's economic future amid regional shifts and investment inflows.",
            'button_text_ar' => 'شاهد التقرير',
            'button_text_en' => 'Watch Report',
            'background_color' => '#0F172A',
            'icon' => 'TrendingUp',
            'button_url' => '/media',
            'video_url' => 'https://www.youtube.com/watch?v=4ttOV5C2yfI',
            'image' => 'https://img.youtube.com/vi/4ttOV5C2yfI/maxresdefault.jpg',
            'type' => 'video',
            'position' => 'grid_bottom',
            'display_order' => 2,
            'is_active' => true,
            'published_at' => now(),
            'metadata' => [
                'badge_ar' => 'تقرير اقتصادي',
                'badge_en' => 'Economic Report',
                'duration' => '3:00',
                'source' => 'Shams TV',
            ],
        ]);

        // ──────────────────────────────────────────────────────────
        // 3) Stats Card: Investment Highlights
        // ──────────────────────────────────────────────────────────
        PromotionalSection::create([
            'title_ar' => 'مليار دولار استثمارات',
            'title_en' => 'Billion USD Investments',
            'description_ar' => 'حجم الاستثمارات المتدفقة إلى سوريا خلال المرحلة الانتقالية — اكتشف فرص الاستثمار.',
            'description_en' => "Investment inflows to Syria during the transition — discover opportunities.",
            'button_text_ar' => 'فرص الاستثمار',
            'button_text_en' => 'Investment Opportunities',
            'background_color' => '#1A2E1A',
            'icon' => 'TrendingUp',
            'button_url' => '/investment',
            'type' => 'stats',
            'position' => 'grid_bottom',
            'display_order' => 3,
            'is_active' => true,
            'published_at' => now(),
            'metadata' => [
                'stat_value' => '$28B',
                'stat_label_ar' => 'استثمارات 2025',
                'stat_label_en' => '2025 Investments',
            ],
        ]);

        $this->command->info('Promotional sections seeded: 2 YouTube videos + 1 stats card');
    }
}
