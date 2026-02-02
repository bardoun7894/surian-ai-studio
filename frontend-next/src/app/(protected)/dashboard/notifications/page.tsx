'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  AlertCircle,
  Info
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

interface NotificationPreferences {
  email_enabled: boolean;
  email_complaint_status: boolean;
  email_complaint_response: boolean;
  email_suggestion_status: boolean;
  email_faq_suggestion: boolean;
  email_escalation: boolean;
  in_app_enabled: boolean;
  in_app_complaint_status: boolean;
  in_app_complaint_response: boolean;
  in_app_suggestion_status: boolean;
  in_app_faq_suggestion: boolean;
  in_app_escalation: boolean;
  digest_enabled: boolean;
  digest_frequency: 'daily' | 'weekly' | 'never';
}

export default function NotificationPreferencesPage() {
  const { language } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    email_complaint_status: true,
    email_complaint_response: true,
    email_suggestion_status: true,
    email_faq_suggestion: false,
    email_escalation: true,
    in_app_enabled: true,
    in_app_complaint_status: true,
    in_app_complaint_response: true,
    in_app_suggestion_status: true,
    in_app_faq_suggestion: true,
    in_app_escalation: true,
    digest_enabled: false,
    digest_frequency: 'daily',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/users/me/notification-preferences', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setPreferences(data.data || data);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPreferences();
    }
  }, [isAuthenticated]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users/me/notification-preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateDigestFrequency = (frequency: 'daily' | 'weekly' | 'never') => {
    setPreferences(prev => ({
      ...prev,
      digest_frequency: frequency
    }));
  };

  const preferenceGroups = [
    {
      title: language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications',
      icon: <Mail size={20} />,
      description: language === 'ar'
        ? 'احصل على تحديثات عبر البريد الإلكتروني'
        : 'Receive updates via email',
      items: [
        { key: 'email_complaint_status', label: language === 'ar' ? 'تحديثات حالة الشكوى' : 'Complaint status updates' },
        { key: 'email_complaint_response', label: language === 'ar' ? 'ردود على الشكاوى' : 'Complaint responses' },
        { key: 'email_suggestion_status', label: language === 'ar' ? 'تحديثات المقترحات' : 'Suggestion updates' },
        { key: 'email_faq_suggestion', label: language === 'ar' ? 'مقترحات الأسئلة الشائعة' : 'FAQ suggestions' },
        { key: 'email_escalation', label: language === 'ar' ? 'تنبيهات التصعيد' : 'Escalation alerts' },
      ],
      masterToggle: 'email_enabled' as keyof NotificationPreferences,
    },
    {
      title: language === 'ar' ? 'الإشعارات داخل التطبيق' : 'In-App Notifications',
      icon: <Bell size={20} />,
      description: language === 'ar'
        ? 'احصل على إشعارات مباشرة في لوحة التحكم'
        : 'Receive real-time notifications in your dashboard',
      items: [
        { key: 'in_app_complaint_status', label: language === 'ar' ? 'تحديثات حالة الشكوى' : 'Complaint status updates' },
        { key: 'in_app_complaint_response', label: language === 'ar' ? 'ردود على الشكاوى' : 'Complaint responses' },
        { key: 'in_app_suggestion_status', label: language === 'ar' ? 'تحديثات المقترحات' : 'Suggestion updates' },
        { key: 'in_app_faq_suggestion', label: language === 'ar' ? 'مقترحات الأسئلة الشائعة' : 'FAQ suggestions' },
        { key: 'in_app_escalation', label: language === 'ar' ? 'تنبيهات التصعيد' : 'Escalation alerts' },
      ],
      masterToggle: 'in_app_enabled' as keyof NotificationPreferences,
    },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-dm-bg">
        <Loader2 className="animate-spin text-gov-gold" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-dm-bg transition-colors">
      <Navbar onSearch={(q) => window.location.href = `/search?q=${encodeURIComponent(q)}`} />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
              {language === 'ar' ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
            </h1>
            <p className="text-gray-500 dark:text-white/70">
              {language === 'ar'
                ? 'قم بتخصيص كيفية تلقي الإشعارات والتحديثات'
                : 'Customize how you receive notifications and updates'}
            </p>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-4 bg-gov-gold/10 border border-gov-gold/30 rounded-2xl flex items-start gap-3">
            <Info size={20} className="text-gov-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gov-charcoal dark:text-gov-beige">
              {language === 'ar'
                ? 'يمكنك تخصيص تفضيلات الإشعارات الخاصة بك للبقاء على اطلاع دون الشعور بالإرهاق. يمكنك تغيير هذه الإعدادات في أي وقت.'
                : 'Customize your notification preferences to stay informed without feeling overwhelmed. You can change these settings anytime.'}
            </p>
          </div>

          {/* Preference Groups */}
          <div className="space-y-6">
            {preferenceGroups.map((group, index) => (
              <div key={index} className="bg-white dark:bg-gov-card/10 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gov-border/15">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gov-teal/10 dark:bg-gov-teal/20 flex items-center justify-center text-gov-teal">
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                        {group.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-white/70">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[group.masterToggle]}
                      onChange={() => togglePreference(group.masterToggle)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gov-teal/20 dark:peer-focus:ring-gov-teal/40 rounded-full peer dark:bg-dm-surface peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gov-border/15 peer-checked:bg-gov-teal"></div>
                  </label>
                </div>

                {preferences[group.masterToggle] && (
                  <div className="space-y-3 mt-6 pt-6 border-t border-gray-200 dark:border-gov-border/15">
                    {group.items.map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                        <span className="text-gov-charcoal dark:text-gov-beige">
                          {item.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={preferences[item.key as keyof NotificationPreferences] as boolean}
                          onChange={() => togglePreference(item.key as keyof NotificationPreferences)}
                          className="w-5 h-5 text-gov-teal bg-gray-100 border-gray-300 rounded focus:ring-gov-teal/20 dark:focus:ring-gov-teal/40 dark:ring-offset-gray-800 focus:ring-2 dark:bg-dm-surface dark:border-gov-border/15"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Digest Settings */}
            <div className="bg-white dark:bg-gov-card/10 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gov-border/15">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gov-gold/10 dark:bg-gov-gold/20 flex items-center justify-center text-gov-gold">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                      {language === 'ar' ? 'ملخص الإشعارات' : 'Notification Digest'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-white/70">
                      {language === 'ar'
                        ? 'احصل على ملخص دوري للإشعارات'
                        : 'Receive periodic summary of notifications'}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.digest_enabled}
                    onChange={() => togglePreference('digest_enabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gov-gold/20 dark:peer-focus:ring-gov-gold/40 rounded-full peer dark:bg-dm-surface peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gov-border/15 peer-checked:bg-gov-gold"></div>
                </label>
              </div>

              {preferences.digest_enabled && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gov-border/15">
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-3">
                    {language === 'ar' ? 'التكرار' : 'Frequency'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['daily', 'weekly', 'never'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => updateDigestFrequency(freq)}
                        className={`p-3 rounded-xl font-bold text-sm transition-all ${
                          preferences.digest_frequency === freq
                            ? 'bg-gov-gold text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gov-card/10 text-gov-charcoal dark:text-white hover:bg-gov-gold/10'
                        }`}
                      >
                        {freq === 'daily' && (language === 'ar' ? 'يومي' : 'Daily')}
                        {freq === 'weekly' && (language === 'ar' ? 'أسبوعي' : 'Weekly')}
                        {freq === 'never' && (language === 'ar' ? 'أبداً' : 'Never')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-4 px-6 bg-gov-teal text-white font-bold rounded-2xl hover:bg-gov-emerald transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save size={20} />
                  {language === 'ar' ? 'حفظ التفضيلات' : 'Save Preferences'}
                </>
              )}
            </button>

            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-gov-teal">
                <CheckCircle size={20} />
                <span className="font-bold">{language === 'ar' ? 'تم الحفظ' : 'Saved'}</span>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-gov-red">
                <XCircle size={20} />
                <span className="font-bold">{language === 'ar' ? 'خطأ' : 'Error'}</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        onIncreaseFont={() => {}}
        onDecreaseFont={() => {}}
        onToggleContrast={() => {}}
      />
    </div>
  );
}
