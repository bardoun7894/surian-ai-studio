'use client';

import React, { useState, useRef } from 'react';
import { Menu, Globe, Search, Moon, Sun, X, User, LayoutDashboard, ChevronDown, Scale, Newspaper, Megaphone, Briefcase, MessageSquareWarning, HelpCircle, Phone, Building2, TrendingUp, PlayCircle, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NotificationsDropdown from './NotificationsDropdown';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const quickLinksTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const quickLinks = [
    { icon: Scale, label: t('ql_laws'), href: '/decrees' },
    { icon: Newspaper, label: t('ql_news'), href: '/news' },
    { icon: Megaphone, label: t('ql_announcements'), href: '/announcements' },
    { icon: Briefcase, label: t('ql_services'), href: '/services' },
    { icon: MessageSquareWarning, label: t('ql_complaints'), href: '/complaints' },
    { icon: Building, label: t('ql_directorates'), href: '/directorates' },
    { icon: TrendingUp, label: t('ql_investment'), href: '/investment' },
    { icon: PlayCircle, label: t('ql_media'), href: '/media' },
    { icon: HelpCircle, label: t('ql_faq'), href: '/faq' },
    { icon: Phone, label: t('ql_contact'), href: '/contact' },
    { icon: Building2, label: t('ql_about'), href: '/about' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    if (onSearch) {
      onSearch(searchInput);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
    setSearchInput('');
    setIsSearchOpen(false);
  };


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gov-emeraldStatic bg-pattern-islamic shadow-lg border-b border-gov-gold/20 min-h-[3.5rem] md:min-h-[4rem] transition-all duration-500 flex items-center bg-[length:500px] bg-repeat bg-center bg-blend-soft-light">
        <div className="absolute inset-0 bg-gov-forest/80 mix-blend-multiply z-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2 z-10 relative">
          <div className="flex items-center justify-between flex-wrap gap-y-2">

            {/* Official Branding Area */}
            <Link href="/" className={`flex items-center gap-3 md:gap-4 cursor-pointer group shrink-0 ${language === 'ar' ? '-mr-4' : '-ml-4'}`}>
              <Image
                src="/assets/logo/Asset-14@3x.png"
                alt="Ministry Emblem"
                width={120}
                height={120}
                style={{ width: 'auto' }}
                className="h-20 md:h-24 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              />
            </Link>




            <div className="hidden lg:block relative w-full max-w-md">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className="w-full py-2 pr-10 pl-4 rtl:pl-10 rtl:pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-gov-emeraldStatic focus:border-gov-gold focus:ring-1 focus:ring-gov-gold outline-none transition-all text-sm"
                  placeholder={t('search_placeholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gov-gold hover:text-white transition-colors rtl:right-auto rtl:left-1">
                  <Search size={18} />
                </button>
              </form>
            </div>
            {/* Home shortcut */}
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 shrink-0"
            >
              <span>{t('nav_home')}</span>
            </Link>
            <div className="hidden lg:block relative"
              onMouseEnter={() => {
                if (quickLinksTimeoutRef.current) {
                  clearTimeout(quickLinksTimeoutRef.current);
                  quickLinksTimeoutRef.current = null;
                }
                setIsQuickLinksOpen(true);
              }}
              onMouseLeave={() => {
                quickLinksTimeoutRef.current = setTimeout(() => {
                  setIsQuickLinksOpen(false);
                }, 250);
              }}
            >
              <button
                onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <span>{t('quick_links')}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isQuickLinksOpen ? 'rotate-180' : ''}`} />
              </button>
              {isQuickLinksOpen && (
                <div className={`absolute top-full mt-2 bg-white dark:bg-dm-surface rounded-xl shadow-2xl border border-gov-gold/20 dark:border-dm-border py-2 w-56 animate-fade-in ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsQuickLinksOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gov-charcoal dark:text-white hover:bg-gov-beige/50 dark:hover:bg-white/10 transition-colors"
                      >
                        <Icon size={16} className="text-gov-gold flex-shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 text-white border border-white/20 hover:scale-110 hover:bg-white/20 transition-all duration-300"
                title="Toggle Theme"
              >
                <Sun size={16} className="md:w-[18px] md:h-[18px] hidden dark:block" />
                <Moon size={16} className="md:w-[18px] md:h-[18px] block dark:hidden" />
              </button>

              <div className="h-6 md:h-8 w-[1px] bg-gov-gold/30 dark:bg-gov-emerald/20 mx-1 hidden sm:block"></div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white border border-white/20 hover:bg-gov-gold hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={16} />
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
        <div className={`lg:hidden bg-white dark:bg-dm-surface border-t border-gov-gold/20 dark:border-gov-border/25 p-4 space-y-2 shadow-xl absolute top-full left-0 right-0 transition-all duration-300 origin-top transform ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <div className="space-y-1">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gov-forest dark:text-gov-teal hover:bg-gov-beige/20 dark:hover:bg-white/5 transition-colors"
                >
                  <Icon size={18} className="text-gov-gold flex-shrink-0" />
                  <span className="font-bold text-sm">{link.label}</span>
                </Link>
              );
            })}
          </div>
          {/* Login/Dashboard Button - Mobile */}
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gov-gold text-gov-forest dark:bg-dm-surface dark:text-gov-teal font-bold rounded-xl mt-2"
            >
              <LayoutDashboard size={20} />
              <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gov-gold text-gov-forest dark:bg-dm-surface dark:text-gov-teal font-bold rounded-xl mt-2"
            >
              <User size={20} />
              <span>{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
            </Link>
          )}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gov-gold/10 dark:border-gov-border/15">
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gov-forest dark:text-gov-teal font-bold"
            >
              <Search size={20} />
              <span>{t('nav_search')}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-gov-forest dark:text-gov-teal font-bold"
            >
              <Globe size={20} />
              <span>{t('switch_lang')}</span>
            </button>
          </div>
        </div>
      </nav >

      {/* Global Search Overlay */}
      {
        isSearchOpen && (
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
        )
      }
    </>
  );
};

export default Navbar;
