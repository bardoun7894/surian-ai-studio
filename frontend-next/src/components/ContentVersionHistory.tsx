'use client';

import React, { useState, useEffect } from 'react';
import { History, Loader2, Clock, User, RotateCcw, X, GitCompare, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { API_URL } from '@/constants';

interface ContentVersion {
  id: number;
  version_number: number;
  editor: {
    id: number;
    name: string;
  };
  created_at: string;
  changes: Record<string, any>;
}

interface Props {
  contentId: number;
  isOpen: boolean;
  onClose: () => void;
  onRestore?: () => void;
}

const translations = {
  ar: {
    title: 'سجل الإصدارات',
    version: 'الإصدار',
    editor: 'المحرر',
    date: 'التاريخ',
    changes: 'التغييرات',
    restore: 'استعادة',
    close: 'إغلاق',
    loading: 'جاري التحميل...',
    noVersions: 'لا توجد إصدارات سابقة',
    restoreConfirm: 'هل أنت متأكد من استعادة هذا الإصدار؟',
    restoreSuccess: 'تم استعادة الإصدار بنجاح',
    restoreError: 'حدث خطأ أثناء استعادة الإصدار',
    current: 'الحالي',
    created: 'تم الإنشاء',
    field: 'الحقل',
    oldValue: 'القيمة القديمة',
    newValue: 'القيمة الجديدة',
    showChanges: 'عرض التغييرات',
    hideChanges: 'إخفاء التغييرات',
    compare: 'مقارنة',
    compareTitle: 'مقارنة مع الإصدار السابق',
    compareLoading: 'جاري المقارنة...',
    compareError: 'فشل تحميل المقارنة',
    compareNoChanges: 'لا توجد تغييرات بين الإصدارين',
    hideCompare: 'إخفاء المقارنة',
  },
  en: {
    title: 'Version History',
    version: 'Version',
    editor: 'Editor',
    date: 'Date',
    changes: 'Changes',
    restore: 'Restore',
    close: 'Close',
    loading: 'Loading...',
    noVersions: 'No previous versions',
    restoreConfirm: 'Are you sure you want to restore this version?',
    restoreSuccess: 'Version restored successfully',
    restoreError: 'Error restoring version',
    current: 'Current',
    created: 'Created',
    field: 'Field',
    oldValue: 'Old Value',
    newValue: 'New Value',
    showChanges: 'Show Changes',
    hideChanges: 'Hide Changes',
    compare: 'Compare',
    compareTitle: 'Compare with Previous Version',
    compareLoading: 'Comparing...',
    compareError: 'Failed to load comparison',
    compareNoChanges: 'No changes between versions',
    hideCompare: 'Hide Compare',
  }
};

export default function ContentVersionHistory({ contentId, isOpen, onClose, onRestore }: Props) {
  const { language } = useLanguage();
  const t = translations[language];

  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());
  const [restoring, setRestoring] = useState<number | null>(null);
  const [comparingVersion, setComparingVersion] = useState<number | null>(null);
  const [compareLoading, setCompareLoading] = useState<number | null>(null);
  const [compareDiff, setCompareDiff] = useState<Record<number, { field: string; old_value: string; new_value: string }[]>>({});
  const [compareError, setCompareError] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, contentId]);

  const fetchVersions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/admin/content/${contentId}/versions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch versions');

      const data = await response.json();
      setVersions(data.success ? data.data : []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (versionNumber: number) => {
    if (!confirm(t.restoreConfirm)) return;

    try {
      setRestoring(versionNumber);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/v1/admin/content/${contentId}/versions/${versionNumber}/restore`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to restore version');

      alert(t.restoreSuccess);
      onRestore?.();
      fetchVersions();
    } catch (error) {
      console.error('Error restoring version:', error);
      alert(t.restoreError);
    } finally {
      setRestoring(null);
    }
  };

  const toggleExpand = (versionNumber: number) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionNumber)) {
      newExpanded.delete(versionNumber);
    } else {
      newExpanded.add(versionNumber);
    }
    setExpandedVersions(newExpanded);
  };

  const handleCompare = async (versionNumber: number) => {
    // Toggle off if already showing
    if (comparingVersion === versionNumber) {
      setComparingVersion(null);
      return;
    }

    // If already fetched, just show it
    if (compareDiff[versionNumber]) {
      setComparingVersion(versionNumber);
      return;
    }

    // Fetch the diff from the API
    try {
      setCompareLoading(versionNumber);
      setCompareError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/v1/admin/content/${contentId}/versions/${versionNumber}/compare`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch comparison');

      const data = await response.json();
      const changes = data.changes || data.diff || data.data || [];
      setCompareDiff(prev => ({ ...prev, [versionNumber]: changes }));
      setComparingVersion(versionNumber);
    } catch (error) {
      console.error('Error fetching comparison:', error);
      setCompareError(versionNumber);
    } finally {
      setCompareLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SY' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatFieldName = (field: string) => {
    const fieldNames: Record<string, { ar: string; en: string }> = {
      title_ar: { ar: 'العنوان (عربي)', en: 'Title (Arabic)' },
      title_en: { ar: 'العنوان (إنجليزي)', en: 'Title (English)' },
      content_ar: { ar: 'المحتوى (عربي)', en: 'Content (Arabic)' },
      content_en: { ar: 'المحتوى (إنجليزي)', en: 'Content (English)' },
      slug: { ar: 'الرابط', en: 'Slug' },
      category: { ar: 'التصنيف', en: 'Category' },
      status: { ar: 'الحالة', en: 'Status' },
      featured: { ar: 'مميز', en: 'Featured' },
      published_at: { ar: 'تاريخ النشر', en: 'Published At' },
    };

    return fieldNames[field]?.[language] || field;
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return String(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6" />
            <h2 className="text-xl font-bold">{t.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-primary-700 rounded transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.noVersions}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => {
                const isExpanded = expandedVersions.has(version.version_number);
                const isLatest = index === 0;

                return (
                  <div
                    key={version.id}
                    className={`border rounded-lg overflow-hidden ${
                      isLatest ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                    }`}
                  >
                    {/* Version Header */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-900">
                            {t.version} {version.version_number}
                          </span>
                          {isLatest && (
                            <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                              {t.current}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {version.editor.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(version.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isLatest && (
                          <button
                            onClick={() => handleRestore(version.version_number)}
                            disabled={restoring === version.version_number}
                            className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                          >
                            {restoring === version.version_number ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                            {t.restore}
                          </button>
                        )}

                        {!isLatest && version.version_number > 1 && (
                          <button
                            onClick={() => handleCompare(version.version_number)}
                            disabled={compareLoading === version.version_number}
                            className={`px-3 py-1.5 border rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                              comparingVersion === version.version_number
                                ? 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {compareLoading === version.version_number ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <GitCompare className="w-4 h-4" />
                            )}
                            {comparingVersion === version.version_number ? t.hideCompare : t.compare}
                          </button>
                        )}

                        {Object.keys(version.changes).length > 0 && !version.changes.created && (
                          <button
                            onClick={() => toggleExpand(version.version_number)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                {t.hideChanges}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                {t.showChanges}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Changes Details */}
                    {isExpanded && version.changes && !version.changes.created && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="space-y-3">
                          {Object.entries(version.changes).map(([field, change]: [string, any]) => (
                            <div key={field} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="font-medium text-gray-900 mb-2">
                                {formatFieldName(field)}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500 mb-1">{t.oldValue}:</div>
                                  <div className="text-gray-900 bg-red-50 p-2 rounded border border-red-200">
                                    {formatValue(change.old)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">{t.newValue}:</div>
                                  <div className="text-gray-900 bg-green-50 p-2 rounded border border-green-200">
                                    {formatValue(change.new)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Compare Diff */}
                    {comparingVersion === version.version_number && (
                      <div className="border-t border-blue-200 bg-blue-50 p-4">
                        <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                          <GitCompare className="w-4 h-4" />
                          {t.compareTitle}
                        </h4>
                        {compareError === version.version_number ? (
                          <p className="text-sm text-red-600">{t.compareError}</p>
                        ) : compareDiff[version.version_number]?.length === 0 ? (
                          <p className="text-sm text-gray-600 italic">{t.compareNoChanges}</p>
                        ) : (
                          <div className="space-y-3">
                            {compareDiff[version.version_number]?.map((change, idx) => (
                              <div key={idx} className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="font-medium text-gray-900 mb-2">
                                  {formatFieldName(change.field)}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="text-gray-500 mb-1">{t.oldValue}:</div>
                                    <div className="text-gray-900 bg-red-50 p-2 rounded border border-red-200 whitespace-pre-wrap break-words">
                                      {formatValue(change.old_value)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500 mb-1">{t.newValue}:</div>
                                    <div className="text-gray-900 bg-green-50 p-2 rounded border border-green-200 whitespace-pre-wrap break-words">
                                      {formatValue(change.new_value)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Created indicator */}
                    {version.changes?.created && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 italic">
                        {t.created}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
