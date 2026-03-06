import { LocalizedString } from '@/types';

export function getLocalizedName(name: string | LocalizedString, lang: 'ar' | 'en'): string {
  if (typeof name === 'string') return name;
  return lang === 'ar' ? name.ar : name.en;
}

/**
 * Get a localized field from an API object that has _ar/_en suffixed fields.
 * e.g., getLocalizedField(directorate, 'name', 'en') reads directorate.name_en || directorate.name_ar || directorate.name
 */
export function getLocalizedField(obj: any, field: string, lang: 'ar' | 'en'): string {
  if (!obj) return '';
  const val = obj[field];
  // Handle LocalizedString objects { ar: '...', en: '...' }
  if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
    return val[lang] || val['ar'] || '';
  }
  const ar = obj[`${field}_ar`] || (typeof val === 'string' ? val : '') || '';
  const en = obj[`${field}_en`] || ar;
  return lang === 'ar' ? ar : en;
}

/**
 * Copy text to clipboard with fallback for non-HTTPS environments.
 * Uses navigator.clipboard when available, falls back to execCommand.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }
  // Fallback for HTTP / older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
}

/**
 * Share content using Web Share API with clipboard fallback.
 * Returns true if shared/copied successfully.
 */
export async function shareContent(title: string, url: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, url });
      return true;
    } catch (err: any) {
      if (err.name === 'AbortError') return false;
    }
  }
  return copyToClipboard(url);
}

/**
 * Format a date as locale-aware relative time (e.g., "2 hours ago", "منذ ساعتين").
 */
export function formatRelativeTime(dateStr: string, lang: 'ar' | 'en'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return lang === 'ar' ? 'الآن' : 'Just now';
  if (diffMin < 60) return lang === 'ar' ? `منذ ${diffMin} دقيقة` : `${diffMin} min ago`;
  if (diffHrs < 24) return lang === 'ar' ? `منذ ${diffHrs} ساعة` : `${diffHrs}h ago`;
  if (diffDays < 7) return lang === 'ar' ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;

  // Use en-US for number formatting to avoid Hindi numerals
  const formatted = date.toLocaleDateString(lang === 'ar' ? 'ar-u-nu-latn' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formatted;
}
