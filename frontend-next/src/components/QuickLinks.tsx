'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Scale, Newspaper, Megaphone, Briefcase, MessageSquareWarning, HelpCircle, Phone, Building2, FileText, Globe, Network, ExternalLink, LucideIcon } from 'lucide-react';
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
  { id: 1, label_ar: 'القوانين والمراسيم', label_en: 'Laws & Decrees', url: '/decrees', icon: 'Scale' },
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
}

const QuickLinks: React.FC<QuickLinksProps> = ({ section = 'homepage' }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [links, setLinks] = useState<QuickLinkItem[]>(FALLBACK_LINKS);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    API.quickLinks.getBySection(section)
      .then((data) => {
        if (data && data.length > 0) setLinks(data);
      })
      .catch(() => { /* Fallback already set */ })
      .finally(() => setLoading(false));
  }, [section]);

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
    <section ref={ref} id="quick-links" className="py-24 relative overflow-hidden bg-white dark:bg-dm-bg border-t border-gov-gold/10 dark:border-gov-border/15">
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
          className="text-center mb-16"
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
            className="text-4xl md:text-5xl font-display font-bold text-gov-forest dark:text-gov-gold"
          >
            {isAr ? 'روابط سريعة' : 'Quick Links'}
          </motion.h2>
        </motion.div>

        {/* Links Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {loading ? (
            <div className="flex justify-center gap-8 w-full">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse" />
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
                className="group relative"
              >
                <Link
                  href={href}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Icon Container - Now the main element */}
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-gov-forest/20 dark:shadow-black/30 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 ease-out z-10`}>
                    <Icon size={32} className="text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Label */}
                  <span className="text-sm font-bold text-gov-charcoal dark:text-white/90 text-center leading-tight max-w-[100px] group-hover:text-gov-forest dark:group-hover:text-gov-gold transition-colors">
                    {label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default QuickLinks;
