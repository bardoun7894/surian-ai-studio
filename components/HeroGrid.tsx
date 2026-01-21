import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Share2, Bookmark, Play, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { API } from '../services/repository';
import ArticleCard from './ArticleCard';
import { summarizeArticle } from '../services/geminiService';
import { Article } from '../types';
import { hoverScale } from '@/animations';

const HeroGrid: React.FC = () => {
  const { t, direction } = useLanguage();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [heroArticle, setHeroArticle] = useState<Article | null>(null);
  const [gridArticles, setGridArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hero, grid] = await Promise.all([
          API.news.getHeroArticle(),
          API.news.getGridArticles()
        ]);
        setHeroArticle(hero);
        setGridArticles(grid);
      } catch (e) {
        console.error("Failed to load hero section", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    hoverScale('#hero-main-card');
    hoverScale('#hero-video-card');
  }, [loading]);

  const handleSummarize = async () => {
    if (!heroArticle) return;
    if (summary) {
      setSummary(null); // Toggle off
      return;
    }

    setIsSummarizing(true);
    // Simulation of a robust AI summary
    const result = await summarizeArticle(heroArticle.excerpt + " " + heroArticle.title, heroArticle.title);
    setSummary(result);
    setIsSummarizing(false);
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="animate-spin text-gov-gold" size={48} />
      </div>
    );
  }

  if (!heroArticle) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-[minmax(200px,auto)]">

        {/* Main Hero Item */}
        <div id="hero-main-card" className="lg:col-span-8 lg:row-span-2 relative group rounded-[3rem] overflow-hidden min-h-[600px] border border-gray-100 dark:border-white/10 shadow-2xl transition-all duration-700 hover:shadow-gov-gold/10">
          <div className="absolute inset-0">
            <img
              src={heroArticle.imageUrl}
              alt={heroArticle.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Multi-layered Gradient Overlay for better legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-gov-forest via-gov-forest/40 to-transparent opacity-95"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gov-forest/40 to-transparent"></div>
          </div>

          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end items-start z-10">
            <div className="mb-auto flex w-full justify-between items-start">
              <span className="px-5 py-2 rounded-full bg-gov-red text-white text-xs font-bold shadow-lg shadow-gov-red/30 animate-pulse tracking-widest uppercase">
                {t('ui_live')}
              </span>
              <div className="flex gap-3">
                <button className="p-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-gov-gold hover:text-white text-white transition-all border border-white/20">
                  <Share2 size={20} />
                </button>
                <button className="p-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-gov-gold hover:text-white text-white transition-all border border-white/20">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center gap-4 text-gray-300 text-sm font-bold tracking-wide">
                <span className="text-gov-gold uppercase">{heroArticle.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gov-gold/50"></span>
                <span>{heroArticle.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gov-gold/50"></span>
                <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gov-gold/10 border border-gov-gold/20 text-gov-gold">
                  <Sparkles size={14} /> {t('ui_ai')}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] tracking-tight">
                {heroArticle.title}
              </h1>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed md:w-5/6 font-medium">
                {heroArticle.excerpt}
              </p>

              {/* Gemini Smart Summary Panel */}
              {summary && (
                <div className="mt-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl animate-fade-in-up shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="flex items-center gap-3 text-gov-gold font-bold text-lg">
                      <Sparkles size={20} /> {t('ui_smart_summary')}
                    </h5>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gov-gold animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gov-gold animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-gov-gold animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                  <div className="text-zinc-100 text-base whitespace-pre-line leading-relaxed border-l-2 border-gov-gold/30 pl-4">
                    {summary}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-6">
                <button className="px-10 py-4 rounded-2xl bg-white text-gov-forest font-bold text-lg hover:bg-gov-gold hover:text-white transition-all transform hover:-translate-y-1 shadow-xl flex items-center gap-3 group/btn">
                  {t('ui_read_more')}
                  {direction === 'rtl' ? (
                    <ArrowLeft size={20} className="transition-transform group-hover/btn:-translate-x-2" />
                  ) : (
                    <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-2" />
                  )}
                </button>

                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 backdrop-blur-md transition-all border transition-all ${summary ? 'bg-gov-gold text-white border-gov-gold' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t('ui_analyzing')}
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className={summary ? 'text-white' : 'text-gov-gold'} />
                      {summary ? t('ui_hide_summary') : t('ui_smart_summarize')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Grid Items */}
        <div className="lg:col-span-4 lg:row-span-2 flex flex-col gap-8">
          {gridArticles.map((article, idx) => (
            <div key={article.id} className="flex-1">
              <ArticleCard article={article} variant={idx === 0 ? "visual" : "default"} />
            </div>
          ))}

          {/* Static Video Card */}
          <div id="hero-video-card" className="min-h-[300px] rounded-[2.5rem] bg-gov-red relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/30 transition-all shadow-xl">
            <div className="absolute inset-0 bg-pattern-islamic bg-repeat opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-black/30 rounded-full blur-2xl transform translate-y-1/3 -translate-x-1/3"></div>

            <div className="relative z-10 p-10 h-full flex flex-col justify-between">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-black/30 text-white text-[10px] font-bold mb-4 border border-white/20 tracking-widest uppercase">
                  {t('ui_exclusive_video')}
                </span>
                <h3 className="text-3xl font-bold text-white mb-3 leading-tight">{t('ui_exclusive_video_title')}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{t('ui_exclusive_video_desc')}</p>
              </div>
              <div className="flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white text-gov-red flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Play size={40} className="ml-1 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroGrid;