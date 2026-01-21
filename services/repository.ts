import { Directorate, Service, Article, NewsItem, Decree, Ticket, ComplaintData, User } from '../types';
import { DIRECTORATES, KEY_SERVICES, OFFICIAL_NEWS, BREAKING_NEWS, HERO_ARTICLE, GRID_ARTICLES, DECREES } from '@/constants';

// --- Configuration ---
const USE_MOCK_DATA = true; // Set to FALSE to use real API calls
const API_BASE_URL = 'https://api.egov.sy/v1'; // Example Backend URL

// --- Interfaces ---
export interface IDirectorateRepository {
  getAll(): Promise<Directorate[]>;
  getById(id: string): Promise<Directorate | null>;
  getServicesByDirectorate(id: string): Promise<Service[]>;
}

export interface INewsRepository {
  getOfficialNews(): Promise<NewsItem[]>;
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
  getAll(params?: any): Promise<{ data: any[], total: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<any>;
}


export interface IUserRepository {
  updateProfile(data: { name?: string; email?: string; password?: string }): Promise<User | null>;
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
}

class MockUserRepository implements IUserRepository {
  async updateProfile(data: any): Promise<User | null> {
    return new Promise(resolve => setTimeout(() => resolve({ id: '1', name: data.name || 'User', email: data.email || 'user@example.com', role: 'user' }), 500));
  }
}

// --- API Implementations (Real Backend) ---
class ApiDirectorateRepository implements IDirectorateRepository {
  async getAll(): Promise<Directorate[]> {
    const res = await fetch(`${API_BASE_URL}/directorates`);
    return res.json();
  }
  async getById(id: string): Promise<Directorate | null> {
    const res = await fetch(`${API_BASE_URL}/directorates/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
  async getServicesByDirectorate(id: string): Promise<Service[]> {
    const res = await fetch(`${API_BASE_URL}/directorates/${id}/services`);
    return res.json();
  }
}

class ApiNewsRepository implements INewsRepository {
  async getOfficialNews(): Promise<NewsItem[]> {
    const res = await fetch(`${API_BASE_URL}/news`);
    return res.json();
  }
  async getBreakingNews(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/news/breaking`);
    return res.json();
  }
  async getHeroArticle(): Promise<Article> {
    const res = await fetch(`${API_BASE_URL}/news/hero`);
    return res.json();
  }
  async getGridArticles(): Promise<Article[]> {
    const res = await fetch(`${API_BASE_URL}/news/grid`);
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
              { name: 'وزارة الداخلية', count: 120 },
              { name: 'وزارة التربية', count: 80 },
              { name: 'وزارة الصحة', count: 60 },
              { name: 'وزارة العدل', count: 50 },
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
  async updateProfile(data: any): Promise<User | null> {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) return null;
    return res.json();
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
      title: 'إعلان مناقصة لتوريد أجهزة حاسوب',
      date: '2024-05-20',
      category: 'مناقصات',
      description: 'تعلن وزارة الاتصالات عن رغبتها في إجراء مناقصة لتوريد 500 جهاز حاسوب مكتبي.',
      isUrgent: false
    },
    {
      id: 'a2',
      title: 'تعلن وزارة التعليم العالي عن منح دراسية',
      date: '2024-05-18',
      category: 'منح',
      description: 'منح دراسية للدراسات العليا في الجامعات الحكومية للعام الدراسي 2024-2025.',
      isUrgent: true
    },
    {
      id: 'a3',
      title: 'تعطيل الجهات العامة',
      date: '2024-05-15',
      category: 'إداري',
      description: 'تعطل الجهات العامة يوم الأحد بمناسبة عيد الشهداء.',
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

class ApiAnnouncementsRepository implements IAnnouncementsRepository {
  async getAll(): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE_URL}/announcements`);
    return res.json();
  }

  async getById(id: string): Promise<Announcement | null> {
    const res = await fetch(`${API_BASE_URL}/announcements/${id}`);
    if (!res.ok) return null;
    return res.json();
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
  reports: USE_MOCK_DATA ? new MockReportsRepository() : new ApiReportsRepository(),
  announcements: USE_MOCK_DATA ? new MockAnnouncementsRepository() : new ApiAnnouncementsRepository(),
};