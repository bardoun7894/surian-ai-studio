'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Building2, Megaphone, Shield, Scale } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SitemapPage() {
    const { language } = useLanguage();

    const sections = [
        {
            titleAr: 'الرئيسية والتعريف',
            titleEn: 'Main & About',
            icon: <Home size={20} />,
            links: [
                { href: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
                { href: '/about', labelAr: 'عن الوزارة', labelEn: 'About Ministry' },
                { href: '/contact', labelAr: 'اتصل بنا', labelEn: 'Contact Us' },
                { href: '/faq', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ' },
            ]
        },
        {
            titleAr: 'الخدمات والمعاملات',
            titleEn: 'Services',
            icon: <Building2 size={20} />,
            links: [
                { href: '/services', labelAr: 'دليل الخدمات', labelEn: 'Services Guide' },
                { href: '/complaints', labelAr: 'منظومة الشكاوى', labelEn: 'Complaints System' },
                { href: '/complaints?tab=track', labelAr: 'متابعة الشكاوى', labelEn: 'Track Complaint' },
            ]
        },
        {
            titleAr: 'المركز الإعلامي',
            titleEn: 'Media Center',
            icon: <Megaphone size={20} />,
            links: [
                { href: '/news', labelAr: 'الأخبار', labelEn: 'News' },
                { href: '/media', labelAr: 'الصور والفيديو', labelEn: 'Media Gallery' },
                { href: '/announcements', labelAr: 'الإعلانات والمناقصات', labelEn: 'Announcements' },
            ]
        },
        {
            titleAr: 'التشريعات والبيانات',
            titleEn: 'Legislation & Data',
            icon: <Scale size={20} />,
            links: [
                { href: '/decrees', labelAr: 'الجريدة الرسمية', labelEn: 'Official Gazette' },
                { href: '/open-data', labelAr: 'البيانات المفتوحة', labelEn: 'Open Data' },
                { href: '/privacy-policy', labelAr: 'سياسة الخصوصية', labelEn: 'Privacy Policy' },
            ]
        },
        {
            titleAr: 'حساب المستخدم',
            titleEn: 'User Account',
            icon: <Shield size={20} />,
            links: [
                { href: '/login', labelAr: 'تسجيل الدخول', labelEn: 'Login' },
                { href: '/register', labelAr: 'إنشاء حساب', labelEn: 'Register' },
                { href: '/forgot-password', labelAr: 'نسيت كلمة المرور', labelEn: 'Forgot Password' },
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
            <Navbar />

            <main className="flex-grow pt-16 md:pt-[5.75rem]">
                <div className="bg-gov-forest text-white py-12 px-4 shadow-lg animate-fade-in-up">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            {language === 'ar' ? 'خريطة الموقع' : 'Site Map'}
                        </h1>
                        <p className="text-white/70">
                            {language === 'ar'
                                ? 'فهرس شامل لجميع صفحات وأقسام البوابة الإلكترونية'
                                : 'A comprehensive index of all portal pages and sections'}
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sections.map((section, idx) => (
                            <div key={idx} className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 border border-gray-100 dark:border-gov-border/15 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gov-border/15 pb-4">
                                    <div className="w-10 h-10 rounded-lg bg-gov-teal/10 flex items-center justify-center text-gov-teal">
                                        {section.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gov-forest dark:text-white">
                                        {language === 'ar' ? section.titleAr : section.titleEn}
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-gov-teal dark:hover:text-gov-gold font-medium transition-colors"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/30"></div>
                                                {language === 'ar' ? link.labelAr : link.labelEn}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
