<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['id' => 1, 'directorate_id' => 'd1', 'name_ar' => 'إصدار جواز سفر إلكتروني', 'description_ar' => 'تقديم طلب للحصول على جواز سفر جديد أو تجديده إلكترونياً.', 'is_digital' => true],
            ['id' => 2, 'directorate_id' => 'd1', 'name_ar' => 'خلاصة سجل عدلي (غير محكوم)', 'description_ar' => 'الحصول على وثيقة غير محكوم إلكترونياً.', 'is_digital' => true],
            ['id' => 3, 'directorate_id' => 'd1', 'name_ar' => 'دفع المخالفات المرورية', 'description_ar' => 'الاستعلام عن المخالفات المرورية وتسديدها.', 'is_digital' => true],
            ['id' => 4, 'directorate_id' => 'd2', 'name_ar' => 'الوكالات العدلية', 'description_ar' => 'حجز موعد لتوثيق الوكالات العدلية.', 'is_digital' => false],
            ['id' => 5, 'directorate_id' => 'd2', 'name_ar' => 'بيان ملكية عقارية', 'description_ar' => 'الحصول على بيان يوضح الملكيات العقارية.', 'is_digital' => true],
            ['id' => 6, 'directorate_id' => 'd3', 'name_ar' => 'نتائج التحاليل الطبية', 'description_ar' => 'الاطلاع على نتائج التحاليل من المخابر المعتمدة.', 'is_digital' => true],
            ['id' => 7, 'directorate_id' => 'd4', 'name_ar' => 'نتائج الامتحانات العامة', 'description_ar' => 'عرض نتائج الشهادات الإعدادية والثانوية.', 'is_digital' => true],
            ['id' => 8, 'directorate_id' => 'd4', 'name_ar' => 'تسلسل دراسي', 'description_ar' => 'طلب وثيقة تسلسل دراسي من المؤسسات التعليمية.', 'is_digital' => false],
            ['id' => 9, 'directorate_id' => 'd5', 'name_ar' => 'المفاضلة الجامعية', 'description_ar' => 'التقدم للمفاضلة الجامعية للعام الدراسي.', 'is_digital' => true],
            ['id' => 10, 'directorate_id' => 'd5', 'name_ar' => 'كشف علامات جامعي', 'description_ar' => 'استخراج كشف علامات للسنوات الدراسية.', 'is_digital' => true],
            ['id' => 11, 'directorate_id' => 'd6', 'name_ar' => 'دفع فاتورة الكهرباء', 'description_ar' => 'تسديد فواتير الكهرباء إلكترونياً.', 'is_digital' => true],
            ['id' => 12, 'directorate_id' => 'd6', 'name_ar' => 'طلب عداد جديد', 'description_ar' => 'تقديم طلب لتركيب عداد كهرباء جديد.', 'is_digital' => false],
            ['id' => 13, 'directorate_id' => 'd7', 'name_ar' => 'دفع فاتورة المياه', 'description_ar' => 'تسديد فواتير المياه إلكترونياً.', 'is_digital' => true],
            ['id' => 14, 'directorate_id' => 'd8', 'name_ar' => 'تجديد ترخيص مركبة', 'description_ar' => 'تجديد ترسيم المركبات إلكترونياً.', 'is_digital' => true],
            ['id' => 15, 'directorate_id' => 'd9', 'name_ar' => 'بوابة خدمة المواطن', 'description_ar' => 'منصة موحدة لكافة الخدمات الإلكترونية.', 'is_digital' => true],
            ['id' => 16, 'directorate_id' => 'd10', 'name_ar' => 'براءة ذمة مالية', 'description_ar' => 'الحصول على براءة ذمة من الدوائر المالية.', 'is_digital' => true],
            ['id' => 17, 'directorate_id' => 'd10', 'name_ar' => 'التحقق الضريبي', 'description_ar' => 'خدمة التحقق من الوثائق الضريبية.', 'is_digital' => true],
        ];

        foreach ($services as $service) {
            DB::table('services')->updateOrInsert(
                ['id' => $service['id']],
                $service
            );
        }
    }
}
