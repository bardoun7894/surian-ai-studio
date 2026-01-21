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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getOfficialNews();
        setNews(data);
        setLoading(false);

        // Trigger Animation after render
        setTimeout(() => {
          if (!containerRef.current) return;
          const cards = containerRef.current.querySelectorAll('.news-card');
          gsap.fromTo(cards,
            { y: 50, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
              }
            }
          );
        }, 100);

      } catch (e) {
        console.error("Failed to load news", e);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-gov-forest border-t border-gray-100 dark:border-gov-gold/10 transition-colors" id="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">المركز الإعلامي</h2>
            <p className="text-gray-500 dark:text-gray-400">آخر الأخبار والمراسيم والقرارات الحكومية</p>
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
          <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
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
