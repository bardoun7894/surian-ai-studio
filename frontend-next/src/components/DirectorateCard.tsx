import React from 'react';
import { motion } from 'framer-motion';
import { Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface DirectorateCardProps {
    directorate: Directorate;
    onOpen?: () => void;
}

export default function DirectorateCard({ directorate, onOpen }: DirectorateCardProps) {
    const { language } = useLanguage();
    const router = useRouter();

    const handleClick = () => {
        router.push(`/directorates/${directorate.id}`);
    };

    const loc = (obj: any, field: string): string => {
        const val = obj?.[field];
        if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
            return val[language] || val['en'] || val['ar'] || '';
        }
        // Check for explicit _ar/_en suffixed fields first
        const arField = obj?.[`${field}_ar`];
        const enField = obj?.[`${field}_en`];
        const ar = arField || (typeof val === 'string' ? val : '') || '';
        const en = enField || ar;
        return language === 'ar' ? ar : en;
    };

    return (
        <motion.div
            className="relative group w-full h-full"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div
                onClick={handleClick}
                className="cursor-pointer overflow-hidden rounded-2xl border border-gov-gold/20 bg-white dark:bg-dm-surface dark:border-gov-border/20 shadow-md hover:shadow-[5px_5px_10px_#b9a779] transition-all duration-300 h-full flex flex-col relative"
            >
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gov-gold/0 via-gov-teal/0 to-gov-forest/0 group-hover:from-gov-gold/5 group-hover:via-gov-teal/5 group-hover:to-gov-forest/5 transition-all duration-500"></div>

                {/* Content - Compact Layout */}
                <div className="p-6 flex flex-col items-center justify-center text-center relative z-10 h-full min-h-[320px]">

                    {/* Larger Eagle Logo with floating animation */}
                    <motion.div
                        className="relative w-40 h-40 mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gov-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Rotating ring on hover */}
                        <div className="absolute inset-0 rounded-full border-2 border-gov-gold/0 group-hover:border-gov-gold/30 group-hover:animate-[spin_8s_linear_infinite] transition-all duration-300"></div>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-br from-gov-gold/10 to-gov-forest/5 p-3 shadow-inner">
                                <Image
                                    src="/assets/logo/eagle.png"
                                    alt="Ministry Emblem"
                                    width={128}
                                    height={128}
                                    className="object-contain w-full h-full drop-shadow-md"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Compact text content */}
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <h3 className="text-base md:text-lg font-bold text-gov-forest dark:text-gov-gold mb-2 font-display leading-tight line-clamp-2 group-hover:text-gov-teal transition-colors duration-300">
                            {loc(directorate, 'name')}
                        </h3>
                        <p className="text-gov-stone/70 dark:text-white/60 text-xs leading-relaxed max-w-[200px] mx-auto line-clamp-2 mb-3">
                            {loc(directorate, 'description')}
                        </p>
                    </div>

                    {/* Modern CTA Button */}
                    <motion.div
                        className="mt-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gov-forest/10 dark:bg-gov-teal/20 border border-gov-forest/20 dark:border-gov-teal/30 text-gov-forest dark:text-gov-teal text-xs font-bold group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-teal transition-all duration-300">
                            <span>{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
                            <ArrowRight size={12} className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </span>
                    </motion.div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-gov-gold/0 group-hover:border-gov-gold/40 rounded-tl-lg transition-all duration-300"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-gov-gold/0 group-hover:border-gov-gold/40 rounded-tr-lg transition-all duration-300"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-gov-gold/0 group-hover:border-gov-gold/40 rounded-bl-lg transition-all duration-300"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-gov-gold/0 group-hover:border-gov-gold/40 rounded-br-lg transition-all duration-300"></div>
            </div>
        </motion.div>
    );
}
