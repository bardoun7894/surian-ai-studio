'use client';

import React, { useState, useEffect } from 'react';
import {
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
  Loader2,
  Eye,
  Plus,
  Trash2,
  AlertTriangle,
  Lightbulb,
  CheckCheck,
  Heart,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API } from '@/lib/repository';
import { Ticket, Suggestion, Favorite } from '@/types';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPhoneHelperText, detectCountryRule, normalizePhoneWithCountryCode } from '@/lib/phone';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

export default function UserDashboard() {
  const { language } = useLanguage();
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'suggestions' | 'favorites' | 'notifications' | 'settings'>('overview');
  const [complaints, setComplaints] = useState<Ticket[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({ first_name: '', father_name: '', last_name: '', email: '', phone: '', birth_date: '', governorate: '', current_password: '', password: '', password_confirmation: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; complaint: Ticket | null }>({ open: false, complaint: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({});
  const [notifPrefsLoading, setNotifPrefsLoading] = useState(false);
  const [notifPrefsSaving, setNotifPrefsSaving] = useState(false);

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
        first_name: authUser.first_name || '',
        father_name: authUser.father_name || '',
        last_name: authUser.last_name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        birth_date: authUser.birth_date ? new Date(authUser.birth_date).toISOString().split('T')[0] : '',
        governorate: authUser.governorate || '',
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    }
  }, [authUser]);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!isAuthenticated) return;
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
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isAuthenticated) return;
      if (activeTab !== 'suggestions' && activeTab !== 'overview') return;
      setSuggestionsLoading(true);
      try {
        const data = await API.suggestions.mySuggestions();
        setSuggestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return;
      if (activeTab !== 'notifications') return;
      setNotificationsLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/v1/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications((data.data || []).map((n: { id: string; data?: { title?: string; message?: string; body?: string }; created_at: string; read_at?: string }) => ({
            id: n.id,
            title: n.data?.title || (language === 'ar' ? 'إشعار' : 'Notification'),
            message: n.data?.message || n.data?.body || '',
            time: new Date(n.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US'),
            read: !!n.read_at
          })));
        }
      } catch (e) {
        console.error('Error fetching notifications:', e);
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };
    fetchNotifications();
  }, [activeTab, language, isAuthenticated]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      if (activeTab !== 'favorites' && activeTab !== 'overview') return;
      setFavoritesLoading(true);
      try {
        const data = await API.favorites.list();
        setFavorites(data);
      } catch (e) {
        console.error('Error fetching favorites:', e);
      } finally {
        setFavoritesLoading(false);
      }
    };
    fetchFavorites();
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    const fetchNotifPrefs = async () => {
      if (!isAuthenticated || activeTab !== 'settings') return;
      setNotifPrefsLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/v1/user/notification-preferences', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifPrefs(data.preferences || data.data || {});
        }
      } catch (e) { console.error('Failed to fetch notification preferences:', e); }
      finally { setNotifPrefsLoading(false); }
    };
    fetchNotifPrefs();
  }, [activeTab, isAuthenticated]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-dm-bg">
        <Loader2 className="animate-spin text-gov-gold" size={48} />
      </div>
    );
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-dm-bg">
        <Loader2 className="animate-spin text-gov-gold" size={48} />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  const c_delete = (complaint: Ticket) => {
    return complaint.status === 'new' || complaint.status === 'received';
  };

  const handleDeleteComplaint = async () => {
    if (!deleteModal.complaint) return;
    setIsDeleting(true);
    try {
      const success = await API.complaints.delete(deleteModal.complaint.id);
      if (success) {
        setComplaints(complaints.filter(c => c.id !== deleteModal.complaint!.id));
        setDeleteModal({ open: false, complaint: null });
        toast.success(language === 'ar' ? 'تم حذف الشكوى بنجاح' : 'Complaint deleted successfully');
      } else {
        toast.error(language === 'ar' ? 'فشل حذف الشكوى' : 'Failed to delete complaint');
      }
    } catch (e) {
      console.error('Error deleting complaint:', e);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء حذف الشكوى' : 'Error deleting complaint');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateProfile = async () => {
    // Validate password fields if user wants to change password
    if (profileData.password) {
      if (!profileData.current_password) {
        alert(language === 'ar' ? 'يرجى إدخال كلمة المرور الحالية' : 'Please enter your current password');
        return;
      }
      if (profileData.password !== profileData.password_confirmation) {
        alert(language === 'ar' ? 'كلمة المرور الجديدة وتأكيدها غير متطابقين' : 'New password and confirmation do not match');
        return;
      }
      if (profileData.password.length < 8) {
        alert(language === 'ar' ? 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' : 'New password must be at least 8 characters');
        return;
      }
    }

    setIsUpdating(true);
    try {
      const data: Record<string, string> = {
        first_name: profileData.first_name,
        father_name: profileData.father_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone,
        birth_date: profileData.birth_date,
        governorate: profileData.governorate,
      };
      if (profileData.password) {
        data.current_password = profileData.current_password;
        data.password = profileData.password;
        data.password_confirmation = profileData.password_confirmation;
      }

      const updatedUser = await API.users.updateProfile(data);
      if (updatedUser) {
        alert(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
        if (profileData.password) setProfileData({ ...profileData, current_password: '', password: '', password_confirmation: '' });
      }
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || (language === 'ar' ? 'حدث خطأ أثناء التحديث' : 'Error updating profile');
      alert(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/v1/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
      }
    } catch (e) {
      console.error('Error marking notification read:', e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/v1/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error('Error marking all read:', e);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/v1/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (e) {
      console.error('Error deleting notification:', e);
    }
  };

  const handleRemoveFavorite = async (fav: Favorite) => {
    try {
      const success = await API.favorites.remove(fav.content_type, fav.content_id);
      if (success) {
        setFavorites(prev => prev.filter(f => f.id !== fav.id));
      }
    } catch (e) {
      console.error('Error removing favorite:', e);
    }
  };

  const getFavoriteTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      news: language === 'ar' ? 'أخبار' : 'News',
      announcement: language === 'ar' ? 'إعلان' : 'Announcement',
      service: language === 'ar' ? 'خدمة' : 'Service',
      services: language === 'ar' ? 'خدمة' : 'Service',
      law: language === 'ar' ? 'قانون' : 'Law',
      decree: language === 'ar' ? 'مرسوم' : 'Decree',
      decrees: language === 'ar' ? 'مرسوم' : 'Decree',
    };
    return labels[type] || type;
  };

  const getFavoriteUrl = (fav: Favorite) => {
    if (fav.metadata?.url) return fav.metadata.url;
    const typeRoutes: Record<string, string> = {
      news: 'news',
      announcement: 'announcements',
      service: 'services',
      services: 'services',
      law: 'decrees',
      decree: 'decrees',
      decrees: 'decrees',
    };
    return `/${typeRoutes[fav.content_type] || fav.content_type}/${fav.content_id}`;
  };

  const handleSaveNotifPrefs = async () => {
    setNotifPrefsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/v1/user/notification-preferences', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ preferences: notifPrefs })
      });
      if (res.ok) {
        alert(language === 'ar' ? 'تم حفظ تفضيلات الإشعارات' : 'Notification preferences saved');
      }
    } catch (e) { console.error('Error saving notification preferences:', e); }
    finally { setNotifPrefsSaving(false); }
  };

  const stats = [
    {
      label: language === 'ar' ? 'الشكاوى النشطة' : 'Active',
      value: complaints.filter(c => c.status === 'new' || c.status === 'in_progress').length,
      icon: <Clock size={24} />,
      color: 'text-gov-teal',
      bgColor: 'bg-white/60 dark:bg-gov-card/10 border border-gov-teal/20'
    },
    {
      label: language === 'ar' ? 'تم الحل' : 'Resolved',
      value: complaints.filter(c => c.status === 'resolved').length,
      icon: <CheckCircle size={24} />,
      color: 'text-gov-gold',
      bgColor: 'bg-white/60 dark:bg-gov-card/10 border border-gov-gold/20'
    },
    {
      label: language === 'ar' ? 'مرفوضة' : 'Rejected',
      value: complaints.filter(c => c.status === 'rejected').length,
      icon: <AlertCircle size={24} />,
      color: 'text-red-500',
      bgColor: 'bg-white/60 dark:bg-gov-card/10 border border-red-500/20'
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-gov-gold/20 text-gov-gold border-gov-gold/40',
      in_progress: 'bg-gov-teal/20 text-gov-teal border-gov-teal/40',
      resolved: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/40',
      rejected: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40'
    };
    const labels: Record<string, string> = {
      new: language === 'ar' ? 'جديد' : 'New',
      in_progress: language === 'ar' ? 'قيد المعالجة' : 'In Progress',
      resolved: language === 'ar' ? 'تم الحل' : 'Resolved',
      rejected: language === 'ar' ? 'مرفوض' : 'Rejected'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.new}`}>{labels[status] || status}</span>;
  };

  const getSuggestionStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-gov-gold/20 text-gov-gold border-gov-gold/40',
      reviewed: 'bg-gov-teal/20 text-gov-teal border-gov-teal/40',
      approved: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/40',
      rejected: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40'
    };
    const labels: Record<string, string> = {
      pending: language === 'ar' ? 'قيد الانتظار' : 'Pending',
      reviewed: language === 'ar' ? 'تمت المراجعة' : 'Reviewed',
      approved: language === 'ar' ? 'مقبول' : 'Approved',
      rejected: language === 'ar' ? 'مرفوض' : 'Rejected'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>{labels[status] || status}</span>;
  };

  const tabs = [
    { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: <TrendingUp size={18} /> },
    { id: 'complaints', label: language === 'ar' ? 'شكاواي' : 'My Complaints', icon: <FileText size={18} /> },
    { id: 'suggestions', label: language === 'ar' ? 'اقتراحاتي' : 'My Suggestions', icon: <Lightbulb size={18} /> },
    { id: 'favorites', label: language === 'ar' ? 'المفضلة' : 'Favorites', icon: <Heart size={18} /> },
    { id: 'notifications', label: language === 'ar' ? 'الإشعارات' : 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors font-sans">
      <Navbar onSearch={(q) => window.location.href = `/search?q=${encodeURIComponent(q)}`} />

      <main className="flex-grow pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                {language === 'ar' ? `مرحباً، ${authUser?.first_name || 'مستخدم'}` : `Welcome, ${authUser?.first_name || 'User'}`}
              </h1>
              <p className="text-gov-stone dark:text-white/70 text-lg">
                {language === 'ar' ? 'إدارة شكاواك واقتراحاتك وإعدادات حسابك' : 'Manage your complaints, suggestions, and account settings'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500/20 transition-colors backdrop-blur-sm border border-red-500/20"
            >
              <LogOut size={20} />
              <span className="font-bold">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
            </motion.button>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm ${activeTab === tab.id
                  ? 'bg-gov-teal text-white shadow-lg border border-gov-teal ring-2 ring-gov-teal/20'
                  : 'glass-card text-gov-charcoal dark:text-white hover:bg-white dark:hover:bg-white/10'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gov-gold/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gov-teal/5 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
                  {/* Complaint Stats */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="text-gov-gold" />
                      {language === 'ar' ? 'إحصائيات الشكاوى' : 'Complaint Stats'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {stats.map((stat, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          className={`${stat.bgColor} rounded-2xl p-6 flex items-center gap-5 shadow-sm`}
                        >
                          <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center ${stat.color} shadow-inner`}>
                            {stat.icon}
                          </div>
                          <div>
                            <p className="text-4xl font-display font-bold text-gov-charcoal dark:text-white">{stat.value}</p>
                            <p className="text-sm font-bold text-gov-stone dark:text-white/70 uppercase tracking-wide">{stat.label}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Suggestion Stats */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                      <Lightbulb className="text-gov-gold" />
                      {language === 'ar' ? 'إحصائيات الاقتراحات' : 'Suggestion Stats'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: language === 'ar' ? 'الإجمالي' : 'Total', value: suggestions.length, color: 'text-gov-teal', bgColor: 'bg-white/50 dark:bg-gov-card/10 border border-gov-teal/20', icon: <Lightbulb size={22} /> },
                        { label: language === 'ar' ? 'قيد الانتظار' : 'Pending', value: suggestions.filter(s => s.status === 'pending').length, color: 'text-gov-gold', bgColor: 'bg-white/50 dark:bg-gov-card/10 border border-gov-gold/20', icon: <Clock size={22} /> },
                        { label: language === 'ar' ? 'مقبولة' : 'Approved', value: suggestions.filter(s => s.status === 'approved').length, color: 'text-green-500', bgColor: 'bg-white/50 dark:bg-gov-card/10 border border-green-500/20', icon: <CheckCircle size={22} /> },
                        { label: language === 'ar' ? 'مرفوضة' : 'Rejected', value: suggestions.filter(s => s.status === 'rejected').length, color: 'text-red-500', bgColor: 'bg-white/50 dark:bg-gov-card/10 border border-red-500/20', icon: <AlertCircle size={22} /> },
                      ].map((stat, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.03 }}
                          className={`${stat.bgColor} rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-3 shadow-sm text-center sm:text-right`}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center ${stat.color} shadow-sm mb-2 sm:mb-0`}>
                            {stat.icon}
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gov-charcoal dark:text-white">{stat.value}</p>
                            <p className="text-xs font-bold text-gov-stone dark:text-white/70">{stat.label}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white mb-6">
                      {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Link href="/complaints" className="group">
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex items-center gap-4 p-6 bg-gov-teal text-white rounded-2xl shadow-lg shadow-gov-teal/20 hover:shadow-xl hover:shadow-gov-teal/30 transition-all"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                            <FileText size={24} />
                          </div>
                          <div>
                            <span className="block font-bold text-lg">{language === 'ar' ? 'تقديم شكوى' : 'Submit Complaint'}</span>
                            <span className="text-xs text-white/80">{language === 'ar' ? 'رفع بلاغ جديد' : 'Report a new issue'}</span>
                          </div>
                        </motion.div>
                      </Link>
                      <Link href="/suggestions" className="group">
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex items-center gap-4 p-6 bg-gov-gold text-gov-forest rounded-2xl shadow-lg shadow-gov-gold/20 hover:shadow-xl hover:shadow-gov-gold/30 transition-all"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gov-forest/10 flex items-center justify-center text-gov-forest backdrop-blur-sm">
                            <Lightbulb size={24} />
                          </div>
                          <div>
                            <span className="block font-bold text-lg">{language === 'ar' ? 'تقديم اقتراح' : 'Submit Suggestion'}</span>
                            <span className="text-xs text-gov-forest/80">{language === 'ar' ? 'شاركنا أفكارك' : 'Share your ideas'}</span>
                          </div>
                        </motion.div>
                      </Link>
                      <Link href="/complaints/track" className="group">
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="flex items-center gap-4 p-6 bg-white dark:bg-white/10 border border-gray-200 dark:border-gov-border/25 rounded-2xl shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gov-stone/10 dark:bg-white/10 flex items-center justify-center text-gov-stone dark:text-white backdrop-blur-sm">
                            <Eye size={24} />
                          </div>
                          <div>
                            <span className="block font-bold text-lg text-gov-charcoal dark:text-white">{language === 'ar' ? 'تتبع الحالة' : 'Track Status'}</span>
                            <span className="text-xs text-gray-500 dark:text-white/70">{language === 'ar' ? 'تابع شكاواك' : 'Follow up on complaints'}</span>
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Recent Complaints */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-display font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'آخر الشكاوى' : 'Recent Complaints'}
                      </h3>
                      <Link href="/complaints/track" className="text-gov-teal dark:text-gov-gold font-bold text-sm flex items-center gap-1 hover:underline">
                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                        <ForwardArrow size={16} />
                      </Link>
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-gov-gold" size={32} />
                      </div>
                    ) : complaints.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gov-border/15 rounded-2xl">
                        <p className="text-gray-500 font-bold">
                          {language === 'ar' ? 'لا توجد شكاوى بعد' : 'No complaints yet'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {complaints.slice(0, 3).map((complaint) => (
                          <motion.div
                            layout
                            key={complaint.id}
                            className="group flex items-center justify-between p-5 bg-white/60 dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gov-gold/50 transition-colors shadow-sm"
                          >
                            <div className="flex-1">
                              <p className="font-bold text-lg text-gov-charcoal dark:text-white mb-1 group-hover:text-gov-teal transition-colors">{complaint.subject}</p>
                              <p className="text-sm text-gray-500 font-mono">#{complaint.tracking_number}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {getStatusBadge(complaint.status)}
                              <Link href={`/complaints/${complaint.tracking_number}`} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/70 hover:bg-gov-teal hover:text-white transition-all transform hover:rotate-12">
                                <Eye size={20} />
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Recent Favorites */}
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-display font-bold text-gov-charcoal dark:text-white flex items-center gap-2">
                        <Heart size={20} className="text-gov-gold fill-gov-gold" />
                        {language === 'ar' ? 'المفضلة' : 'Favorites'}
                        {favorites.length > 0 && (
                          <span className="text-sm font-normal text-gov-stone dark:text-white/50">({favorites.length})</span>
                        )}
                      </h3>
                      <button
                        onClick={() => setActiveTab('favorites')}
                        className="text-gov-teal dark:text-gov-gold font-bold text-sm flex items-center gap-1 hover:underline"
                      >
                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                        <ForwardArrow size={16} />
                      </button>
                    </div>

                    {favoritesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-gov-gold" size={32} />
                      </div>
                    ) : favorites.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gov-border/15 rounded-2xl">
                        <Heart size={32} className="mx-auto text-gray-300 dark:text-white/20 mb-3" />
                        <p className="text-gray-500 font-bold">
                          {language === 'ar' ? 'لا توجد عناصر مفضلة بعد' : 'No favorites yet'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {favorites.slice(0, 3).map((fav) => (
                          <motion.div
                            key={fav.id}
                            whileHover={{ y: -3 }}
                            className="group bg-white/60 dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gov-gold/50 transition-all overflow-hidden shadow-sm"
                          >
                            {fav.metadata?.image && (
                              <div className="h-32 overflow-hidden">
                                <img
                                  src={fav.metadata.image}
                                  alt={fav.metadata.title || ''}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <span className="px-2 py-0.5 rounded-full bg-gov-teal/10 text-gov-teal text-xs font-bold">
                                {getFavoriteTypeLabel(fav.content_type)}
                              </span>
                              <h4 className="font-bold text-gov-charcoal dark:text-white mt-2 line-clamp-1 group-hover:text-gov-teal transition-colors">
                                {fav.metadata?.title || (language === 'ar' ? 'عنصر مفضل' : 'Favorite Item')}
                              </h4>
                              <Link
                                href={getFavoriteUrl(fav)}
                                className="mt-3 flex items-center gap-1 text-sm font-bold text-gov-teal dark:text-gov-gold hover:underline"
                              >
                                {language === 'ar' ? 'عرض' : 'View'}
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Complaints Tab */}
              {activeTab === 'complaints' && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'جميع الشكاوى' : 'All Complaints'}
                    </h3>
                    <Link href="/complaints" className="flex items-center gap-2 px-5 py-2.5 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors shadow-lg shadow-gov-teal/20">
                      <Plus size={20} />
                      {language === 'ar' ? 'شكوى جديدة' : 'New Complaint'}
                    </Link>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-gov-gold" size={40} />
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 dark:bg-gov-card/10 rounded-3xl border border-gray-100 dark:border-gov-border/15">
                      <FileText size={64} className="mx-auto text-gov-gold/40 mb-4" />
                      <p className="text-gray-500 dark:text-white/70 text-lg font-bold">
                        {language === 'ar' ? 'لم تقم بتقديم أي شكاوى بعد' : 'You haven\'t submitted any complaints yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {complaints.map((complaint) => (
                        <motion.div
                          variants={itemVariants}
                          key={complaint.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex-1 mb-4 md:mb-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-lg text-gov-charcoal dark:text-white">{complaint.subject}</p>
                              {complaint.is_urgent && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                                  {language === 'ar' ? 'عاجل' : 'Urgent'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-5 text-sm text-gray-500 dark:text-white/70">
                              <span className="font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">#{complaint.tracking_number}</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('ar-SY') : '-'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(complaint.status)}
                            <div className="flex items-center gap-2">
                              <Link href={`/complaints/${complaint.tracking_number}`} className="p-2.5 bg-gray-50 dark:bg-white/10 rounded-xl hover:bg-gov-teal hover:text-white transition-colors text-gray-600 dark:text-white/70" title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}>
                                <Eye size={20} />
                              </Link>
                              {c_delete(complaint) && (
                                <button
                                  onClick={() => setDeleteModal({ open: true, complaint })}
                                  className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                  title={language === 'ar' ? 'حذف الشكوى' : 'Delete Complaint'}
                                >
                                  <Trash2 size={20} />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Suggestions Tab */}
              {activeTab === 'suggestions' && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'جميع الاقتراحات' : 'All Suggestions'}
                    </h3>
                    <Link href="/suggestions" className="flex items-center gap-2 px-5 py-2.5 bg-gov-gold text-gov-forest rounded-xl font-bold hover:bg-gov-sand transition-colors shadow-lg shadow-gov-gold/20">
                      <Plus size={20} />
                      {language === 'ar' ? 'اقتراح جديد' : 'New Suggestion'}
                    </Link>
                  </div>

                  {suggestionsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-gov-gold" size={40} />
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 dark:bg-gov-card/10 rounded-3xl border border-gray-100 dark:border-gov-border/15">
                      <Lightbulb size={64} className="mx-auto text-gov-gold/40 mb-4" />
                      <p className="text-gray-500 dark:text-white/70 text-lg font-bold">
                        {language === 'ar' ? 'لم تقم بتقديم أي اقتراحات بعد' : 'You haven\'t submitted any suggestions yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {suggestions.map((suggestion) => (
                        <motion.div
                          variants={itemVariants}
                          key={suggestion.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/50 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex-1 mb-4 md:mb-0">
                            <p className="font-bold text-lg text-gov-charcoal dark:text-white mb-2 line-clamp-1">
                              {suggestion.description}
                            </p>
                            <div className="flex items-center gap-5 text-sm text-gray-500 dark:text-white/70">
                              <span className="font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">#{suggestion.tracking_number}</span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(suggestion.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {getSuggestionStatusBadge(suggestion.status)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white flex items-center gap-2">
                      <Heart className="text-gov-gold fill-gov-gold" size={24} />
                      {language === 'ar' ? 'المفضلة' : 'My Favorites'}
                    </h3>
                    <Link href="/news" className="flex items-center gap-2 px-5 py-2.5 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors shadow-lg shadow-gov-teal/20">
                      <Plus size={20} />
                      {language === 'ar' ? 'تصفح المحتوى' : 'Browse Content'}
                    </Link>
                  </div>

                  {favoritesLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-gov-gold" size={40} />
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 dark:bg-gov-card/10 rounded-3xl border border-gray-100 dark:border-gov-border/15">
                      <Heart size={64} className="mx-auto text-gov-gold/40 mb-4" />
                      <p className="text-gray-500 dark:text-white/70 text-lg font-bold">
                        {language === 'ar' ? 'قائمة المفضلة فارغة حالياً' : 'Your favorites list is currently empty'}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-white/50 mt-2 max-w-md mx-auto">
                        {language === 'ar'
                          ? 'يمكنك إضافة الأخبار والخدمات والقرارات إلى المفضلة للوصول إليها بسرعة هنا.'
                          : 'You can add news, services, and decrees to your favorites to access them quickly here.'}
                      </p>
                      <Link href="/news" className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-gov-teal/10 text-gov-teal rounded-xl font-bold hover:bg-gov-teal hover:text-white transition-all">
                        {language === 'ar' ? 'تصفح الأخبار' : 'Browse News'}
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((fav) => (
                        <motion.div
                          variants={itemVariants}
                          key={fav.id}
                          className="group relative bg-white dark:bg-gov-card/10 border border-gray-100 dark:border-gov-border/15 rounded-2xl overflow-hidden hover:border-gov-gold/50 hover:shadow-lg transition-all duration-300"
                        >
                          {/* Image */}
                          {fav.metadata?.image && (
                            <div className="h-44 overflow-hidden relative">
                              <img
                                src={fav.metadata.image}
                                alt={fav.metadata.title || ''}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                          )}

                          <div className="p-5">
                            {/* Type Badge & Remove Button */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 rounded-full bg-gov-teal/10 text-gov-teal text-xs font-bold">
                                {getFavoriteTypeLabel(fav.content_type)}
                              </span>
                              <button
                                onClick={() => handleRemoveFavorite(fav)}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors"
                                title={language === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
                              >
                                <Heart size={18} className="fill-current" />
                              </button>
                            </div>

                            {/* Title */}
                            <h4 className="font-bold text-lg text-gov-charcoal dark:text-white mb-2 line-clamp-2 group-hover:text-gov-teal transition-colors">
                              {fav.metadata?.title || (language === 'ar' ? 'عنصر مفضل' : 'Favorite Item')}
                            </h4>

                            {/* Description */}
                            {fav.metadata?.description && (
                              <p className="text-sm text-gray-500 dark:text-white/60 line-clamp-2 mb-4">
                                {fav.metadata.description}
                              </p>
                            )}

                            {/* Date */}
                            <p className="text-xs text-gray-400 dark:text-white/40 flex items-center gap-1 mb-4">
                              <Calendar size={12} />
                              {new Date(fav.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US')}
                            </p>

                            {/* View Details Button */}
                            <Link
                              href={getFavoriteUrl(fav)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-white/5 text-gov-charcoal dark:text-white rounded-xl text-sm font-bold hover:bg-gov-teal hover:text-white transition-all"
                            >
                              <ExternalLink size={14} />
                              {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                    </h3>
                    {notifications.some(n => !n.read) && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gov-teal dark:text-gov-gold hover:bg-gov-teal/10 dark:hover:bg-gov-gold/10 rounded-xl transition-colors"
                      >
                        <CheckCheck size={18} />
                        {language === 'ar' ? 'قراءة الكل' : 'Mark All Read'}
                      </button>
                    )}
                  </div>
                  {notificationsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-gov-gold" size={32} />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 dark:bg-gov-card/10 rounded-3xl border border-gray-100 dark:border-gov-border/15">
                      <Bell size={64} className="mx-auto text-gov-gold/40 mb-4" />
                      <p className="text-gray-500 dark:text-white/70 text-lg font-bold">
                        {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <motion.div
                          variants={itemVariants}
                          key={notification.id}
                          className={`p-6 rounded-2xl border transition-all ${notification.read
                            ? 'bg-white dark:bg-gov-card/10 border-gray-100 dark:border-gov-border/15'
                            : 'bg-gov-gold/5 border-gov-gold/30 shadow-md'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-gov-gold/20 text-gov-gold'}`}>
                                <Bell size={20} />
                              </div>
                              <div>
                                <p className={`font-bold text-lg ${notification.read ? 'text-gray-700 dark:text-white/70' : 'text-gov-charcoal dark:text-white'}`}>{notification.title}</p>
                                <p className="text-gray-600 dark:text-white/70 mt-1 leading-relaxed">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                                  <Clock size={12} />
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkRead(notification.id)}
                                  className="p-1.5 rounded-lg hover:bg-gov-teal/10 text-gov-teal dark:text-gov-gold transition-colors"
                                  title={language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                                >
                                  <CheckCheck size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                                title={language === 'ar' ? 'حذف' : 'Delete'}
                              >
                                <Trash2 size={16} />
                              </button>
                              {!notification.read && (
                                <span className="w-3 h-3 bg-gov-gold rounded-full shadow-lg shadow-gov-gold/50"></span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <h3 className="text-2xl font-display font-bold text-gov-charcoal dark:text-white mb-8">
                    {language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
                  </h3>
                  <div className="max-w-xl mx-auto space-y-8 bg-white/50 dark:bg-gov-card/10 p-8 rounded-3xl border border-gray-100 dark:border-gov-border/15">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                          {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                        </label>
                        <input
                          type="text"
                          value={profileData.first_name}
                          onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                          {language === 'ar' ? 'اسم الأب' : 'Father Name'}
                        </label>
                        <input
                          type="text"
                          value={profileData.father_name}
                          onChange={(e) => setProfileData({ ...profileData, father_name: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                          {language === 'ar' ? 'الكنية' : 'Last Name'}
                        </label>
                        <input
                          type="text"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder={getPhoneHelperText(detectCountryRule(normalizePhoneWithCountryCode(profileData.phone))?.code || '+963')}
                        className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white placeholder:font-normal"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                          {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}
                        </label>
                        <input
                          type="date"
                          value={profileData.birth_date}
                          onChange={(e) => setProfileData({ ...profileData, birth_date: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                          {language === 'ar' ? 'المحافظة' : 'Governorate'}
                        </label>
                        <select
                          value={profileData.governorate}
                          onChange={(e) => setProfileData({ ...profileData, governorate: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white appearance-none"
                        >
                          <option value="">{language === 'ar' ? 'اختر المحافظة' : 'Select governorate'}</option>
                          {['دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس', 'دير الزور', 'الحسكة', 'الرقة', 'إدلب', 'درعا', 'السويداء', 'القنيطرة'].map((gov) => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {authUser?.national_id && (
                      <div>
                        <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                          {language === 'ar' ? 'الرقم الوطني' : 'National ID'}
                        </label>
                        <input
                          type="text"
                          value={authUser.national_id}
                          readOnly
                          className="w-full px-5 py-3.5 rounded-xl bg-gray-100 dark:bg-gov-card/10 border border-gov-gold/20 dark:border-gov-border/15 outline-none font-bold text-gov-charcoal dark:text-white cursor-default"
                        />
                        <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'الرقم الوطني لا يمكن تغييره' : 'National ID cannot be changed'}</p>
                      </div>
                    )}
                    {/* Password Change Section */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gov-border/15">
                      <h4 className="text-lg font-display font-bold text-gov-charcoal dark:text-white mb-4">
                        {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-white/50 mb-4">
                        {language === 'ar' ? 'اترك الحقول فارغة إذا كنت لا تريد تغيير كلمة المرور' : 'Leave fields empty if you don\'t want to change your password'}
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                            {language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                          </label>
                          <input
                            type="password"
                            value={profileData.current_password}
                            onChange={(e) => setProfileData({ ...profileData, current_password: e.target.value })}
                            placeholder={language === 'ar' ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                            className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20 outline-none transition-all font-bold text-gov-charcoal dark:text-white placeholder:font-normal"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                            {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                          </label>
                          <input
                            type="password"
                            value={profileData.password}
                            onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                            placeholder={language === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                            className={`w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border outline-none transition-all font-bold text-gov-charcoal dark:text-white placeholder:font-normal
                              ${profileData.password && profileData.password.length >= 8
                                ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                : profileData.password && profileData.password.length > 0 && profileData.password.length < 8
                                    ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                    : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gov-charcoal dark:text-gov-teal mb-3 ml-1">
                            {language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                          </label>
                          <input
                            type="password"
                            value={profileData.password_confirmation}
                            onChange={(e) => setProfileData({ ...profileData, password_confirmation: e.target.value })}
                            placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور الجديدة' : 'Re-enter new password'}
                            className={`w-full px-5 py-3.5 rounded-xl bg-white dark:bg-dm-surface border outline-none transition-all font-bold text-gov-charcoal dark:text-white placeholder:font-normal
                              ${profileData.password_confirmation && profileData.password_confirmation === profileData.password && profileData.password.length >= 8
                                ? 'border-green-500 dark:border-gov-emerald focus:border-green-500 dark:focus:border-gov-emerald focus:ring-2 focus:ring-green-500/20 dark:focus:ring-gov-emerald/20'
                                : profileData.password_confirmation && profileData.password_confirmation !== profileData.password
                                    ? 'border-red-500 dark:border-gov-cherry focus:border-red-500 dark:focus:border-gov-cherry focus:ring-2 focus:ring-red-500/20 dark:focus:ring-gov-cherry/20'
                                    : 'border-gov-gold/20 dark:border-gov-border/15 focus:border-gov-teal dark:focus:border-gov-gold focus:ring-2 focus:ring-gov-teal/20 dark:focus:ring-gov-gold/20'
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="w-full py-4 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-colors flex items-center justify-center gap-3 shadow-lg shadow-gov-teal/30"
                    >
                      {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Settings size={20} />}
                      {isUpdating
                        ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                        : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                      }
                    </motion.button>
                    {/* Notification Preferences */}
                    <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gov-border/15">
                      <h4 className="text-xl font-display font-bold text-gov-charcoal dark:text-white mb-6 flex items-center gap-2">
                        <Bell size={20} className="text-gov-gold" />
                        {language === 'ar' ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
                      </h4>
                      {notifPrefsLoading ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="animate-spin text-gov-gold" size={24} />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {[
                            { key: 'email_complaint_updates', label: language === 'ar' ? 'تحديثات الشكاوى عبر البريد' : 'Complaint updates via email' },
                            { key: 'email_suggestion_updates', label: language === 'ar' ? 'تحديثات الاقتراحات عبر البريد' : 'Suggestion updates via email' },
                            { key: 'email_newsletter', label: language === 'ar' ? 'النشرة البريدية' : 'Newsletter emails' },
                            { key: 'push_notifications', label: language === 'ar' ? 'إشعارات الموقع' : 'Push notifications' },
                          ].map((pref) => (
                            <label key={pref.key} className="flex items-center justify-between p-4 bg-white dark:bg-dm-surface rounded-xl border border-gray-200 dark:border-gov-border/15 cursor-pointer hover:border-gov-teal/30 transition-colors">
                              <span className="font-bold text-sm text-gov-charcoal dark:text-white">{pref.label}</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={notifPrefs[pref.key] ?? true}
                                  onChange={(e) => setNotifPrefs({ ...notifPrefs, [pref.key]: e.target.checked })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:ring-4 peer-focus:ring-gov-teal/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gov-teal"></div>
                              </div>
                            </label>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveNotifPrefs}
                            disabled={notifPrefsSaving}
                            className="w-full py-3 bg-gov-gold text-gov-forest font-bold rounded-xl hover:bg-gov-sand transition-colors flex items-center justify-center gap-3 shadow-lg shadow-gov-gold/20 mt-4"
                          >
                            {notifPrefsSaving ? <Loader2 className="animate-spin" size={18} /> : <Bell size={18} />}
                            {notifPrefsSaving
                              ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                              : (language === 'ar' ? 'حفظ تفضيلات الإشعارات' : 'Save Notification Preferences')
                            }
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dm-surface rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="text-red-500" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gov-charcoal dark:text-white">
                    {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {language === 'ar' ? 'هل أنت متأكد من حذف هذه الشكوى؟' : 'Are you sure you want to delete this complaint?'}
                  </p>
                </div>
              </div>

              {deleteModal.complaint && (
                <div className="bg-gray-50 dark:bg-gov-card/10 rounded-2xl p-5 mb-8 border border-gray-100 dark:border-white/5">
                  <p className="font-bold text-gov-charcoal dark:text-white text-lg">
                    {deleteModal.complaint.subject}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    #{deleteModal.complaint.tracking_number}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-600 dark:text-white/70 mb-8 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
                {language === 'ar'
                  ? 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف الشكوى نهائياً.'
                  : 'This action cannot be undone. The complaint will be permanently deleted.'}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModal({ open: false, complaint: null })}
                  className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleDeleteComplaint}
                  disabled={isDeleting}
                  className="flex-1 py-3.5 px-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-500/20"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer
        onIncreaseFont={() => { }}
        onDecreaseFont={() => { }}
        onToggleContrast={() => { }}
      />
    </div>
  );
}
