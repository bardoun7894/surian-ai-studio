'use client';
import { usePageLoading } from '@/hooks/usePageLoading';

import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, Calendar, ArrowLeft, ArrowRight, Bell, AlertCircle, ChevronDown, Loader2, X, Share2, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import { getLocalizedField, formatDate as formatDateUtil } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShareMenu from '@/components/ShareMenu';
// DownloadMenu removed - M9.6: no download on listing cards
import Link from 'next/link';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import Pagination from '@/components/Pagination';

interface Announcement {
  id: string;
  title: string | { ar: string; en: string };
  date: string;
  type: 'urgent' | 'important' | 'general' | 'tender' | 'job';
  description: string | { ar: string; en: string };
  category: string;
  expires_at?: string;
}

const isExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

const MONTHS_AR = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: { ar: 'مناقصة عامة لتوريد معدات صناعية للمناطق الصناعية', en: 'General Tender for Supplying Industrial Equipment to Industrial Zones' },
    date: '2025-01-12',
    type: 'tender',
    category: 'tender',
    description: { ar: 'تعلن وزارة الاقتصاد والصناعة عن مناقصة عامة لتوريد معدات صناعية للمناطق الصناعية. آخر موعد للتقديم: 30/01/2025', en: 'The Ministry of Economy and Industry announces a general tender for supplying industrial equipment to industrial zones. Submission deadline: 30/01/2025' },
    expires_at: '2025-01-30'
  },
  {
    id: '2',
    title: { ar: 'تمديد مهلة التقديم على برنامج تمويل المشاريع الصغيرة', en: 'Extension of Application Deadline for SME Financing Program' },
    date: '2025-01-10',
    type: 'urgent',
    category: 'finance',
    description: { ar: 'تم تمديد مهلة التقديم على برنامج تمويل المشاريع الصغيرة والمتوسطة حتى نهاية الشهر الحالي', en: 'The application deadline for the SME financing program has been extended until the end of the current month' },
    expires_at: '2025-01-31'
  },
  {
    id: '3',
    title: { ar: 'دورة تدريبية في إدارة الجودة الصناعية', en: 'Training Course in Industrial Quality Management' },
    date: '2025-01-08',
    type: 'general',
    category: 'training',
    description: { ar: 'تعلن الإدارة العامة للصناعة عن دورة تدريبية مجانية في إدارة الجودة للمنشآت الصناعية. التسجيل مفتوح حتى 15/01/2025', en: 'The General Directorate of Industry announces a free training course in quality management for industrial facilities. Registration open until 15/01/2025' },
    expires_at: '2025-01-15'
  },
  {
    id: '4',
    title: { ar: 'تحديث منصة التراخيص الصناعية الإلكترونية', en: 'Update of Electronic Industrial Licensing Platform' },
    date: '2025-01-05',
    type: 'important',
    category: 'tech',
    description: { ar: 'سيتم تحديث منصة التراخيص الصناعية الإلكترونية يوم السبت القادم من الساعة 12 ليلاً حتى 6 صباحاً', en: 'The electronic industrial licensing platform will be updated next Saturday from 12:00 AM to 6:00 AM' }
  },
  {
    id: '5',
    title: { ar: 'فرص عمل جديدة في القطاع الصناعي', en: 'New Job Opportunities in Industrial Sector' },
    date: '2025-01-03',
    type: 'job',
    category: 'job',
    description: { ar: 'إعلان عن وظائف شاغرة في المناطق الصناعية تشمل: مهندسين صناعيين، فنيين، إداريين', en: 'Announcement of vacancies in industrial zones including: industrial engineers, technicians, administrators' },
    expires_at: '2025-02-15'
  },
  {
    id: '6',
    title: { ar: 'مناقصة لتأهيل المنطقة الصناعية في عدرا', en: 'Tender for Rehabilitation of Adra Industrial Zone' },
    date: '2025-01-02',
    type: 'tender',
    category: 'tender',
    description: { ar: 'إعلان عن مناقصة لتأهيل وصيانة البنية التحتية في المنطقة الصناعية بعدرا. كراسة الشروط متوفرة في مقر الوزارة', en: 'Tender announcement for rehabilitation and maintenance of infrastructure in Adra Industrial Zone. Conditions booklet available at the Ministry headquarters' },
    expires_at: '2025-02-28'
  },
  {
    id: '7',
    title: { ar: 'تعليق العمل بسبب العطلة الرسمية', en: 'Suspension of Work Due to Official Holiday' },
    date: '2024-12-30',
    type: 'important',
    category: 'admin',
    description: { ar: 'تعلن وزارة الاقتصاد والصناعة عن تعليق العمل في الإدارات خلال فترة عطلة رأس السنة', en: 'The Ministry of Economy and Industry announces suspension of work in departments during the New Year holiday' }
  },
  {
    id: '8',
    title: { ar: 'برنامج منح دراسية للموظفين', en: 'Scholarship Program for Employees' },
    date: '2024-12-28',
    type: 'general',
    category: 'training',
    description: { ar: 'إعلان عن برنامج منح دراسية للموظفين الحكوميين للحصول على شهادات عليا في الإدارة العامة', en: 'Announcement of a scholarship program for government employees to obtain higher degrees in public administration' },
    expires_at: '2024-12-15'
  },
  {
    id: '9',
    title: { ar: 'مسابقة توظيف في وزارة الاقتصاد والصناعة', en: 'Employment Competition at Ministry of Economy and Industry' },
    date: '2024-12-25',
    type: 'job',
    category: 'job',
    description: { ar: 'تعلن وزارة الاقتصاد والصناعة عن مسابقة لتعيين 50 موظفاً في الفئة الثانية من حملة الإجازة الجامعية', en: 'The Ministry of Economy and Industry announces a competition to appoint 50 employees in the second category for university degree holders' },
    expires_at: '2025-01-20'
  },
  {
    id: '10',
    title: { ar: 'تغيير مواعيد الدوام الرسمي', en: 'Change of Official Working Hours' },
    date: '2024-12-20',
    type: 'important',
    category: 'admin',
    description: { ar: 'إعلان هام بخصوص تغيير مواعيد الدوام الرسمي في الدوائر الحكومية اعتباراً من بداية العام الجديد', en: 'Important announcement regarding the change of official working hours in government departments starting from the beginning of the new year' }
  }
];

export default function AnnouncementsPage() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);
    usePageLoading(loading);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(9);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const isAr = language === 'ar';

  // Debounce search input
  useEffect(() => {
    let cancelled = false;
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await API.announcements.getPaginated(
          currentPage,
          perPage,
          statusFilter !== 'all' ? statusFilter : undefined,
          debouncedSearch || undefined
        );
        if (cancelled) return;
        setAnnouncements(response.data);
        setHasFetched(true);
        setCurrentPage(response.current_page);
        setLastPage(response.last_page);
        setTotalItems(response.total);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAnnouncements();
    return () => { cancelled = true; };
  }, [currentPage, perPage, statusFilter, debouncedSearch]);

  const statusFilters = [
    { value: 'all', label: isAr ? 'الكل' : 'All' },
    { value: 'active', label: isAr ? 'النشطة' : 'Active' },
    { value: 'expired', label: isAr ? 'المنتهية' : 'Expired' }
  ];

  const types = [
    { value: 'all', label: t('filter_all_types') },
    { value: 'urgent', label: t('type_urgent') },
    { value: 'important', label: t('type_important') },
    { value: 'tender', label: t('type_tender') },
    { value: 'job', label: t('type_job') },
    { value: 'general', label: t('type_general') },
  ];

  const getTypeStyles = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-gov-red/5 dark:bg-dm-surface',
          border: 'border-gov-red/20 dark:border-gov-red/30',
          badge: 'bg-gov-red text-white',
          icon: <AlertCircle size={14} />
        };
      case 'important':
        return {
          bg: 'bg-gov-gold/10 dark:bg-dm-surface',
          border: 'border-gov-gold/30 dark:border-gov-border/35',
          badge: 'bg-gov-gold text-gov-forest',
          icon: <Bell size={14} />
        };
      case 'tender':
        return {
          bg: 'bg-gov-teal/5 dark:bg-dm-surface',
          border: 'border-gov-teal/20 dark:border-gov-teal/30',
          badge: 'bg-gov-teal text-white',
          icon: <Megaphone size={14} />
        };
      case 'job':
        return {
          bg: 'bg-gov-emeraldLight/5 dark:bg-dm-surface',
          border: 'border-gov-emeraldLight/20 dark:border-gov-emeraldLight/30',
          badge: 'bg-gov-emeraldLight text-white',
          icon: <Megaphone size={14} />
        };
      default:
        return {
          bg: 'bg-gov-sand/5 dark:bg-dm-surface',
          border: 'border-gov-sand/20 dark:border-gov-border/15',
          badge: 'bg-gov-sand text-white',
          icon: <Megaphone size={14} />
        };
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tender': return t('cat_tender');
      case 'job': return t('cat_job');
      case 'training': return t('cat_training');
      case 'tech': return t('cat_tech');
      case 'admin': return t('cat_admin');
      case 'finance': return t('cat_finance');
      default: return cat;
    }
  }

  const getTypeLabel = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent': return t('type_urgent');
      case 'important': return t('type_important');
      case 'tender': return t('type_tender');
      case 'job': return t('type_job');
      case 'general': return t('type_general');
      default: return type;
    }
  };

  const formatDate = (dateStr: string): string => {
    return formatDateUtil(dateStr, language as "ar" | "en");
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setSelectedType('all');
    setSelectedMonth(null);
    setSelectedYear(null);
    setCurrentPage(1);
  };

  const dataSource = hasFetched ? announcements : MOCK_ANNOUNCEMENTS;
  const filteredAnnouncements = dataSource.filter((announcement: any) => {
    const matchesType = selectedType === 'all' || announcement.type === selectedType;

    // Month/Year filtering (local — lightweight filters)
    const date = new Date(announcement.date);
    const matchesMonth = selectedMonth === null || date.getMonth() === selectedMonth;
    const matchesYear = selectedYear === null || date.getFullYear() === selectedYear;

    return matchesType && matchesMonth && matchesYear;
  });

  const hasActiveFilters = statusFilter !== 'all' || searchQuery || selectedType !== 'all' || selectedMonth !== null || selectedYear !== null;

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar />

      <main className="flex-grow pt-0">
        <div className="min-h-screen bg-gov-beige dark:bg-dm-bg pb-16 transition-colors duration-500">
          {/* Hero Header */}
          <div className="bg-gov-forest dark:bg-gov-forest/80 py-10 md:py-16 mb-6 md:mb-8 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gov-gold/20 rounded-full mb-3 md:mb-4">
                <Megaphone className="text-gov-gold w-4 h-4 md:w-5 md:h-5" />
                <span className="text-gov-gold font-bold text-xs md:text-sm">
                  {t('announcements_portal_badge')}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-3 md:mb-4">
                {t('announcements_title')}
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {t('announcements_subtitle')}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Advanced Filters Section */}
            <div className="bg-white dark:bg-dm-surface rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 dark:border-gov-border/15 shadow-sm">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value as 'all' | 'active' | 'expired')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${statusFilter === filter.value
                        ? 'bg-gov-forest text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gov-charcoal dark:bg-dm-surface dark:border-gov-border/30 dark:text-white hover:border-gov-gold/30'
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-4 items-end">
                {/* Search */}
                <div className="flex-1 min-w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                    {isAr ? 'البحث' : 'Search'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isAr ? 'ابحث في الإعلانات...' : 'Search announcements...'}
                      className="w-full border border-gray-200 dark:border-gov-border/30 rounded-lg px-4 py-2 pl-10 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:border-gov-forest focus:ring-1 focus:ring-gov-forest dark:focus:ring-gov-gold transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="min-w-[160px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                    {isAr ? 'النوع' : 'Type'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full py-2 px-3 ltr:pr-9 rtl:pl-9 rounded-lg bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/30 text-sm text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-forest transition-colors cursor-pointer appearance-none"
                    >
                      {types.map(type => (
                        <option key={type.value} value={type.value} className="bg-white dark:bg-dm-surface dark:text-white">
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Month Filter */}
                <div className="min-w-[140px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                    {isAr ? 'الشهر' : 'Month'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMonth ?? ''}
                      onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full py-2 px-3 ltr:pr-9 rtl:pl-9 rounded-lg bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/30 text-sm text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-forest transition-colors cursor-pointer appearance-none"
                    >
                      <option value="" className="bg-white dark:bg-dm-surface dark:text-white">
                        {isAr ? 'جميع الأشهر' : 'All Months'}
                      </option>
                      {(isAr ? MONTHS_AR : MONTHS_EN).map((month, index) => (
                        <option key={index} value={index} className="bg-white dark:bg-dm-surface dark:text-white">
                          {month}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Year Filter */}
                <div className="min-w-[120px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                    {isAr ? 'السنة' : 'Year'}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedYear ?? ''}
                      onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full py-2 px-3 ltr:pr-9 rtl:pl-9 rounded-lg bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/30 text-sm text-gov-charcoal dark:text-white focus:outline-none focus:border-gov-forest transition-colors cursor-pointer appearance-none"
                    >
                      <option value="" className="bg-white dark:bg-dm-surface dark:text-white">
                        {isAr ? 'جميع السنوات' : 'All Years'}
                      </option>
                      {YEARS.map(year => (
                        <option key={year} value={year} className="bg-white dark:bg-dm-surface dark:text-white">
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gov-charcoal dark:text-white hover:text-gov-red dark:hover:text-red-400 transition-colors"
                    >
                      <RotateCcw size={16} />
                      {isAr ? 'إعادة ضبط' : 'Clear Filters'}
                    </button>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gov-border/15">
                <p className="text-sm text-gray-600 dark:text-white/70">
                  {isAr
                    ? `عرض ${filteredAnnouncements.length} من ${totalItems} إعلان`
                    : `Showing ${filteredAnnouncements.length} of ${totalItems} announcements`
                  }
                </p>
              </div>
            </div>

            {/* Announcements List - 3x3 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-8">
                  <SkeletonGrid cards={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
                </div>
              ) : filteredAnnouncements.map((announcement) => {
                const styles = getTypeStyles(announcement.type);
                const expired = isExpired(announcement.expires_at);
                const cardBorderClass = expired ? 'border-gov-red/30 dark:border-gov-red/30' : styles.border;
                const cardBgClass = expired ? 'bg-red-50/50 dark:bg-red-950/10' : styles.bg;
                return (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.id}`}
                    className={`${cardBgClass} ${cardBorderClass} border rounded-2xl p-6 hover:shadow-[5px_5px_10px_#b9a779] transition-all duration-300 group block cursor-pointer flex flex-col min-h-[340px] ${expired ? 'opacity-60' : ''}`}
                  >
                    {/* Expired Badge */}
                    {expired && (
                      <div className="mb-3">
                        <span className="bg-gov-red text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                          {isAr ? 'انتهى التقديم' : 'Application Closed'}
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`${styles.badge} px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1`}>
                        {styles.icon}
                        {getTypeLabel(announcement.type)}
                      </span>
                      <span className="px-2.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded-full text-xs font-medium text-gray-600 dark:text-white/70 border border-transparent dark:border-gov-border/15">
                        {getCategoryLabel(announcement.category)}
                      </span>
                    </div>

                    {/* Title - M9.7: Consistent height */}
                    <h3 className={`text-lg font-bold mb-3 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors line-clamp-2 min-h-[3.25rem] ${expired ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gov-forest dark:text-white'}`}>
                      {getLocalizedField(announcement, 'title', language as 'ar' | 'en')}
                    </h3>

                    {/* Description - M9.7: Consistent height with line-clamp */}
                    <p className="text-gray-600 dark:text-white/70 text-sm mb-4 line-clamp-3 min-h-[3.75rem] flex-grow">
                      {getLocalizedField(announcement, 'description', language as 'ar' | 'en')}
                    </p>

                    {/* M9.4: Share button only (print available on detail page, M9.6: download removed) */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          setShareData({
                            title: getLocalizedField(announcement, 'title', language as 'ar' | 'en'),
                            url: `${window.location.origin}/announcements/${announcement.id}`
                          });
                        }}
                        className="p-2 rounded-lg bg-gov-forest/5 dark:bg-white/5 text-gov-forest dark:text-gov-teal hover:bg-gov-forest/10 dark:hover:bg-white/10 transition-colors"
                        title={isAr ? 'مشاركة' : 'Share'}
                        aria-label={isAr ? 'مشاركة' : 'Share'}
                      >
                        <Share2 size={14} />
                      </button>
                    </div>

                    {/* Footer (Date & CTA) - Push to bottom */}
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-gray-400 dark:text-white/70 text-xs">
                        <Calendar size={14} />
                        <span>{formatDate(announcement.date)}</span>
                      </div>

                      {announcement.expires_at && (
                        <div className={`text-xs font-medium flex items-center gap-1.5 ${expired ? 'text-gov-red dark:text-gov-red' : 'text-gov-teal dark:text-gov-teal'}`}>
                          <Calendar size={12} />
                          {expired
                            ? (isAr ? `انتهى بتاريخ: ${formatDate(announcement.expires_at)}` : `Expired on: ${formatDate(announcement.expires_at)}`)
                            : (isAr ? `ينتهي بتاريخ: ${formatDate(announcement.expires_at)}` : `Expires on: ${formatDate(announcement.expires_at)}`)
                          }
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-gov-gold dark:text-gov-teal font-bold text-sm uppercase tracking-wide group-hover:gap-2.5 transition-all">
                        <span>{t('announcements_read_more') || t('announcements_details')}</span>
                        <div className="w-5 h-5 rounded-full bg-gov-gold/10 flex items-center justify-center group-hover:bg-gov-gold/20 transition-colors">
                          <ArrowIcon size={11} className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>

                );
              })}
            </div>


            {/* Empty State */}
            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-10 md:py-16">
                <Megaphone className="mx-auto text-gray-300 dark:text-white/70 mb-3 md:mb-4 w-12 h-12 md:w-16 md:h-16" />
                <h3 className="text-lg md:text-xl font-bold text-gray-500 dark:text-white/70 mb-2">
                  {t('announcements_no_results')}
                </h3>
                <p className="text-gray-400 dark:text-white/70">
                  {t('announcements_try_search')}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-gov-forest text-white rounded-lg font-medium hover:bg-gov-forest/90 transition-colors"
                  >
                    {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredAnnouncements.length > 0 && (
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                total={totalItems}
                perPage={perPage}
                onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 md:mt-16 bg-white dark:bg-dm-surface rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gov-border/15 max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4 md:mb-6">
              {t('announcements_faq_title')}
            </h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {t('announcements_faq_q1')}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                  {t('announcements_faq_a1')}
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {t('announcements_faq_q2')}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                  {t('announcements_faq_a2')}
                </p>
              </details>
            </div>
            <div className="mt-4 text-center">
              <Link href="/faq" className="text-gov-teal dark:text-gov-gold font-bold text-sm hover:underline">
                {language === 'ar' ? 'عرض جميع الأسئلة الشائعة ←' : '→ View all FAQs'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ShareMenu
        isOpen={!!shareData}
        onClose={() => setShareData(null)}
        title={shareData?.title || ''}
        url={shareData?.url || ''}
      />


    </div>
  );
}

