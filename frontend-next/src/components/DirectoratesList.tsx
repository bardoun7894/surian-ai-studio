'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import { Directorate, SubDirectorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Building2,
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
    Loader2,
    ExternalLink,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const DirectoratesList: React.FC = () => {
    const { t, language } = useLanguage();
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const [loading, setLoading] = useState(true);

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

    const getLocalized = (content: LocalizedString | string) => {
        if (typeof content === 'string') return content;
        return content[language as 'ar' | 'en'];
    };

    const getIcon = (iconName: string) => {
        const props = { size: 32 };
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-gov-teal" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2 flex items-center gap-3 justify-center">
                    <LayoutGrid className="text-gov-teal dark:text-gov-gold" />
                    {language === 'ar' ? 'الإدارات العامة' : 'General Directorates'}
                </h2>
                <p className="text-gov-stone/60 dark:text-gov-beige/60">
                    {language === 'ar' ? 'الإدارات الرئيسية التابعة لوزارة الاقتصاد والصناعة' : 'Main directorates of the Ministry of Economy and Industry'}
                </p>
            </div>

            <div className="space-y-8">
                {directorates.map((dir) => (
                    <div key={dir.id} className="bg-white dark:bg-gov-forest/50 rounded-2xl border border-gov-gold/10 dark:border-white/10 shadow-sm overflow-hidden">
                        {/* Directorate Header */}
                        <Link
                            href={`/directorates/${dir.id}`}
                            className="flex items-center gap-4 p-6 bg-gov-beige/30 dark:bg-white/5 border-b border-gov-gold/10 dark:border-white/10 hover:bg-gov-beige/50 dark:hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gov-teal/10 dark:bg-gov-gold/20 flex items-center justify-center text-gov-teal dark:text-gov-gold group-hover:bg-gov-teal group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-all">
                                {getIcon(dir.icon)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gov-charcoal dark:text-white group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                                    {getLocalized(dir.name)}
                                </h3>
                                <p className="text-sm text-gov-stone/60 dark:text-gov-beige/60 mt-1">
                                    {getLocalized(dir.description)}
                                </p>
                            </div>
                            <ArrowRight size={20} className={`text-gov-teal dark:text-gov-gold opacity-0 group-hover:opacity-100 transition-opacity ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </Link>

                        {/* Sub-Directorates Grid */}
                        {dir.subDirectorates && dir.subDirectorates.length > 0 && (
                            <div className="p-6">
                                <h4 className="text-xs font-bold text-gov-sand uppercase tracking-wider mb-4">
                                    {language === 'ar' ? 'المديريات التابعة' : 'Sub-Directorates'}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {dir.subDirectorates.map((sub: SubDirectorate) => {
                                        const isExternal = sub.isExternal || sub.is_external;
                                        const subName = typeof sub.name === 'string' ? sub.name : (language === 'ar' ? sub.name?.ar || sub.name_ar : sub.name?.en || sub.name_en || sub.name_ar);
                                        return (
                                            <Link
                                                key={sub.id}
                                                href={sub.url}
                                                target={isExternal ? '_blank' : undefined}
                                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-gov-beige/20 dark:bg-white/5 border border-transparent hover:border-gov-gold/20 dark:hover:border-gov-gold/20 hover:shadow-md transition-all group/sub"
                                            >
                                                <Building2 size={16} className="text-gov-sand group-hover/sub:text-gov-teal dark:group-hover/sub:text-gov-gold transition-colors flex-shrink-0" />
                                                <span className="text-sm text-gov-charcoal dark:text-white font-medium flex-1 leading-tight">
                                                    {subName}
                                                </span>
                                                {isExternal && (
                                                    <ExternalLink size={12} className="text-gov-sand flex-shrink-0" />
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
        </div>
    );
};

export default DirectoratesList;
