import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Search, Building2, FileText, Activity, ShieldCheck } from 'lucide-react';
import { ViewState } from '../types';

interface HeroSectionProps {
  onNavigate: (view: ViewState) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'خدمة إلكترونية', value: '1,250+', icon: <FileText size={20}/> },
    { label: 'جهة حكومية', value: '45', icon: <Building2 size={20}/> },
    { label: 'نسبة إنجاز', value: '98%', icon: <Activity size={20}/> },
  ];

  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gov-beige">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-gov-emerald/5 rounded-full blur-3xl"></div>
         <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-gov-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-right space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-gold/10 text-gov-emerald text-sm font-bold border border-gov-gold/20">
              <span className="w-2 h-2 rounded-full bg-gov-gold animate-pulse"></span>
              بوابة الخدمات الوطنية
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gov-charcoal leading-tight">
              نحو مستقبل رقمي <br/>
              <span className="text-gov-emerald relative">
                أكثر ذكاءً وشفافية
                <svg className="absolute w-full h-3 -bottom-1 right-0 text-gov-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              المنصة الموحدة للوصول إلى كافة الخدمات الحكومية، تقديم الشكاوى والمقترحات، ومتابعة المعاملات بكل سهولة وموثوقية عالية.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => onNavigate('DIRECTORATES')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gov-emerald text-white font-bold hover:bg-gov-emerald/90 transition-all shadow-lg shadow-gov-emerald/20 flex items-center justify-center gap-2 group"
              >
                تصفح الخدمات
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('COMPLAINTS')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-gov-charcoal font-bold border border-gray-200 hover:border-gov-emerald hover:text-gov-emerald transition-all flex items-center justify-center gap-2"
              >
                تقديم شكوى
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
          <div className="flex-1 w-full lg:w-auto relative animate-fade-in delay-100">
             <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                {/* Decorative circles */}
                <div className="absolute inset-0 border border-gray-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-8 border border-gov-emerald/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                
                {/* Main Image */}
                <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1577017040065-650523537231?auto=format&fit=crop&q=80&w=1000" alt="Government Building" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-gov-emerald/80 to-transparent"></div>
                   <div className="absolute bottom-10 left-0 right-0 text-center text-white">
                      <p className="font-display font-bold text-xl">خدمتكم واجبنا</p>
                      <p className="text-sm opacity-90">على مدار 24 ساعة</p>
                   </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute top-10 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce delay-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">حالة النظام</div>
                      <div className="text-sm font-bold text-green-600">آمن وفعال</div>
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