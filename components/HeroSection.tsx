import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Building2, FileText, Scale, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  onNavigate: (view: ViewState) => void;
  hasBreakingNews?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, hasBreakingNews = false }) => {
  const { t, language, direction } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
      // "Rising with Dignity" - Slow, stable upward movement with fade
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
      // "Focusing Power" - Starts large and blurred, condenses into clarity
      if (shield) {
        tl.fromTo(shield,
          { scale: 3, opacity: 0, filter: 'blur(20px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: "expo.out" // Snappy but smooth finish
          },
          "-=1.0" // Overlap significantly with base entrance
        );
      }

      // 4. Glow Pulse
      tl.fromTo(glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.6, scale: 1, duration: 1.5, ease: "sine.out" },
        "-=1.2"
      );

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

      // --- Continuous Animations ---
      // Gentle Breathing (Scale)
      gsap.to(eagleRef.current, {
        scale: 1.02, // 100% -> 102%
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2 // Wait for entrance to finish
      });

      // Subtle Float (Vertical)
      gsap.to(eagleRef.current, {
        y: -5, // Float up 5px
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2
      });

      gsap.to(glowRef.current, {
        rotation: 360,
        duration: 120,
        repeat: -1,
        ease: "linear"
      });

      gsap.to(bgPatternRef.current, {
        y: -20,
        x: 10,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={`relative pt-12 pb-8 md:pt-24 md:pb-16 overflow-hidden bg-gov-beige dark:bg-gov-forest transition-colors duration-700 ${hasBreakingNews ? 'min-h-[50vh]' : 'min-h-[60vh]'} md:min-h-[85vh] flex items-center`}>

      {/* Background Decor */}
      <div ref={bgPatternRef} className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-5 pointer-events-none mix-blend-overlay scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-gov-beige dark:from-gov-forest/50 dark:to-gov-forest pointer-events-none"></div>

      {/* Dynamic Glow */}
      <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,rgba(185,167,121,0.12)_0%,transparent_70%)] pointer-events-none opacity-0 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">

        {/* The Golden Emblem (Modern Eagle) */}
        <div ref={eagleRef} className="relative z-30 flex justify-center items-center md:w-5/12 order-1 md:order-2">
          <div className="relative w-64 h-64 md:w-[450px] md:h-[450px] flex items-center justify-center">
            {/* Layers of rings and light */}
            <div className="absolute inset-0 rounded-full bg-gov-gold/5 blur-3xl animate-pulse-slow"></div>
            <div className="absolute inset-0 rounded-full border border-gov-gold/10 scale-110"></div>
            <div className="absolute inset-6 rounded-full border border-gov-gold/5 scale-95"></div>

            {/* Outer spinning ring */}
            <div className="absolute inset-2 rounded-full border-t-2 border-l border-gov-gold/40 animate-[spin_10s_linear_infinite]"></div>

            {/* Inner glow and emblem base */}
            <div className="absolute inset-10 rounded-full bg-mofa-teal shadow-[0_0_50px_rgba(5,66,57,0.4)] border border-gov-gold/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20"></div>

              {/* Composition of the official logo */}
              <div className="relative w-full h-full p-8 md:p-12 flex items-center justify-center">
                <img
                  id="logo-base"
                  src="/assets/logo/11.png"
                  alt="Eagle Base"
                  className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-10"
                />
                <img
                  id="logo-shield"
                  src="/assets/logo/22.png"
                  alt="Shield"
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-md z-20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Textual Content */}
        <div ref={textContainerRef} className="space-y-4 md:space-y-8 relative z-30 md:w-7/12 order-2 md:order-1 text-center md:text-start">

          <div className="space-y-4">
            <div className="animate-text inline-flex items-center gap-2 bg-gov-gold/10 border border-gov-gold/20 px-3 py-1 rounded-full mb-1">
              <ShieldCheck size={14} className="text-gov-gold" />
              <span className="text-[9px] md:text-[10px] font-bold text-gov-gold uppercase tracking-[0.15em]">
                {t('republic_name')}
              </span>
            </div>

            <h1 className="animate-text text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-gov-forest dark:text-white leading-[1.1] md:leading-[1.05] tracking-tight transition-colors">
              {t('ministry_name')}
            </h1>

            <div className="animate-text flex items-center justify-center md:justify-start gap-4">
              <div className="h-[2px] w-12 bg-gov-gold"></div>
              <span className="text-xl md:text-4xl text-gov-sand dark:text-gov-gold font-display font-bold whitespace-nowrap">
                {t('portal_name')}
              </span>
              <div className="h-[2px] flex-grow max-w-[100px] bg-gradient-to-r from-gov-gold to-transparent"></div>
            </div>

            <p className={`animate-text text-base md:text-xl text-gov-stone dark:text-gov-beige/80 leading-relaxed max-w-2xl font-medium dark:font-light ${direction === 'rtl' ? 'border-r-4 pr-6' : 'border-l-4 pl-6'} border-gov-gold transition-colors mx-auto md:mx-0 py-1`}>
              {t('unified_platform')}
              <span className="block text-sm md:text-lg text-gov-stone/60 dark:text-gov-beige/60 mt-2 font-normal">
                {t('secure_gateway')}
              </span>
            </p>
          </div>

          {/* CTA Buttons - Premium Hex Style */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
            <button
              onClick={() => onNavigate('SERVICES_GUIDE')}
              className="animate-btn relative overflow-hidden w-full sm:w-auto px-6 py-3 bg-gov-teal text-white font-bold text-base hover:shadow-[0_10px_30px_rgba(66,129,119,0.4)] transition-all flex items-center justify-center gap-2 group rounded-xl"
            >
              <Landmark size={18} />
              <span>{t('hero_services_btn')}</span>
              <ArrowRight className={`${direction === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-300`} size={16} />
            </button>

            <button
              onClick={() => onNavigate('DECREES')}
              className="animate-btn w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-gov-gold text-gov-forest dark:text-gov-gold font-bold text-base hover:bg-gov-gold hover:text-white dark:hover:text-gov-forest transition-all flex items-center justify-center gap-2 rounded-xl"
            >
              <FileText size={18} />
              <span>{t('hero_decrees_btn')}</span>
            </button>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-3 gap-4 md:gap-12 w-full max-w-2xl mt-8 border-t border-gov-charcoal/5 dark:border-gov-gold/10 pt-6">
            <div className="animate-stat text-center group cursor-default">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-3 group-hover:bg-gov-gold group-hover:text-white transition-all duration-500">
                <Building2 size={24} />
              </div>
              <div className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-white mb-1">1,500+</div>
              <div className="text-[10px] md:text-xs text-gov-stone/60 dark:text-gov-beige/50 font-bold uppercase tracking-widest">{t('stat_services')}</div>
            </div>

            <div className="animate-stat text-center group cursor-default">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-3 group-hover:bg-gov-gold group-hover:text-white transition-all duration-500">
                <ShieldCheck size={24} />
              </div>
              <div className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-white mb-1">24/7</div>
              <div className="text-[10px] md:text-xs text-gov-stone/60 dark:text-gov-beige/50 font-bold uppercase tracking-widest">{t('stat_secure')}</div>
            </div>

            <div className="animate-stat text-center group cursor-default">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-3 group-hover:bg-gov-gold group-hover:text-white transition-all duration-500">
                <Scale size={24} />
              </div>
              <div className="text-xl md:text-3xl font-display font-bold text-gov-forest dark:text-white mb-1">100%</div>
              <div className="text-[10px] md:text-xs text-gov-stone/60 dark:text-gov-beige/50 font-bold uppercase tracking-widest">{t('stat_transparency')}</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;