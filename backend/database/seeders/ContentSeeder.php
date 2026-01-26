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
                'title_ar' => 'وزارة الاقتصاد والصناعة تطلق استراتيجية التحول الصناعي 2030',
                'title_en' => 'Ministry of Economy Launches Industrial Transformation Strategy 2030',
                'content_ar' => 'أطلقت وزارة الاقتصاد والصناعة استراتيجيتها الجديدة للتحول الصناعي التي تهدف إلى تعزيز القدرات الإنتاجية الوطنية ودعم الصناعات المحلية. تتضمن الاستراتيجية تطوير المناطق الصناعية وتقديم حوافز للمستثمرين.',
                'content_en' => 'The Ministry of Economy and Industry launched its new industrial transformation strategy aimed at enhancing national production capabilities.',
                'seo_description_ar' => 'وزارة الاقتصاد والصناعة تطلق استراتيجية التحول الصناعي 2030.',
                'category' => 'news',
                'status' => 'published',
                'featured' => true,
                'priority' => 10,
                'published_at' => now()->subDays(1),
                'metadata' => [
                    'directorate_id' => 'd1',
                    'image' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '5 دقائق',
                    'category_label' => 'استراتيجية'
                ],
            ],
            // Breaking/Urgent News - d1 (Industry)
            [
                'title_ar' => 'افتتاح معرض دمشق الدولي بمشاركة أكثر من 40 دولة',
                'title_en' => 'Damascus International Fair Opens with Over 40 Countries Participating',
                'content_ar' => 'افتتح السيد الوزير معرض دمشق الدولي في دورته الجديدة بمشاركة أكثر من 40 دولة و1500 شركة محلية ودولية. يستمر المعرض لمدة عشرة أيام ويضم أجنحة متخصصة في الصناعة والتجارة والتكنولوجيا.',
                'content_en' => 'The Minister inaugurated the Damascus International Fair with over 40 countries and 1500 companies participating.',
                'seo_description_ar' => 'افتتاح معرض دمشق الدولي بمشاركة أكثر من 40 دولة و1500 شركة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 9,
                'published_at' => now()->subDays(2),
                'metadata' => [
                    'directorate_id' => 'd1',
                    'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
                    'category_label' => 'معارض',
                    'is_breaking' => true
                ],
            ],
            // d2 (Economy) - SME news
            [
                'title_ar' => 'إطلاق برنامج دعم المشاريع الصغيرة والمتوسطة بتمويل 50 مليار ليرة',
                'title_en' => 'Launch of SME Support Program with 50 Billion SYP Funding',
                'content_ar' => 'أعلنت هيئة تنمية المشروعات الصغيرة والمتوسطة عن إطلاق برنامج تمويلي جديد بقيمة 50 مليار ليرة سورية لدعم رواد الأعمال والمشاريع الناشئة. يتضمن البرنامج قروضاً ميسرة وبرامج تدريب وإرشاد.',
                'content_en' => 'The SME Development Authority announced a new 50 billion SYP funding program for entrepreneurs.',
                'seo_description_ar' => 'إطلاق برنامج دعم المشاريع الصغيرة والمتوسطة بتمويل 50 مليار ليرة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'published_at' => now()->subDays(3),
                'metadata' => [
                    'directorate_id' => 'd2',
                    'image' => 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800',
                    'category_label' => 'تمويل',
                    'is_breaking' => true
                ],
            ],
            // d1 (Industry)
            [
                'title_ar' => 'تعديل قانون الاستثمار لتشجيع الصناعات التحويلية',
                'title_en' => 'Investment Law Amendment to Encourage Manufacturing Industries',
                'content_ar' => 'صدر المرسوم التشريعي بتعديل قانون الاستثمار ليشمل حوافز إضافية للصناعات التحويلية والتصديرية. يتضمن التعديل إعفاءات ضريبية وتسهيلات جمركية للمستثمرين.',
                'content_en' => 'A legislative decree was issued amending the investment law to include additional incentives for manufacturing.',
                'seo_description_ar' => 'تعديل قانون الاستثمار لتشجيع الصناعات التحويلية والتصديرية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'published_at' => now()->subDays(4),
                'metadata' => [
                    'directorate_id' => 'd1',
                    'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
                    'category_label' => 'تشريعات',
                    'is_breaking' => true
                ],
            ],
            // d1 (Industry)
            [
                'title_ar' => 'افتتاح المنطقة الصناعية الجديدة في حلب',
                'title_en' => 'Opening of New Industrial Zone in Aleppo',
                'content_ar' => 'افتتح السيد الوزير المنطقة الصناعية الجديدة في حلب بمساحة 500 هكتار. تتضمن المنطقة بنية تحتية متكاملة ومرافق خدمية للمنشآت الصناعية.',
                'content_en' => 'The Minister inaugurated the new industrial zone in Aleppo spanning 500 hectares.',
                'seo_description_ar' => 'افتتاح المنطقة الصناعية الجديدة في حلب بمساحة 500 هكتار.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'directorate_id' => 'd1',
                    'image' => 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800',
                    'category_label' => 'مناطق صناعية'
                ],
            ],
            // d2 (Economy) - Grid Articles
            [
                'title_ar' => 'توقيع اتفاقيات تجارية مع 5 دول عربية',
                'title_en' => 'Signing Trade Agreements with 5 Arab Countries',
                'content_ar' => 'وقعت وزارة الاقتصاد والصناعة اتفاقيات تبادل تجاري مع خمس دول عربية لتعزيز الصادرات السورية. تتضمن الاتفاقيات تسهيلات جمركية وحصص تفضيلية.',
                'content_en' => 'The Ministry signed trade agreements with five Arab countries to boost Syrian exports.',
                'seo_description_ar' => 'توقيع اتفاقيات تبادل تجاري مع خمس دول عربية لتعزيز الصادرات.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'published_at' => now()->subDays(6),
                'metadata' => [
                    'directorate_id' => 'd2',
                    'image' => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800',
                    'author' => 'الإدارة العامة للاقتصاد',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تجارة خارجية'
                ],
            ],
            // d1 (Industry)
            [
                'title_ar' => 'إطلاق منصة التراخيص الصناعية الإلكترونية',
                'title_en' => 'Launch of Electronic Industrial Licensing Platform',
                'content_ar' => 'أطلقت الوزارة منصة إلكترونية جديدة لإصدار التراخيص الصناعية تختصر الإجراءات من 30 يوماً إلى 5 أيام. المنصة متاحة على مدار الساعة.',
                'content_en' => 'The Ministry launched a new electronic platform for industrial licenses reducing processing from 30 to 5 days.',
                'seo_description_ar' => 'إطلاق منصة إلكترونية جديدة لإصدار التراخيص الصناعية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'directorate_id' => 'd1',
                    'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
                    'author' => 'الإدارة العامة للصناعة',
                    'read_time' => '4 دقائق',
                    'category_label' => 'خدمات إلكترونية'
                ],
            ],
            // d3 (Internal Trade & Consumer Protection)
            [
                'title_ar' => 'مهرجان التسوق صنع في سوريا',
                'title_en' => 'Made in Syria Shopping Festival',
                'content_ar' => 'انطلاق فعاليات مهرجان التسوق "صنع في سوريا" بمشاركة أكثر من 200 شركة صناعية. يهدف المهرجان إلى دعم المنتج المحلي وتشجيع الصناعة الوطنية.',
                'content_en' => 'Launch of the "Made in Syria" shopping festival with over 200 industrial companies participating.',
                'seo_description_ar' => 'انطلاق مهرجان التسوق صنع في سوريا بمشاركة 200 شركة صناعية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'published_at' => now()->subDays(8),
                'metadata' => [
                    'directorate_id' => 'd3',
                    'image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
                    'author' => 'غرفة صناعة دمشق',
                    'read_time' => '2 دقائق',
                    'category_label' => 'فعاليات'
                ],
            ],
            // d3 (Internal Trade & Consumer Protection) - Additional news
            [
                'title_ar' => 'حملة رقابية على الأسواق لضبط الأسعار',
                'title_en' => 'Market Control Campaign to Regulate Prices',
                'content_ar' => 'نفذت الإدارة العامة للتجارة الداخلية وحماية المستهلك حملة رقابية مكثفة على الأسواق أسفرت عن ضبط مخالفات سعرية وتحرير محاضر ضبط.',
                'content_en' => 'The General Administration for Internal Trade executed a market control campaign resulting in price violation fines.',
                'seo_description_ar' => 'حملة رقابية على الأسواق لضبط الأسعار والمخالفات التموينية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'published_at' => now()->subDays(9),
                'metadata' => [
                    'directorate_id' => 'd3',
                    'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
                    'author' => 'الإدارة العامة للتجارة الداخلية',
                    'read_time' => '3 دقائق',
                    'category_label' => 'حماية المستهلك'
                ],
            ],
            // d2 (Economy) - Additional news
            [
                'title_ar' => 'ورشة عمل لدعم رواد الأعمال الشباب',
                'title_en' => 'Workshop to Support Young Entrepreneurs',
                'content_ar' => 'نظمت هيئة تنمية المشروعات الصغيرة والمتوسطة ورشة عمل تدريبية لدعم رواد الأعمال الشباب في تطوير خطط أعمالهم.',
                'content_en' => 'The SME Development Authority organized a training workshop to support young entrepreneurs in developing business plans.',
                'seo_description_ar' => 'ورشة عمل تدريبية لدعم رواد الأعمال الشباب.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'published_at' => now()->subDays(10),
                'metadata' => [
                    'directorate_id' => 'd2',
                    'image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
                    'author' => 'الإدارة العامة للاقتصاد',
                    'read_time' => '3 دقائق',
                    'category_label' => 'ريادة أعمال'
                ],
            ],
            // d3 (Internal Trade & Consumer Protection) - Additional news
            [
                'title_ar' => 'تسجيل علامات تجارية جديدة لمنتجات سورية',
                'title_en' => 'Registration of New Trademarks for Syrian Products',
                'content_ar' => 'أعلنت مديرية حماية الملكية التجارية والصناعية عن تسجيل 150 علامة تجارية جديدة لمنتجات سورية خلال الشهر الماضي.',
                'content_en' => 'The Intellectual Property Directorate announced registration of 150 new trademarks for Syrian products.',
                'seo_description_ar' => 'تسجيل علامات تجارية جديدة لمنتجات سورية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'published_at' => now()->subDays(11),
                'metadata' => [
                    'directorate_id' => 'd3',
                    'image' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
                    'author' => 'الإدارة العامة للتجارة الداخلية',
                    'read_time' => '2 دقائق',
                    'category_label' => 'علامات تجارية'
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
                'title_ar' => 'إعلان عن مناقصة لتجهيز المنطقة الصناعية الجديدة',
                'title_en' => 'Tender Announcement for New Industrial Zone Equipment',
                'content_ar' => 'تعلن وزارة الاقتصاد والصناعة عن مناقصة عامة لتجهيز البنية التحتية للمنطقة الصناعية الجديدة. آخر موعد للتقديم: 15/02/2026. للاطلاع على الشروط والمواصفات يرجى مراجعة مديرية المناطق الصناعية.',
                'content_en' => 'The Ministry announces a public tender for infrastructure equipment for the new industrial zone.',
                'seo_description_ar' => 'مناقصة عامة لتجهيز البنية التحتية للمنطقة الصناعية الجديدة.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(1),
                'metadata' => ['type' => 'tender', 'category_label' => 'مناقصات'],
            ],
            [
                'title_ar' => 'فتح باب التسجيل لبرنامج دعم المشاريع الصغيرة',
                'title_en' => 'SME Support Program Registration Now Open',
                'content_ar' => 'تعلن هيئة تنمية المشروعات الصغيرة والمتوسطة عن فتح باب التسجيل لبرنامج الدعم المالي والفني. البرنامج يستهدف رواد الأعمال والمشاريع الناشئة في قطاعات الصناعة والتجارة.',
                'content_en' => 'The SME Development Authority announces opening registration for financial and technical support program.',
                'seo_description_ar' => 'فتح باب التسجيل لبرنامج دعم المشاريع الصغيرة والمتوسطة.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 9,
                'published_at' => now()->subDays(2),
                'metadata' => ['type' => 'urgent', 'category_label' => 'توظيف'],
            ],
            [
                'title_ar' => 'دورة تدريبية في إدارة الجودة الصناعية',
                'title_en' => 'Industrial Quality Management Training Course',
                'content_ar' => 'تعلن هيئة المواصفات والمقاييس السورية عن دورة تدريبية في إدارة الجودة ونظام ISO للمصانع والمنشآت الصناعية. التسجيل مفتوح حتى نهاية الشهر.',
                'content_en' => 'SASMO announces a training course on quality management and ISO systems for factories.',
                'seo_description_ar' => 'دورة تدريبية في إدارة الجودة ونظام ISO للمصانع والمنشآت الصناعية.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(3),
                'metadata' => ['type' => 'general', 'category_label' => 'تدريب'],
            ],
            [
                'title_ar' => 'تحديث منصة التراخيص الصناعية',
                'title_en' => 'Industrial Licensing Platform Update',
                'content_ar' => 'سيتم تحديث منصة التراخيص الصناعية الإلكترونية يوم السبت القادم. قد يحدث انقطاع مؤقت في الخدمة من الساعة 12 ليلاً حتى 6 صباحاً.',
                'content_en' => 'The electronic industrial licensing platform will be updated next Saturday.',
                'seo_description_ar' => 'تحديث منصة التراخيص الصناعية الإلكترونية يوم السبت القادم.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(4),
                'metadata' => ['type' => 'important', 'category_label' => 'خدمات'],
            ],
            [
                'title_ar' => 'فرص استثمارية في المناطق الصناعية',
                'title_en' => 'Investment Opportunities in Industrial Zones',
                'content_ar' => 'إعلان عن فرص استثمارية جديدة في المناطق الصناعية بحلب ودمشق وحمص. حوافز خاصة للمستثمرين في الصناعات الغذائية والنسيجية.',
                'content_en' => 'New investment opportunities announced in industrial zones of Aleppo, Damascus, and Homs.',
                'seo_description_ar' => 'فرص استثمارية جديدة في المناطق الصناعية بحوافز خاصة.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 6,
                'published_at' => now()->subDays(5),
                'metadata' => ['type' => 'job', 'category_label' => 'استثمار'],
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
            [
                'title_ar' => 'ورشة عمل حول الأمن السيبراني',
                'title_en' => 'Cybersecurity Workshop',
                'content_ar' => 'دعوة للمشاركة في ورشة عمل حول الأمن السيبراني وحماية البيانات. الورشة مجانية ومفتوحة لجميع الموظفين الحكوميين.',
                'content_en' => 'Invitation to participate in a workshop on cybersecurity and data protection.',
                'seo_description_ar' => 'دعوة للمشاركة في ورشة عمل حول الأمن السيبراني وحماية البيانات.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 6,
                'published_at' => now()->subDays(7),
                'metadata' => ['type' => 'general', 'category_label' => 'تدريب'],
            ],
            [
                'title_ar' => 'إطلاق تطبيق الهاتف المحمول للخدمات الحكومية',
                'title_en' => 'Launch of Government Services Mobile App',
                'content_ar' => 'تم إطلاق تطبيق الهاتف المحمول الجديد الذي يتيح الوصول لأكثر من 50 خدمة حكومية. التطبيق متاح على أندرويد وآيفون.',
                'content_en' => 'New mobile application launched providing access to over 50 government services.',
                'seo_description_ar' => 'تم إطلاق تطبيق الهاتف المحمول الجديد الذي يتيح الوصول لأكثر من 50 خدمة حكومية.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(8),
                'metadata' => ['type' => 'important', 'category_label' => 'تكنولوجيا'],
            ],
            [
                'title_ar' => 'برنامج دعم المشاريع الريادية الشبابية',
                'title_en' => 'Youth Entrepreneurship Support Program',
                'content_ar' => 'إطلاق برنامج جديد لدعم المشاريع الريادية للشباب بتمويل يصل إلى 10 ملايين ليرة سورية. التقديم متاح حتى نهاية الشهر.',
                'content_en' => 'New program launched to support youth entrepreneurial projects with funding up to 10 million Syrian pounds.',
                'seo_description_ar' => 'إطلاق برنامج جديد لدعم المشاريع الريادية للشباب بتمويل يصل إلى 10 ملايين ليرة سورية.',
                'category' => 'announcement',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(9),
                'metadata' => ['type' => 'general', 'category_label' => 'اقتصاد'],
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
                'metadata' => ['number' => '37', 'year' => '2024', 'decree_type' => 'قانون', 'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'],
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
            // الإدارة العامة للصناعة (d1) - General Administration for Industry
            ['title_ar' => 'ترخيص منشأة صناعية', 'title_en' => 'Industrial Facility License', 'content_ar' => 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة أو توسيع منشأة قائمة. يتضمن الطلب دراسة الجدوى والتراخيص البيئية.', 'content_en' => 'Apply for a license to establish a new industrial facility or expand an existing one.', 'seo_description_ar' => 'تقديم طلب للحصول على ترخيص منشأة صناعية جديدة.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => true]],
            ['title_ar' => 'تسجيل سجل صناعي', 'title_en' => 'Industrial Registry Registration', 'content_ar' => 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني. الحصول على رقم تسجيل صناعي رسمي.', 'content_en' => 'Register industrial establishments in the national industrial registry.', 'seo_description_ar' => 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => true]],
            ['title_ar' => 'شهادة المطابقة والجودة', 'title_en' => 'Quality Conformity Certificate', 'content_ar' => 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية السورية. خدمة من هيئة المواصفات والمقاييس.', 'content_en' => 'Obtain product conformity certificate to Syrian standards.', 'seo_description_ar' => 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => false]],
            ['title_ar' => 'تخصيص قطعة أرض صناعية', 'title_en' => 'Industrial Land Allocation', 'content_ar' => 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية. متابعة حالة الطلب إلكترونياً.', 'content_en' => 'Apply for industrial land allocation in industrial zones.', 'seo_description_ar' => 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => true]],
            ['title_ar' => 'فحص المعادن الثمينة', 'title_en' => 'Precious Metals Testing', 'content_ar' => 'خدمة فحص وتحليل المعادن الثمينة ودمغها. من هيئة إدارة المعادن الثمينة.', 'content_en' => 'Precious metals testing, analysis and hallmarking service.', 'seo_description_ar' => 'خدمة فحص وتحليل المعادن الثمينة ودمغها.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd1', 'is_digital' => false]],

            // الإدارة العامة للاقتصاد (d2) - General Administration for Economy
            ['title_ar' => 'إجازة استيراد', 'title_en' => 'Import License', 'content_ar' => 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد الأولية. متابعة حالة الطلب إلكترونياً.', 'content_en' => 'Apply for import license for goods and raw materials.', 'seo_description_ar' => 'تقديم طلب للحصول على إجازة استيراد.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd2', 'is_digital' => true]],
            ['title_ar' => 'إجازة تصدير', 'title_en' => 'Export License', 'content_ar' => 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية. دعم الصادرات الوطنية.', 'content_en' => 'Apply for export license for Syrian products.', 'seo_description_ar' => 'تقديم طلب للحصول على إجازة تصدير.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd2', 'is_digital' => true]],
            ['title_ar' => 'تمويل المشاريع الصغيرة', 'title_en' => 'SME Financing', 'content_ar' => 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة. قروض ميسرة وبرامج احتضان.', 'content_en' => 'SME support and financing programs. Facilitated loans and incubation.', 'seo_description_ar' => 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd2', 'is_digital' => true]],
            ['title_ar' => 'المشاركة في المعارض الدولية', 'title_en' => 'International Exhibition Participation', 'content_ar' => 'تسجيل الشركات للمشاركة في معرض دمشق الدولي والمعارض التخصصية.', 'content_en' => 'Register companies to participate in Damascus International Fair.', 'seo_description_ar' => 'تسجيل الشركات للمشاركة في المعارض الدولية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd2', 'is_digital' => true]],
            ['title_ar' => 'دراسات السياسات الاقتصادية', 'title_en' => 'Economic Policy Studies', 'content_ar' => 'طلب دراسات وتقارير اقتصادية متخصصة. تحليلات السوق والمؤشرات الاقتصادية.', 'content_en' => 'Request specialized economic studies and reports.', 'seo_description_ar' => 'طلب دراسات وتقارير اقتصادية متخصصة.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd2', 'is_digital' => true]],

            // الإدارة العامة للتجارة الداخلية وحماية المستهلك (d3) - Internal Trade & Consumer Protection
            ['title_ar' => 'تسجيل شركة تجارية', 'title_en' => 'Commercial Company Registration', 'content_ar' => 'تسجيل الشركات التجارية في السجل التجاري. الحصول على رقم تجاري رسمي.', 'content_en' => 'Register commercial companies in the commercial registry.', 'seo_description_ar' => 'تسجيل الشركات التجارية في السجل التجاري.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd3', 'is_digital' => true]],
            ['title_ar' => 'شكوى حماية المستهلك', 'title_en' => 'Consumer Protection Complaint', 'content_ar' => 'تقديم شكوى في حال التعرض للغش التجاري أو المخالفات السعرية. متابعة حالة الشكوى.', 'content_en' => 'File a complaint for commercial fraud or price violations.', 'seo_description_ar' => 'تقديم شكوى في حال التعرض للغش التجاري.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd3', 'is_digital' => true]],
            ['title_ar' => 'الاستعلام عن الأسعار', 'title_en' => 'Price Inquiry', 'content_ar' => 'الاستعلام عن الأسعار الرسمية للمواد الأساسية والمحروقات. نشرات الأسعار اليومية.', 'content_en' => 'Inquire about official prices for basic materials and fuel.', 'seo_description_ar' => 'الاستعلام عن الأسعار الرسمية للمواد الأساسية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd3', 'is_digital' => true]],
            ['title_ar' => 'تسجيل علامة تجارية', 'title_en' => 'Trademark Registration', 'content_ar' => 'تسجيل وحماية العلامات التجارية. البحث في قاعدة بيانات العلامات المسجلة.', 'content_en' => 'Register and protect trademarks. Search registered trademarks database.', 'seo_description_ar' => 'تسجيل وحماية العلامات التجارية.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd3', 'is_digital' => true]],
            ['title_ar' => 'ترخيص نشاط تجاري', 'title_en' => 'Commercial Activity License', 'content_ar' => 'الحصول على ترخيص لممارسة النشاط التجاري. تجديد التراخيص إلكترونياً.', 'content_en' => 'Obtain a license to practice commercial activity.', 'seo_description_ar' => 'الحصول على ترخيص لممارسة النشاط التجاري.', 'category' => 'service', 'status' => 'published', 'metadata' => ['directorate_id' => 'd3', 'is_digital' => true]],
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
                    'thumbnail' => 'https://images.unsplash.com/photo-1492619375932-d0234a62176c?auto=format&fit=crop&q=80&w=800',
                    'duration' => '12:30'
                ],
            ],
            [
                'title_ar' => 'افتتاح المنطقة الصناعية الجديدة في حلب',
                'title_en' => 'Opening of New Industrial Zone in Aleppo',
                'content_ar' => 'حفل افتتاح المنطقة الصناعية الجديدة في حلب بحضور السيد الوزير ومسؤولين حكوميين.',
                'content_en' => 'Opening ceremony of the new industrial zone in Aleppo.',
                'seo_description_ar' => 'افتتاح المنطقة الصناعية الجديدة في حلب',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'media_type' => 'video',
                    'thumbnail' => 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800',
                    'duration' => '05:45'
                ],
            ],
            [
                'title_ar' => 'صور من حفل تكريم الصناعيين المتميزين',
                'title_en' => 'Photos from Outstanding Industrialists Award Ceremony',
                'content_ar' => 'ألبوم صور من حفل تكريم الصناعيين والمصدرين المتميزين في القطاع الصناعي السوري.',
                'content_en' => 'Photo album from the ceremony honoring outstanding industrialists and exporters.',
                'seo_description_ar' => 'صور من حفل تكريم الصناعيين المتميزين',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(10),
                'metadata' => [
                    'media_type' => 'photo',
                    'thumbnail' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
                    'count' => 24
                ],
            ],
            [
                'title_ar' => 'إحصائيات الصادرات السورية 2026',
                'title_en' => 'Syrian Export Statistics 2026',
                'content_ar' => 'إنفوجرافيك يوضح إحصائيات الصادرات السورية وأهم الأسواق المستهدفة.',
                'content_en' => 'Infographic showing Syrian export statistics and main target markets.',
                'seo_description_ar' => 'إحصائيات الصادرات السورية 2026',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(15),
                'metadata' => [
                    'media_type' => 'infographic',
                    'thumbnail' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
                ],
            ],
            [
                'title_ar' => 'اجتماع مع وفد تجاري أردني',
                'title_en' => 'Meeting with Jordanian Trade Delegation',
                'content_ar' => 'ألبوم صور من اجتماع السيد الوزير مع الوفد التجاري الأردني لبحث التعاون الاقتصادي.',
                'content_en' => 'Photo album from the Minister meeting with Jordanian trade delegation.',
                'seo_description_ar' => 'اجتماع مع وفد تجاري أردني',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(12),
                'metadata' => [
                    'media_type' => 'photo',
                    'thumbnail' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
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
                    'thumbnail' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
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
