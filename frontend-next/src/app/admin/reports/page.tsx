'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  RefreshCw,
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API, StatisticsData } from '@/lib/repository';
import { AdminRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

function ReportsDashboard() {
  const { language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('month');
  const [isExporting, setIsExporting] = useState(false);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await API.reports.getStatistics(period);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setError(language === 'ar' ? 'فشل في تحميل الإحصائيات' : 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const handleExport = async (type: string) => {
    setIsExporting(true);
    try {
      const blob = await API.reports.exportData(type, { period });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed:', err);
      alert(language === 'ar' ? 'فشل في تصدير البيانات' : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return '-';
    return num.toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US');
  };

  const formatPercentage = (num: number | null) => {
    if (num === null) return '-';
    return `${(num * 100).toFixed(1)}%`;
  };

  const statusLabels: Record<string, { ar: string; en: string; color: string }> = {
    new: { ar: 'جديد', en: 'New', color: 'bg-gov-gold/20 text-gov-gold dark:bg-gov-gold/10 dark:text-gov-gold' },
    in_progress: { ar: 'قيد المعالجة', en: 'In Progress', color: 'bg-gov-teal/20 text-gov-teal dark:bg-gov-teal/10 dark:text-gov-teal' },
    resolved: { ar: 'تم الحل', en: 'Resolved', color: 'bg-gov-teal/20 text-gov-teal dark:bg-gov-teal/10 dark:text-gov-teal' },
    rejected: { ar: 'مرفوض', en: 'Rejected', color: 'bg-gov-red/20 text-gov-red dark:bg-gov-red/10 dark:text-gov-red' },
  };

  const priorityLabels: Record<string, { ar: string; en: string }> = {
    low: { ar: 'منخفض', en: 'Low' },
    normal: { ar: 'عادي', en: 'Normal' },
    high: { ar: 'عالي', en: 'High' },
    urgent: { ar: 'عاجل', en: 'Urgent' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors">
      <Navbar onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)} />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                {language === 'ar' ? 'لوحة التقارير والإحصائيات' : 'Reports & Statistics Dashboard'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'نظرة شاملة على أداء النظام والشكاوى' : 'Comprehensive overview of system performance and complaints'}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {/* Period Filter */}
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 pe-10 text-gov-charcoal dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-gov-gold"
                >
                  <option value="today">{language === 'ar' ? 'اليوم' : 'Today'}</option>
                  <option value="week">{language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
                  <option value="month">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
                  <option value="year">{language === 'ar' ? 'هذه السنة' : 'This Year'}</option>
                </select>
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rtl:left-auto rtl:right-3" />
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchStatistics}
                disabled={isLoading}
                className="p-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} className={`text-gov-teal dark:text-gov-gold ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* Export Dropdown */}
              <div className="relative group">
                <button
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors disabled:opacity-50"
                >
                  {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </button>
                <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2 w-48 bg-white dark:bg-gov-charcoal rounded-xl shadow-xl border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleExport('complaints')}
                    className="w-full text-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10 text-gov-charcoal dark:text-white transition-colors rounded-t-xl"
                  >
                    {language === 'ar' ? 'تقرير الشكاوى' : 'Complaints Report'}
                  </button>
                  <button
                    onClick={() => handleExport('users')}
                    className="w-full text-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10 text-gov-charcoal dark:text-white transition-colors"
                  >
                    {language === 'ar' ? 'تقرير المستخدمين' : 'Users Report'}
                  </button>
                  <button
                    onClick={() => handleExport('audit')}
                    className="w-full text-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10 text-gov-charcoal dark:text-white transition-colors rounded-b-xl"
                  >
                    {language === 'ar' ? 'سجل التدقيق' : 'Audit Log'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gov-gold" size={48} />
            </div>
          ) : stats && (
            <>
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Complaints */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center">
                      <FileText className="text-gov-gold" size={24} />
                    </div>
                    <span className="text-sm text-gov-teal font-bold flex items-center gap-1">
                      <TrendingUp size={14} />
                      +{stats.complaints.this_week}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gov-charcoal dark:text-white">{formatNumber(stats.complaints.total)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {language === 'ar' ? 'إجمالي الشكاوى' : 'Total Complaints'}
                  </p>
                </div>

                {/* Active Users */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center">
                      <Users className="text-gov-teal" size={24} />
                    </div>
                    <span className="text-sm text-gray-500">
                      {stats.users.active_today} {language === 'ar' ? 'نشط اليوم' : 'active today'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gov-charcoal dark:text-white">{formatNumber(stats.users.total)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                  </p>
                </div>

                {/* SLA Compliance */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gov-teal/10 flex items-center justify-center">
                      <CheckCircle className="text-gov-teal" size={24} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gov-charcoal dark:text-white">
                    {formatPercentage(stats.performance.sla_compliance_rate)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {language === 'ar' ? 'نسبة الالتزام بالـ SLA' : 'SLA Compliance Rate'}
                  </p>
                </div>

                {/* Overdue Complaints */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gov-red/10 flex items-center justify-center">
                      <AlertTriangle className="text-gov-red" size={24} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gov-charcoal dark:text-white">{formatNumber(stats.complaints.overdue)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {language === 'ar' ? 'شكاوى متأخرة' : 'Overdue Complaints'}
                  </p>
                </div>
              </div>

              {/* Main Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Complaints by Status */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-gov-gold" />
                    {language === 'ar' ? 'الشكاوى حسب الحالة' : 'Complaints by Status'}
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(stats.complaints.by_status).map(([status, count]) => {
                      const total = stats.complaints.total || 1;
                      const percentage = (count / total) * 100;
                      const label = statusLabels[status] || { ar: status, en: status, color: 'bg-gray-100 text-gray-700' };
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${label.color}`}>
                              {language === 'ar' ? label.ar : label.en}
                            </span>
                            <span className="text-sm font-bold text-gov-charcoal dark:text-white">
                              {formatNumber(count)} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${status === 'resolved' ? 'bg-gov-teal' :
                                  status === 'in_progress' ? 'bg-gov-teal' :
                                    status === 'new' ? 'bg-gov-gold' : 'bg-gov-red'
                                }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Complaints by Priority */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-gov-gold" />
                    {language === 'ar' ? 'الشكاوى حسب الأولوية' : 'Complaints by Priority'}
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(stats.complaints.by_priority).map(([priority, count]) => {
                      const total = stats.complaints.total || 1;
                      const percentage = (count / total) * 100;
                      const label = priorityLabels[priority] || { ar: priority, en: priority };
                      return (
                        <div key={priority}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gov-charcoal dark:text-white">
                              {language === 'ar' ? label.ar : label.en}
                            </span>
                            <span className="text-sm font-bold text-gov-charcoal dark:text-white">
                              {formatNumber(count)} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${priority === 'urgent' ? 'bg-gov-red' :
                                  priority === 'high' ? 'bg-gov-gold' :
                                    priority === 'normal' ? 'bg-gov-teal' : 'bg-gray-400'
                                }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Directorates and Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* By Directorate */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                    <Building2 size={20} className="text-gov-gold" />
                    {language === 'ar' ? 'الشكاوى حسب المديرية' : 'Complaints by Directorate'}
                  </h3>
                  <div className="space-y-3">
                    {stats.complaints.by_directorate.map((dir, idx) => {
                      const maxCount = Math.max(...stats.complaints.by_directorate.map(d => d.count)) || 1;
                      const percentage = (dir.count / maxCount) * 100;
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gov-charcoal dark:text-white truncate">
                                {dir.name}
                              </span>
                              <span className="text-sm font-bold text-gov-charcoal dark:text-white">
                                {formatNumber(dir.count)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-gov-teal transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-gov-gold" />
                    {language === 'ar' ? 'مقاييس الأداء' : 'Performance Metrics'}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'ar' ? 'متوسط وقت الرد الأول' : 'Avg First Response Time'}
                        </p>
                        <p className="text-2xl font-bold text-gov-charcoal dark:text-white">
                          {stats.performance.avg_first_response_hours !== null
                            ? `${stats.performance.avg_first_response_hours.toFixed(1)} ${language === 'ar' ? 'ساعة' : 'hours'}`
                            : '-'}
                        </p>
                      </div>
                      <Clock size={32} className="text-gov-teal/30" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'ar' ? 'متوسط وقت الحل' : 'Avg Resolution Time'}
                        </p>
                        <p className="text-2xl font-bold text-gov-charcoal dark:text-white">
                          {stats.performance.avg_resolution_hours !== null
                            ? `${stats.performance.avg_resolution_hours.toFixed(1)} ${language === 'ar' ? 'ساعة' : 'hours'}`
                            : '-'}
                        </p>
                      </div>
                      <CheckCircle size={32} className="text-gov-teal/30" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'ar' ? 'شكاوى اليوم' : "Today's Complaints"}
                        </p>
                        <p className="text-2xl font-bold text-gov-charcoal dark:text-white">
                          {formatNumber(stats.complaints.today)}
                        </p>
                      </div>
                      <Calendar size={32} className="text-gov-gold/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content & Users Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Stats */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6">
                    {language === 'ar' ? 'إحصائيات المحتوى' : 'Content Statistics'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                      <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{formatNumber(stats.content.total)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'ar' ? 'إجمالي' : 'Total'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                      <p className="text-2xl font-bold text-gov-teal">{formatNumber(stats.content.published)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'ar' ? 'منشور' : 'Published'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                      <p className="text-2xl font-bold text-gov-gold">{formatNumber(stats.content.draft)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'ar' ? 'مسودة' : 'Draft'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                      <p className="text-2xl font-bold text-gov-teal">{formatNumber(stats.content.by_type.news || 0)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'ar' ? 'أخبار' : 'News'}</p>
                    </div>
                  </div>
                </div>

                {/* Users by Role */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-gold/10">
                  <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mb-6">
                    {language === 'ar' ? 'المستخدمون حسب الدور' : 'Users by Role'}
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(stats.users.by_role).map(([role, count]) => {
                      const total = stats.users.total || 1;
                      const percentage = (count / total) * 100;
                      const roleLabels: Record<string, { ar: string; en: string }> = {
                        citizen: { ar: 'مواطن', en: 'Citizen' },
                        staff: { ar: 'موظف', en: 'Staff' },
                        admin: { ar: 'مدير', en: 'Admin' },
                      };
                      const label = roleLabels[role] || { ar: role, en: role };
                      return (
                        <div key={role} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium text-gov-charcoal dark:text-white">
                            {language === 'ar' ? label.ar : label.en}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-3">
                              <div
                                className="h-3 rounded-full bg-gov-gold transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                          <div className="w-20 text-end text-sm font-bold text-gov-charcoal dark:text-white">
                            {formatNumber(count)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
                {new Date(stats.generated_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer
        onIncreaseFont={() => { }}
        onDecreaseFont={() => { }}
        onToggleContrast={() => { }}
      />
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <AdminRoute>
      <ReportsDashboard />
    </AdminRoute>
  );
}
