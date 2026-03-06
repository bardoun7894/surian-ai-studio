'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import NewsTicker from '@/components/NewsTicker';
import HeroGrid from '@/components/HeroGrid';
import Announcements from '@/components/Announcements';
import NewsSection from '@/components/NewsSection';
import QuickServices from '@/components/QuickServices';
import StatsAchievements from '@/components/StatsAchievements';
import DirectoratesList from '@/components/DirectoratesList';
import GovernmentPartners from '@/components/GovernmentPartners';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import ChatBot from '@/components/ChatBot';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { ViewState } from '@/types';

export default function HomePage() {
  // Accessibility States
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Navigation and Theme States
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    // For actual navigation in Next.js, you would use router.push
    // For now, this updates the state
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onSearch={handleSearch}
      />

      <main className="flex-grow pt-20 overflow-hidden">
        <HeroSection onNavigate={handleNavigate} hasBreakingNews={hasBreakingNews} />
        <NewsTicker onNewsLoaded={setHasBreakingNews} />
        <HeroGrid />
        <Announcements />
        <NewsSection />

        {/* Quick Services */}
        <QuickServices />

        {/* Statistics & Achievements */}
        <StatsAchievements />

        {/* Quick Access to Directorates */}
        <div className="bg-gray-50 dark:bg-gov-forest/30 py-16 border-t border-gray-100 dark:border-gov-gold/10">
          <DirectoratesList variant="compact" />
        </div>

        {/* Government Partners */}
        <GovernmentPartners />

        {/* FAQ & Contact Sections */}
        <FAQSection />
        <ContactSection />
      </main>

      <ChatBot />

      <Footer
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        onToggleContrast={handleToggleContrast}
      />
    </div>
  );
}

