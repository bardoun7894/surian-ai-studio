'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Paperclip,
  Eye,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { API } from '@/lib/repository';
import { Suggestion } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const translations = {
  ar: {
    title: 'مقترحاتي',
    subtitle: 'عرض جميع المقترحات المقدمة',
    loading: 'جاري التحميل...',
    noSuggestions: 'لم تقم بتقديم أي مقترحات بعد',
    trackingNumber: 'رقم المتابعة',
    status: 'الحالة',
    submittedAt: 'تاريخ التقديم',
    lastUpdate: 'آخر تحديث',
    response: 'الرد',
    viewDetails: 'عرض التفاصيل',
    submitNew: 'تقديم مقترح جديد',
    filter: 'تصفية',
    all: 'الكل',
    pending: 'قيد المراجعة',
    reviewed: 'تمت المراجعة',
    approved: 'تمت الموافقة',
    rejected: 'مرفوض',
    search: 'البحث...',
    attachments: 'مرفقات',
    description: 'الوصف',
    showDetails: 'عرض التفاصيل',
    hideDetails: 'إخفاء التفاصيل',
    reviewedAt: 'تاريخ المراجعة',
    noResponse: 'لا يوجد رد بعد',
  },
  en: {
    title: 'My Suggestions',
    subtitle: 'View all your submitted suggestions',
    loading: 'Loading...',
    noSuggestions: 'You haven\'t submitted any suggestions yet',
    trackingNumber: 'Tracking Number',
    status: 'Status',
    submittedAt: 'Submitted At',
    lastUpdate: 'Last Update',
    response: 'Response',
    viewDetails: 'View Details',
    submitNew: 'Submit New Suggestion',
    filter: 'Filter',
    all: 'All',
    pending: 'Pending Review',
    reviewed: 'Reviewed',
    approved: 'Approved',
    rejected: 'Rejected',
    search: 'Search...',
    attachments: 'Attachments',
    description: 'Description',
    showDetails: 'Show Details',
    hideDetails: 'Hide Details',
    reviewedAt: 'Reviewed At',
    noResponse: 'No response yet',
  }
};

const statusConfig = {
  pending: {
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: <Clock className="w-4 h-4" />
  },
  reviewed: {
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: <FileText className="w-4 h-4" />
  },
  approved: {
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: <CheckCircle className="w-4 h-4" />
  },
  rejected: {
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: <XCircle className="w-4 h-4" />
  }
};

export default function MySuggestionsPage() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const t = translations[language];

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const data = await API.suggestions.mySuggestions();
        setSuggestions(data);
        setFilteredSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [isAuthenticated]);

  // Filter suggestions
  useEffect(() => {
    let filtered = suggestions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSuggestions(filtered);
  }, [statusFilter, searchTerm, suggestions]);

  const toggleExpand = (id: string | number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-u-nu-latn' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">{t.all}</option>
                <option value="pending">{t.pending}</option>
                <option value="reviewed">{t.reviewed}</option>
                <option value="approved">{t.approved}</option>
                <option value="rejected">{t.rejected}</option>
              </select>
            </div>

            {/* Submit New Button */}
            <Link
              href="/#suggestions"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <FileText className="w-5 h-5" />
              {t.submitNew}
            </Link>
          </div>
        </div>

        {/* Suggestions List */}
        {filteredSuggestions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t.noSuggestions}</p>
            <Link
              href="/#suggestions"
              className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              {t.submitNew}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => {
              const statusInfo = statusConfig[suggestion.status];
              const isExpanded = expandedIds.has(suggestion.id);
              const statusLabel = language === 'ar'
                ? suggestion.status_label.ar
                : suggestion.status_label.en;

              return (
                <div key={suggestion.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Tracking Number */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            {suggestion.tracking_number}
                          </span>
                          {suggestion.attachments_count > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Paperclip className="w-3 h-3" />
                              {suggestion.attachments_count}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                          {suggestion.description}
                        </p>

                        {/* Dates */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(suggestion.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(suggestion.updated_at)}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* Response Section */}
                  {suggestion.response && (
                    <div className="bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{t.response}</h4>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">
                            {suggestion.response}
                          </p>
                          {suggestion.reviewed_at && (
                            <p className="text-xs text-gray-500 mt-2">
                              {t.reviewedAt}: {formatDate(suggestion.reviewed_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* View Details Link */}
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <Link
                      href={`/suggestions/track?id=${suggestion.tracking_number}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-2 justify-center"
                    >
                      <Eye className="w-4 h-4" />
                      {t.viewDetails}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
