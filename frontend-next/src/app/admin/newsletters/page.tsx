'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Filter,
  Loader2,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Calendar,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Subscriber {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
}

interface NewsletterStats {
  active_subscribers: number;
  unsubscribed: number;
  total: number;
  this_week: number;
  this_month: number;
}

export default function AdminNewslettersPage() {
  const { language } = useLanguage();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats>({
    active_subscribers: 0,
    unsubscribed: 0,
    total: 0,
    this_week: 0,
    this_month: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [filterStatus, currentPage]);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/admin/newsletters?status=${filterStatus}&page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.data || []);
        setTotalPages(data.meta?.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      // Mock data for development
      setSubscribers([
        {
          id: 1,
          email: 'user1@example.com',
          status: 'active',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          email: 'user2@example.com',
          status: 'active',
          subscribed_at: new Date(Date.now() - 86400000).toISOString(),
          unsubscribed_at: null,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          email: 'user3@example.com',
          status: 'unsubscribed',
          subscribed_at: new Date(Date.now() - 172800000).toISOString(),
          unsubscribed_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/newsletter/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.data || {
          active_subscribers: 0,
          unsubscribed: 0,
          total: 0,
          this_week: 0,
          this_month: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock stats
      setStats({
        active_subscribers: 2,
        unsubscribed: 1,
        total: 3,
        this_week: 2,
        this_month: 3
      });
    }
  };

  const exportSubscribers = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/admin/newsletters/export?format=csv', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        // Fallback: Export current data
        const csvContent = [
          ['Email', 'Status', 'Subscribed At', 'Unsubscribed At'].join(','),
          ...subscribers.map(s => [
            s.email,
            s.status,
            s.subscribed_at,
            s.unsubscribed_at || ''
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      alert(language === 'ar' ? 'فشل تصدير البيانات' : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المشترك؟' : 'Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/admin/newsletters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setSubscribers(subscribers.filter(s => s.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const filteredSubscribers = subscribers.filter(s => {
    if (searchQuery) {
      return s.email.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dm-bg p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white">
              {language === 'ar' ? 'إدارة النشرة البريدية' : 'Newsletter Management'}
            </h1>
            <p className="text-gray-500 dark:text-white/70 mt-1">
              {language === 'ar' ? 'إدارة المشتركين في النشرة البريدية' : 'Manage newsletter subscribers'}
            </p>
          </div>
          <button
            onClick={exportSubscribers}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-gov-teal text-white font-bold rounded-2xl hover:bg-gov-emerald transition-all shadow-lg disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {language === 'ar' ? 'تصدير CSV' : 'Export CSV'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.active_subscribers}</p>
                <p className="text-sm text-gray-500">{language === 'ar' ? 'مشترك نشط' : 'Active'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle size={24} className="text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.unsubscribed}</p>
                <p className="text-sm text-gray-500">{language === 'ar' ? 'ألغى الاشتراك' : 'Unsubscribed'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Users size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-500">{language === 'ar' ? 'إجمالي' : 'Total'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.this_week}</p>
                <p className="text-sm text-gray-500">{language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <Calendar size={24} className="text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.this_month}</p>
                <p className="text-sm text-gray-500">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالبريد الإلكتروني...' : 'Search by email...'}
              className="w-full pl-12 rtl:pl-4 rtl:pr-12 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'unsubscribed')}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            >
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="unsubscribed">{language === 'ar' ? 'ألغى الاشتراك' : 'Unsubscribed'}</option>
            </select>
          </div>

          <button
            onClick={() => { fetchSubscribers(); fetchStats(); }}
            className="p-3 bg-white dark:bg-gov-card/10 rounded-xl border border-gray-200 dark:border-gov-border/15 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            title={language === 'ar' ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-gov-card/10 rounded-3xl border border-gray-100 dark:border-gov-border/15 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-gov-gold" size={40} />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto text-gray-300 dark:text-white/70 mb-4" />
            <p className="text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'لا يوجد مشتركون' : 'No subscribers found'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gov-card/10">
                  <tr>
                    <th className="px-6 py-4 text-start text-sm font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'تاريخ الاشتراك' : 'Subscribed At'}
                    </th>
                    <th className="px-6 py-4 text-start text-sm font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'تاريخ الإلغاء' : 'Unsubscribed At'}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'إجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gov-teal/10 flex items-center justify-center">
                            <Mail size={18} className="text-gov-teal" />
                          </div>
                          <span className="font-medium text-gov-charcoal dark:text-white">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          subscriber.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {subscriber.status === 'active'
                            ? (language === 'ar' ? 'نشط' : 'Active')
                            : (language === 'ar' ? 'ألغى الاشتراك' : 'Unsubscribed')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/70">
                        {new Date(subscriber.subscribed_at).toLocaleDateString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-white/70">
                        {subscriber.unsubscribed_at
                          ? new Date(subscriber.unsubscribed_at).toLocaleDateString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => deleteSubscriber(subscriber.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={language === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100 dark:border-gov-border/15">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <span className="text-sm text-gray-600 dark:text-white/70">
                  {language === 'ar' ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
