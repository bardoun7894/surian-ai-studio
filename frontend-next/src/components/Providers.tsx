'use client';

import { ReactNode, useState, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ExternalLinkModal from '@/components/ExternalLinkModal';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [externalUrl, setExternalUrl] = useState<string | null>(null);

  // Handle External Links Interception
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        try {
          const url = new URL(target.href);
          // Check if external (different host)
          if (
            url.host !== window.location.host &&
            !target.href.startsWith('mailto:') &&
            !target.href.startsWith('tel:') &&
            !target.href.startsWith('javascript:') &&
            !target.href.startsWith('#')
          ) {
            e.preventDefault();
            setExternalUrl(target.href);
          }
        } catch (err) {
          // Invalid URL, ignore
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster
              position="top-center"
              richColors
              closeButton
              dir="rtl"
              toastOptions={{
                duration: 5000,
                classNames: {
                  toast: 'font-sans',
                }
              }}
            />
            <ExternalLinkModal
              isOpen={!!externalUrl}
              url={externalUrl || ''}
              onClose={() => setExternalUrl(null)}
              onConfirm={() => {
                if (externalUrl) window.open(externalUrl, '_blank');
                setExternalUrl(null);
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

