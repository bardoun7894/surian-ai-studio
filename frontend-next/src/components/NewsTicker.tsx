import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { API } from '@/lib/repository';
import { useLanguage } from '../contexts/LanguageContext';

interface BreakingNewsItem {
  title_ar: string;
  title_en: string;
}

interface NewsTickerProps {
  onNewsLoaded?: (hasNews: boolean) => void;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ onNewsLoaded }) => {
  const { t, language } = useLanguage();
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const data = await API.news.getBreakingNews();
        // Handle both old format (string[]) and new format ({title_ar, title_en}[])
        const normalizedData = data.map((item: string | BreakingNewsItem) => {
          if (typeof item === 'string') {
            return { title_ar: item, title_en: item };
          }
          return item;
        });
        setBreakingNews(normalizedData);
        if (onNewsLoaded) onNewsLoaded(normalizedData.length > 0);
      } catch (e) {
        console.error(e);
        if (onNewsLoaded) onNewsLoaded(false);
      } finally {
        setLoading(false);
      }
    };
    fetchBreaking();
  }, [onNewsLoaded]);

  const getTitle = (item: BreakingNewsItem) => {
    return language === 'en' ? (item.title_en || item.title_ar) : item.title_ar;
  };

  useEffect(() => {
    if (!contentRef.current || !tickerRef.current || loading || breakingNews.length === 0) return;

    // Reset animation
    gsap.killTweensOf(contentRef.current);

    const contentWidth = contentRef.current.scrollWidth / 3; // Divide by 3 since we triplicate content

    // Create seamless loop - For RTL, scroll from right to left (negative X)
    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo(contentRef.current,
      { x: 0 },
      {
        x: -contentWidth,
        duration: 50, // Slower for readability
        ease: "none",
      }
    );

    // Add pause instruction
    const el = tickerRef.current;
    if (el) {
      el.addEventListener('mouseenter', () => tl.pause());
      el.addEventListener('mouseleave', () => tl.play());
    }

    animationRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [loading, breakingNews]);

  // Handle pause on hover
  useEffect(() => {
    if (!animationRef.current) return;
    if (isPaused) {
      animationRef.current.pause();
    } else {
      animationRef.current.resume();
    }
  }, [isPaused]);

  if (loading || breakingNews.length === 0) return null;

  return (
    <div
      className="bg-gradient-to-r from-gov-forest via-gov-teal to-gov-forest text-white border-b border-gov-gold/20 relative overflow-hidden h-16 flex items-center"
      ref={tickerRef}
    >
      <div className="absolute right-0 top-0 bottom-0 bg-gov-teal px-6 z-20 flex items-center font-bold shadow-lg border-l border-gov-gold/20 rtl:border-l-0 rtl:border-r rtl:border-gov-gold/20">
        <span className="ml-2 rtl:mr-2 rtl:ml-0 w-2.5 h-2.5 bg-gov-cherry rounded-full animate-pulse shadow-[0_0_12px_rgba(200,16,46,0.7)]"></span>
        <span className="text-base">{t('news_breaking')}</span>
      </div>

      <div className="flex-1 overflow-hidden relative h-full">
        <div ref={contentRef} className="absolute top-0 right-0 h-full flex items-center whitespace-nowrap gap-16 pr-[160px]">
          {[...breakingNews, ...breakingNews, ...breakingNews].map((news, idx) => (
            <div key={`${idx}-${news.title_ar.slice(0, 10)}`} className="flex items-center gap-4 text-base text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
              <span className="font-medium">{getTitle(news)}</span>
              <span className="text-gov-gold text-sm">●</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;