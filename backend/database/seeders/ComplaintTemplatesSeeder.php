<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComplaintTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            // 1. Consumer Protection Complaint
            [
                'directorate_id' => 'd3', // التجارة الداخلية وحماية المستهلك
                'name' => 'شكوى حماية المستهلك',
                'name_en' => 'Consumer Protection Complaint',
                'description' => 'تقديم شكوى بشأن الغش التجاري أو المنتجات المغشوشة أو الأسعار المخالفة',
                'description_en' => 'File a complaint regarding commercial fraud, counterfeit products, or price violations',
                'type' => 'standard',
                'requires_identification' => true,
                'sort_order' => 1,
                'is_active' => true,
                'fields' => json_encode([
                    [
                        'key' => 'store_name',
                        'label' => 'اسم المحل / الجهة التجارية',
                        'label_en' => 'Store / Business Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'أدخل اسم المحل أو الشركة',
                        'placeholder_en' => 'Enter store or company name',
                    ],
                    [
                        'key' => 'store_address',
                        'label' => 'عنوان المحل',
                        'label_en' => 'Store Address',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'المدينة - المنطقة - الشارع',
                        'placeholder_en' => 'City - Area - Street',
                    ],
                    [
                        'key' => 'violation_type',
                        'label' => 'نوع المخالفة',
                        'label_en' => 'Violation Type',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'price_increase', 'label' => 'رفع أسعار غير مبرر', 'label_en' => 'Unjustified price increase'],
                            ['value' => 'counterfeit', 'label' => 'منتجات مغشوشة', 'label_en' => 'Counterfeit products'],
                            ['value' => 'expired', 'label' => 'منتجات منتهية الصلاحية', 'label_en' => 'Expired products'],
                            ['value' => 'no_price_tag', 'label' => 'عدم وضع بطاقة السعر', 'label_en' => 'No price tag displayed'],
                            ['value' => 'other', 'label' => 'أخرى', 'label_en' => 'Other'],
                        ],
                    ],
                    [
                        'key' => 'product_name',
                        'label' => 'اسم المنتج / الخدمة',
                        'label_en' => 'Product / Service Name',
                        'type' => 'text',
                        'required' => false,
                        'placeholder' => 'اسم المنتج أو الخدمة المعنية',
                        'placeholder_en' => 'Name of the product or service involved',
                    ],
                    [
                        'key' => 'details',
                        'label' => 'تفاصيل الشكوى',
                        'label_en' => 'Complaint Details',
                        'type' => 'textarea',
                        'required' => true,
                        'placeholder' => 'اشرح المشكلة بالتفصيل...',
                        'placeholder_en' => 'Describe the issue in detail...',
                    ],
                    [
                        'key' => 'purchase_date',
                        'label' => 'تاريخ الشراء / الحادثة',
                        'label_en' => 'Purchase / Incident Date',
                        'type' => 'date',
                        'required' => false,
                    ],
                ]),
            ],

            // 2. Industrial Licensing Complaint
            [
                'directorate_id' => 'd1', // الإدارة العامة للصناعة
                'name' => 'شكوى تراخيص صناعية',
                'name_en' => 'Industrial Licensing Complaint',
                'description' => 'شكوى تتعلق بتأخر إصدار التراخيص الصناعية أو رفض الطلبات',
                'description_en' => 'Complaint related to industrial license delays or application rejections',
                'type' => 'standard',
                'requires_identification' => true,
                'sort_order' => 2,
                'is_active' => true,
                'fields' => json_encode([
                    [
                        'key' => 'company_name',
                        'label' => 'اسم المنشأة / الشركة',
                        'label_en' => 'Company / Facility Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'الاسم الرسمي للمنشأة',
                        'placeholder_en' => 'Official facility name',
                    ],
                    [
                        'key' => 'license_type',
                        'label' => 'نوع الترخيص',
                        'label_en' => 'License Type',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'new', 'label' => 'ترخيص جديد', 'label_en' => 'New license'],
                            ['value' => 'renewal', 'label' => 'تجديد ترخيص', 'label_en' => 'License renewal'],
                            ['value' => 'modification', 'label' => 'تعديل ترخيص', 'label_en' => 'License modification'],
                            ['value' => 'transfer', 'label' => 'نقل ترخيص', 'label_en' => 'License transfer'],
                        ],
                    ],
                    [
                        'key' => 'application_number',
                        'label' => 'رقم الطلب (إن وجد)',
                        'label_en' => 'Application Number (if available)',
                        'type' => 'text',
                        'required' => false,
                        'placeholder' => 'رقم الطلب المقدم',
                        'placeholder_en' => 'Submitted application number',
                    ],
                    [
                        'key' => 'application_date',
                        'label' => 'تاريخ تقديم الطلب',
                        'label_en' => 'Application Date',
                        'type' => 'date',
                        'required' => false,
                    ],
                    [
                        'key' => 'details',
                        'label' => 'وصف المشكلة',
                        'label_en' => 'Problem Description',
                        'type' => 'textarea',
                        'required' => true,
                        'placeholder' => 'اشرح المشكلة التي تواجهها مع الترخيص...',
                        'placeholder_en' => 'Describe the licensing issue you are facing...',
                    ],
                ]),
            ],

            // 3. Price Violation Report
            [
                'directorate_id' => 'd3', // التجارة الداخلية وحماية المستهلك
                'name' => 'بلاغ مخالفة أسعار',
                'name_en' => 'Price Violation Report',
                'description' => 'الإبلاغ عن مخالفات في الأسعار أو الاحتكار أو تلاعب بالمواد',
                'description_en' => 'Report price violations, monopoly, or material manipulation',
                'type' => 'standard',
                'requires_identification' => false,
                'sort_order' => 3,
                'is_active' => true,
                'fields' => json_encode([
                    [
                        'key' => 'store_name',
                        'label' => 'اسم المحل / التاجر',
                        'label_en' => 'Store / Merchant Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'اسم المحل أو التاجر المخالف',
                        'placeholder_en' => 'Name of the violating store or merchant',
                    ],
                    [
                        'key' => 'location',
                        'label' => 'الموقع / العنوان',
                        'label_en' => 'Location / Address',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'المحافظة - المنطقة - العنوان التفصيلي',
                        'placeholder_en' => 'Governorate - Area - Detailed address',
                    ],
                    [
                        'key' => 'product_name',
                        'label' => 'اسم المادة / المنتج',
                        'label_en' => 'Product / Material Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'المادة التي تمت المخالفة بشأنها',
                        'placeholder_en' => 'The product the violation is about',
                    ],
                    [
                        'key' => 'reported_price',
                        'label' => 'السعر المعروض (ل.س)',
                        'label_en' => 'Listed Price (SYP)',
                        'type' => 'number',
                        'required' => false,
                        'placeholder' => 'السعر الذي شاهدته',
                        'placeholder_en' => 'The price you observed',
                    ],
                    [
                        'key' => 'details',
                        'label' => 'تفاصيل إضافية',
                        'label_en' => 'Additional Details',
                        'type' => 'textarea',
                        'required' => false,
                        'placeholder' => 'أي معلومات إضافية عن المخالفة...',
                        'placeholder_en' => 'Any additional information about the violation...',
                    ],
                ]),
            ],

            // 4. Investment Complaint
            [
                'directorate_id' => 'd2', // الإدارة العامة للاقتصاد
                'name' => 'شكوى استثمارية',
                'name_en' => 'Investment Complaint',
                'description' => 'شكوى تتعلق بعقبات استثمارية أو إجراءات بيروقراطية تعيق المشاريع',
                'description_en' => 'Complaint related to investment obstacles or bureaucratic procedures hindering projects',
                'type' => 'standard',
                'requires_identification' => true,
                'sort_order' => 4,
                'is_active' => true,
                'fields' => json_encode([
                    [
                        'key' => 'company_name',
                        'label' => 'اسم الشركة / المشروع',
                        'label_en' => 'Company / Project Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'اسم الشركة أو المشروع الاستثماري',
                        'placeholder_en' => 'Name of the company or investment project',
                    ],
                    [
                        'key' => 'investment_sector',
                        'label' => 'القطاع الاستثماري',
                        'label_en' => 'Investment Sector',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'industrial', 'label' => 'صناعي', 'label_en' => 'Industrial'],
                            ['value' => 'commercial', 'label' => 'تجاري', 'label_en' => 'Commercial'],
                            ['value' => 'agricultural', 'label' => 'زراعي', 'label_en' => 'Agricultural'],
                            ['value' => 'tourism', 'label' => 'سياحي', 'label_en' => 'Tourism'],
                            ['value' => 'technology', 'label' => 'تقني', 'label_en' => 'Technology'],
                            ['value' => 'other', 'label' => 'أخرى', 'label_en' => 'Other'],
                        ],
                    ],
                    [
                        'key' => 'obstacle_type',
                        'label' => 'نوع العائق',
                        'label_en' => 'Obstacle Type',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'licensing', 'label' => 'تأخر في التراخيص', 'label_en' => 'Licensing delays'],
                            ['value' => 'bureaucracy', 'label' => 'إجراءات بيروقراطية', 'label_en' => 'Bureaucratic procedures'],
                            ['value' => 'customs', 'label' => 'مشاكل جمركية', 'label_en' => 'Customs issues'],
                            ['value' => 'tax', 'label' => 'مشاكل ضريبية', 'label_en' => 'Tax issues'],
                            ['value' => 'other', 'label' => 'أخرى', 'label_en' => 'Other'],
                        ],
                    ],
                    [
                        'key' => 'details',
                        'label' => 'وصف المشكلة',
                        'label_en' => 'Problem Description',
                        'type' => 'textarea',
                        'required' => true,
                        'placeholder' => 'اشرح العائق الاستثماري بالتفصيل...',
                        'placeholder_en' => 'Describe the investment obstacle in detail...',
                    ],
                ]),
            ],

            // 5. Bakery / Bread Complaint
            [
                'directorate_id' => 'd13', // السورية للمخابز
                'name' => 'شكوى مخابز وخبز',
                'name_en' => 'Bakery & Bread Complaint',
                'description' => 'شكوى تتعلق بجودة الخبز أو نقص الطحين أو مخالفات المخابز',
                'description_en' => 'Complaint related to bread quality, flour shortage, or bakery violations',
                'type' => 'standard',
                'requires_identification' => false,
                'sort_order' => 5,
                'is_active' => true,
                'fields' => json_encode([
                    [
                        'key' => 'bakery_name',
                        'label' => 'اسم المخبز',
                        'label_en' => 'Bakery Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'اسم المخبز المشتكى عليه',
                        'placeholder_en' => 'Name of the bakery complained about',
                    ],
                    [
                        'key' => 'bakery_location',
                        'label' => 'موقع المخبز',
                        'label_en' => 'Bakery Location',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'المحافظة - المنطقة',
                        'placeholder_en' => 'Governorate - Area',
                    ],
                    [
                        'key' => 'complaint_type',
                        'label' => 'نوع الشكوى',
                        'label_en' => 'Complaint Type',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'quality', 'label' => 'جودة الخبز رديئة', 'label_en' => 'Poor bread quality'],
                            ['value' => 'weight', 'label' => 'نقص في الوزن', 'label_en' => 'Underweight'],
                            ['value' => 'availability', 'label' => 'عدم توفر الخبز', 'label_en' => 'Bread unavailability'],
                            ['value' => 'price', 'label' => 'مخالفة في السعر', 'label_en' => 'Price violation'],
                            ['value' => 'hygiene', 'label' => 'مخالفة صحية', 'label_en' => 'Hygiene violation'],
                            ['value' => 'other', 'label' => 'أخرى', 'label_en' => 'Other'],
                        ],
                    ],
                    [
                        'key' => 'details',
                        'label' => 'تفاصيل الشكوى',
                        'label_en' => 'Complaint Details',
                        'type' => 'textarea',
                        'required' => false,
                        'placeholder' => 'تفاصيل إضافية...',
                        'placeholder_en' => 'Additional details...',
                    ],
                ]),
            ],

            // 6. General Complaint (Open - free text)
            [
                'directorate_id' => 'd2', // الإدارة العامة للاقتصاد (default)
                'name' => 'شكوى عامة',
                'name_en' => 'General Complaint',
                'description' => 'تقديم شكوى عامة لا تندرج ضمن التصنيفات المحددة',
                'description_en' => 'Submit a general complaint that does not fall under specific categories',
                'type' => 'open',
                'requires_identification' => false,
                'sort_order' => 99,
                'is_active' => true,
                'fields' => json_encode([]),
            ],

            // 7. Standards & Metrology Complaint
            [
                'directorate_id' => 'd16', // هيئة المواصفات والمقاييس
                'name' => 'شكوى مواصفات ومقاييس',
                'name_en' => 'Standards & Metrology Complaint',
                'description' => 'شكوى تتعلق بمنتجات لا تطابق المواصفات القياسية السورية',
                'description_en' => 'Complaint about products not conforming to Syrian standards',
                'type' => 'standard',
                'requires_identification' => false,
                'sort_order' => 6,
                'is_active' => true,
                'fields' => json_encode([
                    [
                        'key' => 'product_name',
                        'label' => 'اسم المنتج',
                        'label_en' => 'Product Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'اسم المنتج المخالف',
                        'placeholder_en' => 'Name of the non-conforming product',
                    ],
                    [
                        'key' => 'manufacturer',
                        'label' => 'اسم المصنّع / المستورد',
                        'label_en' => 'Manufacturer / Importer Name',
                        'type' => 'text',
                        'required' => false,
                        'placeholder' => 'اسم الشركة المصنعة أو المستوردة',
                        'placeholder_en' => 'Name of the manufacturing or importing company',
                    ],
                    [
                        'key' => 'purchase_location',
                        'label' => 'مكان الشراء',
                        'label_en' => 'Purchase Location',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'المحل أو المكان الذي اشتريت منه المنتج',
                        'placeholder_en' => 'Store or location where you bought the product',
                    ],
                    [
                        'key' => 'issue_description',
                        'label' => 'وصف عدم المطابقة',
                        'label_en' => 'Non-Conformity Description',
                        'type' => 'textarea',
                        'required' => true,
                        'placeholder' => 'اشرح كيف لا يطابق المنتج المواصفات...',
                        'placeholder_en' => 'Describe how the product does not meet standards...',
                    ],
                ]),
            ],

            // 8. SME Support Complaint
            [
                'directorate_id' => 'd17', // هيئة تنمية المشروعات الصغيرة والمتوسطة
                'name' => 'شكوى دعم المشروعات الصغيرة',
                'name_en' => 'SME Support Complaint',
                'description' => 'شكوى تتعلق ببرامج دعم المشروعات الصغيرة والمتوسطة',
                'description_en' => 'Complaint related to SME support programs',
                'type' => 'standard',
                'requires_identification' => true,
                'sort_order' => 7,
                'is_active' => true,
                'fields' => json_encode([
                    [
                        'key' => 'project_name',
                        'label' => 'اسم المشروع',
                        'label_en' => 'Project Name',
                        'type' => 'text',
                        'required' => true,
                        'placeholder' => 'اسم مشروعك',
                        'placeholder_en' => 'Your project name',
                    ],
                    [
                        'key' => 'support_program',
                        'label' => 'البرنامج / الخدمة',
                        'label_en' => 'Program / Service',
                        'type' => 'select',
                        'required' => true,
                        'options' => [
                            ['value' => 'financing', 'label' => 'تمويل', 'label_en' => 'Financing'],
                            ['value' => 'training', 'label' => 'تدريب', 'label_en' => 'Training'],
                            ['value' => 'consulting', 'label' => 'استشارات', 'label_en' => 'Consulting'],
                            ['value' => 'licensing', 'label' => 'تراخيص', 'label_en' => 'Licensing'],
                            ['value' => 'other', 'label' => 'أخرى', 'label_en' => 'Other'],
                        ],
                    ],
                    [
                        'key' => 'details',
                        'label' => 'وصف المشكلة',
                        'label_en' => 'Problem Description',
                        'type' => 'textarea',
                        'required' => true,
                        'placeholder' => 'اشرح المشكلة التي تواجهها...',
                        'placeholder_en' => 'Describe the issue you are facing...',
                    ],
                ]),
            ],
        ];

        foreach ($templates as $template) {
            DB::table('complaint_templates')->updateOrInsert(
                ['name' => $template['name']],
                array_merge($template, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
