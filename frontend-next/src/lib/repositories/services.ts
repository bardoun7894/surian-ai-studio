import { Service, API_BASE_URL, USE_MOCK_DATA, PaginatedResponse, KEY_SERVICES } from './_shared';

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


export const createServicesRepository = () =>
  USE_MOCK_DATA ? new MockServicesRepository() : new ApiServicesRepository();
