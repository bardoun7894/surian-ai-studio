'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, FileText, Scale, Megaphone, ChevronLeft, ChevronRight, Calendar, Filter, X, ChevronDown, HelpCircle, Monitor, Building2, Globe, Loader2 } from 'lucide-react';
import { SkeletonGrid, SkeletonList, SkeletonCard, SkeletonText } from '@/components/SkeletonLoader';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { SearchResults, Directorate, AutocompleteSuggestion, FAQ } from '@/types';
import { getLocalizedField, getLocalizedName, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchResultsPageProps {
    initialQuery?: string;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ initialQuery = '' }) => {
    const { t, language } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<'all' | 'news' | 'decrees' | 'announcements' | 'services' | 'faq' | 'pages'>('all');
    const [loading, setLoading] = useState(!!initialQuery);
    const [results, setResults] = useState<SearchResults>({ news: [], decrees: [], announcements: [], services: [], faqs: [], pages: [], total: 0 });

    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        entity: ''
    });
    const [directorates, setDirectorates] = useState<Directorate[]>([]);

    // Autocomplete suggestions state
    const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Client-side FAQ data for fallback search
    const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);

    // Fetch directorates for entity filter and FAQs for fallback
    useEffect(() => {
        API.directorates.getAll()
            .then(data => setDirectorates(data))
            .catch(err => console.error('Failed to load directorates:', err));
        // Load FAQs for client-side fallback search
        API.faqs.getAll()
            .then(data => setAllFaqs(data))
            .catch(err => console.error('Failed to load FAQs:', err));
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
                searchInputRef.current && !searchInputRef.current.contains(e.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Detect if text contains Arabic characters
    const isArabicText = (text: string) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);

    // Fetch autocomplete suggestions as user types
    useEffect(() => {
        // Bug 2 fix: For Arabic text, allow single character searches
        const minLength = isArabicText(query) ? 1 : 2;
        if (query.trim().length < minLength) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setSuggestionsLoading(true);
        const timer = setTimeout(async () => {
            try {
                // M7.1: Pass language to get suggestions in the correct language
                const results = await API.searchAutocomplete.suggest(query, language);
                // Also add client-side FAQ matches as suggestions
                const faqSuggestions: AutocompleteSuggestion[] = allFaqs
                    .filter(faq => {
                        const q = query.toLowerCase();
                        const questionText = (language === 'ar' ? faq.question_ar : (faq.question_en || faq.question_ar)).toLowerCase();
                        const answerText = (language === 'ar' ? faq.answer_ar : (faq.answer_en || faq.answer_ar)).toLowerCase();
                        return questionText.includes(q) || answerText.includes(q);
                    })
                    .slice(0, 3)
                    .map(faq => ({
                        text: language === 'ar' ? faq.question_ar : (faq.question_en || faq.question_ar),
                        type: 'faq',
                        url: '/faq'
                    }));
                // Valid route prefixes to filter out broken suggestions
                const validRoutes = ['/news/', '/news', '/services/', '/services', '/announcements/', '/announcements', '/directorates/', '/directorates', '/complaints', '/suggestions', '/media', '/faq', '/contact', '/about', '/search', '/decrees', '/dashboard', '/login', '/register', '/investment', '/open-data', '/sitemap', '/privacy-policy', '/terms'];

                // Merge API suggestions with FAQ suggestions (deduplicate by text)
                const allSuggestions = [...results];
                for (const faqSug of faqSuggestions) {
                    if (!allSuggestions.some(s => s.text.toLowerCase() === faqSug.text.toLowerCase())) {
                        allSuggestions.push(faqSug);
                    }
                }
                // Filter out suggestions with URLs that don't match valid routes
                const validSuggestions = allSuggestions.filter(s => {
                    if (!s.url) return true; // Keep text-only suggestions
                    return validRoutes.some(route => s.url!.startsWith(route)) || s.url === '/';
                });
                setSuggestions(validSuggestions.slice(0, 8));
                // M7.4: Only show dropdown if there are valid suggestions (not broken URLs)
                setShowSuggestions(validSuggestions.length > 0);
                setSelectedSuggestionIndex(-1);
            } catch {
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setSuggestionsLoading(false);
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [query, allFaqs, language]);

    // Sync URL when query changes
    useEffect(() => {
        const current = searchParams.get('q') || '';
        if (query !== current) {
            const params = new URLSearchParams(searchParams.toString());
            if (query.trim()) {
                params.set('q', query);
            } else {
                params.delete('q');
            }
            router.replace(`/search?${params.toString()}`, { scroll: false });
        }
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    const emptyResults: SearchResults = { news: [], decrees: [], announcements: [], services: [], faqs: [], pages: [], total: 0 };

    // Basic fuzzy match: checks if all characters of the query appear in order in the target,
    // or if the target contains any word from the query, tolerating minor differences
    const fuzzyMatch = (target: string, query: string): boolean => {
        const t = target.toLowerCase();
        const q = query.toLowerCase();
        // Exact substring match
        if (t.includes(q)) return true;
        // Word-level matching: if any query word (3+ chars) appears in target
        const queryWords = q.split(/\s+/).filter(w => w.length >= 3);
        if (queryWords.length > 0 && queryWords.some(w => t.includes(w))) return true;
        // Subsequence match: all chars of query appear in order in target
        let ti = 0;
        for (let qi = 0; qi < q.length && ti < t.length; ti++) {
            if (t[qi] === undefined) break;
            if (t[ti] === q[qi]) qi++;
            if (qi === q.length) return true;
        }
        // Simple edit-distance-like: check if removing one char from query matches
        if (q.length >= 4) {
            for (let i = 0; i < q.length; i++) {
                const reduced = q.slice(0, i) + q.slice(i + 1);
                if (t.includes(reduced)) return true;
            }
        }
        return false;
    };

    const performSearch = useCallback(async () => {
        if (!query.trim()) {
            setResults(emptyResults);
            return;
        }
        setLoading(true);
        setShowSuggestions(false);
        try {
            const tabType = activeTab === 'all' ? undefined : activeTab === 'faq' ? 'faq' : activeTab;
            const data = await API.search.search(
                query,
                tabType,
                filters.dateFrom || undefined,
                filters.dateTo || undefined,
                filters.entity || undefined,
                language
            );

            // Client-side FAQ fallback: if the API returned no FAQ results,
            // search through locally loaded FAQs
            if ((activeTab === 'all' || activeTab === 'faq') && (!data.faqs || data.faqs.length === 0) && allFaqs.length > 0) {
                const q = query.toLowerCase();
                const matchedFaqs = allFaqs
                    .filter(faq => {
                        const questionAr = faq.question_ar || '';
                        const questionEn = faq.question_en || '';
                        const answerAr = faq.answer_ar || '';
                        const answerEn = faq.answer_en || '';
                        return fuzzyMatch(questionAr, q) || fuzzyMatch(questionEn, q) || fuzzyMatch(answerAr, q) || fuzzyMatch(answerEn, q);
                    })
                    .map(faq => ({
                        id: String(faq.id),
                        title: language === 'ar' ? faq.question_ar : (faq.question_en || faq.question_ar),
                        title_ar: faq.question_ar,
                        title_en: faq.question_en,
                        description: language === 'ar' ? faq.answer_ar : (faq.answer_en || faq.answer_ar),
                        type: 'faq',
                        url: '/faq',
                        // Preserve original FAQ fields for rendering
                        question_ar: faq.question_ar,
                        question_en: faq.question_en,
                        answer_ar: faq.answer_ar,
                        answer_en: faq.answer_en,
                    })) as any[];
                data.faqs = matchedFaqs;
                data.total = (data.total || 0) + matchedFaqs.length;
            }

            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults(emptyResults);
        } finally {
            setLoading(false);
        }
    }, [query, activeTab, filters.dateFrom, filters.dateTo, filters.entity, allFaqs, language]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch();
        }, 300);
        return () => clearTimeout(timer);
    }, [performSearch]);

    const tabs = [
        { id: 'all', label: language === 'ar' ? 'الكل' : 'All', count: results.total },
        { id: 'news', label: language === 'ar' ? 'أخبار' : 'News', count: results.news?.length || 0 },
        { id: 'decrees', label: language === 'ar' ? 'مراسيم وقوانين' : 'Decrees & Laws', count: results.decrees?.length || 0 },
        { id: 'announcements', label: language === 'ar' ? 'إعلانات' : 'Announcements', count: results.announcements?.length || 0 },
        { id: 'services', label: language === 'ar' ? 'خدمات' : 'Services', count: results.services?.length || 0 },
        { id: 'faq', label: language === 'ar' ? 'أسئلة شائعة' : 'FAQ', count: results.faqs?.length || 0 },
        { id: 'pages', label: language === 'ar' ? 'صفحات' : 'Pages', count: results.pages?.length || 0 },
    ];

    return (
        <div className="min-h-screen bg-gov-beige dark:bg-dm-surface pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Header */}
                <div className="bg-white dark:bg-dm-surface rounded-2xl p-8 mb-8 border border-gray-100 dark:border-gov-border/15 shadow-sm">
                    <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-6">
                        {language === 'ar' ? 'نتائج البحث' : 'Search Results'}
                    </h1>
                    <div className="relative max-w-2xl">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                            onKeyDown={(e) => {
                                if (!showSuggestions || suggestions.length === 0) return;
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setSelectedSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                                } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                                } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
                                    e.preventDefault();
                                    const selected = suggestions[selectedSuggestionIndex];
                                    setQuery(selected.text);
                                    setShowSuggestions(false);
                                    setSelectedSuggestionIndex(-1);
                                } else if (e.key === 'Escape') {
                                    setShowSuggestions(false);
                                    setSelectedSuggestionIndex(-1);
                                }
                            }}
                            placeholder={t('search_placeholder')}
                            className="w-full py-4 pl-14 pr-14 rounded-xl bg-gray-50 dark:bg-dm-surface border border-gray-200 dark:border-gov-border/15 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-gold transition-colors text-right rtl:text-right ltr:text-left"
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                            autoComplete="off"
                            role="combobox"
                            aria-expanded={showSuggestions}
                            aria-haspopup="listbox"
                            aria-autocomplete="list"
                        />
                        {/* Search icon or loading spinner */}
                        {loading || suggestionsLoading ? (
                            <Loader2 className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-gov-teal animate-spin" size={20} />
                        ) : (
                            <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        )}
                        {query && (
                            <button
                                type="button"
                                onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                                className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-charcoal dark:hover:text-white p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}

                        {/* Autocomplete Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                role="listbox"
                                className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/15 rounded-xl shadow-xl overflow-hidden"
                            >
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={`${suggestion.text}-${index}`}
                                        role="option"
                                        aria-selected={selectedSuggestionIndex === index}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rtl:text-right transition-colors ${
                                            selectedSuggestionIndex === index
                                                ? 'bg-gov-gold/10 dark:bg-gov-gold/20'
                                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                        onClick={() => {
                                            setQuery(suggestion.text);
                                            setShowSuggestions(false);
                                            setSelectedSuggestionIndex(-1);
                                            searchInputRef.current?.focus();
                                        }}
                                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                    >
                                        <span className="shrink-0">
                                            {suggestion.type === 'faq' ? (
                                                <HelpCircle size={16} className="text-gov-teal" />
                                            ) : suggestion.type === 'news' ? (
                                                <FileText size={16} className="text-gov-teal" />
                                            ) : suggestion.type === 'service' ? (
                                                <Monitor size={16} className="text-gov-teal" />
                                            ) : (
                                                <Search size={16} className="text-gray-400" />
                                            )}
                                        </span>
                                        <span className="flex-1 text-sm text-gov-charcoal dark:text-white truncate">
                                            {suggestion.text}
                                        </span>
                                        <span className="shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50">
                                            {suggestion.type === 'faq' ? (language === 'ar' ? 'سؤال' : 'FAQ') : suggestion.type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Advanced Search Toggle & Panel */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-gov-forest dark:text-white font-bold hover:text-gov-teal transition-colors"
                    >
                        <Filter size={18} />
                        {language === 'ar' ? 'بحث متقدم وفلاتر' : 'Advanced Search & Filters'}
                        {showFilters ? <ChevronDown size={16} /> : <div className="rtl:rotate-90"><ChevronRight size={16} /></div>}
                    </button>

                    {showFilters && (
                        <div className="mt-4 p-6 bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-white/70 uppercase mb-2">
                                        {language === 'ar' ? 'من تاريخ' : 'From Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dm-surface dark:text-white border border-gray-200 dark:border-gov-border/15 text-gov-charcoal outline-none focus:border-gov-gold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-white/70 uppercase mb-2">
                                        {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dm-surface dark:text-white border border-gray-200 dark:border-gov-border/15 text-gov-charcoal outline-none focus:border-gov-gold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-white/70 uppercase mb-2 flex items-center gap-1">
                                        <Building2 size={12} />
                                        {language === 'ar' ? 'الجهة' : 'Directorate'}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={filters.entity}
                                            onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                                            className="w-full p-3 ltr:pr-10 rtl:pl-10 rounded-xl bg-gray-50 dark:bg-dm-surface dark:text-white border border-gray-200 dark:border-gov-border/15 text-gov-charcoal outline-none focus:border-gov-gold transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="">{language === 'ar' ? 'جميع الجهات' : 'All Directorates'}</option>
                                            {directorates.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {typeof d.name === 'string' ? getLocalizedField(d, 'name', language as 'ar' | 'en') : getLocalizedName(d.name, language as 'ar' | 'en')}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => setFilters({ dateFrom: '', dateTo: '', entity: '' })}
                                        className="px-5 py-3 bg-gov-gold text-white text-sm font-bold rounded-xl border-2 border-gov-gold hover:bg-gov-gold/85 hover:border-gov-gold/85 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <X size={16} /> {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                                    </button>
                                </div>
                            </div>
                            {/* Date presets */}
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-gray-500 font-bold">{language === 'ar' ? 'فترة سريعة:' : 'Quick:'}</span>
                                {[
                                    { label: language === 'ar' ? 'اليوم' : 'Today', days: 0 },
                                    { label: language === 'ar' ? 'هذا الأسبوع' : 'This Week', days: 7 },
                                    { label: language === 'ar' ? 'هذا الشهر' : 'This Month', days: 30 },
                                ].map((preset) => (
                                    <button
                                        key={preset.days}
                                        onClick={() => {
                                            const now = new Date();
                                            const from = new Date();
                                            from.setDate(now.getDate() - preset.days);
                                            setFilters({
                                                ...filters,
                                                dateFrom: from.toISOString().split('T')[0],
                                                dateTo: now.toISOString().split('T')[0]
                                            });
                                        }}
                                        className="px-3 py-1 rounded-full text-xs font-bold bg-gov-teal/10 text-gov-teal hover:bg-gov-teal hover:text-white transition-colors"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-gov-teal text-white shadow-md'
                                : 'bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/10'
                                }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-8 space-y-8">
                        {/* Loading indicator bar */}
                        <div className="flex items-center gap-3 mb-4">
                            <Loader2 className="text-gov-teal animate-spin" size={20} />
                            <span className="text-sm font-bold text-gov-charcoal dark:text-white/70">
                                {language === 'ar' ? 'جاري البحث...' : 'Searching...'}
                            </span>
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gov-teal rounded-full animate-pulse" style={{ width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                            </div>
                        </div>
                        {/* News Section Skeleton */}
                        <section>
                            <div className="h-6 w-32 bg-gray-200 dark:bg-dm-surface rounded-lg animate-pulse mb-4" />
                            <SkeletonGrid cards={4} className="grid-cols-1 md:grid-cols-2" />
                        </section>
                        {/* Decrees Section Skeleton */}
                        <section>
                            <div className="h-6 w-48 bg-gray-200 dark:bg-dm-surface rounded-lg animate-pulse mb-4" />
                            <SkeletonList rows={3} />
                        </section>
                        {/* Announcements Section Skeleton */}
                        <section>
                            <div className="h-6 w-40 bg-gray-200 dark:bg-dm-surface rounded-lg animate-pulse mb-4" />
                            <SkeletonGrid cards={3} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
                        </section>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && (
                    <div className="space-y-8">

                        {/* News Section */}
                        {(activeTab === 'all' || activeTab === 'news') && results.news?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-teal mb-4 flex items-center gap-2">
                                    <FileText size={20} />
                                    {language === 'ar' ? 'الأخبار' : 'News'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(results.news || []).map(item => (
                                        <Link key={item.id} href={item.url || `/news/${item.id}`} className="block bg-white dark:bg-dm-surface p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{getLocalizedField(item, 'title', language as 'ar' | 'en')}</h3>
                                            <p className="text-sm text-gray-500 dark:text-white/60 mb-2 line-clamp-2">{getLocalizedField(item, 'description', language as 'ar' | 'en') || getLocalizedField(item, 'summary', language as 'ar' | 'en')}</p>
                                            <span className="text-xs text-gov-teal dark:text-gov-teal">{formatRelativeTime(item.date, language as 'ar' | 'en')}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Decrees Section */}
                        {(activeTab === 'all' || activeTab === 'decrees') && results.decrees?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-teal mb-4 flex items-center gap-2">
                                    <Scale size={20} />
                                    {language === 'ar' ? 'المراسيم والقوانين' : 'Decrees & Laws'}
                                </h2>
                                <div className="space-y-3">
                                    {(results.decrees || []).map(item => (
                                        <Link key={item.id} href={item.url || '/decrees'} className="bg-white dark:bg-dm-surface p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-colors flex items-center justify-between cursor-pointer">
                                            <div>
                                                <h3 className="font-bold text-gov-charcoal dark:text-white">{getLocalizedField(item, 'title', language as 'ar' | 'en')}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-white/60">
                                                    <span>{formatRelativeTime(item.date, language as 'ar' | 'en')}</span>
                                                </div>
                                            </div>
                                            <ChevronLeft className="text-gray-400 rtl:block hidden" size={16} />
                                            <ChevronRight className="text-gray-400 rtl:hidden block" size={16} />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Announcements Section */}
                        {(activeTab === 'all' || activeTab === 'announcements') && results.announcements?.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-teal mb-4 flex items-center gap-2">
                                    <Megaphone size={20} />
                                    {language === 'ar' ? 'الإعلانات' : 'Announcements'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(results.announcements || []).map(item => (
                                        <Link key={item.id} href={item.url || '/announcements'} className="block bg-white dark:bg-dm-surface p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="px-2 py-1 rounded bg-gov-teal/10 dark:bg-gov-teal/20 text-gov-teal dark:text-gov-emeraldLight text-xs font-bold">
                                                    {item.category || item.type}
                                                </span>
                                                <Calendar size={14} className="text-gray-400" />
                                            </div>
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{getLocalizedField(item, 'title', language as 'ar' | 'en')}</h3>
                                            <span className="text-xs text-gray-500 dark:text-white/60">{formatRelativeTime(item.date, language as 'ar' | 'en')}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Services Section */}
                        {(activeTab === 'all' || activeTab === 'services') && results.services && results.services.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-teal mb-4 flex items-center gap-2">
                                    <Monitor size={20} />
                                    {language === 'ar' ? 'الخدمات' : 'Services'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.services.map((service: any) => (
                                        <Link key={service.id} href={`/services/${service.id}`} className="block bg-white dark:bg-dm-surface p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${service.isDigital ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                                    {service.isDigital ? (language === 'ar' ? 'إلكترونية' : 'Digital') : (language === 'ar' ? 'حضورية' : 'In-Person')}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{getLocalizedField(service, 'title', language as 'ar' | 'en')}</h3>
                                            <p className="text-xs text-gray-500 dark:text-white/60 line-clamp-2">{getLocalizedField(service, 'description', language as 'ar' | 'en')}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FAQ Section */}
                        {(activeTab === 'all' || activeTab === 'faq') && results.faqs && results.faqs.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-teal mb-4 flex items-center gap-2">
                                    <HelpCircle size={20} />
                                    {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                                </h2>
                                <div className="space-y-3">
                                    {results.faqs.map((faq: any) => {
                                        // Support both API SearchResult format (title/description) and FAQ format (question_ar/answer_ar)
                                        const question = faq.question_ar
                                            ? (language === 'ar' ? faq.question_ar : (faq.question_en || faq.question_ar))
                                            : getLocalizedField(faq, 'title', language as 'ar' | 'en');
                                        const answer = faq.answer_ar
                                            ? (language === 'ar' ? faq.answer_ar : (faq.answer_en || faq.answer_ar))
                                            : (faq.description || getLocalizedField(faq, 'description', language as 'ar' | 'en'));
                                        return (
                                            <Link key={faq.id} href="/faq" className="block bg-white dark:bg-dm-surface p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                                <div className="flex items-start gap-3">
                                                    <HelpCircle size={16} className="text-gov-teal shrink-0 mt-1" />
                                                    <div>
                                                        <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{question}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2">{answer}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Pages Section */}
                        {(activeTab === 'all' || activeTab === 'pages') && results.pages && results.pages.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-teal mb-4 flex items-center gap-2">
                                    <Globe size={20} />
                                    {language === 'ar' ? 'صفحات' : 'Pages'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.pages.map((item) => (
                                        <Link key={item.id} href={item.url || `/${item.id}`} className="block bg-white dark:bg-dm-surface p-4 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{item.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2">{item.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty State */}
                        {results.total === 0 && query.trim() && (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-gray-300 dark:text-white/70" />
                                </div>
                                <h3 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-3">
                                    {language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results'}
                                </h3>
                                <p className="text-gray-500 dark:text-white/60 max-w-md mx-auto mb-6">
                                    {language === 'ar' ? 'جرب تغيير كلمات البحث أو الفلاتر المستخدمة' : 'Try different keywords or adjust your filters'}
                                </p>
                                <button
                                    onClick={() => { setQuery(''); setFilters({ dateFrom: '', dateTo: '', entity: '' }); }}
                                    className="px-6 py-2 bg-gov-teal text-white rounded-lg font-bold hover:bg-gov-teal/90 transition-colors"
                                >
                                    {language === 'ar' ? 'إعادة تعيين البحث' : 'Reset Search'}
                                </button>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;
