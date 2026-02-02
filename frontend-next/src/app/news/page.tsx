'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, Loader2, Sparkles, X, Clock, Search, Landmark, Building2, LayoutGrid } from 'lucide-react';
import { API } from '@/lib/repository';
import { NewsItem, Directorate } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { aiService } from '@/lib/aiService';
import { useLanguage } from '@/contexts/LanguageContext';

const MONTHS_AR = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function NewsPage() {
  const { language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirFilter, setDirFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
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
      setSummaryModal(prev => ({ ...prev, summary: language === 'ar' ? 'فشل في إنشاء الملخص. يرجى المحاولة مرة أخرى.' : 'Failed to generate summary. Please try again.', loading: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, dirsData] = await Promise.all([
          API.news.getOfficialNews(),
          API.directorates.getFeatured()
        ]);
        setNews(newsData);
        setDirectorates(dirsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const directorateFilters = useMemo(() => {
    const filters: { key: string; label_ar: string; label_en: string; icon: typeof LayoutGrid }[] = [
      { key: 'all', label_ar: 'جميع الأخبار', label_en: 'All News', icon: LayoutGrid },
      { key: 'central', label_ar: 'أخبار الإدارة المركزية', label_en: 'Central Administration News', icon: Landmark },
    ];
    directorates.forEach(d => {
      const nameAr = (d as any).name_ar || (typeof d.name === 'object' ? (d.name as any).ar : d.name);
      const nameEn = (d as any).name_en || (typeof d.name === 'object' ? (d.name as any).en : d.name);
      filters.push({
        key: String(d.id),
        label_ar: nameAr,
        label_en: nameEn,
        icon: Building2,
      });
    });
    return filters;
  }, [directorates]);

  const allFiltered = useMemo(() => {
    let result = [...news];

    // Directorate filter
    if (dirFilter !== 'all') {
      if (dirFilter === 'central') {
        result = result.filter(item => !(item as any).directorate_id && !(item as any).directorate_name);
      } else {
        result = result.filter(item => String((item as any).directorate_id) === dirFilter);
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        (item.title || '').toLowerCase().includes(q) ||
        ((item as any).title_ar || '').toLowerCase().includes(q) ||
        ((item as any).title_en || '').toLowerCase().includes(q) ||
        (item.summary || '').toLowerCase().includes(q)
      );
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      switch (timeFilter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoff;
      });
    }

    // Month/Year filter
    if (selectedMonth !== null || selectedYear !== null) {
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        if (selectedYear !== null && itemDate.getFullYear() !== selectedYear) return false;
        if (selectedMonth !== null && itemDate.getMonth() !== selectedMonth) return false;
        return true;
      });
    }

    return result;
  }, [news, dirFilter, searchQuery, timeFilter, selectedMonth, selectedYear]);

  const filteredNews = allFiltered.slice(0, visibleCount);
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-black">
      <Navbar />

      <main className="flex-grow pt-14 md:pt-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-gov-forest via-gov-emerald to-gov-teal dark:from-gov-forest dark:via-gov-forest dark:to-gov-emerald/30 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {isAr ? 'المحتوى الإعلامي' : 'Media Content'}
            </h1>
            <p className="text-white/70 mb-6">
              {isAr ? 'تصفح كافة الأخبار والقرارات والتقارير الصحفية الصادرة.' : 'Browse all news, decisions, and press reports.'}
            </p>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Directorate Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {directorateFilters.map(df => {
              const Icon = df.icon;
              const isActive = dirFilter === df.key;
              return (
                <button
                  key={df.key}
                  onClick={() => { setDirFilter(df.key); setVisibleCount(12); }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                    ? 'bg-gov-forest text-white dark:bg-gov-gold dark:text-gov-forest shadow-lg shadow-gov-forest/20 dark:shadow-gov-gold/20'
                    : 'bg-white dark:bg-white/5 text-gov-charcoal dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gov-forest/30 dark:hover:border-gov-gold/30 hover:shadow-md'
                    }`}
                >
                  <Icon size={16} className={isActive ? '' : 'text-gov-teal dark:text-gov-gold'} />
                  <span>{isAr ? df.label_ar : df.label_en}</span>
                </button>
              );
            })}
          </div>

          {/* Time Filter + Count */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-gov-forest dark:text-gov-gold">
                <Clock size={16} />
                <span className="text-sm font-bold">{isAr ? 'الفترة' : 'Period'}</span>
              </div>
              <div className="w-px h-5 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

              {/* Month Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowMonthDropdown(!showMonthDropdown); setShowYearDropdown(false); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedMonth !== null
                    ? 'bg-gov-forest text-white dark:bg-gov-gold dark:text-gov-forest shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                >
                  {selectedMonth !== null
                    ? (isAr ? MONTHS_AR[selectedMonth] : MONTHS_EN[selectedMonth])
                    : (isAr ? 'الشهر' : 'Month')}
                  <Calendar size={12} />
                </button>
                {showMonthDropdown && (
                  <div className="absolute top-full mt-1 bg-white dark:bg-gov-charcoal rounded-xl shadow-xl border border-gray-200 dark:border-white/10 py-1 w-44 z-50 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedMonth(null); setShowMonthDropdown(false); setVisibleCount(12); }}
                      className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                    >
                      {isAr ? 'الكل' : 'All'}
                    </button>
                    {(isAr ? MONTHS_AR : MONTHS_EN).map((m, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedMonth(i); setTimeFilter('all'); setShowMonthDropdown(false); setVisibleCount(12); }}
                        className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${selectedMonth === i ? 'bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold' : 'text-gov-charcoal dark:text-white'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowYearDropdown(!showYearDropdown); setShowMonthDropdown(false); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedYear !== null
                    ? 'bg-gov-forest text-white dark:bg-gov-gold dark:text-gov-forest shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                >
                  {selectedYear !== null ? selectedYear : (isAr ? 'السنة' : 'Year')}
                  <Calendar size={12} />
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full mt-1 bg-white dark:bg-gov-charcoal rounded-xl shadow-xl border border-gray-200 dark:border-white/10 py-1 w-32 z-50">
                    <button
                      onClick={() => { setSelectedYear(null); setShowYearDropdown(false); setVisibleCount(12); }}
                      className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                    >
                      {isAr ? 'الكل' : 'All'}
                    </button>
                    {YEARS.map(y => (
                      <button
                        key={y}
                        onClick={() => { setSelectedYear(y); setTimeFilter('all'); setShowYearDropdown(false); setVisibleCount(12); }}
                        className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${selectedYear === y ? 'bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold' : 'text-gov-charcoal dark:text-white'}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear filters */}
              {(selectedMonth !== null || selectedYear !== null) && (
                <button
                  onClick={() => { setSelectedMonth(null); setSelectedYear(null); setVisibleCount(12); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-gov-cherry hover:bg-gov-cherry/10 transition-all flex items-center gap-1"
                >
                  <X size={12} />
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>
            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              {allFiltered.length} {isAr ? 'خبر' : 'articles'}
            </span>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-gov-teal" size={40} />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
              <Search size={40} className="mx-auto text-gray-300 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-2">
                {isAr ? 'لا توجد نتائج' : 'No Results'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {isAr ? 'لم يتم العثور على أخبار مطابقة للبحث أو الفلتر المحدد.' : 'No news found matching your search or filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredNews.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white dark:bg-gov-emeraldStatic rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <Link href={`/news/${item.id}`} className="h-48 overflow-hidden relative block">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gov-forest/10 to-gov-teal/10 dark:from-gov-gold/5 dark:to-gov-forest/10 flex items-center justify-center">
                        <Landmark size={40} className="text-gov-teal/30 dark:text-gov-gold/30" />
                      </div>
                    )}
                    {(item as any).directorate_name && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <span className="px-2.5 py-1 bg-black/60 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm">
                          {isAr ? (item as any).directorate_name : ((item as any).directorate_name_en || (item as any).directorate_name)}
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gov-gold" />
                        {item.date}
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); handleAISummary(item); }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gov-gold/10 text-gov-gold hover:bg-gov-gold hover:text-white transition-colors"
                        title={isAr ? 'ملخص ذكي' : 'AI Summary'}
                      >
                        <Sparkles size={12} />
                        <span className="text-[10px] font-bold">{isAr ? 'ملخص AI' : 'AI'}</span>
                      </button>
                    </div>
                    <Link href={`/news/${item.id}`}>
                      <h3 className="font-bold text-gov-charcoal dark:text-gov-gold mb-3 leading-snug group-hover:text-gov-teal dark:group-hover:text-white transition-colors line-clamp-2">
                        {isAr ? ((item as any).title_ar || item.title) : ((item as any).title_en || item.title)}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                      {isAr ? ((item as any).summary_ar || item.summary) : ((item as any).summary_en || item.summary)}
                    </p>
                    <Link href={`/news/${item.id}`} className="text-xs font-bold text-gov-teal dark:text-gov-gold hover:underline flex items-center gap-1 mt-auto">
                      {isAr ? 'اقرأ التفاصيل' : 'Read More'}
                      <ChevronLeft size={14} className={language === 'ar' ? '' : 'rotate-180'} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {visibleCount < allFiltered.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              >
                {isAr ? 'تحميل المزيد' : 'Load More'}
              </button>
            </div>
          )}
          {/* FAQ Section */}
          <div className="mt-16 bg-white dark:bg-gov-emeraldStatic rounded-2xl p-8 border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6">
              {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr ? 'كيف أبقى على اطلاع بآخر الأخبار؟' : 'How do I stay updated with latest news?'}
                  <Calendar size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isAr ? 'يمكنك متابعة أحدث الأخبار من خلال هذه الصفحة أو الاشتراك في النشرة البريدية للوزارة.' : 'You can follow the latest news through this page or subscribe to the ministry newsletter.'}
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr ? 'هل يمكنني تصفية الأخبار حسب المديرية؟' : 'Can I filter news by directorate?'}
                  <Calendar size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isAr ? 'نعم، استخدم أزرار الفلترة أعلاه لتصفية الأخبار حسب المديرية أو الفترة الزمنية.' : 'Yes, use the filter buttons above to filter news by directorate or time period.'}
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr ? 'ما هو الملخص الذكي؟' : 'What is AI Summary?'}
                  <Calendar size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isAr ? 'خدمة تعتمد على الذكاء الاصطناعي لتلخيص محتوى الأخبار الطويلة بشكل مختصر ومفيد.' : 'An AI-powered service that summarizes long news content into a concise and useful format.'}
                </p>
              </details>
            </div>
            <div className="mt-4 text-center">
              <Link href="/faq" className="text-gov-teal dark:text-gov-gold font-bold text-sm hover:underline">
                {isAr ? 'عرض جميع الأسئلة الشائعة ←' : '→ View all FAQs'}
              </Link>
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
                <h3 className="font-bold">{isAr ? 'ملخص ذكي' : 'AI Summary'}</h3>
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
