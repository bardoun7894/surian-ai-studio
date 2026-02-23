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
          <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20">
            <span className="inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold border border-white/10">
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

        <div className="relative z-10 p-5 h-full flex flex-col justify-between">
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gov-gold to-gov-sand mb-2 flex items-center justify-center text-gov-forest shadow-lg group-hover:scale-110 transition-transform">
            <span className="font-display font-bold text-xl">{statValue}</span>
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

        <div className="relative z-10 p-5 h-full flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={18} className="text-gov-gold" />
            <h3 className="text-lg font-bold text-white">{title}</h3>
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
      className="h-full min-h-[100px] rounded-[2rem] relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all"
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

      <div className="relative z-10 p-5 h-full flex flex-col justify-end">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
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
        <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden min-h-[250px] md:min-h-[320px] border border-white/10 shadow-lg transition-all duration-500 hover:shadow-gov-gold/20">
          <div className="absolute inset-0">
            {heroArticle.imageUrl && (
              <Image
                src={heroArticle.imageUrl}
                alt={getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en') || 'News'}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gov-forest via-gov-forest/60 to-transparent opacity-95"></div>
          </div>

          <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end z-10">
            <div className="mb-auto flex w-full justify-between items-start">
              <span className="px-2 py-1 md:px-3 rounded-full bg-gov-red text-white text-[10px] md:text-xs font-bold shadow-lg animate-pulse">
                {t('hero_live_badge')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShareData({
                      title: getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en') || '',
                      url: `${window.location.origin}/news/${heroArticle.id}`
                    });
                  }}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/10"
                >
                  <Share2 size={16} />
                </button>
                <FavoriteButton
                  contentType="news"
                  contentId={heroArticle.id}
                  variant="overlay"
                  size={16}
                  className="!p-2 !rounded-full !bg-white/10 !backdrop-blur-md !border !border-white/10 hover:!bg-white/20"
                  metadata={{
                    title: getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en') || '',
                    description: getLocalizedField(heroArticle, 'excerpt', locale as 'ar' | 'en') || '',
                    image: heroArticle.imageUrl || '',
                    url: `/news/${heroArticle.id}`
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1 md:gap-2 text-gov-beige/80 text-[10px] md:text-xs">
                <span className="font-semibold text-gov-gold">{getLocalizedField(heroArticle, 'category', locale as 'ar' | 'en')}</span>
                <span className="w-1 h-1 rounded-full bg-gov-gold/30"></span>
                <span>{heroArticle.date}</span>
              </div>

              <h2 className="text-lg md:text-2xl lg:text-3xl font-display font-bold text-white leading-tight line-clamp-3">
                {getLocalizedField(heroArticle, 'title', locale as 'ar' | 'en')}
              </h2>

              <p className="text-xs md:text-sm text-gov-beige/80 leading-relaxed line-clamp-2 hidden md:block">
                {getLocalizedField(heroArticle, 'excerpt', locale as 'ar' | 'en')}
              </p>

              <Link href={`/news/${heroArticle.id}`} className="inline-flex items-center gap-2 px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-gov-gold text-gov-forest text-[11px] md:text-sm font-bold hover:bg-white transition-all group/btn shadow-md">
                {t('hero_read_more')}
                <ArrowLeft size={14} className="transition-transform group-hover/btn:-translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Side Headlines */}
        <div className="lg:col-span-5 flex flex-col gap-3 md:gap-4">
          {sideArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group flex gap-2 md:gap-4 bg-white dark:bg-dm-surface rounded-xl border border-gray-100 dark:border-gov-border/15 p-2 md:p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {article.imageUrl && (
                <div className="relative w-20 h-16 md:w-28 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={article.imageUrl}
                    alt={getLocalizedField(article, 'title', locale as 'ar' | 'en') || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className="text-[10px] md:text-xs text-gov-gold font-bold mb-1">
                  {getLocalizedField(article, 'category', locale as 'ar' | 'en')}
                </span>
                <h3 className="text-sm md:text-base font-bold text-gov-charcoal dark:text-white leading-tight line-clamp-2 group-hover:text-gov-teal transition-colors">
                  {getLocalizedField(article, 'title', locale as 'ar' | 'en')}
                </h3>
                <span className="text-[10px] md:text-xs text-gray-400 dark:text-white/50 mt-1">
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
