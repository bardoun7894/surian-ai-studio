import React, { useState } from 'react';
import { Directorate } from '@/types';
import { Laptop, ShoppingCart, TrendingUp, Building } from 'lucide-react';

interface DirectorateCardProps {
    directorate: Directorate;
}

const iconMap: Record<string, React.ElementType> = {
    'laptop': Laptop,
    'shopping-cart': ShoppingCart,
    'trending-up': TrendingUp,
};

export default function DirectorateCard({ directorate }: DirectorateCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = iconMap[directorate.icon] || Building;

    return (
        <div className="relative group">
            {/* Card Container */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={`cursor-pointer overflow-hidden rounded-xl border border-gov-gold/20 bg-white/90 dark:bg-gov-forest/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 ${isExpanded ? 'ring-2 ring-gov-gold scale-[1.02]' : 'hover:border-gov-gold/50 hover:-translate-y-1'
                    }`}
            >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gov-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Header Section with Icon & Title */}
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                    {/* Icon Container */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gov-beige/50 to-white/10 dark:from-white/10 dark:to-transparent flex items-center justify-center border border-gov-gold/30 group-hover:border-gov-gold group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <Icon className="w-10 h-10 text-gov-forest dark:text-gov-gold drop-shadow-md" strokeWidth={1.5} />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-gov-gold/20 animate-[spin_20s_linear_infinite] opacity-50"></div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-2 font-display bg-clip-text">
                            {directorate.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                            {directorate.description}
                        </p>
                    </div>

                    {/* Expand Indicator */}
                    <div
                        className={`text-gov-gold mt-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-1'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Sub-Directorates / Quick Links (Expanded State) */}
                <div
                    className={`bg-gov-beige/30 dark:bg-black/20 border-t border-gov-gold/10 transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    {directorate.subDirectorates && (
                        <ul className="divide-y divide-gov-gold/10">
                            {directorate.subDirectorates.map((sub, idx) => (
                                <li key={sub.id} className="transition-all duration-300 hover:bg-gov-gold/5" style={{ transitionDelay: `${idx * 50}ms` }}>
                                    <a
                                        href={sub.url || '#'}
                                        target={sub.isExternal ? '_blank' : '_self'}
                                        rel={sub.isExternal ? 'noopener noreferrer' : ''}
                                        onClick={(e) => e.stopPropagation()} // Prevent card toggle when clicking link
                                        className="block px-6 py-3 text-sm text-gov-forest dark:text-gray-200 group/link flex items-center justify-between"
                                    >
                                        <span className="font-medium">{sub.name}</span>
                                        {sub.isExternal && (
                                            <svg className="w-3 h-3 text-gov-gold opacity-70 group-hover/link:opacity-100 transform group-hover/link:translate-x-[-2px] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
