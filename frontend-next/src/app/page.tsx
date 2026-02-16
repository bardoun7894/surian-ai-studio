'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedDirectorates from '@/components/FeaturedDirectorates';
import HeroGrid from '@/components/HeroGrid';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { API } from '@/lib/repository';
import ScrollAnimation from '@/components/ui/ScrollAnimation';

// Dynamic imports for below-fold components
const NewsSection = dynamic(() => import('@/components/NewsSection'));
const Announcements = dynamic(() => import('@/components/Announcements'));
const HomeComplaintsSection = dynamic(() => import('@/components/HomeComplaintsSection'));
const QuickLinks = dynamic(() => import('@/components/QuickLinks'));
const GovernmentPartners = dynamic(() => import('@/components/GovernmentPartners'));
const HomeSuggestionsSection = dynamic(() => import('@/components/HomeSuggestionsSection'));
const FAQSection = dynamic(() => import('@/components/FAQSection'));
const ContactSection = dynamic(() => import('@/components/ContactSection'));
const SyriaMap = dynamic(() => import('@/components/SyriaMap'), { ssr: false });
const HomeSatisfactionWidget = dynamic(() => import('@/components/HomeSatisfactionWidget'), { ssr: false });
const InvestmentSection = dynamic(() => import('@/components/InvestmentSection'));

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

  // Handle smooth scroll for hash navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const handleSearch = (query: string) => {
    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors duration-500">
      <Navbar onSearch={handleSearch} />

      <main className="flex-grow pt-16 md:pt-20 overflow-hidden">
        <HeroSection hasBreakingNews={hasBreakingNews} onNewsLoaded={setHasBreakingNews} />

        <ScrollAnimation delay={0.1}>
          <FeaturedDirectorates />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <HeroGrid />
        </ScrollAnimation>

        {/* News & Announcements */}
        <ScrollAnimation delay={0.3}>
          <NewsSection />
        </ScrollAnimation>

        <ScrollAnimation delay={0.4}>
          <Announcements />
        </ScrollAnimation>

        {/* Investment Opportunities */}
        {investmentEnabled && <InvestmentSection />}

        {/* Complaints Section */}
        <ScrollAnimation delay={0.2}>
          <HomeComplaintsSection />
        </ScrollAnimation>

        {/* Quick Links */}
        <ScrollAnimation delay={0.2}>
          <QuickLinks />
        </ScrollAnimation>

        {/* Government Partners */}
        <ScrollAnimation delay={0.2}>
          <GovernmentPartners />
        </ScrollAnimation>

        {/* Suggestions Section */}
        <ScrollAnimation delay={0.2}>
          <HomeSuggestionsSection />
        </ScrollAnimation>

        {/* FAQ & Contact Sections */}
        <ScrollAnimation delay={0.2}>
          <FAQSection />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <ContactSection />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <SyriaMap />
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <HomeSatisfactionWidget />
        </ScrollAnimation>
      </main>


      <Footer />
    </div>
  );
}

