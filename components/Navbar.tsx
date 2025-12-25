import React, { useState } from 'react';
import { Menu, Globe, Search, Moon, Sun, X, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isDarkMode, toggleTheme }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { label: t('nav_home'), view: 'HOME' as const },
    { label: t('nav_directory'), view: 'DIRECTORATES' as const },
    { label: t('nav_decrees'), view: 'DECREES' as const },
    { label: t('nav_complaints'), view: 'COMPLAINTS' as const },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gov-forest text-gov-forest dark:text-white shadow-lg border-b border-gray-200 dark:border-gov-gold/30 min-h-[5rem] md:min-h-[6rem] transition-all duration-500 backdrop-blur-md flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2">
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            
            {/* Official Branding Area */}
            <div className="flex items-center gap-3 md:gap-4 cursor-pointer group shrink-0" onClick={() => onNavigate('HOME')}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Emblem_of_Syria_%282025%E2%80%93present%29.svg" 
                alt="Emblem" 
                className="h-12 md:h-16 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className={`flex flex-col ${language === 'ar' ? 'border-r pr-3 md:pr-4 mr-1' : 'border-l pl-3 md:pl-4 ml-1'} border-gray-300 dark:border-gov-gold/30`}>
                <span className="font-display font-bold text-sm md:text-lg lg:text-xl leading-none tracking-wide mb-1 text-gov-forest dark:text-white transition-colors">{t('republic_name')}</span>
                <span className="text-gov-gold text-[8px] md:text-[10px] lg:text-xs font-serif tracking-[0.2em] uppercase">{language === 'ar' ? 'Syrian Arab Republic' : 'الجمهورية العربية السورية'}</span>
              </div>
            </div>

            {/* Desktop Nav - Centered with Gold Accents */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap justify-center">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.view)}
                  className={`relative px-5 py-2 text-sm font-bold transition-all duration-300 overflow-hidden group ${
                    currentView === item.view || (currentView === 'DIRECTORATE_DETAIL' && item.view === 'DIRECTORATES')
                      ? 'text-gov-gold'
                      : 'text-gov-forest/70 dark:text-white/80 hover:text-gov-forest dark:hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Active Indicator */}
                  {(currentView === item.view || (currentView === 'DIRECTORATE_DETAIL' && item.view === 'DIRECTORATES')) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gov-gold shadow-[0_0_10px_#b9a779]"></div>
                  )}
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gov-forest/5 dark:bg-white/5 transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 -z-0"></div>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
               
               {/* Theme Toggle */}
               <button 
                 onClick={toggleTheme}
                 className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gov-emeraldLight text-gov-forest dark:text-gov-gold border border-gray-200 dark:border-gov-gold/20 hover:scale-110 transition-all duration-300"
                 title="Toggle Theme"
               >
                 {isDarkMode ? <Sun size={16} className="md:w-[18px] md:h-[18px]" /> : <Moon size={16} className="md:w-[18px] md:h-[18px]" />}
               </button>

               <div className="h-6 md:h-8 w-[1px] bg-gray-300 dark:bg-gov-gold/20 mx-1 hidden sm:block"></div>
               
               <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gov-emeraldLight text-gov-forest dark:text-gov-gold border border-gray-200 dark:border-gov-gold/20 hover:bg-gov-gold hover:text-white dark:hover:text-gov-forest transition-colors"
                  aria-label="Search"
                >
                 <Search size={18} />
               </button>
               
               {/* Language Toggle */}
               <button 
                 onClick={toggleLanguage}
                 className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gov-forest dark:text-gov-gold border border-gov-forest/20 dark:border-gov-gold rounded hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-colors"
               >
                 <Globe size={14} />
                 <span>{t('switch_lang')}</span>
               </button>
               
               <div className="lg:hidden">
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gov-forest dark:text-gov-gold hover:bg-black/5 dark:hover:bg-white/10 rounded-lg">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-white dark:bg-gov-forest border-t border-gray-200 dark:border-gov-gold/20 p-4 space-y-2 shadow-xl absolute top-full left-0 right-0 transition-all duration-300 origin-top transform ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-right rtl:text-right ltr:text-left px-4 py-4 rounded-xl border-b border-gray-100 dark:border-white/5 last:border-0 ${
                currentView === item.view 
                  ? 'bg-gov-beige dark:bg-gov-emeraldLight text-gov-forest dark:text-gov-gold font-bold' 
                  : 'text-gov-forest dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-white/10">
              <button 
                  onClick={() => {
                      setIsSearchOpen(true);
                      setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-gov-forest dark:text-white font-bold"
              >
                  <Search size={20} />
                  <span>{t('nav_search')}</span>
              </button>
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-gov-forest dark:text-white font-bold"
              >
                  <Globe size={20} />
                  <span>{t('switch_lang')}</span>
              </button>
          </div>
        </div>
      </nav>

      {/* Global Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-gov-forest/95 backdrop-blur-md flex items-start justify-center pt-24 md:pt-32 animate-fade-in">
           <button 
             onClick={() => setIsSearchOpen(false)}
             className="absolute top-6 right-6 rtl:right-auto rtl:left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
           >
             <X size={32} />
           </button>

           <div className="w-full max-w-3xl px-4">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">{t('nav_search')}</h2>
              <div className="relative">
                 <input 
                   type="text" 
                   autoFocus
                   placeholder={t('search_placeholder')}
                   className="w-full py-4 md:py-6 pr-12 md:pr-16 pl-6 rtl:pl-12 rtl:pr-6 rounded-2xl bg-white text-gov-charcoal text-lg md:text-xl font-bold shadow-2xl focus:outline-none placeholder:text-gray-400"
                 />
                 <Search className="absolute right-4 md:right-6 rtl:right-auto rtl:left-4 top-1/2 transform -translate-y-1/2 text-gov-emerald" size={24} />
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;