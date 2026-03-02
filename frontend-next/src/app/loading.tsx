'use client';

import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gov-beige dark:bg-dm-bg transition-colors">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-5 dark:opacity-5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <LoadingSpinner size={80} />
      </div>
    </div>
  );
}
