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
    <section id="quick-services" className="py-16 bg-white dark:bg-gov-forest/50 border-t border-gov-gold/10 dark:border-gov-gold/10 transition-colors scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gov-gold/10 text-gov-gold text-sm font-bold mb-4">
            <Zap size={16} />
            <span>{t('quick_services_title')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gov-charcoal dark:text-white mb-4">
            {t('quick_services_title')}
          </h2>
          <p className="text-gov-stone/60 dark:text-gov-beige/60 max-w-2xl mx-auto">
            {t('quick_services_subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex flex-col items-center p-6 rounded-2xl bg-gov-beige/50 dark:bg-white/5 border border-gov-gold/10 dark:border-white/10 hover:border-gov-gold/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-2xl ${service.bgColor} ${service.color} flex items-center justify-center mb-4 transition-all duration-300`}>
                {service.icon}
              </div>

              {/* Service Title */}
              <h3 className="text-sm md:text-base font-bold text-gov-charcoal dark:text-white text-center leading-tight mb-3">
                {t(service.titleKey)}
              </h3>

              {/* Access Link */}
              <span className="flex items-center gap-1 text-xs font-medium text-gov-teal dark:text-gov-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('access_service')}
                <ArrowIcon size={12} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
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
