import { Directorate, Service, Article, NewsItem, Decree, Ticket, ComplaintData } from '../types';
import { DIRECTORATES, KEY_SERVICES, OFFICIAL_NEWS, BREAKING_NEWS, HERO_ARTICLE, GRID_ARTICLES, DECREES } from '../constants';

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
    return result.ticketId;
  }
  async track(ticketId: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE_URL}/complaints/${ticketId}`);
    if (!res.ok) return null;
    return res.json();
  }
}

// --- Factory / Export ---
export const API = {
  directorates: USE_MOCK_DATA ? new MockDirectorateRepository() : new ApiDirectorateRepository(),
  news: USE_MOCK_DATA ? new MockNewsRepository() : new ApiNewsRepository(),
  decrees: USE_MOCK_DATA ? new MockDecreeRepository() : new ApiDecreeRepository(),
  complaints: USE_MOCK_DATA ? new MockComplaintRepository() : new ApiComplaintRepository(),
};