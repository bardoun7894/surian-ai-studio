import React from 'react';
import { PlayCircle, Clock } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'visual';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <div className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-gov-gold/10 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-gov-gold/20">
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden relative shadow-sm">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-gov-gold mb-1 block">{article.category}</span>
          <h4 className="text-sm font-bold text-gov-forest dark:text-zinc-100 leading-snug mb-2 line-clamp-2 group-hover:text-gov-red transition-colors">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500">
            <Clock size={12} />
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'visual') {
    return (
      <div className="group relative w-full h-full rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 cursor-pointer shadow-md hover:shadow-xl transition-all duration-500">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-gov-forest via-gov-forest/40 to-transparent opacity-90"></div>

        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 uppercase tracking-widest">
            {article.category}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-gov-gold transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-200 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-gray-300">
            <span>{article.author}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default
  return (
    <div className="group flex flex-col gap-4 p-5 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-gov-gold/30 hover:shadow-xl transition-all duration-500 cursor-pointer h-full">
      <div className="w-full aspect-video rounded-2xl overflow-hidden relative shadow-inner">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gov-forest/40 backdrop-blur-[2px]">
          <PlayCircle size={48} className="text-white drop-shadow-2xl scale-75 group-hover:scale-100 transition-transform" />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-gov-red shadow-[0_0_8px_#6b1f2a]"></span>
          <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-[0.2em]">{article.category}</span>
        </div>
        <h3 className="text-lg font-bold text-gov-forest dark:text-white mb-3 leading-tight group-hover:text-gov-teal dark:group-hover:text-gov-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-3 mb-5 flex-1 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gov-gold/20 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-gov-forest dark:text-white">
              {article.author[0]}
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-400">{article.author}</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase">{article.date}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;