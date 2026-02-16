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
    <div className={`bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 ${className}`}>
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
