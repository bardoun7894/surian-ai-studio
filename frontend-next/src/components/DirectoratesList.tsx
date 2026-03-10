'use client';

import { usePageLoading } from "@/hooks/usePageLoading";
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
    ChevronLeft,
    ChevronDown,
    Shield,
    TrendingUp,
    ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

interface DirectoratesListProps {
    variant?: 'full' | 'compact';
}

const adminIcons: Record<string, React.ReactNode> = {
    'd1': <Factory size={22} />,
    'd2': <TrendingUp size={22} />,
    'd3': <ShoppingBag size={22} />,
};

const DirectoratesList: React.FC<DirectoratesListProps> = ({
    variant = 'full',
}) => {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedAdmins, setExpandedAdmins] = useState<Record<string, boolean>>({});
    usePageLoading(loading);

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

    const toggleAdmin = (id: string) => {
        setExpandedAdmins(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getLocalized = (field: any, obj?: any) => {
        if (!field) return '';
        if (typeof field === 'object' && ('ar' in field || 'en' in field)) {
            return language === 'ar' ? (field.ar || field.en || '') : (field.en || field.ar || '');
        }
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
    const centralAdmin = featuredDirectorates.find(d => d.id === 'd_central');
    const generalAdmins = featuredDirectorates
        .filter(d => ['d1', 'd2', 'd3'].includes(d.id))
        .sort((a, b) => {
            const order: Record<string, number> = { 'd1': 0, 'd2': 1, 'd3': 2 };
            return (order[a.id] ?? 99) - (order[b.id] ?? 99);
        });

    if (loading) {
        return (
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${variant === 'full' ? 'py-16 min-h-screen' : 'py-12'}`}>
                <SkeletonGrid cards={variant === 'full' ? 4 : 6} className={variant === 'full'
                    ? 'grid-cols-1'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                } />
            </div>
        );
    }

    // COMPACT VARIANT (Homepage)
    if (variant === 'compact') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-center w-full">
                        <h2 className="text-xl md:text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2 flex items-center gap-3 justify-center">
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
                                <h3 className="text-sm font-bold text-gov-charcoal dark:text-white leading-tight group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                                    {getLocalized(dir.name, dir)}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Link href="/directorates" className="inline-flex items-center gap-2 px-8 py-3 bg-gov-teal dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:bg-gov-emerald dark:hover:bg-white transition-all shadow-lg hover:shadow-xl">
                        {t('view_all_dirs')}
                        <ChevronLeft size={20} className={language === 'ar' ? '' : 'rotate-180'} />
                    </Link>
                </div>
            </div>
        );
    }

    // FULL VARIANT — Nested Hierarchy View
    return (
        <div className="min-h-screen bg-gov-beige/30 dark:bg-dm-bg pb-20">
            {/* Ministry Banner */}
            <div className="bg-gov-forest text-white py-10 md:py-16 px-4 relative overflow-hidden">
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

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 md:-mt-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-dm-surface rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 dark:border-gov-border/15 overflow-hidden"
                >
                    {/* Central Admin Header */}
                    <div className="p-5 md:p-8 bg-gradient-to-l from-gov-beige/50 to-transparent dark:from-white/5 border-b border-gray-100 dark:border-gov-border/15 relative">
                        <div className="absolute top-0 bottom-0 right-0 rtl:right-auto rtl:left-0 w-1.5 bg-gov-gold"></div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-14 h-14 md:w-18 md:h-18 rounded-xl md:rounded-2xl bg-gov-forest dark:bg-white/10 flex items-center justify-center text-gov-gold shadow-lg shrink-0">
                                <Shield size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl md:text-3xl font-bold text-gov-charcoal dark:text-white">
                                    {language === 'ar' ? 'الإدارة المركزية' : 'Central Administration'}
                                </h2>
                                <p className="text-sm md:text-base text-gov-stone dark:text-white/60 mt-1">
                                    {language === 'ar'
                                        ? 'المديريات المركزية والإدارات العامة التابعة لوزارة الاقتصاد والصناعة'
                                        : 'Central directorates and general administrations of the Ministry of Economy & Industry'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Central Directorates Grid */}
                    {centralAdmin && centralAdmin.subDirectorates && centralAdmin.subDirectorates.length > 0 && (
                        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gov-border/10">
                            <h3 className="text-sm md:text-base font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                <Building2 size={18} />
                                {language === 'ar' ? 'المديريات المركزية' : 'Central Directorates'}
                                <span className="text-xs font-normal text-gov-stone dark:text-white/50 mr-2 rtl:ml-2">
                                    ({centralAdmin.subDirectorates.length})
                                </span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {centralAdmin.subDirectorates.map(sub => (
                                    <div
                                        key={sub.id}
                                        className="group p-3 bg-gov-beige/30 dark:bg-white/5 hover:bg-gov-beige/60 dark:hover:bg-white/10 rounded-xl border border-gov-sand/20 dark:border-white/8 hover:border-gov-teal/30 dark:hover:border-gov-gold/30 transition-all flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gov-forest/10 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold shrink-0">
                                            <Building2 size={16} />
                                        </div>
                                        <span className="font-semibold text-gov-charcoal dark:text-white text-xs md:text-sm leading-tight">
                                            {getLocalized(sub.name, sub)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General Administrations — Sub-Accordions */}
                    <div className="p-4 md:p-6">
                        <h3 className="text-sm md:text-base font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                            <Landmark size={18} />
                            {language === 'ar' ? 'الإدارات العامة' : 'General Administrations'}
                        </h3>
                        <div className="flex flex-col gap-3 md:gap-4">
                            {generalAdmins.map((admin, index) => {
                                const isExpanded = expandedAdmins[admin.id] ?? false;
                                const icon = adminIcons[admin.id];
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.08 }}
                                        key={admin.id}
                                        className={`rounded-xl md:rounded-2xl border border-gov-sand/20 dark:border-gov-border/15 overflow-hidden transition-shadow ${isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}
                                    >
                                        {/* Admin Accordion Header */}
                                        <button
                                            onClick={() => toggleAdmin(admin.id)}
                                            className="w-full p-4 md:p-5 bg-gov-beige/40 dark:bg-white/5 hover:bg-gov-beige/70 dark:hover:bg-white/8 flex items-center gap-3 md:gap-4 cursor-pointer transition-all text-start"
                                        >
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gov-forest dark:bg-white/10 flex items-center justify-center text-gov-gold shadow-md shrink-0">
                                                {icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-base md:text-lg font-bold text-gov-charcoal dark:text-white truncate">
                                                    {getLocalized(admin.name, admin)}
                                                </h4>
                                                <p className="text-xs text-gov-stone dark:text-white/50 mt-0.5 line-clamp-1 hidden md:block">
                                                    {language === 'en' && admin.description_en ? admin.description_en : (admin.description || '')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {admin.subDirectorates && (
                                                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 bg-gov-teal/10 text-gov-teal dark:bg-gov-gold/10 dark:text-gov-gold text-xs font-bold rounded-full">
                                                        {admin.subDirectorates.length}
                                                    </span>
                                                )}
                                                <div className={`w-8 h-8 rounded-full bg-gov-teal/10 dark:bg-gov-gold/10 flex items-center justify-center text-gov-teal dark:text-gov-gold transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    <ChevronDown size={18} />
                                                </div>
                                            </div>
                                        </button>

                                        {/* Sub-Directorates Content */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-3 md:p-5 bg-white dark:bg-dm-bg/50 border-t border-gov-sand/15 dark:border-gov-border/10">
                                                        {(!admin.subDirectorates || admin.subDirectorates.length === 0) ? (
                                                            <p className="text-gov-stone/60 dark:text-white/50 text-center py-3 text-sm">
                                                                {language === 'ar' ? 'لا توجد مديريات تابعة.' : 'No sub-directorates found.'}
                                                            </p>
                                                        ) : (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
                                                                {admin.subDirectorates.map(sub => (
                                                                    <Link
                                                                        key={sub.id}
                                                                        href={sub.isExternal ? (sub.url || '#') : `/directorates/${admin.id}`}
                                                                        target={sub.isExternal ? '_blank' : undefined}
                                                                        rel={sub.isExternal ? 'noopener noreferrer' : undefined}
                                                                        className="group p-3 bg-gov-beige/20 dark:bg-white/5 hover:bg-gov-beige/50 dark:hover:bg-white/10 rounded-lg md:rounded-xl border border-transparent hover:border-gov-teal/20 dark:hover:border-gov-gold/20 transition-all flex items-center gap-2.5"
                                                                    >
                                                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gov-forest/8 dark:bg-white/10 flex items-center justify-center text-gov-teal dark:text-gov-gold shrink-0">
                                                                            <Building2 size={14} />
                                                                        </div>
                                                                        <span className="font-semibold text-gov-charcoal dark:text-white group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors text-xs md:text-sm flex-1 line-clamp-2">
                                                                            {getLocalized(sub.name, sub)}
                                                                        </span>
                                                                        {sub.isExternal && (
                                                                            <span className="text-[10px] font-bold text-gov-teal bg-gov-teal/10 dark:text-gov-gold dark:bg-gov-gold/10 px-1.5 py-0.5 rounded shrink-0">
                                                                                {language === 'ar' ? 'خارجي' : 'Ext'}
                                                                            </span>
                                                                        )}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="mt-3 pt-3 border-t border-gov-sand/15 dark:border-gov-border/10 text-center">
                                                            <Link
                                                                href={`/directorates/${admin.id}`}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gov-teal/10 hover:bg-gov-teal text-gov-teal hover:text-white dark:bg-gov-gold/10 dark:hover:bg-gov-gold dark:text-gov-gold dark:hover:text-gov-forest rounded-lg font-bold transition-all text-xs"
                                                            >
                                                                {language === 'ar' ? 'صفحة الإدارة' : 'Department Page'}
                                                                <ArrowRight size={14} className={language === 'ar' ? 'rotate-180' : ''} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DirectoratesList;
