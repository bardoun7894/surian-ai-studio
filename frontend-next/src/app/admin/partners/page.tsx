'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Handshake,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  GripVertical,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { API } from '@/lib/repository';
import { toast } from 'sonner';

interface GovernmentPartner {
  id: number;
  name_ar: string;
  name_en: string | null;
  logo: string | null;
  url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const initialFormData = {
  name_ar: '',
  name_en: '',
  url: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminPartnersPage() {
  const { language } = useLanguage();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const isAr = language === 'ar';

  const [partners, setPartners] = useState<GovernmentPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState(initialFormData);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth check
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!currentUser?.role?.name?.includes('admin')) {
        router.push('/admin');
      }
    }
  }, [authLoading, isAuthenticated, currentUser, router]);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const result = await API.governmentPartners.adminList({ search: searchQuery });
      setPartners(result.data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      toast.error(isAr ? 'فشل تحميل الشركاء' : 'Failed to load partners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchPartners();
  }, [isAuthenticated, searchQuery]);

  const openCreateModal = () => {
    setFormData(initialFormData);
    setLogoFile(null);
    setLogoPreview(null);
    setEditingId(null);
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (partner: GovernmentPartner) => {
    setFormData({
      name_ar: partner.name_ar,
      name_en: partner.name_en || '',
      url: partner.url || '',
      sort_order: partner.sort_order,
      is_active: partner.is_active,
    });
    setLogoFile(null);
    setLogoPreview(partner.logo || null);
    setEditingId(partner.id);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.name_ar.trim()) {
      toast.error(isAr ? 'الاسم بالعربية مطلوب' : 'Arabic name is required');
      return;
    }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('name_ar', formData.name_ar);
      if (formData.name_en) fd.append('name_en', formData.name_en);
      if (formData.url) fd.append('url', formData.url);
      fd.append('sort_order', String(formData.sort_order));
      fd.append('is_active', formData.is_active ? '1' : '0');
      if (logoFile) fd.append('logo', logoFile);

      if (modalMode === 'create') {
        await API.governmentPartners.create(fd);
        toast.success(isAr ? 'تمت إضافة الشريك بنجاح' : 'Partner added successfully');
      } else if (editingId) {
        await API.governmentPartners.update(editingId, fd);
        toast.success(isAr ? 'تم تحديث الشريك بنجاح' : 'Partner updated successfully');
      }

      setShowModal(false);
      fetchPartners();
    } catch (error: any) {
      toast.error(error.message || (isAr ? 'فشلت العملية' : 'Operation failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الشريك؟' : 'Are you sure you want to delete this partner?')) return;

    try {
      await API.governmentPartners.delete(id);
      toast.success(isAr ? 'تم حذف الشريك' : 'Partner deleted');
      fetchPartners();
    } catch {
      toast.error(isAr ? 'فشل الحذف' : 'Failed to delete');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await API.governmentPartners.toggleActive(id);
      setPartners(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
      toast.success(isAr ? 'تم تحديث الحالة' : 'Status updated');
    } catch {
      toast.error(isAr ? 'فشل تحديث الحالة' : 'Failed to update status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gov-gold/10 flex items-center justify-center">
            <Handshake className="text-gov-gold" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gov-charcoal dark:text-white">
              {isAr ? 'الجهات الحكومية الشريكة' : 'Government Partners'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/60">
              {isAr ? 'إدارة الجهات الشريكة المعروضة على الصفحة الرئيسية' : 'Manage partner entities shown on the homepage'}
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-gov-gold text-gov-forest font-bold text-sm rounded-xl hover:bg-gov-gold/90 transition-colors shadow-sm"
        >
          <Plus size={18} />
          {isAr ? 'إضافة شريك' : 'Add Partner'}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={isAr ? 'بحث عن شريك...' : 'Search partners...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full ps-12 pe-4 py-3 bg-white dark:bg-dm-surface border border-gray-200 dark:border-gov-border/15 rounded-xl text-sm focus:ring-2 focus:ring-gov-gold/30 focus:border-gov-gold transition-all"
        />
      </div>

      {/* Partners List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-dm-surface rounded-xl p-4 border border-gray-100 dark:border-gov-border/15 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/4" />
                </div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15">
          <Handshake size={48} className="mx-auto text-gray-300 dark:text-white/20 mb-4" />
          <p className="text-gray-500 dark:text-white/60 font-medium">
            {isAr ? 'لا توجد جهات شريكة' : 'No partners found'}
          </p>
          <button onClick={openCreateModal} className="mt-4 text-gov-gold font-bold text-sm hover:underline">
            {isAr ? 'إضافة أول شريك' : 'Add first partner'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className={`bg-white dark:bg-dm-surface rounded-xl p-4 border transition-all hover:shadow-md ${
                partner.is_active
                  ? 'border-gray-100 dark:border-gov-border/15'
                  : 'border-red-200/50 dark:border-red-900/30 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Grip / Sort indicator */}
                <GripVertical size={16} className="text-gray-300 dark:text-white/20 flex-shrink-0 cursor-grab" />

                {/* Logo */}
                <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gov-border/15">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name_ar} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Handshake size={24} className="text-gray-300 dark:text-white/20" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gov-charcoal dark:text-white truncate">
                    {isAr ? partner.name_ar : (partner.name_en || partner.name_ar)}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    {partner.name_en && isAr && (
                      <span className="text-xs text-gray-400 dark:text-white/40 truncate">{partner.name_en}</span>
                    )}
                    {partner.url && (
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gov-teal hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={10} />
                        {isAr ? 'الموقع' : 'Website'}
                      </a>
                    )}
                    <span className="text-xs text-gray-400 dark:text-white/30">
                      #{partner.sort_order}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(partner.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      partner.is_active
                        ? 'text-gov-emerald hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                    title={partner.is_active ? (isAr ? 'تعطيل' : 'Deactivate') : (isAr ? 'تفعيل' : 'Activate')}
                  >
                    {partner.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <button
                    onClick={() => openEditModal(partner)}
                    className="p-2 rounded-lg text-gov-teal hover:bg-gov-teal/10 transition-colors"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="p-2 rounded-lg text-gov-cherry hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-dm-surface rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gov-border/15">
              <h2 className="text-lg font-bold text-gov-charcoal dark:text-white">
                {modalMode === 'create'
                  ? (isAr ? 'إضافة شريك جديد' : 'Add New Partner')
                  : (isAr ? 'تعديل الشريك' : 'Edit Partner')}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/80 mb-2">
                  {isAr ? 'الشعار' : 'Logo'}
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gov-border/30 flex items-center justify-center cursor-pointer hover:border-gov-gold transition-colors overflow-hidden"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Upload size={24} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-400 dark:text-white/40">
                    {isAr ? 'PNG أو SVG، حتى 2MB' : 'PNG or SVG, up to 2MB'}
                  </div>
                </div>
              </div>

              {/* Name AR */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/80 mb-1">
                  {isAr ? 'الاسم بالعربية' : 'Arabic Name'} <span className="text-gov-cherry">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dm-bg border border-gray-200 dark:border-gov-border/15 rounded-xl text-sm focus:ring-2 focus:ring-gov-gold/30 focus:border-gov-gold transition-all"
                  placeholder={isAr ? 'مثال: وزارة الصناعة' : 'e.g. Ministry of Industry'}
                  dir="rtl"
                />
              </div>

              {/* Name EN */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/80 mb-1">
                  {isAr ? 'الاسم بالإنكليزية' : 'English Name'}
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dm-bg border border-gray-200 dark:border-gov-border/15 rounded-xl text-sm focus:ring-2 focus:ring-gov-gold/30 focus:border-gov-gold transition-all"
                  placeholder="e.g. Ministry of Industry"
                  dir="ltr"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/80 mb-1">
                  {isAr ? 'رابط الموقع' : 'Website URL'}
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-dm-bg border border-gray-200 dark:border-gov-border/15 rounded-xl text-sm focus:ring-2 focus:ring-gov-gold/30 focus:border-gov-gold transition-all"
                  placeholder="https://example.gov.sy"
                  dir="ltr"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-white/80 mb-1">
                  {isAr ? 'ترتيب العرض' : 'Sort Order'}
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-32 px-4 py-2.5 bg-white dark:bg-dm-bg border border-gray-200 dark:border-gov-border/15 rounded-xl text-sm focus:ring-2 focus:ring-gov-gold/30 focus:border-gov-gold transition-all"
                  min={0}
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-gov-emerald' : 'bg-gray-300 dark:bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.is_active ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5'}`} />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-white/80">
                  {formData.is_active ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'معطّل' : 'Inactive')}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gov-border/15">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gov-gold text-gov-forest font-bold text-sm rounded-xl hover:bg-gov-gold/90 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {modalMode === 'create'
                  ? (isAr ? 'إضافة' : 'Add')
                  : (isAr ? 'حفظ' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
