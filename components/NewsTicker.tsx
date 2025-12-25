import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { API } from '../services/repository';

const NewsTicker: React.FC = () => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [breakingNews, setBreakingNews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreaking = async () => {
        try {
            const data = await API.news.getBreakingNews();
            setBreakingNews(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchBreaking();
  }, []);

  useEffect(() => {
    if (!contentRef.current || !tickerRef.current || loading || breakingNews.length === 0) return;

    // Reset animation
    gsap.killTweensOf(contentRef.current);

    const contentWidth = contentRef.current.scrollWidth;
    
    // Create seamless loop
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(contentRef.current, {
      x: contentWidth / 2, // Move right because RTL
      duration: 30,
      ease: "none",
    });

    return () => {
        tl.kill();
    };
  }, [loading, breakingNews]);

  if (loading || breakingNews.length === 0) return null;

  return (
    <div className="bg-gov-charcoal text-white border-b border-gov-gold/20 relative overflow-hidden h-12 flex items-center">
      <div className="absolute right-0 top-0 bottom-0 bg-gov-emerald px-6 z-20 flex items-center font-bold shadow-lg">
        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        أخبار عاجلة
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full" ref={tickerRef}>
        <div ref={contentRef} className="absolute top-0 right-0 h-full flex items-center whitespace-nowrap gap-16 pr-[150px]">
           {/* Duplicate array for seamless loop */}
           {[...breakingNews, ...breakingNews, ...breakingNews].map((news, idx) => (
             <div key={idx} className="flex items-center gap-4 text-sm text-gray-200">
               <span>{news}</span>
               <span className="text-gov-gold text-xs">●</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;