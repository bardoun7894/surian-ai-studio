'use client';

import React, { useEffect, useState } from 'react';
import { API } from '@/lib/repository';
import { useLanguage } from '../contexts/LanguageContext';
import { SkeletonText } from '@/components/SkeletonLoader';

interface BreakingNewsItem {
  title_ar: string;
  title_en: string;
}

interface NewsTickerProps {
  onNewsLoaded?: (hasNews: boolean) => void;
  className?: string;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ onNewsLoaded, className = '' }) => {
  const { t, language } = useLanguage();
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const rawData = await API.news.getBreakingNews();
        const data = Array.isArray(rawData) ? rawData : [];
        const normalizedData = data.map((item: string | BreakingNewsItem) => {
          if (typeof item === 'string') {
            return { title_ar: item, title_en: item };
          }
          return item;
        });
        setBreakingNews(normalizedData);
        if (onNewsLoaded) onNewsLoaded(normalizedData.length > 0);
      } catch (e) {
        console.error(e);
        if (onNewsLoaded) onNewsLoaded(false);
      } finally {
        setLoading(false);
      }
    };
    fetchBreaking();
  }, [onNewsLoaded]);

  const getTitle = (item: BreakingNewsItem) => {
    return language === 'en' ? (item.title_en || item.title_ar) : item.title_ar;
  };

  if (loading) {
    return (
      <div className={`bg-gov-beige/90 dark:bg-gov-charcoal/90 backdrop-blur-md border-t border-gov-gold/30 dark:border-gov-gold/20 relative overflow-hidden h-8 md:h-10 flex items-center ${className}`}>
        {/* Label */}
        <div className="flex-shrink-0 bg-gov-gold px-3 md:px-4 h-full z-20 flex items-center font-bold shadow-lg">
          <span className="ml-1.5 md:ml-2 rtl:mr-1.5 md:rtl:mr-2 rtl:ml-0 w-1.5 md:w-2 h-1.5 md:h-2 bg-gov-cherry rounded-full animate-pulse"></span>
          <span className="text-xs md:text-sm font-display text-gov-forest">{t('news_breaking')}</span>
        </div>
        {/* Skeleton content */}
        <div className="flex-1 overflow-hidden h-full px-3 md:px-4">
          <div className="flex items-center h-full gap-3 md:gap-4">
            <SkeletonText lines={1} className="w-48 md:w-64" />
            <SkeletonText lines={1} className="w-32 md:w-48" />
            <SkeletonText lines={1} className="w-40 md:w-56" />
          </div>
        </div>
      </div>
    );
  }

  if (breakingNews.length === 0) return null;

  if (breakingNews.length === 0) return null;

  // Triple the items to ensure it feels "longer" and has plenty of content to scroll through
  const items = [...breakingNews, ...breakingNews, ...breakingNews];
  // Increase multiplier from 2.8 to 6.0 to make it significantly slower
  const animationDuration = Math.max(30, items.length * 6.0);

  return (
    <div className={`bg-gov-beige/90 dark:bg-gov-charcoal/90 backdrop-blur-md text-gov-forest dark:text-white border-t border-gov-gold/30 dark:border-gov-gold/20 relative overflow-hidden h-8 md:h-10 flex items-center ${className}`}>
      {/* Label */}
      <div className="flex-shrink-0 bg-gov-gold px-3 md:px-4 h-full z-20 flex items-center font-bold shadow-lg">
        <span className="ml-1.5 md:ml-2 rtl:mr-1.5 md:rtl:mr-2 rtl:ml-0 w-1.5 md:w-2 h-1.5 md:h-2 bg-gov-cherry rounded-full animate-pulse"></span>
        <span className="text-xs md:text-sm font-display text-gov-forest">{t('news_breaking')}</span>
      </div>

      {/* Scrolling content - Force LTR layout for consistency with absolute positioning/negative margins if any */}
      <div className="flex-1 overflow-hidden h-full" dir="ltr">
        <div
          className={`${language === 'ar' ? 'animate-ticker-rtl' : 'animate-ticker-ltr'} h-full w-max min-w-full flex items-center whitespace-nowrap gap-8 md:gap-12 px-3 md:px-4 will-change-transform`}
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {items.map((news, idx) => (
            <span
              key={idx}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              className="shrink-0 flex items-center gap-3 md:gap-4 text-xs md:text-base text-gov-forest dark:text-white"
            >
              <span className="font-medium">{getTitle(news)}</span>
              <span className="text-gov-gold text-[10px] md:text-sm">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
