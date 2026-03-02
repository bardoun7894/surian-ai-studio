'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Newspaper, Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { SkeletonGrid, SkeletonCard } from '@/components/SkeletonLoader';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { Announcement } from '@/lib/repository';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface DirectorateNewsGridProps {
  directorateId: string;
  directorateName: string;
}

const DirectorateNewsGrid: React.FC<DirectorateNewsGridProps> = ({ directorateId, directorateName }) => {
  const { language: locale, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'announcements'>('news');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newsData, announcementsData] = await Promise.all([
          API.directorates.getNewsByDirectorate(directorateId),
          API.announcements.getByDirectorate(directorateId).catch(() => []),
        ]);
        setNews(newsData);
        setAnnouncements(announcementsData);
      } catch (e) {
        console.error("Failed to load directorate content", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [directorateId]);

  const loc = (obj: any, field: string): string => {
    const val = obj?.[field];
    if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
      // Check for explicit key presence rather than truthiness to handle empty strings
      if (locale in val && val[locale] !== undefined && val[locale] !== null && val[locale] !== '') {
        return val[locale];
      }
      return val['ar'] || '';
    }
    const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
    const en = obj?.[`${field}_en`] || '';
    // In English mode: prefer en, then fall back to ar only if en is empty
    return locale === 'en' && en ? en : ar;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-6 w-48 md:h-8 md:w-64 bg-gray-200 dark:bg-dm-surface rounded-lg animate-pulse mb-6 md:mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Hero Item Skeleton */}
          <div className="lg:col-span-8 lg:row-span-2 min-h-[300px] md:min-h-[400px]">
            <SkeletonCard className="h-full" />
          </div>
          {/* Side Items Skeleton */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    );
  }

  const hasContent = news.length > 0 || announcements.length > 0;

  if (!hasContent) {
    return (
      <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-8 md:py-12 bg-white dark:bg-dm-surface rounded-xl md:rounded-2xl border border-gray-100 dark:border-gov-border/15">
          <Newspaper className="mx-auto mb-3 md:mb-4 text-gray-300 dark:text-white/30 w-10 h-10 md:w-12 md:h-12" />
          <h3 className="text-lg md:text-xl font-bold text-gray-600 dark:text-white/70 mb-1.5 md:mb-2">
            {locale === 'ar' ? 'لا يوجد محتوى متاح' : 'No content available'}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 dark:text-white/50 px-4">
            {locale === 'ar'
              ? `لا توجد أخبار أو إعلانات خاصة بـ ${directorateName} حالياً`
              : `No news or announcements available for ${directorateName} at the moment`
            }
          </p>
        </div>
      </section>
    );
  }

  const activeItems = activeTab === 'news' ? news : announcements;
  const heroItem = activeItems[0];
  const gridItems = activeItems.slice(1, 4);

  return (
    <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gov-forest dark:text-gov-gold mb-1 md:mb-2">
            {locale === 'ar' ? `أخبار وإعلانات ${directorateName}` : `${directorateName} News & Announcements`}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-white/60">
            {locale === 'ar'
              ? 'آخر الأخبار والإعلانات الخاصة بهذه الإدارة'
              : 'Latest news and announcements for this directorate'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 md:gap-2 bg-white dark:bg-dm-surface p-1 md:p-1.5 rounded-lg md:rounded-xl border border-gray-100 dark:border-gov-border/15 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap ${activeTab === 'news'
                ? 'bg-gov-forest text-white dark:bg-gov-brand'
                : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
          >
            <Newspaper className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {locale === 'ar' ? 'الأخبار' : 'News'}
            {news.length > 0 && (
              <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full bg-white/20 text-[10px] md:text-xs">
                {news.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap ${activeTab === 'announcements'
                ? 'bg-gov-forest text-white dark:bg-gov-brand'
                : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
          >
            <Megaphone className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {locale === 'ar' ? 'الإعلانات' : 'Announcements'}
            {announcements.length > 0 && (
              <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full bg-white/20 text-[10px] md:text-xs">
                {announcements.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-white dark:bg-dm-surface rounded-xl md:rounded-2xl border border-gray-100 dark:border-gov-border/15">
          <p className="text-xs md:text-sm text-gray-400 dark:text-white/50">
            {activeTab === 'news'
              ? (locale === 'ar' ? 'لا توجد أخبار حالياً' : 'No news available')
              : (locale === 'ar' ? 'لا توجد إعلانات حالياً' : 'No announcements available')
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Hero Item */}
          {heroItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 lg:row-span-2 relative group rounded-xl md:rounded-2xl overflow-hidden min-h-[300px] md:min-h-[400px] border border-gray-100 dark:border-white/10 shadow-lg md:shadow-xl transition-all duration-500 hover:shadow-xl md:hover:shadow-2xl"
            >
              <div className="absolute inset-0">
                {(heroItem as any).imageUrl && (
                  <Image
                    src={(heroItem as any).imageUrl}
                    alt={loc(heroItem, 'title')}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gov-forest via-gov-forest/70 to-transparent opacity-95"></div>
              </div>

              <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end items-start z-10">
                <div className="space-y-2.5 md:space-y-4 max-w-3xl">
                  <div className="flex items-center gap-2 md:gap-3 text-gov-beige/80">
                    <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-gov-gold text-gov-forest text-[10px] md:text-xs font-bold">
                      {activeTab === 'news'
                        ? (locale === 'ar' ? 'خبر' : 'News')
                        : (locale === 'ar' ? 'إعلان' : 'Announcement')
                      }
                    </span>
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gov-gold/30"></span>
                    <span className="flex items-center gap-1 text-xs md:text-sm">
                      <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {formatDate(heroItem.date)}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl lg:text-4xl font-display font-bold text-white leading-tight">
                    {loc(heroItem, 'title')}
                  </h3>

                  <p className="text-xs md:text-sm lg:text-lg text-gov-beige/90 leading-relaxed line-clamp-3">
                    {loc(heroItem, 'summary') || loc(heroItem, 'description')}
                  </p>

                  <Link
                    href={`/${activeTab === 'news' ? 'news' : 'announcements'}/${heroItem.id}`}
                    className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-gov-gold text-gov-forest text-[11px] md:text-base font-bold hover:bg-white transition-all group/btn shadow-md md:shadow-lg shadow-gov-gold/20 mt-2 md:mt-4"
                  >
                    {locale === 'ar' ? 'قراءة المزيد' : 'Read More'}
                    <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover/btn:-translate-x-1 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Side Items */}
          <div className="lg:col-span-4 flex flex-col gap-3 md:gap-6">
            {gridItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/${activeTab === 'news' ? 'news' : 'announcements'}/${item.id}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-dm-surface rounded-lg md:rounded-xl overflow-hidden border border-gray-100 dark:border-gov-border/15 shadow-[0_2px_4px_rgba(0,0,0,0.02)] md:shadow-sm hover:shadow-[3px_3px_8px_rgba(185,167,121,0.5)] md:hover:shadow-[5px_5px_10px_#b9a779] transition-all duration-300">
                    {(item as any).imageUrl && (
                      <div className="relative h-28 md:h-40 overflow-hidden">
                        <Image
                          src={(item as any).imageUrl}
                          alt={loc(item, 'title')}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-3 md:p-4">
                      <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-400 dark:text-white/50 mb-1.5 md:mb-2">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {formatDate(item.date)}
                      </div>
                      <h4 className="font-bold text-xs md:text-base text-gray-800 dark:text-white group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors line-clamp-2 leading-snug">
                        {loc(item, 'title')}
                      </h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* View All Link */}
      {activeItems.length > 4 && (
        <div className="mt-6 md:mt-8 text-center">
          <Link
            href={`/${activeTab === 'news' ? 'news' : 'announcements'}?directorate=${directorateId}`}
            className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full border border-gov-forest dark:border-gov-gold text-gov-forest dark:text-gov-gold text-xs md:text-sm font-bold hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-all"
          >
            {locale === 'ar' ? 'عرض الكل' : 'View All'}
            <ArrowRight className="w-3.5 h-3.5 md:w-[18px] md:h-[18px] rtl:rotate-180" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default DirectorateNewsGrid;
