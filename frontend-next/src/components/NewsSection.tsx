'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Share2 } from 'lucide-react';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import FavoriteButton from './FavoriteButton';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatRelativeTime } from '@/lib/utils';
import ShareMenu from './ShareMenu';

const NewsSection: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleShare = (item: NewsItem) => {
    const title = language === 'ar'
      ? ((item as any).title_ar || item.title)
      : ((item as any).title_en || item.title);
    const url = `${window.location.origin}/news/${item.id}`;
    setShareData({ title, url });
  };

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const threshold = 10;

    // For RTL, scrollLeft can be 0 or negative depending on browser
    // Use absolute values for reliable detection
    const absScroll = Math.abs(scrollLeft);
    const maxScroll = scrollWidth - clientWidth;

    // "canScrollLeft" = can go backward (toward start)
    // "canScrollRight" = can go forward (toward end)
    if (direction === 'rtl') {
      setCanScrollLeft(absScroll > threshold);
      setCanScrollRight(absScroll < maxScroll - threshold);
    } else {
      setCanScrollLeft(scrollLeft > threshold);
      setCanScrollRight(scrollLeft < maxScroll - threshold);
    }
  }, [direction]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('.news-card')?.clientWidth || 300;
    const amount = (cardWidth + 16) * 2;

    // "left" button = go backward, "right" button = go forward
    // In RTL, forward is negative scrollLeft, backward is positive
    if (direction === 'rtl') {
      const scrollAmount = dir === 'left' ? amount : -amount;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      const scrollAmount = dir === 'left' ? -amount : amount;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    // Update buttons after scroll animation
    setTimeout(() => updateScrollButtons(), 400);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getGroupedByDirectorate();
        const groups = Array.isArray(data) ? data : [];
        // Collect last 3 news from each directorate, up to 12 total
        const collected: NewsItem[] = [];
        for (const group of groups) {
          if (group.news) {
            collected.push(...group.news.slice(0, 3));
          }
          if (collected.length >= 12) break;
        }
        setAllNews(collected.slice(0, 12));
      } catch (e) {
        console.error("Failed to load news", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Initial check
    setTimeout(updateScrollButtons, 100);
    // Update on scroll
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    // Also update after resize
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [allNews, updateScrollButtons]);

  return (
    <>
      <section className="py-8 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-dm-bg dark:to-dm-bg transition-colors" id="news-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Header with prev/next + View All */}
          <div className="flex items-end justify-between mb-4 md:mb-10">
            <div>
              <h2 className="text-xl md:text-3xl font-display font-bold text-gov-charcoal dark:text-gov-teal mb-1 md:mb-2">
                {t('news_section_title')}
              </h2>
              <div className="h-1 w-12 md:w-16 bg-gov-gold rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              {/* Prev/Next arrows */}
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gov-gold/30 flex items-center justify-center text-gov-gold hover:bg-gov-gold hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {direction === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gov-gold/30 flex items-center justify-center text-gov-gold hover:bg-gov-gold hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {direction === 'rtl' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
              <Link
                href="/news"
                className="group relative hidden md:inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-2xl hover:text-white transition-colors duration-500 overflow-hidden shadow-sm hover:shadow-md border border-gov-gold/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
                <div className="absolute inset-0 border border-gov-gold/30 rounded-2xl group-hover:border-transparent transition-colors duration-500 -z-10" />

                <span className="text-[13px] tracking-wide relative z-10 font-bold">{t('view_all')}</span>

                <div className="relative z-10 w-7 h-7 rounded-lg bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
                  <ArrowRight size={14} className={direction === 'rtl' ? 'rotate-180' : ''} />
                </div>
              </Link>
            </div>
          </div>

          {loading ? (
            <SkeletonGrid cards={4} className="grid-cols-2 md:grid-cols-4" />
          ) : allNews.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gov-card/10 rounded-2xl border border-dashed border-gray-300 dark:border-gov-border/25">
              <p className="text-gray-500 dark:text-white/70">{t('no_news_currently')}</p>
            </div>
          ) : (
            /* Horizontal scroll carousel */
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allNews.map((item) => (
                <article
                  key={item.id}
                  className="news-card group flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[calc(25%-12px)] snap-start bg-white dark:bg-dm-surface rounded-xl overflow-hidden border border-gray-100 dark:border-gov-border/15 shadow-gold-sm hover:shadow-gov hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {item.imageUrl && (
                    <div className="h-32 md:h-40 overflow-hidden relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 70vw, (max-width: 768px) 45vw, 25vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50"></div>
                      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/90 dark:bg-gov-forest/90 text-gov-charcoal dark:text-white border-l-2 border-gov-gold text-[10px] font-bold rounded backdrop-blur-md">
                          {language === 'ar' ? item.category : ((item as any).category_en || item.category)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShare(item); }}
                            className="p-1.5 bg-white/80 dark:bg-gov-forest/80 text-gov-charcoal dark:text-white rounded-full backdrop-blur-md hover:bg-gov-gold hover:text-white transition-all"
                          >
                            <Share2 size={12} />
                          </button>
                          <FavoriteButton
                            contentType="news"
                            contentId={item.id}
                            variant="overlay"
                            size={12}
                            className="!p-1.5 !bg-white/80 dark:!bg-gov-forest/80 !backdrop-blur-md"
                            metadata={{
                              title: language === 'ar' ? ((item as any).title_ar || item.title) : ((item as any).title_en || item.title),
                              title_ar: (item as any).title_ar || item.title,
                              title_en: (item as any).title_en || item.title,
                              description: language === 'ar' ? ((item as any).summary_ar || item.summary) : ((item as any).summary_en || item.summary),
                              description_ar: (item as any).summary_ar || item.summary,
                              description_en: (item as any).summary_en || item.summary,
                              image: item.imageUrl || '',
                              url: `/news/${item.id}`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-white/50 mb-2">
                      <Calendar size={10} className="text-gov-gold" />
                      {formatRelativeTime(item.date, language as 'ar' | 'en')}
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-gov-charcoal dark:text-gov-teal mb-2 leading-snug line-clamp-2 group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors">
                      <Link href={`/news/${item.id}`}>
                        {language === 'ar' ? ((item as any).title_ar || item.title) : ((item as any).title_en || item.title)}
                      </Link>
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-white/60 line-clamp-2 mb-3 flex-1">
                      {language === 'ar' ? ((item as any).summary_ar || item.summary) : ((item as any).summary_en || item.summary)}
                    </p>

                    <Link
                      href={`/news/${item.id}`}
                      className="inline-flex items-center text-xs font-bold text-gov-gold mt-auto group/link"
                    >
                      {t('read_more')}
                      <ChevronLeft className={`ms-1 w-3 h-3 ${direction === 'rtl' ? '' : 'rotate-180'}`} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Mobile View All */}
          <div className="mt-4 text-center md:hidden relative z-10 hidden">
            <Link
              href="/news"
              className="group relative inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-xl hover:text-white transition-colors duration-500 overflow-hidden shadow-sm border border-gov-gold/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
              <div className="absolute inset-0 border border-gov-gold/30 rounded-xl group-hover:border-transparent transition-colors duration-500 -z-10" />

              <span className="text-[12px] tracking-wide relative z-10 font-bold">{t('view_all')}</span>

              <div className="relative z-10 w-6 h-6 rounded-md bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
                <ArrowRight size={12} className={direction === 'rtl' ? 'rotate-180' : ''} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <ShareMenu
        isOpen={!!shareData}
        onClose={() => setShareData(null)}
        title={shareData?.title || ''}
        url={shareData?.url || ''}
      />
    </>
  );
};

export default NewsSection;

