import React from 'react';
import { Directorate } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface DirectorateCardProps {
    directorate: Directorate;
    onOpen?: () => void; // Made optional for backward compatibility
}

export default function DirectorateCard({ directorate, onOpen }: DirectorateCardProps) {
    const { language } = useLanguage();
    const router = useRouter();

    const handleClick = () => {
        // Navigate to the directorate detail page instead of opening modal
        router.push(`/directorates/${directorate.id}`);
    };

    const loc = (obj: any, field: string): string => {
        const ar = obj?.[`${field}_ar`] || obj?.[field] || '';
        const en = obj?.[`${field}_en`] || ar;
        return language === 'ar' ? ar : en;
    };

    return (
        <div className="relative group w-full h-full">
            {/* Card Container */}
            <div
                onClick={handleClick}
                className="cursor-pointer overflow-hidden rounded-3xl border border-gov-gold/10 bg-white/80 dark:bg-gov-emeraldStatic backdrop-blur-md shadow-lg hover:shadow-2xl hover:shadow-gov-gold/10 transition-all duration-500 h-full flex flex-col hover:-translate-y-2 group-hover:border-gov-gold/30"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gov-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-gov-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 relative z-10 h-full">

                    {/* Eagle Logo */}
                    <div className="relative w-44 h-44 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                        <div className="absolute inset-0 rounded-full bg-gov-gold/10 dark:bg-gov-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="w-40 h-40 flex items-center justify-center relative z-10 drop-shadow-xl rounded-full bg-gradient-to-br from-gov-gold/20 to-gov-forest/10 dark:from-gov-gold/10 dark:to-gov-forest/5 p-4">
                                <Image
                                    src="/assets/logo/eagle.png"
                                    alt="Ministry Emblem"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <h3 className="text-xl md:text-2xl font-bold text-gov-forest dark:text-gov-gold mb-3 font-display leading-tight">
                            {loc(directorate, 'name')}
                        </h3>
                        <p className="text-gov-stone/80 dark:text-gov-beige/60 text-sm leading-relaxed max-w-xs mx-auto line-clamp-3">
                            {loc(directorate, 'description')}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gov-forest/5 dark:bg-white/5 border border-gov-forest/10 dark:border-white/10 text-gov-forest dark:text-gov-gold text-sm font-bold group-hover:bg-gov-gold group-hover:text-white transition-all duration-300">
                            <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
