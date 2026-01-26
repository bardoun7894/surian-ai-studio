import { Directorate, Service, Article, NewsItem, Decree, Ticket, ComplaintData, User, SuggestionData, Suggestion, MediaItem, PromotionalSection } from '../types';
import { DIRECTORATES, KEY_SERVICES, OFFICIAL_NEWS, BREAKING_NEWS, HERO_ARTICLE, GRID_ARTICLES, DECREES, MOCK_MEDIA } from '@/constants';

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
  getGroupedByDirectorate(): Promise<{ directorate: { id: string, name: string, icon: string }, news: NewsItem[] }[]>;
  getBreakingNews(): Promise<string[]>;
  getHeroArticle(): Promise<Article>;
  getGridArticles(): Promise<Article[]>;
}

export interface IDecreeRepository {
  getAll(): Promise<Decree[]>;
  search(query: string, type?: string): Promise<Decree[]>;
}

export interface IComplaintRepository {
  submit(data: ComplaintData): Promise<string>; // Returns Ticket ID
  track(ticketId: string): Promise<Ticket | null>;
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
  // Admin methods
  getAll(params?: { search?: string; role_id?: number; is_active?: boolean; per_page?: number; page?: number }): Promise<{ data: User[], total: number, current_page: number, per_page: number, last_page: number }>;
  getById(id: number): Promise<{ user: User; statistics: any } | null>;
  create(data: { name: string; email: string; role_id: number; directorate_id?: string }): Promise<{ user: User; temp_password: string }>;
  update(id: number, data: { name?: string; email?: string; phone?: string; role_id?: number; directorate_id?: string }): Promise<User | null>;
  toggleStatus(id: number): Promise<{ is_active: boolean } | null>;
}

export interface ISuggestionRepository {
  submit(data: SuggestionData): Promise<Suggestion>;
  track(trackingNumber: string): Promise<any>;
  mySuggestions(): Promise<Suggestion[]>;
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
    // Mock Data for Featured Directorates - MOE Structure
    const featuredDocs: Directorate[] = [
      {
        id: 'd1',
        name: 'الإدارة العامة للصناعة',
        description: 'التراخيص الصناعية والمناطق الصناعية والمواصفات والمقاييس',
        icon: 'Factory',
        servicesCount: 6,
        featured: true,
        subDirectorates: [
          { id: 'sub-1-1', name: 'مركز التنمية الصناعية', url: '/directorates/industry/development-center', isExternal: false },
          { id: 'sub-1-2', name: 'مديرية المدن والمناطق الصناعية', url: '/directorates/industry/industrial-zones', isExternal: false },
          { id: 'sub-1-3', name: 'هيئة المواصفات والمقاييس السورية', url: 'https://sasmo.gov.sy', isExternal: true },
        ]
      },
      {
        id: 'd2',
        name: 'الإدارة العامة للاقتصاد',
        description: 'التجارة الخارجية والمعارض الدولية ودعم المشاريع الصغيرة',
        icon: 'TrendingUp',
        servicesCount: 6,
        featured: true,
        subDirectorates: [
          { id: 'sub-2-1', name: 'مديرية التجارة الخارجية', url: '/directorates/economy/foreign-trade', isExternal: false },
          { id: 'sub-2-2', name: 'هيئة تنمية المشروعات الصغيرة والمتوسطة', url: '/directorates/economy/sme', isExternal: false },
          { id: 'sub-2-3', name: 'المؤسسة العامة للمعارض والأسواق الدولية', url: '/directorates/economy/exhibitions', isExternal: false },
        ]
      },
      {
        id: 'd3',
        name: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك',
        description: 'حماية المستهلك وتسجيل الشركات والعلامات التجارية',
        icon: 'ShieldCheck',
        servicesCount: 6,
        featured: true,
        subDirectorates: [
          { id: 'sub-3-1', name: 'مديرية حماية المستهلك وسلامة الغذاء', url: '/directorates/trade/consumer-protection', isExternal: false },
          { id: 'sub-3-2', name: 'مديرية الشركات', url: '/directorates/trade/companies', isExternal: false },
          { id: 'sub-3-3', name: 'مديرية حماية الملكية', url: '/directorates/trade/property-protection', isExternal: false },
        ]
      }
    ];
    return new Promise(resolve => setTimeout(() => resolve(featuredDocs), 400));
  }
}

class MockNewsRepository implements INewsRepository {
  async getOfficialNews(): Promise<NewsItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(OFFICIAL_NEWS), 600));
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
  async getAll(): Promise<Decree[]> {
    return new Promise(resolve => setTimeout(() => resolve(DECREES), 500));
  }
  async search(query: string, type?: string): Promise<Decree[]> {
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
    return new Promise(resolve => {
      setTimeout(() => resolve('GOV-' + Math.floor(Math.random() * 100000)), 1500);
    });
  }
  async track(ticketId: string): Promise<Ticket | null> {
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
  async getAll(): Promise<Directorate[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates`);
    return res.json();
  }
  async getById(id: string): Promise<Directorate | null> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
  async getServicesByDirectorate(id: string): Promise<Service[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/${id}/services`);
    return res.json();
  }
  async getNewsByDirectorate(id: string): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/${id}/news`);
    if (!res.ok) return [];
    return res.json();
  }
  async getFeatured(): Promise<Directorate[]> {
    const res = await fetch(`${API_BASE_URL}/public/directorates/featured`);
    if (!res.ok) return [];
    return res.json();
  }
}

class ApiNewsRepository implements INewsRepository {
  async getOfficialNews(): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE_URL}/public/news`);
    return res.json();
  }
  async getGroupedByDirectorate(): Promise<{ directorate: { id: string, name: string, icon: string }, news: NewsItem[] }[]> {
    const res = await fetch(`${API_BASE_URL}/public/news/by-directorate`);
    return res.json();
  }
  async getBreakingNews(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/public/news/breaking`);
    return res.json();
  }
  async getHeroArticle(): Promise<Article> {
    const res = await fetch(`${API_BASE_URL}/public/news/hero`);
    return res.json();
  }
  async getGridArticles(): Promise<Article[]> {
    const res = await fetch(`${API_BASE_URL}/public/news/grid`);
    return res.json();
  }
}

class ApiDecreeRepository implements IDecreeRepository {
  async getAll(): Promise<Decree[]> {
    const res = await fetch(`${API_BASE_URL}/decrees`);
    return res.json();
  }
  async search(query: string, type?: string): Promise<Decree[]> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    const res = await fetch(`${API_BASE_URL}/decrees/search?${params.toString()}`);
    return res.json();
  }
}

class ApiComplaintRepository implements IComplaintRepository {
  async submit(data: ComplaintData): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    return result.tracking_number; // Use tracking_number from backend
  }
  async track(ticketId: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE_URL}/complaints/track/${ticketId}`);
    if (!res.ok) return null;
    return res.json();
  }
  async myComplaints(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE_URL}/users/me/complaints`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) return [];
    return res.json();
  }
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.ok;
  }
  async rate(trackingNumber: string, rating: number, comment?: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/complaints/${trackingNumber}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment })
    });
    return res.ok;
  }
}

class ApiStaffRepository implements IStaffRepository {
  async listComplaints(params?: any): Promise<{ data: Ticket[], total: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/staff/complaints?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  }
  async updateStatus(id: string, status: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ai_category: category, priority })
    });
    return res.ok;
  }
  async getComplaintLogs(id: string): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/logs`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  }
  async addResponse(id: string, response: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ response })
    });
    return res.ok;
  }
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/staff/analytics`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  }
}

class ApiContentRepository implements IContentRepository {
  async getAll(params?: any): Promise<{ data: any[], total: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/admin/content?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  }
  async create(data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.ok;
  }
  async getById(id: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  }
  async getVersions(id: string): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}/versions`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  }
  async restoreVersion(id: string, versionNumber: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}/versions/${versionNumber}/restore`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  }

  async exportData(type: string, params?: any): Promise<Blob> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/reports/export?type=${type}&${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.blob();
  }
}

// --- Factory / Export ---
class ApiUserRepository implements IUserRepository {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': 'application/json'
    };
  }

  async updateProfile(data: any): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
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
  date: string;
  category: string;
  description: string;
  isUrgent?: boolean;
}

export interface IAnnouncementsRepository {
  getAll(): Promise<Announcement[]>;
  getById(id: string): Promise<Announcement | null>;
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

  async getById(id: string): Promise<Announcement | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.announcements.find(a => a.id === id) || null), 300);
    });
  }
}

class MockSuggestionRepository implements ISuggestionRepository {
  async submit(data: SuggestionData): Promise<Suggestion> {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        id: Math.random().toString(36).substr(2, 9),
        trackingNumber: 'SUG-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
        status: 'received',
        createdAt: new Date().toISOString()
      }), 1500);
    });
  }

  async track(trackingNumber: string): Promise<any> {
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
            description: 'اقتراح تحسين الخدمات الإلكترونية',
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
}

class ApiSuggestionRepository implements ISuggestionRepository {
  async submit(data: SuggestionData): Promise<Suggestion> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'files' && Array.isArray(value)) {
        value.forEach(file => formData.append('files', file));
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });

    const res = await fetch(`${API_BASE_URL}/suggestions`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data', // Let browser set boundary
      },
      body: formData
    });
    return res.json();
  }

  async track(trackingNumber: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/suggestions/track/${trackingNumber}`);
    if (!res.ok) {
      throw new Error('Suggestion not found');
    }
    return res.json();
  }

  async mySuggestions(): Promise<Suggestion[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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

  async getById(id: string): Promise<Announcement | null> {
    const res = await fetch(`${API_BASE_URL}/public/announcements/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
}

// --- Media Repository ---
export interface IMediaRepository {
  getAll(): Promise<MediaItem[]>;
  getByType(type: string): Promise<MediaItem[]>;
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
}

class ApiMediaRepository implements IMediaRepository {
  async getAll(): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE_URL}/media`);
    if (!res.ok) return [];
    return res.json();
  }
  async getByType(type: string): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE_URL}/media?type=${type}`);
    if (!res.ok) return [];
    return res.json();
  }
}

// --- Roles Repository ---
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
  getById(id: string): Promise<Service | null>;
}

class MockServicesRepository implements IServicesRepository {
  async getAll(): Promise<Service[]> {
    return new Promise(resolve => setTimeout(() => resolve(KEY_SERVICES), 400));
  }
  async getById(id: string): Promise<Service | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(KEY_SERVICES.find(s => s.id === id) || null), 300);
    });
  }
}

class ApiServicesRepository implements IServicesRepository {
  async getAll(): Promise<Service[]> {
    const res = await fetch(`${API_BASE_URL}/services`);
    if (!res.ok) return [];
    return res.json();
  }
  async getById(id: string): Promise<Service | null> {
    const res = await fetch(`${API_BASE_URL}/services/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
}

// --- Investment Repository ---
export interface Investment {
  id: number;
  title_ar: string;
  title_en: string;
  sector_ar: string;
  sector_en: string;
  location_ar: string;
  location_en: string;
  investment_amount: string | null;
  formatted_amount: string;
  currency: string;
  status: string;
  status_label: { ar: string; en: string };
  category: string;
  icon: string;
  image: string | null;
  is_featured: boolean;
  description_ar?: string;
  description_en?: string;
}

export interface InvestmentStats {
  total: number;
  by_category: Record<string, number>;
  by_status: Record<string, number>;
  total_investment_value: number;
  featured_count: number;
}

export interface IInvestmentRepository {
  getAll(): Promise<Investment[]>;
  getByCategory(category: string): Promise<Investment[]>;
  getById(id: number): Promise<Investment | null>;
  getStats(): Promise<InvestmentStats>;
}

class MockInvestmentRepository implements IInvestmentRepository {
  private mockData: Investment[] = [
    {
      id: 1,
      title_ar: 'مشروع الطاقة الشمسية - ريف دمشق',
      title_en: 'Solar Energy Project - Damascus Countryside',
      sector_ar: 'الطاقة المتجددة',
      sector_en: 'Renewable Energy',
      location_ar: 'ريف دمشق',
      location_en: 'Damascus Countryside',
      investment_amount: '5000000.00',
      formatted_amount: '$5,000,000',
      currency: 'USD',
      status: 'available',
      status_label: { ar: 'متاح', en: 'Available' },
      category: 'opportunities',
      icon: 'Zap',
      image: null,
      is_featured: true
    },
    {
      id: 2,
      title_ar: 'مجمع صناعي متكامل - حلب',
      title_en: 'Integrated Industrial Complex - Aleppo',
      sector_ar: 'الصناعة',
      sector_en: 'Industry',
      location_ar: 'حلب',
      location_en: 'Aleppo',
      investment_amount: '15000000.00',
      formatted_amount: '$15,000,000',
      currency: 'USD',
      status: 'available',
      status_label: { ar: 'متاح', en: 'Available' },
      category: 'opportunities',
      icon: 'Factory',
      image: null,
      is_featured: true
    }
  ];

  async getAll(): Promise<Investment[]> {
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
        total: 18,
        by_category: { opportunities: 6, 'one-stop': 6, licenses: 4, guide: 2 },
        by_status: { available: 16, under_review: 2 },
        total_investment_value: 63500000,
        featured_count: 3
      }), 300);
    });
  }
}

class ApiInvestmentRepository implements IInvestmentRepository {
  async getAll(): Promise<Investment[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/investments`);
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
        return { total: 0, by_category: {}, by_status: {}, total_investment_value: 0, featured_count: 0 };
      }
      const json = await res.json();
      return json.data || json;
    } catch {
      return { total: 0, by_category: {}, by_status: {}, total_investment_value: 0, featured_count: 0 };
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
      background_color: '#DC2626',
      icon: 'Play',
      button_url: '#video-exclusive',
      type: 'video',
      type_label: { ar: 'فيديو', en: 'Video' },
      position: 'grid_bottom',
      position_label: { ar: 'أسفل الشبكة', en: 'Grid Bottom' },
      display_order: 1,
      metadata: { badge_ar: 'فيديو حصري', badge_en: 'Exclusive Video' },
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

export const API = {
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
  media: USE_MOCK_DATA ? new MockMediaRepository() : new ApiMediaRepository(),
  services: USE_MOCK_DATA ? new MockServicesRepository() : new ApiServicesRepository(),
  investments: USE_MOCK_DATA ? new MockInvestmentRepository() : new ApiInvestmentRepository(),
  promotionalSections: USE_MOCK_DATA ? new MockPromotionalSectionsRepository() : new ApiPromotionalSectionsRepository(),
};