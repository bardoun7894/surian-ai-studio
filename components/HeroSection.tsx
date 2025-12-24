import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Building2, Activity, ShieldCheck, Cpu, Sparkles, BrainCircuit } from 'lucide-react';
import { ViewState } from '../types';

interface HeroSectionProps {
  onNavigate: (view: ViewState) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(textRef.current?.children || [], 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
    )
    .fromTo(imageRef.current,
      { x: 50, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 1.2 },
      "-=0.8"
    );

  }, []);

  const stats = [
    { label: 'خدمة ذكية', value: '1,250+', icon: <BrainCircuit size={20}/> },
    { label: 'جهة حكومية', value: '45', icon: <Building2 size={20}/> },
    { label: 'دقة معالجة', value: '99%', icon: <Activity size={20}/> },
  ];

  return (
    <section ref={containerRef} className="relative pt-12 pb-20 overflow-hidden bg-gov-beige">
      {/* Background Decor - Official Colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
         <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gov-emerald/15 rounded-full blur-3xl"></div>
         <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-gov-gold/10 rounded-full blur-3xl"></div>
         {/* Abstract Grid Lines */}
         <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gov-emerald/10"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
         </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div ref={textRef} className="flex-1 text-center lg:text-right space-y-8 opacity-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gov-emerald text-white text-sm font-bold shadow-lg shadow-gov-emerald/20">
              <span className="w-2 h-2 rounded-full bg-gov-gold animate-pulse"></span>
              الجمهورية العربية السورية
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gov-charcoal leading-tight">
              منصة الحكومة الذكية <br/>
              <span className="text-gov-emerald relative">
                بقيادة الذكاء الاصطناعي
                <svg className="absolute w-full h-3 -bottom-1 right-0 text-gov-gold/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              رؤية جديدة لمستقبل الخدمات الحكومية في سوريا. نُسخّر تقنيات الذكاء الاصطناعي لتحليل البيانات، تسريع المعاملات، والاستجابة لاحتياجات المواطنين بدقة وشفافية غير مسبوقة.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => onNavigate('DIRECTORATES')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gov-emerald text-white font-bold hover:bg-gov-emeraldLight transition-all shadow-lg shadow-gov-emerald/20 flex items-center justify-center gap-2 group"
              >
                <Cpu size={20} className="text-gov-gold" />
                الخدمات الذكية
              </button>
              <button 
                onClick={() => onNavigate('COMPLAINTS')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-gov-emerald font-bold border border-gray-200 hover:border-gov-emerald hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} />
                نظام الشكاوى
              </button>
            </div>

            {/* Stats Row */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-200/60">
               {stats.map((stat, idx) => (
                 <div key={idx} className="flex flex-col items-center lg:items-start">
                   <span className="text-2xl font-bold text-gov-charcoal flex items-center gap-2">
                     {stat.value}
                     <span className="text-gov-gold">{stat.icon}</span>
                   </span>
                   <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Hero Image/Card Visual */}
          <div ref={imageRef} className="flex-1 w-full lg:w-auto relative opacity-0">
             <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                {/* Decorative circles */}
                <div className="absolute inset-0 border border-gov-emerald/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-8 border border-gov-gold/30 rounded-full animate-[spin_25s_linear_infinite_reverse]"></div>
                
                {/* Main Image */}
                <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white shadow-2xl relative">
                   <img src="https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000" alt="Syria Future Technology" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 filter brightness-90 saturate-50" />
                   
                   {/* Overlay Digital Effect */}
                   <div className="absolute inset-0 bg-gradient-to-t from-gov-emerald/90 via-gov-emerald/20 to-transparent"></div>
                   
                   {/* Coat of Arms Watermark */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none mix-blend-overlay">
                       <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Coat_of_arms_of_Syria.svg/200px-Coat_of_arms_of_Syria.svg.png" 
                          alt="Syrian Eagle" 
                          className="w-2/3 h-auto grayscale contrast-150"
                        />
                   </div>

                   <div className="absolute bottom-10 left-0 right-0 text-center text-white p-4">
                      <p className="font-display font-bold text-xl mb-1 text-gov-gold">الجمهورية العربية السورية</p>
                      <p className="text-xs font-light tracking-wider uppercase opacity-90">Unified Digital Platform</p>
                   </div>
                </div>

                {/* Floating Cards - AI Processing */}
                <div className="absolute top-10 -right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl border border-gov-emerald/10 animate-bounce delay-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gov-emerald/10 flex items-center justify-center text-gov-emerald">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">المساعد الذكي</div>
                      <div className="text-sm font-bold text-gov-charcoal">متصل الآن</div>
                    </div>
                  </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;