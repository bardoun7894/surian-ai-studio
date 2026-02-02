'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import NewsTicker from '@/components/NewsTicker';
import FeaturedDirectorates from '@/components/FeaturedDirectorates';
import HeroGrid from '@/components/HeroGrid';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

// Dynamic imports for below-fold components
const NewsSection = dynamic(() => import('@/components/NewsSection'));
const Announcements = dynamic(() => import('@/components/Announcements'));
const QuickLinks = dynamic(() => import('@/components/QuickLinks'));
const GovernmentPartners = dynamic(() => import('@/components/GovernmentPartners'));
const NewsletterSection = dynamic(() => import('@/components/NewsletterSection'));
const FAQSection = dynamic(() => import('@/components/FAQSection'));
const ContactSection = dynamic(() => import('@/components/ContactSection'));
const SyriaMap = dynamic(() => import('@/components/SyriaMap'), { ssr: false });

export default function HomePage() {
  // Accessibility States
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [hasBreakingNews, setHasBreakingNews] = useState(false);

  // Handle Font Resizing
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizePercent}%`;
  }, [fontSizePercent]);

  // Handle smooth scroll for hash navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  // Handle High Contrast Mode
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
      document.documentElement.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const handleIncreaseFont = () => {
    setFontSizePercent(prev => Math.min(prev + 10, 150));
  };

  const handleDecreaseFont = () => {
    setFontSizePercent(prev => Math.max(prev - 10, 80));
  };

  const handleToggleContrast = () => {
    setIsHighContrast(!isHighContrast);
  };

  const handleSearch = (query: string) => {
    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar onSearch={handleSearch} />

      <main className="flex-grow pt-20 md:pt-24 overflow-hidden">
        <HeroSection hasBreakingNews={hasBreakingNews} />
        <NewsTicker onNewsLoaded={setHasBreakingNews} />

        <FeaturedDirectorates />
        <HeroGrid />

        {/* News & Announcements */}
        <NewsSection />
        <Announcements />

        {/* Quick Links */}
        <QuickLinks />

        {/* Government Partners */}
        <GovernmentPartners />

        {/* Newsletter */}
        <NewsletterSection />

        {/* FAQ & Contact Sections */}
        <FAQSection />
        <ContactSection />
        <SyriaMap />
      </main>


      <Footer
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        onToggleContrast={handleToggleContrast}
      />
    </div>
  );
}

