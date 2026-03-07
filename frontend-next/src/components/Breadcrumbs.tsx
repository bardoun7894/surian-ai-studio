'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Inline SVG icons to avoid Lucide SSR hydration mismatch
const HomeIcon = ({ size = 15 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const ChevronLeftIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
import { useLanguage } from '@/contexts/LanguageContext';

const routeLabels: Record<string, { ar: string; en: string }> = {
  // Public pages
  'news': { ar: 'الأخبار', en: 'News' },
  'announcements': { ar: 'الإعلانات', en: 'Announcements' },
  'complaints': { ar: 'الشكاوى', en: 'Complaints' },
  'suggestions': { ar: 'المقترحات', en: 'Suggestions' },
  'directorates': { ar: 'المديريات', en: 'Directorates' },
  'services': { ar: 'الخدمات', en: 'Services' },
  'media': { ar: 'المركز الإعلامي', en: 'Media Center' },
  'faq': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  'contact': { ar: 'اتصل بنا', en: 'Contact Us' },
  'decrees': { ar: 'القوانين والتشريعات', en: 'Laws & Legislation' },
  'search': { ar: 'البحث', en: 'Search' },
  'semantic': { ar: 'البحث الذكي', en: 'Smart Search' },
  'investments': { ar: 'الاستثمار', en: 'Investments' },
  'investment': { ar: 'الاستثمار', en: 'Investment' },
  'about': { ar: 'عن البوابة', en: 'About Portal' },
  'open-data': { ar: 'البيانات المفتوحة', en: 'Open Data' },
  'sitemap': { ar: 'خريطة الموقع', en: 'Site Map' },
  'site-map': { ar: 'خريطة الموقع', en: 'Site Map' },
  'privacy-policy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  'terms': { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
  'unauthorized': { ar: 'غير مصرّح', en: 'Unauthorized' },
  'newsletter': { ar: 'النشرة البريدية', en: 'Newsletter' },
  'unsubscribe': { ar: 'إلغاء الاشتراك', en: 'Unsubscribe' },
  'track': { ar: 'تتبع الطلب', en: 'Track Request' },

  // Auth pages
  'login': { ar: 'تسجيل الدخول', en: 'Login' },
  'register': { ar: 'إنشاء حساب', en: 'Register' },
  'forgot-password': { ar: 'نسيت كلمة المرور', en: 'Forgot Password' },
  'reset-password': { ar: 'إعادة تعيين كلمة المرور', en: 'Reset Password' },
  'two-factor': { ar: 'التحقق بخطوتين', en: 'Two-Factor Auth' },

  // User pages
  'profile': { ar: 'الملف الشخصي', en: 'Profile' },
  'settings': { ar: 'الإعدادات', en: 'Settings' },
  'notifications': { ar: 'الإشعارات', en: 'Notifications' },
  'dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },

  // Admin pages
  'admin': { ar: 'الإدارة', en: 'Admin' },
  'users': { ar: 'المستخدمون', en: 'Users' },
  'content': { ar: 'إدارة المحتوى', en: 'Content Management' },
  'backups': { ar: 'النسخ الاحتياطية', en: 'Backups' },
  'promotional': { ar: 'المحتوى الترويجي', en: 'Promotional' },
  'webhooks': { ar: 'الربط البرمجي', en: 'Webhooks' },
  'reports': { ar: 'التقارير', en: 'Reports' },
  'newsletters': { ar: 'النشرات البريدية', en: 'Newsletters' },
  'faqs': { ar: 'الأسئلة الشائعة', en: 'FAQs' },
  'chat-handoffs': { ar: 'تحويلات المحادثات', en: 'Chat Handoffs' },
  'audit': { ar: 'سجل التدقيق', en: 'Audit Log' },
  'sub-directorates': { ar: 'المديريات الفرعية', en: 'Sub-Directorates' },
};

// Contextual labels for dynamic segments (IDs, slugs, tracking numbers)
// based on the parent route segment
const dynamicSegmentLabels: Record<string, { ar: string; en: string }> = {
  'news': { ar: 'تفاصيل الخبر', en: 'Article Details' },
  'announcements': { ar: 'تفاصيل الإعلان', en: 'Announcement Details' },
  'complaints': { ar: 'تفاصيل الشكوى', en: 'Complaint Details' },
  'services': { ar: 'تفاصيل الخدمة', en: 'Service Details' },
  'directorates': { ar: 'تفاصيل المديرية', en: 'Directorate Details' },
  'sub-directorates': { ar: 'تفاصيل المديرية الفرعية', en: 'Sub-Directorate Details' },
  'investment': { ar: 'تفاصيل الاستثمار', en: 'Investment Details' },
  'investments': { ar: 'تفاصيل الاستثمار', en: 'Investment Details' },
  'decrees': { ar: 'تفاصيل المرسوم', en: 'Decree Details' },
  'suggestions': { ar: 'تفاصيل المقترح', en: 'Suggestion Details' },
};

/**
 * Checks if a segment looks like a dynamic/ID value rather than a named route.
 * Matches numeric IDs, UUIDs, tracking numbers (e.g., SUG-123456, CMP-ABC),
 * and other non-descriptive path values.
 */
function isDynamicSegment(segment: string): boolean {
  // Pure numeric
  if (/^\d+$/.test(segment)) return true;
  // UUID-like
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(segment)) return true;
  // Tracking numbers (e.g., SUG-123456, CMP-123456)
  if (/^[A-Z]{2,5}-\d+$/i.test(segment)) return true;
  // MongoDB ObjectId-like (24 hex chars)
  if (/^[0-9a-f]{24}$/i.test(segment)) return true;
  // Short alphanumeric IDs (e.g. d1, sub1, srv1)
  if (/^[a-z]+\d+$/i.test(segment)) return true;
  return false;
}

// Pages that should NOT show breadcrumbs
const excludedPaths = ['/', '', '/login', '/register', '/forgot-password', '/reset-password', '/two-factor'];

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { language, direction } = useLanguage();
  const isAr = language === 'ar';
  const isRtl = direction === 'rtl';
  // Don't render on homepage or excluded paths
  if (!pathname || excludedPaths.includes(pathname)) return null;

  // Strip route groups like (auth), (protected)
  const cleanPath = pathname.replace(/\/\([^)]+\)/g, '');
  const segments = cleanPath.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const Separator = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  const crumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;

    let label: string;
    if (routeLabels[segment]) {
      // Known named route
      label = isAr ? routeLabels[segment].ar : routeLabels[segment].en;
    } else if (isDynamicSegment(segment)) {
      // Dynamic segment - check if this is a nested sub-detail
      // e.g. /directorates/3/5 -> first ID = "Directorate Details", second ID = "Sub-Directorate Details"

      // If the previous segment is also dynamic, this is a sub-detail (e.g. /directorates/3/5)
      if (index > 1 && isDynamicSegment(segments[index - 1])) {
        // Find the nearest named ancestor for sub-context
        let ancestorRoute = '';
        for (let i = index - 2; i >= 0; i--) {
          if (!isDynamicSegment(segments[i])) { ancestorRoute = segments[i]; break; }
        }
        if (ancestorRoute === 'directorates') {
          label = isAr ? 'تفاصيل المديرية الفرعية' : 'Sub-Directorate Details';
        } else {
          label = isAr ? 'التفاصيل' : 'Details';
        }
      } else {
        let contextLabel: { ar: string; en: string } | undefined;
        for (let i = index - 1; i >= 0; i--) {
          contextLabel = dynamicSegmentLabels[segments[i]];
          if (contextLabel) break;
        }
        if (contextLabel) {
          label = isAr ? contextLabel.ar : contextLabel.en;
        } else {
          label = isAr ? 'التفاصيل' : 'Details';
        }
      }
    } else {
      // Unknown segment (e.g., slugs) - capitalize and clean up for display
      label = decodeURIComponent(segment)
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    return { path, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="pt-[60px] md:pt-[90px] px-4 sm:px-6 lg:px-8 bg-gov-beige dark:bg-dm-bg border-b border-gray-200/60 dark:border-gov-border/10"
    >
      <ol className="flex items-center flex-nowrap md:flex-wrap gap-1 sm:gap-1.5 md:gap-2 text-[11px] md:text-[13px] leading-none max-w-7xl mx-auto py-2.5 md:py-3 overflow-x-auto">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gov-forest dark:text-gov-gold hover:underline transition-colors"
          >
            <span className="shrink-0"><HomeIcon size={15} /></span>
            <span className="font-semibold">{isAr ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.path} className="inline-flex items-center gap-1 md:gap-1.5 whitespace-nowrap shrink-0">
            <span className="shrink-0 text-gray-400/60 dark:text-white/30"><Separator size={14} /></span>
            {crumb.isLast ? (
              <span className="text-gov-stone dark:text-white/60 font-medium truncate max-w-[150px] md:max-w-none">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.path}
                className="text-gov-forest dark:text-gov-gold font-semibold hover:underline transition-colors"
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
