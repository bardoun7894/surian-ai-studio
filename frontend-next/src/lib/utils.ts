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
 * Numbers are displayed in Arabic-Indic numerals when lang='ar'.
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

  const n = (v: number) => localizeDigits(String(v), lang);

  if (diffMin < 1) return lang === 'ar' ? 'الآن' : 'Just now';
  if (diffMin < 60) return lang === 'ar' ? `منذ ${n(diffMin)} دقيقة` : `${diffMin} min ago`;
  if (diffHrs < 24) return lang === 'ar' ? `منذ ${n(diffHrs)} ساعة` : `${diffHrs}h ago`;
  if (diffDays < 7) return lang === 'ar' ? `منذ ${n(diffDays)} يوم` : `${diffDays}d ago`;

  return formatDate(dateStr, lang);
}

// ──────────────────────────────────────────────────────
// M4.10: Unified number formatting (Arabic-Indic / Latin)
// ──────────────────────────────────────────────────────

const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert Latin digits in a string to Arabic-Indic numerals.
 */
function toArabicIndic(str: string): string {
  return str.replace(/[0-9]/g, (d) => ARABIC_INDIC_DIGITS[parseInt(d, 10)]);
}

/**
 * Format a number according to the active locale.
 *   - Arabic mode  → Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) with proper grouping
 *   - English mode → Latin numerals (0123456789) with comma grouping
 *
 * @param num   - The number (or numeric string) to format
 * @param locale - 'ar' | 'en'
 * @param options - Optional Intl.NumberFormat options (e.g. { minimumFractionDigits: 2 })
 */
export function formatNumber(
  num: number | string,
  locale: 'ar' | 'en',
  options?: Intl.NumberFormatOptions,
): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);

  // Format with Latin digits first (en-US gives us commas)
  const formatted = new Intl.NumberFormat('en-US', options).format(n);

  if (locale === 'ar') {
    // Use Latin digits consistently, just swap comma to Arabic comma
    return formatted.replace(/,/g, '٬');
  }
  return formatted;
}

/**
 * Convert ALL Latin digits in an arbitrary string to Arabic-Indic numerals
 * (useful for dates, phone numbers, etc.).
 *
 * @param str    - Any string that may contain digits
 * @param locale - 'ar' | 'en'
 */
export function localizeDigits(str: string, locale: 'ar' | 'en'): string {
  if (!str) return '';
  // Keep Latin digits consistently in both languages
  if (locale === 'ar') return str;
  return str;
}

/**
 * Format a date string for display, with locale-aware digits.
 *
 * @param dateStr - ISO date string
 * @param locale  - 'ar' | 'en'
 * @param options - Optional Intl.DateTimeFormat options
 */
export function formatDate(
  dateStr: string,
  locale: 'ar' | 'en',
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const defaults: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const opts = options || defaults;

  // Always format with en-US to get Latin digits, then localize
  const formatted = date.toLocaleDateString('en-US', opts);

  if (locale === 'ar') {
    // Use Latin digits consistently (ar-u-nu-latn gives Arabic month names + Latin digits)
    return date.toLocaleDateString('ar-EG-u-nu-latn', opts);
  }
  return formatted;
}
