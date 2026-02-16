'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLoading } from '@/contexts/LoadingContext';

interface PageTransitionLoaderProps {
  children: React.ReactNode;
}

const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({ children }) => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { isLoading, stopLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [displayLoading, setDisplayLoading] = useState(false);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isLoading) {
      setDisplayLoading(true);
      setProgress(0);
      
      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
    } else {
      // Complete animation
      setProgress(100);
      const timeout = setTimeout(() => {
        setDisplayLoading(false);
        setProgress(0);
      }, 300);
      
      return () => clearTimeout(timeout);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading]);

  // Stop loading when pathname changes (page loaded) - handles both
  // link click navigations and programmatic navigations (router.replace/push)
  // We track the pathname at the time loading started to detect actual changes.
  const loadingStartPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading && !loadingStartPathRef.current) {
      loadingStartPathRef.current = pathname;
    }
    if (!isLoading) {
      loadingStartPathRef.current = null;
    }
  }, [isLoading, pathname]);

  useEffect(() => {
    // If loading and pathname has changed from when loading started, stop loading
    if (isLoading && loadingStartPathRef.current && pathname !== loadingStartPathRef.current) {
      const timeout = setTimeout(() => {
        stopLoading();
      }, 300);
      return () => clearTimeout(timeout);
    }
    // Also handle the case where loading is triggered on the same page
    // (e.g., route resolves instantly)
    if (isLoading) {
      const fallback = setTimeout(() => {
        stopLoading();
      }, 500);
      return () => clearTimeout(fallback);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Safety timeout: ensure loading screen never gets stuck
  useEffect(() => {
    if (!isLoading) return;
    const safetyTimeout = setTimeout(() => {
      stopLoading();
    }, 4000);
    return () => clearTimeout(safetyTimeout);
  }, [isLoading, stopLoading]);

  return (
    <>
      <AnimatePresence>
        {displayLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-gov-beige/95 dark:bg-dm-bg/95 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-5 dark:opacity-10 pointer-events-none" />
            
            {/* Dark mode vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none hidden dark:block" />
            
            {/* Main Loading Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex flex-col items-center gap-8"
            >
              {/* Eagle Logo with Animated Ring */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Dark mode glow effect */}
                <div className="absolute inset-0 rounded-full bg-gov-gold/10 dark:bg-gov-gold/20 blur-3xl animate-pulse" />
                
                {/* Outer spinning ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-gov-gold/30 border-t-gov-gold dark:border-gov-gold/40 dark:border-t-gov-gold shadow-[0_0_30px_rgba(185,167,121,0.2)] dark:shadow-[0_0_40px_rgba(185,167,121,0.4)]"
                />
                
                {/* Middle ring (opposite direction) */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-gov-teal/20 border-b-gov-teal dark:border-gov-teal/30 dark:border-b-gov-teal"
                />
                
                {/* Inner glow */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gov-forest/5 to-gov-gold/5 dark:from-gov-brand/20 dark:to-gov-gold/20 dark:shadow-[inset_0_0_30px_rgba(185,167,121,0.2)]" />
                
                {/* Eagle Image */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative z-10"
                >
                  <Image
                    src="/assets/logo/11.png"
                    alt="Loading"
                    width={100}
                    height={100}
                    className="drop-shadow-2xl dark:drop-shadow-[0_0_20px_rgba(185,167,121,0.5)]"
                    style={{ width: 'auto', height: 'auto' }}
                    priority
                  />
                </motion.div>
              </div>

              {/* Loading Text */}
              <div className="text-center space-y-3">
                <motion.h3
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl md:text-2xl font-bold text-gov-forest dark:text-gov-gold"
                >
                  {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </motion.h3>
                
                <p className="text-sm text-gov-forest/70 dark:text-white/80 font-medium">
                  {language === 'ar'
                    ? 'وزارة الاقتصاد والصناعة'
                    : 'Ministry of Economy and Industry'
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-64 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden dark:shadow-[0_0_10px_rgba(185,167,121,0.2)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold dark:from-gov-brand dark:via-gov-teal dark:to-gov-gold rounded-full shadow-[0_0_10px_rgba(185,167,121,0.3)] dark:shadow-[0_0_15px_rgba(185,167,121,0.6)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Loading Indicators */}
              <div className="flex items-center gap-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-3 h-3 rounded-full bg-gov-gold dark:shadow-[0_0_10px_rgba(185,167,121,0.6)]"
                  />
                ))}
              </div>
            </motion.div>

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-gov-gold/30 dark:border-gov-gold/20" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-gov-gold/30 dark:border-gov-gold/20" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-gov-gold/30 dark:border-gov-gold/20" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-gov-gold/30 dark:border-gov-gold/20" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </>
  );
};

export default PageTransitionLoader;
