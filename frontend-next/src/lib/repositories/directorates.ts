import { Directorate, Service, NewsItem, DIRECTORATES, KEY_SERVICES, API_BASE_URL, USE_MOCK_DATA } from './_shared';

export interface IDirectorateRepository {
  getAll(): Promise<Directorate[]>;
  getById(id: string): Promise<Directorate | null>;
  getServicesByDirectorate(id: string): Promise<Service[]>;
  getNewsByDirectorate(id: string): Promise<NewsItem[]>;
  getFeatured(): Promise<Directorate[]>;
}


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
      ...sub,
      id: String(sub?.id ?? ''),
      name: sub?.name ?? {
        ar: sub?.name_ar ?? '',
        en: sub?.name_en ?? sub?.name_ar ?? '',
      },
      description: sub?.description ?? {
        ar: sub?.description_ar ?? '',
        en: sub?.description_en ?? sub?.description_ar ?? '',
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
      logo: (() => {
        const logoVal = raw?.logo ?? raw?.logo_path ?? raw?.image;
        if (!logoVal) return undefined;
        // Already valid URL or path
        if (logoVal.startsWith('http') || logoVal.startsWith('/')) return logoVal;
        return '/storage/' + logoVal;
      })(),
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


export const createDirectorateRepository = () =>
  USE_MOCK_DATA ? new MockDirectorateRepository() : new ApiDirectorateRepository();
