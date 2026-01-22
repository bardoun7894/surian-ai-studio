<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectoratesSeeder extends Seeder
{
    public function run(): void
    {
        $directorates = [
            [
                'id' => 'd1',
                'name_ar' => 'وزارة الداخلية',
                'name_en' => 'Ministry of Interior',
                'description' => 'إدارة الأحوال المدنية، الجوازات، وشؤون الهجرة والمرور.',
                'icon' => 'ShieldAlert',
                'is_active' => true,
                'featured' => true,
                'logo_path' => '/assets/eagle-logo.svg',
            ],
            [
                'id' => 'd2',
                'name_ar' => 'وزارة العدل',
                'name_en' => 'Ministry of Justice',
                'description' => 'الخدمات القضائية، الوكالات، والمحاكم.',
                'icon' => 'Scale',
                'is_active' => true,
                'featured' => true,
                'logo_path' => '/assets/eagle-logo.svg',
            ],
            [
                'id' => 'd3',
                'name_ar' => 'وزارة الصحة',
                'name_en' => 'Ministry of Health',
                'description' => 'الخدمات الطبية، المشافي، والتراخيص الصحية.',
                'icon' => 'HeartPulse',
                'is_active' => true,
                'featured' => true,
                'logo_path' => '/assets/eagle-logo.svg',
            ],
            [
                'id' => 'd4',
                'name_ar' => 'وزارة التربية',
                'name_en' => 'Ministry of Education',
                'description' => 'شؤون المدارس، المناهج، والامتحانات.',
                'icon' => 'BookOpen',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd5',
                'name_ar' => 'وزارة التعليم العالي',
                'name_en' => 'Ministry of Higher Education',
                'description' => 'الجامعات الحكومية، المنح، والبحث العلمي.',
                'icon' => 'GraduationCap',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd6',
                'name_ar' => 'وزارة الكهرباء',
                'name_en' => 'Ministry of Electricity',
                'description' => 'خدمات المشتركين، الفواتير، والشكاوى الكهربائية.',
                'icon' => 'Zap',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd7',
                'name_ar' => 'وزارة الموارد المائية',
                'name_en' => 'Ministry of Water Resources',
                'description' => 'مياه الشرب، الصرف الصحي، والري.',
                'icon' => 'Droplets',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd8',
                'name_ar' => 'وزارة النقل',
                'name_en' => 'Ministry of Transport',
                'description' => 'تراخيص المركبات، النقل البري والبحري والجوي.',
                'icon' => 'Plane',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd9',
                'name_ar' => 'وزارة الاتصالات',
                'name_en' => 'Ministry of Communications',
                'description' => 'خدمات الإنترنت، البريد، والتوقيع الرقمي.',
                'icon' => 'Wifi',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd10',
                'name_ar' => 'وزارة المالية',
                'name_en' => 'Ministry of Finance',
                'description' => 'الضرائب، الرسوم، والخدمات المالية.',
                'icon' => 'Banknote',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd11',
                'name_ar' => 'وزارة السياحة',
                'name_en' => 'Ministry of Tourism',
                'description' => 'تراخيص المنشآت السياحية والترويج.',
                'icon' => 'Map',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ],
            [
                'id' => 'd12',
                'name_ar' => 'وزارة الصناعة',
                'name_en' => 'Ministry of Industry',
                'description' => 'تراخيص المصانع والسجلات الصناعية.',
                'icon' => 'Factory',
                'is_active' => true,
                'featured' => false,
                'logo_path' => null,
            ]
        ];

        foreach ($directorates as $directorate) {
            DB::table('directorates')->updateOrInsert(
                ['id' => $directorate['id']],
                $directorate
            );
        }
    }
}
