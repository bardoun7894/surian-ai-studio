"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLoading } from "@/contexts/LoadingContext";

interface PageTransitionLoaderProps {
  children: React.ReactNode;
}

const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { isLoading, isPageDataLoading, stopLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [displayLoading, setDisplayLoading] = useState(false);
  const routeKey = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  // The loader stays visible if the route transition is active OR
  // if a page has registered a data load that hasn't completed yet
  const shouldShowLoader = isLoading || (displayLoading && isPageDataLoading);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (shouldShowLoader) {
      setDisplayLoading(true);
      // Don't reset progress if we're continuing to show (page data still loading)
      if (!isPageDataLoading || progress === 0) {
        setProgress(0);
      }

      // Simulate progress - natural easing (faster start, slows near end)
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 92) return prev;
          if (prev < 30) return prev + Math.random() * 12 + 3;
          if (prev < 60) return prev + Math.random() * 6 + 1;
          if (prev < 80) return prev + Math.random() * 3;
          return prev + Math.random() * 1.5;
        });
      }, 350);
    } else {
      // Complete animation
      setProgress(100);
      const timeout = setTimeout(() => {
        setDisplayLoading(false);
        setProgress(0);
      }, 400);

      return () => clearTimeout(timeout);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [shouldShowLoader]);

  // Stop the route-level loading when route changes (path or query)
  const loadingStartRouteRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading && !loadingStartRouteRef.current) {
      loadingStartRouteRef.current = routeKey;
    }
    if (!isLoading) {
      loadingStartRouteRef.current = null;
    }
  }, [isLoading, routeKey]);

  // Stop route-level loading when route actually changes
  useEffect(() => {
    if (!isLoading) return;
    if (
      loadingStartRouteRef.current &&
      routeKey !== loadingStartRouteRef.current
    ) {
      stopLoading();
    }
  }, [routeKey, isLoading, stopLoading]);

  // Safety timeout: ensure loading screen never gets stuck (12s max)
  useEffect(() => {
    if (!displayLoading) return;
    const safetyTimeout = setTimeout(() => {
      stopLoading();
      setDisplayLoading(false);
      setProgress(0);
    }, 12000);
    return () => clearTimeout(safetyTimeout);
  }, [displayLoading, stopLoading]);

  return (
    <>
      <AnimatePresence>
        {displayLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-gov-beige dark:bg-dm-bg backdrop-blur-sm flex flex-col items-center justify-center"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-5 dark:opacity-5 pointer-events-none" />

            {/* Balanced radial atmosphere for both themes */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.05)_45%,rgba(0,0,0,0.08)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(185,167,121,0.08)_0%,rgba(185,167,121,0.02)_45%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />

            {/* Main Loading Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex flex-col items-center gap-6 md:gap-8"
            >
              {/* Republic Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center"
              >
                <p className="text-[11px] md:text-xs text-gov-forest/50 dark:text-gov-gold/40 font-semibold tracking-[0.2em] uppercase">
                  {language === "ar"
                    ? "\u0627\u0644\u062C\u0645\u0647\u0648\u0631\u064A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0648\u0631\u064A\u0629"
                    : "Syrian Arab Republic"}
                </p>
              </motion.div>

              {/* Eagle Logo with Animated Ring */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                {/* Dark mode glow effect */}
                <div className="absolute inset-0 rounded-full bg-gov-gold/10 dark:bg-gov-gold/20 blur-3xl animate-pulse" />

                {/* Outer spinning ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-gov-gold/30 border-t-gov-gold dark:border-gov-gold/35 dark:border-t-gov-gold shadow-[0_0_30px_rgba(185,167,121,0.2)] dark:shadow-[0_0_34px_rgba(185,167,121,0.35)]"
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
                    filter: [
                      "brightness(1)",
                      "brightness(1.1)",
                      "brightness(1)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <Image
                    src="/assets/logo/11.png"
                    alt="Loading"
                    width={100}
                    height={100}
                    className="drop-shadow-2xl dark:drop-shadow-[0_0_20px_rgba(185,167,121,0.5)] w-16 h-16 md:w-[100px] md:h-[100px]"
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />
                </motion.div>
              </div>

              {/* Ministry Name and Loading Text */}
              <div className="text-center space-y-2 md:space-y-3 px-4 md:px-6 py-3 md:py-4">
                <motion.h3
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg md:text-xl lg:text-2xl font-bold text-gov-forest dark:text-dm-text font-display"
                >
                  {language === "ar"
                    ? "\u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u0627\u0642\u062A\u0635\u0627\u062F \u0648\u0627\u0644\u0635\u0646\u0627\u0639\u0629"
                    : "Ministry of Economy and Industry"}
                </motion.h3>

                <p className="text-xs md:text-sm text-gov-forest/60 dark:text-dm-text-secondary font-medium tracking-wide">
                  {language === "ar"
                    ? "\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u062A\u0648\u0649..."
                    : "Loading content..."}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-48 md:w-64 h-1 md:h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden dark:shadow-[0_0_10px_rgba(185,167,121,0.2)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold dark:from-gov-brand dark:via-gov-teal dark:to-gov-gold rounded-full shadow-[0_0_10px_rgba(185,167,121,0.3)] dark:shadow-[0_0_15px_rgba(185,167,121,0.6)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Loading Indicators */}
              <div className="flex items-center gap-2 md:gap-3">
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
                    className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gov-gold dark:shadow-[0_0_10px_rgba(185,167,121,0.6)]"
                  />
                ))}
              </div>
            </motion.div>

            {/* Corner Decorations */}
            <div className="absolute top-4 md:top-8 left-4 md:left-8 w-12 md:w-16 h-12 md:h-16 border-l-2 border-t-2 border-gov-gold/30 dark:border-gov-gold/20" />
            <div className="absolute top-4 md:top-8 right-4 md:right-8 w-12 md:w-16 h-12 md:h-16 border-r-2 border-t-2 border-gov-gold/30 dark:border-gov-gold/20" />
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 w-12 md:w-16 h-12 md:h-16 border-l-2 border-b-2 border-gov-gold/30 dark:border-gov-gold/20" />
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 w-12 md:w-16 h-12 md:h-16 border-r-2 border-b-2 border-gov-gold/30 dark:border-gov-gold/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
};

export default PageTransitionLoader;
