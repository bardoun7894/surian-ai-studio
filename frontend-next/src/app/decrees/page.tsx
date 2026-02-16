'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Scale, Loader2, Sparkles, X, ChevronDown } from 'lucide-react';
import { API } from '@/lib/repository';
import { Decree } from '@/types';
import { getLocalizedField } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { aiService } from '@/lib/aiService';
import FavoriteButton from '@/components/FavoriteButton';

// Type label mappings
const typeLabels: Record<string, { ar: string; en: string }> = {
  'مرسوم تشريعي': { ar: 'مرسوم تشريعي', en: 'Legislative Decree' },
  'قانون': { ar: 'قانون', en: 'Law' },
  'قرار رئاسي': { ar: 'قرار رئاسي', en: 'Presidential Decree' },
  'تعميم': { ar: 'تعميم', en: 'Circular' },
  'decree': { ar: 'مرسوم', en: 'Decree' },
};

const MONTHS_AR = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function DecreesPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const lang = language as 'ar' | 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [summaryModal, setSummaryModal] = useState<{ isOpen: boolean; title: string; summary: string; loading: boolean }>({
    isOpen: false,
    title: '',
    summary: '',
    loading: false
  });

  const getTypeLabel = (type: string) => {
    const labels = typeLabels[type];
    if (labels) return isAr ? labels.ar : labels.en;
    // Fallback: check for type_en on the decree object
    return type;
  };

  const handleAISummary = async (decree: Decree) => {
    const title = getLocalizedField(decree, 'title', lang);
    setSummaryModal({ isOpen: true, title, summary: '', loading: true });
    try {
      const desc = getLocalizedField(decree, 'description', lang);
      const textToSummarize = `${title}. ${desc}`;
      const summary = await aiService.summarize(textToSummarize);
      setSummaryModal(prev => ({ ...prev, summary, loading: false }));
    } catch (e) {
      setSummaryModal(prev => ({
        ...prev,
        summary: isAr ? 'فشل في إنشاء الملخص. يرجى المحاولة مرة أخرى.' : 'Failed to generate summary. Please try again.',
        loading: false
      }));
    }
  };

  useEffect(() => {
    const fetchDecrees = async () => {
      setLoading(true);
      try {
        const data = await API.decrees.search(searchTerm, filterType);
        setDecrees(data);
      } catch (e) {
        console.error("Failed to fetch decrees", e);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchDecrees();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType]);

  // Filter type buttons - Arabic values are sent to API, display is localized
  const filterTypes = [
    { value: 'all', ar: 'الكل', en: 'All' },
    { value: 'مرسوم تشريعي', ar: 'مرسوم تشريعي', en: 'Legislative Decree' },
    { value: 'قانون', ar: 'قانون', en: 'Law' },
    { value: 'قرار رئاسي', ar: 'قرار رئاسي', en: 'Presidential Decree' },
    { value: 'تعميم', ar: 'تعميم', en: 'Circular' },
  ];

  const filteredDecrees = decrees.filter(decree => {
    const date = new Date(decree.date);
    const matchesMonth = selectedMonth === null || date.getMonth() === selectedMonth;
    const matchesYear = selectedYear === null || date.getFullYear() === selectedYear;
    return matchesMonth && matchesYear;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg">
      <Navbar />

      <main className="flex-grow pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-2 flex items-center justify-center gap-2">
              <Scale size={26} className="text-gov-gold" />
              {isAr ? 'الجريدة الرسمية والتشريعات' : 'Official Gazette & Legislation'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/70 max-w-2xl mx-auto">
              {isAr
                ? 'البوابة الرسمية للوصول إلى كافة المراسيم التشريعية، القوانين، والقرارات الحكومية الصادرة في الجمهورية العربية السورية.'
                : 'The official portal for accessing all legislative decrees, laws, and government decisions issued in the Syrian Arab Republic.'}
            </p>
          </div>

          {/* Unified Filter Bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2 bg-white dark:bg-dm-surface rounded-xl border border-gray-100 dark:border-gov-border/15 px-3 py-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Type Filters */}
              {filterTypes.map(ft => (
                <button
                  key={ft.value}
                  onClick={() => setFilterType(ft.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterType === ft.value ? 'bg-gov-emerald text-white' : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  {isAr ? ft.ar : ft.en}
                </button>
              ))}

              <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1"></div>

              {/* Month Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowMonthDropdown(!showMonthDropdown); setShowYearDropdown(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedMonth !== null
                    ? 'bg-gov-forest text-white dark:bg-gov-button dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                >
                  {selectedMonth !== null
                    ? (isAr ? MONTHS_AR[selectedMonth] : MONTHS_EN[selectedMonth])
                    : (isAr ? 'الشهر' : 'Month')}
                  <Calendar size={12} />
                </button>
                {showMonthDropdown && (
                  <div className="absolute top-full mt-1 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gray-200 dark:border-gov-border/15 py-1 w-44 z-50 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedMonth(null); setShowMonthDropdown(false); }}
                      className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                    >
                      {isAr ? 'الكل' : 'All'}
                    </button>
                    {(isAr ? MONTHS_AR : MONTHS_EN).map((m, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedMonth(i); setShowMonthDropdown(false); }}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedYear !== null
                    ? 'bg-gov-forest text-white dark:bg-gov-button dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                >
                  {selectedYear !== null ? selectedYear : (isAr ? 'السنة' : 'Year')}
                  <Calendar size={12} />
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full mt-1 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gray-200 dark:border-gov-border/15 py-1 w-32 z-50">
                    <button
                      onClick={() => { setSelectedYear(null); setShowYearDropdown(false); }}
                      className="w-full text-right rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                    >
                      {isAr ? 'الكل' : 'All'}
                    </button>
                    {YEARS.map(y => (
                      <button
                        key={y}
                        onClick={() => { setSelectedYear(y); setShowYearDropdown(false); }}
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
                  onClick={() => { setSelectedMonth(null); setSelectedYear(null); }}
                  className="px-2 py-1.5 rounded-lg text-xs font-bold text-gov-cherry hover:bg-gov-cherry/10 transition-all flex items-center gap-1"
                >
                  <X size={12} />
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>
            <span className="text-xs text-gray-400 dark:text-white/50 font-medium">
              {filteredDecrees.length} {isAr ? 'وثيقة' : 'documents'}
            </span>
          </div>

          {/* Results */}
          <div className="space-y-1.5">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-gov-teal" size={32} />
              </div>
            ) : filteredDecrees.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gov-card/10 rounded-xl border border-dashed border-gray-200 dark:border-gov-border/25">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 dark:text-white/70">
                  {isAr ? 'لا توجد وثائق مطابقة للبحث' : 'No documents match your search'}
                </p>
              </div>
            ) : (
              filteredDecrees.map((decree) => (
                <div key={decree.id} className="bg-white dark:bg-dm-surface px-4 py-3 rounded-xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 hover:shadow-md transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row gap-3 items-start">

                    {/* Icon Box */}
                    <div className="w-11 h-11 rounded-lg bg-gov-beige dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold shrink-0 border border-gray-100 dark:border-gov-border/15 group-hover:bg-gov-forest group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${decree.type === 'قانون' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          decree.type === 'مرسوم تشريعي' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-gray-100 text-gray-700 dark:bg-dm-surface dark:text-white/70'
                          }`}>
                          {getTypeLabel(decree.type)}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded">
                          {isAr ? `رقم ${decree.number}` : `No. ${decree.number}`}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded">
                          {isAr ? `عام ${decree.year}` : `Year ${decree.year}`}
                        </span>
                      </div>

                      <h3 className="text-sm font-display font-bold text-gov-forest dark:text-gov-gold mb-0.5 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors leading-snug">
                        {getLocalizedField(decree, 'title', lang)}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-white/70 mb-1.5 leading-relaxed line-clamp-2">
                        {getLocalizedField(decree, 'description', lang)}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{isAr ? `تاريخ الصدور: ${decree.date}` : `Issued: ${decree.date}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="self-center md:self-start flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAISummary(decree)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gov-gold/10 text-gov-gold font-bold hover:bg-gov-gold hover:text-white transition-all text-xs"
                      >
                        <Sparkles size={14} />
                        {isAr ? 'ملخص' : 'Summary'}
                      </button>
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gov-beige dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold font-bold hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-all text-xs">
                        <Download size={14} />
                        PDF
                      </button>
                      <FavoriteButton
                        contentType="law"
                        contentId={String(decree.id)}
                        size={16}
                        variant="default"
                        metadata={{
                          title: getLocalizedField(decree, 'title', lang),
                          description: getLocalizedField(decree, 'description', lang),
                          url: `/decrees`
                        }}
                      />
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white dark:bg-dm-surface rounded-2xl p-8 border border-gray-100 dark:border-gov-border/15">
            <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6">
              {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr ? 'كيف أبحث عن مرسوم معين؟' : 'How do I search for a specific decree?'}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                  {isAr ? 'استخدم شريط البحث الموحد في أعلى الصفحة للبحث برقم المرسوم أو عنوانه أو سنة صدوره.' : 'Use the unified search bar at the top of the page to search by decree number, title, or year of issuance.'}
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr ? 'ما الفرق بين المرسوم التشريعي والقانون؟' : 'What is the difference between a legislative decree and a law?'}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                  {isAr ? 'المرسوم التشريعي يصدر من رئيس الجمهورية ويكون له قوة القانون، بينما القانون يصدر من مجلس الشعب.' : 'A legislative decree is issued by the President and has the force of law, while a law is issued by Parliament.'}
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
          <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gov-border/15">
              <div className="flex items-center gap-2 text-gov-gold">
                <Sparkles size={20} />
                <h3 className="font-bold">{isAr ? 'ملخص ذكي للمرسوم' : 'AI Decree Summary'}</h3>
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
