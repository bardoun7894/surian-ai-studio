import { FAQ, API_BASE_URL, USE_MOCK_DATA } from './_shared';

export interface IFaqRepository {
  getAll(directorateId?: string): Promise<FAQ[]>;
}

class MockFaqRepository implements IFaqRepository {
  async getAll(directorateId?: string): Promise<FAQ[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: '1', question_ar: 'كيف يمكنني الحصول على ترخيص منشأة صناعية؟', answer_ar: 'يمكنك التقدم بطلب ترخيص منشأة صناعية عبر قسم الإدارة العامة للصناعة في البوابة.', question_en: 'How can I obtain an industrial facility license?', answer_en: 'You can apply for an industrial facility license through the General Administration for Industry section.' },
      { id: '2', question_ar: 'هل يمكنني تقديم شكوى حماية مستهلك إلكترونياً؟', answer_ar: 'نعم، يمكنك تقديم شكاوى الغش التجاري والمخالفات السعرية عبر قسم الإدارة العامة للتجارة الداخلية وحماية المستهلك.', question_en: 'Can I file a consumer protection complaint electronically?', answer_en: 'Yes, you can file commercial fraud and price violation complaints through the General Administration for Internal Trade and Consumer Protection.' },
    ]), 500));
  }
}

class ApiFaqRepository implements IFaqRepository {
  async getAll(directorateId?: string): Promise<FAQ[]> {
    try {
      const params = new URLSearchParams();
      if (directorateId) params.append('directorate_id', directorateId);
      const url = `${API_BASE_URL}/public/faqs${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }
}


export const createFaqRepository = () =>
  USE_MOCK_DATA ? new MockFaqRepository() : new ApiFaqRepository();
