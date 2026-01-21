<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing FAQs
        Faq::truncate();

        $faqs = [
            [
                'question_en' => 'How do I create a new account on the citizen portal?',
                'question_ar' => 'كيف يمكنني إنشاء حساب جديد على بوابة المواطن؟',
                'answer_en' => 'You can create a new account by clicking the login button at the top of the page and selecting "Create Account". Fill in the required information including your national ID, email, and phone number.',
                'answer_ar' => 'يمكنك إنشاء حساب جديد بالضغط على زر تسجيل الدخول في أعلى الصفحة واختيار "إنشاء حساب". قم بملء المعلومات المطلوبة بما في ذلك الرقم الوطني والبريد الإلكتروني ورقم الهاتف.',
                'category' => 'general',
                'order' => 1,
                'is_active' => true,
                'is_published' => true,
            ],
            [
                'question_en' => 'Can I submit a complaint anonymously?',
                'question_ar' => 'هل يمكنني تقديم شكوى دون الكشف عن هويتي؟',
                'answer_en' => 'Yes, the system allows submitting complaints confidentially. Your personal information will be protected and only authorized personnel will have access to your data.',
                'answer_ar' => 'نعم، النظام يتيح تقديم الشكاوى بشكل سري. معلوماتك الشخصية ستكون محمية ولن يطلع عليها إلا الموظفون المخولون.',
                'category' => 'complaints',
                'order' => 2,
                'is_active' => true,
                'is_published' => true,
            ],
            [
                'question_en' => 'How long does it take to process electronic service requests?',
                'question_ar' => 'كم تستغرق معالجة طلبات الخدمات الإلكترونية؟',
                'answer_en' => 'The duration varies depending on the service type. Most instant electronic services are completed within minutes. Other services may take 1-5 business days depending on the required procedures.',
                'answer_ar' => 'تختلف المدة حسب نوع الخدمة. معظم الخدمات الإلكترونية الفورية تتم خلال دقائق. أما الخدمات الأخرى فقد تستغرق من 1-5 أيام عمل حسب الإجراءات المطلوبة.',
                'category' => 'services',
                'order' => 3,
                'is_active' => true,
                'is_published' => true,
            ],
            [
                'question_en' => 'How do I track my complaint status?',
                'question_ar' => 'كيف يمكنني متابعة حالة شكواي؟',
                'answer_en' => 'You can track your complaint using the tracking number provided when submitting. Go to the complaints page and enter your tracking number in the designated field.',
                'answer_ar' => 'يمكنك متابعة شكواك باستخدام رقم التتبع الذي حصلت عليه عند تقديم الشكوى. اذهب إلى صفحة الشكاوى وأدخل رقم التتبع في الحقل المخصص.',
                'category' => 'complaints',
                'order' => 4,
                'is_active' => true,
                'is_published' => true,
            ],
            [
                'question_en' => 'What documents are required to register a commercial establishment?',
                'question_ar' => 'ما هي المستندات المطلوبة لتسجيل منشأة تجارية؟',
                'answer_en' => 'Required documents include: national ID copy, residence proof, commercial name registration certificate, and place rental or ownership contract. Additional documents may be required based on the activity type.',
                'answer_ar' => 'المستندات المطلوبة تشمل: صورة الهوية الوطنية، إثبات الإقامة، شهادة تسجيل الاسم التجاري، وعقد إيجار أو ملكية المحل. قد تُطلب مستندات إضافية حسب نوع النشاط.',
                'category' => 'services',
                'order' => 5,
                'is_active' => true,
                'is_published' => true,
            ],
            [
                'question_en' => 'How do I contact customer support?',
                'question_ar' => 'كيف يمكنني التواصل مع الدعم الفني؟',
                'answer_en' => 'You can contact support through the AI chat available on all pages, or by calling our hotline, or by sending an email to the technical support email.',
                'answer_ar' => 'يمكنك التواصل مع الدعم عبر المحادثة الذكية المتوفرة في جميع الصفحات، أو الاتصال بالخط الساخن، أو إرسال بريد إلكتروني لبريد الدعم الفني.',
                'category' => 'general',
                'order' => 6,
                'is_active' => true,
                'is_published' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
}
