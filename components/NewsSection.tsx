import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API } from '../services/repository';
import { NewsItem, ViewState } from '../types';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface NewsSectionProps {
  onNavigate?: (view: ViewState) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.news.getOfficialNews();
        setNews(data);
        setLoading(false);

        // Trigger Animation after render
        setTimeout(() => {
          if (!containerRef.current) return;
          const cards = containerRef.current.querySelectorAll('.news-card');
          gsap.fromTo(cards,
            { y: 50, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
              }
            }
          );
        }, 100);

      } catch (e) {
        console.error("Failed to load news", e);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-gov-forest border-t border-gray-100 dark:border-gov-gold/10 transition-colors" id="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">{t('news_center')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('news_subtitle')}</p>
          </div>
          <button
            onClick={() => onNavigate?.('NEWS_ARCHIVE')}
            className="hidden md:flex items-center gap-2 text-gov-emerald dark:text-gov-gold font-bold hover:text-gov-emeraldLight dark:hover:text-white transition-colors"
          >
            {t('view_archive')}
            <ChevronLeft size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-gov-teal" size={32} />
          </div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {news.map((item) => (
              <article key={item.id} className="news-card group bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 hover:border-gov-gold/30 hover:shadow-2xl transition-all duration-500 flex flex-col h-full backdrop-blur-sm">
                {item.imageUrl && (
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-1.5 bg-gov-forest/80 dark:bg-gov-gold/90 text-white dark:text-gov-forest text-[10px] font-bold rounded-full backdrop-blur-md uppercase tracking-widest border border-white/20">
                        {item.category}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gov-gold uppercase tracking-widest mb-4">
                    <Calendar size={14} />
                    {item.date}
                  </div>
                  <h3 className="font-display font-bold text-gov-forest dark:text-white text-xl mb-4 leading-tight group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {item.summary}
                  </p>
                  <button onClick={() => onNavigate?.('NEWS_ARCHIVE')} className="inline-flex items-center gap-2 text-xs font-bold text-gov-forest dark:text-gov-gold hover:translate-x-1 rtl:hover:-translate-x-1 transition-all uppercase tracking-widest group/link">
                    {t('read_more')}
                    <ChevronLeft size={16} className={`${language === 'ar' ? 'rotate-180' : ''} transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1`} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => onNavigate?.('NEWS_ARCHIVE')}
            className="px-6 py-3 border border-gov-emerald dark:border-gov-gold text-gov-emerald dark:text-gov-gold rounded-lg font-bold w-full"
          >
            {t('news_show_all')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;