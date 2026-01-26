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
  AlertCircle
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
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'ar' ? 'مراجعة واقتراحات الأسئلة الجديدة' : 'Review and manage FAQ suggestions'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gov-stone group-focus-within:text-gov-gold transition-colors" size={20} />
          <input
            type="text"
            placeholder={language === 'ar' ? 'بحث في الاقتراحات...' : 'Search suggestions...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gov-stone/20 dark:border-gov-gold/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-gold/50 transition-all text-gov-charcoal dark:text-white placeholder-gov-stone/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'rejected', 'snoozed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${filter === f
                  ? 'bg-gov-charcoal dark:bg-gov-gold text-white dark:text-gov-charcoal border-transparent shadow-lg shadow-gov-charcoal/10'
                  : 'bg-white dark:bg-white/5 text-gov-stone dark:text-gov-beige border-gov-stone/10 dark:border-white/10 hover:bg-gov-stone/5 dark:hover:bg-white/10'
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
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gov-stone/10 dark:border-gov-gold/10 overflow-hidden">
        <div className="p-6 border-b border-gov-stone/10 dark:border-gov-gold/10 bg-gov-stone/5 dark:bg-white/5">
          <h2 className="font-display font-bold text-lg text-gov-charcoal dark:text-white flex items-center gap-2">
            <MessageCircle size={20} className="text-gov-gold" />
            {language === 'ar' ? 'اقتراحات الأسئلة الشائعة' : 'FAQ Suggestions'}
            <span className="text-sm font-normal text-gov-stone bg-white dark:bg-white/10 px-2 py-0.5 rounded-full border border-gov-stone/10 dark:border-white/10">
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
            <div className="w-16 h-16 mx-auto mb-4 bg-gov-stone/5 dark:bg-white/5 rounded-full flex items-center justify-center">
              <MessageCircle size={32} className="text-gov-stone/40" />
            </div>
            <p className="text-gov-stone dark:text-gov-beige/60">
              {language === 'ar' ? 'لا توجد اقتراحات' : 'No suggestions found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-white dark:bg-white/5 border-b border-gov-stone/10 dark:border-white/5">
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
                      {new Date(faq.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US')}
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
                              {new Date(faq.snoozed_until).toLocaleDateString()}
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
    </div>
  );
}
