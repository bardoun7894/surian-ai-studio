import React from 'react';
import { motion } from 'framer-motion';
import { Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface DirectorateCardProps {
    directorate: Directorate;
    onOpen?: () => void;
}

export default function DirectorateCard({ directorate, onOpen }: DirectorateCardProps) {
    const { language } = useLanguage();

    const loc = (obj: any, field: string): string => {
        const val = obj?.[field];
        if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
            return val[language] || val['en'] || val['ar'] || '';
        }
        const arField = obj?.[`${field}_ar`];
        const enField = obj?.[`${field}_en`];
        const ar = arField || (typeof val === 'string' ? val : '') || '';
        const en = enField || '';
        return language === 'ar' ? ar : en;
    };

    return (
        <motion.div
            className="relative group w-full h-full"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Link
                href={`/directorates/${directorate.id}`}
                className="block relative overflow-hidden rounded-3xl bg-white/80 dark:bg-dm-surface/80 backdrop-blur-xl border-2 border-gov-gold/20 dark:border-gov-gold/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(185,167,121,0.25)] dark:hover:shadow-[0_20px_40px_rgba(185,167,121,0.1)] hover:border-gov-gold/50 dark:hover:border-gov-gold/30 transition-all duration-500 h-full"
            >
                {/* Abstract Shapes */}
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gov-teal/10 to-transparent rounded-tr-[100px] -z-10 transition-transform duration-500 group-hover:scale-150" />

                <div className="p-5 md:p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">

                    {/* Eagle Logo Container */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gov-gold/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-white to-gov-beige/40 dark:from-dm-bg dark:to-dm-surface border border-white/80 dark:border-gov-border/50 shadow-inner flex items-center justify-center p-3 transform rotate-0 group-hover:rotate-0 transition-all duration-500 z-10 group-hover:shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] dark:group-hover:shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
                            <Image
                                src="/assets/logo/eagle.png"
                                alt="Ministry Emblem"
                                width={80}
                                height={80}
                                className="object-contain w-full h-full drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg md:text-xl font-bold text-gov-forest dark:text-gov-gold mb-5 font-display leading-normal line-clamp-3 group-hover:text-gov-teal transition-colors duration-300 drop-shadow-sm">
                        {loc(directorate, 'name')}
                    </h3>

                    {/* CTA Button */}
                    <div className="mt-auto">
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gov-forest/5 dark:bg-gov-teal/10 border border-gov-forest/10 dark:border-gov-teal/20 text-gov-forest dark:text-gov-teal text-sm font-bold group-hover:bg-gradient-to-r group-hover:from-gov-forest group-hover:to-gov-teal group-hover:text-white dark:group-hover:from-gov-teal dark:group-hover:to-gov-forest dark:group-hover:text-white transition-all duration-500 group-hover:border-transparent group-hover:shadow-lg"
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
                            <ArrowRight size={16} className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
                        </motion.div>
                    </div>
                </div>

                {/* Animated Gradient Border at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gov-forest via-gov-gold to-gov-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </Link>
        </motion.div>
    );
}
