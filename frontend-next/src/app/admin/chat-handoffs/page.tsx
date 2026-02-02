'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Loader2,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface HandoffRequest {
  id: string;
  session_id: string;
  citizen_name?: string;
  citizen_phone?: string;
  reason?: string;
  status: 'pending' | 'assigned' | 'active' | 'closed';
  assigned_to?: { id: number; name: string };
  messages?: Array<{ id: string; sender: string; content: string; created_at: string }>;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-700 dark:bg-dm-surface dark:text-white/70',
};

export default function ChatHandoffsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [handoffs, setHandoffs] = useState<HandoffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHandoff, setSelectedHandoff] = useState<HandoffRequest | null>(null);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const t = {
    title: language === 'ar' ? 'طلبات المحادثة مع موظف' : 'Chat Handoff Requests',
    subtitle: language === 'ar' ? 'إدارة طلبات التحدث مع موظف من المواطنين' : 'Manage citizen requests to talk to staff',
    noPending: language === 'ar' ? 'لا توجد طلبات حالياً' : 'No pending requests',
    assign: language === 'ar' ? 'تعيين لي' : 'Assign to me',
    respond: language === 'ar' ? 'إرسال رد' : 'Send Response',
    close: language === 'ar' ? 'إغلاق' : 'Close',
    citizen: language === 'ar' ? 'المواطن' : 'Citizen',
    reason: language === 'ar' ? 'السبب' : 'Reason',
    status: language === 'ar' ? 'الحالة' : 'Status',
    assignedTo: language === 'ar' ? 'معين إلى' : 'Assigned to',
    responsePlaceholder: language === 'ar' ? 'اكتب ردك هنا...' : 'Write your response here...',
    statuses: {
      pending: language === 'ar' ? 'بانتظار' : 'Pending',
      assigned: language === 'ar' ? 'معين' : 'Assigned',
      active: language === 'ar' ? 'نشط' : 'Active',
      closed: language === 'ar' ? 'مغلق' : 'Closed',
    } as Record<string, string>,
    assignSuccess: language === 'ar' ? 'تم التعيين بنجاح' : 'Assigned successfully',
    respondSuccess: language === 'ar' ? 'تم إرسال الرد' : 'Response sent',
    closeSuccess: language === 'ar' ? 'تم الإغلاق' : 'Closed successfully',
    actionFailed: language === 'ar' ? 'فشلت العملية' : 'Action failed',
  };

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const fetchHandoffs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/staff/chat/handoffs', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setHandoffs(data.data || data || []);
      }
    } catch (err) {
      console.error('Failed to fetch handoffs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHandoffs(); }, []);

  const handleAssign = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/staff/chat/handoffs/${id}/assign`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        toast.success(t.assignSuccess);
        fetchHandoffs();
      } else {
        toast.error(t.actionFailed);
      }
    } catch { toast.error(t.actionFailed); }
    finally { setActionLoading(null); }
  };

  const handleRespond = async (id: string) => {
    if (!responseText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/v1/staff/chat/handoffs/${id}/respond`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: responseText })
      });
      if (res.ok) {
        toast.success(t.respondSuccess);
        setResponseText('');
        fetchHandoffs();
      } else {
        toast.error(t.actionFailed);
      }
    } catch { toast.error(t.actionFailed); }
    finally { setSending(false); }
  };

  const handleClose = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/staff/chat/handoffs/${id}/close`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        toast.success(t.closeSuccess);
        setSelectedHandoff(null);
        fetchHandoffs();
      } else {
        toast.error(t.actionFailed);
      }
    } catch { toast.error(t.actionFailed); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">{t.title}</h1>
        <p className="text-gray-500 dark:text-white/70">{t.subtitle}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gov-gold" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Handoff List */}
          <div className="lg:col-span-1 space-y-3">
            {handoffs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">{t.noPending}</p>
              </div>
            ) : (
              handoffs.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHandoff(h)}
                  className={`w-full text-right p-4 rounded-xl border transition-all ${
                    selectedHandoff?.id === h.id
                      ? 'bg-gov-teal/10 border-gov-teal/30 dark:bg-gov-gold/10 dark:border-gov-border/35'
                      : 'bg-white dark:bg-gov-card/10 border-gray-100 dark:border-gov-border/15 hover:border-gov-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[h.status] || statusColors.pending}`}>
                      {t.statuses[h.status] || h.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(h.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}
                    </span>
                  </div>
                  <p className="font-bold text-gov-charcoal dark:text-white text-sm">
                    {h.citizen_name || (language === 'ar' ? 'زائر' : 'Visitor')}
                  </p>
                  {h.reason && (
                    <p className="text-xs text-gray-500 dark:text-white/70 mt-1 line-clamp-2">{h.reason}</p>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Handoff Detail */}
          <div className="lg:col-span-2">
            {selectedHandoff ? (
              <div className="bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gov-border/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gov-charcoal dark:text-white flex items-center gap-2">
                        <User size={20} />
                        {selectedHandoff.citizen_name || (language === 'ar' ? 'زائر' : 'Visitor')}
                      </h2>
                      {selectedHandoff.citizen_phone && (
                        <p className="text-sm text-gray-500 mt-1">{selectedHandoff.citizen_phone}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedHandoff.status === 'pending' && (
                        <button
                          onClick={() => handleAssign(selectedHandoff.id)}
                          disabled={actionLoading === selectedHandoff.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gov-teal text-white rounded-lg font-bold text-sm hover:bg-gov-emerald transition-colors disabled:opacity-50"
                        >
                          {actionLoading === selectedHandoff.id ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                          {t.assign}
                        </button>
                      )}
                      {selectedHandoff.status !== 'closed' && (
                        <button
                          onClick={() => handleClose(selectedHandoff.id)}
                          disabled={actionLoading === selectedHandoff.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 rounded-lg font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          {t.close}
                        </button>
                      )}
                    </div>
                  </div>
                  {selectedHandoff.reason && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gov-card/10 rounded-lg">
                      <span className="text-xs font-bold text-gray-500 block mb-1">{t.reason}</span>
                      <p className="text-sm text-gray-700 dark:text-white/70">{selectedHandoff.reason}</p>
                    </div>
                  )}
                  {selectedHandoff.assigned_to && (
                    <p className="text-xs text-gray-500 mt-2">
                      {t.assignedTo}: <span className="font-bold">{selectedHandoff.assigned_to.name}</span>
                    </p>
                  )}
                </div>

                {/* Messages */}
                <div className="p-6 max-h-96 overflow-y-auto space-y-3">
                  {selectedHandoff.messages && selectedHandoff.messages.length > 0 ? (
                    selectedHandoff.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl max-w-[80%] ${
                          msg.sender === 'staff'
                            ? 'bg-gov-teal/10 dark:bg-gov-teal/20 mr-auto'
                            : 'bg-gray-100 dark:bg-white/10 ml-auto'
                        }`}
                      >
                        <p className="text-sm text-gray-800 dark:text-white/70">{msg.content}</p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {new Date(msg.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-8">
                      {language === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}
                    </p>
                  )}
                </div>

                {/* Response input */}
                {selectedHandoff.status !== 'closed' && (
                  <div className="p-4 border-t border-gray-100 dark:border-gov-border/15">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleRespond(selectedHandoff.id)}
                        placeholder={t.responsePlaceholder}
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-50 dark:bg-gov-card/10 border border-gray-200 dark:border-gov-border/15 text-gov-charcoal dark:text-white focus:border-gov-teal dark:focus:border-gov-gold outline-none transition-colors"
                      />
                      <button
                        onClick={() => handleRespond(selectedHandoff.id)}
                        disabled={sending || !responseText.trim()}
                        className="px-4 py-3 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-20 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-white/70 mb-4" />
                  <p className="text-gray-500 dark:text-white/70">
                    {language === 'ar' ? 'اختر طلباً لعرض التفاصيل' : 'Select a request to view details'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
