'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { FileText, Scale, ArrowRight, ShieldCheck, Landmark, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
  hasBreakingNews?: boolean;
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

const HeroSection: React.FC<HeroSectionProps> = ({ hasBreakingNews = false }) => {
  const { t, language, direction } = useLanguage();
  const [particles, setParticles] = useState<ParticleStyle[]>([]);

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
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<HTMLDivElement>(null);
  const eagleContentRef = useRef<HTMLDivElement>(null);
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

      // --- Continuous Animations ---
      // Gentle Breathing (Scale)
      if (eagleRef.current) {
        gsap.to(eagleRef.current, {
          scale: 1.02,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2
        });

        // Subtle Float (Vertical)
        gsap.to(eagleRef.current, {
          y: -5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2
        });
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          rotation: 360,
          duration: 120,
          repeat: -1,
          ease: "linear"
        });
      }

      if (bgPatternRef.current) {
        gsap.to(bgPatternRef.current, {
          y: -20,
          x: 10,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

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
  }, []);

  return (
    <section ref={containerRef} className={`relative pt-6 pb-6 md:pt-12 md:pb-10 overflow-hidden bg-gov-beige dark:bg-gov-forest ${hasBreakingNews ? 'min-h-[45vh]' : 'min-h-[55vh]'} md:min-h-[80vh] flex items-center justify-center transition-colors duration-700`}>

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

      <div ref={glowRef} className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[radial-gradient(circle,rgba(185,167,121,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(9,66,57,0.3)_0%,transparent_70%)] pointer-events-none opacity-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">

        {/* The Golden Hawk */}
        <div ref={eagleRef} className="mb-4 md:mb-0 relative z-20 flex justify-center items-center md:w-1/2 md:order-1">
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gov-gold/10 rounded-full blur-3xl dark:bg-gov-brand/20"></div>
            <div className="absolute inset-0 rounded-full border border-gov-gold/20 dark:border-gov-gold/10"></div>
            <div className="absolute inset-4 rounded-full border-t border-l border-gov-teal/30 dark:border-gov-teal/20 animate-[spin_8s_linear_infinite]"></div>
            <div className="absolute inset-16 rounded-full border border-gov-gold/10"></div>
            <div className="absolute inset-8 rounded-full bg-mofa-teal dark:bg-gradient-to-br dark:from-gov-brand dark:to-gov-forest border border-gov-gold/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              {/* Animated Logo Composition */}
              <div ref={eagleContentRef} className="relative w-full h-full flex items-center justify-center scale-110">
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

                {/* 3. Outer Ring/Details (33) */}
                <Image
                  id="logo-ring"
                  src="/assets/logo/33.png"
                  alt="Logo Detail"
                  fill
                  priority
                  className="absolute inset-0 w-full h-full object-contain z-30 opacity-80 mix-blend-overlay"
                />
              </div>
            </div>

            {/* Floating Particles around Eagle */}
            <div className="absolute inset-0 pointer-events-none">
              <Sparkles className="absolute top-0 right-10 text-gov-gold/40 animate-pulse-slow" size={24} />
              <Sparkles className="absolute bottom-10 left-0 text-gov-gold/40 animate-pulse-slow delay-1000" size={16} />
            </div>
          </div>
        </div>

        <div ref={textContainerRef} className="space-y-4 md:space-y-8 relative z-20 md:w-1/2 md:order-2 text-center md:text-start">

          {/* Titles Group */}
          <div className="flex flex-col items-center md:items-start">
            <div className="animate-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gov-brand/10 border border-gov-gold/30 backdrop-blur-sm mb-6 opacity-0">
              <span className="w-2 h-2 rounded-full bg-gov-gold animate-pulse"></span>
              <span className="text-xs md:text-sm font-bold text-gov-forest dark:text-gov-gold tracking-wide uppercase">
                {t('republic_name')}
              </span>
            </div>

            <h1 className="animate-text text-4xl md:text-6xl lg:text-7xl font-bold font-display text-gov-forest dark:text-gov-gold mb-6 leading-tight drop-shadow-sm opacity-0">
              {t('ministry_name')} <span className="text-gov-teal dark:text-gov-gold relative inline-block">

                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gov-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                </svg>
              </span>
            </h1>

            <div className="animate-text flex items-center justify-center md:justify-start gap-4 md:gap-6 mt-2 mb-4 md:mb-6 w-full opacity-0">
              <div className={`h-[1px] w-8 md:w-24 bg-gradient-to-${direction === 'rtl' ? 'l' : 'r'} from-transparent to-gov-gold`}></div>
              <span className="text-lg md:text-3xl text-gov-sand dark:text-gov-gold font-display font-bold whitespace-nowrap drop-shadow-sm">
                {t('portal_name')}
              </span>
              <div className={`h-[1px] w-8 md:w-24 bg-gradient-to-${direction === 'rtl' ? 'r' : 'l'} from-transparent to-gov-gold`}></div>
            </div>

            <p className="animate-text text-lg md:text-xl text-gov-charcoal/80 dark:text-gov-gold/90 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0 opacity-0">
              {t('unified_platform')}
              <br />
              <span className="text-xs md:text-base text-gov-stone/70 dark:text-gov-beige/60 mt-1 block">{t('secure_gateway')}</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start pt-2 md:pt-4 w-full px-4 md:px-0">
            <Link
              href="/services"
              className="animate-btn relative overflow-hidden w-full sm:w-auto min-w-[160px] px-6 py-3 bg-gov-teal dark:bg-gov-brand text-white font-bold text-base hover:bg-gov-emerald dark:hover:bg-gov-emerald transition-all shadow-[0_5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(9,66,57,0.3)] flex items-center justify-center gap-2 group rounded-xl sm:rounded-none"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <Landmark size={18} className="relative z-10" />
              <span className="relative z-10">{t('hero_services_btn')}</span>
              <ArrowRight className={`relative z-10 ${language === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-300`} size={16} />
            </Link>

            <Link
              href="/decrees"
              className="animate-btn w-full sm:w-auto min-w-[160px] px-6 py-3 bg-transparent border border-gov-teal text-gov-teal dark:text-gov-gold dark:border-gov-gold font-bold text-base hover:bg-gov-teal/10 dark:hover:bg-gov-gold/10 transition-all flex items-center justify-center gap-2 rounded-xl sm:rounded-none"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <Scale size={18} />
              <span>{t('hero_decrees_btn')}</span>
            </Link>

            <Link
              href="/suggestions"
              className="animate-btn w-full sm:w-auto min-w-[160px] px-6 py-3 bg-gov-charcoal text-white font-bold text-base hover:bg-gov-forest transition-all shadow-md flex items-center justify-center gap-2 rounded-xl sm:rounded-none"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <FileText size={18} />
              <span>{language === 'ar' ? 'المشاريع والمقترحات' : 'Proposals & Projects'}</span>
            </Link>
          </div>

          {/* Official Pillars - Horizontal on Mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-6 md:gap-12 w-full max-w-2xl mx-auto mt-6 md:mt-12 border-t border-gov-charcoal/10 dark:border-gov-gold/10 pt-6 px-2 md:px-4">
            <div className="animate-stat text-center border-r border-gov-charcoal/10 dark:border-gov-gold/10 group cursor-default px-1">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-2 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                <ShieldCheck size={16} className="md:w-[20px] md:h-[20px]" />
              </div>
              <div className="text-lg md:text-2xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-1">24/7</div>
              <div className="text-[10px] md:text-xs text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">{t('stat_secure')}</div>
            </div>

            <div className="animate-stat text-center group cursor-default">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-2 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                <FileText size={16} className="md:w-[20px] md:h-[20px]" />
              </div>
              <div className="text-lg md:text-2xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-1">100%</div>
              <div className="text-[10px] md:text-xs text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">{t('stat_transparency')}</div>
            </div>
          </div>
        </div>



      </div>
    </section>
  );
};

export default HeroSection;
