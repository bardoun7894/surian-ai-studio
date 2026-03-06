"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLoading } from "@/contexts/LoadingContext";

interface PageTransitionLoaderProps {
  children: React.ReactNode;
}

const MIN_LOADING_TIME = 600; // ms - avoid flash
const SAFETY_TIMEOUT = 10000; // ms - never get stuck

/**
 * Returns a promise that resolves once:
 *  1. document.readyState === 'complete'
 *  2. All <img> elements that are at least partially in the viewport have loaded
 */
function waitForPageReady(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      // 1. Document itself must be complete (sub-resources like stylesheets)
      if (document.readyState !== "complete") {
        const onLoad = () => {
          // Once load fires, still check images
          waitForVisibleImages().then(resolve);
        };
        window.addEventListener("load", onLoad, { once: true });
        // Fallback if load already fired but readyState is lagging
        setTimeout(() => {
          window.removeEventListener("load", onLoad);
          waitForVisibleImages().then(resolve);
        }, 3000);
        return;
      }

      // Document is complete, now wait for visible images
      waitForVisibleImages().then(resolve);
    };

    // Small delay to let the new route render its initial DOM
    setTimeout(check, 150);
  });
}

/**
 * Waits for all images that are in or near the viewport to finish loading.
 */
function waitForVisibleImages(): Promise<void> {
  return new Promise((resolve) => {
    const images = Array.from(document.querySelectorAll("img"));
    const visiblePending = images.filter((img) => {
      if (img.complete) return false;
      if (img.naturalWidth > 0) return false;
      // Check if image is in/near viewport
      const rect = img.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight + 200 &&
        rect.bottom > -200 &&
        rect.left < window.innerWidth + 200 &&
        rect.right > -200;
      return inViewport;
    });

    if (visiblePending.length === 0) {
      resolve();
      return;
    }

    // Wait for all visible pending images (with per-image timeout)
    let remaining = visiblePending.length;
    const settled = new Set<HTMLImageElement>();
    const done = (img: HTMLImageElement) => {
      if (settled.has(img)) return;
      settled.add(img);
      remaining--;
      if (remaining <= 0) resolve();
    };
    visiblePending.forEach((img) => {
      img.addEventListener("load", () => done(img), { once: true });
      img.addEventListener("error", () => done(img), { once: true });
      // Per-image timeout so a broken image doesn't block forever
      setTimeout(() => done(img), 4000);
    });
  });
}

const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { isLoading, stopLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [displayLoading, setDisplayLoading] = useState(false);
  const routeKey = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  // Track when loading started (wall clock) and the route at that moment
  const loadingStartTimeRef = useRef<number>(0);
  const loadingStartRouteRef = useRef<string | null>(null);
  // Whether we have already scheduled a "finish" sequence for this loading cycle
  const finishScheduledRef = useRef(false);

  // -- Animated progress bar --
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isLoading) {
      setDisplayLoading(true);
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 12;
        });
      }, 250);
    } else {
      // Complete animation
      setProgress(100);
      const timeout = setTimeout(() => {
        setDisplayLoading(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading]);

  // -- Record when loading starts --
  useEffect(() => {
    if (isLoading && !loadingStartRouteRef.current) {
      loadingStartRouteRef.current = routeKey;
      loadingStartTimeRef.current = Date.now();
      finishScheduledRef.current = false;
    }
    if (!isLoading) {
      loadingStartRouteRef.current = null;
      finishScheduledRef.current = false;
    }
  }, [isLoading, routeKey]);

  // -- Finish loading gracefully --
  const finishLoading = useCallback(async () => {
    if (finishScheduledRef.current) return;
    finishScheduledRef.current = true;

    // Wait for page to be truly ready (images, document state)
    await waitForPageReady();

    // Enforce minimum display time so the loader doesn't flash
    const elapsed = Date.now() - loadingStartTimeRef.current;
    const remaining = MIN_LOADING_TIME - elapsed;
    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, remaining));
    }

    stopLoading();
  }, [stopLoading]);

  // -- Detect route change -> begin finish sequence --
  useEffect(() => {
    if (!isLoading) return;
    if (
      loadingStartRouteRef.current &&
      routeKey !== loadingStartRouteRef.current
    ) {
      finishLoading();
    }
  }, [routeKey, isLoading, finishLoading]);

  // -- Safety timeout: prevent infinite loading --
  useEffect(() => {
    if (!isLoading) return;
    const safetyTimeout = setTimeout(() => {
      stopLoading();
    }, SAFETY_TIMEOUT);
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
              className="relative flex flex-col items-center gap-8"
            >
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

              {/* Loading Text */}
              <div className="text-center space-y-2 md:space-y-3 px-4 md:px-6 py-3 md:py-4">
                <motion.h3
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg md:text-xl lg:text-2xl font-bold text-gov-forest dark:text-dm-text"
                >
                  {language === "ar" ? "جاري التحميل..." : "Loading..."}
                </motion.h3>

                <p className="text-xs md:text-sm text-gov-forest/75 dark:text-dm-text-secondary font-medium tracking-[0.01em]">
                  {language === "ar"
                    ? "وزارة الاقتصاد والصناعة"
                    : "Ministry of Economy and Industry"}
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
