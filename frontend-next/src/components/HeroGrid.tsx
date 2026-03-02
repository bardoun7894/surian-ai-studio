'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Share2, Play, Users, TrendingUp, Star, Award, Zap, Target, Heart, ThumbsUp, MessageCircle, FileText, Calendar, Globe, Shield, Briefcase } from 'lucide-react';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { API } from '@/lib/repository';
import ArticleCard from './ArticleCard';
import VideoCard from './VideoCard';
import FavoriteButton from './FavoriteButton';
import { Article, PromotionalSection } from '@/types';
import { getLocalizedField } from '@/lib/utils';
import ShareMenu from './ShareMenu';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

// Icon mapping for Lucide icons
const iconMap: Record<string, React.ElementType> = {
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

  // Video type card - Use VideoCard component when video_url is present
  if (section.type === 'video') {
    const badge = isArabic
      ? (section.metadata?.badge_ar || 'فيديو حصري')
      : (section.metadata?.badge_en || 'Exclusive Video');

    // If video_url is present, use actual video player
    if (section.video_url) {
      return (
        <div className="h-full min-h-[100px] rounded-[2rem] relative overflow-hidden">
          <VideoCard
            videoUrl={section.video_url}
            posterUrl={section.image || undefined}
            title={title}
            aspectRatio="video"
            className="h-full min-h-[220px] rounded-[2rem]"
            autoPlayOnHover={true}
          />
          {/* Badge overlay */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 rtl:right-auto rtl:md:right-auto rtl:left-2 rtl:md:left-4 z-20">
            <span className="inline-block px-1.5 py-0.5 md:px-3 md:py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] md:text-xs font-semibold tracking-wide border border-white/20 shadow-sm">
              {badge}
            </span>
          </div>
        </div>
      );
    }

    // Fallback to static card if no video_url
    return (
      <div
        className="h-full min-h-[100px] rounded-[2rem] relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all"
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

        <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
          <div>
            <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-[10px] md:text-xs font-semibold tracking-wide mb-3 md:mb-4 border border-white/20">
              {badge}
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug mb-2 md:mb-3 drop-shadow-md">{title}</h3>
            {description && <p className="text-white/90 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-sm">{description}</p>}
          </div>
          <div className="flex items-center justify-start mt-4 md:mt-0">
            <a
              href={section.button_url || '#'}
              className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-2xl"
              style={{ color: section.background_color }}
            >
              <Icon className="ml-1 fill-current w-4 h-4 md:w-8 md:h-8" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Stats type card
  if (section.type === 'stats') {
    const statValue = section.metadata?.stat_value || '0';
    const statLabel = isArabic
      ? (section.metadata?.stat_label_ar || title)
      : (section.metadata?.stat_label_en || title);

    return (
      <div
        className="h-full min-h-[100px] p-4 rounded-[2rem] border border-gov-gold/10 flex flex-col justify-center items-center text-center group hover:bg-gov-emerald/20 transition-all duration-500"
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
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1rem] bg-gradient-to-br from-gov-gold/90 to-gov-sand/90 backdrop-blur-md mb-3 md:mb-4 flex items-center justify-center text-gov-forest shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
            <span className="font-display font-extrabold text-xl md:text-2xl tracking-tighter">{statValue}</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight drop-shadow-md">{statLabel}</h3>
          {description && <p className="text-white/80 text-xs md:text-sm mb-4 md:mb-6 px-2 drop-shadow-sm">{description}</p>}
          {buttonText && (
            <a
              href={section.button_url || '#'}
              className="px-5 py-2 md:px-6 md:py-2.5 rounded-full border border-gov-gold/40 text-gov-gold font-semibold text-[11px] md:text-sm hover:bg-gov-gold hover:text-gov-forest hover:border-gov-gold transition-all duration-300 shadow-lg"
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
        className="h-full min-h-[100px] rounded-[2rem] relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all"
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

        <div className="relative z-10 p-3 md:p-5 h-full flex flex-col justify-end">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <Icon className="text-gov-gold w-4 h-4 md:w-[18px] md:h-[18px]" />
            <h3 className="text-base md:text-lg font-bold text-white leading-tight">{title}</h3>
          </div>
          {description && <p className="text-white/80 text-[10px] md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">{description}</p>}
          {buttonText && (
            <a
              href={section.button_url || '#'}
              className="px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-[10px] md:text-sm hover:bg-white/20 transition-all inline-block w-fit border border-white/10"
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
      className="h-full min-h-[100px] rounded-[2rem] relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all"
      style={{ backgroundColor: section.background_color }}
    >
      {section.image && (
        <Image
          src={section.image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-90"></div>

      <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-end">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{title}</h3>
        {description && <p className="text-white/80 text-xs md:text-sm mb-4 line-clamp-2 leading-relaxed drop-shadow-sm">{description}</p>}
        {buttonText && (
          <a
            href={section.button_url || '#'}
            className="px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-gov-gold text-gov-forest font-bold text-[11px] md:text-sm hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 inline-block w-fit shadow-xl"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

const HeroGrid: React.FC = () => {
  const { language: locale, t } = useLanguage();
  const [shareData, setShareData] = useState<{ title: string; url: string } | null>(null);
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
      setSummary(locale === 'ar'
        ? "هذا ملخص ذكي للمقال يوضح أهم النقاط الرئيسية حول استراتيجية الحكومة الإلكترونية وأهدافها في تطوير الخدمات الحكومية الرقمية."
        : "This is an AI-generated summary highlighting the key points about the e-government strategy and its goals in developing digital government services.");
      setIsSummarizing(false);
    }, 2000);
  };

  if (loading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          {/* Main Hero Skeleton */}
          <div className="lg:col-span-8 lg:row-span-2 min-h-[400px]">
            <SkeletonCard className="h-full" />
          </div>
          {/* Side Items Skeleton */}
          <div className="lg:col-span-4 lg:row-span-2 flex flex-col gap-6">
            <div className="flex-1 min-h-[180px]">
              <SkeletonCard className="h-full" />
            </div>
            <div className="flex-1 min-h-[180px]">
              <SkeletonCard className="h-full" />
            </div>
          </div>
          {/* Bottom Row Skeleton */}
          <div className="lg:col-span-4 min-h-[180px]">
            <SkeletonCard className="h-full" />
          </div>
          {/* Promotional Sections Skeleton */}
          <div className="lg:col-span-4 min-h-[200px]">
            <SkeletonCard className="h-full" />
          </div>
          <div className="lg:col-span-4 min-h-[200px]">
            <SkeletonCard className="h-full" />
          </div>
        </div>
      </section>
    );
  }

  if (!heroArticle) return null;

  // Combine hero + grid articles for the headline layout
  const sideArticles = gridArticles.slice(0, 3);

  return (
    <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Main headline + 3 side headlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">

        {/* Main Headline (latest hero news) */}
        <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden min-h-[300px] md:min-h-[380px] lg:min-h-[420px] shadow-2xl transition-all duration-500 hover:shadow-gov-gold/20 border border-white/10">
          <div className="absolute inset-0">
            {heroArticle.imageUrl && (
              <Image
                src={heroArticle.imageUrl}
                alt={getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en') || 'News'}
                fill
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gov-forest/95 via-gov-forest/40 to-black/20 group-hover:from-gov-forest group-hover:via-gov-forest/50 transition-colors duration-500"></div>
          </div>

          <div className="absolute inset-0 p-5 md:p-8 lg:p-10 flex flex-col justify-end z-10">
            <div className="absolute top-4 right-4 md:top-6 md:right-6 rtl:right-auto rtl:md:right-auto rtl:left-4 rtl:md:left-6 flex gap-2">
              <button
                onClick={() => {
                  setShareData({
                    title: getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en') || '',
                    url: `${window.location.origin}/news/${heroArticle.id}`
                  });
                }}
                className="p-2 md:p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-all duration-300 shadow-lg border border-white/20"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <FavoriteButton
                contentType="news"
                contentId={heroArticle.id}
                variant="overlay"
                className="!p-2 md:!p-2.5 !rounded-full !bg-white/20 !backdrop-blur-md !border !border-white/20 hover:!bg-white/30 [&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5 !shadow-lg transition-all duration-300"
                metadata={{
                  title: getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en') || '',
                  description: getLocalizedField(heroArticle, 'excerpt', locale as 'ar' | 'en') || '',
                  image: heroArticle.imageUrl || '',
                  url: `/news/${heroArticle.id}`
                }}
              />
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="px-2.5 py-1 md:px-3.5 md:py-1 rounded-full bg-gov-red text-white text-[10px] md:text-xs font-bold tracking-wide shadow-md uppercase">
                  {t('hero_live_badge')}
                </span>
                <span className="font-semibold text-gov-gold text-xs md:text-sm tracking-wide">{getLocalizedField(heroArticle, 'category', locale as 'ar' | 'en')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gov-beige/40"></span>
                <span className="text-white/80 text-xs md:text-sm font-medium">{heroArticle.date}</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-white leading-tight drop-shadow-md">
                {getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en')}
              </h2>

              <p className="text-xs md:text-sm lg:text-base text-gov-beige/90 leading-relaxed line-clamp-2 md:line-clamp-3 max-w-3xl drop-shadow-sm">
                {getLocalizedField(heroArticle, 'excerpt', locale as 'ar' | 'en')}
              </p>

              <div className="pt-2">
                <Link href={`/news/${heroArticle.id}`} className="group/btn inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-7 md:py-3 rounded-full bg-gov-gold text-gov-forest text-xs md:text-sm font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 w-auto">
                  {t('hero_read_more')}
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1 rtl:rotate-180 rtl:group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Side Headlines */}
        <div className="lg:col-span-5 flex flex-row lg:flex-col gap-3 md:gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory hide-scrollbar">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group flex-shrink-0 w-[85%] sm:w-[60%] lg:w-full lg:flex-shrink-1 snap-center flex gap-3 md:gap-4 bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 p-3 md:p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-gov-gold/0 to-gov-gold/0 group-hover:from-gov-gold/5 transition-colors duration-500 pointer-events-none"></div>

              {article.imageUrl && (
                <div className="relative w-24 h-20 md:w-32 md:h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={article.imageUrl}
                    alt={getLocalizedField(article, 'title', locale as 'ar' | 'en') || ''}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-gov-forest/0 group-hover:bg-gov-forest/10 transition-colors duration-500"></div>
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-1 select-none">
                <span className="inline-block text-[10px] md:text-xs text-gov-gold font-bold mb-1.5 md:mb-2 uppercase tracking-wider">
                  {getLocalizedField(article, 'category', locale as 'ar' | 'en')}
                </span>
                <h3 className="text-sm md:text-lg font-bold text-gov-charcoal dark:text-white leading-snug line-clamp-2 group-hover:text-gov-forest transition-colors duration-300">
                  {getLocalizedField(article, 'title', locale as 'ar' | 'en')}
                </h3>
                <span className="text-[10px] md:text-xs text-gray-500 dark:text-white/50 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20"></span>
                  {article.date}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Promotional Sections - compact row */}
        {promotionalSections.length > 0 && promotionalSections.map((section) => (
          <div key={section.id} className="lg:col-span-4 min-h-[140px]">
            <PromotionalCard section={section} locale={locale} />
          </div>
        ))}
      </div>

      <ShareMenu
        isOpen={!!shareData}
        onClose={() => setShareData(null)}
        title={shareData?.title || ''}
        url={shareData?.url || ''}
      />
    </section>
  );
};

export default HeroGrid;
