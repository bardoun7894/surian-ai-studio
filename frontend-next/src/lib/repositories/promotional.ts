import { PromotionalSection, API_BASE_URL, USE_MOCK_DATA, getXsrfToken } from './_shared';

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


export const createPromotionalRepository = () =>
  USE_MOCK_DATA ? new MockPromotionalSectionsRepository() : new ApiPromotionalSectionsRepository();
