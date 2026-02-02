'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Calendar, Scale, Loader2, Sparkles, X, ChevronDown } from 'lucide-react';
import { API } from '@/lib/repository';
import { Decree } from '@/types';
import { getLocalizedField } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { aiService } from '@/lib/aiService';

// Type label mappings
const typeLabels: Record<string, { ar: string; en: string }> = {
  'مرسوم تشريعي': { ar: 'مرسوم تشريعي', en: 'Legislative Decree' },
  'قانون': { ar: 'قانون', en: 'Law' },
  'قرار رئاسي': { ar: 'قرار رئاسي', en: 'Presidential Decree' },
  'تعميم': { ar: 'تعميم', en: 'Circular' },
  'decree': { ar: 'مرسوم', en: 'Decree' },
};

export default function DecreesPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const lang = language as 'ar' | 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-black">
      <Navbar />

      <main className="flex-grow pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-gold mb-4 flex items-center justify-center gap-3">
              <Scale size={32} className="text-gov-gold" />
              {isAr ? 'الجريدة الرسمية والتشريعات' : 'Official Gazette & Legislation'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {isAr
                ? 'البوابة الرسمية للوصول إلى كافة المراسيم التشريعية، القوانين، والقرارات الحكومية الصادرة في الجمهورية العربية السورية.'
                : 'The official portal for accessing all legislative decrees, laws, and government decisions issued in the Syrian Arab Republic.'}
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-gov-emeraldStatic p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {filterTypes.map(ft => (
                  <button
                    key={ft.value}
                    onClick={() => setFilterType(ft.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${filterType === ft.value ? 'bg-gov-emerald text-white border-gov-emerald' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                  >
                    {isAr ? ft.ar : ft.en}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-gov-teal" size={32} />
              </div>
            ) : decrees.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/20">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {isAr ? 'لا توجد وثائق مطابقة للبحث' : 'No documents match your search'}
                </p>
              </div>
            ) : (
              decrees.map((decree) => (
                <div key={decree.id} className="bg-white dark:bg-gov-emeraldStatic p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Icon Box */}
                    <div className="w-16 h-16 rounded-xl bg-gov-beige dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold shrink-0 border border-gray-100 dark:border-white/10 group-hover:bg-gov-forest group-hover:text-white transition-colors">
                      <FileText size={28} />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${decree.type === 'قانون' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          decree.type === 'مرسوم تشريعي' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                          {getTypeLabel(decree.type)}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded">
                          {isAr ? `رقم ${decree.number}` : `No. ${decree.number}`}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded">
                          {isAr ? `عام ${decree.year}` : `Year ${decree.year}`}
                        </span>
                      </div>

                      <h3 className="text-lg font-display font-bold text-gov-forest dark:text-gov-gold mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                        {getLocalizedField(decree, 'title', lang)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {getLocalizedField(decree, 'description', lang)}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{isAr ? `تاريخ الصدور: ${decree.date}` : `Issued: ${decree.date}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="self-center md:self-start flex flex-col gap-2">
                      <button
                        onClick={() => handleAISummary(decree)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-gold/10 text-gov-gold font-bold hover:bg-gov-gold hover:text-white transition-all text-sm"
                      >
                        <Sparkles size={16} />
                        {isAr ? 'ملخص ذكي' : 'AI Summary'}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-beige dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold font-bold hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-all text-sm border border-transparent hover:border-gov-forest dark:hover:border-gov-gold">
                        <Download size={16} />
                        {isAr ? 'تحميل PDF' : 'Download PDF'}
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white dark:bg-gov-emeraldStatic rounded-2xl p-8 border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl font-display font-bold text-gov-forest dark:text-gov-gold mb-6">
              {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr ? 'كيف أبحث عن مرسوم معين؟' : 'How do I search for a specific decree?'}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isAr ? 'استخدم شريط البحث الموحد في أعلى الصفحة للبحث برقم المرسوم أو عنوانه أو سنة صدوره.' : 'Use the unified search bar at the top of the page to search by decree number, title, or year of issuance.'}
                </p>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  {isAr ? 'ما الفرق بين المرسوم التشريعي والقانون؟' : 'What is the difference between a legislative decree and a law?'}
                  <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
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
          <div className="bg-white dark:bg-gov-forest rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
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
