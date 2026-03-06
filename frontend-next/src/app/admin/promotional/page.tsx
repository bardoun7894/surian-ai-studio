'use client';

import React, { useState, useEffect } from 'react';
import {
  Image,
  Search,
  Filter,
  Loader2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Video,
  Layout,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PromotionalSection {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  button_text_ar: string | null;
  button_text_en: string | null;
  button_url: string | null;
  image: string | null;
  video_url: string | null;
  background_color: string | null;
  icon: string | null;
  type: 'banner' | 'video' | 'promo' | 'stats';
  position: 'hero' | 'grid_main' | 'grid_side' | 'grid_bottom';
  display_order: number;
  is_active: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const initialFormData: Partial<PromotionalSection> = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  button_text_ar: '',
  button_text_en: '',
  button_url: '',
  image: '',
  video_url: '',
  background_color: '#1a4d3e',
  type: 'promo',
  position: 'grid_bottom',
  display_order: 0,
  is_active: true,
  published_at: null,
  expires_at: null
};

export default function AdminPromotionalPage() {
  const { language } = useLanguage();
  const [sections, setSections] = useState<PromotionalSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<PromotionalSection>>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSections();
  }, [filterPosition]);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = filterPosition === 'all'
        ? '/api/v1/public/promotional-sections'
        : `/api/v1/public/promotional-sections/position/${filterPosition}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setSections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      // Mock data
      setSections([
        {
          id: 1,
          title_ar: 'بوابة الاستثمار',
          title_en: 'Investment Portal',
          description_ar: 'اكتشف فرص الاستثمار في سوريا',
          description_en: 'Discover investment opportunities in Syria',
          button_text_ar: 'اكتشف المزيد',
          button_text_en: 'Discover More',
          button_url: '/investment',
          image: '/assets/investment.jpg',
          video_url: null,
          background_color: '#1a4d3e',
          icon: null,
          type: 'promo',
          position: 'hero',
          display_order: 1,
          is_active: true,
          published_at: new Date().toISOString(),
          expires_at: null,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title_ar: 'فيديو ترويجي',
          title_en: 'Promotional Video',
          description_ar: 'شاهد إنجازاتنا',
          description_en: 'Watch our achievements',
          button_text_ar: 'شاهد الآن',
          button_text_en: 'Watch Now',
          button_url: null,
          image: '/assets/video-thumb.jpg',
          video_url: 'https://example.com/video.mp4',
          background_color: null,
          icon: null,
          type: 'video',
          position: 'grid_main',
          display_order: 2,
          is_active: true,
          published_at: new Date().toISOString(),
          expires_at: null,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (section: PromotionalSection) => {
    setFormData(section);
    setEditingId(section.id);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title_ar || !formData.title_en) {
      alert(language === 'ar' ? 'يرجى ملء العنوان بالعربية والإنجليزية' : 'Please fill title in both Arabic and English');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = modalMode === 'create'
        ? '/api/v1/admin/promotional-sections'
        : `/api/v1/admin/promotional-sections/${editingId}`;

      const res = await fetch(url, {
        method: modalMode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchSections();
        setShowModal(false);
        setFormData(initialFormData);
      } else {
        alert(language === 'ar' ? 'فشل حفظ البيانات' : 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      // For demo, just update local state
      if (modalMode === 'create') {
        const newSection: PromotionalSection = {
          ...formData as PromotionalSection,
          id: Date.now(),
          created_at: new Date().toISOString()
        };
        setSections([...sections, newSection]);
      } else {
        setSections(sections.map(s => s.id === editingId ? { ...s, ...formData } : s));
      }
      setShowModal(false);
      setFormData(initialFormData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا القسم؟' : 'Are you sure you want to delete this section?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/admin/promotional-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setSections(sections.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting section:', error);
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const toggleActive = async (section: PromotionalSection) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/admin/promotional-sections/${section.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ...section, is_active: !section.is_active })
      });
      setSections(sections.map(s => s.id === section.id ? { ...s, is_active: !s.is_active } : s));
    } catch (error) {
      console.error('Error toggling active:', error);
      setSections(sections.map(s => s.id === section.id ? { ...s, is_active: !s.is_active } : s));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-purple-500" />;
      case 'banner': return <Layout size={16} className="text-blue-500" />;
      default: return <Image size={16} className="text-green-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      banner: { ar: 'بانر', en: 'Banner' },
      video: { ar: 'فيديو', en: 'Video' },
      promo: { ar: 'ترويجي', en: 'Promotional' },
      stats: { ar: 'إحصائيات', en: 'Statistics' }
    };
    return language === 'ar' ? labels[type]?.ar || type : labels[type]?.en || type;
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      hero: { ar: 'الرئيسي', en: 'Hero' },
      grid_main: { ar: 'الشبكة الرئيسية', en: 'Grid Main' },
      grid_side: { ar: 'الشبكة الجانبية', en: 'Grid Side' },
      grid_bottom: { ar: 'أسفل الشبكة', en: 'Grid Bottom' }
    };
    return language === 'ar' ? labels[position]?.ar || position : labels[position]?.en || position;
  };

  const filteredSections = sections.filter(s => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return s.title_ar.toLowerCase().includes(query) ||
             s.title_en.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dm-bg p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gov-charcoal dark:text-white">
              {language === 'ar' ? 'الأقسام الترويجية' : 'Promotional Sections'}
            </h1>
            <p className="text-gray-500 dark:text-white/70 mt-1">
              {language === 'ar' ? 'إدارة المحتوى الترويجي على الصفحة الرئيسية' : 'Manage promotional content on homepage'}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-gov-teal text-white font-bold rounded-2xl hover:bg-gov-emerald transition-all shadow-lg"
          >
            <Plus size={20} />
            {language === 'ar' ? 'إضافة قسم جديد' : 'Add New Section'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
              className="w-full pl-12 rtl:pl-4 rtl:pr-12 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
            >
              <option value="all">{language === 'ar' ? 'جميع المواقع' : 'All Positions'}</option>
              <option value="hero">{language === 'ar' ? 'الرئيسي' : 'Hero'}</option>
              <option value="grid_main">{language === 'ar' ? 'الشبكة الرئيسية' : 'Grid Main'}</option>
              <option value="grid_side">{language === 'ar' ? 'الشبكة الجانبية' : 'Grid Side'}</option>
              <option value="grid_bottom">{language === 'ar' ? 'أسفل الشبكة' : 'Grid Bottom'}</option>
            </select>
          </div>

          <button
            onClick={fetchSections}
            className="p-3 bg-white dark:bg-gov-card/10 rounded-xl border border-gray-200 dark:border-gov-border/15 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Sections Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gov-gold" size={40} />
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="bg-white dark:bg-gov-card/10 rounded-3xl border border-gray-100 dark:border-gov-border/15 p-12 text-center">
          <Image size={48} className="mx-auto text-gray-300 dark:text-white/70 mb-4" />
          <p className="text-gray-500 dark:text-white/70">
            {language === 'ar' ? 'لا توجد أقسام ترويجية' : 'No promotional sections found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className={`bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15 overflow-hidden ${
                !section.is_active ? 'opacity-60' : ''
              }`}
            >
              {/* Image Preview */}
              <div className="relative h-40 bg-gray-100 dark:bg-dm-surface">
                {section.image ? (
                  <img
                    src={section.image}
                    alt={language === 'ar' ? section.title_ar : section.title_en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: section.background_color || '#1a4d3e' }}
                  >
                    {getTypeIcon(section.type)}
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg bg-black/50 text-white text-xs flex items-center gap-1">
                    {getTypeIcon(section.type)}
                    {getTypeLabel(section.type)}
                  </span>
                </div>

                {/* Video indicator */}
                {section.video_url && (
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                    <Video size={20} className="text-white drop-shadow-lg" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gov-charcoal dark:text-white mb-1 line-clamp-1">
                  {language === 'ar' ? section.title_ar : section.title_en}
                </h3>
                <p className="text-sm text-gray-500 dark:text-white/70 mb-3 line-clamp-2">
                  {language === 'ar' ? section.description_ar : section.description_en}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70">
                    {getPositionLabel(section.position)}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70">
                    #{section.display_order}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gov-border/15">
                  <button
                    onClick={() => toggleActive(section)}
                    className={`flex items-center gap-1 text-sm ${
                      section.is_active ? 'text-green-500' : 'text-gray-400'
                    }`}
                  >
                    {section.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    {section.is_active
                      ? (language === 'ar' ? 'نشط' : 'Active')
                      : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit size={18} className="text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-dm-surface rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gov-charcoal dark:text-white">
                {modalMode === 'create'
                  ? (language === 'ar' ? 'إضافة قسم جديد' : 'Add New Section')
                  : (language === 'ar' ? 'تعديل القسم' : 'Edit Section')}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Title AR */}
              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'} *
                </label>
                <input
                  type="text"
                  value={formData.title_ar || ''}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  dir="rtl"
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                  {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                </label>
                <input
                  type="text"
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                />
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description_ar || ''}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none resize-none"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description_en || ''}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none resize-none"
                  />
                </div>
              </div>

              {/* Type and Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </label>
                  <select
                    value={formData.type || 'promo'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PromotionalSection['type'] })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  >
                    <option value="promo">{language === 'ar' ? 'ترويجي' : 'Promotional'}</option>
                    <option value="banner">{language === 'ar' ? 'بانر' : 'Banner'}</option>
                    <option value="video">{language === 'ar' ? 'فيديو' : 'Video'}</option>
                    <option value="stats">{language === 'ar' ? 'إحصائيات' : 'Statistics'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'الموقع' : 'Position'}
                  </label>
                  <select
                    value={formData.position || 'grid_bottom'}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as PromotionalSection['position'] })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  >
                    <option value="hero">{language === 'ar' ? 'الرئيسي' : 'Hero'}</option>
                    <option value="grid_main">{language === 'ar' ? 'الشبكة الرئيسية' : 'Grid Main'}</option>
                    <option value="grid_side">{language === 'ar' ? 'الشبكة الجانبية' : 'Grid Side'}</option>
                    <option value="grid_bottom">{language === 'ar' ? 'أسفل الشبكة' : 'Grid Bottom'}</option>
                  </select>
                </div>
              </div>

              {/* Image URL and Video URL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
                  </label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/assets/image.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'رابط الفيديو' : 'Video URL'}
                  </label>
                  <input
                    type="text"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </div>

              {/* Button Text and URL */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'نص الزر (عربي)' : 'Button (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.button_text_ar || ''}
                    onChange={(e) => setFormData({ ...formData, button_text_ar: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'نص الزر (إنجليزي)' : 'Button (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.button_text_en || ''}
                    onChange={(e) => setFormData({ ...formData, button_text_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'رابط الزر' : 'Button URL'}
                  </label>
                  <input
                    type="text"
                    value={formData.button_url || ''}
                    onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
              </div>

              {/* Display Order and Background Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'ترتيب العرض' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    value={formData.display_order || 0}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gov-charcoal dark:text-white mb-2">
                    {language === 'ar' ? 'لون الخلفية' : 'Background Color'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.background_color || '#1a4d3e'}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                      className="w-14 h-12 rounded-xl border border-gray-200 dark:border-gov-border/15 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.background_color || '#1a4d3e'}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gov-border/15 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white focus:ring-2 focus:ring-gov-teal outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gov-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gov-teal"></div>
                </label>
                <span className="text-sm font-bold text-gov-charcoal dark:text-white">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gov-border/15">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/10 text-gov-charcoal dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 px-4 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {isSaving
                  ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                  : (language === 'ar' ? 'حفظ' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
