'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { direction } = useLanguage();

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

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 z-40 p-3 rounded-full bg-gov-forest dark:bg-gov-button text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
        direction === 'rtl' ? 'left-6' : 'right-6'
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
