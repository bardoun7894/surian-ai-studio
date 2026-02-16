'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
  Save,
  Loader2,
  ChevronLeft,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NotificationPreferences {
  email_enabled: boolean;
  email_complaint_updates: boolean;
  email_new_responses: boolean;
  email_status_changes: boolean;
  email_weekly_digest: boolean;
  push_enabled: boolean;
  push_complaint_updates: boolean;
  push_new_responses: boolean;
  push_status_changes: boolean;
  sms_enabled: boolean;
  sms_urgent_only: boolean;
}

const defaultPreferences: NotificationPreferences = {
  email_enabled: true,
  email_complaint_updates: true,
  email_new_responses: true,
  email_status_changes: true,
  email_weekly_digest: false,
  push_enabled: true,
  push_complaint_updates: true,
  push_new_responses: true,
  push_status_changes: true,
  sms_enabled: false,
  sms_urgent_only: true,
};

function NotificationPreferencesContent() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Use relative URLs - Next.js rewrites handle proxying to backend
  const AUTH_API_URL = '/api/v1';

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${AUTH_API_URL}/user/notification-preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPreferences({ ...defaultPreferences, ...data.preferences });
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${AUTH_API_URL}/user/notification-preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const PreferenceToggle = ({
    enabled,
    onToggle,
    label,
    description,
    disabled = false,
  }: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description?: string;
    disabled?: boolean;
  }) => (
    <div className={`flex items-center justify-between py-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <p className={`font-medium ${disabled ? 'text-gray-400' : 'text-gov-charcoal dark:text-white'}`}>
          {label}
        </p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-white/70 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-gov-teal' : 'bg-gray-300 dark:bg-white/20'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors">
      <Navbar onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)} />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              <ChevronLeft size={24} className="text-gov-charcoal dark:text-white rtl:rotate-180" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}
              </h1>
              <p className="text-gray-500 dark:text-white/70">
                {language === 'ar'
                  ? 'تحكم في كيفية تلقيك للإشعارات'
                  : 'Control how you receive notifications'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gov-gold" size={40} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-white dark:bg-gov-card/10 rounded-2xl border border-gov-stone/10 dark:border-white/5 overflow-hidden transition-all hover:border-gov-gold/20">
                <div className="p-6 border-b border-gov-stone/10 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gov-stone/5 dark:bg-gov-card/10 text-gov-forest dark:text-gov-gold">
                      <Mail size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gov-charcoal dark:text-white font-display">
                        {language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
                      </h2>
                      <p className="text-sm text-gov-stone dark:text-gov-beige/60 font-mono mt-1">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => togglePreference('email_enabled')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-gold ${preferences.email_enabled ? 'bg-gov-forest dark:bg-gov-gold' : 'bg-gov-stone/20 dark:bg-white/10'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.email_enabled ? (language === 'ar' ? '-translate-x-6' : 'translate-x-6') : (language === 'ar' ? '-translate-x-1' : 'translate-x-1')
                          }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="px-6 divide-y divide-gov-stone/5 dark:divide-white/5">
                  <PreferenceToggle
                    enabled={preferences.email_complaint_updates}
                    onToggle={() => togglePreference('email_complaint_updates')}
                    label={language === 'ar' ? 'تحديثات الشكاوى' : 'Complaint Updates'}
                    description={language === 'ar'
                      ? 'إشعار عند وجود تحديث على شكواك'
                      : 'Notify when there is an update on your complaint'}
                    disabled={!preferences.email_enabled}
                  />
                  <PreferenceToggle
                    enabled={preferences.email_new_responses}
                    onToggle={() => togglePreference('email_new_responses')}
                    label={language === 'ar' ? 'الردود الجديدة' : 'New Responses'}
                    description={language === 'ar'
                      ? 'إشعار عند إضافة رد على شكواك'
                      : 'Notify when a new response is added to your complaint'}
                    disabled={!preferences.email_enabled}
                  />
                  <PreferenceToggle
                    enabled={preferences.email_status_changes}
                    onToggle={() => togglePreference('email_status_changes')}
                    label={language === 'ar' ? 'تغييرات الحالة' : 'Status Changes'}
                    description={language === 'ar'
                      ? 'إشعار عند تغيير حالة الشكوى'
                      : 'Notify when the complaint status changes'}
                    disabled={!preferences.email_enabled}
                  />
                  <PreferenceToggle
                    enabled={preferences.email_weekly_digest}
                    onToggle={() => togglePreference('email_weekly_digest')}
                    label={language === 'ar' ? 'الملخص الأسبوعي' : 'Weekly Digest'}
                    description={language === 'ar'
                      ? 'تلقي ملخص أسبوعي لنشاطك'
                      : 'Receive a weekly summary of your activity'}
                    disabled={!preferences.email_enabled}
                  />
                </div>
              </div>

              {/* Push Notifications */}
              <div className="bg-white dark:bg-gov-card/10 rounded-2xl border border-gov-stone/10 dark:border-white/5 overflow-hidden transition-all hover:border-gov-gold/20">
                <div className="p-6 border-b border-gov-stone/10 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gov-stone/5 dark:bg-gov-card/10 text-gov-forest dark:text-gov-gold">
                      <Bell size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gov-charcoal dark:text-white font-display">
                        {language === 'ar' ? 'إشعارات الموقع' : 'Push Notifications'}
                      </h2>
                      <p className="text-sm text-gov-stone dark:text-gov-beige/60 mt-1">
                        {language === 'ar' ? 'إشعارات داخل المتصفح' : 'In-browser notifications'}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference('push_enabled')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-gold ${preferences.push_enabled ? 'bg-gov-forest dark:bg-gov-gold' : 'bg-gov-stone/20 dark:bg-white/10'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.push_enabled ? (language === 'ar' ? '-translate-x-6' : 'translate-x-6') : (language === 'ar' ? '-translate-x-1' : 'translate-x-1')
                          }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="px-6 divide-y divide-gov-stone/5 dark:divide-white/5">
                  <PreferenceToggle
                    enabled={preferences.push_complaint_updates}
                    onToggle={() => togglePreference('push_complaint_updates')}
                    label={language === 'ar' ? 'تحديثات الشكاوى' : 'Complaint Updates'}
                    disabled={!preferences.push_enabled}
                  />
                  <PreferenceToggle
                    enabled={preferences.push_new_responses}
                    onToggle={() => togglePreference('push_new_responses')}
                    label={language === 'ar' ? 'الردود الجديدة' : 'New Responses'}
                    disabled={!preferences.push_enabled}
                  />
                  <PreferenceToggle
                    enabled={preferences.push_status_changes}
                    onToggle={() => togglePreference('push_status_changes')}
                    label={language === 'ar' ? 'تغييرات الحالة' : 'Status Changes'}
                    disabled={!preferences.push_enabled}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  {saveStatus === 'success' && (
                    <div className="flex items-center gap-2 text-gov-forest dark:text-gov-gold">
                      <CheckCircle size={18} />
                      <span className="font-bold">{language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully'}</span>
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle size={18} />
                      <span className="font-bold">{language === 'ar' ? 'فشل الحفظ' : 'Failed to save'}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={savePreferences}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-gov-forest dark:bg-gov-button text-white font-bold rounded-xl hover:bg-gov-forest/90 dark:hover:bg-gov-button/80 transition-colors disabled:opacity-50 shadow-lg shadow-gov-forest/10"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving
                    ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                    : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                </button>
              </div>
            </div>
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

export default function NotificationPreferencesPage() {
  return (
    <ProtectedRoute>
      <NotificationPreferencesContent />
    </ProtectedRoute>
  );
}
