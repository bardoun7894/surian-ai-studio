'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Save, Loader2, Check, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface DirectorateLocation {
  id: string;
  name_ar: string;
  name_en: string;
  latitude: number | null;
  longitude: number | null;
  address_ar: string;
  address_en: string;
  phone?: string;
  email?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api/v1';

export default function AdminDirectoratesPage() {
  const { language } = useLanguage();
  const { token } = useAuth();
  const isAr = language === 'ar';

  const [directorates, setDirectorates] = useState<DirectorateLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, { latitude: string; longitude: string; address_ar: string; address_en: string }>>({});

  useEffect(() => {
    fetchDirectorates();
  }, []);

  const fetchDirectorates = async () => {
    try {
      const res = await fetch(`${API_BASE}/public/directorates`);
      if (res.ok) {
        const data = await res.json();
        const dirs = Array.isArray(data) ? data : (data.data || []);
        setDirectorates(dirs);
        // Init edit data from existing values
        const initial: Record<string, { latitude: string; longitude: string; address_ar: string; address_en: string }> = {};
        for (const d of dirs) {
          initial[d.id] = {
            latitude: d.latitude != null ? String(d.latitude) : '',
            longitude: d.longitude != null ? String(d.longitude) : '',
            address_ar: d.address_ar || '',
            address_en: d.address_en || '',
          };
        }
        setEditData(initial);
      }
    } catch (e) {
      console.error('Failed to fetch directorates:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    const data = editData[id];
    if (!data || !data.latitude || !data.longitude) return;

    setSaving(id);
    try {
      const res = await fetch(`${API_BASE}/admin/directorates/${id}/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          address_ar: data.address_ar || null,
          address_en: data.address_en || null,
        }),
      });

      if (res.ok) {
        setSaved(id);
        setTimeout(() => setSaved(null), 2000);
      }
    } catch (e) {
      console.error('Failed to save location:', e);
    } finally {
      setSaving(null);
    }
  };

  const updateField = (id: string, field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gov-gold" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">
          {isAr ? 'إدارة مواقع الإدارات' : 'Directorate Locations'}
        </h1>
        <p className="text-gray-500 dark:text-white/70">
          {isAr ? 'تحديد مواقع الإدارات على الخريطة' : 'Set directorate locations on the map'}
        </p>
      </div>

      <div className="space-y-4">
        {directorates.map((dir) => {
          const data = editData[dir.id] || { latitude: '', longitude: '', address_ar: '', address_en: '' };
          const hasCoords = data.latitude && data.longitude;
          const isSaving = saving === dir.id;
          const isSaved = saved === dir.id;

          return (
            <div
              key={dir.id}
              className="bg-white dark:bg-dm-surface rounded-2xl border border-gray-100 dark:border-gov-border/15 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gov-forest/5 dark:bg-gov-gold/10 text-gov-forest dark:text-gov-gold flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gov-charcoal dark:text-white">
                    {isAr ? dir.name_ar : (dir.name_en || dir.name_ar)}
                  </h3>
                  {hasCoords && (
                    <span className="text-xs text-gov-teal flex items-center gap-1">
                      <MapPin size={10} />
                      {data.latitude}, {data.longitude}
                    </span>
                  )}
                  {!hasCoords && (
                    <span className="text-xs text-gray-400">
                      {isAr ? 'لم يتم تحديد الموقع' : 'Location not set'}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 mb-1">
                    {isAr ? 'خط العرض' : 'Latitude'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={data.latitude}
                    onChange={(e) => updateField(dir.id, 'latitude', e.target.value)}
                    placeholder="33.5138"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gov-border/25 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white text-sm focus:outline-none focus:border-gov-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 mb-1">
                    {isAr ? 'خط الطول' : 'Longitude'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={data.longitude}
                    onChange={(e) => updateField(dir.id, 'longitude', e.target.value)}
                    placeholder="36.2765"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gov-border/25 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white text-sm focus:outline-none focus:border-gov-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 mb-1">
                    {isAr ? 'العنوان (عربي)' : 'Address (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={data.address_ar}
                    onChange={(e) => updateField(dir.id, 'address_ar', e.target.value)}
                    placeholder={isAr ? 'دمشق، سوريا' : 'Damascus, Syria'}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gov-border/25 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white text-sm focus:outline-none focus:border-gov-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-white/50 mb-1">
                    {isAr ? 'العنوان (إنكليزي)' : 'Address (English)'}
                  </label>
                  <input
                    type="text"
                    value={data.address_en}
                    onChange={(e) => updateField(dir.id, 'address_en', e.target.value)}
                    placeholder="Damascus, Syria"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gov-border/25 bg-white dark:bg-dm-surface text-gov-charcoal dark:text-white text-sm focus:outline-none focus:border-gov-gold"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSave(dir.id)}
                  disabled={isSaving || !data.latitude || !data.longitude}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSaved
                      ? 'bg-green-500 text-white'
                      : 'bg-gov-forest dark:bg-gov-button text-white hover:bg-gov-forest/90 disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {isSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isSaved ? (
                    <Check size={14} />
                  ) : (
                    <Save size={14} />
                  )}
                  {isSaved
                    ? (isAr ? 'تم الحفظ' : 'Saved')
                    : (isAr ? 'حفظ الموقع' : 'Save Location')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

