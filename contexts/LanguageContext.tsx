import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Brand
  'republic_name': { ar: 'الجمهورية العربية السورية', en: 'Syrian Arab Republic' },
  'portal_name': { ar: 'البوابة الإلكترونية', en: 'E-Government Portal' },
  'cabinet': { ar: 'رئاسة مجلس الوزراء', en: 'Prime Ministry' },
  'unified_platform': { ar: 'المنصة الوطنية الموحدة للخدمات الحكومية الإلكترونية', en: 'The Unified National Platform for E-Government Services' },
  'secure_gateway': { ar: 'بوابة آمنة، خدمات متكاملة، ومستقبل رقمي', en: 'Secure Gateway, Integrated Services, Digital Future' },

  // Nav
  'nav_home': { ar: 'الرئيسية', en: 'Home' },
  'nav_directory': { ar: 'دليل الجهات', en: 'Directory' },
  'nav_decrees': { ar: 'المراسيم والقوانين', en: 'Decrees & Laws' },
  'nav_complaints': { ar: 'منظومة الشكاوى', en: 'Complaints' },
  'nav_search': { ar: 'بحث', en: 'Search' },

  // Hero
  'hero_services_btn': { ar: 'دليل الخدمات', en: 'Services Guide' },
  'hero_decrees_btn': { ar: 'الجريدة الرسمية', en: 'Official Gazette' },
  'stat_services': { ar: 'خدمة إلكترونية', en: 'E-Services' },
  'stat_secure': { ar: 'بوابة آمنة', en: 'Secure Portal' },
  'stat_transparency': { ar: 'شفافية البيانات', en: 'Data Transparency' },

  // Directorates
  'dir_title_full': { ar: 'دليل الجهات الحكومية', en: 'Government Directory' },
  'dir_subtitle_full': { ar: 'تصفح الدليل الشامل للوزارات والهيئات الحكومية والخدمات الرقمية.', en: 'Browse the comprehensive directory of ministries, agencies, and digital services.' },
  'dir_title_compact': { ar: 'الوصول السريع للجهات', en: 'Quick Access' },
  'dir_subtitle_compact': { ar: 'أكثر الجهات الحكومية طلباً وخدماتها الرقمية.', en: 'Most requested government agencies and their digital services.' },
  'search_placeholder': { ar: 'بحث عن وزارة أو هيئة...', en: 'Search for a ministry or agency...' },
  'view_details': { ar: 'تصفح', en: 'View' },
  'view_all_dirs': { ar: 'عرض دليل الجهات الكامل', en: 'View Full Directory' },

  // News
  'news_center': { ar: 'المركز الإعلامي', en: 'Media Center' },
  'news_subtitle': { ar: 'آخر الأخبار والمراسيم والقرارات الحكومية', en: 'Latest news, decrees, and government decisions' },
  'read_more': { ar: 'اقرأ المزيد', en: 'Read More' },
  'view_archive': { ar: 'عرض الأرشيف', en: 'View Archive' },

  // Footer
  'quick_links': { ar: 'روابط سريعة', en: 'Quick Links' },
  'contact_us': { ar: 'اتصل بنا', en: 'Contact Us' },
  'accessibility': { ar: 'إمكانية الوصول', en: 'Accessibility' },
  'about_portal': { ar: 'عن البوابة', en: 'About Portal' },
  'open_data': { ar: 'البيانات المفتوحة', en: 'Open Data' },
  'site_map': { ar: 'خريطة الموقع (Site Map)', en: 'Site Map' },
  'contact_center': { ar: 'مركز الاتصال الموحد', en: 'Unified Contact Center' },
  'damascus_address': { ar: 'دمشق - تنظيم كفرسوسة - مبنى رئاسة مجلس الوزراء', en: 'Damascus - Kafr Sousa - Prime Ministry Building' },
  'copyright': { ar: '© 2024 الجمهورية العربية السورية - جميع الحقوق محفوظة.', en: '© 2024 Syrian Arab Republic - All Rights Reserved.' },
  'footer_desc': { ar: 'البوابة الإلكترونية الرسمية الموحدة. المصدر الموثوق للمعلومات والخدمات الحكومية في الجمهورية العربية السورية.', en: 'The Official Unified E-Government Portal. The trusted source for government information and services in the Syrian Arab Republic.' },
  
  // Complaints
  'complaint_portal_title': { ar: 'بوابة الشكاوى الذكية', en: 'Smart Complaints Portal' },
  
  // General
  'switch_lang': { ar: 'English', en: 'عربي' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gov_lang');
      return (saved as Language) || 'ar';
    }
    return 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('gov_lang', language);
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    
    // Adjust font based on language if needed, though the stack handles both well
    if (language === 'en') {
      document.body.classList.add('font-english');
    } else {
      document.body.classList.remove('font-english');
    }

  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
