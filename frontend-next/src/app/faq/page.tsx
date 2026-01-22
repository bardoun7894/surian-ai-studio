'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, FileQuestion, Monitor, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQS = [
    {
        category: 'general',
        questionEn: 'How can I register on the portal?',
        questionAr: 'كيف يمكنني التسجيل في البوابة الإلكترونية؟',
        answerEn: 'You can register by clicking the "Register" button in the top navigation bar. You will need your National ID number and a valid mobile number.',
        answerAr: 'يمكنك التسجيل من خلال النقر على زر "إنشاء حساب" في شريط التنقل العلوي. ستحتاج إلى الرقم الوطني ورقم هاتف محمول صالح.'
    },
    {
        category: 'services',
        questionEn: 'Are all services available online?',
        questionAr: 'هل جميع الخدمات متاحة إلكترونياً؟',
        answerEn: 'Not all services are fully digitized yet. Services marked with the "Digital" tag can be completed online. Others may require a visit to the center after booking an appointment.',
        answerAr: 'ليس جميع الخدمات مرقمنة بالكامل بعد. الخدمات التي تحمل علامة "إلكترونية" يمكن إتمامها عن بعد. الخدمات الأخرى قد تتطلب زيارة المركز بعد حجز موعد.'
    },
    {
        category: 'account',
        questionEn: 'How can I reset my password?',
        questionAr: 'كيف يمكنني استعادة كلمة المرور؟',
        answerEn: 'Go to the login page and click "Forgot Password". Enter your email address to receive a password reset link.',
        answerAr: 'اذهب إلى صفحة تسجيل الدخول وانقر على "نسيت كلمة المرور". أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور.'
    },
    {
        category: 'complaints',
        questionEn: 'How can I track my complaint?',
        questionAr: 'كيف يمكنني تتبع الشكوى المقدمة؟',
        answerEn: 'Visit the Complaints page and select the "Track Complaint" tab. Enter your ticket number to see the latest status.',
        answerAr: 'قم بزيارة صفحة منظومة الشكاوى واختر تبويب "تتبع شكوى". أدخل رقم التذكرة للاطلاع على آخر المستجدات.'
    },
    {
        category: 'general',
        questionEn: 'Is the portal accessible outside Syria?',
        questionAr: 'هل البوابة متاحة من خارج سوريا؟',
        answerEn: 'Yes, most public information services are accessible globally. Some transaction services may require a local IP or VPN depending on security policies.',
        answerAr: 'نعم، معظم خدمات المعلومات العامة متاحة عالمياً. بعض الخدمات الإجرائية قد تتطلب عنوان IP محلي أو شبكة افتراضية حسب السياسات الأمنية.'
    },
    {
        category: 'services',
        questionEn: 'What payment methods are accepted?',
        questionAr: 'ما هي طرق الدفع المقبولة؟',
        answerEn: 'We accept payments via Syrian Electronic Payment System (SEP), commercial bank apps, and Syriatel/MTN Cash.',
        answerAr: 'نقبل الدفع عبر منظومة الدفع الإلكتروني السورية (SEP)، تطبيقات البنوك التجارية، وخدمات سيريتل كاش/إم تي إن كاش.'
    },
];

export default function FAQPage() {
    const { language } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = FAQS.filter(faq => {
        const matchesSearch = (language === 'ar' ? faq.questionAr : faq.questionEn).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { id: 'all', labelEn: 'All Questions', labelAr: 'جميع الأسئلة', icon: <HelpCircle size={18} /> },
        { id: 'general', labelEn: 'General', labelAr: 'عام', icon: <FileQuestion size={18} /> },
        { id: 'services', labelEn: 'Services', labelAr: 'الخدمات', icon: <Monitor size={18} /> },
        { id: 'account', labelEn: 'Account', labelAr: 'الحساب', icon: <UserCheck size={18} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-20">
                <div className="bg-gov-forest text-white py-16 px-4 animate-fade-in-up">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                        </h1>
                        <p className="text-gray-300 text-lg">
                            {language === 'ar'
                                ? 'اعثر على إجابات سريعة لأهم استفساراتك حول استخدام البوابة والخدمات'
                                : 'Find quick answers to your questions about using the portal and services'}
                        </p>

                        <div className="mt-8 relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === 'ar' ? 'ابحث عن سؤال...' : 'Search for a question...'}
                                className="w-full py-4 px-6 pr-14 rtl:pr-6 rtl:pl-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-gov-gold transition-colors"
                            />
                            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-12">

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-bold transition-all ${activeCategory === cat.id
                                    ? 'bg-gov-teal text-white border-gov-teal shadow-lg'
                                    : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gov-teal'
                                    }`}
                            >
                                {cat.icon}
                                {language === 'ar' ? cat.labelAr : cat.labelEn}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-4">
                        {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`bg-white dark:bg-white/5 rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                    ? 'border-gov-gold/50 shadow-md'
                                    : 'border-gray-100 dark:border-white/10 hover:border-gov-gold/30'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-6 text-right rtl:text-right ltr:text-left focus:outline-none"
                                >
                                    <span className="font-bold text-lg text-gov-forest dark:text-white">
                                        {language === 'ar' ? faq.questionAr : faq.questionEn}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-gov-gold/20 text-gov-gold' : 'text-gray-400'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>
                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/10 pt-4">
                                        {language === 'ar' ? faq.answerAr : faq.answerEn}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-500">
                                    {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
                                </h3>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
