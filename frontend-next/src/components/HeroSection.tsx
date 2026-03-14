'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { FileText, FileCheck, Scale, ArrowRight, ShieldCheck, Landmark, Activity, MessageSquare, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import NewsTicker from './NewsTicker';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonGrid, SkeletonList, SkeletonText } from '@/components/SkeletonLoader';

interface HeroSectionProps {
  hasBreakingNews?: boolean;
  onNewsLoaded?: (hasNews: boolean) => void;
}

// Generate particle styles only once on client side to avoid hydration mismatch
interface ParticleStyle {
  width: string;
  height: string;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ hasBreakingNews = false, onNewsLoaded }) => {
  const { t, language, direction } = useLanguage();
  const [particles, setParticles] = useState<ParticleStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Cycle through phrases for WOW animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate particles only on client side
  useEffect(() => {
    const generated = [...Array(20)].map(() => ({
      width: Math.random() * 6 + 2 + 'px',
      height: Math.random() * 6 + 2 + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDuration: Math.random() * 10 + 10 + 's',
      animationDelay: Math.random() * 5 + 's',
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(generated);
    // Simulate loading time for hero content
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<HTMLDivElement>(null);
  const eagleContentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const taglinesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Initial State Setup
      gsap.set(bgPatternRef.current, { scale: 1.1, opacity: 0 });

      // 2. Background Reveal
      tl.to(bgPatternRef.current, {
        opacity: 0.1,
        scale: 1,
        duration: 2,
        ease: "power2.out"
      });

      // 3. Logo Composition Sequence (Creative Government Style)
      const base = containerRef.current?.querySelector('#logo-base');
      const shield = containerRef.current?.querySelector('#logo-shield');

      // Phase 1: The Foundation (Eagle Base)
      if (base) {
        tl.fromTo(base,
          { y: 40, opacity: 0, scale: 0.95, filter: 'grayscale(100%)' },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'grayscale(0%)',
            duration: 1.5,
            ease: "power3.out"
          },
          "-=1.2"
        );
      }

      // Phase 2: The Core (Shield)
      if (shield) {
        tl.fromTo(shield,
          { scale: 3, opacity: 0, filter: 'blur(20px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: "expo.out"
          },
          "-=1.0"
        );
      }

      // 4. Glow Pulse
      if (glowRef.current) {
        tl.fromTo(glowRef.current,
          { opacity: 0, scale: 0.5 },
          { opacity: 0.6, scale: 1, duration: 1.5, ease: "sine.out" },
          "-=1.2"
        );
      }

      // 5. Text Cascade
      const textElements = textContainerRef.current?.querySelectorAll('.animate-text');
      if (textElements && textElements.length > 0) {
        tl.fromTo(textElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "back.out(1.2)" },
          "-=1.0"
        );
      }

      // 6. Buttons Entry
      const buttons = textContainerRef.current?.querySelectorAll('.animate-btn');
      if (buttons && buttons.length > 0) {
        tl.fromTo(buttons,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
          "-=0.5"
        );
      }

      // 7. Stats Pillars
      const stats = containerRef.current?.querySelectorAll('.animate-stat');
      if (stats && stats.length > 0) {
        tl.fromTo(stats,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
          "-=0.2"
        );
      }

      // 8. Hover Effects for Stat Items
      stats?.forEach(stat => {
        stat.addEventListener('mouseenter', () => {
          gsap.to(stat, { y: -5, duration: 0.3, ease: 'power2.out' });
        });
        stat.addEventListener('mouseleave', () => {
          gsap.to(stat, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
      });

      // Removed breathing/floating animations per T036 requirements to focus on cursor interaction


      // 9. Eagle Mouse Tracking Parallax Effect (UI-08)
      if (typeof window !== 'undefined') {
        const handleMouseMove = (e: MouseEvent) => {
          if (!eagleRef.current || !eagleContentRef.current) return;

          const { left, top, width, height } = eagleRef.current.getBoundingClientRect();
          const x = (e.clientX - left - width / 2) / 15; // Increased sensitivity for smaller area
          const y = (e.clientY - top - height / 2) / 15;

          gsap.to(eagleContentRef.current, {
            x: x,
            y: y,
            rotationY: x * 0.8,
            rotationX: -y * 0.8,
            duration: 0.6,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = () => {
          if (!eagleContentRef.current) return;
          gsap.to(eagleContentRef.current, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 1,
            ease: "power3.out"
          });
        };

        // Add event listener specifically to the eagle circle wrapper
        const eagleEl = eagleRef.current;
        if (eagleEl) {
          eagleEl.addEventListener('mousemove', handleMouseMove, { passive: true });
          eagleEl.addEventListener('mouseleave', handleMouseLeave);
        }

        // Cleanup
        return () => {
          if (eagleEl) {
            eagleEl.removeEventListener('mousemove', handleMouseMove);
            eagleEl.removeEventListener('mouseleave', handleMouseLeave);
          }
        };
      }

    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  // Update Eagle Parallax to be smoother and follow cursor
  useEffect(() => {
    if (typeof window === 'undefined' || !eagleRef.current || !eagleContentRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate normalized position (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      gsap.to(eagleContentRef.current, {
        rotationY: x * 15, // Rotate based on X
        rotationX: -y * 15, // Rotate based on Y
        x: x * 20, // Move slightly
        y: y * 20,
        duration: 1,
        ease: "power2.out"
      });

      // Move the shadow/glow in opposite direction for depth
      gsap.to(eagleRef.current?.querySelector('.eagle-glow'), {
        x: -x * 30,
        y: -y * 30,
        duration: 1.5,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className={`relative pt-2 pb-20 md:pt-0 md:pb-6 overflow-hidden bg-gov-beige dark:bg-dm-bg ${hasBreakingNews ? 'min-h-[calc(100svh-6rem)]' : 'min-h-[calc(100svh-3.5rem)] md:min-h-[calc(100svh-5rem)]'} h-auto md:h-[calc(100svh-5rem)] flex items-center justify-center transition-colors duration-700`}>
        {/* Backgrounds - Match exact styling of main component to prevent flash/line */}
        <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-10 pointer-events-none mix-blend-overlay scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-gov-beige/90 to-gov-beige dark:from-gov-brand/30 dark:via-gov-forest/95 dark:to-gov-forest pointer-events-none transition-colors duration-700"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-10">
            <div className="mb-8 md:mb-0 flex justify-center items-center md:w-5/12">
              <SkeletonText lines={1} className="w-72 md:w-[450px]" />
            </div>
            <div className="space-y-4 md:w-7/12 text-center md:text-start">
              <SkeletonText lines={3} className="max-w-xl mx-auto md:mx-0" />
              <SkeletonList rows={3} className="pt-2" />
              <SkeletonGrid cards={2} className="grid-cols-2 gap-4 pt-2" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className={`relative overflow-hidden bg-gov-beige dark:bg-dm-bg ${hasBreakingNews ? 'min-h-[calc(100svh-6rem)]' : 'min-h-[100svh] md:min-h-[calc(100svh-5rem)]'} flex flex-col items-center justify-center pt-8 md:pt-0 pb-16 md:pb-6 md:-mt-8 transition-colors duration-700`}>

      {/* Backgrounds */}
      <div ref={bgPatternRef} className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-10 pointer-events-none mix-blend-overlay scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-gov-beige/90 to-gov-beige dark:from-gov-brand/30 dark:via-gov-forest/95 dark:to-gov-forest pointer-events-none transition-colors duration-700"></div>

      {/* Animated Particles Layer - rendered only on client to avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute bg-gov-gold/20 rounded-full animate-float-particle"
            style={particle}
          ></div>
        ))}
        {/* Connection Lines (SVGs) */}
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20">
          <path d="M0,50 Q200,150 400,50 T800,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gov-gold animate-dash-draw" />
        </svg>
      </div>

      <div ref={glowRef} className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] md:w-[300px] md:h-[300px] bg-[radial-gradient(circle,rgba(185,167,121,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(9,66,57,0.3)_0%,transparent_70%)] pointer-events-none opacity-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">

        {/* The Golden Hawk */}
        <div ref={eagleRef} className="mb-4 md:mb-0 relative z-20 flex justify-center items-center md:w-auto md:order-1 flex-shrink-0">
          <div className="relative w-44 h-44 md:w-[260px] md:h-[260px] lg:w-[320px] lg:h-[320px] xl:w-[350px] xl:h-[350px] flex items-center justify-center perspective-1000 flex-shrink-0">
            <div className="eagle-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gov-gold/20 rounded-full blur-[80px] dark:bg-gov-brand/30"></div>
            <div className="absolute inset-0 rounded-full border border-gov-gold/20 dark:border-gov-border/15 shadow-[0_0_60px_rgba(185,167,121,0.2)]"></div>
            <div className="absolute inset-4 rounded-full border border-gov-teal/30 dark:border-gov-teal/20 animate-[spin_12s_linear_infinite]"></div>
            <div className="absolute inset-16 rounded-full border border-gov-gold/10"></div>
            <div className="absolute inset-8 rounded-full bg-mofa-teal dark:bg-gradient-to-br dark:from-gov-brand dark:to-gov-forest border border-gov-gold/30 shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden transform-style-3d">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              {/* Animated Logo Composition */}
              <div ref={eagleContentRef} className="relative w-full h-full flex items-center justify-center scale-[1.63]">
                {/* 1. Eagle Body (Base) */}
                <Image
                  id="logo-base"
                  src="/assets/logo/11.png"
                  alt="Eagle Base"
                  fill
                  priority
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-lg z-10"
                />

                {/* 2. Shield/Center (22) */}
                <Image
                  id="logo-shield"
                  src="/assets/logo/22.png"
                  alt="Shield"
                  fill
                  priority
                  className="absolute inset-0 w-full h-full object-contain z-20"
                />
              </div>
            </div>


          </div>
        </div>

        <div ref={textContainerRef} className={`space-y-1 md:space-y-4 relative z-20 md:flex-1 md:order-2 text-center ${language === 'ar' ? 'md:text-center md:-me-6 lg:-me-10' : 'md:text-start'} min-w-0 mt-2 md:mt-0`}>

          {/* Titles Group */}
          <div className={`flex flex-col items-center ${language === 'ar' ? 'md:items-center' : 'md:items-start'} w-full`}>
            <div className="animate-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gov-brand/10 border border-gov-gold/40 dark:border-gov-gold/30 backdrop-blur-md shadow-sm shadow-gov-gold/10 dark:shadow-none mb-3 opacity-0">
              <span className="w-2 h-2 rounded-full bg-gov-gold animate-pulse"></span>
              <span className="text-xs font-bold text-gov-forest dark:text-gov-gold tracking-wide uppercase">
                {t('republic_name')}
              </span>
            </div>

            <h1 className="animate-text text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold font-display text-gov-forest dark:text-gov-gold mb-2 md:mb-3 leading-tight drop-shadow-sm opacity-0">
              {t('ministry_name')} <span className="text-gov-teal dark:text-gov-gold relative inline-block">

                <svg className="absolute w-full h-2 -bottom-1 left-0 text-gov-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                </svg>
              </span>
            </h1>

            <div className="animate-text flex items-center justify-center gap-3 md:gap-5 mt-1 mb-1 w-full opacity-0">
              <div className={`h-[1px] w-6 md:w-16 bg-gradient-to-${direction === 'rtl' ? 'l' : 'r'} from-transparent to-gov-gold`}></div>
              <span className="text-sm sm:text-base md:text-2xl text-gov-sand dark:text-gov-gold font-display font-bold whitespace-nowrap drop-shadow-sm">
                {t('portal_name')}
              </span>
              <div className={`h-[1px] w-6 md:w-16 bg-gradient-to-${direction === 'rtl' ? 'r' : 'l'} from-transparent to-gov-gold`}></div>
            </div>

            {/* Strategic Messages - WOW Animation (appear last) */}
            <div className="h-10 md:h-20 flex items-center justify-center w-full overflow-hidden relative">
              <AnimatePresence mode="wait">
                {(() => {
                  const phrases = [
                    {
                      id: 1,
                      icon: ShieldCheck,
                      text: language === 'ar' ? 'بوابة آمنة' : 'Secure Gateway',
                      color: 'text-gov-teal dark:text-gov-teal'
                    },
                    {
                      id: 2,
                      icon: FileCheck,
                      text: language === 'ar' ? 'خدمات متكاملة' : 'Integrated Services',
                      color: 'text-gov-gold dark:text-gov-gold'
                    },
                    {
                      id: 3,
                      icon: Globe,
                      text: language === 'ar' ? 'مستقبل رقمي' : 'Digital Future',
                      color: 'text-gov-teal dark:text-gov-teal'
                    }
                  ];

                  const activePhrase = phrases[currentPhraseIndex];
                  const Icon = activePhrase.icon;

                  return (
                    <motion.div
                      key={activePhrase.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute flex items-center justify-center gap-3 w-full"
                    >
                      <Icon size={24} className={`${activePhrase.color} shrink-0`} />
                      <span className={`text-sm sm:text-base md:text-2xl font-bold ${activePhrase.color} font-display translate-y-[4px]`}>
                        {activePhrase.text}
                      </span>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>

          <div className={`grid grid-cols-3 sm:flex sm:flex-row items-center justify-center gap-4 sm:gap-4 pt-4 md:pt-6 w-full px-1 sm:px-0 mx-auto md:mx-0`}>
            {/* Our Services Button */}
            <Link
              href="/services"
              className="animate-btn group relative flex-1 sm:flex-initial sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 sm:px-8 sm:py-4 bg-gov-forest/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-[1.25rem] sm:rounded-3xl hover:text-white transition-colors duration-500 overflow-hidden shadow-md dark:shadow-xl border border-gov-forest/20 dark:border-gov-gold/30 sm:border-gov-forest/20 sm:dark:border-gov-gold/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
              <div className="absolute inset-0 border border-gov-gold/30 rounded-[1.25rem] sm:rounded-3xl group-hover:border-transparent transition-colors duration-500 -z-10 hidden sm:block" />

              <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10 shrink-0">
                <Landmark size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>

              <span className="text-[9px] sm:text-[16px] tracking-tight sm:tracking-wide relative z-10 font-bold text-center leading-tight">
                {language === 'ar' ? 'خدماتنا' : 'Our Services'}
              </span>
            </Link>

            {/* Our News Button */}
            <Link
              href="/news"
              className="animate-btn group relative flex-1 sm:flex-initial sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 sm:px-8 sm:py-4 bg-gov-forest/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-[1.25rem] sm:rounded-3xl hover:text-white transition-colors duration-500 overflow-hidden shadow-md dark:shadow-xl border border-gov-forest/20 dark:border-gov-gold/30 sm:border-gov-forest/20 sm:dark:border-gov-gold/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
              <div className="absolute inset-0 border border-gov-gold/30 rounded-[1.25rem] sm:rounded-3xl group-hover:border-transparent transition-colors duration-500 -z-10 hidden sm:block" />

              <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10 shrink-0">
                <FileText size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>

              <span className="text-[9px] sm:text-[16px] tracking-tight sm:tracking-wide relative z-10 font-bold text-center leading-tight">
                {language === 'ar' ? 'أخبارنا' : 'Our News'}
              </span>
            </Link>

            {/* Complaints & Suggestions Button */}
            <Link
              href="/complaints"
              className="animate-btn group relative flex-1 sm:flex-initial sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 py-4 sm:px-8 sm:py-4 bg-gov-forest/10 dark:bg-dm-surface/30 backdrop-blur-md font-bold text-gov-forest dark:text-white rounded-[1.25rem] sm:rounded-3xl hover:text-white transition-colors duration-500 overflow-hidden shadow-md dark:shadow-xl border border-gov-forest/20 dark:border-gov-gold/30 sm:border-gov-forest/20 sm:dark:border-gov-gold/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gov-forest via-gov-teal to-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
              <div className="absolute inset-0 border border-gov-gold/30 rounded-[1.25rem] sm:rounded-3xl group-hover:border-transparent transition-colors duration-500 -z-10 hidden sm:block" />

              <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gov-forest/10 dark:bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 border border-current/10 shrink-0">
                <MessageSquare size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>

              <span className="text-[9px] sm:text-[16px] tracking-tighter sm:tracking-wide relative z-10 font-bold text-center leading-tight">
                {language === 'ar' ? 'الشكاوى والمقترحات' : 'Complaints & Suggestions'}
              </span>
            </Link>
          </div>

          {/* Official Pillars - Stats Section */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-4 md:mt-6 border-t border-gov-charcoal/10 dark:border-gov-border/15 pt-4 w-full">
            {/* 24/7 Secure Portal */}
            <div className="animate-stat text-center group cursor-default flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-gov-forest dark:text-gov-gold group-hover:scale-110 transition-transform" />
                <span className="text-lg md:text-xl font-display font-bold text-gov-forest dark:text-gov-gold tabular-nums">24/7</span>
              </div>
              <span className="text-xs text-gov-stone dark:text-gov-beige/60 font-medium">{language === 'ar' ? 'بوابة آمنة' : 'Secure Portal'}</span>
            </div>

            <div className="w-px h-8 bg-gov-charcoal/10 dark:bg-gov-border/15" />

            {/* 100% Transparency */}
            <div className="animate-stat text-center group cursor-default flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FileText size={18} className="text-gov-forest dark:text-gov-gold group-hover:scale-110 transition-transform" />
                <span className="text-lg md:text-xl font-display font-bold text-gov-forest dark:text-gov-gold tabular-nums">100%</span>
              </div>
              <span className="text-xs text-gov-stone dark:text-gov-beige/60 font-medium">{language === 'ar' ? 'شفافية البيانات' : 'Data Transparency'}</span>
            </div>
          </div>
        </div>



      </div>

      {/* News Ticker Integrated - Positioned at the very bottom of the Hero section */}
      <div className="absolute bottom-2 md:bottom-10 left-1/2 -translate-x-1/2 z-30 w-[96%] md:w-[90%]">
        <NewsTicker
          onNewsLoaded={onNewsLoaded}
          className="rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.16)] border border-gov-gold/25 dark:border-gov-gold/20"
        />
      </div>
    </section>
  );
};

export default HeroSection;
