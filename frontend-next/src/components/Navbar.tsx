'use client';

import React, { useState } from 'react';
import { Menu, Globe, Search, Moon, Sun, X, User, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import NotificationsDropdown from './NotificationsDropdown';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
    setIsSearchOpen(false);
  };

  const navItems = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_directory'), href: '/services' },
    { label: t('nav_decrees'), href: '/decrees' },
    { label: language === 'ar' ? 'الإعلانات' : 'Announcements', href: '/announcements' },
    { label: language === 'ar' ? 'المركز الإعلامي' : 'Media Center', href: '/media' },
    { label: t('nav_complaints'), href: '/complaints' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gov-forest bg-pattern-islamic shadow-lg border-b border-gov-gold/20 min-h-[5rem] md:min-h-[6rem] transition-all duration-500 flex items-center bg-[length:500px] bg-repeat bg-center bg-blend-soft-light">
        <div className="absolute inset-0 bg-gov-forest/80 mix-blend-multiply z-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2 z-10 relative">
          <div className="flex items-center justify-between flex-wrap gap-y-2">

            {/* Official Branding Area */}
            <Link href="/" className={`flex items-center gap-3 md:gap-4 cursor-pointer group shrink-0 ${language === 'ar' ? '-mr-4' : '-ml-4'}`}>
              <Image
                src="/assets/logo/Asset-14@3x.png"
                alt="Ministry Emblem"
                width={96}
                height={96}
                className="h-20 md:h-24 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              />
            </Link>

            {/* Desktop Nav - Centered with Gold Accents */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-5 py-2 text-sm font-bold transition-all duration-300 overflow-hidden group ${isActive(item.href)
                    ? 'text-gov-gold ring-1 ring-white/10'
                    : 'text-white/80 hover:text-white border-transparent hover:bg-white/10 rounded-lg'
                    }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Active Indicator */}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gov-gold shadow-[0_0_10px_#b9a779]"></div>
                  )}
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gov-forest/5 dark:bg-white/5 transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 -z-0"></div>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 text-white border border-white/20 hover:scale-110 hover:bg-white/20 transition-all duration-300"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} className="md:w-[18px] md:h-[18px]" /> : <Moon size={16} className="md:w-[18px] md:h-[18px]" />}
              </button>

              <div className="h-6 md:h-8 w-[1px] bg-gov-gold/30 dark:bg-gov-gold/20 mx-1 hidden sm:block"></div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white border border-white/20 hover:bg-gov-gold hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white border border-white/20 rounded hover:bg-white/10 hover:text-white transition-colors"
              >
                <Globe size={14} />
                <span>{t('switch_lang')}</span>
              </button>

              {/* Notifications - Only show when authenticated */}
              {isAuthenticated && (
                <NotificationsDropdown className="hidden sm:block" />
              )}

              {/* Login/Dashboard Button */}
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold bg-gov-gold text-gov-forest rounded-lg hover:bg-gov-gold/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <LayoutDashboard size={16} />
                  <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold bg-gov-gold text-gov-forest rounded-lg hover:bg-gov-gold/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <User size={16} />
                  <span>{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
                </Link>
              )}

              <div className="lg:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gov-gold hover:bg-white/10 rounded-lg">
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-white dark:bg-gov-forest border-t border-gov-gold/20 dark:border-gov-gold/20 p-4 space-y-2 shadow-xl absolute top-full left-0 right-0 transition-all duration-300 origin-top transform ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-right rtl:text-right ltr:text-left px-4 py-4 rounded-xl border-b border-gov-gold/10 dark:border-white/5 last:border-0 ${isActive(item.href)
                ? 'bg-gov-beige dark:bg-gov-forest text-gov-forest dark:text-gov-gold font-bold'
                : 'text-gov-forest dark:text-white hover:bg-gov-beige/20 dark:hover:bg-white/5'
                }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Login/Dashboard Button - Mobile */}
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gov-gold text-gov-forest font-bold rounded-xl mt-2"
            >
              <LayoutDashboard size={20} />
              <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gov-gold text-gov-forest font-bold rounded-xl mt-2"
            >
              <User size={20} />
              <span>{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
            </Link>
          )}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gov-gold/10 dark:border-white/10">
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
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full py-4 md:py-6 pr-12 md:pr-16 pl-6 rtl:pl-12 rtl:pr-6 rounded-2xl bg-white text-gov-charcoal text-lg md:text-xl font-bold shadow-2xl focus:outline-none placeholder:text-gov-sand/50"
                />
                <button type="submit" className="absolute right-4 md:right-6 rtl:right-auto rtl:left-4 top-1/2 transform -translate-y-1/2 text-gov-forest hover:scale-110 transition-transform">
                  <Search size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
