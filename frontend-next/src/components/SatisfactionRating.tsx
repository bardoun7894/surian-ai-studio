import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { API } from '@/lib/repository';
import { useLanguage } from '@/contexts/LanguageContext';

interface SatisfactionRatingProps {
    trackingNumber: string;
    onSubmitted?: () => void;
}

const SatisfactionRating: React.FC<SatisfactionRatingProps> = ({ trackingNumber, onSubmitted }) => {
    const { t, language } = useLanguage();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        setError(null);

        // Retry up to 3 times with delay (race condition / CSRF token refresh)
        let lastError: any = null;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const success = await API.complaints.rate(trackingNumber, rating, comment);
                if (success) {
                    setIsSubmitted(true);
                    if (onSubmitted) onSubmitted();
                    return;
                }
                lastError = new Error('API returned failure');
            } catch (err) {
                lastError = err;
            }
            // Wait before retry (CSRF cookie might need refresh)
            if (attempt < 2) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        // All retries failed
        setError(t('rating_error'));
        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-50 dark:bg-gov-forest/20 p-4 md:p-6 rounded-xl border border-green-100 dark:border-gov-forest/30 text-center animate-fade-in">
                <div className="flex justify-center mb-2 md:mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-gov-forest/30 rounded-full flex items-center justify-center text-green-600 dark:text-gov-teal">
                        <CheckCircle size={24} className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-green-800 dark:text-white mb-1 md:mb-2">{t('rating_thank_you')}</h3>
                <p className="text-green-700 dark:text-white/70 text-xs md:text-sm">{t('rating_appreciation')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gov-card/10 border border-gov-gold/30 rounded-xl p-4 md:p-6 shadow-gold-sm mt-4 md:mt-6 animate-fade-in">
            <h3 className="text-base md:text-lg font-bold text-gov-charcoal dark:text-white mb-2 md:mb-4 text-center">
                {t('rating_title')}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-white/70 text-center mb-4 md:mb-6">
                {t('rating_instruction')}
            </p>

            <div className="flex justify-center gap-1.5 md:gap-2 mb-4 md:mb-6" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="transition-transform hover:scale-110 focus:outline-none"
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => setRating(star)}
                    >
                        <Star
                            size={32}
                            className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${star <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-white/70'
                                }`}
                        />
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div>
                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 dark:text-white/70 mb-1.5 md:mb-2 mr-1">
                        {t('rating_comments_label')}
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t('rating_comments_placeholder')}
                        rows={3}
                        className="w-full p-2.5 md:p-3 rounded-lg bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold text-xs md:text-sm outline-none resize-none"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-[10px] md:text-xs text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="w-full py-2 md:py-2.5 rounded-lg bg-gov-forest dark:bg-gov-button text-white font-bold text-xs md:text-sm hover:bg-gov-teal dark:hover:bg-gov-gold transition-colors flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {isSubmitting ? t('rating_sending') : t('rating_submit')}
                    {!isSubmitting && <Send size={16} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${language === 'ar' ? '-scale-x-100' : ''}`} />}
                </button>
            </form>
        </div>
    );
};

export default SatisfactionRating;
