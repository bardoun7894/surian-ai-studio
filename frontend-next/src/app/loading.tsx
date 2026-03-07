'use client';

/**
 * Next.js page-level loading fallback.
 *
 * The PageTransitionLoader (splash screen) already provides a rich branded
 * loading experience during route transitions.  This fallback only appears
 * when Suspense boundaries resolve *after* the splash has gone, so we keep
 * it deliberately minimal (a simple spinner) to avoid the eagle emblem badge
 * persisting / flashing a second time.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-dm-bg transition-colors">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-gov-gold animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
