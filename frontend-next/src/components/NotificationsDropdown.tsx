'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, X, Check, Clock, AlertCircle, CheckCircle, FileText, Shield, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API, AppNotification } from '@/lib/repository';
import Link from 'next/link';

interface NotificationsDropdownProps {
  className?: string;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await API.notifications.getAll(20);
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      // Refresh every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await API.notifications.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.notifications.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'complaint_status_change':
        return <Clock size={16} className="text-blue-500" />;
      case 'complaint_response':
        return <FileText size={16} className="text-green-500" />;
      case 'complaint_overdue':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'security_alert':
        return <Shield size={16} className="text-red-500" />;
      case 'complaint_new':
        return <Bell size={16} className="text-purple-500" />;
      default:
        return <CheckCircle size={16} className="text-gov-teal" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (language === 'ar') {
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;
      return date.toLocaleDateString('ar-SA');
    } else {
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US');
    }
  };

  const getNotificationLink = (notification: AppNotification): string | undefined => {
    if (notification.data?.tracking_number) {
      return `/complaints/${notification.data.tracking_number}`;
    }
    if (notification.data?.complaint_id) {
      return `/dashboard?tab=complaints&id=${notification.data.complaint_id}`;
    }
    return undefined;
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
        aria-label={language === 'ar' ? 'الإشعارات' : 'Notifications'}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 w-80 sm:w-96 bg-white dark:bg-dm-surface rounded-2xl shadow-2xl border border-gray-100 dark:border-gov-border/25 overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gov-border/15">
            <h3 className="font-bold text-gov-charcoal dark:text-white">
              {language === 'ar' ? 'الإشعارات' : 'Notifications'}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-gov-teal dark:text-gov-teal font-bold hover:underline"
              >
                {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Loader2 size={32} className="mx-auto mb-2 animate-spin" />
                <p>{language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const link = getNotificationLink(notification);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                      !notification.is_read ? 'bg-gov-gold/5 dark:bg-gov-emerald/10' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-sm text-gov-charcoal dark:text-white truncate">
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                              title={language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                            >
                              <Check size={14} className="text-gov-teal dark:text-gov-teal" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-white/70 line-clamp-2">
                          {notification.body}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{formatTime(notification.created_at)}</span>
                          {link && (
                            <Link
                              href={link}
                              onClick={() => {
                                markAsRead(notification.id);
                                setIsOpen(false);
                              }}
                              className="text-xs text-gov-teal dark:text-gov-teal font-bold hover:underline"
                            >
                              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gov-border/15 bg-gray-50 dark:bg-gov-card/10">
            <Link
              href="/dashboard?tab=notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm font-bold text-gov-teal dark:text-gov-teal hover:underline"
            >
              {language === 'ar' ? 'عرض جميع الإشعارات' : 'View All Notifications'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
