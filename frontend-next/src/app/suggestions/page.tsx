'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuggestionPortal from '@/components/SuggestionsForm';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SuggestionsPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar />

      <main className="flex-grow pt-20 md:pt-24 overflow-hidden">
        {/* Complaints Navigation Banner */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="bg-white dark:bg-dm-surface border border-gov-gold/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-center sm:text-start">
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

        {/* T031: Suggestion rules are now shown inside SuggestionPortal Step 0 (Terms) to avoid duplication */}

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
