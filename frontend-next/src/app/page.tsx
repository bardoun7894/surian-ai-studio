'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedDirectorates from '@/components/FeaturedDirectorates';
import HeroGrid from '@/components/HeroGrid';
import Footer from '@/components/Footer';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { API } from '@/lib/repository';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

// Dynamic imports for below-fold components
const SectionSkeleton = () => <div className="w-full py-12"><div className="max-w-7xl mx-auto px-4"><div className="h-64 bg-gray-100 dark:bg-dm-surface rounded-2xl animate-pulse" /></div></div>;
const NewsSection = dynamic(() => import('@/components/NewsSection'), { loading: () => <SectionSkeleton /> });
const Announcements = dynamic(() => import('@/components/Announcements'), { loading: () => <SectionSkeleton /> });
const HomeComplaintsSection = dynamic(() => import('@/components/HomeComplaintsSection'), { loading: () => <SectionSkeleton /> });
const QuickLinks = dynamic(() => import('@/components/QuickLinks'), { loading: () => <SectionSkeleton /> });
const GovernmentPartners = dynamic(() => import('@/components/GovernmentPartners'), { loading: () => <SectionSkeleton /> });
const HomeSuggestionsSection = dynamic(() => import('@/components/HomeSuggestionsSection'), { loading: () => <SectionSkeleton /> });
const FAQSection = dynamic(() => import('@/components/FAQSection'), { loading: () => <SectionSkeleton /> });
const ContactSection = dynamic(() => import('@/components/ContactSection'), { loading: () => <SectionSkeleton /> });
const SyriaMap = dynamic(() => import('@/components/SyriaMap'), { ssr: false, loading: () => <SectionSkeleton /> });
const InvestmentSection = dynamic(() => import('@/components/InvestmentSection'), { loading: () => <SectionSkeleton /> });


export default function HomePage() {
  const [hasBreakingNews, setHasBreakingNews] = useState(false);
  const [investmentEnabled, setInvestmentEnabled] = useState(true);

  // Fetch feature flags
  useEffect(() => {
    API.settings.getPublic().then((s) => {
      if (s.investment_section_enabled === false) {
        setInvestmentEnabled(false);
      }
    });
  }, []);

  // Scroll to a section by hash - retries to handle dynamic components
  const scrollToHash = useCallback((hash?: string) => {
    const target = hash || window.location.hash ||
      (sessionStorage.getItem('homepage-section') ? `#${sessionStorage.getItem('homepage-section')}` : '');
    if (!target) return;

    const tryScroll = (attempts: number) => {
      const element = document.querySelector(target);
      if (element) {
        // Use instant scroll first, then smooth for visual polish
        element.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else if (attempts > 0) {
        setTimeout(() => tryScroll(attempts - 1), 300);
      }
    };

    // Start trying immediately, retry up to 15 times (4.5s total)
    tryScroll(15);
  }, []);

  // Detect when returning to homepage (pathname changes back to '/')
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === '/' && prevPathname.current !== '/') {
      // We just returned to homepage from another page
      const saved = sessionStorage.getItem('homepage-section');
      if (saved) {
        // Wait for dynamic components to render
        setTimeout(() => {
          window.history.replaceState(null, '', `#${saved}`);
          scrollToHash(`#${saved}`);
        }, 300);
      }
    }
    prevPathname.current = pathname;
  }, [pathname, scrollToHash]);

  // On initial mount, scroll to hash if present
  useEffect(() => {
    const hash = window.location.hash;
    const saved = sessionStorage.getItem('homepage-section');
    if (hash) {
      scrollToHash(hash);
    } else if (saved) {
      window.history.replaceState(null, '', `#${saved}`);
      scrollToHash(`#${saved}`);
    }
  }, [scrollToHash]);

  // Handle browser back/forward and hash changes
  useEffect(() => {
    const restoreScroll = () => {
      const hash = window.location.hash;
      const saved = sessionStorage.getItem('homepage-section');
      if (hash) {
        scrollToHash(hash);
      } else if (saved) {
        window.history.replaceState(null, '', `#${saved}`);
        scrollToHash(`#${saved}`);
      }
    };

    // popstate fires on browser back/forward
    window.addEventListener('popstate', restoreScroll);
    window.addEventListener('hashchange', restoreScroll);

    // Also handle page becoming visible again (e.g. tab switching, bfcache)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && window.location.pathname === '/') {
        const saved = sessionStorage.getItem('homepage-section');
        if (saved && !window.location.hash) {
          window.history.replaceState(null, '', `#${saved}`);
          scrollToHash(`#${saved}`);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Handle bfcache (back-forward cache) restoration
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && window.location.pathname === '/') {
        restoreScroll();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('popstate', restoreScroll);
      window.removeEventListener('hashchange', restoreScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [scrollToHash]);

  // Update URL hash based on visible section
  const sectionIds = useRef([
    'hero', 'directorates', 'services', 'central-news', 'news',
    'announcements', 'investment', 'complaints', 'quick-links',
    'partners', 'suggestions', 'faq', 'contact', 'map'
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            const newHash = `#${entry.target.id}`;
            if (window.location.hash !== newHash) {
              window.history.replaceState(null, '', newHash);
            }
            sessionStorage.setItem('homepage-section', entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    // Small delay to let dynamic components render
    const timer = setTimeout(() => {
      sectionIds.current.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handleSearch = (query: string) => {
    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar onSearch={handleSearch} />

      <main className="flex-grow pt-16 md:pt-20">
        <section id="hero">
          <HeroSection hasBreakingNews={hasBreakingNews} onNewsLoaded={setHasBreakingNews} />
        </section>

        <section id="directorates">
            <FeaturedDirectorates />
        </section>

        <section id="services">
          <ScrollAnimation delay={0.2}>
            <HeroGrid />
          </ScrollAnimation>
        </section>



        {/* News & Announcements */}
        <section id="news">
          <ScrollAnimation delay={0.3}>
            <NewsSection />
          </ScrollAnimation>
        </section>

        <section id="announcements">
          <ScrollAnimation delay={0.4}>
            <Announcements />
          </ScrollAnimation>
        </section>

        {/* Investment Opportunities */}
        {investmentEnabled && (
          <section id="investment">
            <InvestmentSection />
          </section>
        )}

        {/* Complaints Section */}
        <section id="complaints">
          <ScrollAnimation delay={0.2}>
            <HomeComplaintsSection />
          </ScrollAnimation>
        </section>

        {/* Quick Links */}
        <section id="quick-links">
          <ScrollAnimation delay={0.2}>
            <QuickLinks />
          </ScrollAnimation>
        </section>

        {/* Government Partners */}
        <section id="partners">
          <ScrollAnimation delay={0.2}>
            <GovernmentPartners />
          </ScrollAnimation>
        </section>

        {/* Suggestions Section */}
        <section id="suggestions">
          <ScrollAnimation delay={0.2}>
            <HomeSuggestionsSection />
          </ScrollAnimation>
        </section>

        {/* FAQ & Contact Sections */}
        <section id="faq">
          <ScrollAnimation delay={0.2}>
            <FAQSection />
          </ScrollAnimation>
        </section>

        <section id="contact">
          <ScrollAnimation delay={0.2}>
            <ContactSection />
          </ScrollAnimation>
        </section>

        <section id="map">
          <ScrollAnimation delay={0.2}>
            <SyriaMap />
          </ScrollAnimation>
        </section>

      </main>


      <Footer />
    </div>
  );
}

