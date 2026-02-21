'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  // ChatBot is positioned: Arabic (RTL) → left-6, English (LTR) → right-6
  // ScrollToTop must be on the OPPOSITE side to avoid overlap:
  //   Arabic (RTL) → right-6  |  English (LTR) → left-6
  return (
    <button
      onClick={scrollToTop}
      aria-label={language === 'ar' ? 'العودة إلى الأعلى' : 'Scroll to top'}
      className={`fixed bottom-8 z-40 p-3 rounded-full bg-gov-forest dark:bg-gov-button text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
        language === 'ar' ? 'right-6 left-auto' : 'left-6 right-auto'
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
