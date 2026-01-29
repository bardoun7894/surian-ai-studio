'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { Calendar, ChevronLeft, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const NewsSection: React.FC = () => {
  const { t, direction } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [groupedNews, setGroupedNews] = useState<{ directorate: { id: string, name: string, icon: string }, news: NewsItem[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getGroupedByDirectorate();
        setGroupedNews(data);
        setLoading(false);

        // Trigger Animation after render
        setTimeout(() => {
          if (!containerRef.current) return;
          const sections = containerRef.current.querySelectorAll('.news-directorate-section');

          sections.forEach((section) => {
            gsap.fromTo(section.querySelectorAll('.news-card'),
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                }
              }
            );
          });
        }, 100);

      } catch (e) {
        console.error("Failed to load news", e);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gov-forest dark:to-gov-forest/95 transition-colors" id="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-display font-bold text-gov-charcoal dark:text-white mb-3">
              {t('news_section_title')}
            </h2>
            <div className="h-1.5 w-20 bg-gov-gold rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">{t('news_section_subtitle')}</p>
          </div>
          <Link
            href="/news"
            className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-gov-gold/30 rounded-full text-gov-emerald dark:text-gov-gold font-bold shadow-sm hover:shadow-md hover:border-gov-gold transition-all duration-300"
          >
            {t('view_archive')}
            <ArrowRight size={20} className={`transform transition-transform duration-300 ${direction === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gov-gold" size={40} />
          </div>
        ) : (
          <div ref={containerRef} className="space-y-24">
            {groupedNews.map((group) => (
              <div key={group.directorate.id} className="news-directorate-section">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-gov-indigo/10 dark:bg-gov-gold/10 rounded-xl text-2xl shadow-inner">
                    🏛️
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gov-charcoal dark:text-white border-b-2 border-transparent hover:border-gov-gold/50 transition-colors pb-1 cursor-default">
                    {group.directorate.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.news.slice(0, 3).map((item) => (
                    <article
                      key={item.id}
                      className="news-card group relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-gov-indigo/5 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-500 h-full flex flex-col"
                    >
                      {item.imageUrl && (
                        <div className="h-56 overflow-hidden relative">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-gov-gold/90 text-gov-charcoal text-xs font-bold rounded-lg shadow-sm backdrop-blur-md">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col relative">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
                          <Calendar size={14} className="text-gov-gold" />
                          {item.date}
                        </div>

                        <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-3 leading-snug group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors">
                          <Link href={`/news/${item.id}`} className="hover:underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-current transition-all">
                            {item.title}
                          </Link>
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {item.summary}
                        </p>

                        <Link
                          href={`/news/${item.id}`}
                          className="inline-flex items-center text-sm font-bold text-gov-emerald dark:text-gov-gold mt-auto group/link"
                        >
                          <span className="border-b-2 border-transparent group-hover/link:border-current transition-all duration-300 pb-0.5">
                            {t('read_more')}
                          </span>
                          <ChevronLeft className={`ml-1 w-4 h-4 transform transition-transform duration-300 ${direction === 'rtl' ? 'rotate-0 group-hover/link:-translate-x-1' : 'rotate-180 group-hover/link:translate-x-1'}`} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {groupedNews.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('no_news_currently')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
