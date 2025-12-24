import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import { ViewState } from './types';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedDirectorateId, setSelectedDirectorateId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
               <h1 className="text-3xl font-display font-bold text-gov-forest dark:text-gov-beige">بوابة الشكاوى الذكية</h1>
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
      case 'HOME':
      default:
        return (
          <>
            <HeroSection onNavigate={setCurrentView} />
            <NewsTicker />
            <NewsSection />
            <div className="py-20 bg-white dark:bg-gov-beige border-t border-gray-100 dark:border-gov-gold/10 transition-colors">
               <div className="max-w-7xl mx-auto px-4 text-center">
                  <h2 className="text-3xl font-display font-bold text-gov-charcoal mb-12">لماذا المنصة الموحدة؟</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[
                       { title: 'سهولة الوصول', desc: 'كافة الخدمات الحكومية في مكان واحد.' },
                       { title: 'سرعة الإنجاز', desc: 'تقنيات ذكاء اصطناعي لتسريع المعالجة.' },
                       { title: 'شفافية كاملة', desc: 'تتبع حالة طلباتك لحظة بلحظة.' }
                     ].map((feat, i) => (
                       <div key={i} className="p-8 rounded-2xl bg-gray-50 dark:bg-white border border-gray-100 hover:border-gov-gold/30 transition-colors shadow-sm">
                          <h3 className="text-xl font-bold text-gov-emerald mb-4">{feat.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
            
            {/* Quick Access to Directorates (Compact Version) */}
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

      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;