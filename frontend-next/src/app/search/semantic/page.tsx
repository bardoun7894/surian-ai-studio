'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  X,
  FileText,
  Calendar,
  Tag,
  ChevronDown,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface SearchResult {
  id: number;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  category: string;
  published_at: string;
  similarity_score: number;
  tags?: string[];
}

interface FilterState {
  category: string;
  minScore: number;
  dateFrom: string;
  dateTo: string;
}

export default function SemanticSearchPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minScore: 0.5,
    dateFrom: '',
    dateTo: '',
  });

  // Use relative URLs - Next.js rewrites handle proxying to backend
  const API_URL = '/api/v1';

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query: searchTerm,
        limit: '20',
      });

      if (filters.category) params.append('category', filters.category);
      if (filters.minScore) params.append('min_score', filters.minScore.toString());
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);

      const res = await fetch(`${API_URL}/public/search/semantic?${params.toString()}`);

      if (!res.ok) {
        throw new Error('Search failed');
      }

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(language === 'ar' ? 'فشل البحث' : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/semantic?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minScore: 0.5,
      dateFrom: '',
      dateTo: '',
    });
    if (query) {
      performSearch(query);
    }
  };

  const categoryLabels: Record<string, { ar: string; en: string }> = {
    news: { ar: 'أخبار', en: 'News' },
    announcement: { ar: 'إعلانات', en: 'Announcements' },
    service: { ar: 'خدمات', en: 'Services' },
    decree: { ar: 'مراسيم', en: 'Decrees' },
    faq: { ar: 'أسئلة شائعة', en: 'FAQ' },
  };

  const highlightText = (text: string, maxLength: number = 200): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors">
      <Navbar onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)} />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gov-gold/10 rounded-xl">
                <Sparkles className="text-gov-gold" size={24} />
              </div>
              <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'البحث الدلالي' : 'Semantic Search'}
              </h1>
            </div>
            <p className="text-gov-stone dark:text-gov-beige/60 max-w-2xl text-lg">
              {language === 'ar'
                ? 'ابحث باستخدام الذكاء الاصطناعي للحصول على نتائج أكثر دقة وملاءمة للسياق'
                : 'Search using AI for more accurate and context-aware results'}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <Search
                  className="absolute start-4 top-1/2 -translate-y-1/2 text-gov-stone group-focus-within:text-gov-gold transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'ابحث في المحتوى...'
                      : 'Search content...'
                  }
                  className="w-full ps-12 pe-4 py-4 bg-white dark:bg-white/5 border border-gov-stone/20 dark:border-white/10 rounded-xl text-gov-charcoal dark:text-white placeholder-gov-stone/50 focus:outline-none focus:ring-2 focus:ring-gov-gold/50 transition-all shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gov-forest dark:bg-gov-gold text-white dark:text-gov-charcoal font-bold rounded-xl hover:bg-gov-forest/90 dark:hover:bg-gov-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-gov-forest/10"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : language === 'ar' ? 'بحث' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-4 border rounded-xl font-bold transition-all ${showFilters
                    ? 'bg-gov-gold/10 text-gov-gold border-gov-gold'
                    : 'bg-white dark:bg-white/5 border-gov-stone/20 dark:border-white/10 text-gov-stone dark:text-white hover:bg-gov-stone/5 dark:hover:bg-white/10'
                  }`}
              >
                <Filter size={20} />
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-8 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gov-stone/10 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white font-display">
                  {language === 'ar' ? 'خيارات التصفية' : 'Filter Options'}
                </h3>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-gov-gold hover:text-gov-gold/80 transition-colors font-medium"
                >
                  <X size={16} />
                  {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gov-stone/5 dark:bg-white/10 border-none rounded-lg text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-gold/50 appearance-none"
                    >
                      <option value="">{language === 'ar' ? 'الكل' : 'All'}</option>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {language === 'ar' ? label.ar : label.en}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute end-4 top-1/2 -translate-y-1/2 text-gov-stone pointer-events-none" />
                  </div>
                </div>

                {/* Minimum Score Filter */}
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2 flex justify-between">
                    <span>{language === 'ar' ? 'دقة التطابق' : 'Match Accuracy'}</span>
                    <span className="text-gov-gold">{(filters.minScore * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={filters.minScore}
                    onChange={(e) => setFilters({ ...filters, minScore: parseFloat(e.target.value) })}
                    className="w-full accent-gov-gold h-2 bg-gov-stone/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'من تاريخ' : 'From Date'}
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gov-stone/5 dark:bg-white/10 border-none rounded-lg text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-gold/50"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gov-stone/5 dark:bg-white/10 border-none rounded-lg text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-gold/50"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => query && performSearch(query)}
                  className="px-6 py-2.5 bg-gov-charcoal dark:bg-white text-white dark:text-gov-charcoal font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  {language === 'ar' ? 'تطبيق الفلاتر' : 'Apply Filters'}
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
              <span className="text-red-700 dark:text-red-400 font-medium">{error}</span>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="mb-6 flex items-center gap-2 text-sm text-gov-stone dark:text-gov-beige/60">
              <span className="font-bold text-gov-charcoal dark:text-white">{results.length}</span>
              {language === 'ar' ? 'نتيجة تم العثور عليها' : 'results found'}
            </div>
          )}

          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gov-stone/10 dark:border-white/5 hover:border-gov-gold/30 hover:shadow-lg hover:shadow-gov-gold/5 transition-all cursor-pointer group"
                onClick={() => router.push(`/content/${result.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2 group-hover:text-gov-gold transition-colors font-display">
                      {language === 'ar' ? result.title_ar : result.title_en}
                    </h3>
                    <p className="text-gov-stone dark:text-gov-beige/70 leading-relaxed text-sm">
                      {highlightText(language === 'ar' ? result.content_ar : result.content_en)}
                    </p>
                  </div>

                  {/* Similarity Score */}
                  <div className="flex items-center gap-2 ms-4">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${result.similarity_score >= 0.8
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                        : result.similarity_score >= 0.6
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                      }`}>
                      {(result.similarity_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-gov-stone/60 dark:text-gov-beige/40 border-t border-gov-stone/5 dark:border-white/5 pt-4">
                  {result.category && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gov-stone/5 dark:bg-white/5 rounded text-gov-stone dark:text-gov-beige/60">
                      <Tag size={12} />
                      <span>
                        {categoryLabels[result.category]
                          ? language === 'ar'
                            ? categoryLabels[result.category].ar
                            : categoryLabels[result.category].en
                          : result.category}
                      </span>
                    </div>
                  )}

                  {result.published_at && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{new Date(result.published_at).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US')}</span>
                    </div>
                  )}

                  {result.tags && result.tags.length > 0 && (
                    <div className="ms-auto flex flex-wrap gap-2">
                      {result.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-gov-gold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gov-stone/10 dark:border-white/5">
              <div className="w-16 h-16 mx-auto mb-4 bg-gov-stone/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                <Search className="text-gov-stone/40" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2 font-display">
                {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
              </h3>
              <p className="text-gov-stone dark:text-gov-beige/60">
                {language === 'ar'
                  ? 'جرب استخدام كلمات مفتاحية مختلفة أو تغيير الفلاتر'
                  : 'Try using different keywords or adjusting the filters'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer
        onIncreaseFont={() => { }}
        onDecreaseFont={() => { }}
        onToggleContrast={() => { }}
      />
    </div>
  );
}
