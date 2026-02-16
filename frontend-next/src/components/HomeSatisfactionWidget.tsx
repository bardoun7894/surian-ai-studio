'use client';

import React, { useState } from 'react';
import { ThumbsUp, X, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';

const HomeSatisfactionWidget = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [rating, setRating] = useState(0);

    const handleRate = async (value: number) => {
        setRating(value);
        // Simulate submission
        // In a real app, this would call an API with a generic tracking number or site-wide rating
        setTimeout(() => {
            setIsSubmitted(true);
            setTimeout(() => setIsOpen(false), 3000); // Auto close after success
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed bottom-32 md:bottom-36 z-[55] transition-all duration-500 ${language === 'ar' ? 'left-6 right-auto' : 'right-6 left-auto'}`}>
            <div className="bg-white dark:bg-dm-surface shadow-lg rounded-2xl p-4 border border-gov-gold/20 w-64 animate-fade-in relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                    <X size={14} />
                </button>

                {!isSubmitted ? (
                    <>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-gov-gold/10 rounded-full text-gov-gold">
                                <ThumbsUp size={14} />
                            </div>
                            <span className="text-xs font-bold text-gov-forest dark:text-white">
                                {language === 'ar' ? 'هل أنت راضٍ عن خدماتنا؟' : 'Are you satisfied with our services?'}
                            </span>
                        </div>
                        <div className="flex justify-between px-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    className="text-gray-300 hover:text-yellow-400 focus:text-yellow-400 transition-colors"
                                >
                                    <Star size={20} className={star <= rating ? "fill-yellow-400 text-yellow-400" : ""} />
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-2">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400 block mb-1">
                            {language === 'ar' ? 'شكراً لك!' : 'Thank you!'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {language === 'ar' ? 'تم تسجيل تقييمك بنجاح' : 'Your rating has been recorded'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeSatisfactionWidget;
