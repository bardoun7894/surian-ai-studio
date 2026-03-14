import { Decree, DECREES, API_BASE_URL, USE_MOCK_DATA } from './_shared';

export interface IDecreeRepository {
  getAll(): Promise<Decree[]>;
  search(query: string, type?: string, directorateId?: string): Promise<Decree[]>;
}


class MockDecreeRepository implements IDecreeRepository {
  async getAll(): Promise<Decree[]> {
    return new Promise(resolve => setTimeout(() => resolve(DECREES), 500));
  }
  async search(query: string, type?: string, directorateId?: string): Promise<Decree[]> {
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


class ApiDecreeRepository implements IDecreeRepository {
  async getAll(): Promise<Decree[]> {
    const res = await fetch(`${API_BASE_URL}/public/decrees`);
    if (!res.ok) return [];
    return res.json();
  }
  async search(query: string, type?: string, directorateId?: string): Promise<Decree[]> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    if (directorateId) params.append('directorate_id', directorateId);
    const res = await fetch(`${API_BASE_URL}/public/decrees?${params.toString()}`);
    if (!res.ok) return [];
    return res.json();
  }
}


export const createDecreeRepository = () =>
  USE_MOCK_DATA ? new MockDecreeRepository() : new ApiDecreeRepository();
