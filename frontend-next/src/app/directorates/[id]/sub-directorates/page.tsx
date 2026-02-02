'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Building2, ChevronLeft, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate, SubDirectorate } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLocalizedField } from '@/lib/utils';

export default function SubDirectoratesPage() {
    const params = useParams();
    const { language } = useLanguage();
    const [directorate, setDirectorate] = useState<Directorate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDirectorate = async () => {
            if (!params.id) return;
            try {
                const data = await API.directorates.getById(params.id as string);
                setDirectorate(data);
            } catch (err) {
                console.error('Failed to fetch directorate:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDirectorate();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
                <Navbar />
                <main className="flex-grow flex items-center justify-center pt-14 md:pt-16">
                    <Loader2 className="animate-spin text-gov-gold" size={40} />
                </main>
                <Footer />
            </div>
        );
    }

    if (!directorate) {
        return (
            <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
                <Navbar />
                <main className="flex-grow flex items-center justify-center pt-14 md:pt-16">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-4">
                            {language === 'ar' ? 'الإدارة غير موجودة' : 'Directorate Not Found'}
                        </h1>
                        <Link href="/directorates" className="text-gov-gold hover:underline">
                            {language === 'ar' ? 'العودة إلى الإدارات' : 'Back to Directorates'}
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const subDirectorates = directorate.subDirectorates || [];

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
            <Navbar />

            <main className="flex-grow pt-14 md:pt-16">
                {/* Hero Section */}
                <div className="bg-gov-forest text-white py-16 px-4">
                    <div className="max-w-6xl mx-auto animate-fade-in-up">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-gray-300 text-sm mb-6">
                            <Link href="/" className="hover:text-gov-gold transition-colors">
                                {language === 'ar' ? 'الرئيسية' : 'Home'}
                            </Link>
                            <ChevronLeft size={16} className="rtl:rotate-180" />
                            <Link href="/directorates" className="hover:text-gov-gold transition-colors">
                                {language === 'ar' ? 'الإدارات' : 'Directorates'}
                            </Link>
                            <ChevronLeft size={16} className="rtl:rotate-180" />
                            <Link href={`/directorates/${directorate.id}`} className="hover:text-gov-gold transition-colors">
                                {getLocalizedField(directorate, 'name', language)}
                            </Link>
                            <ChevronLeft size={16} className="rtl:rotate-180" />
                            <span className="text-gov-gold">
                                {language === 'ar' ? 'المديريات الفرعية' : 'Sub-Directorates'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Building2 size={32} className="text-gov-gold" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-display font-bold">
                                    {language === 'ar' ? 'المديريات الفرعية' : 'Sub-Directorates'}
                                </h1>
                                <p className="text-gray-300 mt-1">
                                    {getLocalizedField(directorate, 'name', language)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Directorates List */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    {subDirectorates.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl">
                            <Building2 size={48} className="mx-auto text-gray-300 dark:text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">
                                {language === 'ar' ? 'لا توجد مديريات فرعية' : 'No Sub-Directorates'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {language === 'ar'
                                    ? 'لم يتم إضافة مديريات فرعية لهذه الإدارة بعد'
                                    : 'No sub-directorates have been added to this directorate yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subDirectorates.map((sub: SubDirectorate) => (
                                <div
                                    key={sub.id}
                                    className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center">
                                            <Building2 size={24} className="text-gov-gold" />
                                        </div>
                                        {sub.isExternal && (
                                            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                                                {language === 'ar' ? 'رابط خارجي' : 'External'}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-3 group-hover:text-gov-gold transition-colors">
                                        {getLocalizedField(sub, 'name', language)}
                                    </h3>

                                    {sub.isExternal ? (
                                        <a
                                            href={sub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-bold text-gov-teal dark:text-gov-gold hover:underline"
                                        >
                                            {language === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                                            <ExternalLink size={14} />
                                        </a>
                                    ) : (
                                        <Link
                                            href={`/directorates/${params.id}`}
                                            className="inline-flex items-center gap-2 text-sm font-bold text-gov-teal dark:text-gov-gold hover:underline"
                                        >
                                            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                            <ArrowRight size={14} className="rtl:rotate-180" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Back Link */}
                    <div className="mt-12 text-center">
                        <Link
                            href={`/directorates/${directorate.id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                            <ChevronLeft size={20} className="rtl:rotate-180" />
                            {language === 'ar' ? 'العودة إلى الإدارة' : 'Back to Directorate'}
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
