'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Filter,
  Loader2,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Users,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SkeletonCard, SkeletonList } from '@/components/SkeletonLoader';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  today: number;
}

export default function AdminNotificationsPage() {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ total: 0, unread: 0, read: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Broadcast notification state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filterType]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/notifications?filter=${filterType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data || []);
        setStats(data.stats || { total: 0, unread: 0, read: 0, today: 0 });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use mock data for development
      setNotifications([
        {
          id: '1',
          type: 'complaint_status',
          title: language === 'ar' ? 'شكوى جديدة' : 'New Complaint',
          message: language === 'ar' ? 'تم استلام شكوى جديدة رقم #12345' : 'New complaint #12345 received',
          data: { complaint_id: 12345 },
          read_at: null,
          created_at: new Date().toISOString(),
          user: { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@example.com' }
        },
        {
          id: '2',
          type: 'system',
          title: language === 'ar' ? 'تحديث النظام' : 'System Update',
          message: language === 'ar' ? 'تم تحديث النظام بنجاح' : 'System updated successfully',
          data: {},
          read_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          type: 'suggestion',
          title: language === 'ar' ? 'مقترح جديد' : 'New Suggestion',
          message: language === 'ar' ? 'تم تقديم مقترح جديد للمراجعة' : 'New suggestion submitted for review',
          data: { suggestion_id: 456 },
          read_at: null,
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
      setStats({ total: 3, unread: 2, read: 1, today: 2 });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ));
      setStats({ ...stats, unread: stats.unread - 1, read: stats.read + 1 });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/v1/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setStats({ ...stats, unread: 0, read: stats.total });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الإشعار؟' : 'Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setNotifications(notifications.filter(n => n.id !== id));
      setStats({ ...stats, total: stats.total - 1 });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastTitle || !broadcastMessage) {
      alert(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/admin/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage
        })
      });

      if (res.ok) {
        alert(language === 'ar' ? 'تم إرسال الإشعار بنجاح' : 'Notification broadcast successfully');
        setShowBroadcastModal(false);
        setBroadcastTitle('');
        setBroadcastMessage('');
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      alert(language === 'ar' ? 'فشل إرسال الإشعار' : 'Failed to broadcast notification');
    } finally {
      setIsSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint_status':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'system':
        return <Bell size={16} className="text-blue-500" />;
      case 'suggestion':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      complaint_status: { ar: 'شكوى', en: 'Complaint' },
      system: { ar: 'نظام', en: 'System' },
      suggestion: { ar: 'مقترح', en: 'Suggestion' },
      user: { ar: 'مستخدم', en: 'User' }
    };
    return language === 'ar' ? labels[type]?.ar || type : labels[type]?.en || type;
  };

  const filteredNotifications = notifications.filter(n => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query);
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
              {language === 'ar' ? 'إدارة الإشعارات' : 'Notifications Management'}
            </h1>
            <p className="text-gray-500 dark:text-white/70 mt-1">
              {language === 'ar' ? 'إدارة ومراقبة إشعارات النظام' : 'Manage and monitor system notifications'}
            </p>
          </div>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gov-teal text-white font-bold rounded-2xl hover:bg-gov-emerald transition-all shadow-lg"
          >
            <Send size={20} />
            {language === 'ar' ? 'إرسال إشعار جماعي' : 'Broadcast Notification'}
          </button>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} className="p-5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Bell size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.total}</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'إجمالي الإشعارات' : 'Total Notifications'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Clock size={24} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.unread}</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'غير مقروء' : 'Unread'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.read}</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'مقروء' : 'Read'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-5 border border-gray-100 dark:border-gov-border/15">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Users size={24} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stats.today}</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'اليوم' : 'Today'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث في الإشعارات...' : 'Search notifications...'}
              className="w-full pl-12 rtl:pl-4 rtl:pr-12 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'unread' | 'read')}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            >
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="unread">{language === 'ar' ? 'غير مقروء' : 'Unread'}</option>
              <option value="read">{language === 'ar' ? 'مقروء' : 'Read'}</option>
            </select>
          </div>

          <button
            onClick={fetchNotifications}
            className="p-3 bg-white dark:bg-gov-card/10 rounded-xl border border-gray-200 dark:border-gov-border/15 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            title={language === 'ar' ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw size={20} className="text-gray-500" />
          </button>

          {stats.unread > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-3 bg-gov-gold/10 text-gov-gold font-bold rounded-xl hover:bg-gov-gold/20 transition-colors"
            >
              {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All as Read'}
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gov-card/10 rounded-3xl border border-gray-100 dark:border-gov-border/15 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <SkeletonList rows={6} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-300 dark:text-white/70 mb-4" />
            <p className="text-gray-500 dark:text-white/70">
              {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications found'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                  !notification.read_at ? 'bg-gov-gold/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gov-charcoal dark:text-white">
                          {notification.title}
                        </h4>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70">
                          {getTypeLabel(notification.type)}
                        </span>
                        {!notification.read_at && (
                          <span className="w-2 h-2 bg-gov-gold rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-white/70 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(notification.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}</span>
                        {notification.user && (
                          <span>{notification.user.full_name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read_at && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title={language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                      >
                        <Eye size={18} className="text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title={language === 'ar' ? 'حذف' : 'Delete'}
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dm-surface rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-4">
              {language === 'ar' ? 'إرسال إشعار جماعي' : 'Broadcast Notification'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-white/70 mb-6">
              {language === 'ar'
                ? 'سيتم إرسال هذا الإشعار لجميع المستخدمين'
                : 'This notification will be sent to all users'}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'العنوان' : 'Title'}
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder={language === 'ar' ? 'عنوان الإشعار' : 'Notification title'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder={language === 'ar' ? 'نص الإشعار' : 'Notification message'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleBroadcast}
                disabled={isSending}
                className="flex-1 py-3 px-4 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
                {isSending
                  ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                  : (language === 'ar' ? 'إرسال' : 'Send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
