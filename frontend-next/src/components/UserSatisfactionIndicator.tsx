'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, X, ThumbsUp, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const UserSatisfactionIndicator: React.FC = () => {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const hasRated = localStorage.getItem('gov_satisfaction_rated');
        if (!hasRated) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleRating = (value: number) => {
        setRating(value);
        setTimeout(() => {
            setHasSubmitted(true);
            localStorage.setItem('gov_satisfaction_rated', 'true');
            setTimeout(() => {
                setIsVisible(false);
            }, 2500);
        }, 500);
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed bottom-36 z-[55] ${language === 'ar' ? 'left-6' : 'right-6'}`}>
            <AnimatePresence mode="wait">
                {hasSubmitted ? (
                    /* Thank You */
                    <motion.div
                        key="thanks"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white dark:bg-dm-surface rounded-2xl shadow-xl border border-green-300/40 p-4 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2"
                        >
                            <ThumbsUp size={24} className="text-green-600 dark:text-green-400" />
                        </motion.div>
                        <p className="text-sm font-bold text-gov-forest dark:text-white mb-1">
                            {language === 'ar' ? 'شكراً لك!' : 'Thank you!'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-white/60">
                            {language === 'ar' ? 'نقدّر تقييمك ونسعى دائماً للتحسين' : 'We appreciate your feedback'}
                        </p>
                    </motion.div>
                ) : !isExpanded ? (
                    /* Collapsed: Single emoji button */
                    <motion.button
                        key="trigger"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsExpanded(true)}
                        className="w-14 h-14 bg-white dark:bg-dm-surface rounded-full shadow-lg flex items-center justify-center text-gov-forest dark:text-gov-gold border border-gray-100 dark:border-gov-border/15 hover:shadow-xl transition-all duration-300"
                        title={language === 'ar' ? 'قيّم تجربتك' : 'Rate your experience'}
                    >
                        <Smile size={32} strokeWidth={1.5} />
                    </motion.button>
                ) : (
                    /* Expanded: Full rating panel */
                    <motion.div
                        key="panel"
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 10 }}
                        className="bg-white dark:bg-dm-surface rounded-2xl shadow-xl border border-gov-gold/20 dark:border-gov-gold/30 p-4 min-w-[280px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gov-forest/10 dark:bg-gov-gold/20 flex items-center justify-center">
                                    <TrendingUp size={16} className="text-gov-forest dark:text-gov-gold" />
                                </div>
                                <span className="font-bold text-gov-forest dark:text-white text-sm">
                                    {language === 'ar' ? 'قياس رضا الزوار' : 'Visitor Satisfaction'}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-400 hover:text-gray-600 dark:text-white/50 dark:hover:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full p-1 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Question */}
                        <p className="text-xs text-gray-500 dark:text-white/60 text-center mb-3">
                            {language === 'ar' ? 'كيف تقيّم تجربتك في موقعنا؟' : 'How would you rate your experience?'}
                        </p>

                        {/* Rating Buttons */}
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((value, i) => {
                                return (
                                    <motion.button
                                        key={value}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.06 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleRating(value)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${rating === value
                                            ? 'bg-gov-gold text-white shadow-lg shadow-gov-gold/30'
                                            : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 hover:bg-gov-gold/20 hover:text-gov-gold'
                                            }`}
                                    >
                                        {/* 1: Angry/Frown, 2: Slight Frown/Annoyed, 3: Neutral/Meh, 4: Smile, 5: Big Smile/Laugh */}
                                        {value === 1 && <Frown size={22} strokeWidth={1.5} />}
                                        {value === 2 && <Frown size={22} strokeWidth={1.5} style={{ clipPath: 'inset(0 0 40% 0)' }} className="translate-y-1" />}
                                        {value === 3 && <Meh size={22} strokeWidth={1.5} />}
                                        {value === 4 && <Smile size={22} strokeWidth={1.5} style={{ clipPath: 'inset(40% 0 0 0)' }} className="-translate-y-1" />}
                                        {value === 5 && <Smile size={22} strokeWidth={1.5} />}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Labels */}
                        <div className="flex justify-between text-[10px] text-gray-400 dark:text-white/40 px-1 mt-2">
                            <span>{language === 'ar' ? 'ممتاز' : 'Excellent'}</span>
                            <span>{language === 'ar' ? 'ضعيف' : 'Poor'}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserSatisfactionIndicator;
