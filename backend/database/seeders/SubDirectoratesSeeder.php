<?php

namespace Database\Seeders;

use App\Models\SubDirectorate;
use App\Models\Directorate;
use Illuminate\Database\Seeder;

class SubDirectoratesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subDirectorates = [
            // Digital Economy Directorate
            'd1' => [
                ['name_ar' => 'قسم التطبيقات الذكية', 'name_en' => 'Smart Applications Department', 'url' => '/services/apps', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'قسم البنية التحتية', 'name_en' => 'Infrastructure Department', 'url' => '/services/infrastructure', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'أمن المعلومات', 'name_en' => 'Information Security', 'url' => 'https://cert.sy', 'is_external' => true, 'order' => 3],
                ['name_ar' => 'التحول الرقمي', 'name_en' => 'Digital Transformation', 'url' => '/services/digital-transformation', 'is_external' => false, 'order' => 4],
            ],
            
            // Internal Trade Directorate
            'd2' => [
                ['name_ar' => 'حماية المستهلك', 'name_en' => 'Consumer Protection', 'url' => '/complaints', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'الرقابة التموينية', 'name_en' => 'Supply Control', 'url' => '/services/supply-control', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'مراقبة الأسعار', 'name_en' => 'Price Monitoring', 'url' => '/services/price-monitoring', 'is_external' => false, 'order' => 3],
            ],
            
            // Investment Directorate
            'd3' => [
                ['name_ar' => 'الفرص الاستثمارية', 'name_en' => 'Investment Opportunities', 'url' => '/investment/opportunities', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'النافذة الواحدة', 'name_en' => 'One-Stop Shop', 'url' => '/investment/one-stop', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'التراخيص الاستثمارية', 'name_en' => 'Investment Licenses', 'url' => '/investment/licenses', 'is_external' => false, 'order' => 3],
            ],
            
            // Foreign Trade Directorate
            'd4' => [
                ['name_ar' => 'التصدير والاستيراد', 'name_en' => 'Import & Export', 'url' => '/services/trade', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'الاتفاقيات التجارية', 'name_en' => 'Trade Agreements', 'url' => '/services/agreements', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'الجمارك', 'name_en' => 'Customs', 'url' => 'https://customs.gov.sy', 'is_external' => true, 'order' => 3],
            ],
            
            // Industry Directorate
            'd5' => [
                ['name_ar' => 'التراخيص الصناعية', 'name_en' => 'Industrial Licenses', 'url' => '/services/industrial-licenses', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'المناطق الصناعية', 'name_en' => 'Industrial Zones', 'url' => '/services/industrial-zones', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'الجودة والمواصفات', 'name_en' => 'Quality & Standards', 'url' => '/services/standards', 'is_external' => false, 'order' => 3],
            ],
            
            // SME Support Directorate
            'd6' => [
                ['name_ar' => 'تمويل المشاريع الصغيرة', 'name_en' => 'SME Financing', 'url' => '/services/sme-financing', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'التدريب والإرشاد', 'name_en' => 'Training & Mentoring', 'url' => '/services/training', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'حاضنات الأعمال', 'name_en' => 'Business Incubators', 'url' => '/services/incubators', 'is_external' => false, 'order' => 3],
            ],
            
            // Economic Planning Directorate
            'd7' => [
                ['name_ar' => 'الدراسات الاقتصادية', 'name_en' => 'Economic Studies', 'url' => '/services/economic-studies', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'الإحصاءات', 'name_en' => 'Statistics', 'url' => '/services/statistics', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'التخطيط الاستراتيجي', 'name_en' => 'Strategic Planning', 'url' => '/services/planning', 'is_external' => false, 'order' => 3],
            ],
            
            // Commercial Registry Directorate
            'd8' => [
                ['name_ar' => 'تسجيل الشركات', 'name_en' => 'Company Registration', 'url' => '/services/company-registration', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'السجل التجاري', 'name_en' => 'Commercial Register', 'url' => '/services/commercial-register', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'العلامات التجارية', 'name_en' => 'Trademarks', 'url' => '/services/trademarks', 'is_external' => false, 'order' => 3],
            ],
            
            // Cooperatives Directorate
            'd9' => [
                ['name_ar' => 'تأسيس الجمعيات التعاونية', 'name_en' => 'Cooperative Formation', 'url' => '/services/cooperatives', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'الدعم الفني', 'name_en' => 'Technical Support', 'url' => '/services/coop-support', 'is_external' => false, 'order' => 2],
            ],
            
            // Tourism Directorate
            'd10' => [
                ['name_ar' => 'التراخيص السياحية', 'name_en' => 'Tourism Licenses', 'url' => '/services/tourism-licenses', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'المواقع السياحية', 'name_en' => 'Tourist Sites', 'url' => '/services/tourist-sites', 'is_external' => false, 'order' => 2],
                ['name_ar' => 'الفنادق والمنتجعات', 'name_en' => 'Hotels & Resorts', 'url' => '/services/hotels', 'is_external' => false, 'order' => 3],
            ],
            
            // Legal Affairs Directorate
            'd11' => [
                ['name_ar' => 'الاستشارات القانونية', 'name_en' => 'Legal Consultations', 'url' => '/services/legal', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'العقود والاتفاقيات', 'name_en' => 'Contracts & Agreements', 'url' => '/services/contracts', 'is_external' => false, 'order' => 2],
            ],
            
            // Administrative Affairs Directorate
            'd12' => [
                ['name_ar' => 'الموارد البشرية', 'name_en' => 'Human Resources', 'url' => '/services/hr', 'is_external' => false, 'order' => 1],
                ['name_ar' => 'الشؤون الإدارية', 'name_en' => 'Administrative Affairs', 'url' => '/services/admin', 'is_external' => false, 'order' => 2],
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

        $this->command->info('Sub-directorates seeded successfully!');
    }
}
