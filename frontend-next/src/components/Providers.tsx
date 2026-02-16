'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LoadingProvider, useLoading } from '@/contexts/LoadingContext';
import ExternalLinkModal from '@/components/ExternalLinkModal';
import UserSatisfactionIndicator from '@/components/UserSatisfactionIndicator';
import dynamic from 'next/dynamic';
const ChatBot = dynamic(() => import('@/components/ChatBot'), { ssr: false });
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

// Component to handle link clicks with loading
function LinkClickHandler({ children }: { children: ReactNode }) {
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();
  const router = useRouter();
  const pendingNavigation = useRef<string | null>(null);
  
  // Stop loading when pathname changes (page loaded)
  useEffect(() => {
    if (pendingNavigation.current) {
      pendingNavigation.current = null;
      // Keep loading visible briefly after page load for smooth transition
      setTimeout(() => {
        stopLoading();
      }, 300);
    }
  }, [pathname, stopLoading]);

  // Handle pending navigation
  useEffect(() => {
    if (pendingNavigation.current) {
      // Small delay to allow loading screen to render
      const timeout = setTimeout(() => {
        if (pendingNavigation.current) {
          router.push(pendingNavigation.current);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [pendingNavigation.current, router]);

  // Handle link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        try {
          const url = new URL(target.href);
          const isExternal = url.host !== window.location.host;
          const isSpecialLink = target.href.startsWith('mailto:') || 
                               target.href.startsWith('tel:') || 
                               target.href.startsWith('javascript:') || 
                               target.href.startsWith('#') ||
                               target.getAttribute('download');
          
          // Handle external links
          if (isExternal && !isSpecialLink) {
            e.preventDefault();
            setExternalUrl(target.href);
            return;
          }
          
          // Handle internal navigation - show loading first
          if (!isExternal && !isSpecialLink && !target.target) {
            const href = target.getAttribute('href');
            if (!href || href.startsWith('#')) return;
            
            // Prevent default to show loading first
            e.preventDefault();
            
            // Start loading
            startLoading();
            
            // Store pending navigation
            pendingNavigation.current = href;
            
            // Trigger navigation effect
            window.dispatchEvent(new Event('pending-navigation'));
          }
        } catch (err) {
          // Invalid URL, ignore
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [startLoading]);

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
