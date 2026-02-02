<?php

namespace Database\Seeders;

use App\Models\Content;
use Illuminate\Database\Seeder;

class StaticPageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'privacy-policy',
                'title_ar' => 'سياسة الخصوصية',
                'title_en' => 'Privacy Policy',
                'content_ar' => '<h2>جمع المعلومات</h2><p>نقوم بجمع المعلومات التي تقدمها لنا طوعياً عند استخدام خدمات البوابة الإلكترونية.</p><h2>استخدام المعلومات</h2><p>نستخدم المعلومات المجمعة لتقديم الخدمات الحكومية وتحسينها.</p><h2>حماية المعلومات</h2><p>نلتزم بحماية بياناتكم الشخصية وفقاً للقوانين والأنظمة النافذة في الجمهورية العربية السورية.</p><h2>ملفات تعريف الارتباط</h2><p>نستخدم ملفات تعريف الارتباط لتحسين تجربتكم على البوابة.</p><h2>مشاركة المعلومات</h2><p>لا نشارك معلوماتكم الشخصية مع أطراف ثالثة إلا في الحالات المنصوص عليها قانونياً.</p>',
                'content_en' => '<h2>Information Collection</h2><p>We collect information that you voluntarily provide when using the portal services.</p><h2>Use of Information</h2><p>We use collected information to provide and improve government services.</p><h2>Information Protection</h2><p>We are committed to protecting your personal data in accordance with the laws and regulations of the Syrian Arab Republic.</p><h2>Cookies</h2><p>We use cookies to improve your experience on the portal.</p><h2>Information Sharing</h2><p>We do not share your personal information with third parties except as required by law.</p>',
            ],
            [
                'slug' => 'terms',
                'title_ar' => 'شروط الاستخدام',
                'title_en' => 'Terms of Use',
                'content_ar' => '<h2>قبول الشروط</h2><p>باستخدامك لهذه البوابة الإلكترونية، فإنك توافق على الالتزام بشروط الاستخدام هذه.</p><h2>استخدام المحتوى</h2><p>جميع المحتويات المنشورة على البوابة هي ملك لوزارة الاقتصاد والتجارة الخارجية.</p><h2>المسؤولية القانونية</h2><p>لا تتحمل الوزارة أي مسؤولية عن أي أضرار ناتجة عن استخدام البوابة.</p><h2>حقوق الملكية الفكرية</h2><p>جميع حقوق الملكية الفكرية محفوظة للوزارة.</p>',
                'content_en' => '<h2>Acceptance of Terms</h2><p>By using this portal, you agree to comply with these terms of use.</p><h2>Content Usage</h2><p>All content published on the portal is the property of the Ministry of Economy and Foreign Trade.</p><h2>Legal Liability</h2><p>The Ministry assumes no liability for any damages resulting from the use of the portal.</p><h2>Intellectual Property Rights</h2><p>All intellectual property rights are reserved by the Ministry.</p>',
            ],
            [
                'slug' => 'about',
                'title_ar' => 'حول الوزارة',
                'title_en' => 'About the Ministry',
                'content_ar' => '<h2>حول وزارة الاقتصاد والتجارة الخارجية</h2><p>تعمل وزارة الاقتصاد والتجارة الخارجية على تطوير السياسات الاقتصادية وتعزيز التجارة الخارجية وحماية المستهلك ودعم الصناعة الوطنية.</p><h2>رسالتنا</h2><p>تحقيق التنمية الاقتصادية المستدامة وتعزيز بيئة الأعمال والاستثمار في الجمهورية العربية السورية.</p><h2>رؤيتنا</h2><p>اقتصاد وطني قوي ومتنوع يحقق الرفاه للمواطنين.</p>',
                'content_en' => '<h2>About the Ministry of Economy and Foreign Trade</h2><p>The Ministry works to develop economic policies, promote foreign trade, protect consumers, and support national industry.</p><h2>Our Mission</h2><p>Achieving sustainable economic development and enhancing the business and investment environment in the Syrian Arab Republic.</p><h2>Our Vision</h2><p>A strong and diversified national economy that achieves prosperity for citizens.</p>',
            ],
        ];

        foreach ($pages as $page) {
            Content::updateOrCreate(
                ['slug' => $page['slug']],
                array_merge($page, [
                    'category' => Content::CATEGORY_PAGE,
                    'status' => Content::STATUS_PUBLISHED,
                    'published_at' => now(),
                ])
            );
        }
    }
}
