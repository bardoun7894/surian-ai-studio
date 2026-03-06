'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Building2, FileCheck, Newspaper, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { Directorate } from '@/types';

interface DirectorateHeroProps {
  directorate: Directorate;
  hasSubDirectorates: boolean;
}

interface ParticleStyle {
  width: string;
  height: string;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
}

const DirectorateHero: React.FC<DirectorateHeroProps> = ({ directorate, hasSubDirectorates }) => {
  const { t, language, direction } = useLanguage();
  const [particles, setParticles] = useState<ParticleStyle[]>([]);
  const [imageError, setImageError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glassContainerRef = useRef<HTMLDivElement>(null);

  // Generate particles only on client side
  useEffect(() => {
    const generated = [...Array(15)].map(() => ({
      width: Math.random() * 4 + 2 + 'px',
      height: Math.random() * 4 + 2 + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDuration: Math.random() * 8 + 8 + 's',
      animationDelay: Math.random() * 4 + 's',
      opacity: Math.random() * 0.4 + 0.1
    }));
    setParticles(generated);
  }, []);

  // Helper to get localized field
  const loc = (obj: any, field: string): string => {
    const val = obj?.[field];
    if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
      // Check for explicit key presence rather than truthiness to handle empty strings
      if (language in val && val[language] !== undefined && val[language] !== null && val[language] !== '') {
        return val[language];
      }
      return val['ar'] || '';
    }
    const ar = obj?.[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
    const en = obj?.[`${field}_en`] || '';
    // In English mode: prefer en, then fall back to ar only if en is empty
    return language === 'en' && en ? en : ar;
  };

  const servicesCount = typeof directorate.servicesCount === 'number'
    ? directorate.servicesCount
    : Number((directorate as any).services_count) || 0;

  const subDirectoratesCount = Array.isArray(directorate.subDirectorates)
    ? directorate.subDirectorates.length
    : Number((directorate as any).subDirectoratesCount ?? (directorate as any).sub_directorates_count) || 0;

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

      // 3. Logo Animation
      const logo = containerRef.current?.querySelector('#directorate-logo');
      if (logo) {
        tl.fromTo(logo,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
          },
          "-=1.2"
        );
      }

      // 4. Glow Pulse
      if (glowRef.current) {
        tl.fromTo(glowRef.current,
          { opacity: 0, scale: 0.5 },
          { opacity: 0.6, scale: 1, duration: 1.5, ease: "sine.out" },
          "-=1.0"
        );
      }

      // 5. Text Cascade
      const textElements = textContainerRef.current?.querySelectorAll('.animate-text');
      if (textElements && textElements.length > 0) {
        tl.fromTo(textElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "back.out(1.2)" },
          "-=0.8"
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

      // 7. Stats
      const stats = containerRef.current?.querySelectorAll('.animate-stat');
      if (stats && stats.length > 0) {
        tl.fromTo(stats,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
          "-=0.2"
        );
      }

      // 8. Continuous Floating Animation for Glass Container
      if (glassContainerRef.current) {
        gsap.to(glassContainerRef.current, {
          y: -15,
          rotationX: 2,
          rotationY: -2,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative pt-8 pb-16 md:pt-4 md:pb-10 overflow-hidden bg-gov-beige dark:bg-dm-bg min-h-[calc(80svh-3.5rem)] md:min-h-[calc(80svh-4rem)] h-auto flex items-center justify-center transition-colors duration-700">

      {/* Backgrounds */}
      <div ref={bgPatternRef} className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-10 pointer-events-none mix-blend-overlay scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-gov-beige/90 to-gov-beige dark:from-gov-brand/30 dark:via-gov-forest/95 dark:to-gov-forest pointer-events-none transition-colors duration-700"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute bg-gov-gold/20 rounded-full animate-float-particle"
            style={particle}
          ></div>
        ))}
      </div>

      <div ref={glowRef} className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-[radial-gradient(circle,rgba(185,167,121,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(9,66,57,0.3)_0%,transparent_70%)] pointer-events-none opacity-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">

        {/* Directorate Logo/Icon */}
        <div ref={logoRef} className="mb-8 md:mb-0 relative z-20 flex justify-center items-center md:w-5/12 md:order-1 pt-8 md:pt-0">
          <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center group">
            {/* Soft angled backdrop */}
            <div className="absolute inset-0 bg-gov-gold/15 dark:bg-gov-brand/30 rounded-[2.5rem] rotate-3 md:rotate-6 group-hover:rotate-12 transition-transform duration-700 ease-out"></div>

            {/* Main frosted glass container */}
            <div ref={glassContainerRef} className="absolute inset-0 bg-white/60 dark:bg-dm-surface/90 border border-gov-gold/30 dark:border-gov-gold/15 backdrop-blur-md rounded-[2.5rem] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500">

              {/* Optional slight gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 dark:to-transparent pointer-events-none"></div>

              {/* Directorate Logo */}
              <div className="relative w-[95%] h-[95%] flex items-center justify-center">
                {directorate.logo && directorate.logo.trim() !== "" && !imageError ? (
                  <Image
                    id="directorate-logo"
                    src={directorate.logo}
                    alt={loc(directorate, 'name')}
                    fill
                    priority
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Image
                    id="directorate-logo"
                    src="/assets/logo/eagle.png"
                    alt={language === 'ar' ? 'شعار الوزارة' : 'Ministry Emblem'}
                    width={320}
                    height={320}
                    priority
                    className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                )}
              </div>
            </div>

            {/* Elegant corner brackets */}
            <div className="absolute -top-6 -right-6 w-16 h-16 border-t-[3px] border-r-[3px] border-gov-gold/50 rounded-tr-2xl opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 group-hover:translate-y-2 transition-all duration-500"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 border-b-[3px] border-l-[3px] border-gov-gold/50 rounded-bl-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500"></div>
          </div>
        </div>

        {/* Text Content */}
        <div ref={textContainerRef} className="space-y-2 md:space-y-4 relative z-20 md:w-7/12 md:order-2 text-center md:text-start">

          {/* Titles Group */}
          <div className="flex flex-col items-center md:items-start">
            <div className="animate-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-gov-brand/10 border border-gov-gold/30 backdrop-blur-sm mb-3 opacity-0">
              <span className="w-2 h-2 rounded-full bg-gov-gold animate-pulse"></span>
              <span className="text-xs font-bold text-gov-forest dark:text-gov-gold tracking-wide uppercase">
                {language === 'ar' ? 'مديرية' : 'Directorate'}
              </span>
            </div>

            <h1 className="animate-text text-2xl md:text-4xl lg:text-5xl font-bold font-display text-gov-forest dark:text-gov-gold mb-3 leading-tight drop-shadow-sm opacity-0">
              {loc(directorate, 'name')}
            </h1>

            <div className="animate-text flex items-center justify-center md:justify-start gap-3 md:gap-5 mt-1 mb-2 md:mb-3 w-full opacity-0">
              <div className={`h-[1px] w-6 md:w-16 bg-gradient-to-${direction === 'rtl' ? 'l' : 'r'} from-transparent to-gov-gold`}></div>
              <span className="text-base md:text-xl text-gov-sand dark:text-gov-gold font-display font-bold whitespace-nowrap drop-shadow-sm">
                {language === 'ar' ? 'وزارة الاقتصاد والصناعة' : 'Ministry of Economy and Industry'}
              </span>
              <div className={`h-[1px] w-6 md:w-16 bg-gradient-to-${direction === 'rtl' ? 'r' : 'l'} from-transparent to-gov-gold`}></div>
            </div>

            <div className="h-auto overflow-hidden mb-4 relative w-full max-w-lg mx-auto md:mx-0">
              <p className="text-sm md:text-lg text-gov-charcoal/80 dark:text-gov-gold/90 leading-relaxed">
                {loc(directorate, 'description')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start pt-1 md:pt-4 w-full px-4 md:px-0">
            {hasSubDirectorates && (
              <Link
                href={`/directorates/${directorate.id}/sub-directorates`}
                className="animate-btn w-full sm:w-auto min-w-[160px] px-6 py-3 bg-gov-teal dark:bg-gov-brand text-white font-bold text-base hover:bg-gov-emerald transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group rounded-xl"
              >
                <Building2 size={18} />
                <span>{language === 'ar' ? 'المديريات التابعة' : 'Sub-Directorates'}</span>
                <ArrowRight className={`transition-transform duration-300 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} size={16} />
              </Link>
            )}

            <Link
              href="/services"
              className="animate-btn w-full sm:w-auto min-w-[160px] px-6 py-3 bg-gov-gold/10 text-gov-forest dark:text-gov-gold border border-gov-gold/30 font-bold text-base hover:bg-gov-gold/20 transition-all flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm"
            >
              <FileCheck size={18} />
              <span>{language === 'ar' ? 'الخدمات' : 'Services'}</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full max-w-2xl mx-auto mt-3 md:mt-6 border-t border-gov-charcoal/10 dark:border-gov-border/15 pt-3 px-2 md:px-4">
            <div className="animate-stat text-center border-r border-gov-charcoal/10 dark:border-gov-border/15 group cursor-default px-1">
              <div className="w-7 h-7 md:w-9 md:h-9 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-1 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                <Building2 size={14} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div className="text-base md:text-xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-0.5">
                {subDirectoratesCount}
              </div>
              <div className="text-[9px] md:text-[11px] text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">
                {language === 'ar' ? 'مديريات' : 'Sub-Directorates'}
              </div>
            </div>

            <div className="animate-stat text-center border-r border-gov-charcoal/10 dark:border-gov-border/15 group cursor-default px-1">
              <div className="w-7 h-7 md:w-9 md:h-9 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-1 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                <FileCheck size={14} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div className="text-base md:text-xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-0.5">
                {servicesCount}
              </div>
              <div className="text-[9px] md:text-[11px] text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">
                {language === 'ar' ? 'خدمة' : 'Services'}
              </div>
            </div>

            <div className="animate-stat text-center group cursor-default">
              <div className="w-7 h-7 md:w-9 md:h-9 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-1 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                <Newspaper size={14} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div className="text-base md:text-xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-0.5">
                {directorate.newsCount || 0}
              </div>
              <div className="text-[9px] md:text-[11px] text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">
                {language === 'ar' ? 'خبر' : 'News'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorateHero;
