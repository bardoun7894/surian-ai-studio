'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, ChevronLeft, Loader2, Sparkles, X, Clock, Search, Landmark, Building2, LayoutGrid, ArrowLeft, Star } from 'lucide-react';
import { API } from '@/lib/repository';
import { NewsItem, Directorate, PaginatedResponse } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
import Link from 'next/link';
import { aiService } from '@/lib/aiService';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatRelativeTime } from '@/lib/utils';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import ContentFilter from '@/components/ContentFilter';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gov-beige dark:bg-dm-bg" />}>
      <NewsPageContent />
    </Suspense>
  );
}

interface DirectorateNewsGroup {
  directorate: { id: string; name: string; name_ar?: string; name_en?: string; icon: string };
  news: NewsItem[];
}

function NewsPageContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const isAr = language === 'ar';

  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [initialFeaturedNews, setInitialFeaturedNews] = useState<NewsItem | null>(null);
  const [groupedNews, setGroupedNews] = useState<DirectorateNewsGroup[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [activeView, setActiveView] = useState<string>(() => searchParams.get('directorate') || 'organized');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  // Pagination state for flat views
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(12);

  // AI summary modal
  const [summaryModal, setSummaryModal] = useState<{ isOpen: boolean; title: string; summary: string; loading: boolean }>({
    isOpen: false, title: '', summary: '', loading: false
  });

  const handleAISummary = async (item: NewsItem) => {
    const MIN_SUMMARY_TEXT_LENGTH = 20;
    const MAX_SUMMARY_INPUT_LENGTH = 4500;

    const normalizeText = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const summarizeInput = (value: string) => normalizeText(value).slice(0, MAX_SUMMARY_INPUT_LENGTH);
    const localFallbackSummary = (value: string) => {
      const excerpt = normalizeText(value).slice(0, 280);
      if (!excerpt) {
        return t('news_no_enough_content');
      }
      return `${t('news_ai_unavailable')} ${excerpt}${excerpt.length >= 280 ? '...' : ''}`;
    };

    const displayTitle = isAr ? ((item as any).title_ar || item.title) : ((item as any).title_en || item.title);
    setSummaryModal({ isOpen: true, title: displayTitle, summary: '', loading: true });

    let textToSummarize = '';
    let fallbackText = '';

    try {
      // Fetch full article content for better summarization
      try {
        const fullArticle = await API.news.getById(String(item.id));
        if (fullArticle) {
          textToSummarize = isAr
            ? ((fullArticle as any).content_ar || (fullArticle as any).summary_ar || fullArticle.summary || '')
            : ((fullArticle as any).content_en || (fullArticle as any).summary_en || fullArticle.summary || '');
        }
      } catch {
        // Fallback to list-level data
      }

      fallbackText = isAr
        ? ((item as any).summary_ar || item.summary || item.title)
        : ((item as any).summary_en || item.summary || item.title);

      // Fallback if full article fetch failed or had no content
      if (!textToSummarize || textToSummarize.length < MIN_SUMMARY_TEXT_LENGTH) {
        textToSummarize = fallbackText;
      }

      // If text is still too short for summarization, show it directly
      if (!textToSummarize || textToSummarize.length < MIN_SUMMARY_TEXT_LENGTH) {
        setSummaryModal(prev => ({
          ...prev,
          summary: textToSummarize || (isAr ? 'لا يوجد محتوى كافٍ لإنشاء ملخص.' : 'Not enough content to generate a summary.'),
          loading: false
        }));
        return;
      }

      const cleanText = summarizeInput(textToSummarize);
      let summary = '';

      try {
        summary = await aiService.summarize(cleanText, language, 120);
      } catch {
        const retryText = summarizeInput(fallbackText || textToSummarize);
        if (retryText.length >= MIN_SUMMARY_TEXT_LENGTH && retryText !== cleanText) {
          summary = await aiService.summarize(retryText, language, 100);
        } else {
          throw new Error('Summarization failed after retry');
        }
      }

      setSummaryModal(prev => ({ ...prev, summary, loading: false }));
    } catch (err) {
      console.error('AI Summary error:', err);
      setSummaryModal(prev => ({
        ...prev,
        summary: localFallbackSummary(fallbackText || textToSummarize),
        loading: false
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, dirsData, grouped] = await Promise.all([
          API.news.getOfficialNews(),
          API.directorates.getFeatured(),
          API.news.getGroupedByDirectorate()
        ]);
        // allNews from getOfficialNews is used for organized view (featured hero, "All News" section)
        // Also store the initial featured news so it persists across view switches
        setAllNews(newsData);
        // Compute and persist the featured news from the initial full dataset
        if (newsData.length > 0) {
          const sorted = [...newsData].sort((a: NewsItem, b: NewsItem) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const urgent = sorted.find((n: NewsItem) => n.isUrgent);
          setInitialFeaturedNews(urgent || sorted[0]);
        }
        setDirectorates(dirsData);
        setGroupedNews(grouped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Paginated fetch for flat views (non-organized)
  useEffect(() => {
    if (activeView === 'organized') return;

    const fetchPaginated = async () => {
      setLoading(true);
      try {
        const directorateId = (activeView !== 'all' && activeView !== 'central') ? activeView : undefined;
        const response = await API.news.getPaginated(currentPage, perPage, directorateId);
        setAllNews(response.data);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
        setTotalItems(response.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPaginated();
  }, [activeView, currentPage, perPage]);

  // Filter grouped news to only show featured/main departments (not every individual directorate)
  const filteredGroupedNews = useMemo(() => {
    if (directorates.length === 0) return groupedNews;
    const featuredIds = new Set(directorates.map(d => String(d.id)));
    return groupedNews.filter(group => featuredIds.has(String(group.directorate.id)));
  }, [groupedNews, directorates]);

  // View tabs - use only main departments (featured directorates), not all individual directorates
  const viewTabs = useMemo(() => {
    const tabs = [
      { key: 'organized', label: t('news_organized_view'), icon: LayoutGrid },
      { key: 'all', label: t('news_all'), icon: LayoutGrid },
      { key: 'central', label: t('news_central_admin'), icon: Landmark },
    ];
    // Only show the main departments (featured directorates) as tabs
    filteredGroupedNews.forEach(group => {
      const nameAr = group.directorate.name_ar || group.directorate.name;
      const nameEn = group.directorate.name_en || group.directorate.name;
      tabs.push({ key: String(group.directorate.id), label: isAr ? nameAr : nameEn, icon: Building2 });
    });
    return tabs;
  }, [filteredGroupedNews, language, isAr, t]);

  // Filtered flat news (for non-organized views)
  const filteredFlatNews = useMemo(() => {
    let result = [...allNews];

    // View filter
    if (activeView !== 'organized' && activeView !== 'all') {
      if (activeView === 'central') {
        result = result.filter(item => !(item as any).directorate_id && !(item as any).directorate_name);
      } else {
        result = result.filter(item => String((item as any).directorate_id) === activeView);
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

    // Month/Year filter
    if (selectedMonth !== null || selectedYear !== null) {
      result = result.filter(item => {
        const d = new Date(item.date);
        if (selectedYear !== null && d.getFullYear() !== selectedYear) return false;
        if (selectedMonth !== null && d.getMonth() !== selectedMonth) return false;
        return true;
      });
    }

    return result;
  }, [allNews, activeView, searchQuery, selectedMonth, selectedYear]);

  // Featured / hero news - use initialFeaturedNews to persist across view switches
  const featuredNews = useMemo(() => {
    if (initialFeaturedNews) return initialFeaturedNews;
    const sorted = [...allNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const urgent = sorted.find(n => n.isUrgent);
    if (urgent) return urgent;
    return sorted[0] || null;
  }, [allNews, initialFeaturedNews]);

  // News card component
  const NewsCard = ({ item, index = 0, compact = false }: { item: NewsItem; index?: number; compact?: boolean }) => (
    <div className="bg-white dark:bg-dm-surface rounded-2xl overflow-hidden border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className={`${compact ? 'h-36' : 'h-48'} w-full relative`}>
        <Link href={`/news/${item.id}`} className="block h-full w-full">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gov-forest/10 to-gov-teal/10 dark:from-gov-gold/5 dark:to-gov-forest/10 flex items-center justify-center">
              <Landmark size={40} className="text-gov-teal/30 dark:text-gov-gold/30" />
            </div>
          )}
        </Link>
        <div className="absolute top-3 ltr:right-3 rtl:left-3 z-10">
          <FavoriteButton
            contentType="news"
            contentId={String(item.id)}
            variant="overlay"
            size={16}
            metadata={{
              title: isAr ? ((item as any).title_ar || item.title) : ((item as any).title_en || item.title),
              description: isAr ? ((item as any).summary_ar || item.summary) : ((item as any).summary_en || item.summary),
              image: item.imageUrl,
              url: `/news/${item.id}`,
            }}
          />
        </div>
        {(item as any).directorate_name && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-2.5 py-1 bg-black/60 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm">
              {isAr ? (item as any).directorate_name : ((item as any).directorate_name_en || (item as any).directorate_name)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/70 mb-2">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gov-gold" />
            {formatRelativeTime(item.date, language as 'ar' | 'en')}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); handleAISummary(item); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gov-gold/10 text-gov-gold hover:bg-gov-gold hover:text-white transition-colors"
            title={t('news_ai_summary')}
          >
            <Sparkles size={12} />
            <span className="text-[10px] font-bold">{t('news_ai_label')}</span>
          </button>
        </div>
        <Link href={`/news/${item.id}`}>
          <h3 className={`font-bold text-gov-charcoal dark:text-gov-gold mb-2 leading-snug group-hover:text-gov-teal dark:group-hover:text-white transition-colors ${compact ? 'line-clamp-2 text-sm' : 'line-clamp-2'}`}>
            {isAr ? ((item as any).title_ar || item.title) : ((item as any).title_en || item.title)}
          </h3>
        </Link>
        {!compact && (
          <p className="text-sm text-gray-600 dark:text-white/70 line-clamp-2 mb-3 flex-1">
            {isAr ? ((item as any).summary_ar || item.summary) : ((item as any).summary_en || item.summary)}
          </p>
        )}
        <Link href={`/news/${item.id}`} className="text-xs font-bold text-gov-teal dark:text-gov-gold hover:underline flex items-center gap-1 mt-auto">
          {t('news_read_details')}
          <ChevronLeft size={14} className={language === 'ar' ? '' : 'rotate-180'} />
        </Link>
      </div>
    </div>
  );

  // Organized view: Hero + Per-Directorate + All
  const renderOrganizedView = () => {
    if (loading) {
      return <SkeletonGrid cards={8} />;
    }

    return (
      <div className="space-y-16">
        {/* 1. Featured / Hero News */}
        {featuredNews && (
          <ScrollAnimation>
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gov-gold/10 dark:bg-gov-gold/20 flex items-center justify-center">
                  <Star size={20} className="text-gov-gold" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold">
                  {t('news_featured')}
                </h2>
              </div>

              <Link href={`/news/${featuredNews.id}`} className="block group">
                <div className="relative rounded-3xl overflow-hidden bg-gov-forest h-[300px] md:h-[400px]">
                  {featuredNews.imageUrl ? (
                    <Image
                      src={featuredNews.imageUrl}
                      alt={featuredNews.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gov-forest to-gov-teal" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    {featuredNews.isUrgent && (
                      <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full mb-3">
                        {t('ui_breaking')}
                      </span>
                    )}
                    {(featuredNews as any).directorate_name && (
                      <span className="inline-block px-3 py-1 bg-gov-gold/80 text-gov-forest text-xs font-bold rounded-full mb-3 ltr:ml-2 rtl:mr-2">
                        {isAr ? (featuredNews as any).directorate_name : ((featuredNews as any).directorate_name_en || (featuredNews as any).directorate_name)}
                      </span>
                    )}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-3 group-hover:text-gov-gold transition-colors leading-tight">
                      {isAr ? ((featuredNews as any).title_ar || featuredNews.title) : ((featuredNews as any).title_en || featuredNews.title)}
                    </h3>
                    <p className="text-white/70 text-sm md:text-base max-w-2xl line-clamp-2 mb-4">
                      {isAr ? ((featuredNews as any).summary_ar || featuredNews.summary) : ((featuredNews as any).summary_en || featuredNews.summary)}
                    </p>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatRelativeTime(featuredNews.date, language as 'ar' | 'en')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          </ScrollAnimation>
        )}

        {/* 2. News Per Department (3 per department - only main departments) */}
        {filteredGroupedNews.map((group, gIdx) => (
          <ScrollAnimation key={group.directorate.id} delay={gIdx * 0.05}>
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gov-forest/10 dark:bg-gov-gold/20 flex items-center justify-center">
                    <Building2 size={20} className="text-gov-forest dark:text-gov-gold" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-gov-forest dark:text-gov-gold">
                    {isAr ? (group.directorate.name_ar || group.directorate.name) : (group.directorate.name_en || group.directorate.name)}
                  </h2>
                </div>
                <button
                  onClick={() => { setActiveView(group.directorate.id); setVisibleCount(12); }}
                  className="text-sm font-bold text-gov-teal dark:text-gov-gold hover:underline flex items-center gap-1"
                >
                  {t('news_view_all_btn')}
                  <ArrowLeft size={14} className={isAr ? '' : 'rotate-180'} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {group.news.slice(0, 3).map((item, idx) => (
                  <NewsCard key={item.id} item={item} index={idx} compact />
                ))}
              </div>
            </section>
          </ScrollAnimation>
        ))}

        {/* 3. All News */}
        <ScrollAnimation>
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gov-teal/10 dark:bg-gov-teal/20 flex items-center justify-center">
                <LayoutGrid size={20} className="text-gov-teal dark:text-gov-teal" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold">
                {t('news_all')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allNews.slice(0, visibleCount).map((item, idx) => (
                <NewsCard key={`all-${item.id}-${idx}`} item={item} index={idx} />
              ))}
            </div>

            {visibleCount < allNews.length && (
              <div className="mt-10 mb-6 flex justify-center">
                <button
                  onClick={() => { setActiveView('all'); setCurrentPage(1); }}
                  className="px-10 py-3.5 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-forest font-bold rounded-xl hover:bg-gov-emerald dark:hover:bg-white transition-all shadow-lg hover:shadow-xl"
                >
                  {t('news_view_all')}
                </button>
              </div>
            )}
          </section>
        </ScrollAnimation>
      </div>
    );
  };

  // Flat filtered view (for specific directorate/central/all tabs)
  const renderFlatView = () => {
    if (loading) {
      return <SkeletonGrid cards={8} />;
    }

    if (filteredFlatNews.length === 0) {
      return (
        <div className="text-center py-20 bg-white dark:bg-gov-card/10 rounded-2xl border border-dashed border-gray-300 dark:border-gov-border/25">
          <Search size={40} className="mx-auto text-gray-300 dark:text-white/50 mb-4" />
          <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-2">
            {t('news_no_results')}
          </h3>
          <p className="text-gray-500 dark:text-white/70 text-sm">
            {t('news_no_results_desc')}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredFlatNews.map((item, index) => (
            <ScrollAnimation key={`${item.id}-${index}`} delay={index * 0.05}>
              <NewsCard item={item} index={index} />
            </ScrollAnimation>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          total={totalItems}
          perPage={perPage}
          onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />

      <main className="flex-grow pt-[4.5rem] md:pt-[5.5rem]">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-gov-forest via-gov-emerald to-gov-teal dark:from-gov-forest dark:via-gov-forest dark:to-gov-emerald/30 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {t('news_page_title')}
            </h1>
            <p className="text-white/70 mb-6">
              {t('news_page_subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Unified Content Filter */}
          <ContentFilter
            tabs={viewTabs}
            activeTab={activeView}
            onTabChange={(k) => { setActiveView(k); setVisibleCount(12); setCurrentPage(1); }}
            showDateFilter={activeView !== 'organized'}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onDateChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); setVisibleCount(12); }}
            onSearch={activeView !== 'organized' ? (q) => setSearchQuery(q) : undefined}
            searchValue={searchQuery}
            totalCount={activeView === 'organized' ? allNews.length : totalItems}
            countLabel={t('news_article_count')}
            className="mb-8"
          />

          {/* Content */}
          {activeView === 'organized' ? renderOrganizedView() : renderFlatView()}

          {/* FAQ Section */}
          {activeView !== 'organized' && (
            <div className="mt-16 bg-white dark:bg-dm-surface rounded-2xl p-8 border border-gray-100 dark:border-gov-border/15">
              <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6">
                {t('news_faq_title')}
              </h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    {t('news_faq_q1')}
                    <Calendar size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="p-4 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                    {t('news_faq_a1')}
                  </p>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    {t('news_faq_q2')}
                    <Calendar size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="p-4 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                    {t('news_faq_a2')}
                  </p>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    {t('news_faq_q3')}
                    <Calendar size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="p-4 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                    {t('news_faq_a3')}
                  </p>
                </details>
              </div>
              <div className="mt-4 text-center">
                <Link href="/faq" className="text-gov-teal dark:text-gov-gold font-bold text-sm hover:underline">
                  {t('news_faq_view_all')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* AI Summary Modal */}
      {summaryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gov-border/15">
              <div className="flex items-center gap-2 text-gov-gold">
                <Sparkles size={20} />
                <h3 className="font-bold">{t('news_ai_summary')}</h3>
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
                <div className="bg-gov-beige/50 dark:bg-gov-card/10 rounded-xl p-4">
                  <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">{summaryModal.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
