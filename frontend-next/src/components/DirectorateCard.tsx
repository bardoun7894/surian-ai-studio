import React from 'react';
import { Directorate, LocalizedString } from '@/types';
import { Laptop, ShoppingCart, TrendingUp, Building, Factory, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DirectorateCardProps {
    directorate: Directorate;
    onOpen: () => void;
}

const iconMap: Record<string, React.ElementType> = {
    'laptop': Laptop,
    'shopping-cart': ShoppingCart,
    'trending-up': TrendingUp,
    'factory': Factory,
    'shield-check': ShieldCheck,
    'ShieldCheck': ShieldCheck,
    'Factory': Factory,
    'TrendingUp': TrendingUp
};

export default function DirectorateCard({ directorate, onOpen }: DirectorateCardProps) {
    const { language } = useLanguage();
    // Normalize icon key to lowercase for matching if needed, or rely on strict map
    const Icon = iconMap[directorate.icon] || iconMap[directorate.icon.toLowerCase()] || Building;

    const getLocalized = (content: LocalizedString | string) => {
        if (typeof content === 'string') return content;
        return content[language as 'ar' | 'en'];
    };

    return (
        <div className="relative group w-full h-full">
            {/* Card Container */}
            <div
                onClick={onOpen}
                className="cursor-pointer overflow-hidden rounded-3xl border border-gov-gold/10 bg-white/80 dark:bg-gov-charcoal/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:shadow-gov-gold/10 transition-all duration-500 h-full flex flex-col hover:-translate-y-2 group-hover:border-gov-gold/30"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gov-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-gov-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 relative z-10 h-full">

                    {/* Icon Halo Effect */}
                    <div className="relative w-28 h-28 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                        <div className="absolute inset-0 rounded-full bg-gov-gold/10 dark:bg-gov-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="w-24 h-24 flex items-center justify-center relative z-10 drop-shadow-xl">
                                <img
                                    src="/assets/logo/22.png"
                                    alt="Ministry Eagle"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <h3 className="text-xl md:text-2xl font-bold text-gov-forest dark:text-white mb-3 font-display leading-tight">
                            {getLocalized(directorate.name)}
                        </h3>
                        <p className="text-gov-stone/80 dark:text-gov-beige/60 text-sm leading-relaxed max-w-xs mx-auto line-clamp-3">
                            {getLocalized(directorate.description)}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gov-forest/5 dark:bg-white/5 border border-gov-forest/10 dark:border-white/10 text-gov-forest dark:text-gov-gold text-sm font-bold group-hover:bg-gov-gold group-hover:text-white transition-all duration-300">
                            <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                            <Icon size={16} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
