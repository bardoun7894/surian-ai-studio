<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesSeeder extends Seeder
{
    /**
     * Seed services based on Ministry of Economy and Industry structure.
     * d1 = General Administration for Industry
     * d2 = General Administration for Economy
     * d3 = General Administration for Internal Trade & Consumer Protection
     */
    public function run(): void
    {
        // Clear existing services
        DB::table('services')->truncate();

        $services = [
            // d1 - الإدارة العامة للصناعة (Industry)
            ['id' => 1, 'directorate_id' => 'd1', 'name_ar' => 'ترخيص منشأة صناعية', 'name_en' => 'Industrial Facility License', 'description_ar' => 'تقديم طلب للحصول على ترخيص لإنشاء منشأة صناعية جديدة أو توسيع منشأة قائمة.', 'description_en' => 'Apply for a license to establish or expand an industrial facility.', 'is_digital' => true],
            ['id' => 2, 'directorate_id' => 'd1', 'name_ar' => 'تسجيل سجل صناعي', 'name_en' => 'Industrial Registry', 'description_ar' => 'تسجيل المنشآت الصناعية في السجل الصناعي الوطني.', 'description_en' => 'Register industrial establishments in the national industrial registry.', 'is_digital' => true],
            ['id' => 3, 'directorate_id' => 'd1', 'name_ar' => 'شهادة المطابقة والجودة', 'name_en' => 'Quality Conformity Certificate', 'description_ar' => 'الحصول على شهادة مطابقة المنتجات للمواصفات القياسية السورية.', 'description_en' => 'Obtain product conformity certificate to Syrian standards.', 'is_digital' => false],
            ['id' => 4, 'directorate_id' => 'd1', 'name_ar' => 'تخصيص قطعة أرض صناعية', 'name_en' => 'Industrial Land Allocation', 'description_ar' => 'تقديم طلب لتخصيص قطعة أرض في المناطق الصناعية.', 'description_en' => 'Apply for industrial land allocation in industrial zones.', 'is_digital' => true],
            ['id' => 5, 'directorate_id' => 'd1', 'name_ar' => 'فحص المعادن الثمينة', 'name_en' => 'Precious Metals Testing', 'description_ar' => 'خدمة فحص وتحليل المعادن الثمينة ودمغها.', 'description_en' => 'Precious metals testing, analysis and hallmarking.', 'is_digital' => false],
            ['id' => 6, 'directorate_id' => 'd1', 'name_ar' => 'اختبارات المنتجات الصناعية', 'name_en' => 'Industrial Products Testing', 'description_ar' => 'إجراء اختبارات الجودة على المنتجات الصناعية في مركز الاختبارات.', 'description_en' => 'Conduct quality tests on industrial products at the testing center.', 'is_digital' => false],

            // d2 - الإدارة العامة للاقتصاد (Economy)
            ['id' => 7, 'directorate_id' => 'd2', 'name_ar' => 'إجازة استيراد', 'name_en' => 'Import License', 'description_ar' => 'تقديم طلب للحصول على إجازة استيراد للبضائع والمواد الأولية.', 'description_en' => 'Apply for import license for goods and raw materials.', 'is_digital' => true],
            ['id' => 8, 'directorate_id' => 'd2', 'name_ar' => 'إجازة تصدير', 'name_en' => 'Export License', 'description_ar' => 'تقديم طلب للحصول على إجازة تصدير للمنتجات السورية.', 'description_en' => 'Apply for export license for Syrian products.', 'is_digital' => true],
            ['id' => 9, 'directorate_id' => 'd2', 'name_ar' => 'تمويل المشاريع الصغيرة', 'name_en' => 'SME Financing', 'description_ar' => 'برامج دعم وتمويل المشاريع الصغيرة والمتوسطة.', 'description_en' => 'SME support and financing programs.', 'is_digital' => true],
            ['id' => 10, 'directorate_id' => 'd2', 'name_ar' => 'المشاركة في المعارض الدولية', 'name_en' => 'International Exhibition', 'description_ar' => 'تسجيل الشركات للمشاركة في معرض دمشق الدولي والمعارض التخصصية.', 'description_en' => 'Register for Damascus International Fair and specialized exhibitions.', 'is_digital' => true],
            ['id' => 11, 'directorate_id' => 'd2', 'name_ar' => 'دراسات اقتصادية', 'name_en' => 'Economic Studies', 'description_ar' => 'طلب دراسات وتقارير اقتصادية متخصصة.', 'description_en' => 'Request specialized economic studies and reports.', 'is_digital' => true],
            ['id' => 12, 'directorate_id' => 'd2', 'name_ar' => 'تأسيس جمعية تعاونية', 'name_en' => 'Cooperative Formation', 'description_ar' => 'تقديم طلب لتأسيس جمعية تعاونية استهلاكية.', 'description_en' => 'Apply to establish a consumer cooperative.', 'is_digital' => true],

            // d3 - الإدارة العامة للتجارة الداخلية وحماية المستهلك (Trade & Consumer Protection)
            ['id' => 13, 'directorate_id' => 'd3', 'name_ar' => 'تسجيل شركة تجارية', 'name_en' => 'Commercial Company Registration', 'description_ar' => 'تسجيل الشركات التجارية في السجل التجاري.', 'description_en' => 'Register commercial companies in the commercial registry.', 'is_digital' => true],
            ['id' => 14, 'directorate_id' => 'd3', 'name_ar' => 'شكوى حماية المستهلك', 'name_en' => 'Consumer Protection Complaint', 'description_ar' => 'تقديم شكوى في حال التعرض للغش التجاري أو المخالفات السعرية.', 'description_en' => 'File a complaint for commercial fraud or price violations.', 'is_digital' => true],
            ['id' => 15, 'directorate_id' => 'd3', 'name_ar' => 'الاستعلام عن الأسعار', 'name_en' => 'Price Inquiry', 'description_ar' => 'الاستعلام عن الأسعار الرسمية للمواد الأساسية والمحروقات.', 'description_en' => 'Inquire about official prices for basic materials and fuel.', 'is_digital' => true],
            ['id' => 16, 'directorate_id' => 'd3', 'name_ar' => 'تسجيل علامة تجارية', 'name_en' => 'Trademark Registration', 'description_ar' => 'تسجيل وحماية العلامات التجارية.', 'description_en' => 'Register and protect trademarks.', 'is_digital' => true],
            ['id' => 17, 'directorate_id' => 'd3', 'name_ar' => 'ترخيص نشاط تجاري', 'name_en' => 'Commercial Activity License', 'description_ar' => 'الحصول على ترخيص لممارسة النشاط التجاري.', 'description_en' => 'Obtain a license for commercial activity.', 'is_digital' => true],
            ['id' => 18, 'directorate_id' => 'd3', 'name_ar' => 'بطاقة تموينية', 'name_en' => 'Ration Card Services', 'description_ar' => 'خدمات البطاقة التموينية والمواد المدعومة.', 'description_en' => 'Ration card and subsidized materials services.', 'is_digital' => true],
        ];

        foreach ($services as $service) {
            DB::table('services')->insert($service);
        }

        $this->command->info('Services seeded successfully with MOE structure!');
    }
}
