import React from 'react';
import { Menu, Globe, Search, Scale } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'الرئيسية', view: 'HOME' as const },
    { label: 'دليل الجهات', view: 'DIRECTORATES' as const },
    { label: 'المراسيم والقوانين', view: 'DECREES' as const },
    { label: 'تقديم شكوى', view: 'COMPLAINTS' as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gov-emerald text-white shadow-lg border-b border-gov-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section - Matching the Banner Asset */}
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('HOME')}>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-md group-hover:bg-gov-gold/20 transition-all"></div>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Coat_of_arms_of_Syria.svg/200px-Coat_of_arms_of_Syria.svg.png" 
                alt="شعار الجمهورية العربية السورية" 
                className="h-14 w-auto object-contain relative z-10"
              />
            </div>
            <div className="flex flex-col border-r border-white/10 pr-4 mr-1">
              <span className="font-display font-bold text-lg leading-tight tracking-wide">الجمهورية العربية السورية</span>
              <span className="text-gov-gold text-xs font-sans tracking-widest uppercase">Syrian Arab Republic</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.view)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentView === item.view || (currentView === 'DIRECTORATE_DETAIL' && item.view === 'DIRECTORATES')
                    ? 'bg-white text-gov-emerald shadow-md font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
             <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gov-gold border border-white/5 transition-colors">
               <Search size={18} />
             </button>
             <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10">
               <Globe size={18} className="text-gov-gold" />
               <span>English</span>
             </button>
             <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:bg-white/10 rounded-lg">
                  <Menu />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gov-emerald border-t border-white/10 p-4 space-y-2 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-right px-4 py-3 rounded-lg ${
                currentView === item.view ? 'bg-white/10 text-gov-gold font-bold' : 'text-white hover:bg-white/5'
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