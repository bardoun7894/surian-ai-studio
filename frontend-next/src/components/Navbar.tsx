'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Globe, Search, Moon, Sun, X, User, LayoutDashboard, ChevronDown, Scale, Newspaper, Megaphone, Briefcase, MessageSquareWarning, HelpCircle, Phone, Building2, TrendingUp, PlayCircle, Building, FileText, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import NotificationsDropdown from './NotificationsDropdown';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import NavDropdown from './NavDropdown';
import MegaMenu from './MegaMenu';
import DepartmentsMenu from './DepartmentsMenu';
import { API } from '@/lib/repository';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (menu: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200); // Short delay to allow moving to panel
  };

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const closeMenu = () => setActiveMenu(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-focus input when expanded
  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await API.searchAutocomplete.suggest(debouncedSearchTerm);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    if (onSearch) {
      onSearch(searchInput);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }

    setSearchInput('');
    setIsSearchExpanded(false);
    setShowSuggestions(false);
    setActiveMenu(null);
  };

  // Menu Configurations
  const servicesMenu = [
    { label: t('nav_ministry_services'), href: '/services?type=ministry', icon: Briefcase },
    { label: t('nav_industrial_services'), href: '/services?directorate=industry', icon: Building2 },
    { label: t('nav_economy_services'), href: '/services?directorate=economy', icon: TrendingUp },
    { label: t('nav_trade_services'), href: '/services?directorate=trade', icon: Scale },
  ];

  const mediaMenu = [
    { label: t('nav_news'), href: '/news', icon: Newspaper },
    { label: t('nav_announcements'), href: '/announcements', icon: Megaphone },
    { label: t('ql_media'), href: '/media', icon: PlayCircle },
  ];

  const suggestionsMenu = [
    { label: t('nav_suggestions'), href: '/suggestions', icon: Lightbulb },
    { label: t('nav_complaints'), href: '/complaints', icon: MessageSquareWarning },
  ];

  const aboutMenu = [
    { label: t('organizational_structure'), href: '/directorates', icon: Building }, // Using directorates page for structure
    { label: t('ql_about'), href: '/about', icon: Building2 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gov-forest dark:bg-gov-forest bg-pattern-islamic shadow-lg border-b border-gov-gold/20 min-h-[4rem] transition-all duration-500 bg-[length:500px] bg-repeat bg-center bg-blend-soft-light">
      <div className="absolute inset-0 bg-gov-forest/80 mix-blend-multiply z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-[4.5rem] md:h-[5.5rem] flex items-center justify-between z-10 relative">

        {/* Logo Area */}
        <Link href="/" className={`flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0 ${language === 'ar' ? '-mr-2' : '-ml-2'} -translate-y-1 lg:-translate-y-1.5`}>
          <Image
            src={language === 'ar' ? '/assets/logo/header-logo-ar.png' : '/assets/logo/header-logo.png'}
            alt="Ministry of Economy and Industry"
            width={200}
            height={200}
            className="h-14 sm:h-16 md:h-[4.5rem] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Home */}
          <Link
            href="/"
            className={`${language === 'en' ? 'px-2 text-xs' : 'px-3 text-sm'} py-2 font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 whitespace-nowrap`}
            onMouseEnter={() => handleMenuEnter('home')}
            onMouseLeave={handleMenuLeave}
          >
            {t('nav_home')}
          </Link>

          {/* About Ministry */}
          <MegaMenu
            label={t('nav_about')}
            active={activeMenu === 'about'}
            onMouseEnter={() => handleMenuEnter('about')}
            onMouseLeave={handleMenuLeave}
            onClick={() => handleMenuClick('about')}
            sections={[
              {
                title: t('ql_about'),
                items: [
                  { label: t('ql_about'), href: '/about', icon: Building2, description: language === 'ar' ? 'تعرف على رسالتنا ورؤيتنا' : 'Learn about our mission and vision' },
                  { label: t('organizational_structure'), href: '/directorates', icon: Building, description: language === 'ar' ? 'عرض الهيكل التنظيمي للوزارة' : 'View the ministry structure' }
                ]
              }
            ]}
          />

          {/* Services & Legislations */}
          <MegaMenu
            label={t('nav_services_legislations')}
            active={activeMenu === 'services'}
            onMouseEnter={() => handleMenuEnter('services')}
            onMouseLeave={handleMenuLeave}
            onClick={() => handleMenuClick('services')}
            sections={[
              {
                title: t('nav_ministry_services'),
                items: [
                  { label: t('nav_ministry_services'), href: '/services?type=ministry', icon: Briefcase },
                  { label: t('nav_industrial_services'), href: '/services?directorate=industry', icon: Building2 },
                  { label: t('nav_economy_services'), href: '/services?directorate=economy', icon: TrendingUp },
                  { label: t('nav_trade_services'), href: '/services?directorate=trade', icon: Scale },
                ]
              },
              {
                title: language === 'ar' ? 'التشريعات' : 'Legislations',
                items: [
                  { label: language === 'ar' ? 'القوانين والمراسيم' : 'Laws & Decrees', href: '/decrees', icon: Scale, description: language === 'ar' ? 'التشريعات والقوانين الصادرة' : 'Published laws and decrees' },
                ]
              }
            ]}
          />

          {/* Departments removed per ministry request */}

          {/* Media Center */}
          <MegaMenu
            label={t('nav_media')}
            active={activeMenu === 'media'}
            onMouseEnter={() => handleMenuEnter('media')}
            onMouseLeave={handleMenuLeave}
            onClick={() => handleMenuClick('media')}
            sections={[
              {
                title: t('nav_media'),
                items: [
                  { label: t('nav_news'), href: '/news', icon: Newspaper, description: language === 'ar' ? 'آخر الأخبار والبيانات الصحفية' : 'Latest updates and press releases' },
                  { label: t('nav_announcements'), href: '/announcements', icon: Megaphone, description: language === 'ar' ? 'الإعلانات الرسمية والمناقصات' : 'Official announcements and tenders' },
                  { label: t('ql_media'), href: '/media', icon: PlayCircle, description: language === 'ar' ? 'معرض الصور والفيديو' : 'Photos and videos gallery' },
                ]
              }
            ]}
          />

          {/* Suggestions & Complaints */}
          <MegaMenu
            label={t('nav_suggestions_complaints')}
            active={activeMenu === 'suggestions'}
            onMouseEnter={() => handleMenuEnter('suggestions')}
            onMouseLeave={handleMenuLeave}
            onClick={() => handleMenuClick('suggestions')}
            sections={[
              {
                title: t('nav_feedback'),
                items: [
                  { label: t('nav_suggestions'), href: '/suggestions', icon: Lightbulb, description: language === 'ar' ? 'شاركنا أفكارك ومقترحاتك' : 'Share your ideas with us' },
                  { label: t('nav_complaints'), href: '/complaints', icon: MessageSquareWarning, description: language === 'ar' ? 'تقديم شكوى أو ملاحظة' : 'File a complaint or issue' },
                ]
              }
            ]}
          />
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Expanding Search Bar */}
          <div ref={searchContainerRef} className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-48 md:w-64' : 'w-10'}`}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={isSearchExpanded ? t('search_placeholder') : ''}
                className={`w-full h-10 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 focus:border-gov-gold transition-all duration-300 ${isSearchExpanded ? 'pl-4 pr-10 rtl:pr-4 rtl:pl-10 opacity-100 px-4' : 'w-10 h-10 opacity-0 cursor-default pointer-events-none'}`}
                tabIndex={isSearchExpanded ? 0 : -1}
              />

              <button
                type={isSearchExpanded ? "submit" : "button"}
                onClick={(e) => {
                  if (!isSearchExpanded) {
                    e.preventDefault();
                    setIsSearchExpanded(true);
                  }
                }}
                className={`absolute top-0 flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-gov-gold transition-colors ${isSearchExpanded ? (language === 'ar' ? 'left-0' : 'right-0') : 'left-0 right-0'}`}
              >
                <Search size={18} />
              </button>
            </form>

            {/* Live Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && isSearchExpanded && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-64 md:w-80 bg-white dark:bg-dm-surface rounded-xl shadow-xl border border-gov-gold/20 overflow-hidden z-50 ltr:right-0 rtl:left-0"
                >
                  {suggestions.map((suggestion, idx) => (
                    <Link
                      key={idx}
                      href={suggestion.url}
                      onClick={() => {
                        setShowSuggestions(false);
                        setIsSearchExpanded(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gov-beige/20 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors"
                    >
                      <span className="p-1.5 rounded bg-gov-beige/50 dark:bg-white/10 text-gov-forest dark:text-gov-teal">
                        {suggestion.type === 'service' ? <Briefcase size={14} /> :
                          suggestion.type === 'faq' ? <HelpCircle size={14} /> :
                            <FileText size={14} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gov-charcoal dark:text-white truncate">{suggestion.text}</p>
                        <p className="text-[10px] text-gray-500 dark:text-white/50 uppercase">{suggestion.type}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-[1px] bg-white/20 hidden sm:block"></div>

          {/* Theme & Language Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
              title={t('header_theme')}
            >
              <Sun size={18} className="hidden dark:block" />
              <Moon size={18} className="block dark:hidden" />
            </button>

            <button
              onClick={toggleLanguage}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors font-bold text-xs"
              title={t('header_lang')}
            >
              <Globe size={18} />
            </button>
          </div>

          {/* Auth / Dashboard - Desktop */}
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold bg-gov-gold text-gov-forest rounded-lg hover:bg-gov-gold/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              <LayoutDashboard size={16} />
              <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold bg-gov-gold text-gov-forest rounded-lg hover:bg-gov-gold/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
            >
              <User size={16} />
              <span>{language === 'ar' ? 'دخول' : 'Login'}</span>
            </Link>
          )}

          {/* Auth Icon Button - Mobile Only (visible on small screens) */}
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gov-gold text-gov-forest hover:bg-gov-gold/90 transition-colors shadow-md"
              title={language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            >
              <LayoutDashboard size={20} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gov-gold text-gov-forest hover:bg-gov-gold/90 transition-colors shadow-md"
              title={t('nav_login')}
            >
              <User size={20} />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 text-white bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition-colors shadow-sm"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/35 dark:bg-black/55"
              aria-label={language === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="lg:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 z-50 bg-gradient-to-b from-white via-white to-gov-beige/40 dark:from-dm-surface dark:via-dm-surface dark:to-dm-bg border-t border-gov-gold/25 dark:border-gov-border/30 shadow-xl overflow-y-auto overscroll-contain"
            >
              <div className="p-4 space-y-1 pb-8">
                {/* Login/Account Button - Prominently placed at top */}
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full mb-4 px-4 py-3 bg-gov-gold text-gov-forest font-bold rounded-xl text-center shadow-md"
                  >
                    <LayoutDashboard size={20} />
                    <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full mb-2 px-4 py-3 bg-gov-gold text-gov-forest font-bold rounded-xl text-center shadow-md"
                  >
                    <User size={20} />
                    <span>{t('nav_login')}</span>
                  </Link>
                )}

                {!isAuthenticated && (
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full mb-4 px-4 py-3 border-2 border-gov-forest/20 dark:border-gov-gold/30 bg-gov-forest/5 dark:bg-transparent text-gov-forest dark:text-gov-gold font-bold rounded-xl text-center hover:bg-gov-forest/10 dark:hover:bg-gov-gold/10 transition-colors"
                  >
                    <User size={20} />
                    <span>{t('sitemap_register')}</span>
                  </Link>
                )}

                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg font-bold text-gov-charcoal dark:text-white hover:bg-gov-beige/70 dark:hover:bg-white/10 border border-transparent hover:border-gov-gold/25 dark:hover:border-gov-border/40 transition-colors">{t('nav_home')}</Link>

                {/* Mobile specific simple menu structure (collapsing dropdowns could be nice but simplified for now) */}
                <div className="border-t border-gov-gold/15 dark:border-gov-border/30 my-2 pt-2">
                  <p className="px-4 py-2 text-xs font-bold text-gov-forest dark:text-gov-gold uppercase tracking-wide">{t('nav_about')}</p>
                  {aboutMenu.map((item, i) => (
                    <Link key={i} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gov-charcoal dark:text-white/90 hover:bg-gov-beige/60 dark:hover:bg-white/10 hover:text-gov-forest dark:hover:text-gov-gold rounded-lg transition-colors">{item.label}</Link>
                  ))}
                </div>

                <div className="border-t border-gov-gold/15 dark:border-gov-border/30 my-2 pt-2">
                  <p className="px-4 py-2 text-xs font-bold text-gov-forest dark:text-gov-gold uppercase tracking-wide">{t('nav_services_legislations')}</p>
                  {servicesMenu.map((item, i) => (
                    <Link key={i} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gov-charcoal dark:text-white/90 hover:bg-gov-beige/60 dark:hover:bg-white/10 hover:text-gov-forest dark:hover:text-gov-gold rounded-lg transition-colors">{item.label}</Link>
                  ))}
                  <Link href="/decrees" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gov-charcoal dark:text-white/90 hover:bg-gov-beige/60 dark:hover:bg-white/10 hover:text-gov-forest dark:hover:text-gov-gold rounded-lg transition-colors">{language === 'ar' ? 'القوانين والمراسيم' : 'Laws & Decrees'}</Link>
                </div>


                <div className="border-t border-gov-gold/15 dark:border-gov-border/30 my-2 pt-2">
                  <p className="px-4 py-2 text-xs font-bold text-gov-forest dark:text-gov-gold uppercase tracking-wide">{t('nav_media')}</p>
                  {mediaMenu.map((item, i) => (
                    <Link key={i} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gov-charcoal dark:text-white/90 hover:bg-gov-beige/60 dark:hover:bg-white/10 hover:text-gov-forest dark:hover:text-gov-gold rounded-lg transition-colors">{item.label}</Link>
                  ))}
                </div>

                <div className="border-t border-gov-gold/15 dark:border-gov-border/30 my-2 pt-2">
                  <p className="px-4 py-2 text-xs font-bold text-gov-forest dark:text-gov-gold uppercase tracking-wide">{t('nav_suggestions_complaints')}</p>
                  {suggestionsMenu.map((item, i) => (
                    <Link key={i} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-gov-charcoal dark:text-white/90 hover:bg-gov-beige/60 dark:hover:bg-white/10 hover:text-gov-forest dark:hover:text-gov-gold rounded-lg transition-colors">{item.label}</Link>
                  ))}
                </div>

                {/* Additional login/dashboard link at bottom for users who scroll */}
                <div className="border-t border-gov-gold/15 dark:border-gov-border/30 mt-4 pt-4">
                  {isAuthenticated ? (
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 text-gov-forest dark:text-gov-gold font-bold rounded-xl text-center border-2 border-gov-forest/25 dark:border-gov-gold/30 bg-gov-forest/5 dark:bg-transparent hover:bg-gov-forest/10 dark:hover:bg-gov-gold/10 transition-colors">
                      <LayoutDashboard size={18} />
                      <span>{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 text-gov-forest dark:text-gov-gold font-bold rounded-xl text-center border-2 border-gov-forest/25 dark:border-gov-gold/30 bg-gov-forest/5 dark:bg-transparent hover:bg-gov-forest/10 dark:hover:bg-gov-gold/10 transition-colors">
                      <User size={18} />
                      <span>{t('nav_login')}</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
