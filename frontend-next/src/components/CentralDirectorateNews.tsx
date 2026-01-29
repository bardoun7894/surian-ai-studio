'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

const CentralDirectorateNews: React.FC = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getOfficialNews();
        setNews(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (e) {
        console.error('Failed to load central news', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gov-forest transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center py-12">
          <Loader2 className="animate-spin text-gov-teal" size={32} />
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  const featured = news[0];
  const secondary = news.slice(1, 3);

  return (
    <section className="py-16 bg-white dark:bg-gov-forest border-t border-gray-100 dark:border-gov-gold/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
              {t('cdn_title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{t('cdn_subtitle')}</p>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-gov-emerald dark:text-gov-gold font-bold hover:text-gov-emeraldLight dark:hover:text-white transition-colors"
          >
            {t('view_archive')}
            <ChevronLeft size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured large card */}
          <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden min-h-[360px] border border-gray-100 dark:border-white/10 hover:shadow-lg transition-all">
            {featured.imageUrl && (
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gov-forest via-gov-forest/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              {featured.category && (
                <span className="px-3 py-1 bg-gov-emerald/90 text-white text-xs font-bold rounded-full mb-3 inline-block">
                  {featured.category}
                </span>
              )}
              <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                <Calendar size={14} />
                {featured.date}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 leading-snug">{featured.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2">{featured.summary}</p>
            </div>
          </div>

          {/* Two smaller cards */}
          <div className="flex flex-col gap-6">
            {secondary.map((item) => (
              <article
                key={item.id}
                className="flex-1 group bg-gov-beige dark:bg-white/5 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-gov-gold/30 hover:shadow-lg transition-all flex flex-col"
              >
                {item.imageUrl && (
                  <div className="h-36 overflow-hidden relative">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar size={14} />
                    {item.date}
                  </div>
                  <h3 className="font-bold text-gov-charcoal dark:text-white text-sm mb-2 leading-snug group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <Link href="/news" className="inline-flex items-center text-xs font-bold text-gov-emerald dark:text-gov-gold hover:underline mt-auto">
                    {t('read_more')}
                    <ChevronLeft size={14} className="mr-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CentralDirectorateNews;
