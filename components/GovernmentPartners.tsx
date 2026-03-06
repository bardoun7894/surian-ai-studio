import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ShieldAlert,
  Scale,
  HeartPulse,
  BookOpen,
  GraduationCap,
  Zap,
  Droplets,
  Plane,
  Wifi,
  Banknote,
  Map,
  Factory,
  Handshake,
  Building2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DIRECTORATES } from '../constants';

const GovernmentPartners: React.FC = () => {
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Map icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    ShieldAlert: <ShieldAlert size={24} />,
    Scale: <Scale size={24} />,
    HeartPulse: <HeartPulse size={24} />,
    BookOpen: <BookOpen size={24} />,
    GraduationCap: <GraduationCap size={24} />,
    Zap: <Zap size={24} />,
    Droplets: <Droplets size={24} />,
    Plane: <Plane size={24} />,
    Wifi: <Wifi size={24} />,
    Banknote: <Banknote size={24} />,
    Map: <Map size={24} />,
    Factory: <Factory size={24} />
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let tween: gsap.core.Tween;

    const ctx = gsap.context(() => {
      tween = gsap.to(scrollContainer, {
        xPercent: -50,
        duration: 60,
        ease: "none",
        repeat: -1
      });
    });

    const handleMouseEnter = () => tween?.pause();
    const handleMouseLeave = () => tween?.play();

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section className="py-16 bg-gov-beige dark:bg-gov-forest/30 border-t border-gray-100 dark:border-gov-gold/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-teal/10 dark:bg-gov-gold/10 text-gov-teal dark:text-gov-gold text-sm font-bold mb-4">
            <Handshake size={16} />
            <span>{t('partners_title')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gov-charcoal dark:text-white mb-4">
            {t('partners_title')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('partners_subtitle')}
          </p>
        </div>

        {/* Partners Carousel (Infinite Marquee) */}
        <div className="relative overflow-hidden w-full group">
          <div
            ref={scrollRef}
            className="flex gap-6 w-max"
          >
            {/* Duplicate the array to create seamless loop */}
            {[...DIRECTORATES, ...DIRECTORATES].map((directorate, index) => (
              <div
                key={`${directorate.id}-${index}`}
                className="flex-shrink-0"
              >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-white dark:bg-white/5 border border-gov-gold/10 dark:border-white/10 hover:border-gov-gold/30 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group/card">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold flex items-center justify-center mb-3 group-hover/card:bg-gov-forest group-hover/card:text-white dark:group-hover/card:bg-gov-gold dark:group-hover/card:text-gov-forest transition-all duration-300">
                    {iconMap[directorate.icon] || <Building2 size={24} />}
                  </div>

                  {/* Name */}
                  <h3 className="text-sm font-bold text-gov-charcoal dark:text-white text-center leading-tight">
                    {directorate.name}
                  </h3>

                  {/* Service Count */}
                  <span className="text-xs text-gov-sand/60 dark:text-gov-beige/40 mt-2">
                    {directorate.servicesCount} {language === 'ar' ? 'خدمة' : 'services'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gov-beige dark:from-gov-forest to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gov-beige dark:from-gov-forest to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Scroll Indicator - Mobile */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
            <span>{language === 'ar' ? 'اسحب للمزيد' : 'Swipe for more'}</span>
            <span className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GovernmentPartners;
