'use client';
import { usePageLoading } from '@/hooks/usePageLoading';

import React, { useState, useEffect } from 'react';
import { Database, Download, FileSpreadsheet, FileJson, FileText, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Dataset {
    id: string;
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
    date: string;
    format: string;
    size: string;
    category_label: string;
    download_url: string | null;
}

export default function OpenDataPage() {
    const { language } = useLanguage();
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(true);
    usePageLoading(loading);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await API.openData.getAll();
                setDatasets(data);
            } catch {
                setDatasets([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getIcon = (format: string) => {
        switch (format) {
            case 'XLSX': case 'CSV': return <FileSpreadsheet size={20} />;
            case 'JSON': return <FileJson size={20} />;
            case 'PDF': return <FileText size={20} />;
            default: return <Database size={20} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
            <Navbar />

            <main className="flex-grow pt-20 md:pt-24">
                <div className="bg-gov-forest text-white py-16 px-4 animate-fade-in-up">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Database size={32} className="text-gov-gold" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            {language === 'ar' ? 'البيانات المفتوحة' : 'Open Data'}
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'تعزيزاً للشفافية، نوفر لكم الوصول إلى البيانات الحكومية العامة بصيغ قابلة للمعالجة وإعادة الاستخدام'
                                : 'To enhance transparency, we provide access to public government data in machine-readable and reusable formats'}
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="animate-spin text-gov-teal" size={40} />
                        </div>
                    ) : datasets.length === 0 ? (
                        <div className="text-center py-16">
                            <Database size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-500">
                                {language === 'ar' ? 'لا توجد بيانات متاحة حالياً' : 'No datasets available'}
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {datasets.map((dataset) => (
                                <div key={dataset.id} className="bg-white dark:bg-dm-surface rounded-2xl p-6 border border-gray-100 dark:border-gov-border/15 hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center text-gov-teal">
                                                {getIcon(dataset.format)}
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{dataset.format}</span>
                                                <h3 className="text-lg font-bold text-gov-forest dark:text-white group-hover:text-gov-teal transition-colors">
                                                    {language === 'ar' ? dataset.title_ar : dataset.title_en}
                                                </h3>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-white/70">
                                            {dataset.size}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 dark:text-white/70 text-sm mb-6 line-clamp-2">
                                        {language === 'ar' ? dataset.description_ar : dataset.description_en}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gov-border/15">
                                        <span className="text-xs text-gray-500">
                                            {language === 'ar' ? `تاريخ التحديث: ${dataset.date}` : `Updated: ${dataset.date}`}
                                        </span>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-forest text-white text-sm font-bold hover:bg-gov-teal transition-colors">
                                            <Download size={16} />
                                            {language === 'ar' ? 'تحميل' : 'Download'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
