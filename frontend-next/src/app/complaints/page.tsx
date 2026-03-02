'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComplaintPortal from '@/components/ComplaintPortal';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ComplaintsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar />

      <main className="flex-grow pt-16 md:pt-[5.75rem]">
        {/* Suggestions Navigation Banner */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="bg-white dark:bg-dm-surface border border-gov-gold/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-center sm:text-start">
              <p className="text-gov-forest dark:text-gov-gold font-bold text-sm">
                {t('complaint_have_suggestion')}
              </p>
              <p className="text-gray-500 dark:text-white/70 text-xs mt-1">
                {t('complaint_suggestion_desc')}
              </p>
            </div>
            <Link
              href="/suggestions"
              className="px-6 py-2.5 bg-gov-gold text-gov-forest font-bold text-sm rounded-xl hover:bg-gov-gold/90 transition-colors whitespace-nowrap shadow-sm"
            >
              {t('complaint_go_suggestions')}
            </Link>
          </div>
        </div>

        <ComplaintPortal initialMode="submit" />
      </main>

      <Footer />
    </div>
  );
}
