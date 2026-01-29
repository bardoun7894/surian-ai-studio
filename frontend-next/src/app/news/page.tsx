'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Loader2, Sparkles, X } from 'lucide-react';
import { API } from '@/lib/repository';
import { NewsItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { aiService } from '@/lib/aiService';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [summaryModal, setSummaryModal] = useState<{ isOpen: boolean; title: string; summary: string; loading: boolean }>({
    isOpen: false,
    title: '',
    summary: '',
    loading: false
  });

  const handleAISummary = async (item: NewsItem) => {
    setSummaryModal({ isOpen: true, title: item.title, summary: '', loading: true });
    try {
      const summary = await aiService.summarize(item.summary || item.title);
      setSummaryModal(prev => ({ ...prev, summary, loading: false }));
    } catch (e) {
      setSummaryModal(prev => ({ ...prev, summary: 'فشل في إنشاء الملخص. يرجى المحاولة مرة أخرى.', loading: false }));
    }
  };


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

      <main className="flex-grow pt-14 md:pt-16">
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
                  <div
                    key={`${item.id}-${index}`}
                    className="bg-white dark:bg-gov-emerald/5 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-gov-gold/50 shadow-sm hover:shadow-lg transition-all group flex flex-col"
                  >
                    <Link href={`/news/${item.id}`} className="h-48 overflow-hidden relative block">
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
                    </Link>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {item.date}
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); handleAISummary(item); }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gov-gold/10 text-gov-gold hover:bg-gov-gold hover:text-white transition-colors"
                          title="ملخص ذكي"
                        >
                          <Sparkles size={12} />
                          <span className="text-[10px] font-bold">ملخص AI</span>
                        </button>
                      </div>
                      <Link href={`/news/${item.id}`}>
                        <h3 className="font-bold text-gov-charcoal dark:text-white mb-3 leading-snug group-hover:text-gov-gold transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                        {item.summary}
                      </p>
                      <Link href={`/news/${item.id}`} className="text-xs font-bold text-gov-teal dark:text-gov-gold hover:underline flex items-center gap-1 mt-auto">
                        اقرأ التفاصيل
                        <ChevronLeft size={14} />
                      </Link>
                    </div>
                  </div>
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

      {/* AI Summary Modal */}
      {summaryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gov-forest rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-gov-gold">
                <Sparkles size={20} />
                <h3 className="font-bold">ملخص ذكي</h3>
              </div>
              <button
                onClick={() => setSummaryModal({ isOpen: false, title: '', summary: '', loading: false })}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-gov-charcoal dark:text-white mb-4 line-clamp-2">{summaryModal.title}</h4>
              {summaryModal.loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-gov-gold" size={32} />
                </div>
              ) : (
                <div className="bg-gov-beige/50 dark:bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summaryModal.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
