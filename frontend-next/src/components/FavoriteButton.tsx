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

  // Check favorite status on mount
  useEffect(() => {
    if (!isAuthenticated || !contentId || checked) return;

    const checkStatus = async () => {
      try {
        const status = await API.favorites.check([
          { content_type: contentType, content_id: contentId },
        ]);
        const key = `${contentType}_${contentId}`;
        setIsFavorite(status[key] || false);
      } catch (e) {
        // Silently fail - not critical
      } finally {
        setChecked(true);
      }
    };
    checkStatus();
  }, [isAuthenticated, contentType, contentId, checked]);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (loading) return;

      setLoading(true);
      try {
        if (isFavorite) {
          const success = await API.favorites.remove(contentType, contentId);
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
            contentId,
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
      } catch (e) {
        toast.error(
          language === 'ar' ? 'حدث خطأ ما' : 'An error occurred'
        );
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, isFavorite, loading, contentType, contentId, metadata, language]
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
      ? 'bg-red-500/80 text-white hover:bg-red-600/80'
      : 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
    : variant === 'overlay'
      ? 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
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
