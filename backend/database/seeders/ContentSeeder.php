<?php

namespace Database\Seeders;

use App\Models\Content;
use App\Models\ContentAttachment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing content and attachments
        ContentAttachment::truncate();
        Content::truncate();

        // Seed all content types
        $this->seedNews();
        $this->seedAnnouncements();
        $this->seedDecrees();
        $this->seedServices();
        $this->seedMedia();
        $this->seedOpenData();
    }

    private function seedNews(): void
    {
        $news = [
            // Article 1 — Omran Syria / Egypt Clinker MOU (المديرية العامة للصناعة)
            [
                'title_ar' => 'شركة عمران السورية تعزّز شراكاتها في مصر وتوقّع مذكرة تفاهم لتوريد الكلنكر',
                'title_en' => 'Omran Syria Strengthens Partnerships in Egypt and Signs Clinker Supply MOU',
                'content_ar' => 'زارت شركة عمران السورية جمهورية مصر العربية لتعزيز التعاون الصناعي وتبادل الخبرات في قطاع الإسمنت، ضمن جهودها لتطوير الإنتاج ورفع الكفاءة في السوق السورية.' . "\n\n" .
                    'شملت الزيارة عدداً من الشركات المصرية ذات الخبرات الدولية في صناعة الإسمنت؛ بما في ذلك شركات متخصصة في التصنيع الميكانيكي لمعدات صناعة الإسمنت، وأخرى تعمل في الخدمات اللوجستية وتوريد مادة الكلنكر.' . "\n\n" .
                    'وأكد المدير العام لشركة عمران "محمود فضيلة" أن هذه الشراكات تعكس حرص الشركة على تعزيز التعاون الصناعي والاستفادة من الخبرات الفنية الدولية، بما يسهم في رفع مستوى الإنتاج والكفاءة.' . "\n\n" .
                    'وخلال الزيارة، تم توقيع مذكرة تفاهم مع شركة سيسكو لتأمين مادة الكلنكر؛ وذلك في إطار دعم سلاسل التوريد وتطوير قطاع الإسمنت بما يخدم المصالح المشتركة بين الجانبين.' . "\n\n" .
                    'كما شملت الزيارة اجتماعاً مع غرفة تجارة القاهرة، حيث تم مناقشة أهمية قطاع الإسمنت وبناء شراكات استراتيجية بين البلدين لتعزيز التعاون الصناعي والتجاري المستدام.',
                'content_en' => 'Omran Syria visited Egypt to strengthen industrial cooperation in the cement sector. The visit included meetings with Egyptian companies specializing in cement manufacturing equipment and logistics. A memorandum of understanding was signed with CESCO for clinker supply, and discussions were held at the Cairo Chamber of Commerce on strategic partnerships between the two countries.',
                'seo_description_ar' => 'شركة عمران السورية تزور مصر وتوقّع مذكرة تفاهم مع سيسكو لتوريد الكلنكر وتعزيز التعاون الصناعي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => true,
                'priority' => 10,
                'published_at' => now()->subDays(1),
                'metadata' => [
                    'directorate_id' => 'd1',
                    'image' => '/storage/images/news/omran-egypt-featured.jpeg',
                    'images' => [
                        '/storage/images/news/omran-egypt-featured.jpeg',
                        '/storage/images/news/omran-egypt-1.jpeg',
                        '/storage/images/news/omran-egypt-2.jpeg',
                        '/storage/images/news/omran-egypt-3.jpeg',
                        '/storage/images/news/omran-egypt-4.jpeg',
                        '/storage/images/news/omran-egypt-5.jpeg',
                        '/storage/images/news/omran-egypt-6.jpeg',
                        '/storage/images/news/omran-egypt-7.jpeg',
                        '/storage/images/news/omran-egypt-8.jpeg',
                        '/storage/images/news/omran-egypt-9.jpeg',
                        '/storage/images/news/omran-egypt-10.jpeg',
                        '/storage/images/news/omran-egypt-11.jpeg',
                        '/storage/images/news/omran-egypt-12.jpeg',
                        '/storage/images/news/omran-egypt-13.jpeg',
                        '/storage/images/news/omran-egypt-14.jpeg',
                        '/storage/images/news/omran-egypt-15.jpeg',
                        '/storage/images/news/omran-egypt-16.jpeg',
                    ],
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '5 دقائق',
                    'category_label' => 'شراكات صناعية',
                ],
                'tags' => ['صناعة', 'اتفاقيات', 'إسمنت', 'مصر', 'كلنكر'],
            ],
            // Article 2 — Deir ez-Zor Industrial Meeting (المديرية العامة للصناعة)
            [
                'title_ar' => 'اجتماع صناعي في دير الزور لبحث إعادة تأهيل المعامل المتضررة',
                'title_en' => 'Industrial Meeting in Deir ez-Zor to Discuss Rehabilitation of Damaged Factories',
                'content_ar' => 'عقد "ثامر العبود" المكلّف بمتابعة الفعاليات الصناعية في دير الزور اجتماعاً ضمّ مديري معامل السكر والنسيج والمحالج والورق، بمشاركة رئيس غرفة التجارة والصناعة في المحافظة، وحضور عضو المكتب التنفيذي لشؤون الصناعة ومدير المدينة الصناعية؛ لمعالجة التحديات والصعوبات التي تواجه القطاع الصناعي.' . "\n\n" .
                    'وناقش الاجتماع إمكانية إعادة تأهيل وتشغيل المعامل المتضررة، ووضع الخطط اللازمة لاستئناف النشاط الصناعي بعد تحرير المنطقة من سيطرة "قسد"؛ بما يسهم في دعم الاقتصاد المحلي وتأمين فرص عمل لأبناء المحافظة.',
                'content_en' => 'An industrial meeting was held in Deir ez-Zor with factory directors of sugar, textile, ginning, and paper plants, along with the Chamber of Commerce president, to address challenges facing the industrial sector and discuss rehabilitation of damaged factories to resume industrial activity and support the local economy.',
                'seo_description_ar' => 'اجتماع صناعي في دير الزور لبحث إعادة تأهيل وتشغيل المعامل المتضررة ودعم الاقتصاد المحلي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 9,
                'published_at' => now()->subDays(2),
                'metadata' => [
                    'directorate_id' => 'd1',
                    'image' => '/storage/images/news/deir-ezzor-meeting-featured.jpeg',
                    'images' => [
                        '/storage/images/news/deir-ezzor-meeting-featured.jpeg',
                        '/storage/images/news/deir-ezzor-meeting-2.jpeg',
                        '/storage/images/news/deir-ezzor-meeting-3.jpeg',
                    ],
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'إعادة تأهيل',
                ],
                'tags' => ['صناعة', 'دير الزور', 'إعادة تأهيل'],
            ],
            // Article 3 — Riyadh Cables Group (أخبار المديرية المركزية)
            [
                'title_ar' => 'مجموعة كابلات الرياض تدخل السوق السورية بشراكة استراتيجية لتعزيز صناعة الكابلات ودعم الاقتصاد الوطني',
                'title_en' => 'Riyadh Cables Group Enters Syrian Market with Strategic Partnership to Boost Cable Industry',
                'content_ar' => 'في إطار الحراك الصناعي المتنامي في قطاع الطاقة، شاركت هيئة المواصفات والمقاييس العربية السورية في المؤتمر الأول الذي أقامته مجموعة كابلات الرياض في دمشق، بمشاركة واسعة من صنّاع القرار والخبراء والمختصين.' . "\n\n" .
                    'وشكّل المؤتمر محطة بارزة مع إعلان مجموعة كابلات الرياض بدء نشاطها في السوق السورية عبر شراكة إستراتيجية مع الشركة السورية للكابلات، بما يعكس ما تتمتع به المجموعة من خبرات تقنية ومعايير جودة عالمية، ويؤكد توجهها نحو الاستثمار طويل الأمد والمساهمة في جهود إعادة الإعمار.' . "\n\n" .
                    'وتندرج هذه الشراكة ضمن مساعي دعم الصناعة الوطنية وتعزيز نقل المعرفة والخبرات الفنية، بما يسهم في تطوير صناعة الكابلات في سورية ومواءمتها مع المواصفات المعتمدة، الأمر الذي ينعكس إيجاباً على جودة المنتجات المحلية ويدعم الاقتصاد الوطني.',
                'content_en' => 'Riyadh Cables Group held its first conference in Damascus, announcing its entry into the Syrian market through a strategic partnership with the Syrian Cable Company. The partnership aims to support national industry, transfer technical expertise, and develop the cable industry in Syria in alignment with approved standards.',
                'seo_description_ar' => 'مجموعة كابلات الرياض تدخل السوق السورية بشراكة استراتيجية مع الشركة السورية للكابلات.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 9,
                'published_at' => now()->subDays(3),
                'metadata' => [
                    'image' => '/storage/images/news/riyadh-cables-featured.jpeg',
                    'images' => [
                        '/storage/images/news/riyadh-cables-featured.jpeg',
                    ],
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '4 دقائق',
                    'category_label' => 'شراكات استراتيجية',
                ],
                'tags' => ['صناعة', 'كابلات', 'شراكات', 'السعودية'],
            ],
            // Article 4 — Minister visits Maskana Sugar Factory (أخبار المديرية المركزية)
            [
                'title_ar' => 'وزير الاقتصاد والصناعة يتفقد معمل سكر مسكنة ويبحث سبل إعادة تأهيله',
                'title_en' => 'Economy Minister Inspects Maskana Sugar Factory and Discusses Rehabilitation',
                'content_ar' => 'أجرى وزير الاقتصاد والصناعة الدكتور "نضال الشعار"، يرافقه نائب الوزير "باسل عبد الحنان" زيارة ميدانية إلى معمل سكر مسكنة، وذلك للاطلاع على واقعه الفني والإنتاجي، وبحث سبل إعادة تأهيله وإعادته إلى العمل.' . "\n\n" .
                    'وخلال الزيارة، اطّلع الوزير والوفد المرافق على أقسام المعمل والبنى التحتية، وجرى تقييم الأضرار والاحتياجات الفنية اللازمة لإعادة التأهيل في إطار الجهود الرامية إلى إحياء المنشآت الصناعية المتوقفة ودعم القطاع الصناعي الوطني.' . "\n\n" .
                    'وأكد الوزير الشعار أهمية معمل سكر مسكنة كمنشأة إستراتيجية، مشدداً على ضرورة وضع خطة تأهيل متكاملة تسهم في استعادة دوره الإنتاجي وتعزيز الأمن الغذائي، بما ينسجم مع توجهات الوزارة في تنشيط الصناعة المحلية.',
                'content_en' => 'Economy Minister Dr. Nidal Al-Shaar, accompanied by Deputy Minister Basel Abdel Hanan, conducted a field visit to the Maskana Sugar Factory to assess its technical and production status and discuss rehabilitation plans. The Minister emphasized the factory\'s strategic importance and the need for a comprehensive rehabilitation plan to restore its production role and strengthen food security.',
                'seo_description_ar' => 'وزير الاقتصاد والصناعة يتفقد معمل سكر مسكنة ويبحث خطة إعادة تأهيله لاستعادة دوره الإنتاجي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'published_at' => now()->subDays(4),
                'metadata' => [
                    'image' => '/storage/images/news/maskana-sugar-featured.jpeg',
                    'images' => [
                        '/storage/images/news/maskana-sugar-featured.jpeg',
                        '/storage/images/news/maskana-sugar-2.jpeg',
                    ],
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '4 دقائق',
                    'category_label' => 'زيارات ميدانية',
                ],
                'tags' => ['صناعة', 'سكر', 'إعادة تأهيل', 'مسكنة'],
            ],
            // Article 5 — MOU with Al-Maaref University (أخبار المديرية المركزية)
            [
                'title_ar' => 'مذكرة تفاهم بين وزارة الاقتصاد والصناعة وجامعة المعارف لدعم التطوير الصناعي',
                'title_en' => 'MOU Between Ministry of Economy and Al-Maaref University to Support Industrial Development',
                'content_ar' => 'وقّعت وزارة الاقتصاد والصناعة مذكرة تفاهم مع جامعة المعارف للعلوم التطبيقية الخاصة الواقعة في مدينة سرمدا، بهدف تعزيز التعاون المشترك في مجالات البحث العلمي والتطوير الصناعي، وبناء القدرات الفنية والتقنية، وتبادل الخبرات بما يخدم القطاع الصناعي الوطني.' . "\n\n" .
                    'وتهدف المذكرة إلى رفع كفاءة المنشآت الصناعية عبر تقديم خدمات استشارية وتدريبية، ودعم هيئة المواصفات والمقاييس السورية ومراكز الاختبارات الصناعية وفق المعايير الدولية، إضافة إلى توفير فرص تدريبية لطلاب الجامعة في المصانع والشركات التابعة للوزارة، والاستفادة من البنية التحتية والمخابر ومراكز الأبحاث لدى الطرفين.' . "\n\n" .
                    'وتشمل مجالات التعاون تنفيذ بحوث تطبيقية مشتركة، وتنظيم برامج تدريبية وورش عمل متخصصة، وتبادل الخبراء، والتعاون في تنظيم الفعاليات العلمية والابتكارية ذات الصلة بالقطاع الصناعي.',
                'content_en' => 'The Ministry of Economy and Industry signed an MOU with Al-Maaref University of Applied Sciences in Sarmada to enhance cooperation in scientific research, industrial development, and capacity building. The MOU covers consulting services, training programs, joint applied research, and expert exchange to support the national industrial sector.',
                'seo_description_ar' => 'مذكرة تفاهم بين وزارة الاقتصاد والصناعة وجامعة المعارف لتعزيز البحث العلمي والتطوير الصناعي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'image' => '/storage/images/news/maaref-university-featured.jpeg',
                    'images' => [
                        '/storage/images/news/maaref-university-featured.jpeg',
                        '/storage/images/news/maaref-university-2.jpeg',
                        '/storage/images/news/maaref-university-3.jpeg',
                    ],
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '4 دقائق',
                    'category_label' => 'اتفاقيات',
                ],
                'tags' => ['اتفاقيات', 'جامعات', 'بحث علمي', 'تطوير صناعي'],
            ],
            // Article 6 — Gulfood 2026 Dubai (المديرية العامة للاقتصاد)
            [
                'title_ar' => 'مدير عام هيئة تنمية ودعم الإنتاج المحلي والصادرات يجري جولة على أجنحة الشركات السورية في معرض جولفود 2026 بدبي',
                'title_en' => 'Director General Tours Syrian Company Pavilions at Gulfood 2026 Dubai',
                'content_ar' => 'مدير عام هيئة تنمية ودعم الإنتاج المحلي والصادرات منهل الفارس يجري جولة على أجنحة الشركات السورية المشاركة في معرض الخليج للأغذية "جولفود 2026" بدبي.',
                'content_en' => 'Director General of the Local Production and Exports Development Authority, Manhal Al-Fares, toured the Syrian company pavilions participating in Gulfood 2026 exhibition in Dubai.',
                'seo_description_ar' => 'جولة على أجنحة الشركات السورية المشاركة في معرض جولفود 2026 بدبي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'published_at' => now()->subDays(6),
                'metadata' => [
                    'directorate_id' => 'd2',
                    'image' => '/storage/images/news/gulfood-2026-featured.jpeg',
                    'images' => [
                        '/storage/images/news/gulfood-2026-featured.jpeg',
                        '/storage/images/news/gulfood-2026-2.jpeg',
                        '/storage/images/news/gulfood-2026-3.jpeg',
                    ],
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'معارض دولية',
                ],
                'tags' => ['اقتصاد', 'معارض', 'صادرات', 'دبي', 'جولفود'],
            ],
            // Article 7 — Syrian Grain Corp Euphrates Tour (التجارة الداخلية وحماية المستهلك)
            [
                'title_ar' => 'جولة ميدانية لمدير عام المؤسسة السورية للحبوب على الصوامع والمطاحن والأفران في منطقة الفرات',
                'title_en' => 'Syrian Grain Corporation Director General Field Tour of Silos, Mills and Bakeries in Euphrates Region',
                'content_ar' => 'أجرى المدير العام للمؤسسة السورية للحبوب "حسن العثمان" جولة ميدانية شملت صوامع الفرات؛ حيث اطّلع على واقعها الفني، ووجّه بإجراء الجرود اللازمة تمهيداً للبدء بأعمال تأهيلها وإعادة تفعيلها.' . "\n\n" .
                    'وشملت الجولة زيارة مطحنة العشرة ومطحنة الفرات، واطّلع على واقع العمل والإنتاج؛ وناقش سبل تحسين الأداء وضمان استمرارية العمل وفق المعايير المعتمدة.' . "\n\n" .
                    'وأشرف "العثمان" خلال جولته على توزيع مادة الدقيق في منطقة الشدادة، وزار عدداً من الأفران الخاصة إضافة إلى فرن المؤسسة؛ للاطلاع على جودة الخبز المنتج، والاستماع إلى شكاوى وملاحظات الأهالي، واتخاذ الإجراءات اللازمة لمعالجتها.' . "\n\n" .
                    'وفي إطار تعزيز الاستقرار الخدمي، تم تأمين مادة الطحين لمنطقتي اليعربية وتل حميس، إضافة إلى تأمين كوادر فنية وإدارية للعمل في المنطقتين؛ بما يضمن استمرارية تقديم الخدمة.' . "\n\n" .
                    'كما شملت الجولة زيارة صوامع صباح الخير؛ حيث تم الاطلاع على واقعها، وتأمين الحراسات اللازمة للحفاظ على المنشآت وضمان سلامتها.',
                'content_en' => 'The Director General of the Syrian Grain Corporation, Hassan Al-Othman, conducted a field tour of Euphrates silos, Al-Ashara and Euphrates mills, inspecting their technical status and production. He supervised flour distribution in Al-Shaddadeh, visited bakeries to assess bread quality, secured flour supply for Al-Yaarubiyah and Tal Hamis, and inspected Sabah Al-Khair silos to ensure facility safety.',
                'seo_description_ar' => 'جولة ميدانية لمدير عام المؤسسة السورية للحبوب على الصوامع والمطاحن والأفران في منطقة الفرات.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'directorate_id' => 'd3',
                    'image' => '/storage/images/news/grain-corp-featured.jpeg',
                    'images' => [
                        '/storage/images/news/grain-corp-featured.jpeg',
                        '/storage/images/news/grain-corp-2.jpeg',
                        '/storage/images/news/grain-corp-3.jpeg',
                        '/storage/images/news/grain-corp-4.jpeg',
                        '/storage/images/news/grain-corp-5.jpeg',
                    ],
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '5 دقائق',
                    'category_label' => 'أمن غذائي',
                ],
                'tags' => ['تجارة داخلية', 'حبوب', 'صوامع', 'أفران', 'الفرات'],
            ],
        ];

        $createdNews = [];
        foreach ($news as $item) {
            $item['slug'] = Str::slug($item['title_en'] . '-' . uniqid());
            $createdNews[] = Content::create($item);
        }

        // Seed content attachments for multi-image articles
        $this->seedNewsAttachments($createdNews);
    }

    private function seedNewsAttachments(array $createdNews): void
    {
        // Define attachment image mappings per article (index matches $createdNews order)
        $attachmentMappings = [
            // Article 1 — Omran Egypt (16 extra images beyond featured)
            0 => [
                'omran-egypt-1.jpeg', 'omran-egypt-2.jpeg', 'omran-egypt-3.jpeg', 'omran-egypt-4.jpeg',
                'omran-egypt-5.jpeg', 'omran-egypt-6.jpeg', 'omran-egypt-7.jpeg', 'omran-egypt-8.jpeg',
                'omran-egypt-9.jpeg', 'omran-egypt-10.jpeg', 'omran-egypt-11.jpeg', 'omran-egypt-12.jpeg',
                'omran-egypt-13.jpeg', 'omran-egypt-14.jpeg', 'omran-egypt-15.jpeg', 'omran-egypt-16.jpeg',
            ],
            // Article 2 — Deir ez-Zor (2 extra)
            1 => [
                'deir-ezzor-meeting-2.jpeg', 'deir-ezzor-meeting-3.jpeg',
            ],
            // Article 3 — Riyadh Cables (no extras, only featured)
            // Article 4 — Maskana Sugar (1 extra)
            3 => [
                'maskana-sugar-2.jpeg',
            ],
            // Article 5 — Al-Maaref University (2 extra)
            4 => [
                'maaref-university-2.jpeg', 'maaref-university-3.jpeg',
            ],
            // Article 6 — Gulfood (2 extra)
            5 => [
                'gulfood-2026-2.jpeg', 'gulfood-2026-3.jpeg',
            ],
            // Article 7 — Grain Corp (4 extra)
            6 => [
                'grain-corp-2.jpeg', 'grain-corp-3.jpeg', 'grain-corp-4.jpeg', 'grain-corp-5.jpeg',
            ],
        ];

        foreach ($attachmentMappings as $articleIndex => $images) {
            $content = $createdNews[$articleIndex];
            foreach ($images as $order => $imageName) {
                $filePath = 'public/images/news/' . $imageName;
                $fullPath = storage_path('app/' . $filePath);
                $fileSize = file_exists($fullPath) ? filesize($fullPath) : 0;

                ContentAttachment::create([
                    'content_id' => $content->id,
                    'file_name' => $imageName,
                    'file_path' => $filePath,
                    'file_type' => 'image',
                    'mime_type' => 'image/jpeg',
                    'file_size' => $fileSize,
                    'title_ar' => $content->title_ar . ' - صورة ' . ($order + 2),
                    'title_en' => $content->title_en . ' - Image ' . ($order + 2),
                    'display_order' => $order + 1,
                    'is_public' => true,
                ]);
            }
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

    private function seedOpenData(): void
    {
        $datasets = [
            [
                'title_ar' => 'الموازنة العامة للدولة 2026',
                'title_en' => 'State General Budget 2026',
                'content_ar' => 'بيانات تفصيلية حول الموازنة العامة، الإيرادات والنفقات الحكومية للعام المالي 2026.',
                'content_en' => 'Detailed data on the general budget, government revenues and expenditures for the fiscal year 2026.',
                'seo_description_ar' => 'بيانات تفصيلية حول الموازنة العامة، الإيرادات والنفقات الحكومية للعام المالي 2026.',
                'category' => 'open_data',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(10),
                'metadata' => ['format' => 'XLSX', 'size' => '2.4 MB', 'category_label' => 'المالية'],
            ],
            [
                'title_ar' => 'إحصائيات التجارة الخارجية',
                'title_en' => 'Foreign Trade Statistics',
                'content_ar' => 'بيانات الصادرات والواردات حسب القطاع والبلد للفترة 2023-2025.',
                'content_en' => 'Export and import data by sector and country for the period 2023-2025.',
                'seo_description_ar' => 'بيانات الصادرات والواردات حسب القطاع والبلد للفترة 2023-2025.',
                'category' => 'open_data',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(20),
                'metadata' => ['format' => 'CSV', 'size' => '15 MB', 'category_label' => 'الاقتصاد'],
            ],
            [
                'title_ar' => 'دليل الجهات الحكومية',
                'title_en' => 'Government Agencies Directory',
                'content_ar' => 'قائمة شاملة بجميع الوزارات والهيئات الحكومية مع بيانات الاتصال والمواقع الجغرافية.',
                'content_en' => 'A comprehensive list of all ministries and government agencies with contact details and locations.',
                'seo_description_ar' => 'قائمة شاملة بجميع الوزارات والهيئات الحكومية مع بيانات الاتصال.',
                'category' => 'open_data',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(30),
                'metadata' => ['format' => 'JSON', 'size' => '450 KB', 'category_label' => 'حكومة'],
            ],
            [
                'title_ar' => 'مؤشرات التنمية الصناعية',
                'title_en' => 'Industrial Development Indicators',
                'content_ar' => 'المؤشرات الرئيسية للقطاع الصناعي، عدد المنشآت، وفرص العمل.',
                'content_en' => 'Key indicators of the industrial sector, number of establishments, and job opportunities.',
                'seo_description_ar' => 'المؤشرات الرئيسية للقطاع الصناعي، عدد المنشآت، وفرص العمل.',
                'category' => 'open_data',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(45),
                'metadata' => ['format' => 'PDF', 'size' => '5.1 MB', 'category_label' => 'صناعة'],
            ],
            [
                'title_ar' => 'تقرير المشاريع الصغيرة والمتوسطة',
                'title_en' => 'SME Report',
                'content_ar' => 'تقرير شامل عن قطاع المشاريع الصغيرة والمتوسطة مع إحصائيات التمويل والتوظيف.',
                'content_en' => 'Comprehensive report on the SME sector with financing and employment statistics.',
                'seo_description_ar' => 'تقرير شامل عن قطاع المشاريع الصغيرة والمتوسطة.',
                'category' => 'open_data',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(60),
                'metadata' => ['format' => 'XLSX', 'size' => '3.8 MB', 'category_label' => 'الاقتصاد'],
            ],
            [
                'title_ar' => 'إحصائيات حماية المستهلك',
                'title_en' => 'Consumer Protection Statistics',
                'content_ar' => 'بيانات الشكاوى والمخالفات التموينية والرقابة على الأسواق للعام 2025.',
                'content_en' => 'Consumer complaints, supply violations, and market control data for 2025.',
                'seo_description_ar' => 'بيانات الشكاوى والمخالفات التموينية والرقابة على الأسواق.',
                'category' => 'open_data',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(75),
                'metadata' => ['format' => 'CSV', 'size' => '1.2 MB', 'category_label' => 'حماية المستهلك'],
            ],
        ];

        foreach ($datasets as $item) {
            $item['slug'] = Str::slug($item['title_en'] . '-' . uniqid());
            Content::create($item);
        }
    }
}
