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
      return val[locale] || val['ar'] || '';
    }
    const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
    const en = obj?.[`${field}_en`] || ar;
    return locale === 'ar' ? ar : en;
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
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-gray-200 dark:bg-dm-surface rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hero Item Skeleton */}
          <div className="lg:col-span-8 lg:row-span-2 min-h-[400px]">
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
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-12 bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15">
          <Newspaper className="mx-auto mb-4 text-gray-300 dark:text-white/30" size={48} />
          <h3 className="text-xl font-bold text-gray-600 dark:text-white/70 mb-2">
            {locale === 'ar' ? 'لا يوجد محتوى متاح' : 'No content available'}
          </h3>
          <p className="text-gray-400 dark:text-white/50">
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
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gov-forest dark:text-gov-gold mb-2">
            {locale === 'ar' ? `أخبار وإعلانات ${directorateName}` : `${directorateName} News & Announcements`}
          </h2>
          <p className="text-gray-500 dark:text-white/60">
            {locale === 'ar' 
              ? 'آخر الأخبار والإعلانات الخاصة بهذه الإدارة'
              : 'Latest news and announcements for this directorate'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-white dark:bg-dm-surface p-1.5 rounded-xl border border-gray-100 dark:border-gov-border/15">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'news'
                ? 'bg-gov-forest text-white dark:bg-gov-brand'
                : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <Newspaper size={16} />
            {locale === 'ar' ? 'الأخبار' : 'News'}
            {news.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                {news.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'announcements'
                ? 'bg-gov-forest text-white dark:bg-gov-brand'
                : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <Megaphone size={16} />
            {locale === 'ar' ? 'الإعلانات' : 'Announcements'}
            {announcements.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                {announcements.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15">
          <p className="text-gray-400 dark:text-white/50">
            {activeTab === 'news'
              ? (locale === 'ar' ? 'لا توجد أخبار حالياً' : 'No news available')
              : (locale === 'ar' ? 'لا توجد إعلانات حالياً' : 'No announcements available')
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hero Item */}
          {heroItem && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 lg:row-span-2 relative group rounded-2xl overflow-hidden min-h-[400px] border border-gray-100 dark:border-white/10 shadow-xl transition-all duration-500 hover:shadow-2xl"
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

              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start z-10">
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center gap-3 text-gov-beige/80">
                    <span className="px-3 py-1 rounded-full bg-gov-gold text-gov-forest text-xs font-bold">
                      {activeTab === 'news' 
                        ? (locale === 'ar' ? 'خبر' : 'News')
                        : (locale === 'ar' ? 'إعلان' : 'Announcement')
                      }
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-gold/30"></span>
                    <span className="flex items-center gap-1 text-sm">
                      <Calendar size={14} />
                      {formatDate(heroItem.date)}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight">
                    {loc(heroItem, 'title')}
                  </h3>

                  <p className="text-lg text-gov-beige/90 leading-relaxed line-clamp-3">
                    {loc(heroItem, 'summary') || loc(heroItem, 'description')}
                  </p>

                  <Link 
                    href={`/${activeTab === 'news' ? 'news' : 'announcements'}/${heroItem.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gov-gold text-gov-forest font-bold hover:bg-white transition-all group/btn shadow-lg shadow-gov-gold/20 mt-4"
                  >
                    {locale === 'ar' ? 'قراءة المزيد' : 'Read More'}
                    <ArrowLeft size={18} className="transition-transform group-hover/btn:-translate-x-1 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Side Items */}
          <div className="lg:col-span-4 flex flex-col gap-6">
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
                  <div className="bg-white dark:bg-dm-surface rounded-xl overflow-hidden border border-gray-100 dark:border-gov-border/15 shadow-sm hover:shadow-[5px_5px_10px_#b9a779] transition-all duration-300">
                    {(item as any).imageUrl && (
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={(item as any).imageUrl}
                          alt={loc(item, 'title')}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/50 mb-2">
                        <Calendar size={12} />
                        {formatDate(item.date)}
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors line-clamp-2">
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
        <div className="mt-8 text-center">
          <Link
            href={`/${activeTab === 'news' ? 'news' : 'announcements'}?directorate=${directorateId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gov-forest dark:border-gov-gold text-gov-forest dark:text-gov-gold font-bold hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-all"
          >
            {locale === 'ar' ? 'عرض الكل' : 'View All'}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default DirectorateNewsGrid;
