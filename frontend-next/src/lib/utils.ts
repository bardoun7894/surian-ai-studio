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
  const ar = obj[`${field}_ar`] || obj[field] || '';
  const en = obj[`${field}_en`] || ar;
  return lang === 'ar' ? ar : en;
}
