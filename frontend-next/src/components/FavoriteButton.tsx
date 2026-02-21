'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/lib/repository';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  contentType: 'news' | 'announcement' | 'service' | 'law';
  contentId: string;
  metadata?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
  /** Size of the heart icon in px */
  size?: number;
  /** Additional CSS classes for the button */
  className?: string;
  /** Compact variant for card overlays */
  variant?: 'default' | 'compact' | 'overlay';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  contentType,
  contentId,
  metadata,
  size = 18,
  className = '',
  variant = 'default',
}) => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const getCheckTypes = useCallback(() => {
    if (contentType === 'service') return ['service', 'services'];
    return [contentType];
  }, [contentType]);

  // Reset checked state when content changes
  useEffect(() => {
    setChecked(false);
    setIsFavorite(false);
  }, [contentType, contentId]);

  // Check favorite status on mount and when content changes
  useEffect(() => {
    if (!isAuthenticated || !contentId || checked) return;

    const checkStatus = async () => {
      try {
        const id = String(contentId);
        const checkTypes = getCheckTypes();
        const status = await API.favorites.check(
          checkTypes.map((type) => ({ content_type: type, content_id: id }))
        );
        const isMatched = checkTypes.some((type) => Boolean(status[`${type}_${id}`]));
        setIsFavorite(isMatched);
      } catch {
        // Silently fail - not critical
      } finally {
        setChecked(true);
      }
    };
    checkStatus();
  }, [isAuthenticated, contentType, contentId, checked, getCheckTypes]);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error(
          language === 'ar'
            ? 'يجب تسجيل الدخول أولاً'
            : 'You must be logged in to add favorites'
        );
        router.push('/login');
        return;
      }

      if (loading) return;

      setLoading(true);
      const id = String(contentId);
      try {
        if (isFavorite) {
          const removeTypes = getCheckTypes();
          let success = false;
          for (const type of removeTypes) {
            const removed = await API.favorites.remove(type, id);
            success = success || removed;
          }
          if (success) {
            setIsFavorite(false);
            toast.success(
              language === 'ar'
                ? 'تمت الإزالة من المفضلة'
                : 'Removed from favorites'
            );
          }
        } else {
          const success = await API.favorites.add(
            contentType,
            id,
            metadata
          );
          if (success) {
            setIsFavorite(true);
            toast.success(
              language === 'ar'
                ? 'تمت الإضافة للمفضلة'
                : 'Added to favorites'
            );
          }
        }
      } catch {
        toast.error(
          language === 'ar' ? 'حدث خطأ ما' : 'An error occurred'
        );
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, isFavorite, loading, contentType, contentId, metadata, language, router, getCheckTypes]
  );

  const baseClasses = {
    default:
      'p-2 rounded-full transition-colors',
    compact:
      'p-1.5 rounded-full transition-colors',
    overlay:
      'p-2 rounded-full backdrop-blur-sm transition-all',
  };

  const stateClasses = isFavorite
    ? variant === 'overlay'
      ? 'bg-red-500/90 text-white hover:bg-red-600/90 shadow-lg shadow-red-500/30 ring-2 ring-white/50'
      : 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
    : variant === 'overlay'
      ? 'bg-white/90 dark:bg-black/60 text-gov-charcoal dark:text-white/90 hover:bg-white hover:text-red-500 dark:hover:bg-black/80 dark:hover:text-red-400 shadow-md ring-1 ring-black/10 dark:ring-white/20 backdrop-blur-sm'
      : 'text-gray-400 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-white/70';

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${baseClasses[variant]} ${stateClasses} ${loading ? 'opacity-60 cursor-wait' : ''} ${className}`}
      title={
        isFavorite
          ? language === 'ar'
            ? 'إزالة من المفضلة'
            : 'Remove from Favorites'
          : language === 'ar'
            ? 'إضافة للمفضلة'
            : 'Add to Favorites'
      }
      aria-label={
        isFavorite
          ? language === 'ar'
            ? 'إزالة من المفضلة'
            : 'Remove from Favorites'
          : language === 'ar'
            ? 'إضافة للمفضلة'
            : 'Add to Favorites'
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFavorite ? 'filled' : 'outline'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <Heart
            size={size}
            className={isFavorite ? 'fill-current' : ''}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default FavoriteButton;
