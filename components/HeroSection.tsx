import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Building2, FileText, Scale, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  onNavigate: (view: ViewState) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
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

      // 3. Eagle Majestic Entrance
      tl.fromTo(eagleRef.current,
        { scale: 0.6, opacity: 0, filter: 'blur(15px)', y: 30 },
        { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.8, ease: "expo.out" },
        "-=1.5"
      );

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
      if(stats && stats.length > 0) {
        tl.fromTo(stats,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
          "-=0.2"
        );
      }

      // --- Continuous Animations ---
      gsap.to(eagleRef.current, {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0
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
    <section ref={containerRef} className="relative pt-28 pb-12 md:pt-36 md:pb-20 overflow-hidden bg-gov-beige dark:bg-gov-forest min-h-[60vh] md:min-h-[80vh] flex items-center justify-center transition-colors duration-700">
      
      {/* Backgrounds */}
      <div ref={bgPatternRef} className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-5 pointer-events-none mix-blend-overlay scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-gov-beige/90 to-gov-beige dark:from-gov-forest/80 dark:via-gov-forest/95 dark:to-gov-forest pointer-events-none transition-colors duration-700"></div>
      <div ref={glowRef} className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,rgba(185,167,121,0.2)_0%,transparent_70%)] pointer-events-none opacity-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        {/* The Golden Hawk */}
        <div ref={eagleRef} className="mb-8 md:mb-12 relative z-20 flex justify-center items-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gov-gold/10 rounded-full blur-3xl dark:bg-gov-gold/5"></div>
                <div className="absolute inset-0 rounded-full border border-gov-gold/20 dark:border-gov-gold/10"></div>
                <div className="absolute inset-4 rounded-full border-t border-l border-gov-teal/30 dark:border-gov-teal/20 animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute inset-16 rounded-full border border-gov-gold/10"></div>
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/80 via-white/40 to-white/20 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Emblem_of_Syria_%282025%E2%80%93present%29.svg" 
                      alt="Emblem" 
                      className="w-28 md:w-44 h-auto object-contain drop-shadow-lg relative z-10"
                    />
                </div>
            </div>
        </div>

        <div ref={textContainerRef} className="space-y-6 md:space-y-8 relative z-20">
            
            {/* Titles Group */}
            <div className="flex flex-col items-center">
                <h2 className="animate-text text-gov-forest/80 dark:text-gov-gold/90 font-sans font-medium tracking-[0.3em] md:tracking-[0.4em] uppercase text-[10px] md:text-sm mb-3 border-b border-gov-gold/30 pb-2">
                  {language === 'ar' ? 'Syrian Arab Republic' : 'الجمهورية العربية السورية'}
                </h2>
                
                <h1 className="animate-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-gov-forest dark:text-white leading-[1.2] md:leading-[1.1] mb-2 drop-shadow-sm dark:drop-shadow-lg transition-colors px-2">
                  {t('republic_name')}
                </h1>
                
                <div className="animate-text flex items-center justify-center gap-4 md:gap-6 mt-2 mb-4 md:mb-6 w-full">
                   <div className={`h-[1px] w-8 md:w-24 bg-gradient-to-${direction === 'rtl' ? 'l' : 'r'} from-transparent to-gov-gold`}></div>
                   <span className="text-lg md:text-3xl text-gov-sand dark:text-gov-gold font-display font-bold whitespace-nowrap drop-shadow-sm">
                     {t('cabinet')}
                   </span>
                   <div className={`h-[1px] w-8 md:w-24 bg-gradient-to-${direction === 'rtl' ? 'r' : 'l'} from-transparent to-gov-gold`}></div>
                </div>

                <p className={`animate-text text-sm md:text-lg text-gov-stone dark:text-gov-beige/80 leading-relaxed max-w-xs md:max-w-3xl mx-auto font-medium dark:font-light ${language === 'ar' ? 'border-r-2 pr-4' : 'border-l-2 pl-4'} border-gov-gold/50 transition-colors`}>
                   {t('unified_platform')}
                   <br/>
                   <span className="text-xs md:text-base text-gov-stone/70 dark:text-gov-beige/60 mt-1 block">{t('secure_gateway')}</span>
                </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4 md:pt-6 w-full px-4">
              <button 
                onClick={() => onNavigate('DIRECTORATES')}
                className="animate-btn relative overflow-hidden w-full sm:w-auto min-w-[200px] px-8 py-4 bg-gov-teal text-white font-bold text-lg hover:bg-gov-emerald transition-all shadow-[0_5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(66,129,119,0.3)] flex items-center justify-center gap-3 group rounded-xl sm:rounded-none sm:clip-path-polygon"
                style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <Landmark size={20} className="relative z-10" />
                <span className="relative z-10">{t('hero_services_btn')}</span>
                <ArrowRight className={`relative z-10 ${language === 'ar' ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'} transition-transform duration-300`} size={18} />
              </button>
              
              <button 
                onClick={() => onNavigate('DECREES')}
                className="animate-btn w-full sm:w-auto min-w-[200px] px-8 py-4 bg-transparent border border-gov-teal text-gov-teal dark:text-gov-gold dark:border-gov-gold font-bold text-lg hover:bg-gov-teal/10 dark:hover:bg-gov-gold/10 transition-all flex items-center justify-center gap-3 rounded-xl sm:rounded-none sm:clip-path-polygon"
                style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
              >
                <Scale size={20} />
                <span>{t('hero_decrees_btn')}</span>
              </button>
            </div>

            {/* Official Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 max-w-xs sm:max-w-3xl mx-auto mt-8 md:mt-12 border-t border-gov-charcoal/10 dark:border-gov-gold/10 pt-8 px-4">
               <div className="animate-stat text-center group cursor-default">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-2 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                    <Building2 size={20} />
                  </div>
                  <div className="text-2xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-1">1,500+</div>
                  <div className="text-xs text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">{t('stat_services')}</div>
               </div>
               
               <div className="animate-stat text-center sm:border-r sm:border-l border-gov-charcoal/10 dark:border-gov-gold/10 group cursor-default">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-2 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-2xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-1">24/7</div>
                  <div className="text-xs text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">{t('stat_secure')}</div>
               </div>
               
               <div className="animate-stat text-center group cursor-default">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gov-forest/5 dark:bg-gov-gold/10 flex items-center justify-center text-gov-forest dark:text-gov-gold mb-2 group-hover:bg-gov-forest group-hover:text-white dark:group-hover:bg-gov-gold dark:group-hover:text-gov-forest transition-colors duration-500">
                    <FileText size={20} />
                  </div>
                  <div className="text-2xl font-display font-bold text-gov-forest dark:text-white tabular-nums mb-1">100%</div>
                  <div className="text-xs text-gov-stone dark:text-gov-beige/60 uppercase tracking-widest">{t('stat_transparency')}</div>
               </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;