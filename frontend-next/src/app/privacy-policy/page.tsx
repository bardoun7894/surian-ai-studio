'use client';

import React from 'react';
import { Shield, Lock, Eye, FileText, Server } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <div className="bg-gov-forest text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Shield size={32} className="text-gov-gold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'نلتزم بحماية خصوصية بياناتكم ومعلوماتكم الشخصية وفقاً للقوانين والأنظمة النافذة'
                                : 'We are committed to protecting the privacy of your data and personal information in accordance with applicable laws and regulations'}
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in-up delay-100">

                    {/* Last Update */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-gov-gold/10 rounded-full text-gov-gold text-sm font-bold">
                            {language === 'ar' ? 'آخر تحديث: 15 كانون الثاني 2024' : 'Last Updated: January 15, 2024'}
                        </span>
                    </div>

                    <div className="space-y-8">
                        {/* Section 1 */}
                        <section className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gov-teal/10 flex items-center justify-center text-gov-teal shrink-0">
                                    <Eye size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'جمع المعلومات' : 'Information Collection'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'نقوم بجمع المعلومات التي تقدمونها طواعية عند استخدام البوابة، مثل الاسم، الرقم الوطني، معلومات الاتصال، وأي بيانات أخرى ضرورية لإتمام المعاملات الحكومية.'
                                        : 'We collect information that you voluntarily provide when using the portal, such as name, national ID, contact information, and any other data necessary to complete government transactions.'}
                                </p>
                                <p>
                                    {language === 'ar'
                                        ? 'كما نقوم بجمع بيانات تقنية تلقائياً مثل عنوان IP، نوع المتصفح، ووقت الزيارة لتحسين تجربة المستخدم وأمان الموقع.'
                                        : 'We also automatically collect technical data such as IP address, browser type, and visit time to improve user experience and site security.'}
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gov-gold/10 flex items-center justify-center text-gov-gold shrink-0">
                                    <Lock size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'أمن المعلومات' : 'Information Security'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'نطبق إجراءات أمنية صارمة (فيزيائية وتشفرية وإدارية) لحماية معلوماتكم من الوصول غير المصرح به أو التعديل أو الإفشاء أو الإتلاف.'
                                        : 'We implement strict security measures (physical, cryptographic, and administrative) to protect your information from unauthorized access, modification, disclosure, or destruction.'}
                                </p>
                                <ul className="list-disc list-inside space-y-2 marker:text-gov-gold">
                                    <li>{language === 'ar' ? 'تشفير البيانات الحساسة باستخدام بروتوكولات SSL/TLS.' : 'Encryption of sensitive data using SSL/TLS protocols.'}</li>
                                    <li>{language === 'ar' ? 'استخدام جدران حماية وأنظمة كشف التسلل متطورة.' : 'Use of advanced firewalls and intrusion detection systems.'}</li>
                                    <li>{language === 'ar' ? 'تحديثات أمنية دورية للأنظمة والبرمجيات.' : 'Regular security updates for systems and software.'}</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gov-red/10 flex items-center justify-center text-gov-red shrink-0">
                                    <FileText size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'استخدام المعلومات' : 'Use of Information'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'نستخدم المعلومات التي نجمعها حصراً للأغراض التالية:'
                                        : 'We use the collected information exclusively for the following purposes:'}
                                </p>
                                <ul className="list-disc list-inside space-y-2 marker:text-gov-teal">
                                    <li>{language === 'ar' ? 'تقديم الخدمات الحكومية المطلوبة ومعالجة المعاملات.' : 'Providing requested government services and processing transactions.'}</li>
                                    <li>{language === 'ar' ? 'التواصل معكم بخصوص حالة طلباتكم أو الإعلانات الهامة.' : 'Communicating with you regarding your request status or important announcements.'}</li>
                                    <li>{language === 'ar' ? 'تحسين أداء البوابة وتطوير الخدمات الرقمية.' : 'Improving portal performance and developing digital services.'}</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <Server size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gov-forest dark:text-white mt-1">
                                    {language === 'ar' ? 'مشاركة البيانات' : 'Data Sharing'}
                                </h2>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 pr-14 rtl:pr-14 rtl:pl-0 ltr:pl-14">
                                <p>
                                    {language === 'ar'
                                        ? 'لا نقوم ببيع أو تأجير أو مشاركة معلوماتكم الشخصية مع أي أطراف ثالثة لأغراض تجارية. قد نشارك البيانات فقط مع جهات حكومية أخرى إذا كان ذلك ضرورياً لإنجاز معاملتكم، أو بموجب أمر قضائي.'
                                        : 'We do not sell, rent, or share your personal information with any third parties for commercial purposes. We may share data only with other government entities if necessary to complete your transaction, or under a court order.'}
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
