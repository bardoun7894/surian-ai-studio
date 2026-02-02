'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuggestionPortal from '@/components/SuggestionsForm';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SuggestionsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-black transition-colors duration-500">
      <Navbar />

      <main className="flex-grow pt-14 md:pt-16 overflow-hidden">
        {/* Complaints Navigation Banner */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="bg-white dark:bg-gov-emeraldStatic border border-gov-gold/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-center sm:text-right">
              <p className="text-gov-forest dark:text-white font-bold text-sm">
                {t('suggestion_have_complaint')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
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

        <SuggestionPortal initialMode="submit" />
      </main>

      <Footer />
    </div>
  );
}
