'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  MessageSquare,
  Loader2,
  Eye,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API } from '@/lib/repository';
import { Ticket } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function UserDashboard() {
  const { language, t } = useLanguage();
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'notifications' | 'settings'>('overview');
  const [complaints, setComplaints] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; complaint: Ticket | null }>({ open: false, complaint: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const ForwardArrow = language === 'ar' ? ChevronLeft : ChevronRight;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Set profile data from auth user
  useEffect(() => {
    if (authUser) {
      setProfileData({
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        password: ''
      });
    }
  }, [authUser]);

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      try {
        const data = await API.complaints.myComplaints();
        setComplaints(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (activeTab === 'complaints' || activeTab === 'overview') {
      fetchComplaints();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await logout();
    // AuthContext handles redirect to /login
  };

  // FR-22: Delete complaint (only if status is 'new' or 'received')
  const canDeleteComplaint = (complaint: Ticket) => {
    return complaint.status === 'new' || complaint.status === 'received';
  };

  const handleDeleteComplaint = async () => {
    if (!deleteModal.complaint) return;
    setIsDeleting(true);
    try {
      await API.complaints.delete(deleteModal.complaint.id);
      setComplaints(complaints.filter(c => c.id !== deleteModal.complaint!.id));
      setDeleteModal({ open: false, complaint: null });
    } catch (e) {
      console.error('Error deleting complaint:', e);
      alert(language === 'ar' ? 'حدث خطأ أثناء حذف الشكوى' : 'Error deleting complaint');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const data: Record<string, string> = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      };
      if (profileData.password) data.password = profileData.password;

      const updatedUser = await API.users.updateProfile(data);
      if (updatedUser) {
        alert(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
        if (profileData.password) setProfileData({ ...profileData, password: '' });
      }
    } catch (e) {
      console.error(e);
      alert(language === 'ar' ? 'حدث خطأ أثناء التحديث' : 'Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Fetch notifications when tab changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (activeTab !== 'notifications') return;
      setNotificationsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications((data.data || []).map((n: any) => ({
            id: n.id,
            title: n.data?.title || (language === 'ar' ? 'إشعار' : 'Notification'),
            message: n.data?.message || n.data?.body || '',
            time: new Date(n.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US'),
            read: !!n.read_at
          })));
        }
      } catch (e) {
        console.error('Error fetching notifications:', e);
        // Fallback to empty
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };
    fetchNotifications();
  }, [activeTab, language]);

  const stats = [
    {
      label: language === 'ar' ? 'الشكاوى النشطة' : 'Active',
      value: complaints.filter(c => c.status === 'new' || c.status === 'in_progress').length,
      icon: <Clock size={20} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: language === 'ar' ? 'تم الحل' : 'Resolved',
      value: complaints.filter(c => c.status === 'resolved').length,
      icon: <CheckCircle size={20} />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: language === 'ar' ? 'مرفوضة' : 'Rejected',
      value: complaints.filter(c => c.status === 'rejected').length,
      icon: <AlertCircle size={20} />,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    const labels: Record<string, string> = {
      new: language === 'ar' ? 'جديد' : 'New',
      in_progress: language === 'ar' ? 'قيد المعالجة' : 'In Progress',
      resolved: language === 'ar' ? 'تم الحل' : 'Resolved',
      rejected: language === 'ar' ? 'مرفوض' : 'Rejected'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles.new}`}>{labels[status] || status}</span>;
  };

  const tabs = [
    { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: <TrendingUp size={18} /> },
    { id: 'complaints', label: language === 'ar' ? 'شكاواي' : 'My Complaints', icon: <FileText size={18} /> },
    { id: 'notifications', label: language === 'ar' ? 'الإشعارات' : 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors">
      <Navbar onSearch={(q) => window.location.href = `/search?q=${encodeURIComponent(q)}`} />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                {language === 'ar' ? `مرحباً، ${authUser?.name || 'مستخدم'}` : `Welcome, ${authUser?.name || 'User'}`}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'إدارة شكاواك وإعدادات حسابك' : 'Manage your complaints and account settings'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-bold">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                    ? 'bg-gov-teal text-white shadow-lg'
                    : 'bg-white dark:bg-white/5 text-gov-charcoal dark:text-white hover:bg-gov-gold/10'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gov-gold/10">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className={`${stat.bgColor} rounded-2xl p-6 flex items-center gap-4`}>
                      <div className={`w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-gov-charcoal dark:text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Complaints */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'آخر الشكاوى' : 'Recent Complaints'}
                    </h3>
                    <Link href="/complaints" className="text-gov-teal dark:text-gov-gold font-bold text-sm flex items-center gap-1">
                      {language === 'ar' ? 'تقديم شكوى جديدة' : 'Submit New'}
                      <Plus size={16} />
                    </Link>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-gov-gold" size={32} />
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'ar' ? 'لا توجد شكاوى بعد' : 'No complaints yet'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {complaints.slice(0, 3).map((complaint) => (
                        <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                          <div className="flex-1">
                            <p className="font-bold text-gov-charcoal dark:text-white">{complaint.subject}</p>
                            <p className="text-sm text-gray-500">#{complaint.tracking_number}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(complaint.status)}
                            <Link href={`/complaints/${complaint.tracking_number}`} className="p-2 hover:bg-gov-gold/10 rounded-lg transition-colors">
                              <Eye size={18} className="text-gov-teal dark:text-gov-gold" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gov-charcoal dark:text-white">
                    {language === 'ar' ? 'جميع الشكاوى' : 'All Complaints'}
                  </h3>
                  <Link href="/complaints" className="flex items-center gap-2 px-4 py-2 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors">
                    <Plus size={18} />
                    {language === 'ar' ? 'شكوى جديدة' : 'New Complaint'}
                  </Link>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gov-gold" size={40} />
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {language === 'ar' ? 'لم تقم بتقديم أي شكاوى بعد' : 'You haven\'t submitted any complaints yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:border-gov-gold/30 transition-colors">
                        <div className="flex-1">
                          <p className="font-bold text-gov-charcoal dark:text-white mb-1">{complaint.subject}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>#{complaint.tracking_number}</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('ar-SY') : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(complaint.status)}
                          <Link href={`/complaints/${complaint.tracking_number}`} className="p-2 hover:bg-gov-gold/10 rounded-lg transition-colors" title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}>
                            <Eye size={18} className="text-gov-teal dark:text-gov-gold" />
                          </Link>
                          {/* FR-22: Delete button - only for new/received complaints */}
                          {canDeleteComplaint(complaint) && (
                            <button
                              onClick={() => setDeleteModal({ open: true, complaint })}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title={language === 'ar' ? 'حذف الشكوى' : 'Delete Complaint'}
                            >
                              <Trash2 size={18} className="text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </h3>
                {notificationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-gov-gold" size={32} />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border ${notification.read
                            ? 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10'
                            : 'bg-gov-gold/5 border-gov-gold/20'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-gov-charcoal dark:text-white">{notification.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-gov-gold rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6">
                  {language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
                </h3>
                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                      {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      value={profileData.password}
                      onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                      placeholder={language === 'ar' ? 'اتركه فارغاً للاحتفاظ بالحالي' : 'Leave empty to keep current'}
                      className="input"
                    />
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="w-full py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-colors flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Settings size={20} />}
                    {isUpdating
                      ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                      : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                    }
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal (FR-22) */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gov-forest rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                  {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'ar' ? 'هل أنت متأكد من حذف هذه الشكوى؟' : 'Are you sure you want to delete this complaint?'}
                </p>
              </div>
            </div>

            {deleteModal.complaint && (
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-6">
                <p className="font-bold text-gov-charcoal dark:text-white text-sm">
                  {deleteModal.complaint.subject}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  #{deleteModal.complaint.tracking_number}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ar'
                ? 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف الشكوى نهائياً.'
                : 'This action cannot be undone. The complaint will be permanently deleted.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, complaint: null })}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteComplaint}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}
                {isDeleting
                  ? (language === 'ar' ? 'جاري الحذف...' : 'Deleting...')
                  : (language === 'ar' ? 'حذف' : 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer
        onIncreaseFont={() => { }}
        onDecreaseFont={() => { }}
        onToggleContrast={() => { }}
      />
    </div>
  );
}
