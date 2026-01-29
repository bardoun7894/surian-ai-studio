'use client';

import React from 'react';
import { Scale, Newspaper, Megaphone, Briefcase, MessageSquareWarning, HelpCircle, Phone, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

const QuickLinks: React.FC = () => {
  const { t } = useLanguage();

  const links = [
    { icon: Scale, label: t('ql_laws'), href: '/decrees' },
    { icon: Newspaper, label: t('ql_news'), href: '/news' },
    { icon: Megaphone, label: t('ql_announcements'), href: '/#announcements' },
    { icon: Briefcase, label: t('ql_services'), href: '/services' },
    { icon: MessageSquareWarning, label: t('ql_complaints'), href: '/complaints' },
    { icon: HelpCircle, label: t('ql_faq'), href: '/#faq' },
    { icon: Phone, label: t('ql_contact'), href: '/#contact' },
    { icon: Building2, label: t('ql_about'), href: '/about' },
  ];

  return (
    <section id="quick-links" className="py-16 bg-white dark:bg-gov-forest/50 border-t border-gray-100 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white text-center mb-10">
          {t('ql_title')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gov-beige/50 dark:bg-white/5 border border-transparent hover:border-gov-gold/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gov-gold/10 dark:bg-gov-gold/20 flex items-center justify-center group-hover:bg-gov-gold group-hover:text-white transition-colors">
                  <Icon size={22} className="text-gov-gold group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-bold text-gov-charcoal dark:text-white text-center leading-tight">
                  {link.label}
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
