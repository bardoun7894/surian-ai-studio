'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Directorate, Service, SubDirectorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Building2,
    ArrowRight,
    Search,
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
    Phone,
    Mail,
    MapPin,
    ExternalLink,
    X
} from 'lucide-react';
import Link from 'next/link';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import { AnimatePresence, motion } from 'framer-motion';

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

    // Modal state for Sub-Directorates
    const [selectedSub, setSelectedSub] = useState<SubDirectorate | null>(null);

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
    const getLocalized = (field: any) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return language === 'ar' ? field.ar : field.en;
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
                                        {getLocalized(dir.name)}
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
            <div className="bg-gov-forest text-white py-16 px-4 relative overflow-hidden">
                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-[url('/islamic-pattern.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
                <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-xl border border-white/20">
                        <Landmark size={48} className="text-gov-gold" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 drop-shadow-md">
                        {language === 'ar' ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy & Industry'}
                    </h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        {language === 'ar'
                            ? 'الهيكل التنظيمي للوزارة وإداراتها العامة والمديريات الفرعية التابعة لها.'
                            : 'The organizational structure of the ministry, its general administrations, and sub-directorates.'}
                    </p>
                </div>
            </div>

            {/* Administrations & Sub-Directorates Hierarchical View */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="flex flex-col gap-8">
                    {directorates.map((admin, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={admin.id}
                            className="bg-white dark:bg-gov-card rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border overflow-hidden"
                        >
                            {/* Administration Header */}
                            <div className="p-8 bg-gradient-to-r from-gov-beige/50 to-transparent dark:from-white/5 border-b border-gray-100 dark:border-gov-border flex flex-col md:flex-row items-center md:items-start gap-6 relative">
                                <div className="absolute top-0 bottom-0 right-0 w-2 bg-gov-gold"></div>
                                <div className="w-20 h-20 rounded-2xl bg-gov-forest dark:bg-white/10 flex items-center justify-center text-gov-gold shadow-lg shrink-0">
                                    {getIcon(admin.icon, false)}
                                </div>
                                <div className="text-center md:text-start flex-1">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gov-charcoal dark:text-white mb-3">
                                        {getLocalized(admin.name)}
                                    </h2>
                                    <p className="text-gov-stone dark:text-white/70 leading-relaxed max-w-3xl">
                                        {getLocalized(admin.description)}
                                    </p>
                                </div>
                                <Link href={`/directorates/${admin.id}`} className="shrink-0 mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gov-teal/10 hover:bg-gov-teal text-gov-teal hover:text-white dark:bg-gov-gold/10 dark:hover:bg-gov-gold dark:text-gov-gold dark:hover:text-gov-forest rounded-xl font-bold transition-all">
                                    {language === 'ar' ? 'صفحة الإدارة' : 'Admin Page'}
                                    <ArrowRight size={18} className={language === 'ar' ? '' : 'rotate-180'} />
                                </Link>
                            </div>

                            {/* Sub-Directorates Grid */}
                            <div className="p-8">
                                <h3 className="text-lg font-bold text-gov-forest dark:text-white mb-6 flex items-center gap-2">
                                    <Building2 className="text-gov-gold" size={20} />
                                    {language === 'ar' ? 'المديريات التابعة' : 'Affiliated Directorates'}
                                </h3>

                                {(!admin.subDirectorates || admin.subDirectorates.length === 0) ? (
                                    <p className="text-gov-stone/60 dark:text-white/50">{language === 'ar' ? 'لا توجد مديريات تابعة.' : 'No sub-directorates found.'}</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {admin.subDirectorates.map(sub => (
                                            <div
                                                key={sub.id}
                                                onClick={() => setSelectedSub(sub)}
                                                className="group cursor-pointer p-5 bg-gray-50 dark:bg-white/5 hover:bg-gov-gold/5 dark:hover:bg-gov-gold/10 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-all flex items-start gap-4"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center text-gov-teal dark:text-gov-gold shadow-sm shrink-0">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gov-charcoal dark:text-white group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors text-base line-clamp-2">
                                                        {getLocalized(sub.name)}
                                                    </h4>
                                                    {sub.isExternal && (
                                                        <span className="inline-block mt-2 text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                                            {language === 'ar' ? 'رابط خارجي' : 'External'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sub-Directorate Details Modal */}
            <AnimatePresence>
                {selectedSub && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSub(null)}
                            className="absolute inset-0 bg-gov-charcoal/60 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-gov-card rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gov-beige/30 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gov-forest dark:bg-white/10 flex items-center justify-center text-gov-gold">
                                        <Building2 size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gov-charcoal dark:text-white">
                                        {getLocalized(selectedSub.name)}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedSub(null)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {(selectedSub.description || selectedSub.description_ar || selectedSub.description_en) && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gov-sand uppercase tracking-wider mb-2">
                                            {language === 'ar' ? 'عن المديرية' : 'About Directorate'}
                                        </h4>
                                        <p className="text-gov-stone dark:text-white/80 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                                            {selectedSub.description_ar && language === 'ar'
                                                ? selectedSub.description_ar
                                                : selectedSub.description_en && language === 'en'
                                                    ? selectedSub.description_en
                                                    : getLocalized(selectedSub.description)}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {selectedSub.phone && (
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
                                            <Phone size={20} className="text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-blue-500 mb-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</p>
                                                <p className="text-gov-charcoal dark:text-white font-medium dir-ltr text-start">{selectedSub.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedSub.email && (
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50/50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10">
                                            <Mail size={20} className="text-green-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-green-500 mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                                                <a href={`mailto:${selectedSub.email}`} className="text-gov-charcoal dark:text-white font-medium hover:underline hover:text-green-600 transition-colors">{selectedSub.email}</a>
                                            </div>
                                        </div>
                                    )}
                                    {((language === 'ar' && selectedSub.address_ar) || (language === 'en' && selectedSub.address_en) || selectedSub.address) && (
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 md:col-span-2">
                                            <MapPin size={20} className="text-orange-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-orange-500 mb-1">{language === 'ar' ? 'العنوان' : 'Address'}</p>
                                                <p className="text-gov-charcoal dark:text-white font-medium">
                                                    {language === 'ar' && selectedSub.address_ar
                                                        ? selectedSub.address_ar
                                                        : language === 'en' && selectedSub.address_en
                                                            ? selectedSub.address_en
                                                            : getLocalized(selectedSub.address)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                                    <button
                                        onClick={() => setSelectedSub(null)}
                                        className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 text-gov-stone dark:text-white/80 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        {language === 'ar' ? 'إغلاق' : 'Close'}
                                    </button>
                                    {selectedSub.url && (
                                        <a
                                            href={selectedSub.isExternal ? selectedSub.url : `/directorates/${selectedSub.url.split('/').pop()}`}
                                            target={selectedSub.isExternal ? "_blank" : "_self"}
                                            className="px-6 py-2.5 rounded-xl bg-gov-teal dark:bg-gov-gold text-white dark:text-gov-forest font-bold hover:bg-gov-emerald dark:hover:bg-white transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                        >
                                            {selectedSub.isExternal ? (
                                                <>
                                                    {language === 'ar' ? 'زيارة الموقع' : 'Visit Site'}
                                                    <ExternalLink size={18} />
                                                </>
                                            ) : (
                                                <>
                                                    {language === 'ar' ? 'عرض الحدمات' : 'View Services'}
                                                    <ArrowRight size={18} className={language === 'ar' ? '' : 'rotate-180'} />
                                                </>
                                            )}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DirectoratesList;
