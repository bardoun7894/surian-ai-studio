'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API } from '@/lib/repository';
import Link from 'next/link';

import NewsletterSignup from './NewsletterSignup';

import { useTheme } from '@/contexts/ThemeContext';

const socialMediaLinks = [
  { icon: Facebook, label: { ar: 'فيسبوك', en: 'Facebook' }, href: 'https://facebook.com/MoEI.Syria' },
  { icon: Twitter, label: { ar: 'إكس (تويتر)', en: 'X (Twitter)' }, href: 'https://x.com/MoEI_Syria' },
  { icon: Instagram, label: { ar: 'إنستغرام', en: 'Instagram' }, href: 'https://instagram.com/MoEI.Syria' },
  { icon: Youtube, label: { ar: 'يوتيوب', en: 'YouTube' }, href: 'https://youtube.com/@MoEI_Syria' },
  { icon: Send, label: { ar: 'تيليغرام', en: 'Telegram' }, href: 'https://t.me/MoEI_Syria' },
];

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { fontSize, setFontSize, toggleHighContrast } = useTheme();
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({});

  const handleIncreaseFont = () => {
    setFontSize(Math.min(fontSize + 10, 150));
  };

  const handleDecreaseFont = () => {
    setFontSize(Math.max(fontSize - 10, 80));
  };

  const handleToggleContrast = () => {
    toggleHighContrast();
  };

  useEffect(() => {
    API.settings.getByGroup('contact')
      .then(data => setContactInfo(data as Record<string, string>))
      .catch(() => { });
  }, []);

  const phone = contactInfo.contact_phone || '19999';
  const email = contactInfo.contact_email || 'info@moe.gov.sy';
  const address = language === 'en' && contactInfo.contact_address_en
    ? contactInfo.contact_address_en
    : (contactInfo.contact_address_ar || t('damascus_address'));

  return (
    <footer className="bg-white dark:bg-dm-surface text-gov-forest dark:text-gov-teal pt-14 md:pt-16 pb-8 border-t-4 border-gov-forest dark:border-gov-teal relative overflow-hidden transition-colors duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">

          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col items-start gap-4 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo/footer-logo.png"
                alt="Ministry Logo"
                className="object-contain drop-shadow-xl"
                style={{ width: 'auto', height: 'auto', maxHeight: '7rem' }}
              />
            </div>
            <p className="text-gov-forest/70 dark:text-gov-teal/80 text-sm leading-relaxed max-w-xs transition-colors">
              {t('footer_desc')}
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gov-forest dark:text-gov-teal relative inline-block">
              {language === 'ar' ? 'تابعونا' : 'Follow Us'}
              <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-forest dark:bg-gov-teal rounded-full`}></span>
            </h4>
            <ul className="space-y-3 text-sm text-gov-forest/70 dark:text-white/70 transition-colors">
              {socialMediaLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gov-forest/70 dark:text-white/70 hover:text-gov-gold transition-colors flex items-center gap-3 py-2"
                    >
                      <Icon size={18} className="text-gov-forest dark:text-gov-teal flex-shrink-0" />
                      <span>{language === 'ar' ? social.label.ar : social.label.en}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gov-forest dark:text-gov-teal relative inline-block">
              {t('contact_us')}
              <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-forest dark:bg-gov-teal rounded-full`}></span>
            </h4>
            <ul className="space-y-4 text-sm text-gov-forest/70 dark:text-white/70 transition-colors">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gov-forest dark:text-gov-teal mt-1" />
                <div>
                  <span className="block text-xs text-gov-forest/70 dark:text-gov-teal/70">{t('contact_center')}</span>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="font-bold text-gov-forest dark:text-gov-teal text-lg transition-colors hover:text-gov-gold dir-ltr">{phone}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gov-forest dark:text-gov-teal" />
                <a href={`mailto:${email}`} className="text-gov-forest/70 dark:text-white/70 hover:text-gov-gold transition-colors">{email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gov-forest dark:text-gov-teal mt-1" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gov-forest dark:text-gov-teal relative inline-block">
              {t('accessibility')}
              <span className={`absolute -bottom-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-8 h-1 bg-gov-forest dark:bg-gov-teal rounded-full`}></span>
            </h4>
            <p className="text-sm text-gov-forest/70 dark:text-gov-beige/70 mb-4 transition-colors">
              {language === 'ar'
                ? 'تلتزم البوابة بتوفير إمكانية الوصول الرقمي لجميع فئات المجتمع (WCAG 2.1).'
                : 'The portal is committed to providing digital accessibility for all (WCAG 2.1).'
              }
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleIncreaseFont}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gov-forest/10 text-gov-forest dark:bg-gov-card/10 dark:text-gov-teal rounded hover:bg-gov-forest hover:text-white dark:hover:bg-gov-teal dark:hover:text-gov-forest transition-colors text-xs font-bold border border-gov-forest/20 dark:border-gov-teal/40"
                title="Increase Font"
              >
                A+
              </button>
              <button
                onClick={handleDecreaseFont}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gov-forest/10 text-gov-forest dark:bg-gov-card/10 dark:text-gov-teal rounded hover:bg-gov-forest hover:text-white dark:hover:bg-gov-teal dark:hover:text-gov-forest transition-colors text-xs font-bold border border-gov-forest/20 dark:border-gov-teal/40"
                title="Decrease Font"
              >
                A-
              </button>
              <button
                onClick={handleToggleContrast}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gov-forest/10 text-gov-forest dark:bg-gov-card/10 dark:text-gov-teal rounded hover:bg-gov-forest hover:text-white dark:hover:bg-gov-teal dark:hover:text-gov-forest transition-colors text-xs font-bold border border-gov-forest/20 dark:border-gov-teal/40 px-3"
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

        <div className="pt-8 border-t border-gov-forest/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gov-forest/60 dark:text-gov-beige/50 font-light transition-colors">{t('copyright')}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-gov-forest/60 dark:text-gov-beige/50 hover:text-gov-gold transition-colors">
              {t('footer_privacy')}
            </Link>
            <span className="text-gov-forest/30 dark:text-gov-teal/30">|</span>
            <Link href="/terms" className="text-xs text-gov-forest/60 dark:text-gov-beige/50 hover:text-gov-gold transition-colors">
              {t('footer_terms')}
            </Link>
            <span className="text-gov-forest/30 dark:text-gov-teal/30">|</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo/footer-logo.png"
              className="opacity-50 hover:opacity-100 transition-opacity"
              style={{ width: 'auto', height: 'auto', maxHeight: '2rem' }}
              alt="logo footer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
