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
    <section id="quick-links" className="py-24 bg-white dark:bg-dm-bg border-t border-gray-100 dark:border-gov-border/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header - matching Announcements pattern */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gov-gold/10 dark:bg-gov-emerald/20 rounded-full mb-6">
            <Globe className="text-gov-gold" size={20} />
            <span className="text-gov-gold font-bold text-sm tracking-wide">
              {t('ql_title')}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gov-forest dark:text-gov-teal mb-6">
            {t('ql_title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {links.map((link) => {
            const Icon = iconMap[link.icon || ''] || Building2;
            const label = language === 'ar' ? link.label_ar : link.label_en;
            return (
              <Link
                key={link.id}
                href={link.url}
                className="flex flex-col items-center gap-3 p-5 rounded-[1.5rem] bg-gov-forest/5 dark:bg-dm-surface border border-gov-forest/10 dark:border-gov-border/15 hover:border-gov-gold/40 hover:shadow-2xl hover:shadow-gov-gold/10 hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gov-gold/10 dark:bg-gov-emerald/20 flex items-center justify-center group-hover:bg-gov-gold group-hover:text-white transition-colors">
                  <Icon size={22} className="text-gov-gold group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-gov-forest dark:text-gov-teal text-center leading-tight">
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
