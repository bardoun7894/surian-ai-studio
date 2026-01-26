'use client';

import React, { useState } from 'react';
import { Smile, Meh, Frown, X, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HappinessIndicator: React.FC = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const ratings = [
        { icon: <Frown className="w-8 h-8" />, label: 'sad', color: 'hover:text-red-500', value: 1 },
        { icon: <Meh className="w-8 h-8" />, label: 'neutral', color: 'hover:text-yellow-500', value: 2 },
        { icon: <Smile className="w-8 h-8" />, label: 'happy', color: 'hover:text-green-500', value: 3 },
    ];

    const handleRate = (value: number) => {
        setSelected(value);
        setSubmitted(true);
        setTimeout(() => {
            setIsOpen(false);
            setSubmitted(false);
            setSelected(null);
        }, 3000);
    };

    return (
        <div className={`fixed bottom-24 ${language === 'ar' ? 'left-6' : 'right-6'} z-50`}>
            {isOpen ? (
                <div className="bg-white dark:bg-gov-charcoal border border-gov-gold/20 shadow-2xl rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 w-72">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-gov-stone/40 hover:text-gov-stone transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {!submitted ? (
                        <>
                            <h4 className="text-lg font-bold text-gov-forest dark:text-white mb-2 pr-6 rtl:pr-0 rtl:pl-6">
                                {t('happiness_title') || (language === 'ar' ? 'كيف كانت تجربتك؟' : 'How was your experience?')}
                            </h4>
                            <p className="text-sm text-gov-stone/60 dark:text-gov-beige/60 mb-6">
                                {t('happiness_subtitle') || (language === 'ar' ? 'رأيك يهمنا لتطوير خدماتنا' : 'Your opinion matters for our service development')}
                            </p>

                            <div className="flex justify-between items-center gap-2">
                                {ratings.map((rate) => (
                                    <button
                                        key={rate.value}
                                        onClick={() => handleRate(rate.value)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${rate.color} hover:bg-gov-beige/10 dark:hover:bg-white/5 active:scale-90`}
                                    >
                                        {rate.icon}
                                        <span className="text-xs font-medium opacity-60">
                                            {language === 'ar' ?
                                                (rate.label === 'happy' ? 'ممتاز' : rate.label === 'neutral' ? 'مقبول' : 'سيء') :
                                                rate.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-4 text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-gov-teal/10 rounded-full flex items-center justify-center mb-4 text-gov-teal">
                                <Heart size={32} fill="currentColor" />
                            </div>
                            <h4 className="text-lg font-bold text-gov-forest dark:text-white mb-1">
                                {t('happiness_thanks') || (language === 'ar' ? 'شكراً لتقييمك!' : 'Thank you for your feedback!')}
                            </h4>
                            <p className="text-sm text-gov-stone/60 dark:text-gov-beige/60">
                                {language === 'ar' ? 'نسعى دائماً لخدمتكم بشكل أفضل' : 'We always strive to serve you better'}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative w-14 h-14 bg-gov-gold text-white rounded-full shadow-lg hover:shadow-gov-gold/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Smile size={28} className="relative z-10" />

                    {/* Tooltip */}
                    <div className={`absolute bottom-full mb-4 px-3 py-1 bg-gov-charcoal text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                        {language === 'ar' ? 'مؤشر السعادة' : 'Happiness Indicator'}
                        <div className={`absolute top-full border-4 border-transparent border-t-gov-charcoal ${language === 'ar' ? 'left-4' : 'right-4'}`}></div>
                    </div>
                </button>
            )}
        </div>
    );
};

export default HappinessIndicator;
