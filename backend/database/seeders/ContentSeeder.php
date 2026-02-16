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
                'directorate_id' => 'd1',
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
                'directorate_id' => 'd1',
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
                'directorate_id' => 'd1',
                'published_at' => now()->subDays(3),
                'metadata' => [
                    'directorate_id' => 'd1',
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
                'directorate_id' => 'd1',
                'published_at' => now()->subDays(4),
                'metadata' => [
                    'directorate_id' => 'd1',
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
                'directorate_id' => 'd10',
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'directorate_id' => 'd10',
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
                'directorate_id' => 'd2',
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
                'directorate_id' => 'd3',
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

            // Article 8 — Extra for d2 (المديرية العامة للاقتصاد)
            [
                'title_ar' => 'الإدارة العامة للاقتصاد تطلق برنامج دعم الصادرات السورية إلى أسواق الخليج',
                'title_en' => 'General Administration for Economy Launches Syrian Export Support Program to Gulf Markets',
                'content_ar' => 'أطلقت الإدارة العامة للاقتصاد برنامجاً جديداً لدعم الصادرات السورية إلى أسواق دول الخليج العربي، يتضمن تسهيلات جمركية وبرامج تأمين الصادرات، بهدف رفع حصة سورية في الأسواق الخليجية.',
                'content_en' => 'The General Administration for Economy launched a new program to support Syrian exports to Gulf markets, including customs facilitations and export insurance programs.',
                'seo_description_ar' => 'برنامج لدعم الصادرات السورية إلى أسواق الخليج بتسهيلات جمركية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd2',
                'published_at' => now()->subDays(10),
                'metadata' => [
                    'directorate_id' => 'd2',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'صادرات',
                ],
                'tags' => ['اقتصاد', 'صادرات', 'خليج'],
            ],

            // Article 9 — Extra for d3 (التجارة الداخلية وحماية المستهلك)
            [
                'title_ar' => 'حملة رقابية مكثفة على الأسواق خلال شهر رمضان لضبط الأسعار',
                'title_en' => 'Intensive Market Monitoring Campaign During Ramadan to Control Prices',
                'content_ar' => 'أطلقت الإدارة العامة للتجارة الداخلية وحماية المستهلك حملة رقابية مكثفة على الأسواق تزامناً مع شهر رمضان المبارك، لضبط الأسعار ومنع الاحتكار والغش التجاري، وتم تسجيل 230 مخالفة في الأسبوع الأول.',
                'content_en' => 'The Internal Trade and Consumer Protection Directorate launched an intensive market monitoring campaign during Ramadan to control prices, recording 230 violations in the first week.',
                'seo_description_ar' => 'حملة رقابية مكثفة خلال رمضان لضبط الأسعار ومنع الاحتكار.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd3',
                'published_at' => now()->subDays(9),
                'metadata' => [
                    'directorate_id' => 'd3',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'رقابة',
                ],
                'tags' => ['تجارة داخلية', 'أسعار', 'رمضان', 'رقابة'],
            ],

            // ========================================
            // News for remaining directorates (d4–d23)
            // ========================================

            // d4 — مديرية الشؤون القانونية (Legal Affairs)
            [
                'title_ar' => 'مديرية الشؤون القانونية تنجز مراجعة شاملة لقوانين الاستثمار',
                'title_en' => 'Legal Affairs Directorate Completes Comprehensive Review of Investment Laws',
                'content_ar' => 'أنجزت مديرية الشؤون القانونية في وزارة الاقتصاد والصناعة مراجعة شاملة للإطار القانوني المنظّم للاستثمار في سورية، بما يشمل قانون الشركات وقانون التجارة وقانون الاستثمار.' . "\n\n" .
                    'وتهدف المراجعة إلى تحديث التشريعات بما يتوافق مع المعايير الدولية وتسهيل بيئة الأعمال وجذب الاستثمارات المحلية والأجنبية.',
                'content_en' => 'The Legal Affairs Directorate completed a comprehensive review of Syria\'s investment legal framework, including company law, commercial law, and investment law, aiming to modernize legislation in line with international standards.',
                'seo_description_ar' => 'مراجعة شاملة لقوانين الاستثمار لتحديث التشريعات وجذب الاستثمارات.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd4',
                'published_at' => now()->subDays(8),
                'metadata' => [
                    'directorate_id' => 'd4',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تشريعات',
                ],
                'tags' => ['قانون', 'استثمار', 'تشريعات'],
            ],
            [
                'title_ar' => 'ورشة عمل حول التحكيم التجاري الدولي بمشاركة خبراء قانونيين',
                'title_en' => 'Workshop on International Commercial Arbitration with Legal Experts',
                'content_ar' => 'نثمت مديرية الشؤون القانونية ورشة عمل متخصصة حول التحكيم التجاري الدولي، بمشاركة خبراء قانونيين من عدة دول عربية، لبحث آليات حل النزاعات التجارية وتعزيز الثقة في بيئة الأعمال السورية.',
                'content_en' => 'The Legal Affairs Directorate organized a workshop on international commercial arbitration with legal experts from several Arab countries to discuss commercial dispute resolution mechanisms.',
                'seo_description_ar' => 'ورشة عمل حول التحكيم التجاري الدولي لتعزيز بيئة الأعمال.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd4',
                'published_at' => now()->subDays(12),
                'metadata' => [
                    'directorate_id' => 'd4',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'ورش عمل',
                ],
                'tags' => ['قانون', 'تحكيم', 'تجارة دولية'],
            ],

            // d5 — مديرية الشؤون المالية (Financial Affairs)
            [
                'title_ar' => 'مديرية الشؤون المالية تعتمد نظاماً إلكترونياً جديداً لإدارة الموازنات',
                'title_en' => 'Financial Affairs Directorate Adopts New Electronic Budget Management System',
                'content_ar' => 'اعتمدت مديرية الشؤون المالية نظاماً إلكترونياً متطوراً لإدارة الموازنات والنفقات الحكومية، يتيح تتبع المصروفات وإعداد التقارير المالية بشكل فوري، بما يعزز الشفافية والكفاءة في الإنفاق العام.',
                'content_en' => 'The Financial Affairs Directorate adopted an advanced electronic budget management system for tracking expenditures and generating real-time financial reports.',
                'seo_description_ar' => 'نظام إلكتروني جديد لإدارة الموازنات يعزز الشفافية والكفاءة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd5',
                'published_at' => now()->subDays(9),
                'metadata' => [
                    'directorate_id' => 'd5',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تحول رقمي',
                ],
                'tags' => ['مالية', 'موازنات', 'رقمنة'],
            ],
            [
                'title_ar' => 'إقرار الموازنة التقديرية للوزارة للعام المالي 2026',
                'title_en' => 'Ministry Estimated Budget for Fiscal Year 2026 Approved',
                'content_ar' => 'أقرّت مديرية الشؤون المالية الموازنة التقديرية لوزارة الاقتصاد والصناعة للعام المالي 2026، والتي تتضمن زيادة في مخصصات دعم القطاع الصناعي وبرامج تمويل المشاريع الصغيرة.',
                'content_en' => 'The Financial Affairs Directorate approved the Ministry\'s estimated budget for fiscal year 2026 with increased allocations for industrial sector support and SME financing programs.',
                'seo_description_ar' => 'إقرار الموازنة التقديرية للوزارة مع زيادة مخصصات القطاع الصناعي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd5',
                'published_at' => now()->subDays(15),
                'metadata' => [
                    'directorate_id' => 'd5',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'موازنات',
                ],
                'tags' => ['مالية', 'موازنة', 'إنفاق عام'],
            ],

            // d6 — مديرية الموارد البشرية (Human Resources)
            [
                'title_ar' => 'إطلاق برنامج تدريبي لتأهيل الكوادر الحكومية في المهارات الرقمية',
                'title_en' => 'Launch of Digital Skills Training Program for Government Staff',
                'content_ar' => 'أطلقت مديرية الموارد البشرية برنامجاً تدريبياً شاملاً لتأهيل موظفي الوزارة في المهارات الرقمية وتقنيات الذكاء الاصطناعي، بالتعاون مع معاهد تدريبية دولية، بهدف رفع كفاءة الأداء الحكومي.',
                'content_en' => 'The Human Resources Directorate launched a comprehensive training program to qualify ministry employees in digital skills and AI technologies in cooperation with international training institutes.',
                'seo_description_ar' => 'برنامج تدريبي لتأهيل الكوادر الحكومية في المهارات الرقمية والذكاء الاصطناعي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd6',
                'published_at' => now()->subDays(10),
                'metadata' => [
                    'directorate_id' => 'd6',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تدريب',
                ],
                'tags' => ['موارد بشرية', 'تدريب', 'رقمنة'],
            ],
            [
                'title_ar' => 'مسابقة توظيف جديدة لملء 150 شاغراً في الوزارة والهيئات التابعة',
                'title_en' => 'New Recruitment Competition to Fill 150 Vacancies in Ministry and Affiliated Bodies',
                'content_ar' => 'أعلنت مديرية الموارد البشرية عن مسابقة توظيف لملء 150 شاغراً وظيفياً في مختلف الاختصاصات التقنية والإدارية، ضمن خطة تعزيز الكوادر البشرية في الوزارة ومؤسساتها التابعة.',
                'content_en' => 'The HR Directorate announced a recruitment competition to fill 150 vacancies across technical and administrative specializations in the Ministry and affiliated institutions.',
                'seo_description_ar' => 'مسابقة توظيف لملء 150 شاغراً في الوزارة والهيئات التابعة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd6',
                'published_at' => now()->subDays(14),
                'metadata' => [
                    'directorate_id' => 'd6',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '2 دقائق',
                    'category_label' => 'توظيف',
                ],
                'tags' => ['موارد بشرية', 'توظيف', 'مسابقة'],
            ],

            // d7 — مديرية تقانة المعلومات (IT & Communications)
            [
                'title_ar' => 'إطلاق البوابة الإلكترونية الموحدة لخدمات وزارة الاقتصاد والصناعة',
                'title_en' => 'Launch of Unified Electronic Portal for Ministry Services',
                'content_ar' => 'أطلقت مديرية تقانة المعلومات والاتصالات البوابة الإلكترونية الموحدة التي تتيح للمواطنين والمستثمرين الوصول إلى جميع خدمات الوزارة عبر منصة واحدة، مع نظام تتبع ذكي للمعاملات.',
                'content_en' => 'The IT Directorate launched a unified electronic portal allowing citizens and investors to access all ministry services through a single platform with smart transaction tracking.',
                'seo_description_ar' => 'بوابة إلكترونية موحدة لخدمات الوزارة مع نظام تتبع ذكي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd7',
                'published_at' => now()->subDays(6),
                'metadata' => [
                    'directorate_id' => 'd7',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تحول رقمي',
                ],
                'tags' => ['تقانة', 'رقمنة', 'خدمات إلكترونية'],
            ],
            [
                'title_ar' => 'ربط جميع فروع الوزارة بشبكة اتصالات آمنة عبر الألياف الضوئية',
                'title_en' => 'All Ministry Branches Connected via Secure Fiber Optic Network',
                'content_ar' => 'أنجزت مديرية تقانة المعلومات مشروع ربط جميع فروع الوزارة والمديريات التابعة بشبكة ألياف ضوئية آمنة، مما يرفع سرعة نقل البيانات ويعزز أمن المعلومات بين المكاتب.',
                'content_en' => 'The IT Directorate completed a project connecting all ministry branches with a secure fiber optic network, enhancing data transfer speeds and information security.',
                'seo_description_ar' => 'ربط فروع الوزارة بشبكة ألياف ضوئية آمنة لتعزيز البنية التحتية الرقمية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd7',
                'published_at' => now()->subDays(18),
                'metadata' => [
                    'directorate_id' => 'd7',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'بنية تحتية',
                ],
                'tags' => ['تقانة', 'شبكات', 'أمن معلومات'],
            ],

            // d8 — مديرية الشؤون الإدارية (Administrative Affairs)
            [
                'title_ar' => 'افتتاح مبنى جديد لمديرية الشؤون الإدارية بتجهيزات حديثة',
                'title_en' => 'New Administrative Affairs Building Opens with Modern Facilities',
                'content_ar' => 'افتتحت مديرية الشؤون الإدارية مبناها الجديد المجهز بأحدث التقنيات المكتبية ونظام أرشفة رقمي متكامل، بهدف تحسين بيئة العمل وتسريع المعاملات الإدارية.',
                'content_en' => 'The Administrative Affairs Directorate opened its new building equipped with modern office technologies and an integrated digital archiving system.',
                'seo_description_ar' => 'افتتاح مبنى جديد بتجهيزات حديثة لتحسين بيئة العمل الإدارية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd8',
                'published_at' => now()->subDays(11),
                'metadata' => [
                    'directorate_id' => 'd8',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '2 دقائق',
                    'category_label' => 'خدمات إدارية',
                ],
                'tags' => ['إدارة', 'أرشفة', 'تطوير'],
            ],
            [
                'title_ar' => 'تطبيق نظام إدارة المراسلات الإلكتروني في جميع المديريات',
                'title_en' => 'Electronic Correspondence Management System Deployed Across All Directorates',
                'content_ar' => 'أعلنت مديرية الشؤون الإدارية عن إتمام نشر نظام إدارة المراسلات الإلكتروني في جميع مديريات الوزارة، مما يلغي الاعتماد على المراسلات الورقية ويسرّع تدفق العمل.',
                'content_en' => 'The Administrative Affairs Directorate announced the full deployment of an electronic correspondence management system across all ministry directorates.',
                'seo_description_ar' => 'نشر نظام المراسلات الإلكتروني في جميع المديريات لإلغاء الورق.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd8',
                'published_at' => now()->subDays(20),
                'metadata' => [
                    'directorate_id' => 'd8',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '2 دقائق',
                    'category_label' => 'رقمنة',
                ],
                'tags' => ['إدارة', 'مراسلات', 'رقمنة'],
            ],

            // d9 — مديرية التخطيط والتعاون الدولي (Planning & International Cooperation)
            [
                'title_ar' => 'توقيع اتفاقية تعاون مع البنك الدولي لدعم إعادة الإعمار الصناعي',
                'title_en' => 'Cooperation Agreement Signed with World Bank for Industrial Reconstruction',
                'content_ar' => 'وقّعت مديرية التخطيط والتعاون الدولي اتفاقية تعاون مع البنك الدولي تتضمن تقديم دعم فني ومالي لبرامج إعادة الإعمار الصناعي في سورية، بقيمة 50 مليون دولار على مدى 3 سنوات.',
                'content_en' => 'The Planning Directorate signed a cooperation agreement with the World Bank for technical and financial support for industrial reconstruction programs valued at $50 million over 3 years.',
                'seo_description_ar' => 'اتفاقية مع البنك الدولي لدعم إعادة الإعمار الصناعي بقيمة 50 مليون دولار.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'directorate_id' => 'd9',
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'directorate_id' => 'd9',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '4 دقائق',
                    'category_label' => 'تعاون دولي',
                ],
                'tags' => ['تخطيط', 'تعاون دولي', 'إعادة إعمار'],
            ],
            [
                'title_ar' => 'إعداد الخطة الاستراتيجية الخمسية للتنمية الصناعية 2026-2030',
                'title_en' => 'Five-Year Strategic Plan for Industrial Development 2026-2030 Prepared',
                'content_ar' => 'أعدّت مديرية التخطيط والتعاون الدولي مسودة الخطة الاستراتيجية الخمسية للتنمية الصناعية والاقتصادية 2026-2030، التي تستهدف رفع الناتج الصناعي بنسبة 40% وخلق 200 ألف فرصة عمل جديدة.',
                'content_en' => 'The Planning Directorate prepared a draft Five-Year Strategic Plan for industrial and economic development (2026-2030) targeting a 40% increase in industrial output and 200,000 new jobs.',
                'seo_description_ar' => 'خطة خمسية لرفع الناتج الصناعي 40% وخلق 200 ألف فرصة عمل.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd9',
                'published_at' => now()->subDays(16),
                'metadata' => [
                    'directorate_id' => 'd9',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '5 دقائق',
                    'category_label' => 'تخطيط استراتيجي',
                ],
                'tags' => ['تخطيط', 'استراتيجية', 'تنمية صناعية'],
            ],

            // d10 — مديرية الدراسات والأبحاث (Studies & Research)
            [
                'title_ar' => 'إصدار تقرير المؤشرات الاقتصادية الفصلي للربع الأول 2026',
                'title_en' => 'Quarterly Economic Indicators Report for Q1 2026 Published',
                'content_ar' => 'أصدرت مديرية الدراسات والأبحاث تقرير المؤشرات الاقتصادية الفصلي للربع الأول من عام 2026، والذي يرصد أداء القطاعات الاقتصادية الرئيسية ويقدّم توصيات لصانعي القرار.',
                'content_en' => 'The Studies & Research Directorate published the quarterly economic indicators report for Q1 2026, monitoring key economic sector performance and providing policy recommendations.',
                'seo_description_ar' => 'تقرير المؤشرات الاقتصادية الفصلي يرصد أداء القطاعات الرئيسية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd10',
                'published_at' => now()->subDays(8),
                'metadata' => [
                    'directorate_id' => 'd10',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '4 دقائق',
                    'category_label' => 'دراسات',
                ],
                'tags' => ['دراسات', 'مؤشرات اقتصادية', 'تقارير'],
            ],

            // d11 — مديرية العلاقات العامة والإعلام (PR & Media)
            [
                'title_ar' => 'إطلاق الهوية البصرية الجديدة لوزارة الاقتصاد والصناعة',
                'title_en' => 'New Visual Identity for the Ministry of Economy and Industry Launched',
                'content_ar' => 'أطلقت مديرية العلاقات العامة والإعلام الهوية البصرية الجديدة للوزارة، والتي تعكس رؤية التحديث والانفتاح الاقتصادي، مع تحديث شامل للموقع الإلكتروني وحسابات التواصل الاجتماعي.',
                'content_en' => 'The PR & Media Directorate launched the Ministry\'s new visual identity reflecting modernization and economic openness, with a comprehensive website and social media overhaul.',
                'seo_description_ar' => 'هوية بصرية جديدة للوزارة تعكس رؤية التحديث والانفتاح الاقتصادي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd11',
                'published_at' => now()->subDays(4),
                'metadata' => [
                    'directorate_id' => 'd11',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'علاقات عامة',
                ],
                'tags' => ['إعلام', 'هوية بصرية', 'علاقات عامة'],
            ],
            [
                'title_ar' => 'مؤتمر صحفي للوزير حول خطة النهوض بالقطاع الصناعي',
                'title_en' => 'Minister Press Conference on Industrial Sector Revival Plan',
                'content_ar' => 'نظّمت مديرية العلاقات العامة مؤتمراً صحفياً لوزير الاقتصاد والصناعة استعرض فيه خطة النهوض بالقطاع الصناعي والتسهيلات المقدمة للمستثمرين، بحضور عدد كبير من الصحفيين والإعلاميين.',
                'content_en' => 'The PR Directorate organized a press conference for the Minister of Economy and Industry presenting the industrial revival plan and investor facilitations.',
                'seo_description_ar' => 'مؤتمر صحفي للوزير حول خطة النهوض بالقطاع الصناعي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd11',
                'published_at' => now()->subDays(13),
                'metadata' => [
                    'directorate_id' => 'd11',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'مؤتمرات',
                ],
                'tags' => ['إعلام', 'مؤتمر صحفي', 'صناعة'],
            ],

            // d12 — مديرية المتابعة والتفتيش (Follow-up & Inspection)
            [
                'title_ar' => 'حملة تفتيشية مكثفة على المنشآت الصناعية لضمان معايير السلامة',
                'title_en' => 'Intensive Inspection Campaign on Industrial Facilities for Safety Standards',
                'content_ar' => 'نثمت مديرية المتابعة والتفتيش حملة تفتيشية شاملة على المنشآت الصناعية في محافظة دمشق وريفها، للتحقق من التزامها بمعايير السلامة المهنية والبيئية، وتم تسجيل 45 مخالفة ومنح مهل للتصحيح.',
                'content_en' => 'The Follow-up & Inspection Directorate conducted a comprehensive inspection campaign on industrial facilities in Damascus and its countryside to verify compliance with safety and environmental standards.',
                'seo_description_ar' => 'حملة تفتيشية على المنشآت الصناعية للتحقق من معايير السلامة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd12',
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'directorate_id' => 'd12',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'رقابة',
                ],
                'tags' => ['تفتيش', 'سلامة', 'منشآت صناعية'],
            ],
            [
                'title_ar' => 'تقرير سنوي: ارتفاع نسبة الالتزام بالمعايير البيئية إلى 78%',
                'title_en' => 'Annual Report: Environmental Standards Compliance Rate Rises to 78%',
                'content_ar' => 'أظهر التقرير السنوي لمديرية المتابعة والتفتيش ارتفاع نسبة التزام المنشآت الصناعية بالمعايير البيئية إلى 78% مقارنة بـ 62% في العام السابق، مما يعكس فعالية الحملات التفتيشية.',
                'content_en' => 'The annual report showed industrial facility compliance with environmental standards rose to 78% from 62% the previous year.',
                'seo_description_ar' => 'ارتفاع نسبة الالتزام بالمعايير البيئية إلى 78% بفضل الحملات التفتيشية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd12',
                'published_at' => now()->subDays(22),
                'metadata' => [
                    'directorate_id' => 'd12',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تقارير',
                ],
                'tags' => ['تفتيش', 'بيئة', 'معايير'],
            ],

            // d13 — السورية للمخابز (Syrian Bakeries)
            [
                'title_ar' => 'السورية للمخابز تفتتح 12 خطاً إنتاجياً جديداً في حلب وإدلب',
                'title_en' => 'Syrian Bakeries Opens 12 New Production Lines in Aleppo and Idlib',
                'content_ar' => 'افتتحت الشركة السورية للمخابز 12 خط إنتاج جديداً في محافظتي حلب وإدلب، لزيادة الطاقة الإنتاجية وتلبية الطلب المتزايد على مادة الخبز، مع الحفاظ على معايير الجودة والنظافة.',
                'content_en' => 'Syrian Bakeries Company opened 12 new production lines in Aleppo and Idlib to increase production capacity and meet growing demand for bread.',
                'seo_description_ar' => '12 خط إنتاج جديداً في حلب وإدلب لزيادة الطاقة الإنتاجية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd13',
                'published_at' => now()->subDays(9),
                'metadata' => [
                    'directorate_id' => 'd13',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'إنتاج',
                ],
                'tags' => ['مخابز', 'خبز', 'إنتاج', 'حلب'],
            ],
            [
                'title_ar' => 'تحديث معدات المخابز الآلية بالتعاون مع شركات تركية',
                'title_en' => 'Automated Bakery Equipment Upgraded in Partnership with Turkish Companies',
                'content_ar' => 'بدأت الشركة السورية للمخابز بتحديث معدات المخابز الآلية في عدة محافظات بالتعاون مع شركات تركية متخصصة، بهدف رفع جودة الإنتاج وتقليل الهدر.',
                'content_en' => 'Syrian Bakeries began upgrading automated bakery equipment in several governorates in partnership with specialized Turkish companies.',
                'seo_description_ar' => 'تحديث معدات المخابز بالتعاون مع شركات تركية لرفع الجودة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd13',
                'published_at' => now()->subDays(19),
                'metadata' => [
                    'directorate_id' => 'd13',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تطوير',
                ],
                'tags' => ['مخابز', 'تحديث', 'معدات'],
            ],

            // d14 — السورية للمطاحن (Syrian Mills)
            [
                'title_ar' => 'السورية للمطاحن تستقبل أول شحنة قمح من الحسكة بعد التحرير',
                'title_en' => 'Syrian Mills Receives First Wheat Shipment from Al-Hasakah Post-Liberation',
                'content_ar' => 'استقبلت الشركة السورية للمطاحن أول شحنة قمح من محافظة الحسكة بعد تحرير المنطقة، بكمية 5000 طن، وبدأت عمليات الطحن الفوري لتأمين مادة الطحين للمحافظات الشمالية الشرقية.',
                'content_en' => 'Syrian Mills Company received its first 5,000-ton wheat shipment from Al-Hasakah after the area\'s liberation, immediately beginning milling to supply flour to northeastern governorates.',
                'seo_description_ar' => 'استقبال أول شحنة قمح من الحسكة وبدء عمليات الطحن الفوري.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd14',
                'published_at' => now()->subDays(6),
                'metadata' => [
                    'directorate_id' => 'd14',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'أمن غذائي',
                ],
                'tags' => ['مطاحن', 'قمح', 'طحين', 'الحسكة'],
            ],
            [
                'title_ar' => 'إعادة تأهيل مطحنة حمص الكبرى بطاقة إنتاجية مضاعفة',
                'title_en' => 'Homs Grand Mill Rehabilitated with Doubled Production Capacity',
                'content_ar' => 'أعلنت الشركة السورية للمطاحن عن إتمام إعادة تأهيل مطحنة حمص الكبرى بطاقة إنتاجية مضاعفة تصل إلى 400 طن يومياً، بدعم من برنامج الأمم المتحدة الإنمائي.',
                'content_en' => 'Syrian Mills announced the completion of Homs Grand Mill rehabilitation with doubled daily production capacity of 400 tons, supported by UNDP.',
                'seo_description_ar' => 'إعادة تأهيل مطحنة حمص بطاقة 400 طن يومياً بدعم أممي.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd14',
                'published_at' => now()->subDays(17),
                'metadata' => [
                    'directorate_id' => 'd14',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'إعادة تأهيل',
                ],
                'tags' => ['مطاحن', 'حمص', 'إعادة تأهيل'],
            ],

            // d15 — السورية للتجارة (Syrian Trade)
            [
                'title_ar' => 'السورية للتجارة تفتتح 8 صالات بيع جديدة بأسعار مخفضة',
                'title_en' => 'Syrian Trade Opens 8 New Discounted Sales Halls',
                'content_ar' => 'افتتحت الشركة السورية للتجارة 8 صالات بيع جديدة في عدة محافظات تقدم المواد الغذائية والاستهلاكية الأساسية بأسعار مخفضة، ضمن جهود ضبط الأسعار ودعم المواطنين.',
                'content_en' => 'Syrian Trade Company opened 8 new retail halls across several governorates offering essential food and consumer goods at discounted prices.',
                'seo_description_ar' => '8 صالات بيع جديدة بأسعار مخفضة لدعم المواطنين وضبط الأسعار.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd15',
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'directorate_id' => 'd15',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '2 دقائق',
                    'category_label' => 'تجارة داخلية',
                ],
                'tags' => ['تجارة', 'أسعار', 'دعم'],
            ],
            [
                'title_ar' => 'اتفاقية لاستيراد مواد غذائية أساسية بأسعار تفضيلية من الأردن',
                'title_en' => 'Agreement to Import Basic Food Items at Preferential Prices from Jordan',
                'content_ar' => 'وقّعت الشركة السورية للتجارة اتفاقية مع شركات أردنية لاستيراد مواد غذائية أساسية بأسعار تفضيلية، تشمل الزيت والسكر والأرز، لطرحها في صالات البيع بأسعار مناسبة للمواطنين.',
                'content_en' => 'Syrian Trade signed an agreement with Jordanian companies to import basic food items including oil, sugar, and rice at preferential prices.',
                'seo_description_ar' => 'اتفاقية لاستيراد مواد غذائية بأسعار تفضيلية من الأردن.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd15',
                'published_at' => now()->subDays(14),
                'metadata' => [
                    'directorate_id' => 'd15',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'اتفاقيات',
                ],
                'tags' => ['تجارة', 'استيراد', 'أغذية', 'الأردن'],
            ],

            // d16 — هيئة المواصفات والمقاييس (SASMO)
            [
                'title_ar' => 'هيئة المواصفات تصدر 35 مواصفة قياسية جديدة للمنتجات الغذائية',
                'title_en' => 'SASMO Issues 35 New Standards for Food Products',
                'content_ar' => 'أصدرت هيئة المواصفات والمقاييس السورية 35 مواصفة قياسية جديدة للمنتجات الغذائية المحلية والمستوردة، بما يتوافق مع المعايير الدولية ويحمي صحة المستهلك السوري.',
                'content_en' => 'SASMO issued 35 new standards for local and imported food products in line with international standards to protect Syrian consumer health.',
                'seo_description_ar' => '35 مواصفة قياسية جديدة للمنتجات الغذائية وفق المعايير الدولية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd16',
                'published_at' => now()->subDays(8),
                'metadata' => [
                    'directorate_id' => 'd16',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'مواصفات',
                ],
                'tags' => ['مواصفات', 'جودة', 'غذاء'],
            ],
            [
                'title_ar' => 'توقيع مذكرة تفاهم مع هيئة التقييس الخليجية لتبادل المواصفات',
                'title_en' => 'MOU Signed with Gulf Standardization Organization for Standards Exchange',
                'content_ar' => 'وقّعت هيئة المواصفات والمقاييس السورية مذكرة تفاهم مع هيئة التقييس لدول مجلس التعاون الخليجي لتبادل المواصفات القياسية وتسهيل حركة التجارة البينية.',
                'content_en' => 'SASMO signed an MOU with the Gulf Standardization Organization for standards exchange and facilitation of inter-regional trade.',
                'seo_description_ar' => 'مذكرة تفاهم مع هيئة التقييس الخليجية لتسهيل التجارة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd16',
                'published_at' => now()->subDays(21),
                'metadata' => [
                    'directorate_id' => 'd16',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تعاون دولي',
                ],
                'tags' => ['مواصفات', 'تعاون دولي', 'خليج'],
            ],

            // d17 — هيئة تنمية المشروعات الصغيرة والمتوسطة (SME Development)
            [
                'title_ar' => 'هيئة المشروعات الصغيرة تموّل 200 مشروع ناشئ في 6 محافظات',
                'title_en' => 'SME Authority Funds 200 Startups Across 6 Governorates',
                'content_ar' => 'أعلنت هيئة تنمية المشروعات الصغيرة والمتوسطة عن تمويل 200 مشروع ناشئ في 6 محافظات خلال الربع الأول من 2026، بقروض ميسرة تصل إلى 20 مليون ليرة سورية لكل مشروع.',
                'content_en' => 'The SME Development Authority announced funding 200 startups across 6 governorates in Q1 2026 with facilitated loans up to 20 million Syrian pounds per project.',
                'seo_description_ar' => 'تمويل 200 مشروع ناشئ بقروض ميسرة في 6 محافظات.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd17',
                'published_at' => now()->subDays(4),
                'metadata' => [
                    'directorate_id' => 'd17',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تمويل',
                ],
                'tags' => ['مشاريع صغيرة', 'تمويل', 'ريادة أعمال'],
            ],
            [
                'title_ar' => 'إطلاق حاضنة أعمال تقنية بالشراكة مع القطاع الخاص',
                'title_en' => 'Tech Business Incubator Launched in Partnership with Private Sector',
                'content_ar' => 'أطلقت هيئة تنمية المشروعات الصغيرة حاضنة أعمال تقنية في دمشق بالشراكة مع شركات تقنية محلية، لاحتضان المشاريع الناشئة في مجالات الذكاء الاصطناعي والتجارة الإلكترونية.',
                'content_en' => 'The SME Authority launched a tech business incubator in Damascus in partnership with local tech companies to support startups in AI and e-commerce.',
                'seo_description_ar' => 'حاضنة أعمال تقنية لدعم المشاريع في الذكاء الاصطناعي والتجارة الإلكترونية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd17',
                'published_at' => now()->subDays(15),
                'metadata' => [
                    'directorate_id' => 'd17',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'ريادة أعمال',
                ],
                'tags' => ['مشاريع صغيرة', 'حاضنات', 'تقنية'],
            ],

            // d18 — هيئة المنافسة ومنع الاحتكار (Competition Authority)
            [
                'title_ar' => 'هيئة المنافسة تصدر قراراً بمنع احتكار مادة الإسمنت',
                'title_en' => 'Competition Authority Issues Decision to Prevent Cement Monopoly',
                'content_ar' => 'أصدرت هيئة المنافسة ومنع الاحتكار قراراً يمنع أي جهة من السيطرة على أكثر من 30% من سوق الإسمنت المحلي، وذلك لضمان المنافسة العادلة وحماية المستهلكين من الارتفاع غير المبرر في الأسعار.',
                'content_en' => 'The Competition Authority issued a decision preventing any entity from controlling more than 30% of the local cement market to ensure fair competition.',
                'seo_description_ar' => 'قرار بمنع احتكار الإسمنت لضمان المنافسة العادلة وحماية المستهلكين.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd18',
                'published_at' => now()->subDays(6),
                'metadata' => [
                    'directorate_id' => 'd18',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'منافسة',
                ],
                'tags' => ['منافسة', 'احتكار', 'إسمنت'],
            ],
            [
                'title_ar' => 'دراسة حول واقع المنافسة في قطاع الاتصالات والتجارة الإلكترونية',
                'title_en' => 'Study on Competition in Telecommunications and E-Commerce Sectors',
                'content_ar' => 'أصدرت هيئة المنافسة دراسة شاملة حول واقع المنافسة في قطاعي الاتصالات والتجارة الإلكترونية، تضمنت توصيات لتعزيز الشفافية ومنع الممارسات الاحتكارية.',
                'content_en' => 'The Competition Authority issued a study on competition in telecoms and e-commerce sectors with recommendations to enhance transparency and prevent monopolistic practices.',
                'seo_description_ar' => 'دراسة حول المنافسة في الاتصالات والتجارة الإلكترونية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd18',
                'published_at' => now()->subDays(20),
                'metadata' => [
                    'directorate_id' => 'd18',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '4 دقائق',
                    'category_label' => 'دراسات',
                ],
                'tags' => ['منافسة', 'اتصالات', 'تجارة إلكترونية'],
            ],

            // d19 — هيئة دعم الإنتاج المحلي والصادرات (Local Production & Export Support)
            [
                'title_ar' => 'هيئة دعم الصادرات تنظّم مشاركة 50 شركة سورية في معرض إسطنبول التجاري',
                'title_en' => 'Export Authority Organizes Participation of 50 Syrian Companies in Istanbul Trade Fair',
                'content_ar' => 'نظّمت هيئة دعم وتنمية الإنتاج المحلي والصادرات مشاركة 50 شركة سورية في معرض إسطنبول التجاري الدولي، حيث عرضت منتجاتها في قطاعات الغذاء والنسيج والصناعات الكيميائية.',
                'content_en' => 'The Local Production and Export Support Authority organized participation of 50 Syrian companies in the Istanbul International Trade Fair showcasing food, textile, and chemical products.',
                'seo_description_ar' => '50 شركة سورية تشارك في معرض إسطنبول التجاري بدعم من الهيئة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd19',
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'directorate_id' => 'd19',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'صادرات',
                ],
                'tags' => ['صادرات', 'معارض', 'إسطنبول'],
            ],
            [
                'title_ar' => 'ارتفاع صادرات المنتجات الغذائية السورية بنسبة 25% خلال 2025',
                'title_en' => 'Syrian Food Product Exports Rise 25% During 2025',
                'content_ar' => 'أعلنت هيئة دعم الإنتاج المحلي والصادرات عن ارتفاع صادرات المنتجات الغذائية السورية بنسبة 25% خلال عام 2025، لتصل إلى أسواق 28 دولة، بقيمة إجمالية تجاوزت 180 مليون دولار.',
                'content_en' => 'The Export Support Authority announced a 25% increase in Syrian food product exports in 2025, reaching 28 countries with a total value exceeding $180 million.',
                'seo_description_ar' => 'ارتفاع الصادرات الغذائية 25% لتصل إلى 28 دولة بقيمة 180 مليون دولار.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd19',
                'published_at' => now()->subDays(16),
                'metadata' => [
                    'directorate_id' => 'd19',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'إحصائيات',
                ],
                'tags' => ['صادرات', 'غذاء', 'إحصائيات'],
            ],

            // d20 — هيئة إدارة المعادن الثمينة (Precious Metals Administration)
            [
                'title_ar' => 'هيئة المعادن الثمينة تطلق منظومة الدمغ الإلكتروني للذهب والفضة',
                'title_en' => 'Precious Metals Authority Launches Electronic Hallmarking System for Gold and Silver',
                'content_ar' => 'أطلقت هيئة إدارة المعادن الثمينة منظومة الدمغ الإلكتروني الجديدة التي تتيح التحقق من أصالة المشغولات الذهبية والفضية عبر رمز QR، لحماية المستهلكين من الغش.',
                'content_en' => 'The Precious Metals Authority launched a new electronic hallmarking system allowing verification of gold and silver jewelry authenticity via QR code to protect consumers.',
                'seo_description_ar' => 'منظومة دمغ إلكتروني للذهب والفضة مع خاصية التحقق عبر QR.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd20',
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'directorate_id' => 'd20',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'معادن ثمينة',
                ],
                'tags' => ['ذهب', 'فضة', 'دمغ', 'حماية مستهلك'],
            ],
            [
                'title_ar' => 'ضبط 120 قطعة ذهبية مغشوشة في حملة رقابية بدمشق وحلب',
                'title_en' => '120 Counterfeit Gold Pieces Seized in Damascus and Aleppo Inspection Campaign',
                'content_ar' => 'ضبطت هيئة إدارة المعادن الثمينة 120 قطعة ذهبية مغشوشة خلال حملة رقابية مشتركة مع مديرية التجارة الداخلية في أسواق دمشق وحلب، وتم إحالة المخالفين إلى القضاء.',
                'content_en' => 'The Precious Metals Authority seized 120 counterfeit gold pieces during a joint inspection campaign with the Internal Trade Directorate in Damascus and Aleppo markets.',
                'seo_description_ar' => 'ضبط 120 قطعة ذهبية مغشوشة في حملة رقابية بدمشق وحلب.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd20',
                'published_at' => now()->subDays(18),
                'metadata' => [
                    'directorate_id' => 'd20',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '2 دقائق',
                    'category_label' => 'رقابة',
                ],
                'tags' => ['ذهب', 'غش', 'رقابة'],
            ],

            // d21 — مركز التنمية الصناعية (Industrial Development Center)
            [
                'title_ar' => 'مركز التنمية الصناعية يقدّم استشارات فنية لـ 80 مصنعاً لتحسين الإنتاجية',
                'title_en' => 'Industrial Development Center Provides Technical Consulting to 80 Factories',
                'content_ar' => 'قدّم مركز التنمية الصناعية استشارات فنية متخصصة لـ 80 مصنعاً في قطاعات الغذاء والنسيج والكيمياء، ساهمت في رفع الإنتاجية بمعدل 15% وخفض التكاليف التشغيلية.',
                'content_en' => 'The Industrial Development Center provided specialized technical consulting to 80 factories in food, textile, and chemical sectors, increasing productivity by 15%.',
                'seo_description_ar' => 'استشارات فنية لـ 80 مصنعاً أدت لرفع الإنتاجية 15%.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd21',
                'published_at' => now()->subDays(10),
                'metadata' => [
                    'directorate_id' => 'd21',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تنمية صناعية',
                ],
                'tags' => ['تنمية صناعية', 'استشارات', 'إنتاجية'],
            ],
            [
                'title_ar' => 'ورشة تدريبية حول تقنيات التصنيع الحديثة والأتمتة الصناعية',
                'title_en' => 'Training Workshop on Modern Manufacturing Technologies and Industrial Automation',
                'content_ar' => 'نظّم مركز التنمية الصناعية ورشة تدريبية لمدة 5 أيام حول تقنيات التصنيع الحديثة والأتمتة الصناعية، بمشاركة 60 مهندساً وفنياً من مختلف المنشآت الصناعية.',
                'content_en' => 'The Industrial Development Center organized a 5-day workshop on modern manufacturing and industrial automation with 60 engineers and technicians from various facilities.',
                'seo_description_ar' => 'ورشة تدريبية حول التصنيع الحديث والأتمتة بمشاركة 60 مهندساً.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 5,
                'directorate_id' => 'd21',
                'published_at' => now()->subDays(23),
                'metadata' => [
                    'directorate_id' => 'd21',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تدريب',
                ],
                'tags' => ['تنمية صناعية', 'أتمتة', 'تدريب'],
            ],

            // d22 — مركز الاختبارات والأبحاث الصناعية (Industrial Testing & Research)
            [
                'title_ar' => 'مركز الاختبارات الصناعية يحصل على اعتماد دولي ISO 17025',
                'title_en' => 'Industrial Testing Center Obtains International ISO 17025 Accreditation',
                'content_ar' => 'حصل مركز الاختبارات والأبحاث الصناعية على اعتماد دولي وفق معيار ISO 17025 لمختبرات الفحص، مما يعزز ثقة الأسواق الدولية بالمنتجات السورية ويسهّل تصديرها.',
                'content_en' => 'The Industrial Testing Center obtained international ISO 17025 accreditation for its testing laboratories, boosting international market confidence in Syrian products.',
                'seo_description_ar' => 'اعتماد دولي ISO 17025 يعزز ثقة الأسواق بالمنتجات السورية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 7,
                'directorate_id' => 'd22',
                'published_at' => now()->subDays(3),
                'metadata' => [
                    'directorate_id' => 'd22',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'اعتمادات',
                ],
                'tags' => ['اختبارات', 'ISO', 'جودة'],
            ],
            [
                'title_ar' => 'تحديث مختبرات الفحص الغذائي بمعدات تحليل متطورة',
                'title_en' => 'Food Testing Labs Upgraded with Advanced Analysis Equipment',
                'content_ar' => 'أعلن مركز الاختبارات والأبحاث الصناعية عن تحديث مختبرات الفحص الغذائي بأجهزة تحليل متطورة تشمل أجهزة كروماتوغرافيا ومطياف الكتلة، بتمويل من الاتحاد الأوروبي.',
                'content_en' => 'The Industrial Testing Center announced upgrading food testing labs with advanced chromatography and mass spectrometry equipment funded by the EU.',
                'seo_description_ar' => 'تحديث مختبرات الفحص الغذائي بأجهزة كروماتوغرافيا ومطياف كتلة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd22',
                'published_at' => now()->subDays(14),
                'metadata' => [
                    'directorate_id' => 'd22',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'تحديث',
                ],
                'tags' => ['اختبارات', 'مختبرات', 'غذاء'],
            ],

            // d23 — المؤسسة العامة للمعارض والأسواق الدولية (Exhibitions & International Markets)
            [
                'title_ar' => 'انطلاق التحضيرات لمعرض دمشق الدولي بدورته الجديدة بمشاركة 45 دولة',
                'title_en' => 'Preparations Begin for New Damascus International Fair with 45 Countries',
                'content_ar' => 'بدأت المؤسسة العامة للمعارض والأسواق الدولية التحضيرات لمعرض دمشق الدولي في دورته الجديدة، والذي من المتوقع أن يشهد مشاركة 45 دولة و800 شركة في مختلف القطاعات الاقتصادية.',
                'content_en' => 'The General Institution for Exhibitions began preparations for the new Damascus International Fair expected to feature 45 countries and 800 companies across economic sectors.',
                'seo_description_ar' => 'تحضيرات معرض دمشق الدولي بمشاركة 45 دولة و800 شركة.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 8,
                'directorate_id' => 'd23',
                'published_at' => now()->subDays(3),
                'metadata' => [
                    'directorate_id' => 'd23',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'معارض',
                ],
                'tags' => ['معارض', 'دمشق', 'تجارة دولية'],
            ],
            [
                'title_ar' => 'المؤسسة العامة للمعارض تنظّم معرضاً متخصصاً للصناعات الغذائية',
                'title_en' => 'General Exhibition Institution Organizes Specialized Food Industry Fair',
                'content_ar' => 'نظّمت المؤسسة العامة للمعارض معرضاً متخصصاً للصناعات الغذائية في مدينة المعارض بدمشق، بمشاركة 120 شركة محلية و30 شركة دولية، لتعزيز فرص التصدير والشراكات التجارية.',
                'content_en' => 'The General Exhibition Institution organized a specialized food industry fair at Damascus Exhibition City with 120 local and 30 international companies to boost export opportunities.',
                'seo_description_ar' => 'معرض متخصص للصناعات الغذائية بمشاركة 150 شركة محلية ودولية.',
                'category' => 'news',
                'status' => 'published',
                'featured' => false,
                'priority' => 6,
                'directorate_id' => 'd23',
                'published_at' => now()->subDays(12),
                'metadata' => [
                    'directorate_id' => 'd23',
                    'author' => 'المكتب الإعلامي',
                    'read_time' => '3 دقائق',
                    'category_label' => 'معارض',
                ],
                'tags' => ['معارض', 'غذاء', 'صادرات'],
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
        // Delete old media seed data to avoid duplicates
        Content::where('category', 'media')->delete();

        $media = [
            // ═══════════════════════════════════════════
            //  VIDEOS (8 items)
            // ═══════════════════════════════════════════

            [
                'title_ar' => 'جولة السيد الوزير في معرض دمشق الدولي 2026',
                'title_en' => 'Minister Tour at Damascus International Fair 2026',
                'content_ar' => 'جولة تفقدية للسيد الوزير في أجنحة معرض دمشق الدولي والاطلاع على المنتجات المحلية والعالمية المشاركة، وتفقد الأجنحة الصناعية واللقاء بالمستثمرين المحليين والعرب.',
                'content_en' => 'Minister inspection tour at Damascus International Fair, visiting industrial pavilions and meeting local and Arab investors.',
                'seo_description_ar' => 'جولة السيد الوزير في معرض دمشق الدولي 2026',
                'category' => 'media',
                'status' => 'published',
                'priority' => 10,
                'published_at' => now()->subDays(2),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=L_jWHffIx5E',
                    'thumbnail' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
                    'duration' => '14:22',
                ],
            ],
            [
                'title_ar' => 'افتتاح المنطقة الصناعية الجديدة في حلب',
                'title_en' => 'Opening of New Industrial Zone in Aleppo',
                'content_ar' => 'حفل افتتاح المنطقة الصناعية الجديدة في حلب بحضور السيد الوزير وعدد من المسؤولين الحكوميين ورجال الأعمال، يتضمن جولة ميدانية في المرافق وورشات العمل.',
                'content_en' => 'Opening ceremony of the new industrial zone in Aleppo with government officials and business leaders, including a facility tour.',
                'seo_description_ar' => 'افتتاح المنطقة الصناعية الجديدة في حلب',
                'category' => 'media',
                'status' => 'published',
                'priority' => 9,
                'published_at' => now()->subDays(5),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=YQHsXMglC9A',
                    'thumbnail' => 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800',
                    'duration' => '08:15',
                ],
            ],
            [
                'title_ar' => 'مؤتمر الاستثمار السوري الأول - التغطية الكاملة',
                'title_en' => 'First Syrian Investment Conference - Full Coverage',
                'content_ar' => 'تغطية فيديو كاملة لفعاليات مؤتمر الاستثمار السوري الأول بحضور مستثمرين محليين ودوليين، تتضمن كلمات الافتتاح والجلسات النقاشية وتوقيع مذكرات التفاهم.',
                'content_en' => 'Full video coverage of the First Syrian Investment Conference with local and international investors, including opening speeches, panel discussions and MOU signings.',
                'seo_description_ar' => 'مؤتمر الاستثمار السوري الأول - التغطية الكاملة',
                'category' => 'media',
                'status' => 'published',
                'priority' => 10,
                'published_at' => now()->subDays(8),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=C0DPdy98e4c',
                    'thumbnail' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
                    'duration' => '47:30',
                ],
            ],
            [
                'title_ar' => 'ندوة تطوير القطاع الصناعي السوري',
                'title_en' => 'Syrian Industrial Sector Development Seminar',
                'content_ar' => 'ندوة حوارية حول آليات تطوير القطاع الصناعي السوري وتعزيز القدرة التنافسية للمنتجات المحلية في الأسواق العربية والدولية.',
                'content_en' => 'Panel discussion on mechanisms for developing the Syrian industrial sector and enhancing local product competitiveness in Arab and international markets.',
                'seo_description_ar' => 'ندوة تطوير القطاع الصناعي السوري',
                'category' => 'media',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(12),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc',
                    'thumbnail' => 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?auto=format&fit=crop&q=80&w=800',
                    'duration' => '32:10',
                ],
            ],
            [
                'title_ar' => 'لقاء السيد الوزير مع قناة سوريا الإخبارية',
                'title_en' => 'Minister Interview with Syria News Channel',
                'content_ar' => 'لقاء تلفزيوني مع السيد الوزير يستعرض فيه الخطة الاقتصادية الجديدة وملف إعادة الإعمار والاستثمار في القطاعات الحيوية.',
                'content_en' => 'TV interview with the Minister reviewing the new economic plan, reconstruction agenda, and investment in vital sectors.',
                'seo_description_ar' => 'لقاء تلفزيوني مع السيد وزير الاقتصاد والصناعة',
                'category' => 'media',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(15),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=hY7m5jjJ9mM',
                    'thumbnail' => 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800',
                    'duration' => '22:45',
                ],
            ],
            [
                'title_ar' => 'زيارة خط إنتاج المعمل الجديد في عدرا الصناعية',
                'title_en' => 'New Production Line Visit at Adra Industrial City',
                'content_ar' => 'زيارة ميدانية لخط الإنتاج الجديد في مدينة عدرا الصناعية، والاطلاع على أحدث التقنيات المستخدمة في التصنيع والتعبئة.',
                'content_en' => 'Field visit to new production line at Adra Industrial City, showcasing latest manufacturing and packaging technologies.',
                'seo_description_ar' => 'زيارة خط إنتاج المعمل الجديد في عدرا الصناعية',
                'category' => 'media',
                'status' => 'published',
                'priority' => 6,
                'published_at' => now()->subDays(18),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
                    'thumbnail' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
                    'duration' => '10:05',
                ],
            ],
            [
                'title_ar' => 'ورشة عمل التحول الرقمي في الخدمات الحكومية',
                'title_en' => 'Digital Transformation in Government Services Workshop',
                'content_ar' => 'ورشة عمل تفاعلية حول التحول الرقمي في الخدمات الحكومية ومنصات الحكومة الإلكترونية، بحضور خبراء تقنيين ومسؤولين.',
                'content_en' => 'Interactive workshop on digital transformation in government services and e-government platforms with tech experts and officials.',
                'seo_description_ar' => 'ورشة عمل التحول الرقمي في الخدمات الحكومية',
                'category' => 'media',
                'status' => 'published',
                'priority' => 6,
                'published_at' => now()->subDays(22),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=aircAruvnKk',
                    'thumbnail' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
                    'duration' => '18:30',
                ],
            ],
            [
                'title_ar' => 'تقرير مصور: إعادة تأهيل المنشآت الصناعية في حمص',
                'title_en' => 'Video Report: Industrial Facility Rehabilitation in Homs',
                'content_ar' => 'تقرير مصور يرصد جهود إعادة تأهيل المنشآت الصناعية المتضررة في محافظة حمص وعودة عجلة الإنتاج.',
                'content_en' => 'Documentary report covering rehabilitation efforts of damaged industrial facilities in Homs and the return of production.',
                'seo_description_ar' => 'تقرير مصور عن إعادة تأهيل المنشآت الصناعية في حمص',
                'category' => 'media',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(25),
                'metadata' => [
                    'media_type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
                    'thumbnail' => 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800',
                    'duration' => '15:42',
                ],
            ],

            // ═══════════════════════════════════════════
            //  PHOTOS (10 items)
            // ═══════════════════════════════════════════

            [
                'title_ar' => 'صور من حفل تكريم الصناعيين المتميزين',
                'title_en' => 'Photos from Outstanding Industrialists Award Ceremony',
                'content_ar' => 'ألبوم صور من حفل تكريم الصناعيين والمصدرين المتميزين في القطاع الصناعي السوري، يتضمن لقطات من حفل توزيع الجوائز والدروع التقديرية.',
                'content_en' => 'Photo album from ceremony honoring outstanding industrialists and exporters, featuring award presentation moments.',
                'seo_description_ar' => 'صور من حفل تكريم الصناعيين المتميزين',
                'category' => 'media',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(3),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
                    'count' => 24,
                ],
            ],
            [
                'title_ar' => 'اجتماع السيد الوزير مع الوفد التجاري الأردني',
                'title_en' => 'Minister Meeting with Jordanian Trade Delegation',
                'content_ar' => 'ألبوم صور من اجتماع السيد الوزير مع الوفد التجاري الأردني لبحث سبل التعاون الاقتصادي وتبادل الخبرات التجارية.',
                'content_en' => 'Photo album from the Minister meeting with Jordanian trade delegation discussing economic cooperation and trade expertise exchange.',
                'seo_description_ar' => 'اجتماع السيد الوزير مع الوفد التجاري الأردني',
                'category' => 'media',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(7),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
                    'count' => 18,
                ],
            ],
            [
                'title_ar' => 'معرض المنتجات السورية في إكسبو دبي',
                'title_en' => 'Syrian Products Exhibition at Dubai Expo',
                'content_ar' => 'صور من الجناح السوري في معرض إكسبو دبي، حيث تم عرض المنتجات الصناعية والزراعية والحرفية السورية.',
                'content_en' => 'Photos from the Syrian pavilion at Dubai Expo, showcasing Syrian industrial, agricultural and handcraft products.',
                'seo_description_ar' => 'معرض المنتجات السورية في إكسبو دبي',
                'category' => 'media',
                'status' => 'published',
                'priority' => 9,
                'published_at' => now()->subDays(10),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&q=80&w=800',
                    'count' => 35,
                ],
            ],
            [
                'title_ar' => 'توقيع مذكرة تفاهم مع وزارة الاقتصاد العراقية',
                'title_en' => 'MOU Signing with Iraqi Ministry of Economy',
                'content_ar' => 'صور من مراسم توقيع مذكرة تفاهم بين وزارة الاقتصاد والصناعة ووزارة الاقتصاد العراقية لتعزيز التبادل التجاري.',
                'content_en' => 'Photos from MOU signing ceremony between the Ministry of Economy and Industry and Iraqi Ministry of Economy to boost trade.',
                'seo_description_ar' => 'توقيع مذكرة تفاهم مع وزارة الاقتصاد العراقية',
                'category' => 'media',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(14),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
                    'count' => 12,
                ],
            ],
            [
                'title_ar' => 'زيارة المصانع في المنطقة الحرة بطرطوس',
                'title_en' => 'Factory Visits at Tartous Free Zone',
                'content_ar' => 'ألبوم صور من الزيارة الميدانية للمصانع العاملة في المنطقة الحرة بطرطوس، والاطلاع على خطوط الإنتاج وجودة المنتجات.',
                'content_en' => 'Photo album from field visit to factories in Tartous Free Zone, inspecting production lines and product quality.',
                'seo_description_ar' => 'زيارة المصانع في المنطقة الحرة بطرطوس',
                'category' => 'media',
                'status' => 'published',
                'priority' => 6,
                'published_at' => now()->subDays(16),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
                    'count' => 20,
                ],
            ],
            [
                'title_ar' => 'ملتقى رجال الأعمال السوريين في الخارج',
                'title_en' => 'Syrian Businessmen Abroad Forum',
                'content_ar' => 'صور من ملتقى رجال الأعمال السوريين في الخارج الذي نظمته الوزارة بالتعاون مع غرف التجارة، بحضور أكثر من 200 رجل أعمال.',
                'content_en' => 'Photos from the Syrian Businessmen Abroad Forum organized by the Ministry with Chambers of Commerce, attended by over 200 business leaders.',
                'seo_description_ar' => 'ملتقى رجال الأعمال السوريين في الخارج',
                'category' => 'media',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(20),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
                    'count' => 42,
                ],
            ],
            [
                'title_ar' => 'تسليم السجلات التجارية الإلكترونية للتجار',
                'title_en' => 'Digital Commercial Register Issuance Ceremony',
                'content_ar' => 'صور من حفل تسليم أول دفعة من السجلات التجارية الإلكترونية الجديدة للتجار، ضمن مشروع رقمنة الخدمات التجارية.',
                'content_en' => 'Photos from the ceremony issuing first batch of new digital commercial registers to merchants under commercial services digitization project.',
                'seo_description_ar' => 'تسليم السجلات التجارية الإلكترونية للتجار',
                'category' => 'media',
                'status' => 'published',
                'priority' => 6,
                'published_at' => now()->subDays(24),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
                    'count' => 15,
                ],
            ],
            [
                'title_ar' => 'اجتماع لجنة حماية المستهلك الشهري',
                'title_en' => 'Monthly Consumer Protection Committee Meeting',
                'content_ar' => 'صور من الاجتماع الشهري للجنة حماية المستهلك لمناقشة آليات ضبط الأسعار ومكافحة الغش التجاري.',
                'content_en' => 'Photos from the monthly Consumer Protection Committee meeting discussing price control mechanisms and combating commercial fraud.',
                'seo_description_ar' => 'اجتماع لجنة حماية المستهلك الشهري',
                'category' => 'media',
                'status' => 'published',
                'priority' => 5,
                'published_at' => now()->subDays(28),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&q=80&w=800',
                    'count' => 10,
                ],
            ],
            [
                'title_ar' => 'تدشين بوابة الخدمات الإلكترونية الجديدة',
                'title_en' => 'New E-Services Portal Launch',
                'content_ar' => 'صور من حفل تدشين بوابة الخدمات الإلكترونية الجديدة لوزارة الاقتصاد والصناعة التي تتيح إنجاز المعاملات عن بُعد.',
                'content_en' => 'Photos from the launch of the new Ministry e-services portal enabling remote transaction processing.',
                'seo_description_ar' => 'تدشين بوابة الخدمات الإلكترونية الجديدة',
                'category' => 'media',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(30),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800',
                    'count' => 16,
                ],
            ],
            [
                'title_ar' => 'جولة في مصنع الأدوية الجديد بريف دمشق',
                'title_en' => 'Tour of New Pharmaceutical Factory in Damascus Countryside',
                'content_ar' => 'صور من الجولة الميدانية في مصنع الأدوية الجديد في ريف دمشق، والاطلاع على خطوط الإنتاج والمختبرات وأنظمة الجودة.',
                'content_en' => 'Photos from field tour of new pharmaceutical factory in Damascus countryside, inspecting production lines, labs and quality systems.',
                'seo_description_ar' => 'جولة في مصنع الأدوية الجديد بريف دمشق',
                'category' => 'media',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(33),
                'metadata' => [
                    'media_type' => 'photo',
                    'url' => 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
                    'count' => 28,
                ],
            ],

            // ═══════════════════════════════════════════
            //  INFOGRAPHICS (7 items)
            // ═══════════════════════════════════════════

            [
                'title_ar' => 'إحصائيات الصادرات السورية - الربع الأول 2026',
                'title_en' => 'Syrian Export Statistics - Q1 2026',
                'content_ar' => 'إنفوجرافيك يوضح إحصائيات الصادرات السورية للربع الأول من 2026 وأهم الأسواق المستهدفة وأبرز المنتجات المصدّرة.',
                'content_en' => 'Infographic showing Syrian export statistics for Q1 2026, key target markets and top exported products.',
                'seo_description_ar' => 'إحصائيات الصادرات السورية - الربع الأول 2026',
                'category' => 'media',
                'status' => 'published',
                'priority' => 9,
                'published_at' => now()->subDays(4),
                'metadata' => [
                    'media_type' => 'infographic',
                    'url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            [
                'title_ar' => 'خارطة المناطق الصناعية في سوريا',
                'title_en' => 'Map of Industrial Zones in Syria',
                'content_ar' => 'إنفوجرافيك يعرض خارطة المناطق الصناعية في سوريا مع عدد المنشآت العاملة والطاقة الإنتاجية لكل منطقة.',
                'content_en' => 'Infographic showing the map of industrial zones in Syria with operating facility counts and production capacity per zone.',
                'seo_description_ar' => 'خارطة المناطق الصناعية في سوريا',
                'category' => 'media',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(9),
                'metadata' => [
                    'media_type' => 'infographic',
                    'url' => 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            [
                'title_ar' => 'مؤشرات الأداء الاقتصادي 2025-2026',
                'title_en' => 'Economic Performance Indicators 2025-2026',
                'content_ar' => 'إنفوجرافيك مقارن يستعرض أبرز مؤشرات الأداء الاقتصادي بين عامي 2025 و2026 بما يشمل الناتج المحلي والتضخم والبطالة.',
                'content_en' => 'Comparative infographic reviewing key economic performance indicators between 2025 and 2026 including GDP, inflation and unemployment.',
                'seo_description_ar' => 'مؤشرات الأداء الاقتصادي 2025-2026',
                'category' => 'media',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(13),
                'metadata' => [
                    'media_type' => 'infographic',
                    'url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            [
                'title_ar' => 'دليل خطوات تسجيل شركة في سوريا',
                'title_en' => 'Guide: Steps to Register a Company in Syria',
                'content_ar' => 'إنفوجرافيك يشرح خطوات تسجيل شركة جديدة في سوريا من الألف إلى الياء، بما يشمل المستندات المطلوبة والرسوم والمدة الزمنية.',
                'content_en' => 'Infographic explaining steps to register a new company in Syria from A to Z, including required documents, fees and timeline.',
                'seo_description_ar' => 'دليل خطوات تسجيل شركة في سوريا',
                'category' => 'media',
                'status' => 'published',
                'priority' => 9,
                'published_at' => now()->subDays(17),
                'metadata' => [
                    'media_type' => 'infographic',
                    'url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            [
                'title_ar' => 'حركة التجارة الخارجية لعام 2026',
                'title_en' => 'Foreign Trade Movement for 2026',
                'content_ar' => 'إنفوجرافيك يعرض حركة التجارة الخارجية السورية لعام 2026 مع تفصيل الواردات والصادرات والميزان التجاري.',
                'content_en' => 'Infographic displaying Syrian foreign trade movement for 2026 with imports, exports and trade balance details.',
                'seo_description_ar' => 'حركة التجارة الخارجية لعام 2026',
                'category' => 'media',
                'status' => 'published',
                'priority' => 7,
                'published_at' => now()->subDays(21),
                'metadata' => [
                    'media_type' => 'infographic',
                    'url' => 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            [
                'title_ar' => 'إنجازات الوزارة في 100 يوم',
                'title_en' => 'Ministry Achievements in 100 Days',
                'content_ar' => 'إنفوجرافيك يلخص أبرز إنجازات وزارة الاقتصاد والصناعة في أول 100 يوم عمل، من قرارات وتسهيلات واتفاقيات.',
                'content_en' => 'Infographic summarizing key Ministry of Economy and Industry achievements in the first 100 working days, including decisions, facilitations and agreements.',
                'seo_description_ar' => 'إنجازات الوزارة في 100 يوم',
                'category' => 'media',
                'status' => 'published',
                'priority' => 10,
                'published_at' => now()->subDays(26),
                'metadata' => [
                    'media_type' => 'infographic',
                    'url' => 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
                ],
            ],
            [
                'title_ar' => 'الفرص الاستثمارية المتاحة حسب القطاع',
                'title_en' => 'Available Investment Opportunities by Sector',
                'content_ar' => 'إنفوجرافيك يوضح عدد الفرص الاستثمارية المتاحة في كل قطاع اقتصادي مع قيمة الاستثمار المتوقعة وعدد فرص العمل.',
                'content_en' => 'Infographic showing available investment opportunities per economic sector with expected investment value and job opportunities.',
                'seo_description_ar' => 'الفرص الاستثمارية المتاحة حسب القطاع',
                'category' => 'media',
                'status' => 'published',
                'priority' => 8,
                'published_at' => now()->subDays(32),
                'metadata' => [
                    'media_type' => 'infographic',
                    'url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600',
                    'thumbnail' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
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
