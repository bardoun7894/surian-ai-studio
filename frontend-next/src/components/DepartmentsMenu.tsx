import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Building2, ExternalLink, ChevronRight, MapPin, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { Directorate } from '@/types';
import { getLocalizedName } from '@/lib/utils'; // Keep this usage

interface DepartmentsMenuProps {
    label: string;
    active?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
}

const DepartmentsMenu: React.FC<DepartmentsMenuProps> = ({ label, active, onMouseEnter, onMouseLeave, onClick }) => {
    const [directorates, setDirectorates] = useState<Directorate[]>([]);
    const { language, t } = useLanguage();

    useEffect(() => {
        // Fetch directorates once on mount
        const fetchDirectorates = async () => {
            try {
                const data = await API.directorates.getAll();
                setDirectorates(data);
            } catch (error) {
                console.error('Failed to load directorates for menu:', error);
            }
        };
        fetchDirectorates();
    }, []);

    return (
        <div
            className=""
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <button
                onClick={onClick}
                onFocus={onMouseEnter}
                className={`flex items-center gap-1.5 px-3 py-4 text-sm font-bold text-white/90 hover:text-white transition-colors border-b-2 border-transparent ${active ? 'border-gov-gold text-white' : ''}`}
                aria-expanded={active}
            >
                <span>{label}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${active ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {active && directorates.length > 0 && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 top-[4rem] md:top-[5rem] z-40 bg-black/20 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`fixed left-0 right-0 top-[4rem] md:top-[5rem] w-full bg-white dark:bg-dm-surface shadow-xl border-t border-gov-gold/10 z-50`}
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {/* Columns Layout: All Administrations Visible */}
                                <div className={`grid grid-cols-1 md:grid-cols-${Math.min(directorates.length, 3)} gap-8`}>
                                    {directorates.map((directorate) => (
                                        <div key={directorate.id} className="space-y-4">
                                            {/* Administration Header */}
                                            <Link
                                                href={`/directorates/${directorate.id}`}
                                                onClick={onClick}
                                                className="block group"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="p-1.5 rounded-lg bg-gov-gold/10 text-gov-gold group-hover:bg-gov-gold group-hover:text-white transition-colors">
                                                        <Building2 size={18} />
                                                    </span>
                                                    <h3 className="font-bold text-gov-charcoal dark:text-white text-base group-hover:text-gov-gold transition-colors">
                                                        {typeof directorate.name === 'string' ? directorate.name : getLocalizedName(directorate.name, language)}
                                                    </h3>
                                                </div>
                                                <p className="text-xs text-gray-400 line-clamp-2 pl-9 mb-4">
                                                    {typeof directorate.description === 'string' ? directorate.description : getLocalizedName(directorate.description, language)}
                                                </p>
                                            </Link>

                                            {/* Directorates List (Sub-items) */}
                                            <div className="pl-9 border-r-2 border-gray-100 dark:border-white/5 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0">
                                                <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-wider px-3">{t('nav_sub_directorates')}</h4>
                                                <ul className="space-y-2">
                                                    {directorate.subDirectorates && directorate.subDirectorates.length > 0 ? (
                                                        directorate.subDirectorates.map((sub, idx) => (
                                                            <li key={`${directorate.id}-sub-${idx}`}>
                                                                <Link
                                                                    href={sub.url}
                                                                    onClick={onClick}
                                                                    target={sub.isExternal ? "_blank" : undefined}
                                                                    className="group/item flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gov-beige/20 dark:hover:bg-white/5 transition-colors"
                                                                >
                                                                    <span className="block text-sm font-medium text-gov-charcoal dark:text-white group-hover/item:text-gov-gold transition-colors">
                                                                        {typeof sub.name === 'string' ? sub.name : getLocalizedName(sub.name, language)}
                                                                    </span>
                                                                    {sub.isExternal && <ExternalLink size={10} className="text-gray-400 opacity-50" />}
                                                                    <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all rtl:rotate-180" />
                                                                </Link>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="px-3 text-xs text-gray-400 italic">
                                                            {language === 'ar' ? 'لا توجد مديريات فرعية' : 'No sub-directorates'}
                                                        </li>
                                                    )}
                                                </ul>

                                                <div className="mt-4 px-3">
                                                    <Link
                                                        href={`/directorates/${directorate.id}`}
                                                        onClick={onClick}
                                                        className="inline-flex items-center text-xs font-bold text-gov-gold hover:underline"
                                                    >
                                                        {t('view_details')}
                                                        <span className="mx-1 rtl:rotate-180">→</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepartmentsMenu;
