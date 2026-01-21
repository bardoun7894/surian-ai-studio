<?php

namespace Database\Seeders;

use App\Models\Content;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing content
        Content::truncate();

        // Seed all content types
        $this->seedNews();
        $this->seedAnnouncements();
        $this->seedDecrees();
        $this->seedServices();
        $this->seedMedia();
    }

    private function seedNews(): void
    {
        $news = [
            // Featured Hero Article
            [
                'title_ar' => 'استراتيجية الحكومة الإلكترونية',
                'title_en' => 'E-Government Strategy',
                'content_ar' => 'نحو قطاع عام كفء وشفاف وفعال يخدم المواطن السوري بأحدث التقنيات. تهدف هذه الاستراتيجية إلى تحويل جميع الخدمات الحكومية إلى خدمات إلكترونية متاحة للمواطنين على مدار الساعة.',
                'content_en' => 'Towards an efficient, transparent and effective public sector serving Syrian citizens with the latest technologies.',
                'seo_description_ar' => 'نحو قطاع عام كفء وشفاف وفعال يخدم المواطن السوري بأحدث التقنيات.',
                'category' => 'news',
                'status' => 'published',
                'featured' => true,
                'priority' => 10,
                'published_at' => now()->subDays(1),
                'metadata' => [
                    'image' => '/storage/images/news/hero.jpg',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '5 دقائق',
                    'category_label' => 'رؤية 2030'
                ],
            ],
            // Breaking/Urgent News
            [
                'title_ar' => 'رئاسة مجلس الوزراء تقر خطة التحول الرقمي الشامل لعام 2024',
                'title_en' => 'Cabinet approves comprehensive digital transformation plan for 2024',
                'content_ar' => 'أقر مجلس الوزراء في جلسته الأسبوعية الخطة الوطنية للتحول الرقمي التي تهدف إلى أتمتة كافة الخدمات الحكومية بحلول نهاية العام. وتشمل الخطة تحديث البنية التحتية الرقمية وتدريب الكوادر الحكومية.',
                'content_en' => 'The Cabinet approved in its weekly session the national digital transformation plan.',
                'seo_description_ar' => 'أقر مجلس الوزراء في جلسته الأسبوعية الخطة الوطنية للتحول الرقمي التي تهدف إلى أتمتة كافة الخدمات الحكومية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 9,
                'published_at' => now()->subDays(2),
                'metadata' => [
                    'image' => '/storage/images/news/news-1.jpg',
                    'category_label' => 'رئاسة الوزراء',
                    'is_breaking' => true
                ],
            ],
            [
                'title_ar' => 'وزارة الاتصالات تطلق بوابة الخدمات الإلكترونية الجديدة',
                'title_en' => 'Ministry of Communications launches new e-services portal',
                'content_ar' => 'أعلنت وزارة الاتصالات والتقانة عن إطلاق النسخة المحدثة من بوابة المواطن التي تتضمن واجهة مستخدم محسنة وخدمات جديدة تشمل الدفع الإلكتروني والتوقيع الرقمي.',
                'content_en' => 'The Ministry of Communications and Technology announced the launch of the updated version of the citizen portal.',
                'seo_description_ar' => 'أعلنت وزارة الاتصالات والتقانة عن إطلاق النسخة المحدثة من بوابة المواطن.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'published_at' => now()->subDays(3),
                'metadata' => [
                    'image' => '/storage/images/news/news-2.jpg',
                    'category_label' => 'تكنولوجيا',
                    'is_breaking' => true
                ],
            ],
            [
                'title_ar' => 'مرسوم تشريعي بتعديل رسوم الخدمات القنصلية',
                'title_en' => 'Legislative decree amending consular service fees',
                'content_ar' => 'صدر المرسوم التشريعي القاضي بتعديل بعض الرسوم القنصلية لتسهيل الإجراءات على المغتربين. يشمل التعديل تخفيض رسوم تصديق الوثائق وتجديد جوازات السفر.',
                'content_en' => 'A legislative decree was issued amending some consular fees to facilitate procedures for expatriates.',
                'seo_description_ar' => 'صدر المرسوم التشريعي القاضي بتعديل بعض الرسوم القنصلية لتسهيل الإجراءات على المغتربين.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'published_at' => now()->subDays(4),
                'metadata' => [
                    'category_label' => 'مراسيم',
                    'is_breaking' => true
                ],
            ],
            [
                'title_ar' => 'افتتاح مركز خدمة المواطن الجديد في دمشق',
                'title_en' => 'Opening of new citizen service center in Damascus',
                'content_ar' => 'تم افتتاح مركز جديد لخدمة المواطن يقدم أكثر من 50 خدمة حكومية في مكان واحد. يعمل المركز على مدار الأسبوع ويوفر خدمات إلكترونية متكاملة.',
                'content_en' => 'A new citizen service center was opened providing more than 50 government services in one place.',
                'seo_description_ar' => 'تم افتتاح مركز جديد لخدمة المواطن يقدم أكثر من 50 خدمة حكومية في مكان واحد.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'image' => '/storage/images/news/news-3.jpg',
                    'category_label' => 'خدمات'
                ],
            ],
            // Grid Articles
            [
                'title_ar' => 'مشروع الطاقة المتجددة في حمص',
                'title_en' => 'Renewable Energy Project in Homs',
                'content_ar' => 'تدشين المرحلة الأولى من محطة الطاقة الشمسية بقدرة 50 ميغاواط لدعم الشبكة الكهربائية. يعد هذا المشروع جزءاً من خطة الحكومة للتحول نحو الطاقة النظيفة.',
                'content_en' => 'Inauguration of the first phase of the solar power plant with a capacity of 50 megawatts.',
                'seo_description_ar' => 'تدشين المرحلة الأولى من محطة الطاقة الشمسية بقدرة 50 ميغاواط لدعم الشبكة الكهربائية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'published_at' => now()->subDays(6),
                'metadata' => [
                    'image' => '/storage/images/news/news-4.jpg',
                    'author' => 'وزارة الكهرباء',
                    'read_time' => '3 دقائق',
                    'category_label' => 'طاقة'
                ],
            ],
            [
                'title_ar' => 'تحديث المناهج الجامعية',
                'title_en' => 'University Curriculum Update',
                'content_ar' => 'إدخال تخصصات الذكاء الاصطناعي والأمن السيبراني في خمس جامعات حكومية جديدة. تهدف هذه الخطوة إلى مواكبة التطورات التكنولوجية العالمية.',
                'content_en' => 'Introduction of artificial intelligence and cybersecurity specializations in five new public universities.',
                'seo_description_ar' => 'إدخال تخصصات الذكاء الاصطناعي والأمن السيبراني في خمس جامعات حكومية جديدة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'image' => '/storage/images/news/news-5.jpg',
                    'author' => 'وزارة التعليم العالي',
                    'read_time' => '4 دقائق',
                    'category_label' => 'تعليم عالي'
                ],
            ],
            [
                'title_ar' => 'مهرجان التسوق الشهري',
                'title_en' => 'Monthly Shopping Festival',
                'content_ar' => 'انطلاق فعاليات مهرجان التسوق "صنع في سوريا" بمشاركة واسعة من الشركات الصناعية. يهدف المهرجان إلى دعم المنتج المحلي وتشجيع الصناعة الوطنية.',
                'content_en' => 'Launch of the "Made in Syria" shopping festival with wide participation from industrial companies.',
                'seo_description_ar' => 'انطلاق فعاليات مهرجان التسوق "صنع في سوريا" بمشاركة واسعة من الشركات الصناعية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'published_at' => now()->subDays(8),
                'metadata' => [
                    'image' => '/storage/images/news/news-6.jpg',
                    'author' => 'غرفة الصناعة',
                    'read_time' => '2 دقائق',
                    'category_label' => 'اقتصاد'
                ],
            ],
        ];

        foreach ($news as $item) {
            $item['slug'] = Str::slug($item['title_en'] . '-' . uniqid());
            Content::create($item);
        }
    }

    private function seedAnnouncements(): void
    {
        $announcements = [
            [
                'title_ar' => 'إعلان عن مناقصة عامة لتوريد معدات تقنية',
                'title_en' => 'Public tender announcement for technical equipment supply',
                'content_ar' => 'تعلن رئاسة مجلس الوزراء عن مناقصة عامة لتوريد معدات تقنية وأجهزة حاسوبية للوزارات والمؤسسات الحكومية. آخر موعد للتقديم: 30/01/2025. للاطلاع على الشروط والمواصفات يرجى مراجعة قسم المشتريات.',
                'content_en' => 'The Cabinet announces a public tender for the supply of technical equipment and computers.',
                'seo_description_ar' => 'تعلن رئاسة مجلس الوزراء عن مناقصة عامة لتوريد معدات تقنية وأجهزة حاسوبية للوزارات والمؤسسات الحكومية.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(1),
                'metadata' => ['type' => 'tender', 'category_label' => 'مناقصات'],
            ],
            [
                'title_ar' => 'تمديد مهلة تقديم طلبات التوظيف',
                'title_en' => 'Extension of job application deadline',
                'content_ar' => 'تم تمديد مهلة تقديم طلبات التوظيف للمسابقة المركزية حتى نهاية الشهر الحالي. يرجى من جميع المتقدمين استكمال أوراقهم والتأكد من صحة البيانات المدخلة.',
                'content_en' => 'The deadline for submitting job applications for the central competition has been extended.',
                'seo_description_ar' => 'تم تمديد مهلة تقديم طلبات التوظيف للمسابقة المركزية حتى نهاية الشهر الحالي.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 9,
                'published_at' => now()->subDays(2),
                'metadata' => ['type' => 'urgent', 'category_label' => 'توظيف'],
            ],
            [
                'title_ar' => 'دورة تدريبية في الإدارة الإلكترونية',
                'title_en' => 'Training course in electronic management',
                'content_ar' => 'إعلان عن دورة تدريبية مجانية في الإدارة الإلكترونية للموظفين الحكوميين. التسجيل مفتوح حتى 15/01/2025. تشمل الدورة التعامل مع الأنظمة الإلكترونية والأرشفة الرقمية.',
                'content_en' => 'Announcement of a free training course in electronic management for government employees.',
                'seo_description_ar' => 'إعلان عن دورة تدريبية مجانية في الإدارة الإلكترونية للموظفين الحكوميين.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(3),
                'metadata' => ['type' => 'general', 'category_label' => 'تدريب'],
            ],
            [
                'title_ar' => 'تحديث نظام المعاملات الإلكترونية',
                'title_en' => 'Electronic transactions system update',
                'content_ar' => 'سيتم تحديث نظام المعاملات الإلكترونية يوم السبت القادم من الساعة 12 ليلاً حتى 6 صباحاً. نعتذر عن أي إزعاج قد يسببه هذا التحديث ونشكركم على تفهمكم.',
                'content_en' => 'The electronic transactions system will be updated next Saturday from 12 AM to 6 AM.',
                'seo_description_ar' => 'سيتم تحديث نظام المعاملات الإلكترونية يوم السبت القادم من الساعة 12 ليلاً حتى 6 صباحاً.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(4),
                'metadata' => ['type' => 'important', 'category_label' => 'تقنية'],
            ],
            [
                'title_ar' => 'فرص عمل جديدة في القطاع الحكومي',
                'title_en' => 'New job opportunities in the government sector',
                'content_ar' => 'إعلان عن وظائف شاغرة في عدة وزارات ومؤسسات حكومية تشمل: محاسبين، مهندسين، إداريين. للتقديم يرجى زيارة بوابة التوظيف الإلكترونية.',
                'content_en' => 'Announcement of job vacancies in several ministries and government institutions.',
                'seo_description_ar' => 'إعلان عن وظائف شاغرة في عدة وزارات ومؤسسات حكومية تشمل: محاسبين، مهندسين، إداريين.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 6,
                'published_at' => now()->subDays(5),
                'metadata' => ['type' => 'job', 'category_label' => 'توظيف'],
            ],
            [
                'title_ar' => 'إعلان هام: تحديث ساعات العمل خلال شهر رمضان',
                'title_en' => 'Important: Updated working hours during Ramadan',
                'content_ar' => 'تعلن الوزارة عن تحديث ساعات العمل خلال شهر رمضان المبارك، حيث ستكون ساعات العمل من الساعة 9 صباحاً حتى 2 ظهراً. نتمنى للجميع صياماً مقبولاً.',
                'content_en' => 'The ministry announces updated working hours during the holy month of Ramadan.',
                'seo_description_ar' => 'تعلن الوزارة عن تحديث ساعات العمل خلال شهر رمضان المبارك',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 9,
                'published_at' => now()->subDays(6),
                'metadata' => ['type' => 'urgent', 'category_label' => 'إداري'],
            ],
        ];

        foreach ($announcements as $item) {
            $item['slug'] = Str::slug($item['title_en'] . '-' . uniqid());
            Content::create($item);
        }
    }

    private function seedDecrees(): void
    {
        $decrees = [
            [
                'title_ar' => 'قانون تنظيم التحول الرقمي في المؤسسات الحكومية',
                'title_en' => 'Law regulating digital transformation in government institutions',
                'content_ar' => 'يحدد هذا القانون الضوابط والمعايير الخاصة بالتحول الرقمي وإلزامية الأتمتة في الوزارات. يشمل القانون تحديد الإطار الزمني للتحول وآليات التنفيذ والمتابعة.',
                'content_en' => 'This law defines the controls and standards for digital transformation and mandatory automation in ministries.',
                'seo_description_ar' => 'يحدد هذا القانون الضوابط والمعايير الخاصة بالتحول الرقمي وإلزامية الأتمتة في الوزارات.',
                'category' => 'decree',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subMonths(3),
                'metadata' => ['number' => '37', 'year' => '2024', 'decree_type' => 'قانون'],
            ],
            [
                'title_ar' => 'مرسوم تشريعي بزيادة الرواتب والأجور',
                'title_en' => 'Legislative decree increasing salaries and wages',
                'content_ar' => 'زيادة بنسبة 50% على الرواتب والأجور المقطوعة للعاملين في الدولة. يشمل المرسوم جميع العاملين في الجهات العامة والمؤسسات الحكومية.',
                'content_en' => '50% increase on salaries and fixed wages for state employees.',
                'seo_description_ar' => 'زيادة بنسبة 50% على الرواتب والأجور المقطوعة للعاملين في الدولة.',
                'category' => 'decree',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subMonths(5),
                'metadata' => ['number' => '12', 'year' => '2024', 'decree_type' => 'مرسوم تشريعي'],
            ],
            [
                'title_ar' => 'قرار بتسهيل إجراءات ترخيص المشاريع الصغيرة',
                'title_en' => 'Decision to facilitate small project licensing procedures',
                'content_ar' => 'تبسيط الإجراءات الإدارية وتخفيض الرسوم لدعم المشاريع الصغيرة والمتناهية الصغر. يهدف القرار إلى تشجيع ريادة الأعمال وخلق فرص عمل جديدة.',
                'content_en' => 'Simplification of administrative procedures and fee reduction to support small and micro projects.',
                'seo_description_ar' => 'تبسيط الإجراءات الإدارية وتخفيض الرسوم لدعم المشاريع الصغيرة والمتناهية الصغر.',
                'category' => 'decree',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subMonths(8),
                'metadata' => ['number' => '105', 'year' => '2023', 'decree_type' => 'قرار رئاسي'],
            ],
            [
                'title_ar' => 'قانون حماية المستهلك الجديد',
                'title_en' => 'New Consumer Protection Law',
                'content_ar' => 'تشديد العقوبات على المخالفات التموينية وضبط الأسواق. يتضمن القانون آليات جديدة للرقابة على الأسعار وحماية حقوق المستهلكين.',
                'content_en' => 'Tightening penalties for supply violations and market control.',
                'seo_description_ar' => 'تشديد العقوبات على المخالفات التموينية وضبط الأسواق.',
                'category' => 'decree',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subMonths(10),
                'metadata' => ['number' => '8', 'year' => '2023', 'decree_type' => 'قانون'],
            ],
            [
                'title_ar' => 'تعميم بخصوص دوام الجهات العامة في شهر رمضان',
                'title_en' => 'Circular regarding public sector working hours during Ramadan',
                'content_ar' => 'تحديد ساعات الدوام الرسمي في شهر رمضان المبارك. يبدأ الدوام من الساعة التاسعة صباحاً وينتهي في الساعة الثانية ظهراً.',
                'content_en' => 'Determining official working hours during the holy month of Ramadan.',
                'seo_description_ar' => 'تحديد ساعات الدوام الرسمي في شهر رمضان المبارك.',
                'category' => 'decree',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subMonths(2),
                'metadata' => ['number' => '4', 'year' => '2024', 'decree_type' => 'تعميم'],
            ],
        ];

        foreach ($decrees as $item) {
            $item['slug'] = Str::slug($item['title_en'] . '-' . uniqid());
            Content::create($item);
        }
    }

    private function seedServices(): void
    {
        $services = [
            // Ministry of Interior (d1)
            ['title_ar' => 'إصدار جواز سفر إلكتروني', 'title_en' => 'Electronic Passport Issuance', 'content_ar' => 'تقديم طلب للحصول على جواز سفر جديد أو تجديده إلكترونياً. يمكنك تتبع حالة الطلب والحصول على موعد لاستلام الجواز.', 'content_en' => 'Apply for a new passport or renew electronically.', 'seo_description_ar' => 'تقديم طلب للحصول على جواز سفر جديد أو تجديده إلكترونياً.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => true]],
            ['title_ar' => 'خلاصة سجل عدلي (غير محكوم)', 'title_en' => 'Criminal Record Certificate', 'content_ar' => 'الحصول على وثيقة غير محكوم إلكترونياً. خدمة متاحة للمواطنين السوريين والمقيمين.', 'content_en' => 'Get a criminal record certificate electronically.', 'seo_description_ar' => 'الحصول على وثيقة غير محكوم إلكترونياً.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => true]],
            ['title_ar' => 'دفع المخالفات المرورية', 'title_en' => 'Traffic Violation Payment', 'content_ar' => 'الاستعلام عن المخالفات المرورية وتسديدها إلكترونياً. يمكنك الدفع باستخدام البطاقات المصرفية أو الدفع الإلكتروني.', 'content_en' => 'Inquire and pay traffic violations electronically.', 'seo_description_ar' => 'الاستعلام عن المخالفات المرورية وتسديدها.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => true]],

            // Ministry of Justice (d2)
            ['title_ar' => 'الوكالات العدلية', 'title_en' => 'Legal Powers of Attorney', 'content_ar' => 'حجز موعد لتوثيق الوكالات العدلية. يمكنك اختيار الكاتب بالعدل والموعد المناسب.', 'content_en' => 'Book an appointment for legal power of attorney documentation.', 'seo_description_ar' => 'حجز موعد لتوثيق الوكالات العدلية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd2', 'is_digital' => false]],
            ['title_ar' => 'بيان ملكية عقارية', 'title_en' => 'Property Ownership Statement', 'content_ar' => 'الحصول على بيان يوضح الملكيات العقارية. خدمة إلكترونية متاحة على مدار الساعة.', 'content_en' => 'Get a statement showing real estate ownership.', 'seo_description_ar' => 'الحصول على بيان يوضح الملكيات العقارية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd2', 'is_digital' => true]],

            // Ministry of Health (d3)
            ['title_ar' => 'نتائج التحاليل الطبية', 'title_en' => 'Medical Test Results', 'content_ar' => 'الاطلاع على نتائج التحاليل من المخابر المعتمدة. تصلك إشعارات فورية عند صدور النتائج.', 'content_en' => 'View test results from accredited laboratories.', 'seo_description_ar' => 'الاطلاع على نتائج التحاليل من المخابر المعتمدة.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd3', 'is_digital' => true]],

            // Ministry of Education (d4)
            ['title_ar' => 'نتائج الامتحانات العامة', 'title_en' => 'Public Exam Results', 'content_ar' => 'عرض نتائج الشهادات الإعدادية والثانوية. يمكنك طباعة بيان العلامات مباشرة.', 'content_en' => 'View middle and high school certificate results.', 'seo_description_ar' => 'عرض نتائج الشهادات الإعدادية والثانوية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd4', 'is_digital' => true]],
            ['title_ar' => 'تسلسل دراسي', 'title_en' => 'Academic Transcript', 'content_ar' => 'طلب وثيقة تسلسل دراسي من المؤسسات التعليمية. الخدمة متاحة لجميع المراحل الدراسية.', 'content_en' => 'Request academic transcript from educational institutions.', 'seo_description_ar' => 'طلب وثيقة تسلسل دراسي من المؤسسات التعليمية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd4', 'is_digital' => false]],

            // Ministry of Higher Education (d5)
            ['title_ar' => 'المفاضلة الجامعية', 'title_en' => 'University Admission', 'content_ar' => 'التقدم للمفاضلة الجامعية للعام الدراسي. اختر رغباتك وتتبع نتائج المفاضلة إلكترونياً.', 'content_en' => 'Apply for university admission for the academic year.', 'seo_description_ar' => 'التقدم للمفاضلة الجامعية للعام الدراسي.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd5', 'is_digital' => true]],
            ['title_ar' => 'كشف علامات جامعي', 'title_en' => 'University Grade Transcript', 'content_ar' => 'استخراج كشف علامات للسنوات الدراسية. متاح باللغتين العربية والإنجليزية.', 'content_en' => 'Extract grade transcript for academic years.', 'seo_description_ar' => 'استخراج كشف علامات للسنوات الدراسية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd5', 'is_digital' => true]],

            // Ministry of Electricity (d6)
            ['title_ar' => 'دفع فاتورة الكهرباء', 'title_en' => 'Electricity Bill Payment', 'content_ar' => 'تسديد فواتير الكهرباء إلكترونياً. يمكنك الاطلاع على سجل الفواتير والاستهلاك.', 'content_en' => 'Pay electricity bills electronically.', 'seo_description_ar' => 'تسديد فواتير الكهرباء إلكترونياً.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd6', 'is_digital' => true]],
            ['title_ar' => 'طلب عداد جديد', 'title_en' => 'New Meter Request', 'content_ar' => 'تقديم طلب لتركيب عداد كهرباء جديد. تتبع حالة الطلب إلكترونياً.', 'content_en' => 'Apply for new electricity meter installation.', 'seo_description_ar' => 'تقديم طلب لتركيب عداد كهرباء جديد.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd6', 'is_digital' => false]],

            // Ministry of Water Resources (d7)
            ['title_ar' => 'دفع فاتورة المياه', 'title_en' => 'Water Bill Payment', 'content_ar' => 'تسديد فواتير المياه إلكترونياً. احصل على إيصال إلكتروني فوري.', 'content_en' => 'Pay water bills electronically.', 'seo_description_ar' => 'تسديد فواتير المياه إلكترونياً.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd7', 'is_digital' => true]],

            // Ministry of Transport (d8)
            ['title_ar' => 'تجديد ترخيص مركبة', 'title_en' => 'Vehicle License Renewal', 'content_ar' => 'تجديد ترسيم المركبات إلكترونياً. الدفع متاح عبر البطاقات المصرفية.', 'content_en' => 'Renew vehicle registration electronically.', 'seo_description_ar' => 'تجديد ترسيم المركبات إلكترونياً.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd8', 'is_digital' => true]],

            // Ministry of Communications (d9)
            ['title_ar' => 'بوابة خدمة المواطن', 'title_en' => 'Citizen Service Portal', 'content_ar' => 'منصة موحدة لكافة الخدمات الإلكترونية. الوصول لأكثر من 100 خدمة حكومية من مكان واحد.', 'content_en' => 'Unified platform for all electronic services.', 'seo_description_ar' => 'منصة موحدة لكافة الخدمات الإلكترونية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd9', 'is_digital' => true]],

            // Ministry of Finance (d10)
            ['title_ar' => 'براءة ذمة مالية', 'title_en' => 'Financial Clearance Certificate', 'content_ar' => 'الحصول على براءة ذمة من الدوائر المالية. خدمة إلكترونية سريعة ومباشرة.', 'content_en' => 'Get financial clearance certificate from financial departments.', 'seo_description_ar' => 'الحصول على براءة ذمة من الدوائر المالية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd10', 'is_digital' => true]],
            ['title_ar' => 'التحقق الضريبي', 'title_en' => 'Tax Verification', 'content_ar' => 'خدمة التحقق من الوثائق الضريبية. تحقق من صحة الشهادات والإيصالات الضريبية.', 'content_en' => 'Tax document verification service.', 'seo_description_ar' => 'خدمة التحقق من الوثائق الضريبية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd10', 'is_digital' => true]],
        ];

        foreach ($services as $item) {
            $item['slug'] = Str::slug($item['title_en'] . '-' . uniqid());
            $item['priority'] = 5;
            $item['published_at'] = now();
            Content::create($item);
        }
    }

    private function seedMedia(): void
    {
        $media = [
            [
                'title_ar' => 'جولة السيد الوزير في معرض دمشق الدولي',
                'title_en' => 'Minister Tour at Damascus International Fair',
                'content_ar' => 'جولة تفقدية للسيد الوزير في أجنحة معرض دمشق الدولي والاطلاع على المنتجات المحلية والعالمية المشاركة.',
                'content_en' => 'Minister inspection tour at Damascus International Fair pavilions.',
                'seo_description_ar' => 'جولة السيد الوزير في معرض دمشق الدولي',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'media_type' => 'video',
                    'thumbnail' => '/storage/images/media/media-1.jpg',
                    'duration' => '12:30'
                ],
            ],
            [
                'title_ar' => 'افتتاح محطة توليد الكهرباء الجديدة',
                'title_en' => 'Opening of New Power Generation Plant',
                'content_ar' => 'حفل افتتاح محطة توليد الكهرباء الجديدة التي ستساهم في تحسين واقع الطاقة الكهربائية.',
                'content_en' => 'Opening ceremony of the new power generation plant.',
                'seo_description_ar' => 'افتتاح محطة توليد الكهرباء الجديدة',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'media_type' => 'video',
                    'thumbnail' => '/storage/images/media/media-2.jpg',
                    'duration' => '05:45'
                ],
            ],
            [
                'title_ar' => 'صور من حفل تكريم المبدعين',
                'title_en' => 'Photos from Innovators Award Ceremony',
                'content_ar' => 'ألبوم صور من حفل تكريم المبدعين والمتفوقين في مختلف المجالات.',
                'content_en' => 'Photo album from the innovators and achievers award ceremony.',
                'seo_description_ar' => 'صور من حفل تكريم المبدعين',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(10),
                'metadata' => [
                    'media_type' => 'photo',
                    'thumbnail' => '/storage/images/media/media-3.jpg',
                    'count' => 24
                ],
            ],
            [
                'title_ar' => 'إحصائيات التحول الرقمي 2024',
                'title_en' => 'Digital Transformation Statistics 2024',
                'content_ar' => 'إنفوجرافيك يوضح إحصائيات ومؤشرات التحول الرقمي في المؤسسات الحكومية.',
                'content_en' => 'Infographic showing digital transformation statistics and indicators.',
                'seo_description_ar' => 'إحصائيات التحول الرقمي 2024',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(15),
                'metadata' => [
                    'media_type' => 'infographic',
                    'thumbnail' => '/storage/images/media/media-4.jpg'
                ],
            ],
            [
                'title_ar' => 'اجتماع مجلس الوزراء الأسبوعي',
                'title_en' => 'Weekly Cabinet Meeting',
                'content_ar' => 'ألبوم صور من اجتماع مجلس الوزراء الأسبوعي لمناقشة المستجدات.',
                'content_en' => 'Photo album from the weekly cabinet meeting.',
                'seo_description_ar' => 'اجتماع مجلس الوزراء الأسبوعي',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(12),
                'metadata' => [
                    'media_type' => 'photo',
                    'thumbnail' => '/storage/images/media/media-5.jpg',
                    'count' => 15
                ],
            ],
            [
                'title_ar' => 'مؤتمر الاستثمار السوري الأول',
                'title_en' => 'First Syrian Investment Conference',
                'content_ar' => 'تغطية فيديو كاملة لفعاليات مؤتمر الاستثمار السوري الأول بحضور مستثمرين محليين ودوليين.',
                'content_en' => 'Full video coverage of the First Syrian Investment Conference.',
                'seo_description_ar' => 'مؤتمر الاستثمار السوري الأول',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(20),
                'metadata' => [
                    'media_type' => 'video',
                    'thumbnail' => '/storage/images/media/media-6.jpg',
                    'duration' => '45:00'
                ],
            ],
        ];

        foreach ($media as $item) {
            $item['slug'] = Str::slug($item['title_en'] . '-' . uniqid());
            Content::create($item);
        }
    }
}
