import { Directorate, Service, Article, NewsItem, Decree, Ticket, ComplaintData, User, SuggestionData, Suggestion, MediaItem, PromotionalSection, FAQ, SearchResult, SearchResults, Favorite, AutocompleteSuggestion, Investment, InvestmentStats, InvestmentApplication, InvestmentApplicationData, PaginatedResponse } from '../../types';
import { DIRECTORATES, KEY_SERVICES, OFFICIAL_NEWS, BREAKING_NEWS, HERO_ARTICLE, GRID_ARTICLES, DECREES, MOCK_MEDIA } from '@/constants';
import { getCsrfCookie } from '@/lib/api';

// Re-export types used by consumers
export type { Directorate, Service, Article, NewsItem, Decree, Ticket, ComplaintData, User, SuggestionData, Suggestion, MediaItem, PromotionalSection, FAQ, SearchResult, SearchResults, Favorite, AutocompleteSuggestion, Investment, InvestmentStats, InvestmentApplication, InvestmentApplicationData, PaginatedResponse };
export { DIRECTORATES, KEY_SERVICES, OFFICIAL_NEWS, BREAKING_NEWS, HERO_ARTICLE, GRID_ARTICLES, DECREES, MOCK_MEDIA };
export { getCsrfCookie };

// Helper: read XSRF-TOKEN from cookies for XHR requests
export function getXsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// --- Configuration ---
export const USE_MOCK_DATA = false; // Set to FALSE to use real API calls
// Use relative URL to leverage Next.js rewrites for proper proxying
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
