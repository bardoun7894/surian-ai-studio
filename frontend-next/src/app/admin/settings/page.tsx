'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Loader2,
  RefreshCw,
  Mail,
  MessageSquare,
  Bell,
  Globe,
  Shield,
  Database,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Setting {
  key: string;
  value: any;
  type: string;
  label_ar: string;
  label_en: string;
  description_ar?: string;
  description_en?: string;
  is_public: boolean;
  is_encrypted: boolean;
}

export default function SystemSettingsPage() {
  const { language } = useLanguage();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [settings, setSettings] = useState<Record<string, Setting[]>>({});
  const [groups, setGroups] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [changedValues, setChangedValues] = useState<Record<string, any>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!currentUser?.role?.name?.includes('admin')) {
        router.push('/admin');
      }
    }
  }, [authLoading, isAuthenticated, currentUser, router]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Failed to fetch settings');

        const data = await res.json();
        setSettings(data.settings || {});
        setGroups(data.groups || []);

        if (data.groups && data.groups.length > 0) {
          setActiveGroup(data.groups[0]);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const handleValueChange = (key: string, value: any) => {
    setChangedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (Object.keys(changedValues).length === 0) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('token');

      // Update settings one by one
      for (const [key, value] of Object.entries(changedValues)) {
        const res = await fetch(`/api/v1/admin/settings/${key}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ value })
        });

        if (!res.ok) throw new Error(`Failed to update ${key}`);
      }

      setSaveSuccess(true);
      setChangedValues({});

      // Refresh settings
      const refreshRes = await fetch('/api/v1/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await refreshRes.json();
      setSettings(data.settings || {});

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(language === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من مسح ذاكرة التخزين المؤقت؟' : 'Are you sure you want to clear the cache?')) {
      return;
    }

    setIsClearingCache(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/admin/settings/cache/clear', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to clear cache');

      alert(language === 'ar' ? 'تم مسح ذاكرة التخزين المؤقت بنجاح' : 'Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert(language === 'ar' ? 'فشل مسح ذاكرة التخزين المؤقت' : 'Failed to clear cache');
    } finally {
      setIsClearingCache(false);
    }
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'notifications': return Bell;
      case 'ui': return Globe;
      case 'security': return Shield;
      case 'system': return Database;
      default: return Settings;
    }
  };

  const getGroupLabel = (group: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      email: { ar: 'إعدادات البريد الإلكتروني', en: 'Email Settings' },
      sms: { ar: 'إعدادات الرسائل القصيرة', en: 'SMS Settings' },
      notifications: { ar: 'إعدادات الإشعارات', en: 'Notification Settings' },
      ui: { ar: 'إعدادات الواجهة', en: 'UI Settings' },
      security: { ar: 'إعدادات الأمان', en: 'Security Settings' },
      system: { ar: 'إعدادات النظام', en: 'System Settings' },
    };

    return language === 'ar' ? (labels[group]?.ar || group) : (labels[group]?.en || group);
  };

  const renderSettingInput = (setting: Setting) => {
    const currentValue = changedValues[setting.key] !== undefined
      ? changedValues[setting.key]
      : setting.value;

    const label = language === 'ar' ? setting.label_ar : setting.label_en;
    const description = language === 'ar' ? setting.description_ar : setting.description_en;

    switch (setting.type) {
      case 'boolean':
        return (
          <div key={setting.key} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-1">
                  {label}
                </label>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                )}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentValue === true || currentValue === 'true'}
                  onChange={(e) => handleValueChange(setting.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gov-teal/20 dark:peer-focus:ring-gov-teal/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gov-teal"></div>
              </label>
            </div>
          </div>
        );

      case 'integer':
        return (
          <div key={setting.key} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
              {label}
              {setting.is_encrypted && (
                <span className="ml-2 text-xs bg-gov-red/10 text-gov-red px-2 py-1 rounded">
                  {language === 'ar' ? 'محمي' : 'Encrypted'}
                </span>
              )}
            </label>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
            )}
            <input
              type="number"
              value={currentValue || ''}
              onChange={(e) => handleValueChange(setting.key, parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gov-charcoal/50 text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            />
          </div>
        );

      case 'json':
        return (
          <div key={setting.key} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
              {label}
              {setting.is_encrypted && (
                <span className="ml-2 text-xs bg-gov-red/10 text-gov-red px-2 py-1 rounded">
                  {language === 'ar' ? 'محمي' : 'Encrypted'}
                </span>
              )}
            </label>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
            )}
            <textarea
              rows={4}
              value={typeof currentValue === 'object' ? JSON.stringify(currentValue, null, 2) : currentValue}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleValueChange(setting.key, parsed);
                } catch {
                  handleValueChange(setting.key, e.target.value);
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gov-charcoal/50 text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none font-mono text-sm"
            />
          </div>
        );

      default: // string
        return (
          <div key={setting.key} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
              {label}
              {setting.is_encrypted && (
                <span className="ml-2 text-xs bg-gov-red/10 text-gov-red px-2 py-1 rounded">
                  {language === 'ar' ? 'محمي' : 'Encrypted'}
                </span>
              )}
            </label>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
            )}
            <input
              type={setting.is_encrypted ? 'password' : 'text'}
              value={currentValue || ''}
              onChange={(e) => handleValueChange(setting.key, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gov-charcoal/50 text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            />
          </div>
        );
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gov-beige dark:bg-gov-forest">
        <Loader2 className="animate-spin text-gov-gold" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gov-beige dark:bg-gov-forest transition-colors">
      <Navbar onSearch={(q) => window.location.href = `/search?q=${encodeURIComponent(q)}`} />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar'
                  ? 'تكوين إعدادات النظام والخدمات'
                  : 'Configure system settings and services'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-white/20 transition-all shadow-lg disabled:opacity-50"
              >
                {isClearingCache ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <RefreshCw size={20} />
                )}
                {language === 'ar' ? 'مسح الكاش' : 'Clear Cache'}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-gov-gold" size={40} />
            </div>
          ) : (
            <div className="flex gap-6">
              {/* Sidebar - Settings Groups */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white dark:bg-white/5 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gov-gold/10 sticky top-28">
                  <nav className="space-y-2">
                    {groups.map((group) => {
                      const Icon = getGroupIcon(group);
                      const isActive = activeGroup === group;

                      return (
                        <button
                          key={group}
                          onClick={() => setActiveGroup(group)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-gov-teal text-white'
                              : 'text-gov-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-bold text-sm">{getGroupLabel(group)}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Main Content - Settings Form */}
              <div className="flex-1">
                <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gov-gold/10">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                      {getGroupLabel(activeGroup)}
                    </h2>
                    {saveSuccess && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl">
                        <CheckCircle size={20} />
                        <span className="font-bold">
                          {language === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {settings[activeGroup]?.map(renderSettingInput)}
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving || Object.keys(changedValues).length === 0}
                      className="flex items-center gap-2 px-8 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
