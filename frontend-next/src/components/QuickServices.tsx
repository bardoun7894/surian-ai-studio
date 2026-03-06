'use client';

import React from 'react';
import {
  Factory,
  Ship,
  Package,
  Briefcase,
  Shield,
  Building2,
  ArrowLeft,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface QuickService {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  href: string;
}

const QuickServices: React.FC = () => {
  const { t, language } = useLanguage();

  const services: QuickService[] = [
    {
      id: 'industrial_license',
      titleKey: 'service_industrial_license',
      icon: <Factory size={28} />,
      color: 'text-gov-teal',
      bgColor: 'bg-transparent group-hover:bg-gov-teal/5',
      href: '/services/1'
    },
    {
      id: 'import_license',
      titleKey: 'service_import_license',
      icon: <Ship size={28} />,
      color: 'text-gov-forest',
      bgColor: 'bg-transparent group-hover:bg-gov-forest/5',
      href: '/services/7'
    },
    {
      id: 'export_license',
      titleKey: 'service_export_license',
      icon: <Package size={28} />,
      color: 'text-gov-gold',
      bgColor: 'bg-transparent group-hover:bg-gov-gold/5',
      href: '/services/8'
    },
    {
      id: 'sme_financing',
      titleKey: 'service_sme_financing',
      icon: <Briefcase size={28} />,
      color: 'text-gov-teal',
      bgColor: 'bg-transparent group-hover:bg-gov-teal/5',
      href: '/services/9'
    },
    {
      id: 'consumer_complaint',
      titleKey: 'service_consumer_complaint',
      icon: <Shield size={28} />,
      color: 'text-gov-red',
      bgColor: 'bg-transparent group-hover:bg-gov-red/5',
      href: '/services/14'
    },
    {
      id: 'company_registration',
      titleKey: 'service_company_registration',
      icon: <Building2 size={28} />,
      color: 'text-gov-gold',
      bgColor: 'bg-transparent group-hover:bg-gov-gold/5',
      href: '/services/13'
    }
  ];

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section id="quick-services" className="py-10 md:py-16 bg-white dark:bg-dm-surface border-t border-gov-gold/10 dark:border-gov-border/15 transition-colors scroll-mt-20 md:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gov-gold/10 text-gov-gold text-xs md:text-sm font-bold mb-3 md:mb-4">
            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{t('quick_services_title')}</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gov-charcoal dark:text-gov-teal mb-3 md:mb-4">
            {t('quick_services_title')}
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-gov-stone/60 dark:text-gov-teal/60 max-w-2xl mx-auto px-4">
            {t('quick_services_subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex flex-col items-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-gov-beige/50 dark:bg-dm-surface border border-gov-gold/10 dark:border-gov-border/15 hover:border-gov-gold/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${service.bgColor} ${service.color} flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7`}>
                {service.icon}
              </div>

              {/* Service Title */}
              <h3 className="text-xs md:text-sm lg:text-base font-bold text-gov-charcoal dark:text-gov-teal text-center leading-tight mb-2 md:mb-3">
                {t(service.titleKey)}
              </h3>

              {/* Access Link */}
              <span className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-gov-teal dark:text-gov-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('access_service')}
                <ArrowIcon className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </span>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gov-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default QuickServices;
