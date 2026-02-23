<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectoratesSeeder extends Seeder
{
    /**
     * Seed the directorates based on Ministry of Economy and Industry organizational structure.
     * Source: Organizational chart (SRS v2.0 - January 2026)
     * Complete structure matching the official ministry organization
     */
    public function run(): void
    {
        // Clear existing data
        DB::table('sub_directorates')->delete();
        DB::table('directorates')->delete();

        $directorates = [
            // ========================================
            // المديريات الرئيسية الثلاث (3 Featured Main Administrations)
            // ========================================

            [
                'id' => 'd1',
                'name_ar' => 'الإدارة العامة للصناعة',
                'name_en' => 'General Administration for Industry',
                'description' => 'إدارة شؤون الصناعة والمصانع والمناطق الصناعية والمواصفات والمقاييس.',
                'description_en' => 'Managing industrial affairs, factories, industrial zones, standards, and metrology.',
                'icon' => 'Factory',
                'is_active' => true,
                'featured' => true,
                'logo_path' => '/assets/industry-logo.svg',
            ],
            [
                'id' => 'd2',
                'name_ar' => 'الإدارة العامة للاقتصاد',
                'name_en' => 'General Administration for Economy',
                'description' => 'إدارة شؤون الاقتصاد والتجارة الخارجية والسياسات الاقتصادية والمشروعات الصغيرة والمتوسطة.',
                'description_en' => 'Managing economic affairs, foreign trade, economic policies, and small and medium enterprises.',
                'icon' => 'TrendingUp',
                'is_active' => true,
                'featured' => true,
                'logo_path' => '/assets/economy-logo.svg',
            ],
            [
                'id' => 'd3',
                'name_ar' => 'الإدارة العامة للتجارة الداخلية وحماية المستهلك',
                'name_en' => 'General Administration for Internal Trade & Consumer Protection',
                'description' => 'إدارة شؤون التجارة الداخلية وحماية المستهلك والرقابة على الأسواق والشركات.',
                'description_en' => 'Managing internal trade, consumer protection, market oversight, and corporate regulation.',
                'icon' => 'ShieldCheck',
                'is_active' => true,
                'featured' => true,
                'logo_path' => '/assets/trade-logo.svg',
            ],

            // ========================================
            // مديريات إدارية ودعم (Administrative & Support Directorates)
            // ========================================

            [
                'id' => 'd4',
                'name_ar' => 'مديرية الشؤون القانونية',
                'name_en' => 'Legal Affairs Directorate',
                'description' => 'الإشراف على الجوانب القانونية والتشريعية للوزارة.',
                'icon' => 'Scale',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd5',
                'name_ar' => 'مديرية الشؤون المالية',
                'name_en' => 'Financial Affairs Directorate',
                'description' => 'إدارة الموازنات والشؤون المالية للوزارة.',
                'icon' => 'DollarSign',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd6',
                'name_ar' => 'مديرية الموارد البشرية',
                'name_en' => 'Human Resources Directorate',
                'description' => 'إدارة شؤون الموظفين والتدريب والتطوير.',
                'icon' => 'Users',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd7',
                'name_ar' => 'مديرية تقانة المعلومات والاتصالات',
                'name_en' => 'Information Technology & Communications Directorate',
                'description' => 'تطوير وصيانة البنية التحتية التقنية والرقمية.',
                'icon' => 'Server',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd8',
                'name_ar' => 'مديرية الشؤون الإدارية',
                'name_en' => 'Administrative Affairs Directorate',
                'description' => 'إدارة الشؤون الإدارية والخدمات اللوجستية.',
                'icon' => 'FileText',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd9',
                'name_ar' => 'مديرية التخطيط والتعاون الدولي',
                'name_en' => 'Planning & International Cooperation Directorate',
                'description' => 'التخطيط الاستراتيجي والتنسيق مع المنظمات الدولية.',
                'icon' => 'Globe',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd10',
                'name_ar' => 'مديرية الدراسات والأبحاث',
                'name_en' => 'Studies & Research Directorate',
                'description' => 'إجراء الدراسات والأبحاث الاقتصادية والصناعية.',
                'icon' => 'BookOpen',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd11',
                'name_ar' => 'مديرية العلاقات العامة والإعلام',
                'name_en' => 'Public Relations & Media Directorate',
                'description' => 'إدارة العلاقات العامة والإعلام والاتصال المؤسسي.',
                'icon' => 'Radio',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd12',
                'name_ar' => 'مديرية المتابعة والتفتيش',
                'name_en' => 'Follow-up & Inspection Directorate',
                'description' => 'متابعة تنفيذ القرارات والتفتيش على المنشآت.',
                'icon' => 'Search',
                'is_active' => true,
                'featured' => false,
            ],

            // ========================================
            // الشركات والمؤسسات التابعة (Affiliated Companies & Institutions)
            // ========================================

            [
                'id' => 'd13',
                'name_ar' => 'السورية للمخابز',
                'name_en' => 'Syrian Bakeries Company',
                'description' => 'الشركة المسؤولة عن المخابز الآلية في سوريا.',
                'icon' => 'Home',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd14',
                'name_ar' => 'السورية للمطاحن',
                'name_en' => 'Syrian Mills Company',
                'description' => 'الشركة المسؤولة عن المطاحن وإنتاج الطحين.',
                'icon' => 'Home',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd15',
                'name_ar' => 'السورية للتجارة',
                'name_en' => 'Syrian Trade Company',
                'description' => 'الشركة العامة للتجارة الداخلية.',
                'icon' => 'ShoppingCart',
                'is_active' => true,
                'featured' => false,
            ],

            // ========================================
            // الهيئات المستقلة (Independent Authorities)
            // ========================================

            [
                'id' => 'd16',
                'name_ar' => 'هيئة المواصفات والمقاييس السورية',
                'name_en' => 'Syrian Standards and Metrology Organization (SASMO)',
                'description' => 'الهيئة المسؤولة عن وضع المواصفات القياسية والمقاييس.',
                'icon' => 'Award',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd17',
                'name_ar' => 'هيئة تنمية المشروعات الصغيرة والمتوسطة',
                'name_en' => 'SME Development Authority',
                'description' => 'دعم وتنمية المشروعات الصغيرة والمتوسطة.',
                'icon' => 'Briefcase',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd18',
                'name_ar' => 'هيئة المنافسة ومنع الاحتكار',
                'name_en' => 'Competition and Anti-Monopoly Authority',
                'description' => 'تنظيم المنافسة ومنع الاحتكار في السوق.',
                'icon' => 'AlertTriangle',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd19',
                'name_ar' => 'هيئة دعم وتنمية الإنتاج المحلي والصادرات',
                'name_en' => 'Local Production and Export Support Authority',
                'description' => 'دعم الإنتاج المحلي وتشجيع الصادرات.',
                'icon' => 'Package',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd20',
                'name_ar' => 'هيئة إدارة المعادن الثمينة',
                'name_en' => 'Precious Metals Administration Authority',
                'description' => 'الرقابة على تجارة المعادن الثمينة والمجوهرات.',
                'icon' => 'Gem',
                'is_active' => true,
                'featured' => false,
            ],

            // ========================================
            // المراكز المتخصصة (Specialized Centers)
            // ========================================

            [
                'id' => 'd21',
                'name_ar' => 'مركز التنمية الصناعية',
                'name_en' => 'Industrial Development Center',
                'description' => 'تطوير القطاع الصناعي وتقديم الاستشارات الفنية.',
                'icon' => 'Settings',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd22',
                'name_ar' => 'مركز الاختبارات والأبحاث الصناعية',
                'name_en' => 'Industrial Testing and Research Center',
                'description' => 'إجراء الاختبارات والأبحاث للمنتجات الصناعية.',
                'icon' => 'Microscope',
                'is_active' => true,
                'featured' => false,
            ],
            [
                'id' => 'd23',
                'name_ar' => 'المؤسسة العامة للمعارض والأسواق الدولية',
                'name_en' => 'General Institution for Exhibitions and International Markets',
                'description' => 'تنظيم المعارض والمشاركة في الأسواق الدولية.',
                'icon' => 'Store',
                'is_active' => true,
                'featured' => false,
            ],
        ];

        foreach ($directorates as $directorate) {
            DB::table('directorates')->insert($directorate);
        }

        $this->command->info('✓ Directorates seeded successfully with complete MOE organizational structure!');
        $this->command->info('  - 3 Featured main administrations');
        $this->command->info('  - 9 Administrative & support directorates');
        $this->command->info('  - 3 Affiliated companies');
        $this->command->info('  - 5 Independent authorities');
        $this->command->info('  - 3 Specialized centers');
        $this->command->info('  Total: 23 organizational entities');
    }
}
