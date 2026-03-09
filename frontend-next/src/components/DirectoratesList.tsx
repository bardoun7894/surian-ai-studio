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
    ChevronUp,
    Filter
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
    usePageLoading(loading);

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
    const getLocalized = (field: any, obj?: any, fieldName: string = 'name') => {
        if (!field && !obj) return '';
        // Handle LocalizedString objects { ar: '...', en: '...' }
        if (field && typeof field === 'object' && ('ar' in field || 'en' in field)) {
            return language === 'ar' ? (field.ar || field.en || '') : (field.en || field.ar || '');
        }
        // If obj is provided, check for _ar/_en suffixed fields
        if (obj) {
            const arVal = obj[fieldName + '_ar'] || obj[fieldName] || (typeof field === 'string' ? field : '') || '';
            const enVal = obj[fieldName + '_en'] || '';
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

    // --- Grouping Logic for Org Chart ---
    interface DirectorateGroup {
        id: string;
        label: { ar: string; en: string };
        icon: React.ReactNode;
        directorates: Directorate[];
    }

    const groupedDirectorates = useMemo((): DirectorateGroup[] => {
        if (directorates.length === 0) return [];
        
        const groups: DirectorateGroup[] = [
            {
                id: 'general-admin',
                label: { ar: 'الإدارات العامة', en: 'General Administrations' },
                icon: <Landmark size={22} />,
                directorates: directorates.filter(d => {
                    const name = d.name_ar || (typeof d.name === 'object' ? d.name?.ar : d.name) || '';
                    return name.includes('الإدارة العامة');
                }),
            },
            {
                id: 'directorates',
                label: { ar: 'المديريات', en: 'Directorates' },
                icon: <Building2 size={22} />,
                directorates: directorates.filter(d => {
                    const name = d.name_ar || (typeof d.name === 'object' ? d.name?.ar : d.name) || '';
                    return name.includes('مديرية');
                }),
            },
            {
                id: 'authorities',
                label: { ar: 'الهيئات', en: 'Authorities' },
                icon: <ShieldAlert size={22} />,
                directorates: directorates.filter(d => {
                    const name = d.name_ar || (typeof d.name === 'object' ? d.name?.ar : d.name) || '';
                    return name.includes('هيئة');
                }),
            },
            {
                id: 'companies',
                label: { ar: 'الشركات العامة', en: 'Public Companies' },
                icon: <Factory size={22} />,
                directorates: directorates.filter(d => {
                    const name = d.name_ar || (typeof d.name === 'object' ? d.name?.ar : d.name) || '';
                    return name.includes('السورية');
                }),
            },
            {
                id: 'centers',
                label: { ar: 'المراكز والمؤسسات', en: 'Centers & Institutions' },
                icon: <BookOpen size={22} />,
                directorates: directorates.filter(d => {
                    const name = d.name_ar || (typeof d.name === 'object' ? d.name?.ar : d.name) || '';
                    return name.includes('مركز') || name.includes('المؤسسة');
                }),
            },
        ];

        // Collect ungrouped directorates
        const groupedIds = new Set(groups.flatMap(g => g.directorates.map(d => d.id)));
        const ungrouped = directorates.filter(d => !groupedIds.has(d.id));
        if (ungrouped.length > 0) {
            groups.push({
                id: 'other',
                label: { ar: 'جهات أخرى', en: 'Other Entities' },
                icon: <LayoutGrid size={22} />,
                directorates: ungrouped,
            });
        }

        return groups.filter(g => g.directorates.length > 0);
    }, [directorates]);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    const expandAll = () => {
        setExpandedGroups(new Set(groupedDirectorates.map(g => g.id)));
    };

    const collapseAll = () => {
        setExpandedGroups(new Set());
    };

    const filteredGroups = useMemo(() => {
        if (!activeFilter) return groupedDirectorates;
        return groupedDirectorates.filter(g => g.id === activeFilter);
    }, [groupedDirectorates, activeFilter]);

    // Auto-expand all groups on initial load
    useEffect(() => {
        if (groupedDirectorates.length > 0 && expandedGroups.size === 0) {
            setExpandedGroups(new Set(groupedDirectorates.map(g => g.id)));
        }
    }, [groupedDirectorates]);

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

    // FULL VARIANT (Grouped Accordion Redesign)
    return (
        <div className="min-h-screen bg-gov-beige/30 dark:bg-dm-bg pb-20">
            {/* Ministry Root Banner */}
            <div className="bg-gov-forest text-white py-10 md:py-16 px-4 relative overflow-hidden">
                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-pattern-islamic opacity-5 pointer-events-none mix-blend-overlay"></div>
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
                    {directorates.map((admin, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={admin.id}
                            className="bg-white dark:bg-dm-surface rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 overflow-hidden"
                        >
                            <option value="">{language === 'ar' ? 'عرض جميع الجهات' : 'Show All Entities'}</option>
                            {groupedDirectorates.map(group => (
                                <option key={group.id} value={group.id}>
                                    {language === 'ar' ? group.label.ar : group.label.en} ({group.directorates.length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Expand / Collapse All */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={expandAll}
                            className="px-4 py-2 text-xs font-bold text-gov-teal dark:text-gov-gold bg-gov-teal/10 dark:bg-gov-gold/10 rounded-lg hover:bg-gov-teal/20 dark:hover:bg-gov-gold/20 transition-colors"
                        >
                            {language === 'ar' ? 'توسيع الكل' : 'Expand All'}
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-4 py-2 text-xs font-bold text-gov-stone dark:text-white/60 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            {language === 'ar' ? 'طي الكل' : 'Collapse All'}
                        </button>
                    </div>

                    {/* Entity Count */}
                    <div className="text-sm text-gov-stone/60 dark:text-white/40">
                        {language === 'ar'
                            ? `${directorates.length} جهة`
                            : `${directorates.length} entities`}
                    </div>
                </div>
            </div>

            {/* Grouped Accordion View */}
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-5 md:gap-6">
                    {filteredGroups.map((group, groupIndex) => {
                        const isExpanded = expandedGroups.has(group.id);
                        return (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(groupIndex * 0.08, 0.4) }}
                                className="bg-white dark:bg-dm-surface rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 overflow-hidden"
                            >
                                {/* Group Accordion Header */}
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="w-full p-5 md:p-6 flex items-center gap-4 bg-gradient-to-r from-gov-beige/50 to-transparent dark:from-white/5 hover:from-gov-gold/10 dark:hover:from-gov-gold/5 transition-all duration-300 group/header cursor-pointer"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gov-forest dark:bg-white/10 flex items-center justify-center text-gov-gold shadow-lg shrink-0 group-hover/header:bg-gov-gold group-hover/header:text-gov-forest transition-all duration-300">
                                        {group.icon}
                                    </div>
                                    <div className="flex-1 text-start">
                                        <h2 className="text-lg md:text-2xl font-bold text-gov-charcoal dark:text-white">
                                            {language === 'ar' ? group.label.ar : group.label.en}
                                        </h2>
                                        <p className="text-sm text-gov-stone/60 dark:text-white/50 mt-1">
                                            {language === 'ar'
                                                ? `${group.directorates.length} جهة`
                                                : `${group.directorates.length} entities`}
                                        </p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={20} className="text-gov-charcoal dark:text-white/60" />
                                    </div>
                                </button>

                                {/* Group Content (Expandable) */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: isExpanded ? 'auto' : 0,
                                        opacity: isExpanded ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 md:px-6 pb-6 pt-2">
                                        <div className="flex flex-col gap-4">
                                            {group.directorates.map((admin, index) => (
                                                <div
                                                    key={admin.id}
                                                    className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-gov-border/10 overflow-hidden hover:shadow-md transition-all duration-300"
                                                >
                                                    {/* Entity Header */}
                                                    <div className="p-4 md:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 relative">
                                                        <div className="absolute top-0 bottom-0 end-0 w-1.5 bg-gov-gold rounded-s-full"></div>
                                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white dark:bg-dm-surface flex items-center justify-center text-gov-teal dark:text-gov-gold shadow-sm shrink-0 border border-gray-100 dark:border-gov-border/15">
                                                            {getIcon(admin.icon, false)}
                                                        </div>
                                                        <div className="text-center md:text-start flex-1 min-w-0">
                                                            <h3 className="text-base md:text-xl font-bold text-gov-charcoal dark:text-white mb-1 md:mb-2">
                                                                {getLocalized(admin.name, admin)}
                                                            </h3>
                                                            {getLocalized(admin.description, admin, 'description') && (
                                                                <p className="text-sm text-gov-stone dark:text-white/60 leading-relaxed line-clamp-2">
                                                                    {getLocalized(admin.description, admin, 'description')}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Link href={`/directorates/${admin.id}`} className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gov-teal/10 hover:bg-gov-teal text-gov-teal hover:text-white dark:bg-gov-gold/10 dark:hover:bg-gov-gold dark:text-gov-gold dark:hover:text-gov-forest rounded-xl font-bold text-sm transition-all">
                                                            {language === 'ar' ? 'التفاصيل' : 'Details'}
                                                            <ArrowRight size={16} className={language === 'ar' ? 'rotate-180' : ''} />
                                                        </Link>
                                                    </div>

                                                    {/* Sub-Directorates (if any) */}
                                                    {admin.subDirectorates && admin.subDirectorates.length > 0 && (
                                                        <div className="px-4 md:px-6 pb-4 pt-0">
                                                            <div className="border-t border-gray-100 dark:border-gov-border/10 pt-3">
                                                                <h4 className="text-xs font-bold text-gov-forest/60 dark:text-white/40 mb-3 flex items-center gap-2 uppercase tracking-wider">
                                                                    <Building2 className="text-gov-gold/60" size={14} />
                                                                    {language === 'ar' ? 'المديريات التابعة' : 'Sub-Directorates'}
                                                                    <span className="text-gov-gold/40">({admin.subDirectorates.length})</span>
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                    {admin.subDirectorates.map(sub => (
                                                                        <Link
                                                                            key={sub.id}
                                                                            href={sub.isExternal ? (sub.url || '#') : `/directorates/${admin.id}/${sub.id}`}
                                                                            target={sub.isExternal ? '_blank' : undefined}
                                                                            rel={sub.isExternal ? 'noopener noreferrer' : undefined}
                                                                            className="group/sub p-2.5 bg-white dark:bg-dm-surface/50 hover:bg-gov-gold/5 dark:hover:bg-gov-gold/10 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gov-gold/30 transition-all flex items-center gap-2.5"
                                                                        >
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-gov-gold/40 group-hover/sub:bg-gov-gold transition-colors shrink-0"></div>
                                                                            <span className="text-sm font-medium text-gov-charcoal dark:text-white/70 group-hover/sub:text-gov-teal dark:group-hover/sub:text-gov-gold transition-colors line-clamp-1">
                                                                                {getLocalized(sub.name, sub)}
                                                                            </span>
                                                                            {sub.isExternal && (
                                                                                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded shrink-0">
                                                                                    {language === 'ar' ? 'خارجي' : 'Ext'}
                                                                                </span>
                                                                            )}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Section Divider */}
            <div className="max-w-6xl mx-auto px-6 py-12 mt-8">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gov-gold/30 to-transparent"></div>
                    <div className="w-3 h-3 rounded-full bg-gov-gold/30"></div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gov-gold/30 to-transparent"></div>
                </div>
                <p className="text-center text-sm text-gov-stone/50 dark:text-white/30 mt-4">
                    {language === 'ar'
                        ? `${filteredGroups.length} تصنيف • ${directorates.length} جهة`
                        : `${filteredGroups.length} categories • ${directorates.length} entities`}
                </p>
            </div>

        </div>
    );
};

export default DirectoratesList;
