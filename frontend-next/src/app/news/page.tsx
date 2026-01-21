'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getOfficialNews();
        // Duplicate data to simulate archive
        setNews([...data, ...data, ...data]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = filter === 'all'
    ? news
    : news.filter(item => item.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="min-h-screen bg-gray-50 dark:bg-gov-forest animate-fade-in pt-12 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 dark:border-white/10 pb-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">الأرشيف الإعلامي</h1>
                <p className="text-gray-500 dark:text-gray-400">تصفح كافة الأخبار والقرارات والتقارير الصحفية الصادرة.</p>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0 bg-white dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/10 overflow-x-auto pb-2 md:pb-0">
                {['الكل', 'سياسة', 'اقتصاد', 'خدمات', 'مراسيم'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat === 'الكل' ? 'all' : cat)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-colors whitespace-nowrap ${(filter === 'all' && cat === 'الكل') || filter === cat
                      ? 'bg-gov-charcoal text-white dark:bg-gov-gold dark:text-gov-forest'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gov-teal" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredNews.map((item, index) => (
                  <Link
                    key={`${item.id}-${index}`}
                    href={`/news/${item.id}`}
                    className="bg-white dark:bg-gov-emerald/5 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-gov-gold/50 shadow-sm hover:shadow-lg transition-all group flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <Image
                        src={item.imageUrl || `https://source.unsplash.com/random/800x600?sig=${index}`}
                        alt={item.title}
                        fill
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-gov-charcoal/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <Calendar size={14} />
                        {item.date}
                      </div>
                      <h3 className="font-bold text-gov-charcoal dark:text-white mb-3 leading-snug group-hover:text-gov-gold transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                        {item.summary}
                      </p>
                      <div className="text-xs font-bold text-gov-teal dark:text-gov-gold hover:underline flex items-center gap-1 mt-auto">
                        اقرأ التفاصيل
                        <ChevronLeft size={14} />
                      </div>
                    </div>
                  </Link>
                ))}

              </div>
            )}

            <div className="mt-12 flex justify-center">
              <button className="px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                تحميل المزيد
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
