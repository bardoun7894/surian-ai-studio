'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuggestionPortal from '@/components/SuggestionsForm';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';

export default function SuggestionsPage() {
  const { language, t } = useLanguage();
  const [rules, setRules] = useState<string>('');

  // T031: Fetch configurable suggestion rules from admin settings
  useEffect(() => {
    API.settings.getByGroup('rules').then((data: any) => {
      const rulesKey = language === 'ar' ? 'suggestion_rules_ar' : 'suggestion_rules_en';
      if (data && data[rulesKey]) setRules(data[rulesKey]);
    }).catch(() => {});
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar />

      <main className="flex-grow pt-20 md:pt-24 overflow-hidden">
        {/* Complaints Navigation Banner */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="bg-white dark:bg-dm-surface border border-gov-gold/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-center sm:text-right">
              <p className="text-gov-forest dark:text-white font-bold text-sm">
                {t('suggestion_have_complaint')}
              </p>
              <p className="text-gray-500 dark:text-white/70 text-xs mt-1">
                {t('suggestion_complaint_desc')}
              </p>
            </div>
            <Link
              href="/complaints"
              className="px-6 py-2.5 bg-gov-gold text-gov-forest font-bold text-sm rounded-xl hover:bg-gov-gold/90 transition-colors whitespace-nowrap shadow-sm"
            >
              {t('suggestion_go_complaints')}
            </Link>
          </div>
        </div>

        {/* T031: Configurable suggestion submission rules */}
        {rules && (
          <div className="max-w-4xl mx-auto px-4 mt-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/20 rounded-xl p-4">
              <h3 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-2">
                {language === 'ar' ? 'قواعد تقديم المقترحات' : 'Suggestion Submission Rules'}
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 whitespace-pre-line">{rules}</p>
            </div>
          </div>
        )}

        <SuggestionPortal initialMode="submit" />

        {/* T032: Link to standalone suggestion tracking page */}
        <div className="max-w-4xl mx-auto px-4 mb-8 text-center">
          <Link
            href="/suggestions/track"
            className="text-sm text-gov-forest dark:text-gov-teal hover:underline font-bold"
          >
            {language === 'ar' ? 'صفحة متابعة المقترحات المستقلة' : 'Standalone Suggestion Tracking Page'}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
