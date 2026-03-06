'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, Newspaper, ArrowLeft, ArrowRight } from 'lucide-react';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

const CentralDirectorateNews: React.FC = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getOfficialNews();
        setNews(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (e) {
        console.error('Failed to load central news', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return language === 'ar'
      ? date.toLocaleDateString('ar-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const loc = (item: any, field: string): string => {
    const ar = item?.[`${field}_ar`] || item?.[field] || '';
    const en = item?.[`${field}_en`] || ar;
    return language === 'ar' ? ar : en;
  };

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-dm-bg relative overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-gray-200 dark:bg-dm-surface rounded-full mx-auto mb-6 animate-pulse" />
            <div className="h-12 w-96 bg-gray-200 dark:bg-dm-surface rounded mx-auto mb-4 animate-pulse" />
          </div>
          <SkeletonGrid cards={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-dm-bg border-t border-gray-100 dark:border-gov-border/15 relative overflow-hidden scroll-mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header - matching Announcements pattern */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gov-gold/10 dark:bg-gov-emerald/20 rounded-full mb-6">
            <Newspaper className="text-gov-gold" size={20} />
            <span className="text-gov-gold font-bold text-sm tracking-wide">
              {t('cdn_title')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gov-forest dark:text-gov-teal mb-6">
            {t('cdn_subtitle')}
          </h2>
          <p className="text-gov-stone/60 dark:text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
            {language === 'ar'
              ? 'تابع آخر الأخبار والمستجدات الرسمية من وزارة الاقتصاد والصناعة'
              : 'Follow the latest official news and updates from the Ministry of Economy and Industry'}
          </p>
        </div>

        {/* Uniform Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="block"
            >
              <article className="bg-gov-forest/5 dark:bg-dm-surface border border-gov-forest/10 dark:border-gov-border/15 rounded-[1.5rem] overflow-hidden hover:shadow-2xl hover:shadow-gov-gold/10 transition-all duration-500 group cursor-pointer hover:-translate-y-2 hover:border-gov-gold/40 h-full flex flex-col">
                {/* Image */}
                {item.imageUrl && (
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={item.imageUrl}
                      alt={loc(item, 'title')}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {item.category && (
                      <span className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-3 py-1 bg-gov-forest text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/20">
                        {language === 'ar' ? item.category : ((item as any).category_en || item.category)}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-gov-gold/60 font-medium text-xs mb-4">
                    <Calendar size={12} />
                    <span>{formatDate(item.date)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-display font-bold text-gov-forest dark:text-gov-teal mb-3 group-hover:text-gov-teal dark:group-hover:text-white transition-colors line-clamp-2 leading-snug">
                    {loc(item, 'title')}
                  </h3>

                  {/* Summary */}
                  <p className="text-gov-stone/60 dark:text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {loc(item, 'summary')}
                  </p>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-gov-gold dark:text-gov-gold font-bold text-[10px] uppercase tracking-[0.15em] group-hover:gap-3 transition-all pt-3 border-t border-gov-gold/10 dark:border-white/5">
                    <span>{t('read_more')}</span>
                    <ArrowIcon size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-gov-forest/20 dark:hover:shadow-gov-gold/20 transition-all duration-300 group hover:-translate-y-1 active:translate-y-0"
          >
            <span>{t('view_all')}</span>
            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CentralDirectorateNews;
