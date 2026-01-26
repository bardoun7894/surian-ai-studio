'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Share2, Bookmark, Play, Loader2, Users, TrendingUp, Star, Award, Zap, Target, Heart, ThumbsUp, MessageCircle, FileText, Calendar, Globe, Shield, Briefcase } from 'lucide-react';
import { API } from '@/lib/repository';
import ArticleCard from './ArticleCard';
import { Article, PromotionalSection } from '@/types';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// Icon mapping for Lucide icons
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Play, Users, TrendingUp, Star, Award, Zap, Target, Heart, ThumbsUp, MessageCircle, FileText, Calendar, Globe, Shield, Briefcase
};

// Promotional Card Component for different section types
interface PromotionalCardProps {
  section: PromotionalSection;
  locale: string;
}

const PromotionalCard: React.FC<PromotionalCardProps> = ({ section, locale }) => {
  const isArabic = locale === 'ar';
  const title = isArabic ? section.title_ar : section.title_en;
  const description = isArabic ? section.description_ar : section.description_en;
  const buttonText = isArabic ? section.button_text_ar : section.button_text_en;
  const Icon = iconMap[section.icon] || Play;

  // Video type card
  if (section.type === 'video') {
    const badge = section.metadata?.badge_ar && section.metadata?.badge_en
      ? (isArabic ? section.metadata.badge_ar : section.metadata.badge_en)
      : (isArabic ? 'فيديو حصري' : 'Exclusive Video');

    return (
      <div
        className="lg:col-span-4 min-h-[280px] rounded-[2rem] relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all"
        style={{ backgroundColor: section.background_color }}
      >
        {section.image && (
          <Image
            src={section.image}
            alt={title}
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 p-32 bg-black/20 rounded-full blur-2xl transform translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold mb-4 border border-white/10">
              {badge}
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            {description && <p className="text-white/80 text-sm">{description}</p>}
          </div>
          <div className="flex items-center justify-center">
            <a
              href={section.button_url || '#'}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
              style={{ color: section.background_color }}
            >
              <Icon size={32} className="ml-1 fill-current" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Stats type card
  if (section.type === 'stats') {
    const statValue = section.metadata?.stat_value || '0';
    const statLabel = section.metadata?.stat_label_ar && section.metadata?.stat_label_en
      ? (isArabic ? section.metadata.stat_label_ar : section.metadata.stat_label_en)
      : title;

    return (
      <div
        className="lg:col-span-4 min-h-[280px] p-6 rounded-[2rem] border border-gov-gold/10 flex flex-col justify-center items-center text-center group hover:bg-gov-emerald/20 transition-all duration-500"
        style={{ backgroundColor: section.background_color }}
      >
        {section.image && (
          <div className="absolute inset-0">
            <Image
              src={section.image}
              alt={title}
              fill
              className="object-cover opacity-20 rounded-[2rem]"
            />
          </div>
        )}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gov-gold to-gov-sand mb-4 flex items-center justify-center text-gov-forest shadow-lg group-hover:scale-110 transition-transform">
            <span className="font-display font-bold text-2xl">{statValue}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{statLabel}</h3>
          {description && <p className="text-gov-beige/60 text-sm mb-6">{description}</p>}
          {buttonText && (
            <a
              href={section.button_url || '#'}
              className="px-6 py-2 rounded-full border border-gov-gold/30 text-gov-gold text-sm hover:bg-gov-gold hover:text-gov-forest transition-all"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Promo type card (default)
  if (section.type === 'promo') {
    return (
      <div
        className="lg:col-span-4 min-h-[280px] rounded-[2rem] relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all"
        style={{ backgroundColor: section.background_color }}
      >
        {section.image && (
          <Image
            src={section.image}
            alt={title}
            fill
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="relative z-10 p-8 h-full flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            <Icon size={20} className="text-gov-gold" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          {description && <p className="text-white/80 text-sm mb-4">{description}</p>}
          {buttonText && (
            <a
              href={section.button_url || '#'}
              className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm hover:bg-white/20 transition-all inline-block w-fit border border-white/10"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Banner type card
  return (
    <div
      className="lg:col-span-4 min-h-[280px] rounded-[2rem] relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all"
      style={{ backgroundColor: section.background_color }}
    >
      {section.image && (
        <Image
          src={section.image}
          alt={title}
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        {description && <p className="text-white/80 text-sm mb-4">{description}</p>}
        {buttonText && (
          <a
            href={section.button_url || '#'}
            className="px-6 py-3 rounded-full bg-gov-gold text-gov-forest font-bold hover:bg-white transition-all inline-block w-fit"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

const HeroGrid: React.FC = () => {
  const { locale } = useLanguage();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [heroArticle, setHeroArticle] = useState<Article | null>(null);
  const [gridArticles, setGridArticles] = useState<Article[]>([]);
  const [promotionalSections, setPromotionalSections] = useState<PromotionalSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hero, grid, promos] = await Promise.all([
          API.news.getHeroArticle(),
          API.news.getGridArticles(),
          API.promotionalSections.getByPosition('grid_bottom')
        ]);
        setHeroArticle(hero);
        setGridArticles(grid);
        setPromotionalSections(promos);
      } catch (e) {
        console.error("Failed to load hero section", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSummarize = async () => {
    if (!heroArticle) return;
    if (summary) {
      setSummary(null);
      return;
    }

    setIsSummarizing(true);
    // Simulate AI summarization
    setTimeout(() => {
      setSummary("هذا ملخص ذكي للمقال يوضح أهم النقاط الرئيسية حول استراتيجية الحكومة الإلكترونية وأهدافها في تطوير الخدمات الحكومية الرقمية.");
      setIsSummarizing(false);
    }, 2000);
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
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

        {/* Main Hero Item (Span 8 cols on large) */}
        <div className="lg:col-span-8 lg:row-span-2 relative group rounded-[2.5rem] overflow-hidden min-h-[500px] border border-white/10 shadow-2xl shadow-black/50 transition-all duration-500 hover:shadow-gov-gold/20">
          <div className="absolute inset-0">
            <Image
              src={heroArticle.imageUrl}
              alt={heroArticle.title}
              fill
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gov-forest via-gov-forest/70 to-transparent opacity-95"></div>
          </div>

          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start z-10">
            <div className="mb-auto flex w-full justify-between items-start">
              <span className="px-4 py-1.5 rounded-full bg-gov-red text-white text-sm font-bold shadow-lg shadow-gov-red/20 animate-pulse">
                مباشر
              </span>
              <div className="flex gap-2">
                <button className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/10">
                  <Share2 size={20} />
                </button>
                <button className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/10">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-3 text-gov-beige/80">
                <span className="font-semibold text-gov-gold">{heroArticle.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gov-gold/30"></span>
                <span>{heroArticle.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gov-gold/30"></span>
                <span className="flex items-center gap-1"><Sparkles size={14} className="text-gov-gold" /> ذكاء اصطناعي</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                {heroArticle.title}
              </h1>

              <p className="text-lg text-gov-beige/90 leading-relaxed md:w-3/4">
                {heroArticle.excerpt}
              </p>

              {/* AI Summary Section */}
              {summary && (
                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-up">
                  <h5 className="flex items-center gap-2 text-gov-gold font-bold mb-2">
                    <Sparkles size={16} /> ملخص ذكي
                  </h5>
                  <div className="text-gov-beige text-sm whitespace-pre-line leading-relaxed">
                    {summary}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button className="px-8 py-3.5 rounded-full bg-gov-gold text-gov-forest font-bold hover:bg-white transition-all flex items-center gap-2 group/btn shadow-lg shadow-gov-gold/20">
                  اقرأ المزيد
                  <ArrowLeft size={18} className="transition-transform group-hover/btn:-translate-x-1" />
                </button>

                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="px-6 py-3.5 rounded-full bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 backdrop-blur-md"
                >
                  {isSummarizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="text-gov-gold" />
                      {summary ? 'إخفاء الملخص' : 'تلخيص ذكي'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Column Items (Span 4 cols) */}
        {gridArticles.length > 0 && (
          <div className="lg:col-span-4 lg:row-span-2 flex flex-col gap-6">
            <div className="flex-1 min-h-[240px]">
              <ArticleCard article={gridArticles[0]} variant="visual" />
            </div>
            {gridArticles[1] && (
              <div className="flex-1 min-h-[240px]">
                <ArticleCard article={gridArticles[1]} variant="default" />
              </div>
            )}
          </div>
        )}

        {/* Bottom Row */}
        {gridArticles[2] && (
          <div className="lg:col-span-4 min-h-[280px]">
            <ArticleCard article={gridArticles[2]} variant="default" />
          </div>
        )}

        {/* Dynamic Promotional Sections */}
        {promotionalSections.map((section) => (
          <PromotionalCard key={section.id} section={section} locale={locale} />
        ))}

      </div>
    </section>
  );
};

export default HeroGrid;
