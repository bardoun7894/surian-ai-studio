'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const routeLabels: Record<string, { ar: string; en: string }> = {
  'news': { ar: 'الأخبار', en: 'News' },
  'announcements': { ar: 'الإعلانات', en: 'Announcements' },
  'complaints': { ar: 'الشكاوى', en: 'Complaints' },
  'suggestions': { ar: 'المقترحات', en: 'Suggestions' },
  'directorates': { ar: 'الهيكل التنظيمي', en: 'Organizational Structure' },
  'services': { ar: 'الخدمات', en: 'Services' },
  'media': { ar: 'المركز الإعلامي', en: 'Media Center' },
  'faq': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  'contact': { ar: 'اتصل بنا', en: 'Contact Us' },
  'profile': { ar: 'الملف الشخصي', en: 'Profile' },
  'settings': { ar: 'الإعدادات', en: 'Settings' },
  'notifications': { ar: 'الإشعارات', en: 'Notifications' },
  'login': { ar: 'تسجيل الدخول', en: 'Login' },
  'register': { ar: 'إنشاء حساب', en: 'Register' },
  'forgot-password': { ar: 'نسيت كلمة المرور', en: 'Forgot Password' },
  'two-factor': { ar: 'التحقق بخطوتين', en: 'Two-Factor Auth' },
  'decrees': { ar: 'المراسيم والقوانين', en: 'Decrees & Laws' },
  'search': { ar: 'البحث', en: 'Search' },
  'investments': { ar: 'الاستثمار', en: 'Investments' },
  'about': { ar: 'عن البوابة', en: 'About Portal' },
  'site-map': { ar: 'خريطة الموقع', en: 'Site Map' },
  'open-data': { ar: 'البيانات المفتوحة', en: 'Open Data' },
};

// Pages that should NOT show breadcrumbs
const excludedPaths = ['/', '', '/login', '/register', '/forgot-password', '/reset-password', '/two-factor'];

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { language, direction } = useLanguage();
  const isAr = language === 'ar';

  // Don't render on homepage or excluded paths
  if (!pathname || excludedPaths.includes(pathname)) return null;

  // Strip route groups like (auth), (protected)
  const cleanPath = pathname.replace(/\/\([^)]+\)/g, '');
  const segments = cleanPath.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const Separator = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const crumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = routeLabels[segment]
      ? (isAr ? routeLabels[segment].ar : routeLabels[segment].en)
      : decodeURIComponent(segment);
    const isLast = index === segments.length - 1;

    return { path, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="pt-[72px] md:pt-[88px] pb-2 px-4 sm:px-6 lg:px-8 bg-gov-beige dark:bg-dm-bg border-b border-gray-200/60 dark:border-gov-border/10">
      <ol className="flex items-center flex-wrap gap-1 text-sm max-w-7xl mx-auto">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gov-forest dark:text-gov-gold hover:underline transition-colors"
          >
            <Home size={14} />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="inline-flex items-center gap-1">
            <Separator size={14} className="text-gray-400 dark:text-white/40" />
            {crumb.isLast ? (
              <span className="text-gray-600 dark:text-white/60 font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.path}
                className="text-gov-forest dark:text-gov-gold hover:underline transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
