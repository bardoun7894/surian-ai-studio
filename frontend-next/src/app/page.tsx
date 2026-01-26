'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import NewsTicker from '@/components/NewsTicker';
import FeaturedDirectorates from '@/components/FeaturedDirectorates';
import HeroGrid from '@/components/HeroGrid';
import Announcements from '@/components/Announcements';
import NewsSection from '@/components/NewsSection';
import QuickServices from '@/components/QuickServices';
import StatsAchievements from '@/components/StatsAchievements';
import GovernmentPartners from '@/components/GovernmentPartners';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import ChatBot from '@/components/ChatBot';
import Footer from '@/components/Footer';
import HappinessIndicator from '@/components/HappinessIndicator';
import { useState, useEffect } from 'react';

export default function HomePage() {
  // Accessibility States
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [hasBreakingNews, setHasBreakingNews] = useState(false);

  // Handle Font Resizing
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizePercent}%`;
  }, [fontSizePercent]);

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
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
      <Navbar onSearch={handleSearch} />

      <main className="flex-grow pt-20 overflow-hidden">
        <HeroSection hasBreakingNews={hasBreakingNews} />
        <NewsTicker onNewsLoaded={setHasBreakingNews} />
        <FeaturedDirectorates />
        <HeroGrid />

        {/* News & Announcements */}
        <NewsSection />
        <Announcements />

        {/* Quick Services */}
        <QuickServices />

        {/* Statistics & Achievements */}
        <StatsAchievements />

        {/* Government Partners */}
        <GovernmentPartners />

        {/* FAQ & Contact Sections */}
        <FAQSection />
        <ContactSection />
      </main>

      <ChatBot />
      <HappinessIndicator />

      <Footer
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        onToggleContrast={handleToggleContrast}
      />
    </div>
  );
}

