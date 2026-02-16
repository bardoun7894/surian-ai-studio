'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { API } from '@/lib/repository';

interface SuggestionRatingProps {
  trackingNumber: string;
  language: 'ar' | 'en';
  onClose?: () => void;
  isReadOnly?: boolean;
  existingRating?: number;
}

const SuggestionRating: React.FC<SuggestionRatingProps> = ({
  trackingNumber,
  language,
  onClose,
  isReadOnly = false,
  existingRating,
}) => {
  const [rating, setRating] = useState<number>(existingRating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);

  const isAr = language === 'ar';

  const texts = {
    title: isAr ? 'قيّم تجربتك' : 'Rate Your Experience',
    subtitle: isAr 
      ? 'ساعدنا في تحسين خدمة المقترحات' 
      : 'Help us improve our suggestion service',
    placeholder: isAr 
      ? 'أخبرنا المزيد عن تجربتك (اختياري)...' 
      : 'Tell us more about your experience (optional)...',
    submit: isAr ? 'إرسال التقييم' : 'Submit Rating',
    submitting: isAr ? 'جاري الإرسال...' : 'Submitting...',
    successTitle: isAr ? 'شكراً لتقييمك!' : 'Thank You for Your Feedback!',
    successMessage: isAr 
      ? 'نقدّر وقتك في تقييم خدمتنا' 
      : 'We appreciate you taking the time to rate our service',
    helpful: isAr ? 'هل كان الرد مفيداً؟' : 'Was the response helpful?',
    yes: isAr ? 'نعم' : 'Yes',
    no: isAr ? 'لا' : 'No',
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(isAr ? 'يرجى اختيار تقييم' : 'Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.suggestions.submitRating({
        tracking_number: trackingNumber,
        rating,
        comment,
        feedback_type: feedbackType || undefined,
      });
      
      setIsSubmitted(true);
      toast.success(texts.successTitle);
      
      // Close after 3 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (err) {
      toast.error(isAr ? 'حدث خطأ أثناء الإرسال' : 'Error submitting rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 text-center border border-green-200 dark:border-green-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
          {texts.successTitle}
        </h3>
        <p className="text-green-600 dark:text-green-400">
          {texts.successMessage}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dm-surface rounded-2xl p-6 shadow-lg border border-gov-gold/20"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-2">
          {texts.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-white/60">
          {texts.subtitle}
        </p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => !isReadOnly && setRating(star)}
            onMouseEnter={() => !isReadOnly && setHoverRating(star)}
            onMouseLeave={() => !isReadOnly && setHoverRating(0)}
            disabled={isReadOnly}
            className={`p-2 transition-colors ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <Star
              size={32}
              className={`transition-all duration-300 ${
                star <= (hoverRating || rating)
                  ? 'fill-gov-gold text-gov-gold drop-shadow-lg'
                  : 'fill-transparent text-gray-300 dark:text-gray-600'
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Rating Label */}
      <div className="text-center mb-6">
        <span className="text-2xl font-bold text-gov-gold">
          {rating > 0 ? `${rating}/5` : '-'}
        </span>
        {rating > 0 && (
          <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
            {rating === 5 ? (isAr ? 'ممتاز!' : 'Excellent!') :
             rating === 4 ? (isAr ? 'جيد جداً' : 'Very Good') :
             rating === 3 ? (isAr ? 'جيد' : 'Good') :
             rating === 2 ? (isAr ? 'مقبول' : 'Fair') :
             (isAr ? 'يحتاج تحسين' : 'Needs Improvement')}
          </p>
        )}
      </div>

      {/* Helpful Feedback (only for tracking results with response) */}
      {!isReadOnly && (
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 dark:text-white/80 mb-3 text-center">
            {texts.helpful}
          </p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFeedbackType('positive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                feedbackType === 'positive'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp size={18} />
              {texts.yes}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFeedbackType('negative')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                feedbackType === 'negative'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-2 border-red-500'
                  : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60 hover:bg-gray-200'
              }`}
            >
              <ThumbsDown size={18} />
              {texts.no}
            </motion.button>
          </div>
        </div>
      )}

      {/* Comment */}
      {!isReadOnly && (
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={texts.placeholder}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-gray-50 dark:bg-gov-card/10 text-sm resize-none focus:ring-2 focus:ring-gov-gold focus:border-transparent outline-none transition-all"
          />
        </div>
      )}

      {/* Submit Button */}
      {!isReadOnly && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full py-3 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-xl hover:bg-gov-teal dark:hover:bg-gov-gold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {texts.submitting}
            </>
          ) : (
            <>
              <Send size={20} />
              {texts.submit}
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default SuggestionRating;
