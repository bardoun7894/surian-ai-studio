'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const NewsSection: React.FC = () => {
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

          sections.forEach((section, index) => {
            gsap.fromTo(section.querySelectorAll('.news-card'),
              { y: 50, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
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

  const DirectorateIcon = ({ icon }: { icon: string }) => {
    // Determine icon based on string or fallback
    // For simplicity, returning a generic icon or we could map them
    // Assuming icon is a lucide icon name or similar, but for now we won't dynamically import specific icons to avoid complexity
    // Just use a generic building icon if dynamic map is too complex, or check if we can reuse lucide imports
    // The original code didn't use dynamic icons much.
    // Let's us a simple default icon for the header
    return <div className="text-gov-emerald dark:text-gov-gold opacity-80" />;
  };

  return (
    <section className="py-20 bg-white dark:bg-gov-forest border-t border-gray-100 dark:border-gov-gold/10 transition-colors scroll-mt-24" id="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">المركز الإعلامي</h2>
            <p className="text-gray-500 dark:text-gray-400">آخر الأخبار والمراسيم حسب المديريات</p>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-gov-emerald dark:text-gov-gold font-bold hover:text-gov-emeraldLight dark:hover:text-white transition-colors"
          >
            عرض الأرشيف
            <ChevronLeft size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-gov-teal" size={32} />
          </div>
        ) : (
          <div ref={containerRef} className="space-y-16">
            {groupedNews.map((group) => (
              <div key={group.directorate.id} className="news-directorate-section">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                  <div className="p-2 bg-gov-beige/50 dark:bg-white/5 rounded-lg text-gov-emerald dark:text-gov-gold">
                    {/* Placeholder for icon, assuming we can simply use the directorate name for now */}
                    <span className="text-xl">🏛️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                    {group.directorate.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.news.map((item) => (
                    <article key={item.id} className="news-card group bg-gov-beige dark:bg-white/5 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-gov-gold/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                      {item.imageUrl && (
                        <div className="h-48 overflow-hidden relative">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 bg-gov-emerald/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <Calendar size={14} />
                          {item.date}
                        </div>
                        <h3 className="font-bold text-gov-charcoal dark:text-white text-lg mb-3 leading-snug group-hover:text-gov-emerald dark:group-hover:text-gov-gold transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                          {item.summary}
                        </p>
                        <Link href="/news" className="inline-flex items-center text-xs font-bold text-gov-emerald dark:text-gov-gold hover:underline mt-auto">
                          اقرأ المزيد
                          <ChevronLeft size={14} className="mr-1" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {groupedNews.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                لا توجد أخبار حالياً.
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/news"
            className="inline-block px-6 py-3 border border-gov-emerald dark:border-gov-gold text-gov-emerald dark:text-gov-gold rounded-lg font-bold w-full"
          >
            عرض الأرشيف الكامل
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
