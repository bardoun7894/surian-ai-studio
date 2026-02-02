'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { Calendar, ChevronLeft, Loader2, ArrowRight, Landmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// Map directorate IDs to translation keys for department-specific titles
// Only these 3 main directorates are shown in the homepage news section
const DIRECTORATE_TRANSLATION_KEYS: Record<string, string> = {
  'd1': 'news_industry',
  'd2': 'news_commerce',
  'd3': 'news_internal_trade',
};

const FEATURED_DIRECTORATE_IDS = new Set(Object.keys(DIRECTORATE_TRANSLATION_KEYS));

const NewsSection: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [groupedNews, setGroupedNews] = useState<{ directorate: { id: string, name: string, name_ar?: string, name_en?: string, icon: string }, news: NewsItem[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getGroupedByDirectorate();
        setGroupedNews(Array.isArray(data) ? data : []);
        setLoading(false);

        // Trigger Animation after render
        setTimeout(() => {
          if (!containerRef.current) return;
          const directorateSections = containerRef.current.querySelectorAll('.news-directorate-section');

          directorateSections.forEach((section) => {
            const header = section.querySelector('.directorate-header');
            const cards = section.querySelectorAll('.news-card');
            const showMore = section.querySelector('.show-more-btn');

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            });

            if (header) {
              tl.fromTo(header,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
              );
            }
            if (cards.length > 0) {
              tl.fromTo(cards,
                { y: 50, opacity: 0, scale: 0.95 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: "power3.out"
                },
                "-=0.4"
              );
            }
            if (showMore) {
              tl.fromTo(showMore,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4 },
                "-=0.4"
              );
            }
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
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gov-brand/10 dark:to-gov-forest transition-colors" id="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-display font-bold text-gov-charcoal dark:text-gov-gold mb-3">
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
            {groupedNews.filter((group) => FEATURED_DIRECTORATE_IDS.has(group.directorate.id)).map((group) => (
              <div key={group.directorate.id} className="news-directorate-section">
                <div className="directorate-header flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gov-gold/10 border border-gray-100 dark:border-gov-gold/20 rounded-xl text-gov-emerald dark:text-gov-gold shadow-sm group-hover:shadow-md transition-all">
                    <Landmark size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gov-charcoal dark:text-gov-gold border-b-2 border-transparent hover:border-gov-gold/50 transition-colors pb-1 cursor-default">
                    {DIRECTORATE_TRANSLATION_KEYS[group.directorate.id]
                      ? t(DIRECTORATE_TRANSLATION_KEYS[group.directorate.id])
                      : (language === 'ar'
                        ? (group.directorate.name_ar || group.directorate.name)
                        : (group.directorate.name_en || group.directorate.name))
                    }
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {group.news.slice(0, 3).map((item) => (
                    <article
                      key={item.id}
                      className="news-card group relative bg-white dark:bg-gov-emeraldStatic rounded-2xl overflow-hidden border border-gray-100 dark:border-gov-gold/10 shadow-sm hover:shadow-xl hover:shadow-gov-indigo/10 dark:hover:shadow-none hover:-translate-y-2 transition-all duration-500 ease-out h-full flex flex-col"
                    >
                      {item.imageUrl && (
                        <div className="h-56 overflow-hidden relative">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4 z-10">
                            <span className="px-3 py-1 bg-white/90 dark:bg-gov-forest/90 text-gov-charcoal dark:text-white border-l-4 border-gov-gold text-xs font-bold rounded shadow-sm backdrop-blur-md">
                              {language === 'ar' ? item.category : ((item as any).category_en || item.category)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col relative">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
                          <Calendar size={14} className="text-gov-gold" />
                          {item.date}
                        </div>

                        <h3 className="text-xl font-bold text-gov-charcoal dark:text-gov-gold mb-3 leading-snug group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors">
                          <Link href={`/news/${item.id}`} className="hover:underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-current transition-all">
                            {language === 'ar'
                              ? ((item as any).title_ar || item.title)
                              : ((item as any).title_en || item.title)
                            }
                          </Link>
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {language === 'ar'
                            ? ((item as any).summary_ar || item.summary)
                            : ((item as any).summary_en || item.summary)
                          }
                        </p>

                        <Link
                          href={`/news/${item.id}`}
                          className="inline-flex items-center text-sm font-bold text-gov-emerald dark:text-gov-brand mt-auto group/link"
                        >
                          <span className="relative overflow-hidden pb-1">
                            {t('read_more')}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gov-emerald dark:bg-gov-brand transform -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300"></span>
                          </span>
                          <ChevronLeft className={`ml-1 w-4 h-4 transform transition-transform duration-300 ${direction === 'rtl' ? 'rotate-0 group-hover/link:-translate-x-1' : 'rotate-180 group-hover/link:translate-x-1'}`} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {group.news.length > 3 && (
                  <div className="mt-8 text-center show-more-btn">
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-gov-emerald dark:border-gov-gold text-gov-emerald dark:text-gov-gold rounded-full font-bold text-sm hover:bg-gov-emerald hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-all duration-300"
                    >
                      {t('show_more')}
                      <ChevronLeft size={16} className={`transform ${direction === 'rtl' ? '' : 'rotate-180'}`} />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {groupedNews.filter((group) => FEATURED_DIRECTORATE_IDS.has(group.directorate.id)).length === 0 && (
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
