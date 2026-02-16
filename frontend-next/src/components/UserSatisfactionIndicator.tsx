'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, X, ThumbsUp, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const UserSatisfactionIndicator: React.FC = () => {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    useEffect(() => {
        // Check if user already rated
        const hasRated = localStorage.getItem('gov_satisfaction_rated');
        if (!hasRated) {
            // Show after 10 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleRating = (value: number) => {
        setRating(value);
        
        // Simulate API call
        setTimeout(() => {
            setHasSubmitted(true);
            setShowThankYou(true);
            localStorage.setItem('gov_satisfaction_rated', 'true');
            
            // Hide after showing thank you
            setTimeout(() => {
                setIsVisible(false);
            }, 3000);
        }, 500);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const getRatingIcon = (value: number) => {
        if (value <= 2) return <Frown size={24} />;
        if (value === 3) return <Meh size={24} />;
        return <Smile size={24} />;
    };

    const getRatingColor = (value: number) => {
        if (value <= 2) return 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
        if (value === 3) return 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
        return 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20';
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`fixed bottom-36 z-[55] pointer-events-auto ${language === 'ar' ? 'left-6' : 'right-6'}`}
                >
                    <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-xl border border-gov-gold/20 dark:border-gov-gold/30 p-4 min-w-[280px]">
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
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 dark:text-white/50 dark:hover:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full p-1 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        {!hasSubmitted ? (
                            <div className="space-y-3">
                                <p className="text-xs text-gray-500 dark:text-white/60 text-center">
                                    {language === 'ar' 
                                        ? 'كيف تقيّم تجربتك في موقعنا؟' 
                                        : 'How would you rate your experience?'}
                                </p>
                                
                                {/* Rating Buttons */}
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <motion.button
                                            key={value}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleRating(value)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                                rating === value 
                                                    ? 'bg-gov-gold text-white shadow-lg shadow-gov-gold/30' 
                                                    : `bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 hover:bg-gov-gold/20 hover:text-gov-gold`
                                            }`}
                                        >
                                            {value <= 2 && <Frown size={20} />}
                                            {value === 3 && <Meh size={20} />}
                                            {value >= 4 && <Smile size={20} />}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Rating Labels */}
                                <div className="flex justify-between text-[10px] text-gray-400 dark:text-white/40 px-1">
                                    <span>{language === 'ar' ? 'ضعيف' : 'Poor'}</span>
                                    <span>{language === 'ar' ? 'ممتاز' : 'Excellent'}</span>
                                </div>
                            </div>
                        ) : (
                            /* Thank You Message */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-2"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2"
                                >
                                    <ThumbsUp size={24} className="text-green-600 dark:text-green-400" />
                                </motion.div>
                                <p className="text-sm font-bold text-gov-forest dark:text-white mb-1">
                                    {language === 'ar' ? 'شكراً لك!' : 'Thank you!'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-white/60">
                                    {language === 'ar' 
                                        ? 'نقدّر تقييمك ونسعى دائماً للتحسين' 
                                        : 'We appreciate your feedback'}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserSatisfactionIndicator;
