<?php

namespace Database\Seeders;

use App\Models\SubDirectorate;
use App\Models\Directorate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubDirectoratesSeeder extends Seeder
{
    /**
     * Seed the sub-directorates based on Ministry of Economy and Industry organizational structure.
     * Source: Organizational chart (SRS v2.0 - January 2026)
     * Complete hierarchical structure matching the official ministry organization
     */
    public function run(): void
    {
        // Clear existing sub-directorates
        DB::table('sub_directorates')->truncate();

        $subDirectorates = [
            // ========================================
            // d1 - الإدارة العامة للصناعة (General Administration for Industry)
            // ========================================
            'd1' => [
                [
                    'name_ar' => 'مؤسسات ومعامل القطاع العام',
                    'name_en' => 'Public Sector Institutions and Factories',
                    'url' => '/directorates/industry/public-sector',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'مركز التنمية الصناعية',
                    'name_en' => 'Industrial Development Center',
                    'url' => '/directorates/industry/development-center',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'مديرية المدن والمناطق الصناعية',
                    'name_en' => 'Industrial Cities and Zones Directorate',
                    'url' => '/directorates/industry/industrial-zones',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'مديرية الإشراف على التأهيل الفني',
                    'name_en' => 'Technical Rehabilitation Supervision Directorate',
                    'url' => '/directorates/industry/technical-supervision',
                    'is_external' => false,
                    'order' => 4
                ],
                [
                    'name_ar' => 'مديريات الصناعة في المحافظات',
                    'name_en' => 'Industrial Directorates in Governorates',
                    'url' => '/directorates/industry/governorates',
                    'is_external' => false,
                    'order' => 5
                ],
                [
                    'name_ar' => 'هيئة إدارة المعادن الثمينة',
                    'name_en' => 'Precious Metals Administration Authority',
                    'url' => '/directorates/industry/precious-metals',
                    'is_external' => false,
                    'order' => 6
                ],
                [
                    'name_ar' => 'مركز الاختبارات والأبحاث الصناعية',
                    'name_en' => 'Industrial Testing and Research Center',
                    'url' => '/directorates/industry/research-center',
                    'is_external' => false,
                    'order' => 7
                ],
                [
                    'name_ar' => 'هيئة المواصفات والمقاييس السورية',
                    'name_en' => 'Syrian Standards and Metrology Organization (SASMO)',
                    'url' => 'https://sasmo.gov.sy',
                    'is_external' => true,
                    'order' => 8
                ],
                [
                    'name_ar' => 'مديرية التخطيط الصناعي',
                    'name_en' => 'Industrial Planning Directorate',
                    'url' => '/directorates/industry/planning',
                    'is_external' => false,
                    'order' => 9
                ],
                [
                    'name_ar' => 'مديرية الرقابة الصناعية',
                    'name_en' => 'Industrial Control Directorate',
                    'url' => '/directorates/industry/control',
                    'is_external' => false,
                    'order' => 10
                ],
            ],

            // ========================================
            // d2 - الإدارة العامة للاقتصاد (General Administration for Economy)
            // ========================================
            'd2' => [
                [
                    'name_ar' => 'المؤسسة العامة للمعارض والأسواق الدولية',
                    'name_en' => 'General Institution for Exhibitions and International Markets',
                    'url' => '/directorates/economy/exhibitions',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'هيئة تنمية المشروعات الصغيرة والمتوسطة',
                    'name_en' => 'SME Development Authority',
                    'url' => '/directorates/economy/sme',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'مديرية التجارة الخارجية',
                    'name_en' => 'Foreign Trade Directorate',
                    'url' => '/directorates/economy/foreign-trade',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'مديريات الاقتصاد في المحافظات',
                    'name_en' => 'Economic Directorates in Governorates',
                    'url' => '/directorates/economy/governorates',
                    'is_external' => false,
                    'order' => 4
                ],
                [
                    'name_ar' => 'هيئة دعم وتنمية الإنتاج المحلي والصادرات',
                    'name_en' => 'Local Production and Export Support Authority',
                    'url' => '/directorates/economy/export-support',
                    'is_external' => false,
                    'order' => 5
                ],
                [
                    'name_ar' => 'مديرية السياسات الاقتصادية',
                    'name_en' => 'Economic Policies Directorate',
                    'url' => '/directorates/economy/policies',
                    'is_external' => false,
                    'order' => 6
                ],
                [
                    'name_ar' => 'مديرية التعاون الاستهلاكي',
                    'name_en' => 'Consumer Cooperation Directorate',
                    'url' => '/directorates/economy/consumer-coop',
                    'is_external' => false,
                    'order' => 7
                ],
                [
                    'name_ar' => 'المديريات الفرعية في المحافظات',
                    'name_en' => 'Sub-Directorates in Governorates',
                    'url' => '/directorates/economy/sub-governorates',
                    'is_external' => false,
                    'order' => 8
                ],
                [
                    'name_ar' => 'مديرية المواد والأمن الغذائي',
                    'name_en' => 'Materials and Food Security Directorate',
                    'url' => '/directorates/economy/food-security',
                    'is_external' => false,
                    'order' => 9
                ],
                [
                    'name_ar' => 'مديرية الدراسات الاقتصادية',
                    'name_en' => 'Economic Studies Directorate',
                    'url' => '/directorates/economy/studies',
                    'is_external' => false,
                    'order' => 10
                ],
                [
                    'name_ar' => 'مديرية التنمية الاقتصادية',
                    'name_en' => 'Economic Development Directorate',
                    'url' => '/directorates/economy/development',
                    'is_external' => false,
                    'order' => 11
                ],
            ],

            // ========================================
            // d3 - الإدارة العامة للتجارة الداخلية وحماية المستهلك (Internal Trade & Consumer Protection)
            // ========================================
            'd3' => [
                [
                    'name_ar' => 'السورية للمخابز',
                    'name_en' => 'Syrian Bakeries Company',
                    'url' => '/directorates/trade/bakeries',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'السورية للمطاحن',
                    'name_en' => 'Syrian Mills Company',
                    'url' => '/directorates/trade/mills',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'السورية للتجارة',
                    'name_en' => 'Syrian Trade Company',
                    'url' => '/directorates/trade/syrian-trade',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'مديرية الشركات',
                    'name_en' => 'Companies Directorate',
                    'url' => '/directorates/trade/companies',
                    'is_external' => false,
                    'order' => 4
                ],
                [
                    'name_ar' => 'مديرية حماية الملكية الصناعية والتجارية',
                    'name_en' => 'Industrial and Commercial Property Protection Directorate',
                    'url' => '/directorates/trade/property-protection',
                    'is_external' => false,
                    'order' => 5
                ],
                [
                    'name_ar' => 'مديرية حماية المستهلك وسلامة الغذاء',
                    'name_en' => 'Consumer Protection and Food Safety Directorate',
                    'url' => '/directorates/trade/consumer-protection',
                    'is_external' => false,
                    'order' => 6
                ],
                [
                    'name_ar' => 'مديرية المواصفات الفنية والمخابر',
                    'name_en' => 'Technical Specifications and Laboratories Directorate',
                    'url' => '/directorates/trade/specifications',
                    'is_external' => false,
                    'order' => 7
                ],
                [
                    'name_ar' => 'هيئة المنافسة ومنع الاحتكار',
                    'name_en' => 'Competition and Anti-Monopoly Authority',
                    'url' => '/directorates/trade/competition',
                    'is_external' => false,
                    'order' => 8
                ],
                [
                    'name_ar' => 'مديريات التجارة الداخلية في المحافظات',
                    'name_en' => 'Internal Trade Directorates in Governorates',
                    'url' => '/directorates/trade/governorates',
                    'is_external' => false,
                    'order' => 9
                ],
                [
                    'name_ar' => 'مديرية الرقابة على الأسواق',
                    'name_en' => 'Market Control Directorate',
                    'url' => '/directorates/trade/market-control',
                    'is_external' => false,
                    'order' => 10
                ],
            ],

            // ========================================
            // d4 - مديرية الشؤون القانونية (Legal Affairs Directorate)
            // ========================================
            'd4' => [
                [
                    'name_ar' => 'قسم التشريعات والقوانين',
                    'name_en' => 'Legislation and Laws Department',
                    'url' => '/directorates/legal/legislation',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم الاستشارات القانونية',
                    'name_en' => 'Legal Consultations Department',
                    'url' => '/directorates/legal/consultations',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم العقود والاتفاقيات',
                    'name_en' => 'Contracts and Agreements Department',
                    'url' => '/directorates/legal/contracts',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم المنازعات القانونية',
                    'name_en' => 'Legal Disputes Department',
                    'url' => '/directorates/legal/disputes',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d5 - مديرية الشؤون المالية (Financial Affairs Directorate)
            // ========================================
            'd5' => [
                [
                    'name_ar' => 'قسم الموازنة والتخطيط المالي',
                    'name_en' => 'Budget and Financial Planning Department',
                    'url' => '/directorates/finance/budget',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم المحاسبة والرقابة المالية',
                    'name_en' => 'Accounting and Financial Control Department',
                    'url' => '/directorates/finance/accounting',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم الصرف والخزينة',
                    'name_en' => 'Disbursement and Treasury Department',
                    'url' => '/directorates/finance/treasury',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم التدقيق الداخلي',
                    'name_en' => 'Internal Audit Department',
                    'url' => '/directorates/finance/audit',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d6 - مديرية الموارد البشرية (Human Resources Directorate)
            // ========================================
            'd6' => [
                [
                    'name_ar' => 'قسم شؤون الموظفين',
                    'name_en' => 'Employee Affairs Department',
                    'url' => '/directorates/hr/employees',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم التدريب والتطوير',
                    'name_en' => 'Training and Development Department',
                    'url' => '/directorates/hr/training',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم التوظيف والاستقطاب',
                    'name_en' => 'Recruitment Department',
                    'url' => '/directorates/hr/recruitment',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم الأجور والمزايا',
                    'name_en' => 'Payroll and Benefits Department',
                    'url' => '/directorates/hr/payroll',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d7 - مديرية تقانة المعلومات والاتصالات (IT & Communications Directorate)
            // ========================================
            'd7' => [
                [
                    'name_ar' => 'قسم البنية التحتية والشبكات',
                    'name_en' => 'Infrastructure and Networks Department',
                    'url' => '/directorates/it/infrastructure',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم تطوير الأنظمة والتطبيقات',
                    'name_en' => 'Systems and Applications Development Department',
                    'url' => '/directorates/it/development',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم أمن المعلومات',
                    'name_en' => 'Information Security Department',
                    'url' => '/directorates/it/security',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم الدعم الفني',
                    'name_en' => 'Technical Support Department',
                    'url' => '/directorates/it/support',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d8 - مديرية الشؤون الإدارية (Administrative Affairs Directorate)
            // ========================================
            'd8' => [
                [
                    'name_ar' => 'قسم المراسلات والأرشفة',
                    'name_en' => 'Correspondence and Archiving Department',
                    'url' => '/directorates/admin/correspondence',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم الخدمات العامة',
                    'name_en' => 'General Services Department',
                    'url' => '/directorates/admin/services',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم المشتريات والمخازن',
                    'name_en' => 'Procurement and Warehouses Department',
                    'url' => '/directorates/admin/procurement',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم النقل والصيانة',
                    'name_en' => 'Transport and Maintenance Department',
                    'url' => '/directorates/admin/transport',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d9 - مديرية التخطيط والتعاون الدولي (Planning & International Cooperation Directorate)
            // ========================================
            'd9' => [
                [
                    'name_ar' => 'قسم التخطيط الاستراتيجي',
                    'name_en' => 'Strategic Planning Department',
                    'url' => '/directorates/planning/strategic',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم التعاون الدولي',
                    'name_en' => 'International Cooperation Department',
                    'url' => '/directorates/planning/international',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم المشاريع والبرامج',
                    'name_en' => 'Projects and Programs Department',
                    'url' => '/directorates/planning/projects',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم المتابعة والتقييم',
                    'name_en' => 'Monitoring and Evaluation Department',
                    'url' => '/directorates/planning/monitoring',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d10 - مديرية الدراسات والأبحاث (Studies & Research Directorate)
            // ========================================
            'd10' => [
                [
                    'name_ar' => 'قسم الدراسات الاقتصادية',
                    'name_en' => 'Economic Studies Department',
                    'url' => '/directorates/research/economic',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم الدراسات الصناعية',
                    'name_en' => 'Industrial Studies Department',
                    'url' => '/directorates/research/industrial',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم الإحصاء والمعلومات',
                    'name_en' => 'Statistics and Information Department',
                    'url' => '/directorates/research/statistics',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم البحوث والتطوير',
                    'name_en' => 'Research and Development Department',
                    'url' => '/directorates/research/development',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d11 - مديرية العلاقات العامة والإعلام (Public Relations & Media Directorate)
            // ========================================
            'd11' => [
                [
                    'name_ar' => 'قسم العلاقات العامة',
                    'name_en' => 'Public Relations Department',
                    'url' => '/directorates/media/pr',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم الإعلام والنشر',
                    'name_en' => 'Media and Publishing Department',
                    'url' => '/directorates/media/publishing',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم التواصل الاجتماعي',
                    'name_en' => 'Social Media Department',
                    'url' => '/directorates/media/social',
                    'is_external' => false,
                    'order' => 3
                ],
                [
                    'name_ar' => 'قسم التصميم والمحتوى الرقمي',
                    'name_en' => 'Design and Digital Content Department',
                    'url' => '/directorates/media/design',
                    'is_external' => false,
                    'order' => 4
                ],
            ],

            // ========================================
            // d12 - مديرية المتابعة والتفتيش (Follow-up & Inspection Directorate)
            // ========================================
            'd12' => [
                [
                    'name_ar' => 'قسم متابعة القرارات',
                    'name_en' => 'Decisions Follow-up Department',
                    'url' => '/directorates/inspection/decisions',
                    'is_external' => false,
                    'order' => 1
                ],
                [
                    'name_ar' => 'قسم التفتيش الميداني',
                    'name_en' => 'Field Inspection Department',
                    'url' => '/directorates/inspection/field',
                    'is_external' => false,
                    'order' => 2
                ],
                [
                    'name_ar' => 'قسم التقارير والتوصيات',
                    'name_en' => 'Reports and Recommendations Department',
                    'url' => '/directorates/inspection/reports',
                    'is_external' => false,
                    'order' => 3
                ],
            ],
        ];

        foreach ($subDirectorates as $directorateId => $subs) {
            $directorate = Directorate::find($directorateId);

            if ($directorate) {
                foreach ($subs as $sub) {
                    SubDirectorate::create([
                        'parent_directorate_id' => $directorate->id,
                        'name_ar' => $sub['name_ar'],
                        'name_en' => $sub['name_en'],
                        'url' => $sub['url'],
                        'is_external' => $sub['is_external'],
                        'order' => $sub['order'],
                        'is_active' => true,
                    ]);
                }
            }
        }

        $this->command->info('✓ Sub-directorates seeded successfully with complete MOE organizational structure!');
        $this->command->info('  Seeded detailed departments and divisions for all 12 main directorates');
        $this->command->info('  Total sub-entities created across the organizational hierarchy');
    }
}
