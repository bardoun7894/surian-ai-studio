'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Webhook,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  CheckCircle,
  XCircle,
  Zap,
  X,
  Globe,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { toast } from 'sonner';

interface WebhookItem {
  id: string;
  url: string;
  channel: string;
  events: string[];
  is_active: boolean;
  last_triggered_at?: string;
  created_at: string;
}

export default function WebhookManagementPage() {
  const { language } = useLanguage();
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WebhookItem | null>(null);
  const [form, setForm] = useState({ url: '', channel: 'whatsapp', events: '' as string, is_active: true });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  const t = {
    title: language === 'ar' ? 'إدارة الويب هوك' : 'Webhook Management',
    subtitle: language === 'ar' ? 'إدارة نقاط اتصال WhatsApp و Telegram' : 'Manage WhatsApp & Telegram webhook endpoints',
    add: language === 'ar' ? 'إضافة ويب هوك' : 'Add Webhook',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    test: language === 'ar' ? 'اختبار' : 'Test',
    save: language === 'ar' ? 'حفظ' : 'Save',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    url: language === 'ar' ? 'رابط الويب هوك' : 'Webhook URL',
    channel: language === 'ar' ? 'القناة' : 'Channel',
    events: language === 'ar' ? 'الأحداث (مفصولة بفاصلة)' : 'Events (comma-separated)',
    active: language === 'ar' ? 'مفعل' : 'Active',
    inactive: language === 'ar' ? 'معطل' : 'Inactive',
    noWebhooks: language === 'ar' ? 'لا توجد ويب هوك مضافة' : 'No webhooks configured',
    testSuccess: language === 'ar' ? 'نجح الاختبار' : 'Test successful',
    testFailed: language === 'ar' ? 'فشل الاختبار' : 'Test failed',
    saved: language === 'ar' ? 'تم الحفظ' : 'Saved successfully',
    deleted: language === 'ar' ? 'تم الحذف' : 'Deleted',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من حذف هذا الويب هوك؟' : 'Are you sure you want to delete this webhook?',
  };

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/webhooks', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setWebhooks(data.data || data || []);
      }
    } catch (err) { console.error('Failed to fetch webhooks:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWebhooks(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/v1/admin/webhooks/${editing.id}` : '/api/v1/admin/webhooks';
      const method = editing ? 'PUT' : 'POST';
      const body = { ...form, events: form.events.split(',').map(e => e.trim()).filter(Boolean) };
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(t.saved);
        setShowModal(false);
        setEditing(null);
        setForm({ url: '', channel: 'whatsapp', events: '', is_active: true });
        fetchWebhooks();
      }
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      const res = await fetch(`/api/v1/admin/webhooks/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) { toast.success(t.deleted); fetchWebhooks(); }
    } catch { toast.error('Failed'); }
  };

  const handleTest = async (id: string) => {
    setTesting(id);
    try {
      const res = await fetch(`/api/v1/admin/webhooks/${id}/test`, { method: 'POST', headers: getAuthHeaders() });
      if (res.ok) { toast.success(t.testSuccess); }
      else { toast.error(t.testFailed); }
    } catch { toast.error(t.testFailed); }
    finally { setTesting(null); }
  };

  const handleEdit = (webhook: WebhookItem) => {
    setEditing(webhook);
    setForm({ url: webhook.url, channel: webhook.channel, events: webhook.events.join(', '), is_active: webhook.is_active });
    setShowModal(true);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">{t.title}</h1>
          <p className="text-gray-500 dark:text-white/70">{t.subtitle}</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ url: '', channel: 'whatsapp', events: '', is_active: true }); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors shadow-lg"
        >
          <Plus size={20} />
          {t.add}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-gov-gold" size={40} /></div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15">
          <Globe size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-bold">{t.noWebhooks}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="bg-white dark:bg-gov-card/10 rounded-xl border border-gray-100 dark:border-gov-border/15 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${webhook.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
                      {webhook.is_active ? t.active : t.inactive}
                    </span>
                    <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase">{webhook.channel}</span>
                  </div>
                  <p className="font-mono text-sm text-gov-charcoal dark:text-white break-all">{webhook.url}</p>
                  {webhook.events.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {webhook.events.map((event, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{event}</span>
                      ))}
                    </div>
                  )}
                  {webhook.last_triggered_at && (
                    <p className="text-xs text-gray-400 mt-2">
                      {language === 'ar' ? 'آخر تشغيل:' : 'Last triggered:'} {new Date(webhook.last_triggered_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleTest(webhook.id)} disabled={testing === webhook.id} className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/10 text-yellow-600 transition-colors disabled:opacity-50" title={t.test}>
                    {testing === webhook.id ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                  </button>
                  <button onClick={() => handleEdit(webhook)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors" title={t.edit}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(webhook.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/10 text-red-500 transition-colors" title={t.delete}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 dark:border-gov-border/15 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gov-charcoal dark:text-white">
                {editing ? t.edit : t.add}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-1">{t.url} *</label>
                <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full p-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-teal font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-1">{t.channel}</label>
                <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-teal">
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="sms">SMS</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-1">{t.events}</label>
                <input type="text" value={form.events} onChange={(e) => setForm({ ...form, events: e.target.value })} placeholder="complaint.created, complaint.updated" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-teal text-sm" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded" />
                <span className="text-sm font-bold text-gray-700 dark:text-white/70">{t.active}</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gov-border/15 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 font-bold text-sm">{t.cancel}</button>
              <button onClick={handleSave} disabled={saving || !form.url} className="px-5 py-2.5 rounded-xl bg-gov-teal text-white font-bold text-sm hover:bg-gov-emerald transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
