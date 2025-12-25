import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'; // Import Context
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ComplaintPortal from './components/ComplaintPortal';
import DirectoratesList from './components/DirectoratesList';
import DirectorateDetail from './components/DirectorateDetail';
import DecreesArchive from './components/DecreesArchive';
import Footer from './components/Footer';
import NewsTicker from './components/NewsTicker';
import NewsSection from './components/NewsSection';
import ChatBot from './components/ChatBot';
import ContactSection from './components/ContactSection';
import FAQSection from './components/FAQSection';
import HeroGrid from './components/HeroGrid';
import AboutPage from './components/AboutPage';
import OpenDataPage from './components/OpenDataPage';
import NewsArchivePage from './components/NewsArchivePage';
import { ViewState } from './types';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

// Inner App Component to consume Context
const AppContent = () => {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedDirectorateId, setSelectedDirectorateId] = useState<string | null>(null);
  
  // Theme Initialization with System Preference Support
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('gov_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default fallback
  });
  
  // Accessibility States
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Apply Theme and Persist
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('gov_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('gov_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle Font Resizing (Relative Units requirement)
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleIncreaseFont = () => {
    setFontSizePercent(prev => Math.min(prev + 10, 150)); 
  };

  const handleDecreaseFont = () => {
    setFontSizePercent(prev => Math.max(prev - 10, 80)); 
  };

  const handleToggleContrast = () => {
    setIsHighContrast(!isHighContrast);
  };

  const handleDirectorateSelect = (id: string) => {
    setSelectedDirectorateId(id);
    setCurrentView('DIRECTORATE_DETAIL');
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'COMPLAINTS':
        return (
          <div className="animate-fade-in pt-12 pb-20">
            <div className="text-center mb-4">
               <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-beige">{t('complaint_portal_title')}</h1>
            </div>
            <ComplaintPortal />
          </div>
        );
      case 'DIRECTORATES':
        return (
          <div className="animate-fade-in pt-12">
             <DirectoratesList 
               variant="full"
               onSelectDirectorate={handleDirectorateSelect} 
             />
          </div>
        );
      case 'DIRECTORATE_DETAIL':
        return selectedDirectorateId ? (
           <DirectorateDetail 
             directorateId={selectedDirectorateId} 
             onBack={() => setCurrentView('DIRECTORATES')} 
           />
        ) : (
          <div className="p-20 text-center text-gov-forest dark:text-white">Ministry ID missing</div>
        );
      case 'DECREES':
        return (
           <div className="animate-fade-in pt-12">
             <DecreesArchive />
           </div>
        );
      case 'ABOUT':
        return (
          <div className="animate-fade-in pt-12">
            <AboutPage />
          </div>
        );
      case 'OPEN_DATA':
        return (
          <div className="animate-fade-in pt-12">
            <OpenDataPage />
          </div>
        );
      case 'NEWS_ARCHIVE':
        return (
          <div className="animate-fade-in pt-12">
            <NewsArchivePage />
          </div>
        );
      case 'HOME':
      default:
        return (
          <>
            <HeroSection onNavigate={setCurrentView} />
            <NewsTicker />
            <HeroGrid />
            <NewsSection onNavigate={setCurrentView} />
            
            {/* Quick Access to Directorates */}
            <div className="bg-gray-50 dark:bg-gov-forest/30 py-16 border-t border-gray-100 dark:border-gov-gold/10">
              <DirectoratesList 
                variant="compact" 
                onSelectDirectorate={handleDirectorateSelect}
                onViewAll={() => {
                  setCurrentView('DIRECTORATES');
                  window.scrollTo(0, 0);
                }}
              />
            </div>
            
            {/* New Sections for Compliance */}
            <FAQSection />
            <ContactSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors duration-500">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-grow pt-20">
        {renderContent()}
      </main>

      <Footer 
        onNavigate={setCurrentView} 
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        onToggleContrast={handleToggleContrast}
      />
      <ChatBot />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;