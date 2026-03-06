'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Users,
  BarChart3,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Settings,
  Lightbulb,
  Newspaper,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API, StatisticsData } from '@/lib/repository';
import { SkeletonCard, SkeletonText } from '@/components/SkeletonLoader';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [satisfaction, setSatisfaction] = useState<{
    average_rating: number;
    satisfaction_rate: number;
    total_rated: number;
    response_speed_rating?: number;
    solution_quality_rating?: number;
    ease_of_use_rating?: number;
  } | null>(null);
  const [happinessStats, setHappinessStats] = useState<{
    total: number;
    average: number;
    satisfaction_rate: number;
    distribution: { happy: number; neutral: number; sad: number };
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await API.reports.getStatistics('week');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsLoading(false);
      }

      // Fetch satisfaction data
      try {
        const token = localStorage.getItem('auth_token');
        const satRes = await fetch('/api/v1/staff/analytics/satisfaction', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (satRes.ok) {
          const satData = await satRes.json();
          setSatisfaction(satData.data || satData);
        }
      } catch (err) {
        console.error('Failed to fetch satisfaction:', err);
      }

      // Fetch happiness feedback stats (مؤشر الرضا)
      try {
        const happinessData = await API.happiness.getStats();
        if (happinessData) setHappinessStats(happinessData);
      } catch (err) {
        console.error('Failed to fetch happiness stats:', err);
      }
    };
    fetchStats();
  }, []);

  const quickLinks = [
    {
      href: '/admin/reports',
      label: { ar: 'التقارير والإحصائيات', en: 'Reports & Statistics' },
      icon: BarChart3,
      color: 'bg-gov-gold/10 text-gov-gold',
    },
    {
      href: '/admin/complaints',
      label: { ar: 'إدارة الشكاوى', en: 'Manage Complaints' },
      icon: FileText,
      color: 'bg-gov-teal/10 text-gov-teal',
    },
    {
      href: '/admin/content',
      label: { ar: 'إدارة المحتوى', en: 'Content Management' },
      icon: FileText,
      color: 'bg-gov-emerald/10 text-gov-emerald',
    },
    {
      href: '/admin/users',
      label: { ar: 'إدارة المستخدمين', en: 'Manage Users' },
      icon: Users,
      color: 'bg-gov-teal/10 text-gov-teal',
    },
    {
      href: '/admin/suggestions',
      label: { ar: 'إدارة الاقتراحات', en: 'Manage Suggestions' },
      icon: Lightbulb,
      color: 'bg-gov-emerald/10 text-gov-emerald',
    },
    {
      href: '/admin/content?category=announcement',
      label: { ar: 'إدارة الإعلانات', en: 'Manage Announcements' },
      icon: Newspaper,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    {
      href: '/admin/settings',
      label: { ar: 'إعدادات النظام', en: 'System Settings' },
      icon: Settings,
      color: 'bg-gov-gold/10 text-gov-gold',
    },
  ];

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
          {language === 'ar'
            ? `مرحباً، ${user?.first_name || 'مدير'}`
            : `Welcome, ${user?.first_name || 'Admin'}`}
        </h1>
        <p className="text-gray-500 dark:text-white/70">
          {language === 'ar'
            ? 'نظرة سريعة على حالة النظام'
            : 'Quick overview of system status'}
        </p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
          <div className="md:col-span-2 lg:col-span-4 bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15 mt-4">
            <SkeletonText lines={6} />
          </div>
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center">
                <FileText className="text-gov-gold" size={24} />
              </div>
              <TrendingUp className="text-gov-teal" size={20} />
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.complaints.total.toLocaleString('en-US')}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'إجمالي الشكاوى' : 'Total Complaints'}
            </p>
          </div>

          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center">
                <Clock className="text-gov-teal" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.complaints.by_status.in_progress || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'قيد المعالجة' : 'In Progress'}
            </p>
          </div>

          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-red/10 flex items-center justify-center">
                <AlertTriangle className="text-gov-red" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.complaints.overdue}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'متأخرة' : 'Overdue'}
            </p>
          </div>

          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center">
                <CheckCircle className="text-gov-teal" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.performance.sla_compliance_rate !== null
                ? `${(stats.performance.sla_compliance_rate * 100).toFixed(0)}%`
                : '-'}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'نسبة SLA' : 'SLA Rate'}
            </p>
          </div>

          {/* Additional KPIs Row - Users, Suggestions, News */}
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-blue/10 dark:bg-gov-blue/30 flex items-center justify-center">
                <Users className="text-gov-blue dark:text-blue-400" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.users?.total?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
            </p>
            <p className="text-xs text-gov-teal mt-1">
              {stats.users?.active_today || 0} {language === 'ar' ? 'نشط اليوم' : 'active today'}
            </p>
          </div>

          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-forest/10 dark:bg-gov-forest/30 flex items-center justify-center">
                <MessageSquare className="text-gov-forest dark:text-gov-emerald" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.complaints.this_week || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'شكاوى هذا الأسبوع' : 'Complaints This Week'}
            </p>
          </div>

          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-emerald/10 dark:bg-gov-emerald/30 flex items-center justify-center">
                <Lightbulb className="text-gov-emerald dark:text-gov-teal" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.users?.new_this_week || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'مستخدمين جدد' : 'New Users'}
            </p>
          </div>

          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Newspaper className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.content?.published || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'محتوى منشور' : 'Published Content'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.content?.draft || 0} {language === 'ar' ? 'مسودة' : 'drafts'}
            </p>
          </div>

          {/* User Satisfaction Indicator (FR-55) */}
          <div className="md:col-span-2 lg:col-span-4 bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15 mt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'مؤشر رضا المستفيدين' : 'User Satisfaction Index'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl">
                <span className="text-4xl font-bold text-gov-forest dark:text-gov-gold mb-2">{satisfaction?.average_rating?.toFixed(1) || '-'}</span>
                <div className="flex text-yellow-400 mb-2">
                  {[1, 2, 3, 4, 5].map(i => <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <span className="text-sm text-gray-500">{language === 'ar' ? 'التقييم العام' : 'Overall Rating'}</span>
                <span className="text-xs text-gray-400 mt-1">{satisfaction?.total_rated || 0} {language === 'ar' ? 'تقييم' : 'ratings'}</span>
              </div>

              <div className="md:col-span-2 space-y-4">
                {[
                  { label: language === 'ar' ? 'سرعة الاستجابة' : 'Response Speed', value: satisfaction?.response_speed_rating ? Math.round(satisfaction.response_speed_rating * 20) : 0, color: 'bg-gov-emerald' },
                  { label: language === 'ar' ? 'جودة الحلول' : 'Solution Quality', value: satisfaction?.solution_quality_rating ? Math.round(satisfaction.solution_quality_rating * 20) : 0, color: 'bg-gov-blue' },
                  { label: language === 'ar' ? 'الرضا العام' : 'Overall Satisfaction', value: satisfaction?.satisfaction_rate ? Math.round(satisfaction.satisfaction_rate) : 0, color: 'bg-gov-forest' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-gray-700 dark:text-white/70">{item.label}</span>
                      <span className="text-gray-500 dark:text-white/70">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-dm-surface rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Happiness Feedback Stats (مؤشر الرضا) */}
      {happinessStats && happinessStats.total > 0 && (
        <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gov-gold/10 flex items-center justify-center text-gov-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
              {language === 'ar' ? 'مؤشر السعادة العام' : 'General Happiness Indicator'}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl">
              <span className="text-3xl font-bold text-gov-forest dark:text-gov-gold">{happinessStats.total}</span>
              <p className="text-sm text-gray-500 dark:text-white/70 mt-1">{language === 'ar' ? 'إجمالي التقييمات' : 'Total Feedback'}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gov-card/10 rounded-xl">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">{happinessStats.satisfaction_rate}%</span>
              <p className="text-sm text-gray-500 dark:text-white/70 mt-1">{language === 'ar' ? 'نسبة الرضا' : 'Satisfaction Rate'}</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <span className="text-2xl">😊</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400 ml-2">{happinessStats.distribution.happy}</span>
              <p className="text-sm text-gray-500 dark:text-white/70 mt-1">{language === 'ar' ? 'سعيد' : 'Happy'}</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <span className="text-2xl">😐</span>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400 ml-1">{happinessStats.distribution.neutral}</span>
                <p className="text-xs text-gray-500 dark:text-white/70 mt-1">{language === 'ar' ? 'محايد' : 'Neutral'}</p>
              </div>
              <div className="flex-1 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <span className="text-2xl">😞</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400 ml-1">{happinessStats.distribution.sad}</span>
                <p className="text-xs text-gray-500 dark:text-white/70 mt-1">{language === 'ar' ? 'غير راضٍ' : 'Sad'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <h2 className="text-xl font-bold text-gov-charcoal dark:text-white mb-4">
        {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <span className="font-bold text-gov-charcoal dark:text-white">
                    {language === 'ar' ? link.label.ar : link.label.en}
                  </span>
                </div>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-gov-gold transition-colors rtl:rotate-180"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
