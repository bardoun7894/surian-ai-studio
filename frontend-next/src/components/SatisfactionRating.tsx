import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { API } from '@/lib/repository';
import { useLanguage } from '@/contexts/LanguageContext';

interface SatisfactionRatingProps {
    trackingNumber: string;
    onSubmitted?: () => void;
}

const SatisfactionRating: React.FC<SatisfactionRatingProps> = ({ trackingNumber, onSubmitted }) => {
    const { t } = useLanguage();
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

        try {
            const success = await API.complaints.rate(trackingNumber, rating, comment);
            if (success) {
                setIsSubmitted(true);
                if (onSubmitted) onSubmitted();
            } else {
                setError(t('rating_error'));
            }
        } catch (err) {
            setError(t('rating_connection_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800/20 text-center animate-fade-in">
                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckCircle size={24} />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-2">{t('rating_thank_you')}</h3>
                <p className="text-green-700 dark:text-green-400 text-sm">{t('rating_appreciation')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-white/5 border border-gov-gold/30 rounded-xl p-6 shadow-sm mt-6 animate-fade-in">
            <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-4 text-center">
                {t('rating_title')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                {t('rating_instruction')}
            </p>

            <div className="flex justify-center gap-2 mb-6" onMouseLeave={() => setHoverRating(0)}>
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
                            className={`transition-colors ${star <= (hoverRating || rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-400'
                                }`}
                        />
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 mr-1">
                        {t('rating_comments_label')}
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t('rating_comments_placeholder')}
                        rows={3}
                        className="w-full p-3 rounded-lg bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-gov-gold/20 text-gov-charcoal dark:text-white focus:border-gov-forest dark:focus:border-gov-gold text-sm outline-none resize-none"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-xs text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold text-sm hover:bg-gov-teal dark:hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {isSubmitting ? t('rating_sending') : t('rating_submit')}
                    {!isSubmitting && <Send size={16} className="rtl:rotate-180" />}
                </button>
            </form>
        </div>
    );
};

export default SatisfactionRating;
