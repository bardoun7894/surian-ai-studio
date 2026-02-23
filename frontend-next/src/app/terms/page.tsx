'use client';

import React from 'react';
import { FileCheck, AlertTriangle, Scale, UserCheck, Shield, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfUsePage() {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24">
                {/* Hero Section */}
                <div className="bg-gov-forest text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FileCheck size={32} className="text-gov-gold" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'يرجى قراءة شروط الاستخدام بعناية قبل استخدام هذه البوابة الإلكترونية'
                                : 'Please read these terms of use carefully before using this portal'}
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in-up delay-100">

                    {/* Last Update */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-gov-gold/10 rounded-full text-gov-gold text-sm font-bold">
                            {language === 'ar' ? 'آخر تحديث: 28 كانون الثاني 2026' : 'Last Updated: January 28, 2026'}
                        </span>
                    </div>

                    <div className="space-y-8">
                        {/* Section 1 - Acceptance */}
                        <section className="bg-white dark:bg-dm-surface p-8 rounded-3xl border border-gray-100 dark:border-gov-border/15 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gov-teal/10 flex items-center justify-center text-gov-teal shrink-0">
                                    <UserCheck size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'قبول الشروط' : 'Acceptance of Terms'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-white/70 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'باستخدامك لهذه البوابة الإلكترونية، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام البوابة.'
                                        : 'By using this portal, you agree to be bound by these terms and conditions. If you do not agree to any of these terms, please do not use the portal.'}
                                </p>
                                <p>
                                    {language === 'ar'
                                        ? 'تحتفظ وزارة الاقتصاد والصناعة بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق.'
                                        : 'The Ministry of Economy & Industry reserves the right to modify these terms at any time without prior notice.'}
                                </p>
                            </div>
                        </section>

                        {/* Section 2 - Permitted Use */}
                        <section className="bg-white dark:bg-gov-card/10 p-8 rounded-3xl border border-gray-100 dark:border-gov-border/15 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gov-gold/10 flex items-center justify-center text-gov-gold shrink-0">
                                    <Scale size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'الاستخدام المسموح' : 'Permitted Use'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-white/70 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'يُسمح لك باستخدام هذه البوابة للأغراض التالية فقط:'
                                        : 'You are permitted to use this portal only for the following purposes:'}
                                </p>
                                <ul className="list-disc list-inside space-y-2 marker:text-gov-gold">
                                    <li>{language === 'ar' ? 'الوصول إلى الخدمات الحكومية المتاحة.' : 'Accessing available government services.'}</li>
                                    <li>{language === 'ar' ? 'تقديم الشكاوى والاقتراحات بشكل قانوني.' : 'Submitting complaints and suggestions legally.'}</li>
                                    <li>{language === 'ar' ? 'الاطلاع على الأخبار والإعلانات الرسمية.' : 'Viewing official news and announcements.'}</li>
                                    <li>{language === 'ar' ? 'الاستعلام عن القوانين والمراسيم.' : 'Inquiring about laws and decrees.'}</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 - Prohibited Actions */}
                        <section className="bg-white dark:bg-gov-card/10 p-8 rounded-3xl border border-gray-100 dark:border-gov-border/15 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gov-red/10 flex items-center justify-center text-gov-red shrink-0">
                                    <AlertTriangle size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'الأفعال المحظورة' : 'Prohibited Actions'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-white/70 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'يُحظر عليك القيام بأي من الأفعال التالية:'
                                        : 'You are prohibited from performing any of the following actions:'}
                                </p>
                                <ul className="list-disc list-inside space-y-2 marker:text-gov-red">
                                    <li>{language === 'ar' ? 'تقديم معلومات كاذبة أو مضللة.' : 'Providing false or misleading information.'}</li>
                                    <li>{language === 'ar' ? 'انتحال شخصية الآخرين.' : 'Impersonating others.'}</li>
                                    <li>{language === 'ar' ? 'محاولة اختراق أو تعطيل النظام.' : 'Attempting to hack or disrupt the system.'}</li>
                                    <li>{language === 'ar' ? 'استخدام البوابة لأغراض غير قانونية.' : 'Using the portal for illegal purposes.'}</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 - Intellectual Property */}
                        <section className="bg-white dark:bg-gov-card/10 p-8 rounded-3xl border border-gray-100 dark:border-gov-border/15 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <Shield size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'الملكية الفكرية' : 'Intellectual Property'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-white/70 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'جميع المحتويات المنشورة على هذه البوابة، بما في ذلك النصوص والصور والشعارات والتصاميم، هي ملك لوزارة الاقتصاد والصناعة أو مرخصة لها.'
                                        : 'All content published on this portal, including text, images, logos, and designs, is owned by or licensed to the Ministry of Economy & Industry.'}
                                </p>
                            </div>
                        </section>

                        {/* Section 5 - Service Availability */}
                        <section className="bg-white dark:bg-gov-card/10 p-8 rounded-3xl border border-gray-100 dark:border-gov-border/15 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                    <Clock size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'توفر الخدمة' : 'Service Availability'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-white/70 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'نسعى لضمان توفر البوابة على مدار الساعة، إلا أننا لا نضمن عدم انقطاع الخدمة بسبب أعمال الصيانة أو الظروف الطارئة.'
                                        : 'We strive to ensure the portal is available 24/7, but we do not guarantee uninterrupted service due to maintenance or emergencies.'}
                                </p>
                                <p>
                                    {language === 'ar'
                                        ? 'لا تتحمل الوزارة أي مسؤولية عن الأضرار الناتجة عن عدم توفر الخدمة.'
                                        : 'The Ministry is not liable for any damages resulting from service unavailability.'}
                                </p>
                            </div>
                        </section>

                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
