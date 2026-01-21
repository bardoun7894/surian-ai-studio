import React from 'react';
import {
  Plane,
  Car,
  Zap,
  GraduationCap,
  Banknote,
  Home,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface QuickService {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const QuickServices: React.FC = () => {
  const { t, language } = useLanguage();

  const services: QuickService[] = [
    {
      id: 'passport',
      titleKey: 'service_passport',
      icon: <Plane size={28} />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white'
    },
    {
      id: 'traffic',
      titleKey: 'service_traffic',
      icon: <Car size={28} />,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-500/10 group-hover:bg-red-600 group-hover:text-white dark:group-hover:bg-red-500 dark:group-hover:text-white'
    },
    {
      id: 'electricity',
      titleKey: 'service_electricity',
      icon: <Zap size={28} />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-500/10 group-hover:bg-yellow-600 group-hover:text-white dark:group-hover:bg-yellow-500 dark:group-hover:text-white'
    },
    {
      id: 'exams',
      titleKey: 'service_exams',
      icon: <GraduationCap size={28} />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-white'
    },
    {
      id: 'clearance',
      titleKey: 'service_clearance',
      icon: <Banknote size={28} />,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-500/10 group-hover:bg-teal-600 group-hover:text-white dark:group-hover:bg-teal-500 dark:group-hover:text-white'
    },
    {
      id: 'property',
      titleKey: 'service_property',
      icon: <Home size={28} />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500 dark:group-hover:text-white'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gray-50 dark:bg-zinc-900/50">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/5 to-transparent"></div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gov-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-indigo/10 text-gov-indigo dark:text-gov-gold text-xs font-bold tracking-wide uppercase mb-5 border border-gov-indigo/20 dark:border-gov-gold/20">
            <Zap size={14} className="fill-current" />
            <span>{t('quick_services_title')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {t('quick_services_subtitle')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {language === 'ar'
              ? 'نقدم لك تجربة استخدام سلسة وسريعة للوصول إلى خدماتك الحكومية المفضلة بضغطة زر واحدة.'
              : 'We offer you a seamless and fast experience to access your favorite government services with just one click.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {services.map((service) => (
            <button
              key={service.id}
              className="group relative flex flex-col items-center p-0 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-gov-gold/40 hover:shadow-[0_20px_40px_-15px_rgba(var(--color-gov-gold),0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(185,167,121,0.2)] transition-all duration-300 cursor-pointer overflow-hidden h-full"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative flex flex-col items-center justify-center p-6 w-full h-full min-h-[220px]">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6 transition-all duration-500 ${service.color} shadow-sm group-hover:scale-110 group-hover:shadow-md`}>
                  {service.icon}
                </div>

                {/* Service Title */}
                <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white text-center leading-snug mb-8 group-hover:text-gov-indigo dark:group-hover:text-gov-gold transition-colors px-2">
                  {t(service.titleKey)}
                </h3>

                {/* Access Service Floating Button */}
                <div className="absolute bottom-5 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-gov-indigo dark:group-hover:text-gov-gold transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {t('access_service')}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 group-hover:bg-gov-indigo text-white dark:group-hover:bg-gov-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowUpRight size={12} className={`text-gray-500 dark:text-gray-300 group-hover:text-white ${language === 'ar' ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default QuickServices;
