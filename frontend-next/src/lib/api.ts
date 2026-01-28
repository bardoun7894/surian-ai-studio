/**
 * API Client for Laravel Backend
 * Handles CSRF token management and authenticated requests
 * Uses relative URLs that get proxied through Next.js rewrites
 */

// Use relative URLs - Next.js rewrites handle proxying to backend
const API_URL = '/api/v1';

// Token storage key
const TOKEN_KEY = 'auth_token';

// Get CSRF cookie from Laravel Sanctum
export async function getCsrfCookie(): Promise<void> {
  await fetch(`/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  });
}

// Get XSRF token from cookies
function getXsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Token management functions
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  // Also clear any session cookies
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

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
    throw new ApiError(response.status, error.message || 'Request failed', error);
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
