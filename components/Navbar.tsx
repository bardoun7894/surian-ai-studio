import React from 'react';
import { Menu, Globe, ShieldCheck } from 'lucide-react';
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
    { label: 'تقديم شكوى', view: 'COMPLAINTS' as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gov-emerald/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('HOME')}>
            <div className="w-12 h-12 bg-gov-emerald rounded-lg flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-gov-gold w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-gov-emerald font-display font-bold text-lg leading-none">البوابة الحكومية</span>
              <span className="text-gov-charcoal/70 text-xs font-sans">المنصة الوطنية الموحدة</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 space-x-reverse bg-gov-beige/50 p-1 rounded-full border border-gov-emerald/5">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.view)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentView === item.view
                    ? 'bg-gov-emerald text-white shadow-md'
                    : 'text-gov-charcoal hover:bg-gov-emerald/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
             <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gov-emerald hover:bg-gov-emerald/5 rounded-lg transition-colors">
               <Globe size={18} />
               <span>English</span>
             </button>
             <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gov-charcoal">
                  <Menu />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-right px-4 py-3 rounded-lg ${
                currentView === item.view ? 'bg-gov-emerald/10 text-gov-emerald font-bold' : 'text-gov-charcoal'
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