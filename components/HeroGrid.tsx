import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Share2, Bookmark, Play } from 'lucide-react';
import { HERO_ARTICLE, GRID_ARTICLES } from '../constants';
import ArticleCard from './ArticleCard';
import { summarizeArticle } from '../services/geminiService';

const HeroGrid: React.FC = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    if (summary) {
        setSummary(null); // Toggle off
        return;
    }
    
    setIsSummarizing(true);
    const result = await summarizeArticle(HERO_ARTICLE.excerpt + " [محاكاة لمحتوى كامل للمقال لغرض التلخيص]", HERO_ARTICLE.title);
    setSummary(result);
    setIsSummarizing(false);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Main Hero Item (Span 8 cols on large) */}
        <div className="lg:col-span-8 lg:row-span-2 relative group rounded-[2.5rem] overflow-hidden min-h-[500px] border border-white/10 shadow-2xl shadow-black/50">
          <div className="absolute inset-0">
             <img 
               src={HERO_ARTICLE.imageUrl} 
               alt={HERO_ARTICLE.title} 
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
             />
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-surian-dark via-surian-dark/60 to-transparent opacity-95"></div>
          </div>

          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start z-10">
             <div className="mb-auto flex w-full justify-between items-start">
               <span className="px-4 py-1.5 rounded-full bg-surian-red text-white text-sm font-bold shadow-lg shadow-surian-red/20 animate-pulse">
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
                <div className="flex items-center gap-3 text-zinc-300">
                    <span className="font-semibold text-surian-gold">{HERO_ARTICLE.category}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
                    <span>{HERO_ARTICLE.date}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
                    <span className="flex items-center gap-1"><Sparkles size={14} className="text-surian-gold"/> ذكاء اصطناعي</span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                  {HERO_ARTICLE.title}
                </h1>
                
                <p className="text-lg text-zinc-300 leading-relaxed md:w-3/4">
                  {HERO_ARTICLE.excerpt}
                </p>

                {/* Gemini Summary Section */}
                {summary && (
                  <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-up">
                    <h5 className="flex items-center gap-2 text-surian-gold font-bold mb-2">
                      <Sparkles size={16} /> ملخص ذكي
                    </h5>
                    <div className="text-zinc-200 text-sm whitespace-pre-line leading-relaxed">
                      {summary}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button className="px-8 py-3.5 rounded-full bg-white text-surian-dark font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 group/btn">
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
                        <Sparkles size={18} className="text-surian-gold" />
                        {summary ? 'إخفاء الملخص' : 'تلخيص ذكي'}
                        </>
                    )}
                  </button>
                </div>
             </div>
          </div>
        </div>

        {/* Side Column Items (Span 4 cols) */}
        <div className="lg:col-span-4 lg:row-span-2 flex flex-col gap-6">
           <div className="flex-1 min-h-[240px]">
             <ArticleCard article={GRID_ARTICLES[0]} variant="visual" />
           </div>
           <div className="flex-1 min-h-[240px]">
             <ArticleCard article={GRID_ARTICLES[1]} variant="default" />
           </div>
        </div>
        
        {/* Bottom Row */}
        <div className="lg:col-span-4 min-h-[280px]">
             <ArticleCard article={GRID_ARTICLES[2]} variant="default" />
        </div>
        
        <div className="lg:col-span-4 min-h-[280px] rounded-[2rem] bg-surian-red relative overflow-hidden group cursor-pointer border border-transparent hover:border-white/20 transition-all">
             <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 p-32 bg-black/20 rounded-full blur-2xl transform translate-y-1/3 -translate-x-1/3"></div>
             
             <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                   <span className="inline-block px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold mb-4 border border-white/10">فيديو حصري</span>
                   <h3 className="text-2xl font-bold text-white mb-2">كواليس التحضيرات النهائية</h3>
                   <p className="text-white/80 text-sm">شاهد التقرير الحصري من قلب الحدث مع مراسلنا.</p>
                </div>
                <div className="flex items-center justify-center">
                   <button className="w-16 h-16 rounded-full bg-white text-surian-red flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={32} className="ml-1 fill-current" />
                   </button>
                </div>
             </div>
        </div>

        <div className="lg:col-span-4 min-h-[280px] p-6 rounded-[2rem] bg-zinc-900 border border-white/5 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surian-gold to-orange-500 mb-4 flex items-center justify-center text-white">
                <span className="font-display font-bold text-2xl">30+</span>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">كاتب ومحلل</h3>
             <p className="text-zinc-400 text-sm mb-6">انضم إلى مجتمعنا من الخبراء والمحللين لقراءة تحليلات عميقة.</p>
             <button className="px-6 py-2 rounded-full border border-white/20 text-white text-sm hover:bg-white hover:text-surian-dark transition-colors">تصفح الكتاب</button>
        </div>

      </div>
    </section>
  );
};

export default HeroGrid;