'use client';

import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, X, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { motion, AnimatePresence } from 'framer-motion';

const HappinessIndicator: React.FC = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const [isMounted, setIsMounted] = useState(false);

    // Show indicator after 1 minute
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);

            // Show hint 5 seconds after mounting
            setTimeout(() => {
                setShowHint(true);
            }, 5000);

        }, 60000); // 1 minute delay

        return () => clearTimeout(timer);
    }, []);

    if (!isMounted) return null;

    const ratings = [
        { icon: <Frown className="w-8 h-8" />, label: 'sad', color: 'text-red-500', hoverColor: 'hover:bg-red-50', value: 1 },
        { icon: <Meh className="w-8 h-8" />, label: 'neutral', color: 'text-yellow-500', hoverColor: 'hover:bg-yellow-50', value: 2 },
        { icon: <Smile className="w-8 h-8" />, label: 'happy', color: 'text-green-500', hoverColor: 'hover:bg-green-50', value: 3 },
    ];

    const handleRate = async (value: number) => {
        setSelected(value);
        setSubmitted(true);
        setShowHint(false); // Hide hint if it was showing

        // Submit to backend
        const page = typeof window !== 'undefined' ? window.location.pathname : undefined;
        try {
            await API.happiness.submit(value, page);
        } catch (error) {
            console.error('Failed to submit happiness rating', error);
        }

        setTimeout(() => {
            setIsOpen(false);
            setSubmitted(false);
            setSelected(null);
        }, 3000);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        setShowHint(false);
    };

    return (
        // Positioned above the ChatBot. Right in Arabic (right-8), Left in English (left-8)
        // Adjusting bottom so it doesn't overlap with the ChatBot on mobile
        <div className={`fixed bottom-48 md:bottom-40 ${language === 'ar' ? 'right-6 md:right-8' : 'left-6 md:left-8'} z-40 flex flex-col items-center pointer-events-none`}>

            {/* Hint Bubble */}
            <AnimatePresence>
                {!isOpen && showHint && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className={`pointer-events-auto absolute bottom-16 mb-2 bg-white dark:bg-dm-surface text-gov-forest dark:text-white px-4 py-2 rounded-xl shadow-lg border border-gov-gold/20 whitespace-nowrap text-sm font-medium cursor-pointer hover:bg-gov-beige/20 transition-colors z-50`}
                        onClick={toggleOpen}
                    >
                        {language === 'ar' ? 'كيف كانت تجربتك؟' : 'How was your experience?'}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-dm-surface border-b border-r border-gov-gold/20 rotate-45"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
                            className="absolute -top-1.5 -right-1.5 bg-gray-100 hover:bg-gray-200 rounded-full p-0.5 text-gray-500"
                        >
                            <X size={10} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Component */}
            <div className="pointer-events-auto relative">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className={`absolute bottom-full mb-4 ${language === 'ar' ? '-right-2' : '-left-2'} bg-white dark:bg-dm-surface border border-gov-gold/20 shadow-xl rounded-3xl p-5 w-72 origin-bottom-${language === 'ar' ? 'right' : 'left'}`}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gov-stone/40 hover:text-gov-stone transition-colors"
                            >
                                <X size={16} />
                            </button>

                            {!submitted ? (
                                <>
                                    <h4 className="text-base font-bold text-gov-forest dark:text-white mb-1 pr-6 rtl:pr-0 rtl:pl-6">
                                        {language === 'ar' ? 'رأيك يهمنا' : 'Your opinion matters'}
                                    </h4>
                                    <p className="text-xs text-gov-stone/60 dark:text-gov-beige/60 mb-4">
                                        {language === 'ar' ? 'ساعدنا في تحسين خدماتنا' : 'Help us improve our services'}
                                    </p>

                                    <div className="flex justify-around items-center gap-2">
                                        {ratings.map((rate) => (
                                            <button
                                                key={rate.value}
                                                onClick={() => handleRate(rate.value)}
                                                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 group ${rate.hoverColor}`}
                                            >
                                                <div className={`${rate.color} transform group-hover:scale-110 transition-transform`}>
                                                    {rate.icon}
                                                </div>
                                                <span className="text-[10px] font-bold text-gov-stone/70 dark:text-white/70">
                                                    {language === 'ar' ?
                                                        (rate.label === 'happy' ? 'راضي' : rate.label === 'neutral' ? 'محايد' : 'غير راضي') :
                                                        rate.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center py-2 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-12 h-12 bg-gov-teal/10 rounded-full flex items-center justify-center mb-2 text-gov-teal"
                                    >
                                        <Heart size={24} fill="currentColor" />
                                    </motion.div>
                                    <h4 className="text-base font-bold text-gov-forest dark:text-white mb-1">
                                        {language === 'ar' ? 'شكراً لك!' : 'Thank you!'}
                                    </h4>
                                    <p className="text-xs text-gov-stone/60 dark:text-gov-beige/60">
                                        {language === 'ar' ? 'تم استلام تقييمك بنجاح' : 'Your feedback has been received'}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleOpen}
                    className={`group w-12 h-12 bg-white dark:bg-dm-surface text-gov-forest dark:text-gov-gold rounded-full shadow-lg border border-gov-gold/30 hover:shadow-gov-gold/20 flex items-center justify-center transition-all duration-300 ${isOpen ? 'ring-2 ring-gov-gold ring-offset-2 dark:ring-offset-dm-bg' : ''}`}
                >
                    <Smile size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 opacity-0 absolute' : 'opacity-100'}`} />
                    <X size={24} className={`transition-transform duration-300 ${!isOpen ? '-rotate-180 opacity-0 absolute' : 'opacity-100'}`} />
                </motion.button>
            </div>
        </div>
    );
};

export default HappinessIndicator;
