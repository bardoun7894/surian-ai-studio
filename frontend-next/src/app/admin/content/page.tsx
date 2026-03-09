'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  X,
  Save,
  Calendar,
  Tag,
  Globe,
  Star,
  Archive,
  CheckCircle,
  FileIcon,
  Upload,
  History,
  RotateCcw,
  ArrowRightLeft,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API } from '@/lib/repository';
import AIContentTools from '@/components/AIContentTools';
import { DIRECTORATES } from '@/constants';
import { TableRowSkeleton } from '@/components/Skeleton';
import { SkeletonText } from '@/components/SkeletonLoader';

interface ContentItem {
  id: number;
  title_ar: string;
  title_en?: string;
  content_ar: string;
  content_en?: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  published_at?: string;
  expires_at?: string;
  author?: { name: string };
  view_count: number;
  created_at: string;
  updated_at: string;
}

export default function ContentManagementPage() {
  const { language } = useLanguage();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  // State
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [compareVersion, setCompareVersion] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    content_ar: '',
    content_en: '',
    category: 'news',
    status: 'draft',
    featured: false,
    published_at: '',
    expires_at: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    { value: 'news', label_ar: 'أخبار', label_en: 'News' },
    { value: 'decree', label_ar: 'مراسيم', label_en: 'Decrees' },
    { value: 'announcement', label_ar: 'إعلانات', label_en: 'Announcements' },
    { value: 'service', label_ar: 'خدمات', label_en: 'Services' },
    { value: 'faq', label_ar: 'أسئلة شائعة', label_en: 'FAQs' },
    { value: 'about', label_ar: 'عن الوزارة', label_en: 'About' },
    { value: 'media', label_ar: 'وسائط', label_en: 'Media' }
  ];

  const statuses = [
    { value: 'draft', label_ar: 'مسودة', label_en: 'Draft', color: 'bg-gray-100 text-gray-700' },
    { value: 'published', label_ar: 'منشور', label_en: 'Published', color: 'bg-green-100 text-green-700' },
    { value: 'archived', label_ar: 'مؤرشف', label_en: 'Archived', color: 'bg-red-100 text-red-700' }
  ];

  const expiryFilters = [
    { value: '', label_ar: 'كل الإعلانات', label_en: 'All Announcements' },
    { value: 'active', label_ar: 'إعلانات سارية', label_en: 'Active' },
    { value: 'expired', label_ar: 'إعلانات منتهية', label_en: 'Expired' }
  ];

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

  // Fetch contents
  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          per_page: 15
        };
        if (searchTerm) params.search = searchTerm;
        if (categoryFilter) params.category = categoryFilter;
        if (statusFilter) params.status = statusFilter;
        if (expiryFilter) params.expiry_status = expiryFilter;

        const response = await API.content.getAll(params);
        setContents(response.data || []);
        setTotalPages(response.last_page || 1);
      } catch (error) {
        console.error('Error fetching contents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchContents();
    }
  }, [isAuthenticated, currentPage, searchTerm, categoryFilter, statusFilter, expiryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const validateField = (fieldName: string, value: any): string | null => {
    switch (fieldName) {
      case 'title_ar':
        if (!value || !value.trim()) {
          return language === 'ar' 
            ? 'يرجى إدخال عنوان الإعلان بالعربية - مثال: مناقصة عامة لتوريد معدات' 
            : 'Please enter the announcement title in Arabic - Example: Public tender for equipment supply';
        }
        if (value.trim().length < 5) {
          return language === 'ar' 
            ? 'يجب أن يكون العنوان 5 أحرف على الأقل' 
            : 'Title must be at least 5 characters';
        }
        return null;
      
      case 'content_ar':
        if (!value || !value.trim()) {
          return language === 'ar' 
            ? 'يرجى إدخال تفاصيل الإعلان بالعربية' 
            : 'Please enter the announcement details in Arabic';
        }
        if (value.trim().length < 20) {
          return language === 'ar' 
            ? 'يجب أن يحتوي المحتوى على 20 حرفاً على الأقل' 
            : 'Content must be at least 20 characters';
        }
        return null;
      
      case 'expires_at':
        if (formData.category === 'announcement' && !value) {
          return language === 'ar' 
            ? 'يرجى تحديد تاريخ ووقت انتهاء الإعلان - مطلوب للإعلانات' 
            : 'Please specify the announcement expiry date and time - Required for announcements';
        }
        if (formData.published_at && value) {
          const publishDate = new Date(formData.published_at);
          const expiryDate = new Date(value);
          if (expiryDate <= publishDate) {
            return language === 'ar' 
              ? 'تاريخ الانتهاء يجب أن يكون بعد تاريخ النشر - يرجى اختيار تاريخ لاحق' 
              : 'Expiry date must be after publish date - Please select a later date';
          }
        }
        return null;
      
      default:
        return null;
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setFormErrors((prev: any) => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const getFieldStatus = (fieldName: string): 'valid' | 'invalid' | 'neutral' => {
    if (!touchedFields.has(fieldName)) return 'neutral';
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    return error ? 'invalid' : 'valid';
  };

  const validateForm = () => {
    const errors: any = {};
    
    // Required fields validation
    const titleError = validateField('title_ar', formData.title_ar);
    if (titleError) errors.title_ar = titleError;
    
    const contentError = validateField('content_ar', formData.content_ar);
    if (contentError) errors.content_ar = contentError;

    const expiryError = validateField('expires_at', formData.expires_at);
    if (expiryError) errors.expires_at = expiryError;

    return errors;
  };

  const isContentExpired = (content: ContentItem) => {
    if (content.category !== 'announcement' || !content.expires_at) return false;
    return new Date(content.expires_at) < new Date();
  };

  const isContentActive = (content: ContentItem) => {
    if (content.category !== 'announcement' || !content.expires_at) return false;
    return new Date(content.expires_at) >= new Date();
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      await API.content.create(formData);

      setShowCreateModal(false);
      setFormData({
        title_ar: '',
        title_en: '',
        content_ar: '',
        content_en: '',
        category: 'news',
        status: 'draft',
        featured: false,
        published_at: '',
        expires_at: ''
      });
      setCurrentPage(1);

      // Refresh contents list
      const response = await API.content.getAll({ page: 1, per_page: 15 });
      setContents(response.data || []);
    } catch (error: any) {
      setFormErrors({ general: error.message || (language === 'ar' ? 'فشل إنشاء المحتوى' : 'Failed to create content') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    try {
      await API.content.update(selectedContent.id.toString(), formData);

      setShowEditModal(false);
      setSelectedContent(null);
      setFormData({
        title_ar: '',
        title_en: '',
        content_ar: '',
        content_en: '',
        category: 'news',
        status: 'draft',
        featured: false,
        published_at: '',
        expires_at: ''
      });

      // Refresh contents list
      const response = await API.content.getAll({
        page: currentPage,
        per_page: 15,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter })
      });
      setContents(response.data || []);
    } catch (error: any) {
      setFormErrors({ general: error.message || (language === 'ar' ? 'فشل تحديث المحتوى' : 'Failed to update content') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContent = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المحتوى؟' : 'Are you sure you want to delete this content?')) {
      return;
    }

    try {
      await API.content.delete(id.toString());

      // Refresh contents list
      const response = await API.content.getAll({
        page: currentPage,
        per_page: 15,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter })
      });
      setContents(response.data || []);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setFormData({
      title_ar: content.title_ar,
      title_en: content.title_en || '',
      content_ar: content.content_ar,
      content_en: content.content_en || '',
      category: content.category,
      status: content.status,
      featured: content.featured,
      published_at: content.published_at ? new Date(content.published_at).toISOString().split('T')[0] : '',
      expires_at: content.expires_at ? new Date(content.expires_at).toISOString().slice(0, 16) : ''
    });
    setFormErrors({});
    setTouchedFields(new Set());
    setShowEditModal(true);
  };

  const handleViewHistory = async (content: ContentItem) => {
    setSelectedContent(content);
    setShowHistoryModal(true);
    setIsLoadingVersions(true);
    try {
      const data = await API.content.getVersions(content.id.toString());
      setVersions(data);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleRestoreVersion = async (versionNumber: number) => {
    if (!selectedContent) return;
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من استعادة هذا الإصدار؟' : 'Are you sure you want to restore this version?')) {
      return;
    }

    try {
      await API.content.restoreVersion(selectedContent.id.toString(), versionNumber);
      setShowHistoryModal(false);
      setShowEditModal(false);
      // Refresh list
      const response = await API.content.getAll({ page: currentPage, per_page: 15 });
      setContents(response.data || []);
      alert(language === 'ar' ? 'تم استعادة الإصدار بنجاح' : 'Version restored successfully');
    } catch (error) {
      console.error('Error restoring version:', error);
      alert(language === 'ar' ? 'فشل استعادة الإصدار' : 'Failed to restore version');
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return language === 'ar' ? cat?.label_ar : cat?.label_en;
  };

  const getStatusLabel = (status: string) => {
    const st = statuses.find(s => s.value === status);
    return language === 'ar' ? st?.label_ar : st?.label_en;
  };

  const getStatusColor = (status: string) => {
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetForm = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      content_ar: '',
      content_en: '',
      category: 'news',
      status: 'draft',
      featured: false,
      published_at: '',
      expires_at: ''
    });
    setFormErrors({});
    setTouchedFields(new Set());
  };

  if (authLoading || !isAuthenticated) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white mb-2">
                {language === 'ar' ? 'إدارة المحتوى' : 'Content Management'}
              </h1>
              <p className="text-gray-500 dark:text-white/70">
                {language === 'ar'
                  ? 'إدارة الأخبار والمقالات والمراسيم والإعلانات'
                  : 'Manage news, articles, decrees, and announcements'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gov-teal text-white font-bold rounded-2xl hover:bg-gov-emerald transition-all shadow-lg"
            >
              <Plus size={20} />
              {language === 'ar' ? 'إضافة محتوى' : 'Add Content'}
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white dark:bg-gov-card/10 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gov-border/15">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'ar' ? 'البحث في المحتوى...' : 'Search content...'}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
              >
                <option value="">{language === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {language === 'ar' ? cat.label_ar : cat.label_en}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
              >
                <option value="">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
                {statuses.map(st => (
                  <option key={st.value} value={st.value}>
                    {language === 'ar' ? st.label_ar : st.label_en}
                  </option>
                ))}
              </select>

              {/* Expiry Filter */}
              <select
                value={expiryFilter}
                onChange={(e) => { setExpiryFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
              >
                {expiryFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {language === 'ar' ? filter.label_ar : filter.label_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contents Table */}
          <div className="bg-white dark:bg-gov-card/10 rounded-3xl shadow-xl border border-gray-100 dark:border-gov-border/15 overflow-hidden">
            {isLoading ? (
              <div className="p-6">
                {/* Header Skeleton */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gov-border/15 mb-4">
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[15%]"><SkeletonText lines={1} /></div>
                  <div className="w-[10%]"><SkeletonText lines={1} /></div>
                </div>
                {/* Table Rows Skeleton */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </div>
            ) : contents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-white/70">
                {language === 'ar' ? 'لا يوجد محتوى' : 'No content found'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gov-card/10">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'العنوان' : 'Title'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الفئة' : 'Category'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'المشاهدات' : 'Views'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'تاريخ النشر' : 'Published'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'تاريخ الانتهاء' : 'Expires At'}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gov-charcoal dark:text-white">
                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {contents.map((content) => {
                      const expired = isContentExpired(content);
                      const active = isContentActive(content);
                      
                      return (
                        <tr key={content.id} className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${expired ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {content.featured && <Star size={16} className="text-gov-gold fill-gov-gold" />}
                              <span className="text-gov-charcoal dark:text-white font-medium">
                                {language === 'ar' ? content.title_ar : (content.title_en || content.title_ar)}
                              </span>
                              {expired && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                  <AlertCircle size={12} />
                                  {language === 'ar' ? 'منتهي' : 'Expired'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-gov-teal/10 text-gov-teal">
                              {getCategoryLabel(content.category)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(content.status)}`}>
                              {getStatusLabel(content.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-white/70">
                            {content.view_count.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-white/70 text-sm">
                            {content.published_at
                              ? new Date(content.published_at).toLocaleDateString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-white/70 text-sm">
                            {content.expires_at ? (
                              <div className="flex items-center gap-2">
                                <Clock size={14} className={expired ? 'text-red-500' : 'text-green-500'} />
                                <span className={expired ? 'text-red-600 dark:text-red-400' : ''}>
                                  {formatDateTime(content.expires_at)}
                                </span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditContent(content)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gov-teal transition-colors"
                                title={language === 'ar' ? 'تعديل' : 'Edit'}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleViewHistory(content)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gov-gold transition-colors"
                                title={language === 'ar' ? 'تاريخ الإصدارات' : 'Version History'}
                              >
                                <History size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteContent(content.id)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-red-600 transition-colors"
                                title={language === 'ar' ? 'حذف' : 'Delete'}
                              >
                                <Trash2 size={18} />
                              </button>
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
              <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-200 dark:border-gov-border/15">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gov-card/10 text-gov-charcoal dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <span className="px-4 py-2 text-gov-charcoal dark:text-white">
                  {language === 'ar' ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gov-card/10 text-gov-charcoal dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-dm-surface rounded-3xl p-8 max-w-4xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'إضافة محتوى جديد' : 'Add New Content'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-6">
              {formErrors.general && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  {formErrors.general}
                </div>
              )}

              {/* Arabic Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                  {language === 'ar' ? 'المحتوى بالعربية' : 'Arabic Content'}
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      onBlur={() => handleBlur('title_ar')}
                      className={`w-full px-4 py-3 rounded-xl border pl-12 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none transition-all duration-200 ${
                        getFieldStatus('title_ar') === 'invalid'
                          ? 'border-gov-red dark:border-gov-red'
                          : getFieldStatus('title_ar') === 'valid'
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-300 dark:border-gov-border/15'
                      }`}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {getFieldStatus('title_ar') === 'valid' && (
                        <CheckCircle2 className="text-green-500" size={20} />
                      )}
                      {getFieldStatus('title_ar') === 'invalid' && (
                        <XCircle className="text-gov-red" size={20} />
                      )}
                    </div>
                  </div>
                  {formErrors.title_ar && (
                    <p className="mt-2 text-sm text-gov-red dark:text-gov-red flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.title_ar}
                    </p>
                  )}
                  {getFieldStatus('title_ar') === 'valid' && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {language === 'ar' ? 'الحقل صالح' : 'Field is valid'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'المحتوى بالعربية' : 'Content in Arabic'} *
                  </label>
                  <div className="relative">
                    <textarea
                      rows={6}
                      value={formData.content_ar}
                      onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                      onBlur={() => handleBlur('content_ar')}
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none transition-all duration-200 ${
                        getFieldStatus('content_ar') === 'invalid'
                          ? 'border-gov-red dark:border-gov-red'
                          : getFieldStatus('content_ar') === 'valid'
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-300 dark:border-gov-border/15'
                      }`}
                    />
                  </div>
                  {formErrors.content_ar && (
                    <p className="mt-2 text-sm text-gov-red dark:text-gov-red flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.content_ar}
                    </p>
                  )}
                  {getFieldStatus('content_ar') === 'valid' && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {language === 'ar' ? 'الحقل صالح' : 'Field is valid'}
                    </p>
                  )}
                  {/* FR-14: AI Content Tools for Arabic content */}
                  <AIContentTools
                    content={formData.content_ar}
                    onAcceptProofread={(text) => setFormData({ ...formData, content_ar: text })}
                    onAcceptTitle={(title) => setFormData({ ...formData, title_ar: title })}
                    onAcceptSummary={(summary) => {
                      alert(language === 'ar' ? `ملخص المحتوى:\n${summary}` : `Content Summary:\n${summary}`);
                    }}
                    onAcceptTranslation={(text) => setFormData({ ...formData, content_en: text })}
                    translateFrom="ar"
                    className="mt-3"
                  />
                </div>
              </div>

              {/* English Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                  {language === 'ar' ? 'المحتوى بالإنجليزية' : 'English Content'}
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'العنوان بالإنجليزية' : 'Title in English'}
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'المحتوى بالإنجليزية' : 'Content in English'}
                  </label>
                  <textarea
                    rows={6}
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                  {/* AI Content Tools for English content - translate to Arabic */}
                  <AIContentTools
                    content={formData.content_en}
                    onAcceptProofread={(text) => setFormData({ ...formData, content_en: text })}
                    onAcceptTitle={(title) => setFormData({ ...formData, title_en: title })}
                    onAcceptSummary={(summary) => {
                      alert(language === 'ar' ? `ملخص المحتوى:\n${summary}` : `Content Summary:\n${summary}`);
                    }}
                    onAcceptTranslation={(text) => setFormData({ ...formData, content_ar: text })}
                    translateFrom="en"
                    className="mt-3"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الفئة' : 'Category'} *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {language === 'ar' ? cat.label_ar : cat.label_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الحالة' : 'Status'} *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
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
                    {language === 'ar' ? 'تاريخ النشر' : 'Publish Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    {formData.category === 'announcement' && (
                      <span className="text-gov-red mr-1">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      onBlur={() => handleBlur('expires_at')}
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none transition-all duration-200 ${
                        getFieldStatus('expires_at') === 'invalid'
                          ? 'border-gov-red dark:border-gov-red'
                          : getFieldStatus('expires_at') === 'valid'
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-300 dark:border-gov-border/15'
                      }`}
                    />
                  </div>
                  {formErrors.expires_at && (
                    <p className="mt-2 text-sm text-gov-red dark:text-gov-red flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.expires_at}
                    </p>
                  )}
                  {getFieldStatus('expires_at') === 'valid' && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {language === 'ar' ? 'الحقل صالح' : 'Field is valid'}
                    </p>
                  )}
                  {formData.category === 'announcement' && getFieldStatus('expires_at') === 'neutral' && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {language === 'ar' ? 'مطلوب للإعلانات - يرجى تحديد تاريخ ووقت الانتهاء' : 'Required for announcements - Please specify expiry date and time'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-gov-teal focus:ring-gov-teal"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-gov-charcoal dark:text-white">
                    {language === 'ar' ? 'محتوى مميز' : 'Featured Content'}
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {language === 'ar' ? 'إنشاء المحتوى' : 'Create Content'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {showEditModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-dm-surface rounded-3xl p-8 max-w-4xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white">
                {language === 'ar' ? 'تعديل المحتوى' : 'Edit Content'}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedContent(null);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateContent} className="space-y-6">
              {formErrors.general && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  {formErrors.general}
                </div>
              )}

              {/* Arabic Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                  {language === 'ar' ? 'المحتوى بالعربية' : 'Arabic Content'}
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'العنوان بالعربية' : 'Title in Arabic'} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      onBlur={() => handleBlur('title_ar')}
                      className={`w-full px-4 py-3 rounded-xl border pl-12 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none transition-all duration-200 ${
                        getFieldStatus('title_ar') === 'invalid'
                          ? 'border-gov-red dark:border-gov-red'
                          : getFieldStatus('title_ar') === 'valid'
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-300 dark:border-gov-border/15'
                      }`}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {getFieldStatus('title_ar') === 'valid' && (
                        <CheckCircle2 className="text-green-500" size={20} />
                      )}
                      {getFieldStatus('title_ar') === 'invalid' && (
                        <XCircle className="text-gov-red" size={20} />
                      )}
                    </div>
                  </div>
                  {formErrors.title_ar && (
                    <p className="mt-2 text-sm text-gov-red dark:text-gov-red flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.title_ar}
                    </p>
                  )}
                  {getFieldStatus('title_ar') === 'valid' && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {language === 'ar' ? 'الحقل صالح' : 'Field is valid'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'المحتوى بالعربية' : 'Content in Arabic'} *
                  </label>
                  <div className="relative">
                    <textarea
                      rows={6}
                      value={formData.content_ar}
                      onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                      onBlur={() => handleBlur('content_ar')}
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none transition-all duration-200 ${
                        getFieldStatus('content_ar') === 'invalid'
                          ? 'border-gov-red dark:border-gov-red'
                          : getFieldStatus('content_ar') === 'valid'
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-300 dark:border-gov-border/15'
                      }`}
                    />
                  </div>
                  {formErrors.content_ar && (
                    <p className="mt-2 text-sm text-gov-red dark:text-gov-red flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.content_ar}
                    </p>
                  )}
                  {getFieldStatus('content_ar') === 'valid' && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {language === 'ar' ? 'الحقل صالح' : 'Field is valid'}
                    </p>
                  )}
                  {/* FR-14: AI Content Tools for Arabic content */}
                  <AIContentTools
                    content={formData.content_ar}
                    onAcceptProofread={(text) => setFormData({ ...formData, content_ar: text })}
                    onAcceptTitle={(title) => setFormData({ ...formData, title_ar: title })}
                    onAcceptSummary={(summary) => {
                      alert(language === 'ar' ? `ملخص المحتوى:\n${summary}` : `Content Summary:\n${summary}`);
                    }}
                    onAcceptTranslation={(text) => setFormData({ ...formData, content_en: text })}
                    translateFrom="ar"
                    className="mt-3"
                  />
                </div>
              </div>

              {/* English Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gov-charcoal dark:text-white">
                  {language === 'ar' ? 'المحتوى بالإنجليزية' : 'English Content'}
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'العنوان بالإنجليزية' : 'Title in English'}
                  </label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'المحتوى بالإنجليزية' : 'Content in English'}
                  </label>
                  <textarea
                    rows={6}
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                  {/* AI Content Tools for English content - translate to Arabic */}
                  <AIContentTools
                    content={formData.content_en}
                    onAcceptProofread={(text) => setFormData({ ...formData, content_en: text })}
                    onAcceptTitle={(title) => setFormData({ ...formData, title_en: title })}
                    onAcceptSummary={(summary) => {
                      alert(language === 'ar' ? `ملخص المحتوى:\n${summary}` : `Content Summary:\n${summary}`);
                    }}
                    onAcceptTranslation={(text) => setFormData({ ...formData, content_ar: text })}
                    translateFrom="en"
                    className="mt-3"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الفئة' : 'Category'} *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {language === 'ar' ? cat.label_ar : cat.label_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الحالة' : 'Status'} *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
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
                    {language === 'ar' ? 'تاريخ النشر' : 'Publish Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    {formData.category === 'announcement' && (
                      <span className="text-gov-red mr-1">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      onBlur={() => handleBlur('expires_at')}
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none transition-all duration-200 ${
                        getFieldStatus('expires_at') === 'invalid'
                          ? 'border-gov-red dark:border-gov-red'
                          : getFieldStatus('expires_at') === 'valid'
                          ? 'border-green-500 dark:border-green-500'
                          : 'border-gray-300 dark:border-gov-border/15'
                      }`}
                    />
                  </div>
                  {formErrors.expires_at && (
                    <p className="mt-2 text-sm text-gov-red dark:text-gov-red flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.expires_at}
                    </p>
                  )}
                  {getFieldStatus('expires_at') === 'valid' && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {language === 'ar' ? 'الحقل صالح' : 'Field is valid'}
                    </p>
                  )}
                  {formData.category === 'announcement' && getFieldStatus('expires_at') === 'neutral' && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {language === 'ar' ? 'مطلوب للإعلانات - يرجى تحديد تاريخ ووقت الانتهاء' : 'Required for announcements - Please specify expiry date and time'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="edit-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-gov-teal focus:ring-gov-teal"
                  />
                  <label htmlFor="edit-featured" className="text-sm font-bold text-gov-charcoal dark:text-white">
                    {language === 'ar' ? 'محتوى مميز' : 'Featured Content'}
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedContent(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gov-charcoal dark:text-white font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gov-teal text-white font-bold rounded-xl hover:bg-gov-emerald transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </form>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showHistoryModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dm-surface rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-2xl font-bold text-gov-charcoal dark:text-white flex items-center gap-3">
                <History size={28} className="text-gov-gold" />
                {language === 'ar' ? 'تاريخ الإصدارات' : 'Version History'}
                <span className="text-sm font-normal text-gray-400">
                  {language === 'ar' ? selectedContent.title_ar : (selectedContent.title_en || selectedContent.title_ar)}
                </span>
              </h2>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setCompareVersion(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow flex gap-6 min-h-0">
              {/* Versions List */}
              <div className="w-80 shrink-0 border-r border-gray-100 dark:border-gov-border/15 pr-4 overflow-y-auto ltr:border-r ltr:pr-4 rtl:border-l rtl:pl-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  {language === 'ar' ? 'الإصدارات السابقة' : 'Past Versions'}
                </h3>
                {isLoadingVersions ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="animate-spin text-gov-gold" size={32} />
                  </div>
                ) : versions.length === 0 ? (
                  <p className="text-gray-400 text-sm italic py-4">
                    {language === 'ar' ? 'لا توجد إصدارات سابقة' : 'No previous versions'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {versions.map((version) => (
                      <button
                        key={version.version_number}
                        onClick={() => setCompareVersion(version)}
                        className={`w-full text-right rtl:text-right ltr:text-left p-3 rounded-xl transition-all border ${compareVersion?.version_number === version.version_number
                          ? 'bg-gov-gold/10 border-gov-gold'
                          : 'bg-gray-50 dark:bg-gov-card/10 border-transparent hover:border-gray-200'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gov-charcoal dark:text-white">
                            {language === 'ar' ? `إصدار #${version.version_number}` : `Version #${version.version_number}`}
                          </span>
                          <span className="text-[10px] bg-gov-teal/10 text-gov-teal px-1.5 py-0.5 rounded">
                            {version.user?.full_name || 'Admin'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(version.created_at).toLocaleString(language === 'ar' ? 'ar-SY-u-nu-latn' : 'en-US')}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Version Detail / Comparison */}
              <div className="flex-1 overflow-y-auto ltr:pl-4 rtl:pr-4">
                {compareVersion ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gov-charcoal dark:text-white">
                        {language === 'ar' ? `مقارنة الإصدار #${compareVersion.version_number}` : `Comparing Version #${compareVersion.version_number}`}
                      </h3>
                      <button
                        onClick={() => handleRestoreVersion(compareVersion.version_number)}
                        className="flex items-center gap-2 px-4 py-2 bg-gov-teal text-white text-sm font-bold rounded-xl hover:bg-gov-emerald transition-colors shadow-md"
                      >
                        <RotateCcw size={16} />
                        {language === 'ar' ? 'استعادة هذا الإصدار' : 'Restore this version'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Current Content */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase">
                          {language === 'ar' ? 'المحتوى الحالي' : 'Current Content'}
                        </p>
                        <div className="p-4 bg-white dark:bg-gov-card/10 border border-gray-100 dark:border-gov-border/15 rounded-2xl text-sm min-h-[200px]">
                          <h4 className="font-bold mb-2">{selectedContent.title_ar}</h4>
                          <div className="whitespace-pre-wrap text-gray-600 dark:text-white/70">
                            {selectedContent.content_ar}
                          </div>
                        </div>
                      </div>

                      {/* Selected Version */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-gov-gold uppercase">
                          {language === 'ar' ? `إصدار #${compareVersion.version_number}` : `Version #${compareVersion.version_number}`}
                        </p>
                        <div className="p-4 bg-gov-gold/5 border border-gov-gold/20 rounded-2xl text-sm min-h-[200px]">
                          <h4 className="font-bold mb-2">{compareVersion.title_ar}</h4>
                          <div className="whitespace-pre-wrap text-gray-700 dark:text-white/70">
                            {compareVersion.content_ar}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ArrowRightLeft size={48} className="mb-4 opacity-20" />
                    <p>{language === 'ar' ? 'اختر إصداراً للمقارنة' : 'Select a version to compare'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer
        onIncreaseFont={() => { }}
        onDecreaseFont={() => { }}
        onToggleContrast={() => { }}
      />
    </div>
  );
}
