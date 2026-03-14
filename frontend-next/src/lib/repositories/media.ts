import { MediaItem, MOCK_MEDIA, API_BASE_URL, getXsrfToken } from './_shared';

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
  getAll(lang?: string): Promise<MediaItem[]>;
  getByType(type: string, lang?: string): Promise<MediaItem[]>;
  getPaginated(page: number, perPage: number, type?: string, month?: number | null, year?: number | null, lang?: string): Promise<PaginatedResponse<MediaItem>>;
  getAlbumPhotos(id: string, lang?: string): Promise<AlbumData>;
}

class MockMediaRepository implements IMediaRepository {
  async getAll(_lang?: string): Promise<MediaItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_MEDIA), 400));
  }
  async getByType(type: string, _lang?: string): Promise<MediaItem[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (type === 'all') resolve(MOCK_MEDIA);
        else resolve(MOCK_MEDIA.filter(m => m.type === type));
      }, 300);
    });
  }
  async getPaginated(page: number = 1, perPage: number = 12, type?: string, month?: number | null, year?: number | null, _lang?: string): Promise<PaginatedResponse<MediaItem>> {
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
  async getAlbumPhotos(id: string, _lang?: string): Promise<AlbumData> {
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
  async getAll(lang?: string): Promise<MediaItem[]> {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);
    const qs = params.toString();
    const res = await fetch(`${API_BASE_URL}/public/media${qs ? `?${qs}` : ''}`);
    if (!res.ok) return [];
    return res.json();
  }
  async getByType(type: string, lang?: string): Promise<MediaItem[]> {
    const params = new URLSearchParams({ type });
    if (lang) params.append('lang', lang);
    const res = await fetch(`${API_BASE_URL}/public/media?${params.toString()}`);
    if (!res.ok) return [];
    return res.json();
  }
  async getPaginated(page: number = 1, perPage: number = 12, type?: string, month?: number | null, year?: number | null, lang?: string): Promise<PaginatedResponse<MediaItem>> {
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (type && type !== 'all') params.append('type', type);
    if (month !== null && month !== undefined) params.append('month', String(month));
    if (year !== null && year !== undefined) params.append('year', String(year));
    if (lang) params.append('lang', lang);
    const res = await fetch(`${API_BASE_URL}/public/media?${params.toString()}`);
    if (!res.ok) return { data: [], current_page: 1, last_page: 1, per_page: perPage, total: 0 };
    return res.json();
  }
  async getAlbumPhotos(id: string, lang?: string): Promise<AlbumData> {
    const params = new URLSearchParams();
    if (lang) params.append('lang', lang);
    const qs = params.toString();
    const res = await fetch(`${API_BASE_URL}/public/media/${id}/photos${qs ? `?${qs}` : ''}`);
    if (!res.ok) throw new Error('Album not found');
    return res.json();
  }
}


export const createMediaRepository = () => new ApiMediaRepository();
