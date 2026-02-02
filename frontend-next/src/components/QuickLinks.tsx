'use client';

import React, { useEffect, useState } from 'react';
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
  { id: 6, label_ar: 'الأسئلة الشائعة', label_en: 'FAQ', url: '/#faq', icon: 'HelpCircle' },
  { id: 7, label_ar: 'اتصل بنا', label_en: 'Contact Us', url: '/#contact', icon: 'Phone' },
  { id: 8, label_ar: 'حول الوزارة', label_en: 'About', url: '/about', icon: 'Building2' },
];

const QuickLinks: React.FC = () => {
  const { t, language } = useLanguage();
  const [links, setLinks] = useState<QuickLinkItem[]>(FALLBACK_LINKS);

  useEffect(() => {
    API.quickLinks.getBySection('homepage').then((data) => {
      if (data && data.length > 0) setLinks(data);
    });
  }, []);

  return (
    <section id="quick-links" className="py-16 bg-white dark:bg-gov-emeraldStatic to-gov-forest border-t border-gray-100 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-display font-bold text-gov-charcoal dark:text-gov-gold text-center mb-10">
          {t('ql_title')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {links.map((link) => {
            const Icon = iconMap[link.icon || ''] || Building2;
            const label = language === 'ar' ? link.label_ar : link.label_en;
            return (
              <Link
                key={link.id}
                href={link.url}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gov-beige/50 dark:bg-white/5 border border-transparent hover:border-gov-gold/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gov-gold/10 dark:bg-gov-gold/20 flex items-center justify-center group-hover:bg-gov-gold group-hover:text-white transition-colors">
                  <Icon size={22} className="text-gov-gold group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-gov-charcoal dark:text-white text-center leading-tight">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
