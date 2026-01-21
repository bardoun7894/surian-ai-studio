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
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API, StatisticsData } from '@/lib/repository';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      href: '/admin/users',
      label: { ar: 'إدارة المستخدمين', en: 'Manage Users' },
      icon: Users,
      color: 'bg-gov-teal/10 text-gov-teal',
    },
  ];

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
          {language === 'ar'
            ? `مرحباً، ${user?.name || 'مدير'}`
            : `Welcome, ${user?.name || 'Admin'}`}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'ar'
            ? 'نظرة سريعة على حالة النظام'
            : 'Quick overview of system status'}
        </p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gov-gold" size={40} />
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center">
                <FileText className="text-gov-gold" size={24} />
              </div>
              <TrendingUp className="text-gov-teal" size={20} />
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.complaints.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'إجمالي الشكاوى' : 'Total Complaints'}
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center">
                <Clock className="text-gov-teal" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.complaints.by_status.in_progress || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'قيد المعالجة' : 'In Progress'}
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gov-red/10 flex items-center justify-center">
                <AlertTriangle className="text-gov-red" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
              {stats.complaints.overdue}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'متأخرة' : 'Overdue'}
            </p>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'نسبة SLA' : 'SLA Rate'}
            </p>
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
              className="group bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10 hover:border-gov-gold/30 transition-all"
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
