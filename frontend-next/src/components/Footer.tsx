'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Network } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import Link from 'next/link';
import Image from 'next/image';
import NewsletterSignup from './NewsletterSignup';

interface FooterProps {
  onIncreaseFont?: () => void;
  onDecreaseFont?: () => void;
  onToggleContrast?: () => void;
}

interface FooterLink {
  id: number;
  label_ar: string;
  label_en: string;
  url: string;
  icon: string | null;
}

const Footer: React.FC<FooterProps> = ({
  onIncreaseFont,
  onDecreaseFont,
  onToggleContrast
}) => {
  const { t, language } = useLanguage();
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({});
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  const handleIncreaseFont = () => {
    if (onIncreaseFont) {
      onIncreaseFont();
    } else {
      const current = parseFloat(getComputedStyle(document.documentElement).fontSize);
      document.documentElement.style.fontSize = `${Math.min(current + 2, 24)}px`;
    }
  };

  const handleDecreaseFont = () => {
    if (onDecreaseFont) {
      onDecreaseFont();
    } else {
      const current = parseFloat(getComputedStyle(document.documentElement).fontSize);
      document.documentElement.style.fontSize = `${Math.max(current - 2, 12)}px`;
    }
  };

  const handleToggleContrast = () => {
    if (onToggleContrast) {
      onToggleContrast();
    } else {
      document.documentElement.classList.toggle('high-contrast');
      document.body.classList.toggle('high-contrast');
    }
  };

  useEffect(() => {
    API.settings.getByGroup('contact')
      .then(data => setContactInfo(data as Record<string, string>))
      .catch(() => { });
    API.quickLinks.getBySection('footer')
      .then(data => { if (data && data.length > 0) setFooterLinks(data); })
      .catch(() => { });
  }, []);

  const phone = contactInfo.contact_phone || '19999';
  const email = contactInfo.contact_email || 'info@moe.gov.sy';
  const address = language === 'en' && contactInfo.contact_address_en
    ? contactInfo.contact_address_en
    : (contactInfo.contact_address_ar || t('damascus_address'));

  return (
    <footer className="bg-white dark:bg-dm-surface text-gov-forest dark:text-gov-teal pt-14 md:pt-16 pb-8 border-t-4 border-gov-gold dark:border-gov-teal relative overflow-hidden transition-colors duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col items-start gap-4 mb-6">
              <Image
                src="/assets/logo/footer-logo.png"
                alt="Ministry Logo"
                width={240}
                height={120}
                style={{ width: 'auto' }}
                className="h-28 object-contain drop-shadow-xl"
              />
            </div>
            <p className="text-gov-stone dark:text-gov-teal/80 text-sm leading-relaxed max-w-xs transition-colors">
              {t('footer_desc')}
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gov-gold relative inline-block">
              {t('quick_links')}
              <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-gold rounded-full`}></span>
            </h4>
            <ul className="space-y-3 text-sm text-gov-stone dark:text-white/70 transition-colors">
              {footerLinks.length > 0 ? (
                footerLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.url} className="hover:text-gov-gold transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 bg-gov-gold rounded-full"></span>
                      {language === 'ar' ? link.label_ar : link.label_en}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/about" className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('about_portal')}</Link></li>
                  <li><Link href="/directorates" className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('nav_directory')}</Link></li>
                  <li><Link href="/decrees" className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('nav_decrees')}</Link></li>
                  <li><Link href="/open-data" className="hover:text-gov-gold transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gov-gold rounded-full"></span> {t('open_data')}</Link></li>
                  <li><Link href="/sitemap" className="hover:text-gov-gold transition-colors flex items-center gap-2 font-bold"><Network size={12} /> {t('site_map')}</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gov-gold relative inline-block">
              {t('contact_us')}
              <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-gold rounded-full`}></span>
            </h4>
            <ul className="space-y-4 text-sm text-gov-stone dark:text-white/70 transition-colors">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gov-gold mt-1" />
                <div>
                  <span className="block text-xs text-gov-gold/70">{t('contact_center')}</span>
                  <span className="font-bold text-gov-forest dark:text-gov-teal text-lg transition-colors">{phone}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gov-gold" />
                <span>{email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gov-gold mt-1" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gov-gold relative inline-block">
              {t('accessibility')}
              <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-gold rounded-full`}></span>
            </h4>
            <p className="text-sm text-gov-stone dark:text-gov-beige/70 mb-4 transition-colors">
              {language === 'ar'
                ? 'تلتزم البوابة بتوفير إمكانية الوصول الرقمي لجميع فئات المجتمع (WCAG 2.1).'
                : 'The portal is committed to providing digital accessibility for all (WCAG 2.1).'
              }
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleIncreaseFont}
                className="px-3 py-1 bg-gov-gold/10 dark:bg-gov-card/10 dark:text-gov-teal rounded hover:bg-gov-gold hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-emeraldStatic transition-colors text-xs font-bold border border-gov-gold/20 dark:border-gov-teal/40"
                title="Increase Font"
              >
                A+
              </button>
              <button
                onClick={handleDecreaseFont}
                className="px-3 py-1 bg-gov-gold/10 dark:bg-gov-card/10 dark:text-gov-teal rounded hover:bg-gov-gold hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-emeraldStatic transition-colors text-xs font-bold border border-gov-gold/20 dark:border-gov-teal/40"
                title="Decrease Font"
              >
                A-
              </button>
              <button
                onClick={handleToggleContrast}
                className="px-3 py-1 bg-gov-gold/10 dark:bg-gov-card/10 dark:text-gov-teal rounded hover:bg-gov-gold hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-emeraldStatic transition-colors text-xs font-bold border border-gov-gold/20 dark:border-gov-teal/40"
                title="High Contrast"
              >
                {language === 'ar' ? 'تباين' : 'Contrast'}
              </button>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <NewsletterSignup />
          </div>

        </div>

        <div className="pt-8 border-t border-gov-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gov-stone dark:text-gov-beige/50 font-light transition-colors">{t('copyright')}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-gov-stone dark:text-gov-beige/50 hover:text-gov-gold transition-colors">
              {t('footer_privacy')}
            </Link>
            <span className="text-gov-gold/30">|</span>
            <Link href="/terms" className="text-xs text-gov-stone dark:text-gov-beige/50 hover:text-gov-gold transition-colors">
              {t('footer_terms')}
            </Link>
            <span className="text-gov-gold/30">|</span>
            <Image
              src="/assets/logo/footer-logo.png"
              width={64}
              height={32}
              style={{ width: 'auto' }}
              className="h-8 opacity-50 hover:opacity-100 transition-opacity grayscale-0"
              alt="logo footer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
