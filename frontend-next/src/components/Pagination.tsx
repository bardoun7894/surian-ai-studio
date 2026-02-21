'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, lastPage, total, perPage, onPageChange, className = '' }: PaginationProps) {
  const { language } = useLanguage();

  if (lastPage <= 1) return null;

  const PrevIcon = language === 'ar' ? ChevronRight : ChevronLeft;
  const NextIcon = language === 'ar' ? ChevronLeft : ChevronRight;
  const FirstIcon = language === 'ar' ? ChevronsRight : ChevronsLeft;
  const LastIcon = language === 'ar' ? ChevronsLeft : ChevronsRight;

  // Generate page numbers to show
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible + 2) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < lastPage - 2) pages.push('...');

      pages.push(lastPage);
    }

    return pages;
  };

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 ${className}`}>
      {/* Results info */}
      <p className="text-sm text-gray-500 dark:text-white/50 font-bold">
        {language === 'ar'
          ? `عرض ${from} - ${to} من ${total} نتيجة`
          : `Showing ${from} - ${to} of ${total} results`}
      </p>

      {/* Page buttons */}
      <div className="flex items-center justify-center flex-wrap gap-1.5">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:inline-flex p-2.5 rounded-xl border border-gray-200 dark:border-gov-border/15 text-gray-500 dark:text-white/60 hover:bg-gov-teal hover:text-white hover:border-gov-teal disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all"
          title={language === 'ar' ? 'الصفحة الأولى' : 'First page'}
        >
          <FirstIcon size={16} />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gov-border/15 text-gray-500 dark:text-white/60 hover:bg-gov-teal hover:text-white hover:border-gov-teal disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all"
          title={language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
        >
          <PrevIcon size={16} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400 dark:text-white/30 select-none">...</span>
          ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[42px] h-11 rounded-xl font-bold text-sm transition-all ${
                  currentPage === page
                    ? 'bg-gov-teal text-white shadow-lg shadow-gov-teal/20 border border-gov-teal'
                    : 'border border-gray-200 dark:border-gov-border/15 text-gray-600 dark:text-white/70 hover:bg-gov-teal/10 hover:border-gov-teal/30'
                }`}
              >
              {page}
            </button>
          )
        )}

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gov-border/15 text-gray-500 dark:text-white/60 hover:bg-gov-teal hover:text-white hover:border-gov-teal disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all"
          title={language === 'ar' ? 'الصفحة التالية' : 'Next page'}
        >
          <NextIcon size={16} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(lastPage)}
          disabled={currentPage === lastPage}
          className="hidden sm:inline-flex p-2.5 rounded-xl border border-gray-200 dark:border-gov-border/15 text-gray-500 dark:text-white/60 hover:bg-gov-teal hover:text-white hover:border-gov-teal disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all"
          title={language === 'ar' ? 'الصفحة الأخيرة' : 'Last page'}
        >
          <LastIcon size={16} />
        </button>
      </div>
    </div>
  );
}
