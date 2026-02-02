'use client';

import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';
import { Article } from '@/types';
import { getLocalizedField } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'visual';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  const { language } = useLanguage();
  const lang = language as 'ar' | 'en';
  const title = getLocalizedField(article, 'title', lang);
  const excerpt = getLocalizedField(article, 'excerpt', lang);
  const category = getLocalizedField(article, 'category', lang);
  const author = getLocalizedField(article, 'author', lang);
  const readTime = getLocalizedField(article, 'readTime', lang);
  const href = article.id ? `/news/${article.id}` : '/news';

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden relative">
          <Image
            src={article.imageUrl}
            alt={title}
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-gov-gold mb-1 block">{category}</span>
          <h4 className="text-sm font-bold text-white dark:text-gov-teal leading-snug mb-2 line-clamp-2 group-hover:text-gov-gold transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gov-sand">
            <Clock size={12} />
            <span>{article.date}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'visual') {
    return (
      <Link href={href} className="group relative w-full h-full rounded-3xl overflow-hidden border border-white/10 cursor-pointer block">
        <Image
          src={article.imageUrl}
          alt={title}
          fill
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gov-charcoal via-gov-charcoal/50 to-transparent opacity-90"></div>

        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/10">
            {category}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white dark:text-gov-teal mb-2 leading-tight group-hover:text-gov-gold transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gov-beige/90 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gov-sand">
            <span>{author}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {readTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default
  return (
    <Link href={href} className="group flex flex-col gap-4 p-4 rounded-3xl bg-gov-forest/40 dark:bg-dm-surface border border-gov-gold/10 hover:border-gov-gold/30 hover:bg-gov-forest/60 transition-all cursor-pointer h-full">
      <div className="w-full aspect-video rounded-2xl overflow-hidden relative">
        <Image
          src={article.imageUrl}
          alt={title}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <PlayCircle size={40} className="text-white drop-shadow-lg" />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-gov-gold"></span>
          <span className="text-xs font-bold text-gov-sand uppercase tracking-wider">{category}</span>
        </div>
        <h3 className="text-lg font-bold text-white dark:text-gov-teal mb-2 leading-tight group-hover:text-gov-gold transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gov-beige/70 line-clamp-2 mb-4 flex-1">
          {excerpt}
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-gov-gold/10 mt-auto">
          <div className="w-6 h-6 rounded-full bg-gov-gold/20 flex items-center justify-center text-[10px] font-bold text-gov-gold">
            {author?.[0] || ''}
          </div>
          <span className="text-xs text-gov-sand">{author}</span>
          <span className="text-xs text-gov-sand/60 mr-auto">{article.date}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
