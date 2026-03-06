<?php

namespace Database\Seeders;

use App\Models\QuickLink;
use Illuminate\Database\Seeder;

class QuickLinkSeeder extends Seeder
{
    public function run(): void
    {
        $links = [
            // Homepage quick links
            ['label_ar' => 'القوانين والمراسيم', 'label_en' => 'Laws & Decrees', 'url' => '/decrees', 'icon' => 'Scale', 'section' => 'homepage', 'display_order' => 1],
            ['label_ar' => 'الأخبار', 'label_en' => 'News', 'url' => '/news', 'icon' => 'Newspaper', 'section' => 'homepage', 'display_order' => 2],
            ['label_ar' => 'الإعلانات', 'label_en' => 'Announcements', 'url' => '/#announcements', 'icon' => 'Megaphone', 'section' => 'homepage', 'display_order' => 3],
            ['label_ar' => 'الخدمات', 'label_en' => 'Services', 'url' => '/services', 'icon' => 'Briefcase', 'section' => 'homepage', 'display_order' => 4],
            ['label_ar' => 'الشكاوى', 'label_en' => 'Complaints', 'url' => '/complaints', 'icon' => 'MessageSquareWarning', 'section' => 'homepage', 'display_order' => 5],
            ['label_ar' => 'الأسئلة الشائعة', 'label_en' => 'FAQ', 'url' => '/#faq', 'icon' => 'HelpCircle', 'section' => 'homepage', 'display_order' => 6],
            ['label_ar' => 'اتصل بنا', 'label_en' => 'Contact Us', 'url' => '/#contact', 'icon' => 'Phone', 'section' => 'homepage', 'display_order' => 7],
            ['label_ar' => 'حول الوزارة', 'label_en' => 'About', 'url' => '/about', 'icon' => 'Building2', 'section' => 'homepage', 'display_order' => 8],

            // Footer quick links
            ['label_ar' => 'حول البوابة', 'label_en' => 'About Portal', 'url' => '/about', 'icon' => 'Building2', 'section' => 'footer', 'display_order' => 1],
            ['label_ar' => 'دليل المديريات', 'label_en' => 'Directorates', 'url' => '/directorates', 'icon' => 'Building2', 'section' => 'footer', 'display_order' => 2],
            ['label_ar' => 'القوانين والمراسيم', 'label_en' => 'Decrees', 'url' => '/decrees', 'icon' => 'Scale', 'section' => 'footer', 'display_order' => 3],
            ['label_ar' => 'البيانات المفتوحة', 'label_en' => 'Open Data', 'url' => '/open-data', 'icon' => 'Globe', 'section' => 'footer', 'display_order' => 4],
            ['label_ar' => 'خريطة الموقع', 'label_en' => 'Sitemap', 'url' => '/sitemap', 'icon' => 'Network', 'section' => 'footer', 'display_order' => 5],
        ];

        foreach ($links as $link) {
            QuickLink::updateOrCreate(
                ['url' => $link['url'], 'section' => $link['section']],
                array_merge($link, ['is_active' => true])
            );
        }
    }
}
