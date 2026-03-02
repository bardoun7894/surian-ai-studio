'use client';

import React, { useEffect, useState } from 'react';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { Calendar, ArrowRight, ArrowLeft, Share2 } from 'lucide-react';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import FavoriteButton from './FavoriteButton';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import ShareMenu from './ShareMenu';

const NewsSection: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);

  const handleShare = (item: NewsItem) => {
    const title = language === 'ar'
      ? ((item as any).title_ar || item.title)
      : ((item as any).title_en || item.title);
    const url = `${window.location.origin}/news/${item.id}`;
    setShareData({ title, url });
  };

  const loc = (item: any, field: string): string => {
    const ar = item?.[`${field}_ar`] || item?.[field] || '';
    const en = item?.[`${field}_en`] || ar;
    return language === 'ar' ? ar : en;
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

  // Split into featured (first) and secondary (next 3)
  const featured = allNews[0] || null;
  const secondary = allNews.slice(1, 4);

  return (
    <>
      <section className="py-8 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-dm-bg dark:to-dm-bg transition-colors" id="news-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with View All */}
          <div className="flex items-end justify-between mb-6 md:mb-10">
            <div>
              <h2 className="text-xl md:text-3xl font-display font-bold text-gov-charcoal dark:text-gov-teal mb-1 md:mb-2">
                {t('news_section_title')}
              </h2>
              <div className="h-1 w-12 md:w-16 bg-gov-gold rounded-full"></div>
            </div>
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

          {loading ? (
            <SkeletonGrid cards={4} className="grid-cols-1 md:grid-cols-4" />
          ) : allNews.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gov-card/10 rounded-2xl border border-dashed border-gray-300 dark:border-gov-border/25">
              <p className="text-gray-500 dark:text-white/70">{t('no_news_currently')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">

              {/* ─── Featured / Main News Card ─── */}
              {featured && (
                <article className="lg:col-span-7 group relative bg-white dark:bg-dm-surface rounded-2xl overflow-hidden border border-gray-100 dark:border-gov-border/15 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                  {/* Featured Image */}
                  <div className="relative h-52 sm:h-64 md:h-80 overflow-hidden">
                    {featured.imageUrl ? (
                      <Image
                        src={featured.imageUrl}
                        alt={loc(featured, 'title')}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gov-forest/20 to-gov-teal/20 dark:from-gov-forest/40 dark:to-gov-teal/40" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge + actions on image */}
                    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-gov-gold text-white text-[10px] md:text-xs font-bold rounded-lg shadow-lg">
                          {t('featured_news')}
                        </span>
                        <span className="px-2 py-0.5 bg-white/90 dark:bg-gov-forest/90 text-gov-charcoal dark:text-white border-l-2 border-gov-gold text-[10px] font-bold rounded backdrop-blur-md">
                          {language === 'ar' ? featured.category : ((featured as any).category_en || featured.category)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShare(featured); }}
                          className="p-1.5 bg-white/80 dark:bg-gov-forest/80 text-gov-charcoal dark:text-white rounded-full backdrop-blur-md hover:bg-gov-gold hover:text-white transition-all"
                        >
                          <Share2 size={14} />
                        </button>
                        <FavoriteButton
                          contentType="news"
                          contentId={featured.id}
                          variant="overlay"
                          size={14}
                          className="!p-1.5 !bg-white/80 dark:!bg-gov-forest/80 !backdrop-blur-md"
                          metadata={{
                            title: loc(featured, 'title'),
                            description: loc(featured, 'summary'),
                            image: featured.imageUrl || '',
                            url: `/news/${featured.id}`
                          }}
                        />
                      </div>
                    </div>

                    {/* Date on image bottom */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-xs text-white/90">
                      <Calendar size={12} className="text-gov-gold" />
                      {formatDate(featured.date, language)}
                    </div>
                  </div>

                  {/* Featured content */}
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg md:text-2xl font-bold text-gov-charcoal dark:text-gov-teal mb-2 md:mb-3 leading-snug line-clamp-2 group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors">
                      <Link href={`/news/${featured.id}`}>
                        {loc(featured, 'title')}
                      </Link>
                    </h3>

                    <p className="text-sm md:text-base text-gray-500 dark:text-white/60 line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {loc(featured, 'summary')}
                    </p>

                    <Link
                      href={`/news/${featured.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-gov-gold hover:text-gov-forest dark:hover:text-white transition-colors group/link mt-auto"
                    >
                      {t('read_more')}
                      {direction === 'rtl'
                        ? <ArrowLeft size={16} className="group-hover/link:-translate-x-1 transition-transform" />
                        : <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      }
                    </Link>
                  </div>
                </article>
              )}

              {/* ─── Secondary News Cards (3 smaller) ─── */}
              <div className="lg:col-span-5 flex flex-col gap-4 md:gap-5">
                {secondary.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-row bg-white dark:bg-dm-surface rounded-xl overflow-hidden border border-gray-100 dark:border-gov-border/15 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-28 sm:w-32 md:w-36 flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={loc(item, 'title')}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="144px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gov-forest/10 to-gov-teal/10 dark:from-gov-forest/30 dark:to-gov-teal/30" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
                      {/* Actions overlay */}
                      <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShare(item); }}
                          className="p-1 bg-white/80 dark:bg-gov-forest/80 text-gov-charcoal dark:text-white rounded-full backdrop-blur-md hover:bg-gov-gold hover:text-white transition-all"
                        >
                          <Share2 size={10} />
                        </button>
                        <FavoriteButton
                          contentType="news"
                          contentId={item.id}
                          variant="overlay"
                          size={10}
                          className="!p-1 !bg-white/80 dark:!bg-gov-forest/80 !backdrop-blur-md"
                          metadata={{
                            title: loc(item, 'title'),
                            description: loc(item, 'summary'),
                            image: item.imageUrl || '',
                            url: `/news/${item.id}`
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4 flex-1 flex flex-col min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-1.5 py-0.5 bg-gov-forest/5 dark:bg-gov-forest/20 text-gov-charcoal dark:text-white text-[9px] md:text-[10px] font-bold rounded border-l-2 border-gov-gold">
                          {language === 'ar' ? item.category : ((item as any).category_en || item.category)}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-white/50">
                          <Calendar size={9} className="text-gov-gold" />
                          {formatRelativeTime(item.date, language as 'ar' | 'en')}
                        </div>
                      </div>

                      <h3 className="text-[13px] md:text-sm font-bold text-gov-charcoal dark:text-gov-teal leading-snug line-clamp-2 group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors mb-1.5">
                        <Link href={`/news/${item.id}`}>
                          {loc(item, 'title')}
                        </Link>
                      </h3>

                      <p className="text-[11px] md:text-xs text-gray-400 dark:text-white/50 line-clamp-2 flex-1">
                        {loc(item, 'summary')}
                      </p>
                    </div>
                  </article>
                ))}

                {/* View all button inside secondary column on mobile */}
                <Link
                  href="/news"
                  className="group relative flex md:hidden items-center justify-center gap-2 px-4 py-2.5 bg-white/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-xl hover:text-white transition-colors duration-500 overflow-hidden shadow-sm border border-gov-gold/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  <div className="absolute inset-0 border border-gov-gold/30 rounded-xl group-hover:border-transparent transition-colors duration-500 -z-10" />

                  <span className="text-[12px] tracking-wide relative z-10 font-bold">{t('view_all')}</span>

                  <div className="relative z-10 w-6 h-6 rounded-md bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10">
                    <ArrowRight size={12} className={direction === 'rtl' ? 'rotate-180' : ''} />
                  </div>
                </Link>
              </div>
            </div>
          )}
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
