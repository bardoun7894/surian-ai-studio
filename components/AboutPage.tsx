import React from 'react';
import { Target, Eye, ShieldCheck, Users, Globe, Zap } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest animate-fade-in pb-20">

      {/* Hero Header */}
      <div className="bg-gov-emerald relative overflow-hidden py-24 text-center text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gov-forest/90"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{t('about_title')}</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            {t('about_subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gov-emerald/20 p-8 rounded-3xl shadow-xl border border-gov-gold/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gov-teal/10 rounded-2xl flex items-center justify-center text-gov-teal mb-6">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-4">{t('about_mission')}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about_mission_desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-gov-emerald/20 p-8 rounded-3xl shadow-xl border border-gov-gold/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gov-gold/10 rounded-2xl flex items-center justify-center text-gov-gold mb-6">
              <Eye size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white mb-4">{t('about_vision')}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about_vision_desc')}
            </p>
          </div>
        </div>

        {/* Strategic Pillars */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-4">{t('about_pillars')}</h2>
            <div className="w-24 h-1 bg-gov-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: t('about_security'), desc: t('about_security_desc') },
              { icon: Users, title: t('about_inclusivity'), desc: t('about_inclusivity_desc') },
              { icon: Globe, title: t('about_digital'), desc: t('about_digital_desc') },
              { icon: Zap, title: t('about_efficiency'), desc: t('about_efficiency_desc') }
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/50 transition-colors text-center group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-white/10 rounded-full flex items-center justify-center text-gov-forest dark:text-white mx-auto mb-4 group-hover:bg-gov-gold group-hover:text-white transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-gov-charcoal dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gov-charcoal text-white rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gov-emerald/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gov-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gov-gold mb-2">3.5M+</div>
              <div className="text-sm text-gray-400">{t('about_users')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gov-gold mb-2">1,200+</div>
              <div className="text-sm text-gray-400">{t('about_services_count')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gov-gold mb-2">98%</div>
              <div className="text-sm text-gray-400">{t('about_satisfaction')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gov-gold mb-2">24/7</div>
              <div className="text-sm text-gray-400">{t('about_support')}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;