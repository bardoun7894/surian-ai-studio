import { SearchResults, API_BASE_URL, USE_MOCK_DATA } from './_shared';

export interface ISearchRepository {
  search(query: string, type?: string, dateFrom?: string, dateTo?: string, entity?: string, lang?: string): Promise<SearchResults>;
}

class MockSearchRepository implements ISearchRepository {
  async search(query: string, type?: string, dateFrom?: string, dateTo?: string, entity?: string, lang?: string): Promise<SearchResults> {
    return new Promise(resolve => setTimeout(() => resolve({ news: [], decrees: [], announcements: [], services: [], faqs: [], pages: [], total: 0 }), 500));
  }
}

class ApiSearchRepository implements ISearchRepository {
  async search(query: string, type?: string, dateFrom?: string, dateTo?: string, entity?: string, lang?: string): Promise<SearchResults> {
    const empty: SearchResults = { news: [], decrees: [], announcements: [], services: [], faqs: [], pages: [], total: 0 };
    try {
      const params = new URLSearchParams({ q: query });
      if (type) params.append('type', type);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      if (entity) params.append('entity', entity);
      if (lang) params.append('lang', lang);
      const res = await fetch(`${API_BASE_URL}/public/search?${params.toString()}`);
      if (!res.ok) return empty;
      const json = await res.json();

      // Backend returns { results: [...], total, search_type }
      // Transform flat results array into categorized structure
      const results: SearchResult[] = json.results || [];
      const grouped: SearchResults = {
        news: [],
        decrees: [],
        announcements: [],
        services: [],
        faqs: [],
        pages: [],
        total: json.total || results.length,
      };
      for (const item of results) {
        const mapped: SearchResult = {
          ...item,
          description: item.description || item.excerpt || '',
        };
        switch (item.type) {
          case 'news':
            grouped.news.push(mapped);
            break;
          case 'decree':
          case 'law':
            grouped.decrees.push(mapped);
            break;
          case 'announcement':
            grouped.announcements.push(mapped);
            break;
          case 'service':
            grouped.services.push(mapped);
            break;
          case 'faq':
            grouped.faqs.push(mapped);
            break;
          default:
            grouped.pages.push(mapped);
            break;
        }
      }
      return grouped;
    } catch {
      return empty;
    }
  }
}

// Complaint Templates API

export const createSearchRepository = () =>
  USE_MOCK_DATA ? new MockSearchRepository() : new ApiSearchRepository();
