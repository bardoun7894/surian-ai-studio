'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Database,
  Download,
  Trash2,
  Plus,
  Loader2,
  HardDrive,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { TableRowSkeleton } from '@/components/Skeleton';
import { SkeletonText } from '@/components/SkeletonLoader';

interface Backup {
  filename: string;
  size: string;
  created_at: string;
  path?: string;
}

export default function BackupManagementPage() {
  const { language } = useLanguage();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const t = {
    title: language === 'ar' ? 'إدارة النسخ الاحتياطية' : 'Backup Management',
    subtitle: language === 'ar' ? 'إنشاء وتحميل وحذف النسخ الاحتياطية لقاعدة البيانات' : 'Create, download, and delete database backups',
    createBackup: language === 'ar' ? 'إنشاء نسخة احتياطية' : 'Create Backup',
    creating: language === 'ar' ? 'جاري الإنشاء...' : 'Creating...',
    noBackups: language === 'ar' ? 'لا توجد نسخ احتياطية' : 'No backups found',
    download: language === 'ar' ? 'تحميل' : 'Download',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    filename: language === 'ar' ? 'اسم الملف' : 'Filename',
    size: language === 'ar' ? 'الحجم' : 'Size',
    date: language === 'ar' ? 'التاريخ' : 'Date',
    actions: language === 'ar' ? 'إجراءات' : 'Actions',
    createSuccess: language === 'ar' ? 'تم إنشاء النسخة الاحتياطية بنجاح' : 'Backup created successfully',
    createFailed: language === 'ar' ? 'فشل إنشاء النسخة الاحتياطية' : 'Failed to create backup',
    deleteSuccess: language === 'ar' ? 'تم حذف النسخة الاحتياطية' : 'Backup deleted',
    deleteFailed: language === 'ar' ? 'فشل حذف النسخة الاحتياطية' : 'Failed to delete backup',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من حذف هذه النسخة؟' : 'Are you sure you want to delete this backup?',
  };

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Accept': 'application/json'
  });

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/backup', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setBackups(data.data || data || []);
      }
    } catch (err) {
      console.error('Failed to fetch backups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBackups(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/v1/admin/backup', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast.success(t.createSuccess);
        fetchBackups();
      } else {
        toast.error(t.createFailed);
      }
    } catch {
      toast.error(t.createFailed);
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      const res = await fetch(`/api/v1/admin/backup/${encodeURIComponent(filename)}/download`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(t.confirmDelete)) return;
    setDeletingFile(filename);
    try {
      const res = await fetch(`/api/v1/admin/backup/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        toast.success(t.deleteSuccess);
        fetchBackups();
      } else {
        toast.error(t.deleteFailed);
      }
    } catch {
      toast.error(t.deleteFailed);
    } finally {
      setDeletingFile(null);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gov-charcoal dark:text-white mb-2">{t.title}</h1>
          <p className="text-gray-500 dark:text-white/70">{t.subtitle}</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-3 bg-gov-teal text-white rounded-xl font-bold hover:bg-gov-emerald transition-colors disabled:opacity-50 shadow-lg shadow-gov-teal/20"
        >
          {creating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          {creating ? t.creating : t.createBackup}
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15 overflow-hidden p-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gov-border/15 mb-4">
            <div className="w-[40%]"><SkeletonText lines={1} /></div>
            <div className="w-[20%]"><SkeletonText lines={1} /></div>
            <div className="w-[20%]"><SkeletonText lines={1} /></div>
            <div className="w-[20%]"><SkeletonText lines={1} /></div>
          </div>
          {/* Table Rows Skeleton */}
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : backups.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15">
          <Database size={64} className="mx-auto text-gray-300 dark:text-white/70 mb-4" />
          <p className="text-gray-500 dark:text-white/70 text-lg font-bold">{t.noBackups}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gov-card/10 rounded-2xl border border-gray-100 dark:border-gov-border/15 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gov-card/10 border-b border-gray-100 dark:border-gov-border/15">
              <tr>
                <th className="text-right p-4 text-sm font-bold text-gray-600 dark:text-white/70">{t.filename}</th>
                <th className="text-right p-4 text-sm font-bold text-gray-600 dark:text-white/70">{t.size}</th>
                <th className="text-right p-4 text-sm font-bold text-gray-600 dark:text-white/70">{t.date}</th>
                <th className="text-right p-4 text-sm font-bold text-gray-600 dark:text-white/70">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.filename} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <HardDrive size={18} className="text-gov-teal" />
                      <span className="font-mono text-sm text-gov-charcoal dark:text-white">{backup.filename}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-white/70">{backup.size}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-white/70">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(backup.created_at).toLocaleString(language === 'ar' ? 'ar-SY' : 'en-US')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(backup.filename)}
                        className="p-2 rounded-lg bg-gov-teal/10 text-gov-teal hover:bg-gov-teal hover:text-white transition-colors"
                        title={t.download}
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(backup.filename)}
                        disabled={deletingFile === backup.filename}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                        title={t.delete}
                      >
                        {deletingFile === backup.filename ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
