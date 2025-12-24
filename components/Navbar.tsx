import React from 'react';
import { Menu, Globe, Search, Moon, Sun } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isDarkMode, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'الرئيسية', view: 'HOME' as const },
    { label: 'دليل الجهات', view: 'DIRECTORATES' as const },
    { label: 'المراسيم والقوانين', view: 'DECREES' as const },
    { label: 'منظومة الشكاوى', view: 'COMPLAINTS' as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gov-forest text-gov-forest dark:text-white shadow-lg border-b border-gray-200 dark:border-gov-gold/30 h-24 transition-all duration-500 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Official Branding Area */}
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('HOME')}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Emblem_of_Syria_%282025%E2%80%93present%29.svg" 
              alt="شعار الجمهورية العربية السورية" 
              className="h-16 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col border-r border-gray-300 dark:border-gov-gold/30 pr-4 mr-1">
              <span className="font-display font-bold text-lg md:text-xl leading-none tracking-wide mb-1 text-gov-forest dark:text-white transition-colors">الجمهورية العربية السورية</span>
              <span className="text-gov-gold text-[10px] md:text-xs font-serif tracking-[0.2em] uppercase">Syrian Arab Republic</span>
            </div>
          </div>

          {/* Desktop Nav - Centered with Gold Accents */}
          <div className="hidden lg:flex items-center gap-2">
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
          <div className="flex items-center gap-3">
             
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gov-emeraldLight text-gov-forest dark:text-gov-gold border border-gray-200 dark:border-gov-gold/20 hover:scale-110 transition-all duration-300"
               title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <div className="h-8 w-[1px] bg-gray-300 dark:bg-gov-gold/20 mx-1 hidden sm:block"></div>
             
             <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gov-emeraldLight text-gov-forest dark:text-gov-gold border border-gray-200 dark:border-gov-gold/20 hover:bg-gov-gold hover:text-white dark:hover:text-gov-forest transition-colors">
               <Search size={18} />
             </button>
             
             <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gov-forest dark:text-gov-gold border border-gov-forest/20 dark:border-gov-gold rounded hover:bg-gov-forest hover:text-white dark:hover:bg-gov-gold dark:hover:text-gov-forest transition-colors">
               <Globe size={14} />
               <span>EN</span>
             </button>
             
             <div className="lg:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gov-forest dark:text-gov-gold hover:bg-black/5 dark:hover:bg-white/10 rounded-lg">
                  <Menu size={24} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gov-forest border-t border-gray-200 dark:border-gov-gold/20 p-4 space-y-2 shadow-xl absolute top-24 left-0 right-0">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-right px-4 py-3 rounded-lg border-b border-gray-100 dark:border-white/5 last:border-0 ${
                currentView === item.view 
                  ? 'bg-gov-beige dark:bg-gov-emeraldLight text-gov-forest dark:text-gov-gold font-bold' 
                  : 'text-gov-forest dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;