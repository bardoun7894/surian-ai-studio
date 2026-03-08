'use client';
import { useEffect } from 'react';

/**
 * #523: Global handler for ChunkLoadError on slow connections.
 * Catches chunk-load failures and reloads the page once.
 * A sessionStorage flag prevents infinite reload loops.
 */
export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const msg = event.message || '';
      if (
        msg.includes('ChunkLoadError') ||
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module')
      ) {
        event.preventDefault();
        const key = 'chunk_reload_attempted';
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          window.location.reload();
        }
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason?.message || event.reason || '');
      if (
        reason.includes('ChunkLoadError') ||
        reason.includes('Loading chunk') ||
        reason.includes('Failed to fetch dynamically imported module')
      ) {
        event.preventDefault();
        const key = 'chunk_reload_attempted';
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          window.location.reload();
        }
      }
    };

    // Clear the reload flag on successful page load
    sessionStorage.removeItem('chunk_reload_attempted');

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
