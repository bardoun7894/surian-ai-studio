'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Directorate, SubDirectorate, LocalizedString } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Building2,
    Search,
    LayoutGrid,
    ChevronLeft,
    Loader2,
    ExternalLink,
    ArrowRight,
    Hash
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const DirectoratesList: React.FC = () => {
    const { t, language } = useLanguage();
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const dirs = await API.directorates.getFeatured();
                setDirectorates(dirs);
            } catch (error) {
                console.error("Failed to fetch directorates", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getLocalized = (content: LocalizedString | string | undefined | null): string => {
        if (!content) return '';
        if (typeof content === 'string') return content;
        return content[language as 'ar' | 'en'] || '';
    };

    // Helper to get localized field from an API object with _ar/_en suffixes
    const loc = (obj: any, field: string): string => {
        const ar = obj?.[`${field}_ar`] || obj?.[field] || '';
        const en = obj?.[`${field}_en`] || ar;
        return language === 'ar' ? ar : en;
    };


    // Filter directorates based on search query
    const filteredDirectorates = directorates.filter((dir) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const name = loc(dir, 'name').toLowerCase();
        const desc = loc(dir, 'description').toLowerCase();
        const subMatch = dir.subDirectorates?.some((sub) => {
            const subName = loc(sub, 'name');
            return subName.toLowerCase().includes(query);
        });
        return name.includes(query) || desc.includes(query) || subMatch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gov-teal" size={40} />
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gov-forest text-white py-16 px-4">
                <div className="max-w-7xl mx-auto animate-fade-in-up">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-6">
                        <Link href="/" className="hover:text-gov-gold transition-colors">
                            {language === 'ar' ? 'الرئيسية' : 'Home'}
                        </Link>
                        <ChevronLeft size={16} className="rtl:rotate-180" />
                        <span className="text-gov-gold">
                            {language === 'ar' ? 'الإدارات العامة' : 'General Directorates'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                            <LayoutGrid size={32} className="text-gov-gold" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold">
                                {language === 'ar' ? 'الإدارات العامة' : 'General Directorates'}
                            </h1>
                            <p className="text-gray-300 mt-1">
                                {language === 'ar'
                                    ? 'الإدارات الرئيسية التابعة لوزارة الاقتصاد والصناعة'
                                    : 'Main directorates of the Ministry of Economy and Industry'}
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-xl">
                        <div className="relative">
                            <Search size={20} className="absolute top-1/2 -translate-y-1/2 start-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === 'ar' ? 'بحث عن إدارة أو مديرية...' : 'Search for a directorate...'}
                                className="w-full ps-12 pe-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gov-gold transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Directorates List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredDirectorates.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl">
                        <Building2 size={48} className="mx-auto text-gray-300 dark:text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">
                            {language === 'ar' ? 'لا توجد نتائج' : 'No Results'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'ar'
                                ? 'لم يتم العثور على إدارات مطابقة لبحثك'
                                : 'No directorates found matching your search'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredDirectorates.map((dir) => (
                            <div key={dir.id} className="bg-white dark:bg-gov-emeraldStatic rounded-2xl border border-gov-gold/10 dark:border-gov-gold/10 shadow-sm overflow-hidden">
                                {/* Directorate Header */}
                                <Link
                                    href={`/directorates/${dir.id}`}
                                    className="flex items-center gap-4 p-6 bg-gov-beige/30 dark:bg-gov-emeraldStatic border-b border-gov-gold/10 dark:border-gov-gold/10 hover:bg-gov-beige/50 dark:hover:bg-gov-gold/5 transition-colors group"
                                >
                                    <div className="w-20 h-20 rounded-xl bg-gov-teal/10 dark:bg-gov-gold/20 flex items-center justify-center group-hover:bg-gov-teal dark:group-hover:bg-gov-gold transition-all p-2">
                                        <Image
                                            src="/assets/logo/eagle.png"
                                            alt="Ministry Emblem"
                                            width={64}
                                            height={64}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gov-charcoal dark:text-gov-gold group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                                            {loc(dir, 'name')}
                                        </h3>
                                        <p className="text-sm text-gov-stone/60 dark:text-gray-300 mt-1">
                                            {loc(dir, 'description')}
                                        </p>
                                    </div>
                                    {/* Service Count Badge */}
                                    {dir.servicesCount !== undefined && dir.servicesCount > 0 && (
                                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gov-teal/10 dark:bg-gov-gold/10 text-gov-teal dark:text-gov-gold text-sm font-bold">
                                            <Hash size={14} />
                                            <span>{dir.servicesCount}</span>
                                            <span className="text-xs">
                                                {language === 'ar' ? 'خدمة' : 'services'}
                                            </span>
                                        </div>
                                    )}
                                    <ArrowRight size={20} className={`text-gov-teal dark:text-gov-gold opacity-0 group-hover:opacity-100 transition-opacity ${language === 'ar' ? 'rotate-180' : ''}`} />
                                </Link>

                                {/* Sub-Directorates Grid */}
                                {dir.subDirectorates && dir.subDirectorates.length > 0 && (
                                    <div className="p-6">
                                        <h4 className="text-xs font-bold text-gov-sand dark:text-gov-beige/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Building2 size={14} />
                                            {language === 'ar' ? 'المديريات التابعة' : 'Sub-Directorates'}
                                            <span className="text-gov-stone/40 dark:text-gov-beige/30">
                                                ({dir.subDirectorates.length})
                                            </span>
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {dir.subDirectorates.map((sub: SubDirectorate) => {
                                                const isExternal = sub.isExternal || (sub as any).is_external;
                                                const subName = loc(sub, 'name');
                                                const href = isExternal ? sub.url : `/directorates/${dir.id}/sub-directorates`;
                                                return (
                                                    <Link
                                                        key={sub.id}
                                                        href={href}
                                                        target={isExternal ? '_blank' : undefined}
                                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-gov-beige/20 dark:bg-gov-emeraldStatic border border-transparent hover:border-gov-gold/20 dark:hover:border-gov-gold/20 hover:shadow-md transition-all group/sub"
                                                    >
                                                        <Building2 size={16} className="text-gov-sand dark:text-gov-gold/40 group-hover/sub:text-gov-teal dark:group-hover/sub:text-gov-gold transition-colors flex-shrink-0" />
                                                        <span className="text-sm text-gov-charcoal dark:text-gov-gold font-medium flex-1 leading-tight">
                                                            {subName}
                                                        </span>
                                                        {isExternal && (
                                                            <ExternalLink size={12} className="text-gov-sand dark:text-gov-beige/40 flex-shrink-0" />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gov-emeraldStatic rounded-2xl border border-gov-gold/10 dark:border-gov-gold/10 p-6 text-center">
                        <div className="text-3xl font-bold text-gov-teal dark:text-gov-gold mb-1">
                            {directorates.length}
                        </div>
                        <div className="text-sm text-gov-stone/60 dark:text-gray-300">
                            {language === 'ar' ? 'إدارة عامة' : 'General Directorates'}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gov-emeraldStatic rounded-2xl border border-gov-gold/10 dark:border-gov-gold/10 p-6 text-center">
                        <div className="text-3xl font-bold text-gov-teal dark:text-gov-gold mb-1">
                            {directorates.reduce((acc, dir) => acc + (dir.subDirectorates?.length || 0), 0)}
                        </div>
                        <div className="text-sm text-gov-stone/60 dark:text-gray-300">
                            {language === 'ar' ? 'مديرية فرعية' : 'Sub-Directorates'}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gov-emeraldStatic rounded-2xl border border-gov-gold/10 dark:border-gov-gold/10 p-6 text-center">
                        <div className="text-3xl font-bold text-gov-teal dark:text-gov-gold mb-1">
                            {directorates.reduce((acc, dir) => acc + (dir.servicesCount || 0), 0)}
                        </div>
                        <div className="text-sm text-gov-stone/60 dark:text-gray-300">
                            {language === 'ar' ? 'خدمة' : 'E-Services'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectoratesList;
