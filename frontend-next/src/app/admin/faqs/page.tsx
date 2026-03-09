'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Plus,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Clock,
  Search,
  Filter,
  AlertCircle,
  Edit3,
  Trash2,
  X,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import SnoozeButton from '@/components/SnoozeButton';

interface FaqSuggestion {
  id: string;
  question: string;
  answer?: string;
  suggested_by_name?: string;
  suggested_by_email?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  snoozed_until?: string;
}

export default function AdminFaqsPage() {
  const { language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [faqs, setFaqs] = useState<FaqSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'snoozed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // FAQ CRUD state
  const [activeView, setActiveView] = useState<'faqs' | 'suggestions'>('faqs');
  const [faqList, setFaqList] = useState<Array<{ id: string; question_ar: string; question_en?: string; answer_ar: string; answer_en?: string; category?: string; is_published: boolean }>>([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [faqForm, setFaqForm] = useState({ question_ar: '', question_en: '', answer_ar: '', answer_en: '', category: '', is_published: true });
  const [savingFaq, setSavingFaq] = useState(false);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const fetchFaqs = async () => {
    setFaqLoading(true);
    try {
      const res = await fetch('/api/v1/admin/faq', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setFaqList(data.data || data || []);
      }
    } catch (err) { console.error('Failed to fetch FAQs:', err); }
    finally { setFaqLoading(false); }
  };

  const handleSaveFaq = async () => {
    setSavingFaq(true);
    try {
      const url = editingFaq ? `/api/v1/admin/faq/${editingFaq.id}` : '/api/v1/admin/faq';
      const method = editingFaq ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(faqForm) });
      if (res.ok) {
        setShowFaqModal(false);
        setEditingFaq(null);
        setFaqForm({ question_ar: '', question_en: '', answer_ar: '', answer_en: '', category: '', is_published: true });
        fetchFaqs();
      }
    } catch (err) { console.error('Failed to save FAQ:', err); }
    finally { setSavingFaq(false); }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/v1/admin/faq/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) { fetchFaqs(); }
    } catch (err) { console.error('Failed to delete FAQ:', err); }
  };

  const handleEditFaq = (faq: any) => {
    setEditingFaq(faq);
    setFaqForm({
      question_ar: faq.question_ar || '',
      question_en: faq.question_en || '',
      answer_ar: faq.answer_ar || '',
      answer_en: faq.answer_en || '',
      category: faq.category || '',
      is_published: faq.is_published ?? true
    });
    setShowFaqModal(true);
  };

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'snoozed'
        ? '/api/v1/admin/faq-suggestions/snoozed'
        : `/api/v1/admin/faq-suggestions?status=${filter !== 'all' ? filter : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setFaqs(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching FAQ suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSuggestions();
    }
  }, [filter, isAdmin]);

  useEffect(() => {
    if (activeView === 'faqs') { fetchFaqs(); }
  }, [activeView]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/faq-suggestions/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        fetchSuggestions();
      } else {
        alert(language === 'ar' ? 'فشلت العملية' : 'Operation failed');
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert(language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        label: language === 'ar' ? 'قيد الانتظار' : 'Pending'
      },
      approved: {
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        label: language === 'ar' ? 'معتمد' : 'Approved'
      },
      rejected: {
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        label: language === 'ar' ? 'مرفوض' : 'Rejected'
      }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>;
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle className="text-red-500" size={24} />
          <p className="text-red-700 dark:text-red-400 font-bold">
            {language === 'ar' ? 'غير مصرح لك بالوصول إلى هذه الصفحة' : 'You are not authorized to access this page'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
            {language === 'ar' ? 'إدارة الأسئلة الشائعة' : 'FAQ Management'}
          </h1>
          <p className="text-gray-500 dark:text-white/70">
            {language === 'ar' ? 'مراجعة واقتراحات الأسئلة الجديدة' : 'Review and manage FAQ suggestions'}
          </p>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveView('faqs')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeView === 'faqs' ? 'bg-gov-teal text-white shadow-lg' : 'bg-white dark:bg-gov-card/10 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-gov-border/15'}`}>
          {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}
        </button>
        <button onClick={() => setActiveView('suggestions')} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeView === 'suggestions' ? 'bg-gov-teal text-white shadow-lg' : 'bg-white dark:bg-gov-card/10 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-gov-border/15'}`}>
          {language === 'ar' ? 'اقتراحات الأسئلة' : 'FAQ Suggestions'}
        </button>
      </div>

      {/* FAQ Management View */}
      {activeView === 'faqs' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gov-charcoal dark:text-white">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <button
              onClick={() => { setEditingFaq(null); setFaqForm({ question_ar: '', question_en: '', answer_ar: '', answer_en: '', category: '', is_published: true }); setShowFaqModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-gov-teal text-white rounded-lg font-bold text-sm hover:bg-gov-emerald transition-colors"
            >
              <Plus size={18} />
              {language === 'ar' ? 'إضافة سؤال' : 'Add FAQ'}
            </button>
          </div>

          {faqLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gov-gold" size={32} /></div>
          ) : faqList.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15">
              <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">{language === 'ar' ? 'لا توجد أسئلة شائعة' : 'No FAQs found'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqList.map((faq) => (
                <div key={faq.id} className="bg-white dark:bg-gov-card/10 rounded-xl border border-gray-100 dark:border-gov-border/15 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gov-charcoal dark:text-white mb-2">
                        {language === 'ar' ? faq.question_ar : (faq.question_en || faq.question_ar)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-white/70 line-clamp-2">
                        {language === 'ar' ? faq.answer_ar : (faq.answer_en || faq.answer_ar)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        {faq.category && <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{faq.category}</span>}
                        <span className={`text-xs px-2 py-1 rounded ${faq.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
                          {faq.is_published ? (language === 'ar' ? 'منشور' : 'Published') : (language === 'ar' ? 'مسودة' : 'Draft')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditFaq(faq)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/10 text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ Create/Edit Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gov-border/15 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gov-charcoal dark:text-white">
                {editingFaq ? (language === 'ar' ? 'تعديل السؤال' : 'Edit FAQ') : (language === 'ar' ? 'إضافة سؤال جديد' : 'Add New FAQ')}
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-1">{language === 'ar' ? 'السؤال (عربي)' : 'Question (Arabic)'} *</label>
                <input type="text" value={faqForm.question_ar} onChange={(e) => setFaqForm({ ...faqForm, question_ar: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-teal" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-1">{language === 'ar' ? 'السؤال (إنجليزي)' : 'Question (English)'}</label>
                <input type="text" value={faqForm.question_en} onChange={(e) => setFaqForm({ ...faqForm, question_en: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-teal" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-1">{language === 'ar' ? 'الإجابة (عربي)' : 'Answer (Arabic)'} *</label>
                <textarea rows={4} value={faqForm.answer_ar} onChange={(e) => setFaqForm({ ...faqForm, answer_ar: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-teal resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/70 mb-1">{language === 'ar' ? 'الإجابة (إنجليزي)' : 'Answer (English)'}</label>
                <textarea rows={4} value={faqForm.answer_en} onChange={(e) => setFaqForm({ ...faqForm, answer_en: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-gov-card/10 text-gov-charcoal dark:text-white outline-none focus:border-gov-teal resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={faqForm.is_published} onChange={(e) => setFaqForm({ ...faqForm, is_published: e.target.checked })} className="w-5 h-5 rounded" />
                <label className="text-sm font-bold text-gray-700 dark:text-white/70">{language === 'ar' ? 'منشور' : 'Published'}</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gov-border/15 flex justify-end gap-3">
              <button onClick={() => setShowFaqModal(false)} className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 font-bold text-sm">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleSaveFaq} disabled={savingFaq || !faqForm.question_ar || !faqForm.answer_ar} className="px-5 py-2.5 rounded-xl bg-gov-teal text-white font-bold text-sm hover:bg-gov-emerald transition-colors disabled:opacity-50 flex items-center gap-2">
                {savingFaq ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions View */}
      {activeView === 'suggestions' && (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gov-stone group-focus-within:text-gov-gold transition-colors" size={20} />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث في الاقتراحات...' : 'Search suggestions...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gov-card/10 border border-gov-stone/20 dark:border-gov-border/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-gold/50 transition-all text-gov-charcoal dark:text-white placeholder-gov-stone/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected', 'snoozed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${filter === f
                      ? 'bg-gov-charcoal dark:bg-gov-button text-white border-transparent shadow-lg shadow-gov-charcoal/10'
                      : 'bg-white dark:bg-gov-card/10 text-gov-stone dark:text-gov-beige border-gov-stone/10 dark:border-gov-border/15 hover:bg-gov-stone/5 dark:hover:bg-white/10'
                    }`}
                >
                  {f === 'all' && (language === 'ar' ? 'الكل' : 'All')}
                  {f === 'pending' && (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                  {f === 'approved' && (language === 'ar' ? 'معتمد' : 'Approved')}
                  {f === 'rejected' && (language === 'ar' ? 'مرفوض' : 'Rejected')}
                  {f === 'snoozed' && (language === 'ar' ? 'مؤجل' : 'Snoozed')}
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions List */}
          <div className="bg-white dark:bg-gov-card/10 rounded-2xl border border-gov-stone/10 dark:border-gov-border/15 overflow-hidden">
            <div className="p-6 border-b border-gov-stone/10 dark:border-gov-border/15 bg-gov-stone/5 dark:bg-gov-card/10">
              <h2 className="font-display font-bold text-lg text-gov-charcoal dark:text-white flex items-center gap-2">
                <MessageCircle size={20} className="text-gov-gold" />
                {language === 'ar' ? 'اقتراحات الأسئلة الشائعة' : 'FAQ Suggestions'}
                <span className="text-sm font-normal text-gov-stone bg-white dark:bg-white/10 px-2 py-0.5 rounded-full border border-gov-stone/10 dark:border-gov-border/15">
                  {filteredFaqs.length}
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-gov-gold" size={40} />
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 bg-gov-stone/5 dark:bg-gov-card/10 rounded-full flex items-center justify-center">
                  <MessageCircle size={32} className="text-gov-stone/40" />
                </div>
                <p className="text-gov-stone dark:text-gov-beige/60">
                  {language === 'ar' ? 'لا توجد اقتراحات' : 'No suggestions found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-white dark:bg-gov-card/10 border-b border-gov-stone/10 dark:border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gov-stone uppercase tracking-wider">
                        {language === 'ar' ? 'السؤال المقترح' : 'Suggested Question'}
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gov-stone uppercase tracking-wider">
                        {language === 'ar' ? 'مقدم الاقتراح' : 'Submitted By'}
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gov-stone uppercase tracking-wider">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gov-stone uppercase tracking-wider">
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gov-stone uppercase tracking-wider">
                        {language === 'ar' ? 'إجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gov-stone/5 dark:divide-white/5">
                    {filteredFaqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-gov-stone/5 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gov-charcoal dark:text-white mb-1">
                            {faq.question}
                          </p>
                          {faq.answer && (
                            <p className="text-xs text-gov-stone dark:text-gov-beige/70 line-clamp-2">{faq.answer}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gov-charcoal dark:text-white font-medium">
                            {faq.suggested_by_name || (language === 'ar' ? 'مجهول' : 'Anonymous')}
                          </p>
                          {faq.suggested_by_email && (
                            <p className="text-xs text-gov-stone dark:text-gov-beige/60 font-mono mt-0.5">{faq.suggested_by_email}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(faq.status)}</td>
                        <td className="px-6 py-4 text-sm text-gov-stone dark:text-gov-beige/60 font-mono">
                          {new Date(faq.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            {faq.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleAction(faq.id, 'approve')}
                                  disabled={actionLoading === faq.id}
                                  className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                                  title={language === 'ar' ? 'اعتماد' : 'Approve'}
                                >
                                  {actionLoading === faq.id ? (
                                    <Loader2 className="animate-spin" size={18} />
                                  ) : (
                                    <CheckCircle size={18} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleAction(faq.id, 'reject')}
                                  disabled={actionLoading === faq.id}
                                  className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                                  title={language === 'ar' ? 'رفض' : 'Reject'}
                                >
                                  {actionLoading === faq.id ? (
                                    <Loader2 className="animate-spin" size={18} />
                                  ) : (
                                    <XCircle size={18} />
                                  )}
                                </button>
                                <div className="border-l border-gov-stone/20 h-6 mx-1"></div>
                                <SnoozeButton
                                  itemId={faq.id}
                                  itemType="faq-suggestion"
                                  onSnoozed={fetchSuggestions}
                                />
                              </>
                            )}
                            {faq.snoozed_until && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-gov-stone/5 rounded text-xs text-gov-stone">
                                <Clock size={12} />
                                <span>
                                  {language === 'ar' ? 'مؤجل حتى' : 'Snoozed until'}{' '}
                                  {new Date(faq.snoozed_until).toLocaleDateString("ar-u-nu-latn")}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
