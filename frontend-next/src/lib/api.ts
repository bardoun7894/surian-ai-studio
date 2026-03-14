/**
 * API Client for Laravel Backend
 * Handles CSRF token management and authenticated requests
 * Uses relative URLs that get proxied through Next.js rewrites
 */

// Use relative URLs - Next.js rewrites handle proxying to backend
const API_URL = '/api/v1';

// Token storage key
const TOKEN_KEY = 'auth_token';

// Module-level cache for language to avoid localStorage reads on every API call
let _cachedLang: string = typeof window !== 'undefined'
  ? localStorage.getItem('gov_lang') || 'ar'
  : 'ar';

// Module-level cache for XSRF token with TTL to avoid cookie parsing on every non-GET request
let _cachedXsrfToken: string | null = null;
let _xsrfTokenTimestamp = 0;
const XSRF_CACHE_TTL = 5000; // 5 seconds

/** Called by LanguageContext when language changes to keep cache in sync */
export function setCachedLanguage(lang: string): void {
  _cachedLang = lang;
}

/** Invalidate XSRF token cache (called after getCsrfCookie) */
function invalidateXsrfCache(): void {
  _cachedXsrfToken = null;
  _xsrfTokenTimestamp = 0;
}

// Get CSRF cookie from Laravel Sanctum
export async function getCsrfCookie(): Promise<void> {
  await fetch(`/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  });
  invalidateXsrfCache();
}

// Get XSRF token from cookies (with cache)
function getXsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const now = Date.now();
  if (_cachedXsrfToken && now - _xsrfTokenTimestamp < XSRF_CACHE_TTL) {
    return _cachedXsrfToken;
  }
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  _cachedXsrfToken = match ? decodeURIComponent(match[1]) : null;
  _xsrfTokenTimestamp = now;
  return _cachedXsrfToken;
}

// Token management functions
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  // Also set as cookie so Next.js middleware can read it
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  // Clear auth cookie and session cookies
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    if (name.includes('session') || name.includes('XSRF') || name.includes('laravel')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

// Base fetch wrapper with CSRF and credentials
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // Use cached language (avoids localStorage read per API call)
  const lang = _cachedLang;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': lang,
    ...(options.headers || {}),
  };

  // Add Bearer token if available
  const authToken = getAuthToken();
  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  // Add XSRF token for non-GET requests
  if (options.method && options.method !== 'GET') {
    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      (headers as Record<string, string>)['X-XSRF-TOKEN'] = xsrfToken;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for Sanctum
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    // Pick the locale-appropriate message
    // Backend returns: { message: "Arabic msg", message_en: "English msg", errors: { field: ["msg"] } }
    const baseMessage = lang === 'ar'
      ? (error.message || error.message_en || 'فشل الطلب')
      : (error.message_en || error.message || 'Request failed');
    // Extract field-specific validation errors from Laravel's format
    let errorMessage = baseMessage;
    if (error.errors && typeof error.errors === 'object') {
      const fieldMessages = Object.values(error.errors as Record<string, string[]>)
        .flat()
        .join('\n');
      if (fieldMessages) {
        errorMessage = fieldMessages;
      }
    }
    throw new ApiError(response.status, errorMessage, error);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Methods
export const api = {
  // GET request
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  // POST request
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT request
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PATCH request
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE request
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
