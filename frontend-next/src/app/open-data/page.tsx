'use client';

import React from 'react';
import { Database, Download, FileSpreadsheet, FileJson, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DATASETS = [
    {
        id: 1,
        titleAr: 'الموازنة العامة للدولة 2024',
        titleEn: 'State General Budget 2024',
        descAr: 'بيانات تفصيلية حول الموازنة العامة، الإيرادات والنفقات الحكومية للعام المالي 2024.',
        descEn: 'Detailed data on the general budget, government revenues and expenditures for the fiscal year 2024.',
        date: '2024-01-15',
        format: 'XLSX',
        size: '2.4 MB'
    },
    {
        id: 2,
        titleAr: 'إحصائيات التجارة الخارجية',
        titleEn: 'Foreign Trade Statistics',
        descAr: 'بيانات الصادرات والواردات حسب القطاع والبلد للفترة 2020-2023.',
        descEn: 'Export and import data by sector and country for the period 2020-2023.',
        date: '2023-12-10',
        format: 'CSV',
        size: '15 MB'
    },
    {
        id: 3,
        titleAr: 'دليل الجهات الحكومية',
        titleEn: 'Government Agencies Directory',
        descAr: 'قائمة شاملة بجميع الوزارات والهيئات الحكومية مع بيانات الاتصال والمواقع الجغرافية.',
        descEn: 'A comprehensive list of all ministries and government agencies with contact details andlocations.',
        date: '2025-01-01',
        format: 'JSON',
        size: '450 KB'
    },
    {
        id: 4,
        titleAr: 'مؤشرات التنمية الصناعية',
        titleEn: 'Industrial Development Indicators',
        descAr: 'المؤشرات الرئيسية للقطاع الصناعي، عدد المنشآت، وفرص العمل.',
        descEn: 'Key indicators of the industrial sector, number of establishments, and job opportunities.',
        date: '2023-11-20',
        format: 'PDF',
        size: '5.1 MB'
    }
];

export default function OpenDataPage() {
    const { language } = useLanguage();

    const getIcon = (format: string) => {
        switch (format) {
            case 'XLSX': case 'CSV': return <FileSpreadsheet size={20} />;
            case 'JSON': return <FileJson size={20} />;
            default: return <Database size={20} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
            <Navbar />

            <main className="flex-grow pt-20">
                <div className="bg-gov-forest text-white py-16 px-4 animate-fade-in-up">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Database size={32} className="text-gov-gold" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
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

                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Filter size={20} />
                            <span className="font-bold">{language === 'ar' ? 'تصنيف البيانات:' : 'Filter Data:'}</span>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            {['الكل', 'المالية', 'الاقتصاد', 'الصحة', 'التعليم'].map(filter => (
                                <button key={filter} className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/10 hover:bg-gov-teal hover:text-white transition-colors text-sm font-medium border border-gray-200 dark:border-white/10">
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {DATASETS.map((dataset) => (
                            <div key={dataset.id} className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center text-gov-teal">
                                            {getIcon(dataset.format)}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{dataset.format}</span>
                                            <h3 className="text-lg font-bold text-gov-forest dark:text-white group-hover:text-gov-teal transition-colors">
                                                {language === 'ar' ? dataset.titleAr : dataset.titleEn}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                                        {dataset.size}
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2">
                                    {language === 'ar' ? dataset.descAr : dataset.descEn}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
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

                </div>
            </main>

            <Footer />
        </div>
    );
}
