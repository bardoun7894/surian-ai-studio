'use client';

import React from 'react';

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 dark:bg-white/5 rounded animate-pulse ${i === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-gold-sm border border-gray-100 dark:border-white/10 ${className}`}>
      <div className="h-48 bg-gray-200 dark:bg-white/5 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="h-5 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-full" />
        <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-1/2" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-md animate-pulse w-20" />
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-md animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/5 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-1/2" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-16 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ cards = 6, className = '' }: { cards?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}


/** M11.10: Decree/document list skeleton */
export function SkeletonDecreeList({ rows = 6, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10"
        >
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-3/4" />
            <div className="flex items-center gap-3">
              <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-md animate-pulse w-20" />
              <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-md animate-pulse w-16" />
              <div className="h-5 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse w-14" />
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

/** M11.10: Service card skeleton (with workflow stages) */
export function SkeletonServiceCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 ${className}`}>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/5 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-full" />
        <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-2/3" />
        {/* Workflow stages skeleton */}
        <div className="flex items-center gap-1 px-2 py-2.5 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5 min-w-[68px]">
                <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-white/5 animate-pulse" />
                <div className="h-2 w-12 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
              </div>
              {idx < 3 && <div className="h-0.5 w-5 mx-1 bg-gray-200 dark:bg-white/5" />}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/** M11.10: Announcement card skeleton */
export function SkeletonAnnouncementCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-white/5 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 p-4 md:p-8 min-h-[320px] md:min-h-[360px] ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-4 md:mb-6">
        <div className="h-7 w-20 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
        <div className="h-6 w-28 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
      </div>
      <div className="h-6 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-3/4 mb-2" />
      <div className="h-6 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse w-1/2 mb-4 md:mb-6" />
      <div className="space-y-2 mb-6">
        <div className="h-3.5 bg-gray-200 dark:bg-white/5 rounded animate-pulse w-full" />
        <div className="h-3.5 bg-gray-200 dark:bg-white/5 rounded animate-pulse w-5/6" />
        <div className="h-3.5 bg-gray-200 dark:bg-white/5 rounded animate-pulse w-2/3" />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
        <div className="h-8 w-8 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
      </div>
    </div>
  );
}

/** M11.10: Hero section skeleton */
export function SkeletonHero({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-6">
          <div className="h-5 w-32 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse mx-auto" />
          <div className="h-10 md:h-14 w-2/3 max-w-xl bg-gray-200 dark:bg-white/5 rounded-2xl animate-pulse mx-auto" />
          <div className="h-5 w-1/2 max-w-lg bg-gray-200 dark:bg-white/5 rounded-full animate-pulse mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="h-12 w-36 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
            <div className="h-12 w-36 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
