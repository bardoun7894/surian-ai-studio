"use client";

import React, { useEffect, useState, useCallback } from "react";
import { API } from "@/lib/repository";
import { useLanguage } from "../contexts/LanguageContext";
import { SkeletonText } from "@/components/SkeletonLoader";

interface BreakingNewsItem {
  title_ar: string;
  title_en: string;
}

type Duration = "24h" | "48h" | "week" | "month";

interface NewsTickerProps {
  onNewsLoaded?: (hasNews: boolean) => void;
  className?: string;
}

const DURATION_OPTIONS: {
  value: Duration;
  label_ar: string;
  label_en: string;
}[] = [
  { value: "24h", label_ar: "24 س", label_en: "24h" },
  { value: "48h", label_ar: "48 س", label_en: "48h" },
  { value: "week", label_ar: "أسبوع", label_en: "Week" },
  { value: "month", label_ar: "شهر", label_en: "Month" },
];

const NewsTicker: React.FC<NewsTickerProps> = ({
  onNewsLoaded,
  className = "",
}) => {
  const { t, language } = useLanguage();
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState<Duration>("48h");

  const fetchBreaking = useCallback(
    async (dur: Duration) => {
      setLoading(true);
      try {
        const rawData = await API.news.getBreakingNews(dur);
        const data = Array.isArray(rawData) ? rawData : [];
        const normalizedData = data.map((item: string | BreakingNewsItem) => {
          if (typeof item === "string") {
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
    },
    [onNewsLoaded],
  );

  useEffect(() => {
    fetchBreaking(duration);
  }, [duration, fetchBreaking]);

  const handleDurationChange = (newDuration: Duration) => {
    if (newDuration !== duration) {
      setDuration(newDuration);
    }
  };

  const getTitle = (item: BreakingNewsItem) => {
    return language === "en" ? item.title_en || item.title_ar : item.title_ar;
  };

  if (loading) {
    return (
      <div
        className={`bg-gov-beige/90 dark:bg-gov-charcoal/90 backdrop-blur-md border-t border-gov-gold/30 dark:border-gov-gold/20 relative overflow-hidden h-8 md:h-10 flex items-center ${className}`}
      >
        {/* Label */}
        <div className="flex-shrink-0 bg-gov-gold px-3 md:px-4 h-full z-20 flex items-center font-bold shadow-lg">
          <span className="ml-1.5 md:ml-2 rtl:mr-1.5 md:rtl:mr-2 rtl:ml-0 w-1.5 md:w-2 h-1.5 md:h-2 bg-gov-cherry rounded-full animate-pulse"></span>
          <span className="text-xs md:text-sm font-display text-gov-forest">
            {t("news_breaking")}
          </span>
        </div>
        {/* Skeleton content */}
        <div className="flex-1 overflow-hidden h-full px-3 md:px-4">
          <div className="flex items-center h-full gap-3 md:gap-4">
            <SkeletonText lines={1} className="w-48 md:w-64" />
            <SkeletonText lines={1} className="w-32 md:w-48" />
            <SkeletonText lines={1} className="w-40 md:w-56" />
          </div>
        </div>
        {/* Duration selector (shown even while loading) */}
        <div className="hidden flex-shrink-0 flex items-center gap-0.5 px-1.5 md:px-2 h-full z-20">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              disabled
              className={`px-1.5 md:px-2 py-0.5 text-[9px] md:text-[11px] font-semibold rounded-md transition-all duration-200 ${
                opt.value === duration
                  ? "bg-gov-forest text-white dark:bg-gov-gold dark:text-gov-forest shadow-sm"
                  : "text-gov-stone/50 dark:text-gov-beige/30"
              }`}
            >
              {language === "ar" ? opt.label_ar : opt.label_en}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (breakingNews.length === 0) return null;

  // Triple the items to ensure it feels "longer" and has plenty of content to scroll through
  const items = [...breakingNews, ...breakingNews, ...breakingNews];
  // Increase multiplier from 2.8 to 6.0 to make it significantly slower
  const animationDuration = Math.max(30, items.length * 6.0);

  return (
    <div
      className={`bg-gov-beige/90 dark:bg-gov-charcoal/90 backdrop-blur-md text-gov-forest dark:text-white border-t border-gov-gold/30 dark:border-gov-gold/20 relative overflow-hidden h-8 md:h-10 flex items-center ${className}`}
    >
      {/* Label */}
      <div className="flex-shrink-0 bg-gov-gold px-3 md:px-4 h-full z-20 flex items-center font-bold shadow-lg">
        <span className="ml-1.5 md:ml-2 rtl:mr-1.5 md:rtl:mr-2 rtl:ml-0 w-1.5 md:w-2 h-1.5 md:h-2 bg-gov-cherry rounded-full animate-pulse"></span>
        <span className="text-xs md:text-sm font-display text-gov-forest">
          {t("news_breaking")}
        </span>
      </div>

      {/* Scrolling content - Force LTR layout for consistency with absolute positioning/negative margins if any */}
      <div className="flex-1 overflow-hidden h-full" dir="ltr">
        <div
          className={`${language === "ar" ? "animate-ticker-rtl" : "animate-ticker-ltr"} h-full w-max min-w-full flex items-center whitespace-nowrap gap-8 md:gap-12 px-3 md:px-4 will-change-transform`}
          style={{ animationDuration: `${animationDuration}s` }}
        >
          {items.map((news, idx) => (
            <span
              key={idx}
              dir={language === "ar" ? "rtl" : "ltr"}
              className="shrink-0 flex items-center gap-3 md:gap-4 text-xs md:text-base text-gov-forest dark:text-white"
            >
              <span className="font-medium">{getTitle(news)}</span>
              <span className="text-gov-gold text-[10px] md:text-sm">
                {"\u25CF"}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Duration selector buttons */}
      <div className="hidden flex-shrink-0 flex items-center gap-0.5 px-1.5 md:px-2 h-full z-20 border-s border-gov-gold/20">
        {DURATION_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleDurationChange(opt.value)}
            className={`px-1.5 md:px-2 py-0.5 text-[9px] md:text-[11px] font-semibold rounded-md transition-all duration-200 cursor-pointer hover:bg-gov-forest/10 dark:hover:bg-gov-gold/10 ${
              opt.value === duration
                ? "bg-gov-forest text-white dark:bg-gov-gold dark:text-gov-forest shadow-sm"
                : "text-gov-stone dark:text-gov-beige/60 hover:text-gov-forest dark:hover:text-gov-gold"
            }`}
            title={language === "ar" ? opt.label_ar : opt.label_en}
          >
            {language === "ar" ? opt.label_ar : opt.label_en}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
