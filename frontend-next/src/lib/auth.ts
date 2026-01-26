/**
 * Authentication utilities for Laravel Sanctum
 */

import api, { getCsrfCookie, ApiError } from './api';

// User type
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  national_id?: string;
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
  created_at: string;
  updated_at: string;
}

// Auth response types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  national_id?: string;
  phone?: string;
  birth_date?: string;
  governorate?: string;
  two_factor_enabled?: boolean;
}

export interface AuthResponse {
  user: User;
  token?: string;
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
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    await getCsrfCookie();
    return api.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Get current authenticated user
   */
  async getUser(): Promise<User | null> {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
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
