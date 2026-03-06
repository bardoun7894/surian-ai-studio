'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Building2,
    ArrowRight,
    ShieldAlert,
    Scale,
    HeartPulse,
    BookOpen,
    GraduationCap,
    Zap,
    Droplets,
    Plane,
    Wifi,
    Banknote,
    Map,
    Factory,
    Landmark,
    LayoutGrid,
    ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import { motion } from 'framer-motion';

interface DirectoratesListProps {
    variant?: 'full' | 'compact';
}

const DirectoratesList: React.FC<DirectoratesListProps> = ({
    variant = 'full',
}) => {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const dirs = await API.directorates.getAll();
                setDirectorates(dirs);
            } catch (error) {
                console.error("Failed to fetch directorates", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper functions
    const getLocalized = (field: any, obj?: any) => {
        if (!field) return '';
        if (typeof field === 'object' && ('ar' in field || 'en' in field)) {
            return language === 'ar' ? (field.ar || field.en || '') : (field.en || field.ar || '');
        }
        // If obj is provided, check for _ar/_en suffixed fields
        if (obj && typeof field === 'string') {
            const arVal = obj.name_ar || field;
            const enVal = obj.name_en || '';
            return language === 'en' && enVal ? enVal : arVal;
        }
        return typeof field === 'string' ? field : '';
    };

    const getIcon = (iconName: string, isCompact: boolean) => {
        const props = { size: isCompact ? 24 : 32 };
        switch (iconName) {
            case 'ShieldAlert': return <ShieldAlert {...props} />;
            case 'Scale': return <Scale {...props} />;
            case 'HeartPulse': return <HeartPulse {...props} />;
            case 'BookOpen': return <BookOpen {...props} />;
            case 'GraduationCap': return <GraduationCap {...props} />;
            case 'Zap': return <Zap {...props} />;
            case 'Droplets': return <Droplets {...props} />;
            case 'Plane': return <Plane {...props} />;
            case 'Wifi': return <Wifi {...props} />;
            case 'Banknote': return <Banknote {...props} />;
            case 'Map': return <Map {...props} />;
            case 'Factory': return <Factory {...props} />;
            default: return <Landmark {...props} />;
        }
    };

    const featuredDirectorates = directorates.filter(dir => dir.featured === true);

    if (loading) {
        return (
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${variant === 'full' ? 'py-16 min-h-screen' : 'py-12'}`}>
                <SkeletonGrid cards={variant === 'full' ? 3 : 6} className={variant === 'full'
                    ? 'grid-cols-1'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                } />
            </div>
        );
    }

    // COMPACT VARIANT (Used on Homepage)
    if (variant === 'compact') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-center w-full">
                        <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2 flex items-center gap-3 justify-center">
                            <LayoutGrid className="text-gov-teal dark:text-gov-gold" />
                            {t('dir_title_compact')}
                        </h2>
                        <p className="text-gov-stone/60 dark:text-white/70">
                            {t('dir_subtitle_compact')}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:gap-6 items-stretch grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {featuredDirectorates.slice(0, 6).map((dir) => (
                        <Link key={dir.id} href={`/directorates/${dir.id}`}
                            className="group flex flex-col h-full bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 shadow-sm hover:shadow-xl hover:border-gov-teal/30 dark:hover:border-gov-gold/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm cursor-pointer p-4 items-center text-center"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex flex-col items-center mb-2 gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gov-beige dark:bg-white/10 flex items-center justify-center text-gov-teal dark:text-gov-gold group-hover:bg-gov-teal group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-all duration-300 shadow-inner">
                                    {getIcon(dir.icon, true)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gov-charcoal dark:text-white leading-tight group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                                        {getLocalized(dir.name, dir)}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Link
                        href="/directorates"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gov-teal dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:bg-gov-emerald dark:hover:bg-white transition-all shadow-lg hover:shadow-xl"
                    >
                        {t('view_all_dirs')}
                        <ChevronLeft size={20} className={language === 'ar' ? '' : 'rotate-180'} />
                    </Link>
                </div>
            </div>
        );
    }

    // FULL VARIANT (Hierarchical Redesign)
    return (
        <div className="min-h-screen bg-gov-beige/30 dark:bg-dm-bg pb-20">
            {/* Ministry Root Banner */}
            <div className="bg-gov-forest text-white py-10 md:py-16 px-4 relative overflow-hidden">
                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-[url('/islamic-pattern.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
                <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 backdrop-blur-sm shadow-xl border border-white/20">
                        <Landmark size={48} className="text-gov-gold hidden md:block" />
                        <Landmark size={32} className="text-gov-gold md:hidden" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-display font-bold mb-3 md:mb-4 drop-shadow-md">
                        {language === 'ar' ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy & Industry'}
                    </h1>
                    <p className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        {language === 'ar'
                            ? 'الهيكل التنظيمي للوزارة وإداراتها العامة والمديريات الفرعية التابعة لها.'
                            : 'The organizational structure of the ministry, its general administrations, and sub-directorates.'}
                    </p>
                </div>
            </div>

            {/* Administrations & Sub-Directorates Hierarchical View */}
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 md:-mt-8 relative z-20">
                <div className="flex flex-col gap-5 md:gap-8">
                    {directorates.slice(0, 3).map((admin, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={admin.id}
                            className="bg-white dark:bg-dm-surface rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 overflow-hidden"
                        >
                            {/* Administration Header */}
                            <div className="p-4 md:p-8 bg-gradient-to-r from-gov-beige/50 to-transparent dark:from-white/5 border-b border-gray-100 dark:border-gov-border/15 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 relative">
                                <div className="absolute top-0 bottom-0 right-0 w-2 bg-gov-gold"></div>
                                <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gov-forest dark:bg-white/10 flex items-center justify-center text-gov-gold shadow-lg shrink-0">
                                    {getIcon(admin.icon, false)}
                                </div>
                                <div className="text-center md:text-start flex-1">
                                    <h2 className="text-lg md:text-3xl font-bold text-gov-charcoal dark:text-white mb-2 md:mb-3">
                                        {getLocalized(admin.name, admin)}
                                    </h2>
                                    <p className="text-sm md:text-base text-gov-stone dark:text-white/70 leading-relaxed max-w-3xl">
                                        {language === 'en' && admin.description_en ? admin.description_en : (admin.description || getLocalized(admin.description))}
                                    </p>
                                </div>
                                <Link href={`/directorates/${admin.id}`} className="shrink-0 mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gov-teal/10 hover:bg-gov-teal text-gov-teal hover:text-white dark:bg-gov-gold/10 dark:hover:bg-gov-gold dark:text-gov-gold dark:hover:text-gov-forest rounded-xl font-bold transition-all">
                                    {language === 'ar' ? 'صفحة الإدارة' : 'Department Page'}
                                    <ArrowRight size={18} className={language === 'ar' ? 'rotate-180' : ''} />
                                </Link>
                            </div>

                            {/* Sub-Directorates Grid */}
                            <div className="p-4 md:p-8">
                                <h3 className="text-base md:text-lg font-bold text-gov-forest dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                                    <Building2 className="text-gov-gold" size={20} />
                                    {language === 'ar' ? 'المديريات التابعة' : 'Affiliated Directorates'}
                                </h3>

                                {(!admin.subDirectorates || admin.subDirectorates.length === 0) ? (
                                    <p className="text-gov-stone/60 dark:text-white/50">{language === 'ar' ? 'لا توجد مديريات تابعة.' : 'No sub-directorates found.'}</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {admin.subDirectorates.map(sub => (
                                            <Link
                                                key={sub.id}
                                                href={sub.isExternal ? (sub.url || '#') : `/directorates/${admin.id}/${sub.id}`}
                                                target={sub.isExternal ? '_blank' : undefined}
                                                rel={sub.isExternal ? 'noopener noreferrer' : undefined}
                                                className="group p-3 md:p-5 bg-gray-50 dark:bg-white/5 hover:bg-gov-gold/5 dark:hover:bg-gov-gold/10 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-all flex items-start gap-3 md:gap-4"
                                            >
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white dark:bg-black/20 flex items-center justify-center text-gov-teal dark:text-gov-gold shadow-sm shrink-0">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gov-charcoal dark:text-white group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors text-sm md:text-base line-clamp-2">
                                                        {getLocalized(sub.name, sub)}
                                                    </h4>
                                                    {sub.isExternal && (
                                                        <span className="inline-block mt-2 text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                                            {language === 'ar' ? 'رابط خارجي' : 'External'}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default DirectoratesList;
