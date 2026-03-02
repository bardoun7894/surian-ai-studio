import { Directorate, Service, Article, NewsItem, Decree, Ticket, ComplaintData, User, SuggestionData, Suggestion, MediaItem, PromotionalSection, FAQ, SearchResult, SearchResults, Favorite, AutocompleteSuggestion, Investment, InvestmentStats, PaginatedResponse } from '../types';
import { DIRECTORATES, KEY_SERVICES, OFFICIAL_NEWS, BREAKING_NEWS, HERO_ARTICLE, GRID_ARTICLES, DECREES, MOCK_MEDIA } from '@/constants';
import { getCsrfCookie } from '@/lib/api';

// Helper: read XSRF-TOKEN from cookies for XHR requests
function getXsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// --- Configuration ---
const USE_MOCK_DATA = false; // Set to FALSE to use real API calls
// Use relative URL to leverage Next.js rewrites for proper proxying
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// --- Interfaces ---
export interface IDirectorateRepository {
  getAll(): Promise<Directorate[]>;
  getById(id: string): Promise<Directorate | null>;
  getServicesByDirectorate(id: string): Promise<Service[]>;
  getNewsByDirectorate(id: string): Promise<NewsItem[]>;
  getFeatured(): Promise<Directorate[]>;
}

export interface INewsRepository {
  getOfficialNews(): Promise<NewsItem[]>;
  getPaginated(page?: number, perPage?: number, directorateId?: string): Promise<PaginatedResponse<NewsItem>>;
  getById(id: string): Promise<NewsItem | null>;
  getGroupedByDirectorate(): Promise<{ directorate: { id: string, name: string, icon: string }, news: NewsItem[] }[]>;
  getBreakingNews(): Promise<string[]>;
  getHeroArticle(): Promise<Article>;
  getGridArticles(): Promise<Article[]>;
}

export interface IDecreeRepository {
  getAll(directorate?: string): Promise<Decree[]>;
  search(query: string, type?: string, directorate?: string): Promise<Decree[]>;
}

export interface IComplaintRepository {
  submit(data: ComplaintData): Promise<string>;
  submitWithProgress(data: ComplaintData, onProgress?: (progress: number) => void): Promise<string>;
  track(ticketId: string, nationalId?: string): Promise<Ticket | null>;
  myComplaints(): Promise<Ticket[]>;
  delete(id: string): Promise<boolean>;
  rate(trackingNumber: string, rating: number, comment?: string): Promise<boolean>;
}

export interface IStaffRepository {
  listComplaints(params?: any): Promise<{ data: Ticket[], total: number }>;
  updateStatus(id: string, status: string): Promise<boolean>;
  updateCategorization(id: string, category: string, priority: string): Promise<boolean>;
  getComplaintLogs(id: string): Promise<any[]>;
  addResponse(id: string, response: string): Promise<boolean>;
  addResponse(id: string, response: string): Promise<boolean>;
  getAnalytics(): Promise<any>;
}

export interface IContentRepository {
  getAll(params?: any): Promise<{ data: any[], total: number, last_page?: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<any>;
  getVersions(id: string): Promise<any[]>;
  restoreVersion(id: string, versionNumber: number): Promise<any>;
}


export interface IUserRepository {
  updateProfile(data: { name?: string; email?: string; password?: string }): Promise<User | null>;
  requestEmailChange(newEmail: string, password: string): Promise<{ success: boolean; message?: string }>;
  verifyEmailChange(code: string): Promise<{ success: boolean; message?: string }>;
  // Admin methods
  getAll(params?: { search?: string; role_id?: number; is_active?: boolean; per_page?: number; page?: number }): Promise<{ data: User[], total: number, current_page: number, per_page: number, last_page: number }>;
  getById(id: number): Promise<{ user: User; statistics: any } | null>;
  create(data: { name: string; email: string; role_id: number; directorate_id?: string }): Promise<{ user: User; temp_password: string }>;
  update(id: number, data: { name?: string; email?: string; phone?: string; role_id?: number; directorate_id?: string }): Promise<User | null>;
  toggleStatus(id: number): Promise<{ is_active: boolean } | null>;
}

export interface ISuggestionRepository {
  submit(data: SuggestionData): Promise<Suggestion>;
  submitWithProgress(data: SuggestionData, onProgress?: (progress: number) => void): Promise<Suggestion>;
  track(trackingNumber: string, nationalId?: string): Promise<any>;
  mySuggestions(): Promise<Suggestion[]>;
  submitRating(data: { tracking_number: string; rating: number; comment?: string; feedback_type?: 'positive' | 'negative' }): Promise<any>;
  getRatingsStats(trackingNumber?: string): Promise<any>;
}

export interface IFaqRepository {
  getAll(directorateId?: string): Promise<FAQ[]>;
}

export interface ISearchRepository {
  search(query: string, type?: string, dateFrom?: string, dateTo?: string, entity?: string, lang?: string): Promise<SearchResults>;
}

// --- Mock Implementations (Uses constants.ts) ---
class MockDirectorateRepository implements IDirectorateRepository {
  async getAll(): Promise<Directorate[]> {
    return new Promise(resolve => setTimeout(() => resolve(DIRECTORATES), 500));
  }
  async getById(id: string): Promise<Directorate | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(DIRECTORATES.find(d => d.id === id) || null), 300);
    });
  }
  async getServicesByDirectorate(id: string): Promise<Service[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(KEY_SERVICES.filter(s => s.directorateId === id)), 300);
    });
  }
  async getNewsByDirectorate(id: string): Promise<NewsItem[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(OFFICIAL_NEWS.slice(0, 2)), 300);
    });
  }
  async getFeatured(): Promise<Directorate[]> {
    // Return the DIRECTORATES constant which has proper LocalizedString objects
    return new Promise(resolve => setTimeout(() => resolve(DIRECTORATES), 400));
  }
}

class MockNewsRepository implements INewsRepository {
  async getOfficialNews(): Promise<NewsItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(OFFICIAL_NEWS), 600));
  }
  async getById(id: string): Promise<NewsItem | null> {
    return new Promise(resolve => setTimeout(() => {
      const item = OFFICIAL_NEWS.find(n => n.id === id) || null;
      resolve(item);
    }, 300));
  }
  async getBreakingNews(): Promise<string[]> {
    return new Promise(resolve => setTimeout(() => resolve(BREAKING_NEWS), 400));
  }
  async getHeroArticle(): Promise<Article> {
    return new Promise(resolve => setTimeout(() => resolve(HERO_ARTICLE), 200));
  }
  async getGridArticles(): Promise<Article[]> {
    return new Promise(resolve => setTimeout(() => resolve(GRID_ARTICLES), 400));
  }
  async getPaginated(page: number = 1, perPage: number = 12, directorateId?: string): Promise<PaginatedResponse<NewsItem>> {
    return new Promise(resolve => setTimeout(() => {
      let items = [...OFFICIAL_NEWS];
      if (directorateId) items = items.filter(n => String((n as any).directorate_id) === directorateId);
      const total = items.length;
      const lp = Math.ceil(total / perPage) || 1;
      const start = (page - 1) * perPage;
      const data = items.slice(start, start + perPage);
      resolve({ data, current_page: page, last_page: lp, per_page: perPage, total });
    }, 600));
  }
  async getGroupedByDirectorate(): Promise<{ directorate: { id: string, name: string, icon: string }, news: NewsItem[] }[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      {
        directorate: { id: 'd1', name: 'الإدارة العامة للصناعة', icon: 'Factory' },
        news: OFFICIAL_NEWS.slice(0, 3)
      },
      {
        directorate: { id: 'd2', name: 'الإدارة العامة للاقتصاد', icon: 'TrendingUp' },
        news: OFFICIAL_NEWS.slice(0, 2)
      },
      {
        directorate: { id: 'd3', name: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', icon: 'ShieldCheck' },
        news: OFFICIAL_NEWS.slice(0, 2)
      }
    ]), 600));
  }
}

class MockDecreeRepository implements IDecreeRepository {
  async getAll(directorate?: string): Promise<Decree[]> {
    return new Promise(resolve => setTimeout(() => resolve(DECREES), 500));
  }
  async search(query: string, type?: string, directorate?: string): Promise<Decree[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        let results = DECREES;
        if (query) {
          results = results.filter(d => d.title.includes(query) || d.number.includes(query));
        }
        if (type && type !== 'all') {
          results = results.filter(d => d.type === type);
        }
        resolve(results);
      }, 400);
    });
  }
}

class MockComplaintRepository implements IComplaintRepository {
  async submit(data: ComplaintData): Promise<string> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: ComplaintData, onProgress?: (progress: number) => void): Promise<string> {
    return new Promise(resolve => {
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(progress);
          if (progress >= 100) clearInterval(interval);
        }, 100);
      }
      setTimeout(() => resolve('GOV-' + Math.floor(Math.random() * 100000)), 1500);
    });
  }
  async track(ticketId: string, _nationalId?: string): Promise<Ticket | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        id: ticketId,
        status: 'in_progress',
        lastUpdate: new Date().toLocaleDateString('ar-SY'),
        notes: 'الطلب قيد المراجعة من قبل القسم الفني (بيانات محاكاة).'
      }), 1000);
    });
  }
  async myComplaints(): Promise<Ticket[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve([
        { id: '1', title: 'شكوى تجريبية', status: 'new', lastUpdate: '2025-01-01', notes: 'تجربة' },
        { id: '2', title: 'شكوى أخرى', status: 'resolved', lastUpdate: '2025-01-05', notes: 'تم الحل' }
      ] as Ticket[]), 800);
    });
  }
  async delete(id: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async rate(trackingNumber: string, rating: number, comment?: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
}

class MockStaffRepository implements IStaffRepository {
  async listComplaints(params?: any): Promise<{ data: Ticket[], total: number }> {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        data: [
          { id: '1', status: 'new', lastUpdate: '2023-10-01', notes: 'تجربة' },
          { id: '2', status: 'resolved', lastUpdate: '2023-10-02', notes: 'تم الحل' }
        ],
        total: 2
      }), 500);
    });
  }
  async updateStatus(id: string, status: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async updateCategorization(id: string, category: string, priority: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async getComplaintLogs(id: string): Promise<any[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: 1, action: 'status_updated', user: { name: 'Admin' }, created_at: '2023-10-01 10:00', changes: { old_status: 'new', new_status: 'in_progress' } }
    ]), 300));
  }
  async addResponse(id: string, response: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async getAnalytics(): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({
      total: 150,
      new: 45,
      resolved: 80,
      in_progress: 25
    }), 500));
  }
}

class MockContentRepository implements IContentRepository {
  async getAll(params?: any): Promise<{ data: any[], total: number }> {
    return new Promise(resolve => setTimeout(() => resolve({
      data: [],
      total: 0
    }), 500));
  }
  async create(data: any): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ ...data, id: Math.random().toString() }), 500));
  }
  async update(id: string, data: any): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ ...data, id }), 500));
  }
  async delete(id: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
  async getById(id: string): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ id, title_ar: 'Mock Content' }), 500));
  }
  async getVersions(id: string): Promise<any[]> {
    return new Promise(resolve => setTimeout(() => resolve([]), 500));
  }
  async restoreVersion(id: string, versionNumber: number): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ id, versionNumber }), 500));
  }
}

class MockUserRepository implements IUserRepository {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'أحمد محمود',
      email: 'admin@moe.gov.sy',
      role_id: 1,
      role: { id: 1, name: 'admin', label: 'مدير النظام', permissions: [] },
      phone: '+963 11 1234567',
      is_active: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-05-20T10:30:00Z',
      last_login_at: '2024-05-20T10:30:00Z'
    },
    {
      id: 2,
      name: 'سارة علي',
      email: 'staff@moe.gov.sy',
      role_id: 2,
      role: { id: 2, name: 'staff', label: 'موظف', permissions: [] },
      phone: '+963 11 7654321',
      directorate_id: 'd1',
      is_active: true,
      created_at: '2024-02-10T09:15:00Z',
      updated_at: '2024-05-15T14:20:00Z',
      last_login_at: '2024-05-18T09:00:00Z'
    },
    {
      id: 3,
      name: 'محمد خالد',
      email: 'citizen@example.com',
      role_id: 3,
      role: { id: 3, name: 'citizen', label: 'مواطن', permissions: [] },
      phone: '+963 955 123456',
      national_id: '12345678901',
      is_active: false,
      created_at: '2024-03-20T11:00:00Z',
      updated_at: '2024-05-10T16:45:00Z'
    }
  ];

  async updateProfile(data: any): Promise<User | null> {
    return new Promise(resolve => setTimeout(() => resolve({ id: 1, name: data.name || 'User', email: data.email || 'user@example.com', role_id: 1, is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' }), 500));
  }

  async requestEmailChange(newEmail: string, password: string): Promise<{ success: boolean; message?: string }> {
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Verification code sent' }), 800));
  }

  async verifyEmailChange(code: string): Promise<{ success: boolean; message?: string }> {
    return new Promise(resolve => setTimeout(() => {
      if (code === '123456') {
        resolve({ success: true, message: 'Email updated' });
      } else {
        resolve({ success: false, message: 'Invalid code' });
      }
    }, 800));
  }

  async getAll(params?: any): Promise<{ data: User[], total: number, current_page: number, per_page: number, last_page: number }> {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = [...this.mockUsers];

        if (params?.search) {
          const search = params.search.toLowerCase();
          filtered = filtered.filter(u =>
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
          );
        }

        if (params?.role_id) {
          filtered = filtered.filter(u => u.role_id === Number(params.role_id));
        }

        if (params?.is_active !== undefined) {
          filtered = filtered.filter(u => u.is_active === Boolean(params.is_active));
        }

        resolve({
          data: filtered,
          total: filtered.length,
          current_page: 1,
          per_page: params?.per_page || 15,
          last_page: 1
        });
      }, 400);
    });
  }

  async getById(id: number): Promise<{ user: User; statistics: any } | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (!user) {
          resolve(null);
        } else {
          resolve({
            user,
            statistics: {
              complaints_count: 5,
              suggestions_count: 2,
              last_login: user.last_login_at || null,
              account_age_days: 120
            }
          });
        }
      }, 300);
    });
  }

  async create(data: any): Promise<{ user: User; temp_password: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser: User = {
          id: this.mockUsers.length + 1,
          name: data.name,
          email: data.email,
          role_id: data.role_id,
          directorate_id: data.directorate_id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.mockUsers.push(newUser);
        resolve({
          user: newUser,
          temp_password: 'TempPass123!'
        });
      }, 500);
    });
  }

  async update(id: number, data: any): Promise<User | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (!user) {
          resolve(null);
        } else {
          Object.assign(user, data, { updated_at: new Date().toISOString() });
          resolve(user);
        }
      }, 400);
    });
  }

  async toggleStatus(id: number): Promise<{ is_active: boolean } | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (!user) {
          resolve(null);
        } else {
          user.is_active = !user.is_active;
          resolve({ is_active: user.is_active });
        }
      }, 300);
    });
  }
}

// --- API Implementations (Real Backend) ---
class ApiDirectorateRepository implements IDirectorateRepository {
  private toNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }

  private normalizeSubDirectorates(raw: any): Directorate['subDirectorates'] {
    const subDirectorates = raw?.subDirectorates ?? raw?.sub_directorates;
    if (!Array.isArray(subDirectorates)) return [];

    return subDirectorates.map((sub: any) => ({
      id: String(sub?.id ?? ''),
      name: sub?.name ?? {
        ar: sub?.name_ar ?? '',
        en: sub?.name_en ?? sub?.name_ar ?? '',
      },
      url: sub?.url ?? '',
      isExternal: Boolean(sub?.isExternal ?? sub?.is_external),
    }));
  }

  private normalizeDirectorate(raw: any): Directorate {
    const normalizedSubDirectorates = this.normalizeSubDirectorates(raw);

    const normalizedServicesCount = this.toNumber(
      raw?.servicesCount ?? raw?.services_count
    );

    const normalizedNewsCount = this.toNumber(
      raw?.newsCount ?? raw?.news_count
    );

    return {
      ...raw,
      id: String(raw?.id ?? ''),
      name: raw?.name ?? {
        ar: raw?.name_ar ?? '',
        en: raw?.name_en ?? raw?.name_ar ?? '',
      },
      description: raw?.description ?? {
        ar: raw?.description_ar ?? '',
        en: raw?.description_en ?? raw?.description_ar ?? '',
      },
      featured: Boolean(raw?.featured ?? raw?.is_featured),
      subDirectorates: normalizedSubDirectorates,
      servicesCount: normalizedServicesCount ?? (Array.isArray(raw?.services) ? raw.services.length : 0),
      newsCount: normalizedNewsCount,
      logo: raw?.logo ?? raw?.image,
      address_ar: raw?.address_ar ?? raw?.contact?.address ?? raw?.address,
      address_en: raw?.address_en ?? raw?.contact?.address ?? raw?.address,
      email: raw?.email ?? raw?.contact?.email,
      phone: raw?.phone ?? raw?.contact?.phone,
      website: raw?.website ?? raw?.contact?.website,
      working_hours_ar: raw?.working_hours_ar ?? raw?.contact?.working_hours_ar,
      working_hours_en: raw?.working_hours_en ?? raw?.contact?.working_hours_en,
    };
  }

  async getAll(): Promise<Directorate[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates`);
    if (!res.ok) return [];
    const data = await res.json();
    const directorates = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
    return directorates.map((item: any) => this.normalizeDirectorate(item));
  }
  async getById(id: string): Promise<Directorate | null> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return this.normalizeDirectorate(data);
  }
  async getServicesByDirectorate(id: string): Promise<Service[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/${id}/services`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  }
  async getNewsByDirectorate(id: string): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/${id}/news`);
    if (!res.ok) return [];
    return res.json();
  }
  async getFeatured(): Promise<Directorate[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/featured`);
    if (!res.ok) return [];
    const data = await res.json();
    const directorates = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
    return directorates.map((item: any) => this.normalizeDirectorate(item));
  }
}

class ApiNewsRepository implements INewsRepository {
  async getOfficialNews(): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE_URL}/public/news`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  }
  async getPaginated(page: number = 1, perPage: number = 12, directorateId?: string): Promise<PaginatedResponse<NewsItem>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (directorateId) params.append('directorate_id', directorateId);
    const res = await fetch(`${API_BASE_URL}/public/news?${params.toString()}`);
    if (!res.ok) return { data: [], current_page: 1, last_page: 1, per_page: perPage, total: 0 };
    const data = await res.json();
    return data;
  }
  async getById(id: string): Promise<NewsItem | null> {
    const res = await fetch(`${API_BASE_URL}/public/news/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
  async getGroupedByDirectorate(): Promise<{ directorate: { id: string, name: string, icon: string }, news: NewsItem[] }[]> {
    const res = await fetch(`${API_BASE_URL}/public/news/by-directorate`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  }
  async getBreakingNews(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/public/news/breaking`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
  async getHeroArticle(): Promise<Article> {
    const res = await fetch(`${API_BASE_URL}/public/news/hero`);
    return res.json();
  }
  async getGridArticles(): Promise<Article[]> {
    const res = await fetch(`${API_BASE_URL}/public/news/grid`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
}

class ApiDecreeRepository implements IDecreeRepository {
  async getAll(directorate?: string): Promise<Decree[]> {
    const params = new URLSearchParams();
    if (directorate) params.append('directorate', directorate);
    const url = params.toString() ? `${API_BASE_URL}/public/decrees?${params.toString()}` : `${API_BASE_URL}/public/decrees`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  }
  async search(query: string, type?: string, directorate?: string): Promise<Decree[]> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    if (directorate) params.append('directorate', directorate);
    const res = await fetch(`${API_BASE_URL}/public/decrees?${params.toString()}`);
    if (!res.ok) return [];
    return res.json();
  }
}

class ApiComplaintRepository implements IComplaintRepository {
  async submit(data: ComplaintData): Promise<string> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: ComplaintData, onProgress?: (progress: number) => void): Promise<string> {
    const formData = new FormData();

    // Map frontend field names to backend expected field names
    const fullName = [data.firstName, data.fatherName, data.lastName].filter(Boolean).join(' ');
    if (fullName) formData.append('full_name', fullName);
    if (data.directorate) formData.append('directorate_id', data.directorate);
    // Description: use details field, or build from template_fields, or use category as fallback
    if (data.details) {
      formData.append('description', data.details);
    } else {
      let desc = '';
      if ((data as any).template_fields && typeof (data as any).template_fields === 'object') {
        const tf = (data as any).template_fields as Record<string, string>;
        desc = Object.values(tf).filter(Boolean).join(' - ');
      }
      // Always ensure description is sent (backend requires min:10)
      if (!desc || desc.length < 10) {
        desc = desc ? `${data.category || 'شكوى'}: ${desc}` : (data.category || 'شكوى عبر النموذج الإلكتروني');
      }
      if (desc.length < 10) desc = desc.padEnd(10, '.');
      formData.append('description', desc);
    }
    if (data.category) formData.append('category', data.category);
    if (data.nationalId) formData.append('national_id', data.nationalId);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.dob) formData.append('dob', data.dob);
    if (data.recaptcha_token) formData.append('recaptcha_token', data.recaptcha_token);
    if (data.previousTrackingNumber) formData.append('previous_tracking_number', data.previousTrackingNumber);

    // Template fields
    if ((data as any).template_id) formData.append('template_id', (data as any).template_id);
    if ((data as any).template_fields && typeof (data as any).template_fields === 'object') {
      formData.append('template_fields', JSON.stringify((data as any).template_fields));
    }

    // Guest token
    if ((data as any).guest_token) formData.append('guest_token', (data as any).guest_token);

    // M1-T3: Staged attachment IDs (files already uploaded to staging endpoint)
    if (data.staged_attachment_ids && data.staged_attachment_ids.length > 0) {
      data.staged_attachment_ids.forEach((id: string) => {
        formData.append('staged_attachment_ids[]', id);
      });
      if (data.session_token) {
        formData.append('session_token', data.session_token);
      }
    } else if (data.files && Array.isArray(data.files)) {
      // Fallback: traditional file upload (backwards-compatible)
      data.files.forEach((file: File) => {
        formData.append('attachments[]', file);
      });
    } else if (data.file) {
      formData.append('attachments[]', data.file);
    }

    // Fetch CSRF cookie before submitting
    await getCsrfCookie();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result.tracking_number);
          } catch {
            reject(new Error('Invalid response'));
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            console.error('Complaint submission error:', xhr.status, err);
            // Include validation field errors if present
            let errorMessage = err.message || `HTTP ${xhr.status}`;
            if (err.errors && typeof err.errors === 'object') {
              const fieldMessages = Object.values(err.errors as Record<string, string[]>).flat().join('\n');
              if (fieldMessages) errorMessage = fieldMessages;
            }
            reject(new Error(errorMessage));
          } catch {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.open('POST', `${API_BASE_URL}/complaints`);
      xhr.withCredentials = true;

      // Send XSRF token
      const xsrfToken = getXsrfToken();
      if (xsrfToken) {
        xhr.setRequestHeader('X-XSRF-TOKEN', xsrfToken);
      }

      // Send auth token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      // Send guest token as header if present
      if ((data as any).guest_token) {
        xhr.setRequestHeader('X-Guest-Token', (data as any).guest_token);
      }
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.send(formData);
    });
  }
  async track(ticketId: string, _nationalId?: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE_URL}/complaints/track/${ticketId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({}),
    });

    if (res.status === 404) return null;

    if (!res.ok) {
      let backendMessage = '';
      try {
        const payload = await res.json();
        if (typeof payload?.message === 'string') {
          backendMessage = payload.message;
        } else if (payload?.errors && typeof payload.errors === 'object') {
          const errorLines = Object.values(payload.errors as Record<string, string[]>).flat();
          backendMessage = errorLines.join('\n');
        }
      } catch {
        // Ignore parse errors and fallback to generic HTTP status.
      }

      throw new Error(backendMessage || `HTTP ${res.status}`);
    }

    return res.json();
  }
  async myComplaints(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE_URL}/users/me/complaints`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Backend may return array directly or wrapped in { data: [...] }
    return Array.isArray(data) ? data : (data.data || []);
  }
  async delete(id: string): Promise<boolean> {
    // Fetch CSRF cookie before DELETE (required by Laravel Sanctum)
    await getCsrfCookie();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Include XSRF token from cookie
    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    // Include auth token if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    return res.ok;
  }
  async rate(trackingNumber: string, rating: number, comment?: string): Promise<boolean> {
    // Fetch CSRF cookie before submitting (required by Laravel Sanctum)
    await getCsrfCookie();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Include XSRF token from cookie
    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    // Include auth token if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/complaints/${trackingNumber}/rate`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ rating, comment }),
    });
    return res.ok;
  }
}

class ApiStaffRepository implements IStaffRepository {
  async listComplaints(params?: any): Promise<{ data: Ticket[], total: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/staff/complaints?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async updateStatus(id: string, status: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ status })
    });
    return res.ok;
  }
  async updateCategorization(id: string, category: string, priority: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/categorization`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ ai_category: category, priority })
    });
    return res.ok;
  }
  async getComplaintLogs(id: string): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/logs`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async addResponse(id: string, response: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ response })
    });
    return res.ok;
  }
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/staff/analytics`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
}

class ApiContentRepository implements IContentRepository {
  async getAll(params?: any): Promise<{ data: any[], total: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/admin/content?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async create(data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  async update(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.ok;
  }
  async getById(id: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async getVersions(id: string): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}/versions`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async restoreVersion(id: string, versionNumber: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}/versions/${versionNumber}/restore`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
}

// --- Reports Repository ---
export interface StatisticsData {
  complaints: {
    total: number;
    this_week: number;
    today: number;
    overdue: number;
    by_status: Record<string, number>;
    by_priority: Record<string, number>;
    by_directorate: Array<{ name: string; count: number }>;
  };
  users: {
    total: number;
    active: number;
    active_today: number;
    new_this_week: number;
    by_role: Record<string, number>;
  };
  performance: {
    sla_compliance_rate: number;
    avg_first_response_hours: number;
    avg_resolution_hours: number;
  };
  content: {
    total: number;
    published: number;
    draft: number;
    by_type: Record<string, number>;
  };
  generated_at: string;
}

// Alias for backwards compatibility
export type AdminStatistics = StatisticsData;

export interface IReportsRepository {
  getStatistics(period?: string): Promise<StatisticsData>;
  exportData(type: string, params?: any): Promise<Blob>;
}

class MockReportsRepository implements IReportsRepository {
  async getStatistics(period?: string): Promise<StatisticsData> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          complaints: {
            total: 342,
            this_week: 45,
            today: 8,
            overdue: 12,
            by_status: {
              new: 45,
              in_progress: 78,
              resolved: 198,
              rejected: 21
            },
            by_priority: {
              low: 100,
              normal: 150,
              high: 80,
              urgent: 12
            },
            by_directorate: [
              { name: 'الإدارة العامة للصناعة', count: 120 },
              { name: 'الإدارة العامة للاقتصاد', count: 80 },
              { name: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', count: 142 },
            ]
          },
          users: {
            total: 1250,
            active: 890,
            active_today: 150,
            new_this_week: 34,
            by_role: {
              citizen: 1200,
              staff: 45,
              admin: 5
            }
          },
          performance: {
            sla_compliance_rate: 0.92,
            avg_first_response_hours: 4.5,
            avg_resolution_hours: 24.5
          },
          content: {
            total: 150,
            published: 120,
            draft: 30,
            by_type: {
              news: 100,
              article: 50
            }
          },
          generated_at: new Date().toISOString()
        });
      }, 500);
    });
  }

  async exportData(type: string, params?: any): Promise<Blob> {
    // Mock CSV export
    const csvContent = 'id,status,date\n1,resolved,2026-01-15\n2,in_progress,2026-01-16';
    return new Blob([csvContent], { type: 'text/csv' });
  }
}

class ApiReportsRepository implements IReportsRepository {
  async getStatistics(period?: string): Promise<StatisticsData> {
    const res = await fetch(`${API_BASE_URL}/reports/statistics?period=${period || 'week'}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }

  async exportData(type: string, params?: any): Promise<Blob> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/reports/export?type=${type}&${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.blob();
  }
}

// --- Factory / Export ---
class ApiUserRepository implements IUserRepository {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Accept': 'application/json'
    };
  }

  async updateProfile(data: any): Promise<User | null> {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      // Extract validation error messages from Laravel response
      if (json.errors) {
        const firstError = Object.values(json.errors).flat()[0] as string;
        throw new Error(firstError || json.message || 'Validation failed');
      }
      throw new Error(json.message || 'Failed to update profile');
    }
    return json.user || json;
  }

  async requestEmailChange(newEmail: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/email/request-change`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email: newEmail, password })
      });
      const json = await res.json();
      return { success: res.ok, message: json.message };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  async verifyEmailChange(code: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/email/verify-change`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code })
      });
      const json = await res.json();
      return { success: res.ok, message: json.message };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  async getAll(params?: any): Promise<{ data: User[], total: number, current_page: number, per_page: number, last_page: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.role_id) searchParams.append('role_id', params.role_id.toString());
      if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.page) searchParams.append('page', params.page.toString());

      const res = await fetch(`${API_BASE_URL}/admin/users?${searchParams.toString()}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return { data: [], total: 0, current_page: 1, per_page: 15, last_page: 1 };
      return res.json();
    } catch {
      return { data: [], total: 0, current_page: 1, per_page: 15, last_page: 1 };
    }
  }

  async getById(id: number): Promise<{ user: User; statistics: any } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async create(data: any): Promise<{ user: User; temp_password: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  }

  async update(id: number, data: any): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.user || json;
    } catch {
      return null;
    }
  }

  async toggleStatus(id: number): Promise<{ is_active: boolean } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}/disable`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }
}

export interface Announcement {
  id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  date: string;
  category: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  isUrgent?: boolean;
  directorate_id?: string;
  directorate_name?: string;
  imageUrl?: string;
  summary?: string;
  summary_ar?: string;
  summary_en?: string;
}

export interface IAnnouncementsRepository {
  getAll(): Promise<Announcement[]>;
  getPaginated(page?: number, perPage?: number, filter?: string): Promise<PaginatedResponse<any>>;
  getById(id: string): Promise<Announcement | null>;
  getByDirectorate(directorateId: string): Promise<Announcement[]>;
}

class MockAnnouncementsRepository implements IAnnouncementsRepository {
  private announcements: Announcement[] = [
    {
      id: 'a1',
      title: 'مناقصة توريد معدات للمناطق الصناعية',
      date: '2024-05-20',
      category: 'مناقصات',
      description: 'تعلن الإدارة العامة للصناعة عن رغبتها في إجراء مناقصة لتوريد معدات صناعية للمناطق الصناعية.',
      isUrgent: false
    },
    {
      id: 'a2',
      title: 'فتح باب التسجيل لبرنامج دعم المشاريع الصغيرة',
      date: '2024-05-18',
      category: 'برامج دعم',
      description: 'تعلن هيئة تنمية المشروعات الصغيرة والمتوسطة عن فتح باب التسجيل لبرنامج التمويل الميسر.',
      isUrgent: true
    },
    {
      id: 'a3',
      title: 'افتتاح مركز خدمة المستثمرين',
      date: '2024-05-15',
      category: 'خدمات',
      description: 'افتتاح مركز جديد لخدمة المستثمرين في الإدارة العامة للاقتصاد - النافذة الواحدة.',
      isUrgent: true
    }
  ];

  async getAll(): Promise<Announcement[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.announcements), 400));
  }

  async getPaginated(page: number = 1, perPage: number = 9, filter?: string): Promise<PaginatedResponse<any>> {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const data = this.announcements.slice(start, end);
        resolve({
          data,
          current_page: page,
          last_page: Math.ceil(this.announcements.length / perPage),
          per_page: perPage,
          total: this.announcements.length,
        });
      }, 400);
    });
  }

  async getById(id: string): Promise<Announcement | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.announcements.find(a => a.id === id) || null), 300);
    });
  }

  async getByDirectorate(directorateId: string): Promise<Announcement[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.announcements.filter(a => a.directorate_id === directorateId));
      }, 300);
    });
  }
}

class MockSuggestionRepository implements ISuggestionRepository {
  async submit(data: SuggestionData): Promise<Suggestion> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: SuggestionData, onProgress?: (progress: number) => void): Promise<Suggestion> {
    return new Promise(resolve => {
      // Simulate upload progress
      if (onProgress && data.files && data.files.length > 0) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(Math.min(progress, 90));
          if (progress >= 90) clearInterval(interval);
        }, 100);
      }

      setTimeout(() => {
        onProgress?.(100);
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          trackingNumber: 'SUG-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
          status: 'received',
          createdAt: new Date().toISOString()
        });
      }, 1500);
    });
  }

  async track(trackingNumber: string, _nationalId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (trackingNumber.startsWith('SUG-')) {
          resolve({
            success: true,
            data: {
              tracking_number: trackingNumber,
              status: 'pending',
              submitted_at: new Date().toISOString(),
              last_updated: new Date().toISOString(),
              response: null,
              reviewed_at: null
            }
          });
        } else {
          reject(new Error('Not found'));
        }
      }, 800);
    });
  }

  async mySuggestions(): Promise<Suggestion[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            tracking_number: 'SUG-12345678',
            description: 'اقتراح تحسين الخدمات',
            status: 'pending',
            status_label: { ar: 'قيد المراجعة', en: 'Pending Review' },
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            response: null,
            reviewed_at: null,
            attachments_count: 2
          },
          {
            id: 2,
            tracking_number: 'SUG-87654321',
            description: 'اقتراح تطوير موقع الوزارة',
            status: 'approved',
            status_label: { ar: 'تمت الموافقة', en: 'Approved' },
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            response: 'شكراً لاقتراحكم القيم. سيتم العمل على تنفيذه قريباً.',
            reviewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            attachments_count: 0
          }
        ]);
      }, 600);
    });
  }

  async submitRating(data: { tracking_number: string; rating: number; comment?: string; feedback_type?: 'positive' | 'negative' }): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'تم إرسال التقييم بنجاح',
        });
      }, 500);
    });
  }

  async getRatingsStats(trackingNumber?: string): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            total_ratings: 45,
            average_rating: 4.2,
            rating_distribution: { '5': 25, '4': 12, '3': 5, '2': 2, '1': 1 },
            helpful_count: { positive: 40, negative: 5 },
          },
        });
      }, 300);
    });
  }
}

class ApiSuggestionRepository implements ISuggestionRepository {
  async submit(data: SuggestionData): Promise<Suggestion> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: SuggestionData, onProgress?: (progress: number) => void): Promise<Suggestion> {
    const formData = new FormData();

    // Map frontend field names to backend expected field names
    const isAnonymous = data.is_anonymous === true;
    if (isAnonymous) {
      formData.append('name', 'مجهول الهوية'); // Anonymous placeholder
      formData.append('is_anonymous', '1');
    } else {
      const fullName = [data.firstName, data.fatherName, data.lastName].filter(Boolean).join(' ');
      if (fullName) formData.append('name', fullName);
    }
    if (data.nationalId) formData.append('national_id', data.nationalId);
    if (data.dob) formData.append('dob', data.dob);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.description) formData.append('description', data.description);
    if (data.directorate_id) formData.append('directorate_id', data.directorate_id);
    if (data.recaptcha_token) formData.append('recaptcha_token', data.recaptcha_token);
    if (data.guest_token) formData.append('guest_token', data.guest_token);

    // Files
    if (data.files && Array.isArray(data.files)) {
      data.files.forEach(file => formData.append('files[]', file));
    }

    // Fetch CSRF cookie before submitting
    await getCsrfCookie();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            // Backend returns { success: true, data: { tracking_number, status } }
            const responseData = result.data || result;
            resolve({
              id: responseData.id || '',
              tracking_number: responseData.tracking_number || '',
              description: data.description,
              status: responseData.status || 'pending',
              created_at: responseData.created_at || new Date().toISOString(),
            } as any);
          } catch {
            reject(new Error('Invalid response'));
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            const msg = err.message || (err.errors ? Object.values(err.errors).flat().join(', ') : `HTTP ${xhr.status}`);
            reject(new Error(msg));
          } catch {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

      xhr.open('POST', `${API_BASE_URL}/suggestions`);
      xhr.withCredentials = true;

      // Send XSRF token
      const xsrfToken = getXsrfToken();
      if (xsrfToken) {
        xhr.setRequestHeader('X-XSRF-TOKEN', xsrfToken);
      }

      // Send auth token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.send(formData);
    });
  }

  async track(trackingNumber: string, nationalId?: string): Promise<any> {
    const params = nationalId ? `?national_id=${encodeURIComponent(nationalId)}` : '';
    const res = await fetch(`${API_BASE_URL}/suggestions/track/${trackingNumber}${params}`);
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('الرقم الوطني غير مطابق');
      }
      throw new Error('Suggestion not found');
    }
    return res.json();
  }

  async submitRating(data: { tracking_number: string; rating: number; comment?: string; feedback_type?: 'positive' | 'negative' }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/public/suggestions/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Failed to submit rating');
    }
    return res.json();
  }

  async getRatingsStats(trackingNumber?: string): Promise<any> {
    const url = trackingNumber
      ? `${API_BASE_URL}/public/suggestions/ratings/stats?tracking_number=${trackingNumber}`
      : `${API_BASE_URL}/public/suggestions/ratings/stats`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch ratings stats');
    }
    return res.json();
  }

  async mySuggestions(): Promise<Suggestion[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const res = await fetch(`${API_BASE_URL}/users/me/suggestions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    const data = await res.json();
    return data.success ? data.data : [];
  }
}

class ApiAnnouncementsRepository implements IAnnouncementsRepository {
  async getAll(): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE_URL}/public/announcements`);
    return res.json();
  }

  async getPaginated(page: number = 1, perPage: number = 9, filter?: string): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (filter && filter !== 'all') params.append('filter', filter);
    const res = await fetch(`${API_BASE_URL}/public/announcements?${params.toString()}`);
    if (!res.ok) return { data: [], current_page: 1, last_page: 1, per_page: perPage, total: 0 };
    return res.json();
  }

  async getById(id: string): Promise<Announcement | null> {
    const res = await fetch(`${API_BASE_URL}/public/announcements/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async getByDirectorate(directorateId: string): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/${directorateId}/announcements`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  }
}

// --- Media Repository ---
export interface AlbumPhoto {
  id: string;
  url: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  file_name: string;
}

export interface AlbumData {
  id: string;
  title: string;
  title_ar: string;
  title_en: string;
  date: string;
  count: number;
  photos: AlbumPhoto[];
}

export interface IMediaRepository {
  getAll(): Promise<MediaItem[]>;
  getByType(type: string): Promise<MediaItem[]>;
  getPaginated(page: number, perPage: number, type?: string): Promise<PaginatedResponse<MediaItem>>;
  getAlbumPhotos(id: string): Promise<AlbumData>;
}

class MockMediaRepository implements IMediaRepository {
  async getAll(): Promise<MediaItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_MEDIA), 400));
  }
  async getByType(type: string): Promise<MediaItem[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (type === 'all') resolve(MOCK_MEDIA);
        else resolve(MOCK_MEDIA.filter(m => m.type === type));
      }, 300);
    });
  }
  async getPaginated(page: number = 1, perPage: number = 12, type?: string): Promise<PaginatedResponse<MediaItem>> {
    const all = type && type !== 'all' ? MOCK_MEDIA.filter(m => m.type === type) : MOCK_MEDIA;
    const start = (page - 1) * perPage;
    const data = all.slice(start, start + perPage);
    return {
      data,
      current_page: page,
      last_page: Math.ceil(all.length / perPage),
      per_page: perPage,
      total: all.length,
    };
  }
  async getAlbumPhotos(id: string): Promise<AlbumData> {
    const album = MOCK_MEDIA.find(m => m.id === id && m.type === 'photo' && m.count);
    if (!album) throw new Error('Album not found');
    const photos = Array.from({ length: album.count || 12 }).map((_, i) => ({
      id: `${id}-photo-${i}`,
      url: album.thumbnailUrl,
      title: `${album.title} - Photo ${i + 1}`,
      title_ar: `${album.title} - صورة ${i + 1}`,
      title_en: `${album.title} - Photo ${i + 1}`,
      file_name: `photo-${i + 1}.jpg`,
    }));
    return {
      id: album.id,
      title: album.title,
      title_ar: album.title,
      title_en: album.title,
      date: album.date,
      count: album.count || 12,
      photos,
    };
  }
}

class ApiMediaRepository implements IMediaRepository {
  async getAll(): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE_URL}/public/media`);
    if (!res.ok) return [];
    return res.json();
  }
  async getByType(type: string): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE_URL}/public/media?type=${type}`);
    if (!res.ok) return [];
    return res.json();
  }
  async getPaginated(page: number = 1, perPage: number = 12, type?: string): Promise<PaginatedResponse<MediaItem>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (type && type !== 'all') params.append('type', type);
    const res = await fetch(`${API_BASE_URL}/public/media?${params.toString()}`);
    if (!res.ok) return { data: [], current_page: 1, last_page: 1, per_page: perPage, total: 0 };
    return res.json();
  }
  async getAlbumPhotos(id: string): Promise<AlbumData> {
    const res = await fetch(`${API_BASE_URL}/public/media/${id}/photos`);
    if (!res.ok) throw new Error('Album not found');
    return res.json();
  }
}

// --- Roles Repository ---
export interface Role {
  id: number;
  name: string;
  label: string;
  permissions: string[];
}

export interface IRolesRepository {
  getAll(): Promise<Role[]>;
}

class MockRolesRepository implements IRolesRepository {
  private mockRoles: Role[] = [
    { id: 1, name: 'admin', label: 'مدير النظام', permissions: ['all'] },
    { id: 2, name: 'staff', label: 'موظف', permissions: ['manage_complaints', 'view_reports'] },
    { id: 3, name: 'citizen', label: 'مواطن', permissions: ['submit_complaint', 'track_complaint'] }
  ];

  async getAll(): Promise<Role[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.mockRoles), 300));
  }
}

class ApiRolesRepository implements IRolesRepository {
  async getAll(): Promise<Role[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/roles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        // Fallback to mock data if endpoint doesn't exist yet
        return [
          { id: 1, name: 'admin', label: 'مدير النظام', permissions: ['all'] },
          { id: 2, name: 'staff', label: 'موظف', permissions: ['manage_complaints', 'view_reports'] },
          { id: 3, name: 'citizen', label: 'مواطن', permissions: ['submit_complaint', 'track_complaint'] }
        ];
      }
      const json = await res.json();
      return json.data || json;
    } catch {
      return [
        { id: 1, name: 'admin', label: 'مدير النظام', permissions: ['all'] },
        { id: 2, name: 'staff', label: 'موظف', permissions: ['manage_complaints', 'view_reports'] },
        { id: 3, name: 'citizen', label: 'مواطن', permissions: ['submit_complaint', 'track_complaint'] }
      ];
    }
  }
}

// --- Services Repository ---
export interface IServicesRepository {
  getAll(): Promise<Service[]>;
  getPaginated(page?: number, perPage?: number, directorateId?: string, q?: string, isDigital?: boolean): Promise<PaginatedResponse<Service>>;
  getById(id: string): Promise<Service | null>;
}

class MockServicesRepository implements IServicesRepository {
  async getAll(): Promise<Service[]> {
    return new Promise(resolve => setTimeout(() => resolve(KEY_SERVICES), 400));
  }
  async getPaginated(page: number = 1, perPage: number = 12, directorateId?: string, q?: string, isDigital?: boolean): Promise<PaginatedResponse<Service>> {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = KEY_SERVICES;
        if (directorateId) filtered = filtered.filter(s => s.directorateId === directorateId);
        if (q) {
          const query = q.toLowerCase();
          filtered = filtered.filter(s =>
            s.title_ar?.toLowerCase().includes(query) ||
            s.title_en?.toLowerCase().includes(query) ||
            s.description_ar?.toLowerCase().includes(query) ||
            s.description_en?.toLowerCase().includes(query)
          );
        }
        if (isDigital !== undefined) {
          filtered = filtered.filter(s => s.isDigital === isDigital);
        }
        const total = filtered.length;
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        const start = (page - 1) * perPage;
        const data = filtered.slice(start, start + perPage);
        resolve({ data, current_page: page, last_page: lastPage, per_page: perPage, total });
      }, 400);
    });
  }
  async getById(id: string): Promise<Service | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(KEY_SERVICES.find(s => s.id === id) || null), 300);
    });
  }
}

class ApiServicesRepository implements IServicesRepository {
  async getAll(): Promise<Service[]> {
    const res = await fetch(`${API_BASE_URL}/public/services`);
    if (!res.ok) return [];
    return res.json();
  }
  async getPaginated(page: number = 1, perPage: number = 12, directorateId?: string, q?: string, isDigital?: boolean): Promise<PaginatedResponse<Service>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (directorateId) params.append('directorate_id', directorateId);
    if (q) params.append('q', q);
    if (isDigital !== undefined) params.append('is_digital', String(isDigital));
    const res = await fetch(`${API_BASE_URL}/public/services?${params.toString()}`);
    if (!res.ok) return { data: [], current_page: 1, last_page: 1, per_page: perPage, total: 0 };
    return res.json();
  }
  async getById(id: string): Promise<Service | null> {
    const res = await fetch(`${API_BASE_URL}/public/services/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
}

// --- Investment Repository ---
export interface IInvestmentRepository {
  getAll(params?: { category?: string; status?: string; featured?: boolean }): Promise<Investment[]>;
  getByCategory(category: string): Promise<Investment[]>;
  getById(id: number): Promise<Investment | null>;
  getStats(): Promise<InvestmentStats>;
}

class MockInvestmentRepository implements IInvestmentRepository {
  private mockData: Investment[] = [];

  async getAll(params?: { category?: string; status?: string; featured?: boolean }): Promise<Investment[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.mockData), 400));
  }
  async getByCategory(category: string): Promise<Investment[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.filter(i => i.category === category)), 300);
    });
  }
  async getById(id: number): Promise<Investment | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.find(i => i.id === id) || null), 300);
    });
  }
  async getStats(): Promise<InvestmentStats> {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        total_opportunities: 0,
        available_count: 0,
        total_investment_value: 0,
        sectors_count: 0,
        labels: {}
      }), 300);
    });
  }
}
class ApiInvestmentRepository implements IInvestmentRepository {
  async getAll(params?: { category?: string; status?: string; featured?: boolean }): Promise<Investment[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.featured) searchParams.append('featured', 'true');

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/public/investments${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }
  async getByCategory(category: string): Promise<Investment[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/investments/category/${category}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }
  async getById(id: number): Promise<Investment | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/investments/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || json;
    } catch {
      return null;
    }
  }
  async getStats(): Promise<InvestmentStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/investments/stats`);
      if (!res.ok) {
        return { total_opportunities: 0, available_count: 0, total_investment_value: 0, sectors_count: 0, labels: {} } as InvestmentStats;
      }
      const json = await res.json();
      return json.data || json;
    } catch {
      return {
        total_opportunities: 0,
        available_count: 0,
        total_investment_value: 0,
        sectors_count: 0,
        labels: {}
      };
    }
  }
}

// --- Promotional Sections Repository ---
export interface IPromotionalSectionsRepository {
  getAll(): Promise<PromotionalSection[]>;
  getByPosition(position: string): Promise<PromotionalSection[]>;
  getById(id: number): Promise<PromotionalSection | null>;
}

class MockPromotionalSectionsRepository implements IPromotionalSectionsRepository {
  private mockData: PromotionalSection[] = [
    {
      id: 1,
      title_ar: 'كواليس التحضيرات النهائية',
      title_en: 'Behind the Scenes: Final Preparations',
      description_ar: 'شاهد التقرير الحصري من قلب الحدث مع مراسلنا.',
      description_en: 'Watch the exclusive report from the heart of the event.',
      button_text_ar: 'شاهد الفيديو',
      button_text_en: 'Watch Video',
      image: null,
      background_color: '#951d1dff',
      icon: 'Play',
      button_url: '#video-exclusive',
      type: 'video',
      type_label: { ar: 'فيديو', en: 'Video' },
      position: 'grid_bottom',
      position_label: { ar: 'أسفل الشبكة', en: 'Grid Bottom' },
      display_order: 1,
      metadata: { badge_ar: 'فيديو حصري', badge_en: 'Exclusive Video' },
      video_url: 'https://vjs.zencdn.net/v/oceans.mp4', // Mock video URL
    },
    {
      id: 2,
      title_ar: 'كاتب ومحلل',
      title_en: 'Writers & Analysts',
      description_ar: 'انضم إلى مجتمعنا من الخبراء والمحللين لقراءة تحليلات عميقة.',
      description_en: 'Join our community of experts and analysts.',
      button_text_ar: 'تصفح الكتاب',
      button_text_en: 'Browse Writers',
      image: null,
      background_color: '#1A2E1A',
      icon: 'Users',
      button_url: '/writers',
      type: 'stats',
      type_label: { ar: 'إحصائيات', en: 'Statistics' },
      position: 'grid_bottom',
      position_label: { ar: 'أسفل الشبكة', en: 'Grid Bottom' },
      display_order: 2,
      metadata: { stat_value: '30+', stat_label_ar: 'كاتب ومحلل', stat_label_en: 'Writers & Analysts' },
    },
  ];

  async getAll(): Promise<PromotionalSection[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.mockData), 400));
  }

  async getByPosition(position: string): Promise<PromotionalSection[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.filter(s => s.position === position)), 300);
    });
  }

  async getById(id: number): Promise<PromotionalSection | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.find(s => s.id === id) || null), 300);
    });
  }
}

class ApiPromotionalSectionsRepository implements IPromotionalSectionsRepository {
  async getAll(): Promise<PromotionalSection[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/promotional-sections`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }

  async getByPosition(position: string): Promise<PromotionalSection[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/promotional-sections/position/${position}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }

  async getById(id: number): Promise<PromotionalSection | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/promotional-sections/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || json;
    } catch {
      return null;
    }
  }
}

// --- Newsletter Repository ---
export interface INewsletterRepository {
  subscribe(email: string, recaptchaToken?: string | null): Promise<{ success: boolean; message?: string }>;
}

class MockNewsletterRepository implements INewsletterRepository {
  async subscribe(email: string): Promise<{ success: boolean; message?: string }> {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: 'Subscribed successfully (Mock)' }), 1000);
    });
  }
}

class ApiNewsletterRepository implements INewsletterRepository {
  async subscribe(email: string, recaptchaToken?: string | null): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptcha_token: recaptchaToken }),
      });
      const data = await res.json();
      return { success: res.ok && data.success, message: data.message };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }
}

// --- FAQ Repository ---
class MockFaqRepository implements IFaqRepository {
  async getAll(directorateId?: string): Promise<FAQ[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: '1', question_ar: 'كيف يمكنني الحصول على ترخيص منشأة صناعية؟', answer_ar: 'يمكنك التقدم بطلب ترخيص منشأة صناعية عبر قسم الإدارة العامة للصناعة في البوابة.', question_en: 'How can I obtain an industrial facility license?', answer_en: 'You can apply for an industrial facility license through the General Administration for Industry section.' },
      { id: '2', question_ar: 'هل يمكنني تقديم شكوى حماية مستهلك إلكترونياً؟', answer_ar: 'نعم، يمكنك تقديم شكاوى الغش التجاري والمخالفات السعرية عبر قسم الإدارة العامة للتجارة الداخلية وحماية المستهلك.', question_en: 'Can I file a consumer protection complaint electronically?', answer_en: 'Yes, you can file commercial fraud and price violation complaints through the General Administration for Internal Trade and Consumer Protection.' },
    ]), 500));
  }
}

class ApiFaqRepository implements IFaqRepository {
  async getAll(directorateId?: string): Promise<FAQ[]> {
    try {
      const params = new URLSearchParams();
      if (directorateId) params.append('directorate_id', directorateId);
      const url = `${API_BASE_URL}/public/faqs${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }
}

// --- Search Repository ---
class MockSearchRepository implements ISearchRepository {
  async search(query: string, type?: string, dateFrom?: string, dateTo?: string, entity?: string, lang?: string): Promise<SearchResults> {
    return new Promise(resolve => setTimeout(() => resolve({ news: [], decrees: [], announcements: [], services: [], faqs: [], pages: [], total: 0 }), 500));
  }
}

class ApiSearchRepository implements ISearchRepository {
  async search(query: string, type?: string, dateFrom?: string, dateTo?: string, entity?: string, lang?: string): Promise<SearchResults> {
    const empty: SearchResults = { news: [], decrees: [], announcements: [], services: [], faqs: [], pages: [], total: 0 };
    try {
      const params = new URLSearchParams({ q: query });
      if (type) params.append('type', type);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      if (entity) params.append('entity', entity);
      if (lang) params.append('lang', lang);
      const res = await fetch(`${API_BASE_URL}/public/search?${params.toString()}`);
      if (!res.ok) return empty;
      const json = await res.json();

      // Backend returns { results: [...], total, search_type }
      // Transform flat results array into categorized structure
      const results: SearchResult[] = json.results || [];
      const grouped: SearchResults = {
        news: [],
        decrees: [],
        announcements: [],
        services: [],
        faqs: [],
        pages: [],
        total: json.total || results.length,
      };
      for (const item of results) {
        const mapped: SearchResult = {
          ...item,
          description: item.description || item.excerpt || '',
        };
        switch (item.type) {
          case 'news':
            grouped.news.push(mapped);
            break;
          case 'decree':
          case 'law':
            grouped.decrees.push(mapped);
            break;
          case 'announcement':
            grouped.announcements.push(mapped);
            break;
          case 'service':
            grouped.services.push(mapped);
            break;
          case 'faq':
            grouped.faqs.push(mapped);
            break;
          default:
            grouped.pages.push(mapped);
            break;
        }
      }
      return grouped;
    } catch {
      return empty;
    }
  }
}

// Complaint Templates API
export async function getComplaintTemplates(anonymous?: boolean): Promise<any[]> {
  const params = anonymous ? '?anonymous=true' : '';
  try {
    const res = await fetch(`${API_BASE_URL}/public/complaint-templates${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Open Data API
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

// Settings & Contact API
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

// --- AI Tools ---
export interface IAiRepository {
  summarize(content: string, language?: string): Promise<{ summary: string }>;
}

class MockAiRepository implements IAiRepository {
  async summarize(content: string, language: string = 'ar'): Promise<{ summary: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          summary: language === 'en'
            ? 'Auto-generated summary: This article covers the latest developments at the ministry, including strategic updates and new projects aimed at improving services for citizens. (This is a demo summary generated by the system)'
            : 'ملخص تلقائي للمقال: يتناول هذا المقال أهم التطورات الأخيرة في الوزارة، بما في ذلك التحديثات الاستراتيجية والمشاريع الجديدة التي تهدف إلى تحسين الخدمات المقدمة للمواطنين. (هذا ملخص تجريبي تم إنشاؤه بواسطة النظام)'
        });
      }, 1500);
    });
  }
}

class ApiAiRepository implements IAiRepository {
  async summarize(content: string, language: string = 'ar'): Promise<{ summary: string }> {
    const text = (content || '').trim();
    if (!text) {
      throw new Error(language === 'ar' ? 'لا يوجد محتوى للتلخيص' : 'No content to summarize');
    }

    // Use Next.js rewrite proxy to AI service (not the Laravel API)
    const res = await fetch(`/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ text, language, max_length: 500 }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || (language === 'ar' ? 'فشل في إنشاء الملخص' : 'Failed to generate summary'));
    }
    return res.json();
  }
}

export const API = {
  settings: settingsApi,
  openData: openDataApi,
  directorates: USE_MOCK_DATA ? new MockDirectorateRepository() : new ApiDirectorateRepository(),
  news: USE_MOCK_DATA ? new MockNewsRepository() : new ApiNewsRepository(),
  decrees: USE_MOCK_DATA ? new MockDecreeRepository() : new ApiDecreeRepository(),
  complaints: USE_MOCK_DATA ? new MockComplaintRepository() : new ApiComplaintRepository(),
  staff: USE_MOCK_DATA ? new MockStaffRepository() : new ApiStaffRepository(),
  content: USE_MOCK_DATA ? new MockContentRepository() : new ApiContentRepository(),
  users: USE_MOCK_DATA ? new MockUserRepository() : new ApiUserRepository(),
  roles: USE_MOCK_DATA ? new MockRolesRepository() : new ApiRolesRepository(),
  reports: USE_MOCK_DATA ? new MockReportsRepository() : new ApiReportsRepository(),
  announcements: USE_MOCK_DATA ? new MockAnnouncementsRepository() : new ApiAnnouncementsRepository(),
  suggestions: USE_MOCK_DATA ? new MockSuggestionRepository() : new ApiSuggestionRepository(),
  media: new MockMediaRepository(),
  services: USE_MOCK_DATA ? new MockServicesRepository() : new ApiServicesRepository(),
  investments: USE_MOCK_DATA ? new MockInvestmentRepository() : new ApiInvestmentRepository(),
  promotionalSections: USE_MOCK_DATA ? new MockPromotionalSectionsRepository() : new ApiPromotionalSectionsRepository(),
  newsletter: USE_MOCK_DATA ? new MockNewsletterRepository() : new ApiNewsletterRepository(),
  faqs: USE_MOCK_DATA ? new MockFaqRepository() : new ApiFaqRepository(),
  search: USE_MOCK_DATA ? new MockSearchRepository() : new ApiSearchRepository(),
  ai: USE_MOCK_DATA ? new MockAiRepository() : new ApiAiRepository(),
  quickLinks: {
    async getBySection(section: string = 'homepage'): Promise<any[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/public/quick-links?section=${section}`);
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
    async suggest(query: string): Promise<AutocompleteSuggestion[]> {
      try {
        if (query.length < 2) return [];
        const res = await fetch(`${API_BASE_URL}/public/search/autocomplete?q=${encodeURIComponent(query)}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.suggestions || [];
      } catch { return []; }
    },
  },
};
