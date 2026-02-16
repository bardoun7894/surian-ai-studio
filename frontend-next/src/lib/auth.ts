/**
 * Authentication utilities for Laravel Sanctum
 */

import api, { getCsrfCookie, ApiError, setAuthToken, clearAuthToken, getAuthToken } from './api';

// User type
export interface User {
  id: number;
  first_name: string;
  father_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  national_id?: string;
  birth_date?: string;
  governorate?: string;
  role_id: number;
  directorate_id: number | null;
  role?: {
    id: number;
    name: string;
    permissions: string[];
  };
  directorate?: {
    id: number;
    name: string;
  };
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// Auth response types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
  use_whatsapp?: boolean;
}

export interface RegisterData {
  first_name: string;
  father_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  national_id: string;
  phone: string;
  birth_date: string;
  governorate: string;
  recaptcha_token?: string;
  two_factor_enabled?: boolean;
  use_whatsapp?: boolean;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  require_2fa?: boolean;
  temp_token?: string; // Temporary token for 2FA verification
  email?: string; // Returned by register endpoint
  message?: string;
}

export interface TwoFactorVerifyData {
  email: string;
  otp: string;
}

// Auth service
export const auth = {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Get CSRF cookie first
    await getCsrfCookie();

    // Then login
    const response = await api.post<AuthResponse & { access_token?: string }>('/auth/login', credentials);

    // Store the token if returned (and not requiring 2FA)
    // Backend may return token as 'token' or 'access_token'
    const token = response.access_token || response.token;
    if (!response.require_2fa && token) {
      setAuthToken(token);
    }

    return response;
  },

  /**
   * Verify 2FA code
   */
  async verify2fa(data: TwoFactorVerifyData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse & { access_token?: string }>('/auth/verify-2fa', data);
    // Store the token if returned
    const token = response.access_token || response.token;
    if (token) {
      setAuthToken(token);
    }
    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    await getCsrfCookie();
    const response = await api.post<AuthResponse & { access_token?: string; email?: string }>('/auth/register', data);
    // Store the token if returned (and not requiring 2FA)
    const token = response.access_token || response.token;
    if (!response.require_2fa && token) {
      setAuthToken(token);
    }
    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if the API call fails, clear local state
      console.error('Logout API error:', error);
    } finally {
      // Always clear the token locally
      clearAuthToken();
    }
  },

  /**
   * Get current authenticated user
   */
  async getUser(): Promise<User | null> {
    // Check if we have a token first
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    try {
      // Backend returns user directly, not { user: User }
      const user = await api.get<User>('/auth/me');
      return user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Clear invalid token
        clearAuthToken();
        return null;
      }
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<{ user: User }>('/users/me', data);
    return response.user;
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await getCsrfCookie();
    await api.post('/auth/password/forgot', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await getCsrfCookie();
    await api.post('/auth/password/reset', data);
  },

  /**
   * Check if user has specific role
   */
  hasRole(user: User | null, roleName: string): boolean {
    return user?.role?.name === roleName;
  },

  /**
   * Check if user has specific permission
   */
  hasPermission(user: User | null, permission: string): boolean {
    return user?.role?.permissions?.includes(permission) ?? false;
  },

  /**
   * Check if user is admin
   */
  isAdmin(user: User | null): boolean {
    return this.hasRole(user, 'admin');
  },

  /**
   * Check if user is staff
   */
  isStaff(user: User | null): boolean {
    return this.hasRole(user, 'staff') || this.hasRole(user, 'complaint_officer');
  },
};

export default auth;
