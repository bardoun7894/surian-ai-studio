'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Scale, Newspaper, Megaphone, Briefcase, MessageSquareWarning, HelpCircle, Phone, Building2, FileText, Globe, Network, ExternalLink, LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import Link from 'next/link';

const iconMap: Record<string, LucideIcon> = {
  Scale, Newspaper, Megaphone, Briefcase, MessageSquareWarning,
  HelpCircle, Phone, Building2, FileText, Globe, Network, ExternalLink,
};

interface QuickLinkItem {
  id: number;
  label_ar: string;
  label_en: string;
  url: string;
  icon: string | null;
}

const FALLBACK_LINKS = [
  { id: 1, label_ar: 'القوانين والتشريعات', label_en: 'Laws & Legislation', url: '/decrees', icon: 'Scale' },
  { id: 2, label_ar: 'الأخبار', label_en: 'News', url: '/news', icon: 'Newspaper' },
  { id: 3, label_ar: 'الإعلانات', label_en: 'Announcements', url: '/#announcements', icon: 'Megaphone' },
  { id: 4, label_ar: 'الخدمات', label_en: 'Services', url: '/services', icon: 'Briefcase' },
  { id: 5, label_ar: 'الشكاوى', label_en: 'Complaints', url: '/complaints', icon: 'MessageSquareWarning' },
  { id: 6, label_ar: 'الأسئلة الشائعة', label_en: 'FAQ', url: '/faq', icon: 'HelpCircle' },
  { id: 7, label_ar: 'اتصل بنا', label_en: 'Contact Us', url: '/contact', icon: 'Phone' },
  { id: 8, label_ar: 'حول الوزارة', label_en: 'About', url: '/about', icon: 'Building2' },
];

const normalizeQuickLinkUrl = (url: string, labelAr: string, labelEn: string): string => {
  const normalizedUrl = url.trim().toLowerCase();
  const normalizedAr = labelAr.trim();
  const normalizedEn = labelEn.trim().toLowerCase();

  if (
    normalizedUrl === '/#faq' ||
    normalizedUrl === '#faq' ||
    normalizedAr === 'الأسئلة الشائعة' ||
    normalizedEn === 'faq'
  ) {
    return '/faq';
  }

  if (
    normalizedUrl === '/#contact' ||
    normalizedUrl === '#contact' ||
    normalizedAr === 'اتصل بنا' ||
    normalizedEn === 'contact us' ||
    normalizedEn === 'contact'
  ) {
    return '/contact';
  }

  return url;
};

interface QuickLinksProps {
  section?: string;
  directorateId?: string;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ section = 'homepage', directorateId }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [links, setLinks] = useState<QuickLinkItem[]>(FALLBACK_LINKS);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const threshold = 10;
    const absScroll = Math.abs(scrollLeft);
    const maxScroll = scrollWidth - clientWidth;

    if (language === 'ar') {
      setCanScrollLeft(absScroll > threshold);
      setCanScrollRight(absScroll < maxScroll - threshold);
    } else {
      setCanScrollLeft(scrollLeft > threshold);
      setCanScrollRight(scrollLeft < maxScroll - threshold);
    }
  }, [language]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const cardElement = scrollContainerRef.current.querySelector('a') as HTMLElement | null;
    let cardWidth = 200;
    if (cardElement && cardElement.parentElement) {
      cardWidth = cardElement.parentElement.clientWidth;
    }
    const amount = cardWidth + 20;

    if (language === 'ar') {
      const scrollAmount = dir === 'left' ? amount : -amount;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      const scrollAmount = dir === 'left' ? -amount : amount;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    setTimeout(() => updateScrollButtons(), 400);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setTimeout(updateScrollButtons, 100);
    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [links, updateScrollButtons]);

  useEffect(() => {
    API.quickLinks.getBySection(section, directorateId)
      .then((data) => {
        if (data && data.length > 0) setLinks(data);
      })
      .catch(() => { /* Fallback already set */ })
      .finally(() => setLoading(false));
  }, [section, directorateId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier

    if (Math.abs(walk) > 10) {
      setHasDragged(true);
    }

    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section ref={ref} id="quick-links" className="py-14 md:py-20 relative overflow-hidden bg-gradient-to-b from-gov-beige/40 via-white to-gov-beige/30 dark:from-dm-bg dark:via-dm-surface/30 dark:to-dm-bg border-t border-gov-gold/10 dark:border-gov-border/15">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #b9a779 0%, transparent 2%), 
                           radial-gradient(circle at 75% 75%, #094239 0%, transparent 2%)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-gov-gold/10 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-16"
        >
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 60 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-0.5 bg-gradient-to-r from-transparent to-gov-gold"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
              className="w-3 h-3 rotate-45 bg-gov-gold"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 60 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-0.5 bg-gradient-to-l from-transparent to-gov-gold"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gov-gold/10 border border-gov-gold/30 text-gov-gold font-bold text-sm mb-4"
          >
            <Globe size={18} />
            <span>{isAr ? 'روابط سريعة' : 'Quick Links'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gov-forest dark:text-gov-gold"
          >
            {isAr ? 'روابط سريعة' : 'Quick Links'}
          </motion.h2>
        </motion.div>

        {/* Scroll Arrows + Cards - flex layout with arrows outside */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Left Arrow - outside the scroll area */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: canScrollLeft ? 1 : 0, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.3 }}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="flex-shrink-0 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gov-gold/40 flex items-center justify-center text-gov-gold hover:bg-gov-gold hover:text-white hover:border-gov-gold disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 shadow-lg bg-white/90 dark:bg-dm-surface/90 backdrop-blur-sm"
          >
            {language === 'ar' ? <ChevronRight size={20} className="md:w-6 md:h-6" /> : <ChevronLeft size={20} className="md:w-6 md:h-6" />}
          </motion.button>

        {/* Links Grid */}
        <motion.div
          ref={scrollContainerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`flex-1 flex flex-nowrap overflow-x-auto gap-4 md:gap-6 py-6 md:py-8 px-2 sm:px-4 snap-x snap-mandatory ql-scroll-container ${isDragging ? 'cursor-grabbing' : 'cursor-grab scroll-smooth'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          <style dangerouslySetInnerHTML={{
            __html: `.ql-scroll-container::-webkit-scrollbar { display: none; }`
          }} />
          {loading ? (
            <div className="flex justify-center gap-8 w-full">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col items-center gap-2 min-h-[88px] justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse" />
                  <div className="w-20 h-4 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : links.map((link, idx) => {
            const Icon = iconMap[link.icon || ''] || Building2;
            const label = language === 'ar' ? link.label_ar : link.label_en;
            const href = normalizeQuickLinkUrl(link.url, link.label_ar, link.label_en);

            // Unified brand gradients
            const gradients = [
              'from-gov-forest to-gov-emerald',
              'from-gov-teal to-gov-forest',
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <motion.div
                key={link.id}
                variants={itemVariants}
                className="group relative flex-shrink-0 snap-center w-[160px] sm:w-[180px] md:w-[200px] h-full"
              >
                <Link
                  href={href}
                  onClick={(e) => {
                    if (hasDragged) {
                      e.preventDefault();
                    }
                  }}
                  className="flex relative w-full px-4 py-3 md:px-5 md:py-4 min-h-[80px] md:min-h-[100px] bg-white/80 dark:bg-dm-surface backdrop-blur-xl rounded-[1.25rem] md:rounded-[1.5rem] border border-gov-gold/20 dark:border-gov-gold/15 shadow-[0_4px_16px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_40px_rgba(185,167,121,0.2)] transition-all duration-300 overflow-hidden flex-row items-center gap-3 md:gap-4 group-hover:-translate-y-1.5 md:group-hover:-translate-y-2 group-hover:border-gov-gold/40 dark:group-hover:border-gov-gold/40 font-sans"
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[1rem] md:rounded-[1.5rem]`} />

                  {/* Icon Container */}
                  <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md shadow-gov-forest/20 dark:shadow-black/30 group-hover:scale-110 transition-all duration-300 ease-out z-10 flex-shrink-0 my-auto`}>
                    <Icon size={20} className="text-white group-hover:animate-pulse transition-transform duration-300 md:w-6 md:h-6" />
                  </div>

                  {/* Label */}
                  <span className="text-[15px] font-extrabold text-gov-forest dark:text-white/90 whitespace-nowrap leading-tight transition-colors z-10 flex items-center pr-2">
                    {label}
                  </span>

                  {/* Animated Border Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gov-forest via-gov-gold to-gov-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

          {/* Right Arrow - outside the scroll area */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={isInView ? { opacity: canScrollRight ? 1 : 0, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.3 }}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="flex-shrink-0 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gov-gold/40 flex items-center justify-center text-gov-gold hover:bg-gov-gold hover:text-white hover:border-gov-gold disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 shadow-lg bg-white/90 dark:bg-dm-surface/90 backdrop-blur-sm"
          >
            {language === 'ar' ? <ChevronLeft size={20} className="md:w-6 md:h-6" /> : <ChevronRight size={20} className="md:w-6 md:h-6" />}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
