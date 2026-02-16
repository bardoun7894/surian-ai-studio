'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { FileText, FileCheck, Scale, ArrowRight, ShieldCheck, Landmark, Activity, MessageSquare, Sparkles } from 'lucide-react';
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
          eagleEl.addEventListener('mousemove', handleMouseMove);
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className={`relative pt-8 pb-20 md:pt-4 md:pb-6 overflow-hidden bg-gov-beige dark:bg-dm-bg ${hasBreakingNews ? 'min-h-[calc(100svh-6rem)]' : 'min-h-[calc(100svh-3.5rem)] md:min-h-[calc(100svh-4rem)]'} h-auto md:h-[calc(100svh-4rem)] flex items-center justify-center transition-colors duration-700`}>
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
    <section ref={containerRef} className={`relative pt-8 pb-20 md:pt-4 md:pb-6 overflow-hidden bg-gov-beige dark:bg-dm-bg ${hasBreakingNews ? 'min-h-[calc(100svh-6rem)]' : 'min-h-[calc(100svh-3.5rem)] md:min-h-[calc(100svh-4rem)]'} h-auto md:h-[calc(100svh-4rem)] flex items-center justify-center transition-colors duration-700`}>

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

      <div ref={glowRef} className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[380px] md:h-[380px] bg-[radial-gradient(circle,rgba(185,167,121,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(9,66,57,0.3)_0%,transparent_70%)] pointer-events-none opacity-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-10">

        {/* The Golden Hawk */}
        <div ref={eagleRef} className="mb-8 md:mb-0 relative z-20 flex justify-center items-center md:w-auto md:order-1 flex-shrink-0">
          <div className="relative w-56 h-56 md:w-[340px] md:h-[340px] lg:w-[420px] lg:h-[420px] xl:w-[460px] xl:h-[460px] flex items-center justify-center perspective-1000 flex-shrink-0">
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

        <div ref={textContainerRef} className="space-y-2 md:space-y-4 relative z-20 md:flex-1 md:order-2 text-center md:text-start min-w-0">

          {/* Titles Group */}
          <div className="flex flex-col items-center md:items-start">
            <div className="animate-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-gov-brand/10 border border-gov-gold/30 backdrop-blur-sm mb-3 opacity-0">
              <span className="w-2 h-2 rounded-full bg-gov-gold animate-pulse"></span>
              <span className="text-xs font-bold text-gov-forest dark:text-gov-gold tracking-wide uppercase">
                {t('republic_name')}
              </span>
            </div>

            <h1 className="animate-text text-2xl md:text-4xl lg:text-5xl font-bold font-display text-gov-forest dark:text-gov-gold mb-3 leading-tight drop-shadow-sm opacity-0">
              {t('ministry_name')} <span className="text-gov-teal dark:text-gov-gold relative inline-block">

                <svg className="absolute w-full h-2 -bottom-1 left-0 text-gov-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                </svg>
              </span>
            </h1>

            <div className="animate-text flex items-center justify-center md:justify-start gap-3 md:gap-5 mt-1 mb-2 md:mb-3 w-full opacity-0">
              <div className={`h-[1px] w-6 md:w-16 bg-gradient-to-${direction === 'rtl' ? 'l' : 'r'} from-transparent to-gov-gold`}></div>
              <span className="text-base md:text-2xl text-gov-sand dark:text-gov-gold font-display font-bold whitespace-nowrap drop-shadow-sm">
                {t('portal_name')}
              </span>
              <div className={`h-[1px] w-6 md:w-16 bg-gradient-to-${direction === 'rtl' ? 'r' : 'l'} from-transparent to-gov-gold`}></div>
            </div>

            {/* Strategic Messages - WOW Animation (appear last) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-6 w-full max-w-lg"
            >
              {[
                {
                  icon: ShieldCheck,
                  text: language === 'ar' ? 'بوابة آمنة' : 'Secure Gateway',
                  bg: 'bg-gov-forest/10 dark:bg-gov-brand/20',
                  border: 'border-gov-forest/20 dark:border-gov-gold/30',
                  iconColor: 'text-gov-teal'
                },
                {
                  icon: FileCheck,
                  text: language === 'ar' ? 'خدمات متكاملة' : 'Integrated Services',
                  bg: 'bg-gov-gold/10 dark:bg-gov-gold/20',
                  border: 'border-gov-gold/30',
                  iconColor: 'text-gov-gold'
                },
                {
                  icon: Sparkles,
                  text: language === 'ar' ? 'مستقبل رقمي' : 'Digital Future',
                  bg: 'bg-gov-teal/10 dark:bg-gov-teal/20',
                  border: 'border-gov-teal/30',
                  iconColor: 'text-gov-teal'
                }
              ].map((item, idx) => (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: {
                      opacity: 0,
                      scale: 0.3,
                      rotate: -15,
                      y: 50
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 12,
                        delay: 1.5 + (idx * 0.15) // Start after other animations (1.5s delay)
                      }
                    }
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.4 }
                  }}
                  className={`px-4 py-2 rounded-full ${item.bg} border ${item.border} text-sm md:text-base font-bold text-gov-forest dark:text-gov-gold flex items-center gap-2 cursor-default shadow-sm hover:shadow-lg transition-shadow`}
                >
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      delay: 2 + (idx * 0.2),
                      ease: "easeInOut"
                    }}
                  >
                    <item.icon size={16} className={item.iconColor} />
                  </motion.span>
                  {item.text}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start pt-1 md:pt-4 w-full px-4 md:px-0">
            <Link
              href="/services"
              className="animate-btn w-full sm:w-auto min-w-[160px] px-6 py-3 bg-gov-teal dark:bg-gov-brand text-white font-bold text-base hover:bg-gov-emerald transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group rounded-xl"
            >
              <Landmark size={18} />
              <span>{language === 'ar' ? 'خدماتنا' : 'Our Services'}</span>
              <ArrowRight className={`transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1`} size={16} />
            </Link>

            <Link
              href="/news"
              className="animate-btn w-full sm:w-auto min-w-[160px] px-6 py-3 bg-gov-gold/10 text-gov-forest dark:text-gov-gold border border-gov-gold/30 font-bold text-base hover:bg-gov-gold/20 transition-all flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm"
            >
              <FileText size={18} />
              <span>{language === 'ar' ? 'أخبارنا' : 'Our News'}</span>
            </Link>

            <Link
              href="/complaints"
              className="animate-btn w-full sm:w-auto min-w-[160px] px-6 py-3 bg-gov-gold/10 text-gov-forest dark:text-gov-gold border border-gov-gold/30 font-bold text-base hover:bg-gov-gold/20 transition-all flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm"
            >
              <MessageSquare size={18} />
              <span>{language === 'ar' ? 'الشكاوى والمقترحات' : 'Complaints & Suggestions'}</span>
            </Link>
          </div>

          {/* Official Pillars - Stats Section */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-4 md:mt-6 border-t border-gov-charcoal/10 dark:border-gov-border/15 pt-4">
            {/* 24/7 Secure Portal */}
            <div className="animate-stat text-center group cursor-default">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-gov-forest dark:text-gov-gold group-hover:scale-110 transition-transform" />
                <span className="text-lg md:text-xl font-display font-bold text-gov-forest dark:text-gov-gold tabular-nums">24/7</span>
              </div>
              <span className="text-xs text-gov-stone dark:text-gov-beige/60 font-medium">{language === 'ar' ? 'بوابة آمنة' : 'Secure Portal'}</span>
            </div>

            <div className="w-px h-8 bg-gov-charcoal/10 dark:bg-gov-border/15" />

            {/* 100% Transparency */}
            <div className="animate-stat text-center group cursor-default">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={18} className="text-gov-forest dark:text-gov-gold group-hover:scale-110 transition-transform" />
                <span className="text-lg md:text-xl font-display font-bold text-gov-forest dark:text-gov-gold tabular-nums">100%</span>
              </div>
              <span className="text-xs text-gov-stone dark:text-gov-beige/60 font-medium">{language === 'ar' ? 'شفافية البيانات' : 'Data Transparency'}</span>
            </div>
          </div>
        </div>



      </div>

      {/* News Ticker Integrated - Centered within hero */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] md:w-[90%]">
        <NewsTicker
          onNewsLoaded={onNewsLoaded}
          className="rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.16)] border border-gov-gold/25 dark:border-gov-gold/20"
        />
      </div>
    </section >
  );
};

export default HeroSection;
