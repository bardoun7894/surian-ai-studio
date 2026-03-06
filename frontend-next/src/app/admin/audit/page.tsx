'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuditLog, AuditSummary, AuditResponse } from '@/types';
import { API_URL } from '@/constants';
import {
  Shield,
  Activity,
  User,
  FileText,
  Search,
  Filter,
  Download,
  Clock,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { TableRowSkeleton } from '@/components/Skeleton';
import { SkeletonCard, SkeletonText } from '@/components/SkeletonLoader';

const translations = {
  ar: {
    title: 'سجل التدقيق',
    subtitle: 'عرض جميع أنشطة النظام والمستخدمين',
    passwordRequired: 'التحقق من الهوية مطلوب',
    passwordHint: 'أدخل كلمة المرور للوصول لسجلات التدقيق',
    password: 'كلمة المرور',
    verify: 'تحقق',
    verifying: 'جاري التحقق...',
    wrongPassword: 'كلمة المرور غير صحيحة',
    summary: 'ملخص النشاطات',
    recentActivity: 'النشاطات الأخيرة',
    action: 'الإجراء',
    count: 'العدد',
    user: 'المستخدم',
    entity: 'الكيان',
    time: 'الوقت',
    ipAddress: 'عنوان IP',
    details: 'التفاصيل',
    noLogs: 'لا توجد سجلات',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ أثناء تحميل البيانات',
    search: 'بحث...',
    filter: 'تصفية',
    export: 'تصدير',
    days: 'أيام',
    showLast: 'عرض آخر',
    system: 'النظام',
    expandDetails: 'عرض التفاصيل',
    collapseDetails: 'إخفاء التفاصيل',
    actions: {
      login_success: 'تسجيل دخول ناجح',
      login_failed: 'فشل تسجيل الدخول',
      login_locked_out: 'حساب مقفل',
      logout: 'تسجيل خروج',
      user_created: 'إنشاء مستخدم',
      user_updated: 'تحديث مستخدم',
      user_deleted: 'حذف مستخدم',
      complaint_created: 'إنشاء شكوى',
      complaint_updated: 'تحديث شكوى',
      status_updated: 'تحديث الحالة',
      suggestion_submitted: 'تقديم اقتراح',
      content_created: 'إنشاء محتوى',
      content_updated: 'تحديث محتوى',
      content_deleted: 'حذف محتوى',
      view: 'عرض',
      export: 'تصدير',
      '2fa_enabled': 'تفعيل المصادقة الثنائية',
      '2fa_disabled': 'إيقاف المصادقة الثنائية',
      '2fa_failed_wrong': 'فشل المصادقة الثنائية',
      password_changed: 'تغيير كلمة المرور',
    }
  },
  en: {
    title: 'Audit Log',
    subtitle: 'View all system and user activities',
    passwordRequired: 'Identity Verification Required',
    passwordHint: 'Enter your password to access audit logs',
    password: 'Password',
    verify: 'Verify',
    verifying: 'Verifying...',
    wrongPassword: 'Incorrect password',
    summary: 'Activity Summary',
    recentActivity: 'Recent Activity',
    action: 'Action',
    count: 'Count',
    user: 'User',
    entity: 'Entity',
    time: 'Time',
    ipAddress: 'IP Address',
    details: 'Details',
    noLogs: 'No logs found',
    loading: 'Loading...',
    error: 'Error loading data',
    search: 'Search...',
    filter: 'Filter',
    export: 'Export',
    days: 'days',
    showLast: 'Show last',
    system: 'System',
    expandDetails: 'Show details',
    collapseDetails: 'Hide details',
    actions: {
      login_success: 'Login Success',
      login_failed: 'Login Failed',
      login_locked_out: 'Account Locked',
      logout: 'Logout',
      user_created: 'User Created',
      user_updated: 'User Updated',
      user_deleted: 'User Deleted',
      complaint_created: 'Complaint Created',
      complaint_updated: 'Complaint Updated',
      status_updated: 'Status Updated',
      suggestion_submitted: 'Suggestion Submitted',
      content_created: 'Content Created',
      content_updated: 'Content Updated',
      content_deleted: 'Content Deleted',
      view: 'View',
      export: 'Export',
      '2fa_enabled': '2FA Enabled',
      '2fa_disabled': '2FA Disabled',
      '2fa_failed_wrong': '2FA Failed',
      password_changed: 'Password Changed',
    }
  }
};

const getActionColor = (action: string): string => {
  if (action.includes('failed') || action.includes('locked') || action.includes('deleted')) {
    return 'text-red-600 bg-red-50';
  }
  if (action.includes('success') || action.includes('created')) {
    return 'text-green-600 bg-green-50';
  }
  if (action.includes('updated') || action.includes('changed')) {
    return 'text-blue-600 bg-blue-50';
  }
  return 'text-gray-600 bg-gray-50';
};

const getActionIcon = (action: string) => {
  if (action.includes('login') || action.includes('logout')) {
    return <User className="w-4 h-4" />;
  }
  if (action.includes('content')) {
    return <FileText className="w-4 h-4" />;
  }
  return <Activity className="w-4 h-4" />;
};

export default function AuditLogPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [days, setDays] = useState(7);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  // Password protection state
  const [isLocked, setIsLocked] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    const verified = sessionStorage.getItem('audit_verified');
    if (verified) {
      const timestamp = parseInt(verified, 10);
      // Session verification is valid for the session (no expiry)
      if (!isNaN(timestamp)) {
        setIsLocked(false);
      }
    }
  }, []);

  const verifyPassword = async () => {
    if (!passwordInput.trim()) return;

    setVerifying(true);
    setPasswordError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/auth/verify-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordInput })
      });

      const result = await res.json();

      if (res.ok && result.verified) {
        sessionStorage.setItem('audit_verified', Date.now().toString());
        setIsLocked(false);
        setPasswordInput('');
      } else {
        setPasswordError(t.wrongPassword);
      }
    } catch (err) {
      setPasswordError(t.error);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!isLocked) {
      fetchAuditLogs();
    }
  }, [days, isLocked]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/reports/audit?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (logId: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const filteredLogs = data?.recent_activity?.filter(log => {
    if (!searchTerm) return true;
    const actionLabel = (t.actions as any)[log.action] || log.action;
    const userName = log.user?.name || t.system;
    return (
      actionLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entity_type && log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ip_address && log.ip_address.includes(searchTerm))
    );
  }) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-u-nu-latn' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const handleExport = () => {
    if (!data?.recent_activity) return;

    const csv = [
      ['Time', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.created_at,
        log.user?.name || 'System',
        (t.actions as any)[log.action] || log.action,
        log.entity_type || '',
        log.entity_id || '',
        log.ip_address || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Password verification screen
  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.passwordRequired}</h2>
            <p className="text-gray-500 text-sm">{t.passwordHint}</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); verifyPassword(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying || !passwordInput.trim()}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.verifying}
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  {t.verify}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dm-bg p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8"><SkeletonText lines={1} /></div>
              <div className="w-52"><SkeletonText lines={1} /></div>
            </div>
            <div className="w-72"><SkeletonText lines={1} /></div>
          </div>

          {/* Controls Skeleton */}
          <div className="bg-white dark:bg-gov-card/10 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <SkeletonText lines={2} className="flex-1" />
              <div className="flex items-center gap-2">
                <div className="w-32"><SkeletonText lines={1} /></div>
              </div>
              <div className="w-24"><SkeletonText lines={1} /></div>
            </div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} className="rounded-lg shadow-sm p-4" />
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white dark:bg-gov-card/10 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gov-border/15">
              <div className="w-40"><SkeletonText lines={1} /></div>
            </div>
            <div className="p-6">
              {/* Header Skeleton */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gov-border/15 mb-4">
                <div className="w-[15%]"><SkeletonText lines={1} /></div>
                <div className="w-[15%]"><SkeletonText lines={1} /></div>
                <div className="w-[20%]"><SkeletonText lines={1} /></div>
                <div className="w-[15%]"><SkeletonText lines={1} /></div>
                <div className="w-[15%]"><SkeletonText lines={1} /></div>
                <div className="w-[20%]"><SkeletonText lines={1} /></div>
              </div>
              {/* Table Rows Skeleton */}
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          </div>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Days filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={1}>1 {t.days}</option>
                <option value={7}>7 {t.days}</option>
                <option value={30}>30 {t.days}</option>
                <option value={90}>90 {t.days}</option>
              </select>
            </div>

            {/* Export button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              {t.export}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {data?.summary?.slice(0, 8).map((item, index) => (
            <motion.div
              key={item.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{(t.actions as any)[item.action] || item.action}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                </div>
                <div className={`p-3 rounded-lg ${getActionColor(item.action)}`}>
                  {getActionIcon(item.action)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t.recentActivity}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t.noLogs}</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.time}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.user}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.action}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.entity}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.ipAddress}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.details}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <>
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {formatDate(log.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {log.user?.name || t.system}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                            {getActionIcon(log.action)}
                            {(t.actions as any)[log.action] || log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.entity_type && (
                            <span className="text-gray-700">
                              {log.entity_type} #{log.entity_id}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.ip_address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {log.ip_address}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {log.changes && (
                            <button
                              onClick={() => toggleExpand(log.id)}
                              className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                              {expandedLogs.has(log.id) ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  {t.collapseDetails}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  {t.expandDetails}
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedLogs.has(log.id) && log.changes && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <pre className="text-xs text-gray-700 overflow-x-auto">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
