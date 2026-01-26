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

        // Video Card - Red background with Play icon
        PromotionalSection::create([
            'title_ar' => 'كواليس التحضيرات النهائية',
            'title_en' => 'Behind the Scenes: Final Preparations',
            'description_ar' => 'شاهد التقرير الحصري من قلب الحدث مع مراسلنا.',
            'description_en' => 'Watch the exclusive report from the heart of the event with our correspondent.',
            'button_text_ar' => 'شاهد الفيديو',
            'button_text_en' => 'Watch Video',
            'background_color' => '#DC2626', // gov-red
            'icon' => 'Play',
            'button_url' => '#video-exclusive',
            'type' => 'video',
            'position' => 'grid_bottom',
            'display_order' => 1,
            'is_active' => true,
            'published_at' => now(),
            'metadata' => [
                'badge_ar' => 'فيديو حصري',
                'badge_en' => 'Exclusive Video',
            ],
        ]);

        // Stats Card - Forest background with writers count
        PromotionalSection::create([
            'title_ar' => 'كاتب ومحلل',
            'title_en' => 'Writers & Analysts',
            'description_ar' => 'انضم إلى مجتمعنا من الخبراء والمحللين لقراءة تحليلات عميقة.',
            'description_en' => 'Join our community of experts and analysts for in-depth analysis.',
            'button_text_ar' => 'تصفح الكتاب',
            'button_text_en' => 'Browse Writers',
            'background_color' => '#1A2E1A', // gov-forest
            'icon' => 'Users',
            'button_url' => '/writers',
            'type' => 'stats',
            'position' => 'grid_bottom',
            'display_order' => 2,
            'is_active' => true,
            'published_at' => now(),
            'metadata' => [
                'stat_value' => '30+',
                'stat_label_ar' => 'كاتب ومحلل',
                'stat_label_en' => 'Writers & Analysts',
            ],
        ]);

        $this->command->info('Promotional sections seeded successfully!');
    }
}
