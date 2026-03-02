'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LoadingProvider, useLoading } from '@/contexts/LoadingContext';
import ExternalLinkModal from '@/components/ExternalLinkModal';
const UserSatisfactionIndicator = dynamic(() => import('@/components/UserSatisfactionIndicator'), { ssr: false });
import dynamic from 'next/dynamic';
const ChatBot = dynamic(() => import('@/components/ChatBot'), { ssr: false });
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

// Component to handle link clicks with loading
function LinkClickHandler({ children }: { children: ReactNode }) {
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const { startLoading } = useLoading();
  const router = useRouter();

  // Handle link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) {
        return;
      }

      try {
        const url = new URL(target.href, window.location.origin);
        const isExternal = url.host !== window.location.host;
        const isSpecialLink = target.href.startsWith('mailto:') ||
          target.href.startsWith('tel:') ||
          target.href.startsWith('javascript:') ||
          target.getAttribute('download') !== null;

        if (isExternal && !isSpecialLink) {
          e.preventDefault();
          setExternalUrl(target.href);
          return;
        }

        if (isExternal || isSpecialLink || target.target) {
          return;
        }

        const href = target.getAttribute('href');
        if (!href || href.startsWith('#')) {
          return;
        }

        e.preventDefault();
        startLoading();
        router.push(href);
      } catch {
        // Ignore malformed URLs.
      }
    };

    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [router, startLoading]);

  return (
    <>
      {children}
      <ExternalLinkModal
        isOpen={!!externalUrl}
        url={externalUrl || ''}
        onClose={() => setExternalUrl(null)}
        onConfirm={() => {
          if (externalUrl) window.open(externalUrl, '_blank');
          setExternalUrl(null);
        }}
      />
    </>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <LoadingProvider>
              <LinkClickHandler>
                {children}
              </LinkClickHandler>
            </LoadingProvider>
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
            <UserSatisfactionIndicator />
            <ChatBot />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
