import React, { useState, useEffect } from 'react';
import { Search, FileText, Scale, Megaphone, ChevronLeft, ChevronRight, Calendar, Filter, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { OFFICIAL_NEWS, DECREES } from '../constants';
import { ViewState } from '../types';

interface SearchResultsPageProps {
    initialQuery?: string;
    onNavigate: (view: ViewState) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ initialQuery = '', onNavigate }) => {
    const { t, language } = useLanguage();
    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<'all' | 'news' | 'decrees' | 'announcements'>('all');

    // Mock Announcements Data (since it might not be in constants yet)
    const MOCK_ANNOUNCEMENTS = [
        { id: 'a1', title: language === 'ar' ? 'إعلان مناقصة لتوريد تجهيزات مكتبية' : 'Tender announcement for office supplies procurement', date: '2024-05-20', type: language === 'ar' ? 'مناقصة' : 'Tender' },
        { id: 'a2', title: language === 'ar' ? 'مسابقة لتعيين موظفين من الفئة الأولى' : 'Competition for first category staff recruitment', date: '2024-05-18', type: language === 'ar' ? 'وظيفة' : 'Job' },
        { id: 'a3', title: language === 'ar' ? 'إعلان عن بدء التسجيل في المعهد العالي' : 'Announcement about start of registration at the Higher Institute', date: '2024-05-15', type: language === 'ar' ? 'عام' : 'General' },
    ];

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        entity: ''
    });

    const uniqueEntities = Array.from(new Set([
        ...OFFICIAL_NEWS.map(n => n.category),
        ...DECREES.map(d => d.type),
        language === 'ar' ? 'الإدارة العامة للصناعة' : 'General Administration for Industry',
        language === 'ar' ? 'الإدارة العامة للاقتصاد' : 'General Administration for Economy'
    ])).filter(Boolean);

    // Filter Logic
    const filterByDate = (dateStr: string) => {
        if (!dateStr) return true;
        const d = new Date(dateStr);
        if (filters.dateFrom && d < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && d > new Date(filters.dateTo)) return false;
        return true;
    };

    const filterByEntity = (itemEntity: string) => {
        if (!filters.entity) return true;
        return itemEntity === filters.entity;
    };

    const filteredNews = OFFICIAL_NEWS.filter(item =>
        (item.title.includes(query) || item.summary.includes(query)) &&
        filterByDate(item.date) &&
        filterByEntity(item.category)
    );
    const filteredDecrees = DECREES.filter(item =>
        (item.title.includes(query) || item.number.includes(query)) &&
        filterByDate(item.date) &&
        filterByEntity(item.type)
    );
    const filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter(item =>
        item.title.includes(query) &&
        filterByDate(item.date) &&
        filterByEntity(item.type) // Mock announcements use type as entity for now
    );

    const totalResults = filteredNews.length + filteredDecrees.length + filteredAnnouncements.length;

    const tabs = [
        { id: 'all', label: t('nav_all'), count: totalResults },
        { id: 'news', label: t('nav_news'), count: filteredNews.length },
        { id: 'decrees', label: t('nav_decrees'), count: filteredDecrees.length },
        { id: 'announcements', label: t('nav_announcements'), count: filteredAnnouncements.length },
    ];

    return (
        <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Header */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-8 mb-8 border border-gray-100 dark:border-white/10 shadow-sm">
                    <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-6">
                        {t('search_results')}
                    </h1>
                    <div className="relative max-w-2xl">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className="w-full py-4 px-6 pr-12 rtl:pr-6 rtl:pl-12 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-gold transition-colors"
                        />
                        <Search className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                {/* Advanced Search Toggle & Panel */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-gov-forest dark:text-gray-300 font-bold hover:text-gov-teal transition-colors"
                    >
                        <Filter size={18} />
                        {t('search_advanced')}
                        {showFilters ? <ChevronDown size={16} /> : <div className="rtl:rotate-90"><ChevronRight size={16} /></div>}
                    </button>

                    {showFilters && (
                        <div className="mt-4 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('search_from')}</label>
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-gold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('search_to')}</label>
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-gold transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('search_entity')}</label>
                                    <select
                                        value={filters.entity}
                                        onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-gold transition-colors appearance-none"
                                    >
                                        <option value="">{t('nav_all')}</option>
                                        {uniqueEntities.map(e => (
                                            <option key={e} value={e}>{e}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setFilters({ dateFrom: '', dateTo: '', entity: '' })}
                                    className="text-red-500 text-sm font-bold hover:underline flex items-center gap-1"
                                >
                                    <X size={14} /> {t('search_reset')}
                                </button>
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

                {/* Results Grid */}
                <div className="space-y-8">

                    {/* News Section */}
                    {(activeTab === 'all' || activeTab === 'news') && filteredNews.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                <FileText size={20} />
                                {t('nav_news')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredNews.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors cursor-pointer" onClick={() => onNavigate('MEDIA_CENTER')}>
                                        <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-white/60 mb-2 line-clamp-2">{item.summary}</p>
                                        <span className="text-xs text-gov-teal dark:text-gov-gold">{item.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Decrees Section */}
                    {(activeTab === 'all' || activeTab === 'decrees') && filteredDecrees.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                <Scale size={20} />
                                {t('nav_decrees')}
                            </h2>
                            <div className="space-y-3">
                                {filteredDecrees.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors flex items-center justify-between cursor-pointer" onClick={() => onNavigate('DECREES')}>
                                        <div>
                                            <h3 className="font-bold text-gov-charcoal dark:text-white">{item.title}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-white/60">
                                                <span>{t('decree_no_label')} {item.number}</span>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                        <ChevronLeft className="text-gray-400 rtl:block hidden" size={16} />
                                        <ChevronRight className="text-gray-400 rtl:hidden block" size={16} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Announcements Section */}
                    {(activeTab === 'all' || activeTab === 'announcements') && filteredAnnouncements.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center gap-2">
                                <Megaphone size={20} />
                                {t('nav_announcements')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredAnnouncements.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors cursor-pointer" onClick={() => onNavigate('ANNOUNCEMENTS')}>
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                                                {item.type}
                                            </span>
                                            <Calendar size={14} className="text-gray-400" />
                                        </div>
                                        <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">{item.title}</h3>
                                        <span className="text-xs text-gray-500 dark:text-white/60">{item.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {totalResults === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-2">
                                {t('search_no_results')}
                            </h3>
                            <p className="text-gray-500 dark:text-white/60">
                                {t('search_try_again')}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;
