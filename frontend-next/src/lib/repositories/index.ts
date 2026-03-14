// Barrel re-export - constructs the unified API object
import { createDirectorateRepository } from './directorates';
import { createNewsRepository } from './news';
import { createDecreeRepository } from './decrees';
import { createComplaintRepository } from './complaints';
export { getComplaintTemplates } from './complaints';
import { createStaffRepository } from './staff';
import { createContentRepository } from './content';
import { createUserRepository } from './users';
import { createSuggestionRepository } from './suggestions';
import { createReportsRepository } from './reports';
import { createAnnouncementsRepository } from './announcements';
import { createMediaRepository } from './media';
import { createRolesRepository } from './roles';
import { createServicesRepository } from './services';
import { createInvestmentRepository, createInvestmentApplicationRepository, createStaffInvestmentApplicationRepository } from './investments';
import { createPromotionalRepository } from './promotional';
import { createNewsletterRepository } from './newsletter';
import { createFaqRepository } from './faq';
import { createSearchRepository } from './search';
import { createAiRepository } from './ai';
import { Favorite, AutocompleteSuggestion, API_BASE_URL, getXsrfToken, getCsrfCookie } from './_shared';

// Re-export all interfaces and types
export type { IDirectorateRepository } from './directorates';
export type { INewsRepository } from './news';
export type { IDecreeRepository } from './decrees';
export type { IComplaintRepository } from './complaints';
export type { IStaffRepository } from './staff';
export type { IContentRepository } from './content';
export type { IUserRepository } from './users';
export type { ISuggestionRepository } from './suggestions';
export type { StatisticsData, AdminStatistics, IReportsRepository } from './reports';
export type { Announcement, IAnnouncementsRepository } from './announcements';
export type { AlbumPhoto, AlbumData, IMediaRepository } from './media';
export type { Role, IRolesRepository } from './roles';
export type { IServicesRepository } from './services';
export type { IInvestmentRepository, IInvestmentApplicationRepository, IStaffInvestmentApplicationRepository } from './investments';
export type { IPromotionalSectionsRepository } from './promotional';
export type { INewsletterRepository } from './newsletter';
export type { IFaqRepository } from './faq';
export type { ISearchRepository } from './search';
export type { IAiRepository } from './ai';
export type { Investment, InvestmentStats } from './_shared';

const settingsApi = {
  async getByGroup(group: string): Promise<Record<string, unknown>> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/settings/group/${group}`);
      if (!res.ok) return {};
      const json = await res.json();
      return json.settings || {};
    } catch {
      return {};
    }
  },
  async getPublic(): Promise<Record<string, unknown>> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/settings`);
      if (!res.ok) return {};
      const json = await res.json();
      return json.settings || {};
    } catch {
      return {};
    }
  },
  async submitContactForm(data: { name: string; email: string; subject: string; message: string; department?: string }): Promise<{ success: boolean; message: string; message_en: string }> {
    const res = await fetch(`${API_BASE_URL}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit contact form');
    }
    return res.json();
  },
};


const openDataApi = {
  async getAll(): Promise<Array<{ id: string; title_ar: string; title_en: string; description_ar: string; description_en: string; date: string; format: string; size: string; category_label: string; download_url: string | null }>> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/open-data`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },
};


export const API = {
  settings: settingsApi,
  openData: openDataApi,
  directorates: createDirectorateRepository(),
  news: createNewsRepository(),
  decrees: createDecreeRepository(),
  complaints: createComplaintRepository(),
  staff: createStaffRepository(),
  content: createContentRepository(),
  users: createUserRepository(),
  roles: createRolesRepository(),
  reports: createReportsRepository(),
  announcements: createAnnouncementsRepository(),
  suggestions: createSuggestionRepository(),
  media: createMediaRepository(),
  services: createServicesRepository(),
  investments: createInvestmentRepository(),
  investmentApplications: createInvestmentApplicationRepository(),
  staffInvestmentApplications: createStaffInvestmentApplicationRepository(),
  promotionalSections: createPromotionalRepository(),
  newsletter: createNewsletterRepository(),
  faqs: createFaqRepository(),
  search: createSearchRepository(),
  ai: createAiRepository(),
  quickLinks: {
    async getBySection(section: string = 'homepage', directorateId?: string): Promise<any[]> {
      try {
        const params = new URLSearchParams({ section });
        if (directorateId) params.append('directorate_id', directorateId);
        const res = await fetch(`${API_BASE_URL}/public/quick-links?${params.toString()}`);
        if (!res.ok) return [];
        return res.json();
      } catch { return []; }
    },
  },
  pages: {
    async getBySlug(slug: string): Promise<any | null> {
      try {
        const res = await fetch(`${API_BASE_URL}/public/pages/${slug}`);
        if (!res.ok) return null;
        return res.json();
      } catch { return null; }
    },
  },

  // --- Happiness Feedback (مؤشر الرضا) ---
  happiness: {
    async submit(rating: number, page?: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/public/happiness-feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ rating, page }),
        });
        return res.ok;
      } catch { return false; }
    },
    async getStats(): Promise<any> {
      try {
        const res = await fetch(`${API_BASE_URL}/public/happiness-feedback/stats`);
        if (!res.ok) return null;
        return res.json();
      } catch { return null; }
    },
  },

  // --- Notification Actions ---
  notifications: {
    async getAll(limit: number = 20): Promise<{ notifications: any[]; unread_count: number }> {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications?limit=${limit}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return { notifications: [], unread_count: 0 };
        const data = await res.json();
        return {
          notifications: data.data || data.notifications || [],
          unread_count: data.unread_count ?? 0,
        };
      } catch { return { notifications: [], unread_count: 0 }; }
    },
    async markAsRead(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
    async markRead(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
    async markAllAsRead(): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
    async markAllRead(): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
    async delete(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
  },

  // --- Chat Handoffs ---
  chatHandoffs: {
    async list(): Promise<any[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/staff/chat/handoffs`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || data || [];
      } catch { return []; }
    },
    async assign(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/staff/chat/handoffs/${id}/assign`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
    async respond(id: string, message: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/staff/chat/handoffs/${id}/respond`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ message })
        });
        return res.ok;
      } catch { return false; }
    },
    async close(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/staff/chat/handoffs/${id}/close`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
  },

  // --- Admin FAQ CRUD ---
  adminFaqs: {
    async getAll(): Promise<any[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/faq`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || data || [];
      } catch { return []; }
    },
    async create(data: any): Promise<any> {
      const res = await fetch(`${API_BASE_URL}/admin/faq`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    async update(id: string, data: any): Promise<any> {
      const res = await fetch(`${API_BASE_URL}/admin/faq/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    async delete(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/faq/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
  },

  // --- Satisfaction Analytics ---
  satisfaction: {
    async get(): Promise<any> {
      try {
        const res = await fetch(`${API_BASE_URL}/staff/analytics/satisfaction`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data || data;
      } catch { return null; }
    },
  },

  // --- AI Report Summaries ---
  aiSummaries: {
    async getLatest(): Promise<any> {
      try {
        const res = await fetch(`${API_BASE_URL}/reports/summaries/latest`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data || data;
      } catch { return null; }
    },
    async getAll(): Promise<any[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/reports/summaries`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || data || [];
      } catch { return []; }
    },
  },

  // --- National ID Verification ---
  nationalId: {
    verify: async (data: { national_id: string; first_name?: string; father_name?: string; last_name?: string; birth_date?: string }): Promise<any> => {
      const res = await fetch(`${API_BASE_URL}/public/verify-national-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    validateFormat: async (national_id: string): Promise<any> => {
      const res = await fetch(`${API_BASE_URL}/public/validate-national-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ national_id }),
      });
      return res.json();
    },
  },

  // --- Backup Management ---
  backups: {
    async list(): Promise<any[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/backup`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || data || [];
      } catch { return []; }
    },
    async create(): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/backup`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
    async download(filename: string): Promise<Blob | null> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/backup/${encodeURIComponent(filename)}/download`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        if (!res.ok) return null;
        return res.blob();
      } catch { return null; }
    },
    async delete(filename: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/backup/${encodeURIComponent(filename)}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
  },

  // --- Content Version Compare ---
  contentVersions: {
    async compare(contentId: string, versionNumber: number): Promise<any> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/content/${contentId}/versions/${versionNumber}/compare`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        return res.json();
      } catch { return null; }
    },
  },


  // --- AI Tools ---


  // --- Webhook Management ---
  webhooks: {
    async list(): Promise<any[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/webhooks`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || data || [];
      } catch { return []; }
    },
    async create(data: any): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/webhooks`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.ok;
      } catch { return false; }
    },
    async update(id: string, data: any): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/webhooks/${id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.ok;
      } catch { return false; }
    },
    async delete(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/webhooks/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
    async test(id: string): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/webhooks/${id}/test`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 'Accept': 'application/json' }
        });
        return res.ok;
      } catch { return false; }
    },
  },

  // --- Favorites ---
  favorites: {
    async list(type?: string): Promise<Favorite[]> {
      try {
        await getCsrfCookie();
        const params = type ? `?type=${type}` : '';
        const res = await fetch(`${API_BASE_URL}/favorites${params}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Accept': 'application/json',
          }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
      } catch { return []; }
    },
    async add(contentType: string, contentId: string, metadata?: any): Promise<boolean> {
      try {
        await getCsrfCookie();
        const xsrfToken = getXsrfToken();
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
        const res = await fetch(`${API_BASE_URL}/favorites`, {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify({ content_type: contentType, content_id: String(contentId), metadata }),
        });
        return res.ok || res.status === 409;
      } catch { return false; }
    },
    async remove(contentType: string, contentId: string): Promise<boolean> {
      try {
        await getCsrfCookie();
        const xsrfToken = getXsrfToken();
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json',
        };
        if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
        const res = await fetch(`${API_BASE_URL}/favorites/${contentType}/${contentId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers,
        });
        return res.ok;
      } catch { return false; }
    },
    async check(items: { content_type: string; content_id: string }[]): Promise<Record<string, boolean>> {
      try {
        await getCsrfCookie();
        const xsrfToken = getXsrfToken();
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
        const res = await fetch(`${API_BASE_URL}/favorites/check`, {
          method: 'POST',
          credentials: 'include',
          headers,
          body: JSON.stringify({ items }),
        });
        if (!res.ok) return {};
        const json = await res.json();
        // Handle both { data: {...} } and direct {...} response formats
        return json?.data ?? json;
      } catch { return {}; }
    },
  },

  // --- Search Autocomplete ---
  searchAutocomplete: {
    // M7.1: Accept lang parameter to return suggestions in the correct language
    // Bug fix: Allow single-character Arabic queries (matching backend behavior)
    async suggest(query: string, lang?: string): Promise<AutocompleteSuggestion[]> {
      try {
        const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(query);
        const minLength = isArabic ? 1 : 2;
        if (query.length < minLength) return [];
        const params = new URLSearchParams({ q: query });
        if (lang) params.append('lang', lang);
        const res = await fetch(`${API_BASE_URL}/public/search/autocomplete?${params.toString()}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.suggestions || [];
      } catch { return []; }
    },
  },

  // --- Government Partners ---
  governmentPartners: {
    async getAll(): Promise<any[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/public/government-partners`, {
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
      } catch { return []; }
    },
    async adminList(params?: { search?: string }): Promise<{ data: any[]; total: number }> {
      try {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append('search', params.search);
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const xsrfToken = getXsrfToken();
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
        const res = await fetch(`${API_BASE_URL}/admin/government-partners?${searchParams.toString()}`, {
          credentials: 'include',
          headers,
        });
        if (!res.ok) return { data: [], total: 0 };
        const data = await res.json();
        return { data: data.data || [], total: data.total || 0 };
      } catch { return { data: [], total: 0 }; }
    },
    async create(formData: FormData): Promise<any> {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const xsrfToken = getXsrfToken();
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
      const res = await fetch(`${API_BASE_URL}/admin/government-partners`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create partner');
      }
      return res.json();
    },
    async update(id: number, formData: FormData): Promise<any> {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const xsrfToken = getXsrfToken();
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
      const res = await fetch(`${API_BASE_URL}/admin/government-partners/${id}`, {
        method: 'POST', // POST for FormData with file upload
        credentials: 'include',
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update partner');
      }
      return res.json();
    },
    async delete(id: number): Promise<void> {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const xsrfToken = getXsrfToken();
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
      const res = await fetch(`${API_BASE_URL}/admin/government-partners/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete partner');
    },
    async toggleActive(id: number): Promise<any> {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const xsrfToken = getXsrfToken();
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
      const res = await fetch(`${API_BASE_URL}/admin/government-partners/${id}/toggle-active`, {
        method: 'PATCH',
        credentials: 'include',
        headers,
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      return res.json();
    },
  },

};
