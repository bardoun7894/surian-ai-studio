import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { API } from '../services/repository';
import { Ticket } from '../types';

interface UserDashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onNavigate }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'notifications' | 'settings'>('overview');
  const [applications, setApplications] = useState<Ticket[]>([]);
  const [profileData, setProfileData] = useState({ name: user.name, email: user.email, password: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ForwardArrow = language === 'ar' ? ChevronLeft : ChevronRight;

  React.useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      try {
        const data = await API.complaints.myComplaints();
        setApplications(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (activeTab === 'applications' || activeTab === 'overview') {
      fetchComplaints();
    }
  }, [activeTab]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const data: any = { name: profileData.name, email: profileData.email };
      if (profileData.password) data.password = profileData.password;

      const updatedUser = await API.users.updateProfile(data);
      if (updatedUser) {
        alert(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
        // Ideally update global user state here via callback, or reload
        if (profileData.password) setProfileData({ ...profileData, password: '' });
      } else {
        alert('Failed to update profile');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const notifications = [
    { id: '1', title: 'تم قبول طلبك', message: 'تم قبول طلب جواز السفر وهو قيد المعالجة', time: 'منذ ساعة', read: false },
    { id: '2', title: 'موعد قريب', message: 'لديك موعد في دائرة الأحوال المدنية غداً', time: 'منذ 3 ساعات', read: false },
    { id: '3', title: 'تم إنجاز طلبك', message: 'براءة الذمة المالية جاهزة للاستلام', time: 'أمس', read: true },
  ];

  const stats = [
    { label: t('user_active_requests'), value: applications.filter(a => a.status === 'new' || a.status === 'in_progress').length, icon: <Clock size={20} />, color: 'text-blue-500' },
    { label: t('user_completed_requests'), value: applications.filter(a => a.status === 'resolved').length, icon: <CheckCircle size={20} />, color: 'text-green-500' },
    { label: t('user_rejected_requests'), value: applications.filter(a => a.status === 'rejected').length, icon: <AlertCircle size={20} />, color: 'text-red-500' },
  ];

  const getStatusBadge = (status: Ticket['status']) => {
    const styles = {
      new: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    const labels = {
      new: t('complaint_status_new'),
      in_progress: t('complaint_status_in_progress'),
      resolved: t('complaint_status_resolved'),
      rejected: t('complaint_status_rejected')
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gov-beige dark:bg-gov-forest pt-8 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-gov-forest to-gov-emeraldLight rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">
                  {t('user_welcome')} {user.name}
                </h1>
                <p className="text-white/70">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              <LogOut size={18} />
              <span>{t('user_logout')}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gov-charcoal dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: t('admin_overview'), icon: <TrendingUp size={18} /> },
            { id: 'applications', label: t('user_my_applications'), icon: <FileText size={18} /> },
            { id: 'notifications', label: t('user_notifications'), icon: <Bell size={18} /> },
            { id: 'settings', label: t('user_settings'), icon: <Settings size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                ? 'bg-gov-teal text-white'
                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6">
                {t('user_recent_activity')}
              </h2>
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gov-gold/10 flex items-center justify-center text-gov-gold">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gov-charcoal dark:text-white">{app.title || `تذكرة #${app.tracking_number}`}</h3>
                        <p className="text-sm text-gray-500">{app.ai_category || 'عام'} • {app.lastUpdate || (app.updated_at ? new Date(app.updated_at).toLocaleDateString() : '')}</p>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <h3 className="text-lg font-bold text-gov-charcoal dark:text-white mt-8 mb-4">
                {t('user_quick_actions')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t('user_new_request'), icon: <FileText size={24} /> },
                  { label: t('user_book_appt'), icon: <Calendar size={24} /> },
                  { label: t('user_track_request'), icon: <Clock size={24} /> },
                  { label: t('user_tech_support'), icon: <MessageSquare size={24} /> },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl hover:bg-gov-gold/10 transition-colors flex flex-col items-center gap-2 text-gov-charcoal dark:text-white"
                  >
                    <div className="text-gov-teal dark:text-gov-gold">{action.icon}</div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gov-charcoal dark:text-white">
                  {t('user_all_applications')}
                </h2>
                <select className="py-2 px-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white">
                  <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                  <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                </select>
              </div>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl hover:bg-gray-100 dark:hover:bg-black/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gov-gold/10 flex items-center justify-center text-gov-gold">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gov-charcoal dark:text-white">{app.title || `تذكرة #${app.tracking_number}`}</h3>
                        <p className="text-sm text-gray-500">{app.ai_category || 'عام'} • {app.lastUpdate || (app.updated_at ? new Date(app.updated_at).toLocaleDateString() : '')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(app.status)}
                      <ForwardArrow className="text-gray-400" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6">
                {t('user_notifications')}
              </h2>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-colors ${notif.read
                      ? 'bg-gray-50 dark:bg-black/10 border-gray-100 dark:border-white/5'
                      : 'bg-gov-gold/5 border-gov-gold/20'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.read ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gov-gold/20'
                        }`}>
                        <Bell size={18} className={notif.read ? 'text-gray-500' : 'text-gov-gold'} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gov-charcoal dark:text-white">{notif.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gov-charcoal dark:text-white mb-6">
                {t('user_account_settings')}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    {t('reg_full_name')}
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    {t('auth_email')}
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    {t('user_new_password_optional')}
                  </label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                    className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gov-charcoal dark:text-white"
                    placeholder="********"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-colors flex items-center gap-2"
                >
                  {isUpdating && <Loader2 size={18} className="animate-spin" />}
                  {t('ui_save')}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
