import { API_BASE_URL, USE_MOCK_DATA, getXsrfToken } from './_shared';

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
  getPaginated(page?: number, perPage?: number, filter?: string, search?: string): Promise<PaginatedResponse<any>>;
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


class ApiAnnouncementsRepository implements IAnnouncementsRepository {
  async getAll(): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE_URL}/public/announcements`);
    return res.json();
  }

  async getPaginated(page: number = 1, perPage: number = 9, filter?: string, search?: string): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (filter && filter !== 'all') params.append('filter', filter);
    if (search) params.append('search', search);
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


export const createAnnouncementsRepository = () =>
  USE_MOCK_DATA ? new MockAnnouncementsRepository() : new ApiAnnouncementsRepository();
