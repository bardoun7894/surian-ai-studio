'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Calendar, Scale, Loader2, Sparkles, X } from 'lucide-react';
import { API } from '@/lib/repository';
import { Decree } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { aiService } from '@/lib/aiService';

export default function DecreesPage() {
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

  const handleAISummary = async (decree: Decree) => {
    setSummaryModal({ isOpen: true, title: decree.title, summary: '', loading: true });
    try {
      const textToSummarize = `${decree.title}. ${decree.description}`;
      const summary = await aiService.summarize(textToSummarize);
      setSummaryModal(prev => ({ ...prev, summary, loading: false }));
    } catch (e) {
      setSummaryModal(prev => ({ ...prev, summary: 'فشل في إنشاء الملخص. يرجى المحاولة مرة أخرى.', loading: false }));
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

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest">
      <Navbar />

      <main className="flex-grow pt-14 md:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gov-forest dark:text-white mb-4 flex items-center justify-center gap-3">
              <Scale size={32} className="text-gov-gold" />
              الجريدة الرسمية والتشريعات
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              البوابة الرسمية للوصول إلى كافة المراسيم التشريعية، القوانين، والقرارات الحكومية الصادرة في الجمهورية العربية السورية.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">

              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="بحث برقم المرسوم، السنة، أو العنوان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 rtl:pl-12 rtl:pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gov-charcoal dark:text-white focus:border-gov-emerald focus:ring-1 focus:ring-gov-emerald/20 transition-all outline-none"
                />
                <Search className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${filterType === 'all' ? 'bg-gov-emerald text-white border-gov-emerald' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  الكل
                </button>
                {['مرسوم تشريعي', 'قانون', 'قرار رئاسي', 'تعميم'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${filterType === type ? 'bg-gov-emerald text-white border-gov-emerald' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                  >
                    {type}
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
                <p className="text-gray-500 dark:text-gray-400">لا توجد وثائق مطابقة للبحث</p>
              </div>
            ) : (
              decrees.map((decree) => (
                <div key={decree.id} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 hover:shadow-lg transition-all duration-300 group">
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
                          {decree.type}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded">رقم {decree.number}</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/10 px-2 py-1 rounded">عام {decree.year}</span>
                      </div>

                      <h3 className="text-lg font-display font-bold text-gov-forest dark:text-white mb-2 group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                        {decree.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {decree.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>تاريخ الصدور: {decree.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="self-center md:self-start flex flex-col gap-2">
                      <button
                        onClick={() => handleAISummary(decree)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-gold/10 text-gov-gold font-bold hover:bg-gov-gold hover:text-white transition-all text-sm"
                      >
                        <Sparkles size={16} />
                        ملخص ذكي
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-beige dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold font-bold hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-all text-sm border border-transparent hover:border-gov-forest dark:hover:border-gov-gold">
                        <Download size={16} />
                        تحميل PDF
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
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
                <h3 className="font-bold">ملخص ذكي للمرسوم</h3>
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
