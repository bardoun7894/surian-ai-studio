'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FilterTab {
    key: string;
    label: string;
    icon?: React.ElementType;
}

export interface ContentFilterProps {
    // Tabs (Primary Filter)
    tabs?: FilterTab[];
    activeTab?: string;
    onTabChange?: (key: string) => void;

    // Search
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    searchValue?: string;

    // Date Filter
    showDateFilter?: boolean;
    selectedMonth?: number | null;
    selectedYear?: number | null;
    onDateChange?: (month: number | null, year: number | null) => void;

    // Extra Filters (Dropdowns etc.)
    extraFilters?: React.ReactNode;

    // Results
    totalCount?: number;
    countLabel?: string;

    className?: string;
}

const MONTHS_AR = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function ContentFilter({
    tabs = [],
    activeTab,
    onTabChange,
    onSearch,
    searchPlaceholder,
    searchValue,
    showDateFilter = false,
    selectedMonth = null,
    selectedYear = null,
    onDateChange,
    extraFilters,
    totalCount,
    countLabel,
    className = '',
}: ContentFilterProps) {
    const { language, t } = useLanguage();
    const isAr = language === 'ar';

    const tabsRef = useRef<HTMLDivElement>(null);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [internalSearch, setInternalSearch] = useState(searchValue || '');

    // Scroll active tab into view on mobile
    useEffect(() => {
        if (tabsRef.current && activeTab) {
            const activeBtn = tabsRef.current.querySelector('[data-active="true"]') as HTMLElement;
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeTab, tabs]);

    // Sync internal search if controlled prop changes
    React.useEffect(() => {
        if (searchValue !== undefined) {
            setInternalSearch(searchValue);
        }
    }, [searchValue]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInternalSearch(val);
        onSearch?.(val);
    };

    const clearDateFilters = () => {
        onDateChange?.(null, null);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Search & Tabs Row */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Tabs */}
                {tabs.length > 0 && (
                    <div ref={tabsRef} className="flex gap-2 w-full md:w-auto overflow-x-auto snap-x snap-mandatory md:flex-wrap md:overflow-visible scrollbar-hide pb-1 md:pb-0" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    data-active={isActive ? "true" : "false"}
                                    onClick={() => onTabChange?.(tab.key)}
                                    className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 snap-start whitespace-nowrap flex-shrink-0 ${isActive
                                            ? 'bg-gov-forest text-white dark:bg-gov-button dark:text-white shadow-lg shadow-gov-forest/20 dark:shadow-gov-button/20'
                                            : 'bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white/70 border border-gray-200 dark:border-gov-border/15 hover:border-gov-forest/30 dark:hover:border-gov-gold/30 hover:shadow-md'
                                        }`}
                                >
                                    {Icon && <Icon size={16} className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? '' : 'text-gov-teal dark:text-gov-gold'}`} />}
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Search Input */}
                {onSearch && (
                    <div className={`relative w-full ${tabs.length > 0 ? 'md:w-64 lg:w-80' : 'md:w-96'}`}>
                        <input
                            type="text"
                            value={internalSearch}
                            onChange={handleSearch}
                            placeholder={searchPlaceholder || t('search_placeholder')}
                            className="w-full py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 rounded-xl bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/25 text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-teal focus:ring-1 focus:ring-gov-teal/20 transition-all shadow-sm"
                        />
                        <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        {internalSearch && (
                            <button
                                onClick={() => { setInternalSearch(''); onSearch?.(''); }}
                                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gov-cherry"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Secondary Filters Row (Date, Extras, Count) */}
            {(showDateFilter || extraFilters || totalCount !== undefined) && (
                <div className="flex flex-row flex-wrap items-center justify-between gap-1.5 sm:gap-4 bg-white dark:bg-gov-card/10 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gov-border/15 p-1.5 sm:p-4">

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-auto">

                        {/* Date Filters */}
                        {showDateFilter && (
                            <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
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
                                            ? 'bg-gov-forest text-white dark:bg-gov-button dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {selectedMonth !== null
                                            ? (isAr ? MONTHS_AR[selectedMonth] : MONTHS_EN[selectedMonth])
                                            : (isAr ? 'الشهر' : 'Month')}
                                        <ChevronDown size={12} className={`transition-transform ${showMonthDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showMonthDropdown && (
                                        <div className="absolute top-full mt-2 left-0 rtl:right-0 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gray-200 dark:border-gov-border/15 py-1 w-44 z-50 max-h-64 overflow-y-auto overscroll-contain" onWheel={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => { onDateChange?.(null, selectedYear); setShowMonthDropdown(false); }}
                                                className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                                            >
                                                {isAr ? 'الكل' : 'All'}
                                            </button>
                                            {(isAr ? MONTHS_AR : MONTHS_EN).map((m, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => { onDateChange?.(i, selectedYear); setShowMonthDropdown(false); }}
                                                    className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${selectedMonth === i
                                                        ? 'bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold'
                                                        : 'text-gov-charcoal dark:text-white'}`}
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
                                            ? 'bg-gov-forest text-white dark:bg-gov-button dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {selectedYear !== null ? selectedYear : (isAr ? 'السنة' : 'Year')}
                                        <ChevronDown size={12} className={`transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showYearDropdown && (
                                        <div className="absolute top-full mt-2 left-0 rtl:right-0 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gray-200 dark:border-gov-border/15 py-1 w-32 z-50">
                                            <button
                                                onClick={() => { onDateChange?.(selectedMonth, null); setShowYearDropdown(false); }}
                                                className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                                            >
                                                {isAr ? 'الكل' : 'All'}
                                            </button>
                                            {YEARS.map(y => (
                                                <button
                                                    key={y}
                                                    onClick={() => { onDateChange?.(selectedMonth, y); setShowYearDropdown(false); }}
                                                    className={`w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${selectedYear === y
                                                        ? 'bg-gov-forest/10 dark:bg-gov-gold/20 text-gov-forest dark:text-gov-gold font-bold'
                                                        : 'text-gov-charcoal dark:text-white'}`}
                                                >
                                                    {y}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Clear Filters */}
                                {(selectedMonth !== null || selectedYear !== null) && (
                                    <button
                                        onClick={clearDateFilters}
                                        className="px-2 py-1.5 rounded-lg text-xs font-bold text-gov-cherry dark:text-red-400 hover:bg-gov-cherry/10 dark:hover:bg-red-400/10 transition-all flex items-center gap-1"
                                        title={isAr ? 'محو الفلتر' : 'Clear filters'}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Extra Slot */}
                        {extraFilters && (
                            <>
                                {showDateFilter && <div className="w-px h-5 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>}
                                <div className="flex w-full sm:w-auto flex-wrap items-stretch sm:items-center gap-2">
                                    {extraFilters}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Results Count */}
                    {totalCount !== undefined && (
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs md:text-sm text-gray-400 dark:text-white/50 font-medium whitespace-nowrap w-auto">
                            {totalCount} {countLabel || (isAr ? 'عنصر' : 'items')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
