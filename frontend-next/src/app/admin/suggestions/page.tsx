'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Search,
  Filter,
  Eye,
  Trash2,
  Loader2,
  X,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Suggestion {
  id: number;
  name: string;
  job_title: string;
  email: string;
  phone: string;
  description: string;
  status: string;
  tracking_number: string;
  response?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  created_at: string;
  user?: { name: string };
  reviewer?: { name: string };
}

export default function SuggestionsManagementPage() {
  const { language } = useLanguage();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // State
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  // Review form state
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewResponse, setReviewResponse] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const statuses = [
    { value: 'pending', label_ar: 'قيد الانتظار', label_en: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    { value: 'reviewed', label_ar: 'تمت المراجعة', label_en: 'Reviewed', color: 'bg-blue-100 text-blue-700', icon: Eye },
    { value: 'approved', label_ar: 'مقبول', label_en: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    { value: 'rejected', label_ar: 'مرفوض', label_en: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle }
  ];

  // Redirect if not authenticated or not admin/staff
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!currentUser?.role?.name?.includes('admin') && !currentUser?.role?.name?.includes('staff')) {
        router.push('/admin');
      }
    }
  }, [authLoading, isAuthenticated, currentUser, router]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
          page: currentPage.toString(),
          per_page: '15'
        });
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status', statusFilter);

        const res = await fetch(`/api/v1/admin/suggestions?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Failed to fetch suggestions');

        const data = await res.json();
        setSuggestions(data.data || []);
        setTotalPages(data.last_page || 1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSuggestions();
    }
  }, [isAuthenticated, currentPage, searchTerm, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleViewSuggestion = async (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowViewModal(true);
  };

  const handleReviewSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setReviewStatus(suggestion.status);
    setReviewResponse(suggestion.response || '');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuggestion) return;

    setIsReviewing(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/admin/suggestions/${selectedSuggestion.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          status: reviewStatus,
          response: reviewResponse
        })
      });

      if (!res.ok) throw new Error('Failed to update suggestion');

      setShowReviewModal(false);
      setSelectedSuggestion(null);
      setReviewStatus('');
      setReviewResponse('');

      // Refresh suggestions list
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '15'
      });
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const refreshRes = await fetch(`/api/v1/admin/suggestions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await refreshRes.json();
      setSuggestions(data.data || []);
    } catch (error: any) {
      console.error('Error updating suggestion:', error);
      alert(language === 'ar' ? 'فشل تحديث الاقتراح' : 'Failed to update suggestion');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleDeleteSuggestion = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الاقتراح؟' : 'Are you sure you want to delete this suggestion?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/admin/suggestions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to delete suggestion');

      // Refresh suggestions list
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '15'
      });
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const refreshRes = await fetch(`/api/v1/admin/suggestions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await refreshRes.json();
      setSuggestions(data.data || []);
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      alert(language === 'ar' ? 'فشل حذف الاقتراح' : 'Failed to delete suggestion');
    }
  };

  const getStatusLabel = (status: string) => {
    const st = statuses.find(s => s.value === status);
    return language === 'ar' ? st?.label_ar : st?.label_en;
  };

  const getStatusColor = (status: string) => {
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    return statuses.find(s => s.value === status)?.icon || Clock;
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
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
              {language === 'ar' ? 'إدارة الاقتراحات' : 'Suggestions Management'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ar'
                ? 'مراجعة والرد على اقتراحات المواطنين'
                : 'Review and respond to citizen suggestions'}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white dark:bg-white/5 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gov-gold/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'ar' ? 'البحث في الاقتراحات...' : 'Search suggestions...'}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gov-charcoal/50 text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </form>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gov-charcoal/50 text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
              >
                <option value="">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
                {statuses.map(st => (
                  <option key={st.value} value={st.value}>
                    {language === 'ar' ? st.label_ar : st.label_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Suggestions Table */}
          <div className="bg-white dark:bg-white/5 rounded-3xl shadow-xl border border-gray-100 dark:border-gov-gold/10 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-gov-gold" size={40} />
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'لا توجد اقتراحات' : 'No suggestions found'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'رقم التتبع' : 'Tracking Number'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الاسم' : 'Name'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الوصف' : 'Description'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'تاريخ الإرسال' : 'Submitted'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {suggestions.map((suggestion) => {
                      const StatusIcon = getStatusIcon(suggestion.status);
                      return (
                        <tr key={suggestion.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-gov-teal font-bold">
                              {suggestion.tracking_number}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gov-charcoal dark:text-white font-medium">
                            {suggestion.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            <div className="max-w-md truncate">
                              {suggestion.description}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(suggestion.status)}`}>
                              <StatusIcon size={14} />
                              {getStatusLabel(suggestion.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                            {new Date(suggestion.created_at).toLocaleDateString(language === 'ar' ? 'ar-SY' : 'en-US')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewSuggestion(suggestion)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
                                title={language === 'ar' ? 'عرض' : 'View'}
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleReviewSuggestion(suggestion)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gov-teal transition-colors"
                                title={language === 'ar' ? 'مراجعة' : 'Review'}
                              >
                                <MessageSquare size={18} />
                              </button>
                              {suggestion.status === 'pending' && (
                                <button
                                  onClick={() => handleDeleteSuggestion(suggestion.id)}
                                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-red-600 transition-colors"
                                  title={language === 'ar' ? 'حذف' : 'Delete'}
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gov-charcoal dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <span className="px-4 py-2 text-gov-charcoal dark:text-white">
                  {language === 'ar' ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gov-charcoal dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* View Suggestion Modal */}
      {showViewModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gov-charcoal rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'تفاصيل الاقتراح' : 'Suggestion Details'}
              </h2>
              <button
                onClick={() => { setShowViewModal(false); setSelectedSuggestion(null); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                    {language === 'ar' ? 'رقم التتبع' : 'Tracking Number'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold font-mono">{selectedSuggestion.tracking_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedSuggestion.status)}`}>
                    {getStatusLabel(selectedSuggestion.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                    <User className="inline-block mr-1" size={14} />
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">{selectedSuggestion.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                    <Briefcase className="inline-block mr-1" size={14} />
                    {language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">{selectedSuggestion.job_title}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                    <Mail className="inline-block mr-1" size={14} />
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">{selectedSuggestion.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                    <Phone className="inline-block mr-1" size={14} />
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">{selectedSuggestion.phone}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                    {language === 'ar' ? 'تاريخ الإرسال' : 'Submitted Date'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white font-bold">
                    {new Date(selectedSuggestion.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <p className="text-gov-charcoal dark:text-white bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                  {selectedSuggestion.description}
                </p>
              </div>

              {selectedSuggestion.response && (
                <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">
                    {language === 'ar' ? 'الرد' : 'Response'}
                  </label>
                  <p className="text-gov-charcoal dark:text-white bg-gov-teal/10 p-4 rounded-xl">
                    {selectedSuggestion.response}
                  </p>
                  {selectedSuggestion.reviewer && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {language === 'ar' ? 'بواسطة: ' : 'By: '}{selectedSuggestion.reviewer.name}
                      {selectedSuggestion.reviewed_at && ` - ${new Date(selectedSuggestion.reviewed_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Suggestion Modal */}
      {showReviewModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gov-charcoal rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'مراجعة الاقتراح' : 'Review Suggestion'}
              </h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedSuggestion(null);
                  setReviewStatus('');
                  setReviewResponse('');
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {language === 'ar' ? 'رقم التتبع' : 'Tracking Number'}
                </p>
                <p className="font-mono font-bold text-gov-teal">{selectedSuggestion.tracking_number}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'الحالة' : 'Status'} *
                </label>
                <select
                  required
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gov-charcoal/50 text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                >
                  {statuses.map(st => (
                    <option key={st.value} value={st.value}>
                      {language === 'ar' ? st.label_ar : st.label_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'الرد' : 'Response'}
                </label>
                <textarea
                  rows={6}
                  value={reviewResponse}
                  onChange={(e) => setReviewResponse(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل الرد على الاقتراح...' : 'Enter response to the suggestion...'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gov-charcoal/50 text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedSuggestion(null);
                    setReviewStatus('');
                    setReviewResponse('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isReviewing}
                  className="flex-1 px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isReviewing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      {language === 'ar' ? 'حفظ المراجعة' : 'Save Review'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer
        onIncreaseFont={() => {}}
        onDecreaseFont={() => {}}
        onToggleContrast={() => {}}
      />
    </div>
  );
}
