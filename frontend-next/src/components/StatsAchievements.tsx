import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2,
  FileCheck,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { API } from '@/lib/repository';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  labelKey: string;
  icon: React.ReactNode;
  iconBg: string;
  delay: number;
}

const FALLBACK_STATS: Record<string, number> = {
  stat_total_services: 1500,
  stat_transactions: 250000,
  stat_complaints_resolved: 45000,
  stat_satisfaction: 94,
};

const StatsAchievements: React.FC = () => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [statsValues, setStatsValues] = useState<Record<string, number>>(FALLBACK_STATS);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const settings = await API.settings.getByGroup('stats') as Record<string, string>;
        if (settings && Object.keys(settings).length > 0) {
          const parsed: Record<string, number> = {};
          if (settings.stat_total_services) parsed.stat_total_services = parseInt(settings.stat_total_services as string, 10);
          if (settings.stat_transactions) parsed.stat_transactions = parseInt(settings.stat_transactions as string, 10);
          if (settings.stat_complaints_resolved) parsed.stat_complaints_resolved = parseInt(settings.stat_complaints_resolved as string, 10);
          if (settings.stat_satisfaction) parsed.stat_satisfaction = parseInt(settings.stat_satisfaction as string, 10);
          if (Object.keys(parsed).length > 0) {
            setStatsValues(prev => ({ ...prev, ...parsed }));
          }
        }
      } catch {
        // Use fallback values
      }
    };
    fetchStats();
  }, []);

  const stats: StatItem[] = [
    {
      id: 'services',
      value: statsValues.stat_total_services,
      suffix: '+',
      labelKey: 'stat_total_services',
      icon: <Building2 className="text-white" size={28} strokeWidth={2} />,
      iconBg: 'bg-gov-gold/90',
      delay: 0
    },
    {
      id: 'transactions',
      value: statsValues.stat_transactions,
      suffix: '+',
      labelKey: 'stat_transactions',
      icon: <FileCheck className="text-white" size={28} strokeWidth={2} />,
      iconBg: 'bg-gov-forest/80 border border-white/10',
      delay: 0.1
    },
    {
      id: 'complaints',
      value: statsValues.stat_complaints_resolved,
      suffix: '+',
      labelKey: 'stat_complaints_resolved',
      icon: <CheckCircle2 className="text-white" size={28} strokeWidth={2} />,
      iconBg: 'bg-gov-gold/90',
      delay: 0.2
    },
    {
      id: 'satisfaction',
      value: statsValues.stat_satisfaction,
      suffix: '%',
      labelKey: 'stat_satisfaction',
      icon: <ThumbsUp className="text-white" size={28} strokeWidth={2} />,
      iconBg: 'bg-gov-forest/80 border border-white/10',
      delay: 0.3
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate stat cards
      const cards = containerRef.current?.querySelectorAll('.stat-card');
      if (cards) {
        gsap.fromTo(cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true
            },
            onStart: () => {
              // Animate Numbers
              stats.forEach((stat) => {
                const duration = 2000;
                const startTime = Date.now();
                const animate = () => {
                  const elapsed = Date.now() - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  const easeProgress = 1 - Math.pow(1 - progress, 3);

                  setAnimatedValues(prev => ({
                    ...prev,
                    [stat.id]: Math.floor(stat.value * easeProgress)
                  }));

                  if (progress < 1) {
                    requestAnimationFrame(animate);
                  }
                };
                animate();
              });
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [statsValues]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US');
  };

  return (
    <section className="py-24 bg-gov-forest dark:bg-gov-brand/30 relative overflow-hidden" ref={containerRef}>
      {/* Background Pattern and Effects */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gov-gold/5 dark:bg-gov-emerald/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gov-teal/5 dark:bg-gov-brand/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Only header if needed, but keeping it minimal to focus on cards as per image */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            {t('stats_achievements_title')}
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="stat-card flex flex-col p-8 rounded-[2rem] bg-gov-forest/40 backdrop-blur-md border border-white/5 hover:border-gov-gold/30 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight tabular-nums">
                {formatNumber(animatedValues[stat.id] || 0)}
                <span className="text-gov-gold ml-0.5 align-top text-3xl">{stat.suffix}</span>
              </div>

              {/* Label */}
              <p className="text-gov-beige/60 font-medium text-lg leading-relaxed">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsAchievements;
