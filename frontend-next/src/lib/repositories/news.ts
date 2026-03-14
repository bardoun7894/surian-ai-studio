import { NewsItem, Article, PaginatedResponse, OFFICIAL_NEWS, BREAKING_NEWS, HERO_ARTICLE, GRID_ARTICLES, API_BASE_URL, USE_MOCK_DATA } from './_shared';

export interface INewsRepository {
  getOfficialNews(): Promise<NewsItem[]>;
  getPaginated(page?: number, perPage?: number, directorateId?: string): Promise<PaginatedResponse<NewsItem>>;
  getById(id: string): Promise<NewsItem | null>;
  getGroupedByDirectorate(): Promise<{ directorate: { id: string, name: string, icon: string }, news: NewsItem[] }[]>;
  getBreakingNews(duration?: string): Promise<string[]>;
  getHeroArticle(): Promise<Article>;
  getGridArticles(): Promise<Article[]>;
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
  async getBreakingNews(duration?: string): Promise<string[]> {
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
  async getBreakingNews(duration: string = '48h'): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/public/news/breaking?duration=${duration}`);
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


export const createNewsRepository = () =>
  USE_MOCK_DATA ? new MockNewsRepository() : new ApiNewsRepository();
