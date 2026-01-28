'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Scale, Megaphone, ChevronLeft, ChevronRight, Calendar, Filter, X, ChevronDown, Loader2, HelpCircle, Monitor, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { SearchResults, Directorate } from '@/types';
import Link from 'next/link';

interface SearchResultsPageProps {
    initialQuery?: string;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ initialQuery = '' }) => {
    const { t, language } = useLanguage();
    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<'all' | 'news' | 'decrees' | 'announcements' | 'services' | 'faq'>('all');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResults & { services?: any[]; faqs?: any[] }>({ news: [], decrees: [], announcements: [], total: 0, services: [], faqs: [] });

    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        entity: ''
    });
    const [directorates, setDirectorates] = useState<Directorate[]>([]);

    // Fetch directorates for entity filter
    useEffect(() => {
        API.directorates.getAll()
            .then(data => setDirectorates(data))
            .catch(err => console.error('Failed to load directorates:', err));
    }, []);

    const performSearch = useCallback(async () => {
        if (!query.trim()) {
            setResults({ news: [], decrees: [], announcements: [], total: 0 });
            return;
        }
        setLoading(true);
        try {
            const type = activeTab === 'all' ? undefined : activeTab;
            const data = await API.search.search(
                query,
                type,
                filters.dateFrom || undefined,
                filters.dateTo || undefined,
                filters.entity || undefined
            );
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults({ news: [], decrees: [], announcements: [], total: 0 });
        } finally {
            setLoading(false);
        }
    }, [query, activeTab, filters.dateFrom, filters.dateTo, filters.entity]);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch();
        }, 300);
        return () => clearTimeout(timer);
    }, [performSearch]);

    const tabs = [
        { id: 'all', label: language === 'ar' ? 'الكل' : 'All', count: results.total },
        { id: 'news', label: language === 'ar' ? 'أخبار' : 'News', count: results.news.length },
        { id: 'decrees', label: language === 'ar' ? 'مراسيم وقوانين' : 'Decrees & Laws', count: results.decrees.length },
        { id: 'announcements', label: language === 'ar' ? 'إعلانات' : 'Announcements', count: results.announcements.length },
        { id: 'services', label: language === 'ar' ? 'خدمات' : 'Services', count: results.services?.length || 0 },
        { id: 'faq', label: language === 'ar' ? 'أسئلة شائعة' : 'FAQ', count: results.faqs?.length || 0 },
    ];

    return (
        <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Header */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-8 mb-8 border border-gray-100 dark:border-white/10 shadow-sm">
                    <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-6">
                        {language === 'ar' ? 'نتائج البحث' : 'Search Results'}
                    </h1>
                    <div className="relative max-w-2xl">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className="w-full py-4 pl-14 pr-14 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-gold transition-colors text-right rtl:text-right ltr:text-left"
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                        />
                        <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-charcoal dark:hover:text-white p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Advanced Search Toggle & Panel */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-gov-forest dark:text-gray-300 font-bold hover:text-gov-teal transition-colors"
                    >
                        <Filter size={18} />
                        {language === 'ar' ? 'بحث متقدم وفلاتر' : 'Advanced Search & Filters'}
                        {showFilters ? <ChevronDown size={16} /> : <div className="rtl:rotate-90"><ChevronRight size={16} /></div>}
                    </button>

                    {showFilters && (
                        <div className="mt-4 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                        {language === 'ar' ? 'من تاريخ' : 'From Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-gold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                        {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-gold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                        <Building2 size={12} />
                                        {language === 'ar' ? 'الجهة' : 'Directorate'}
                                    </label>
                                    <select
                                        value={filters.entity}
                                        onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-gold transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="">{language === 'ar' ? 'جميع الجهات' : 'All Directorates'}</option>
                                        {directorates.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {typeof d.name === 'string' ? d.name : (language === 'ar' ? d.name : d.name)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => setFilters({ dateFrom: '', dateTo: '', entity: '' })}
                                        className="text-gov-cherry text-sm font-bold hover:underline flex items-center gap-1"
                                    >
                                        <X size={14} /> {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
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
                                : 'bg-white dark:bg-white/5 text-gov-charcoal dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/10'
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
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-gov-gold" size={32} />
                    </div>
                )}

                {/* Results Grid */}
                {!loading && (
                    <div className="space-y-8">

                        {/* News Section */}
                        {(activeTab === 'all' || activeTab === 'news') && results.news.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                    <FileText size={20} />
                                    {language === 'ar' ? 'الأخبار' : 'News'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.news.map(item => (
                                        <Link key={item.id} href={item.url || `/news/${item.id}`} className="block bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{item.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-white/60 mb-2 line-clamp-2">{item.description}</p>
                                            <span className="text-xs text-gov-teal dark:text-gov-gold">{item.date}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Decrees Section */}
                        {(activeTab === 'all' || activeTab === 'decrees') && results.decrees.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                    <Scale size={20} />
                                    {language === 'ar' ? 'المراسيم والقوانين' : 'Decrees & Laws'}
                                </h2>
                                <div className="space-y-3">
                                    {results.decrees.map(item => (
                                        <Link key={item.id} href={item.url || '/decrees'} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors flex items-center justify-between cursor-pointer">
                                            <div>
                                                <h3 className="font-bold text-gov-charcoal dark:text-white">{item.title}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-white/60">
                                                    <span>{item.date}</span>
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
                        {(activeTab === 'all' || activeTab === 'announcements') && results.announcements.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                    <Megaphone size={20} />
                                    {language === 'ar' ? 'الإعلانات' : 'Announcements'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.announcements.map(item => (
                                        <Link key={item.id} href={item.url || '/announcements'} className="block bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="px-2 py-1 rounded bg-gov-teal/10 dark:bg-gov-teal/20 text-gov-teal dark:text-gov-emeraldLight text-xs font-bold">
                                                    {item.category || item.type}
                                                </span>
                                                <Calendar size={14} className="text-gray-400" />
                                            </div>
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{item.title}</h3>
                                            <span className="text-xs text-gray-500 dark:text-white/60">{item.date}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Services Section */}
                        {(activeTab === 'all' || activeTab === 'services') && results.services && results.services.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                    <Monitor size={20} />
                                    {language === 'ar' ? 'الخدمات' : 'Services'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.services.map((service: any) => (
                                        <Link key={service.id} href={`/services/${service.id}`} className="block bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${service.isDigital ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                                    {service.isDigital ? (language === 'ar' ? 'إلكترونية' : 'Digital') : (language === 'ar' ? 'حضورية' : 'In-Person')}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{service.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-white/60 line-clamp-2">{service.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FAQ Section */}
                        {(activeTab === 'all' || activeTab === 'faq') && results.faqs && results.faqs.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                    <HelpCircle size={20} />
                                    {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                                </h2>
                                <div className="space-y-3">
                                    {results.faqs.map((faq: any) => (
                                        <Link key={faq.id} href="/faq" className="block bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors cursor-pointer">
                                            <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{language === 'ar' ? faq.question_ar : faq.question_en}</h3>
                                            <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2">{language === 'ar' ? faq.answer_ar : faq.answer_en}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty State */}
                        {results.total === 0 && query.trim() && (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-gray-300 dark:text-gray-600" />
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
