import { User, API_BASE_URL, USE_MOCK_DATA, getXsrfToken, getCsrfCookie } from './_shared';

export interface IUserRepository {
  updateProfile(data: { name?: string; email?: string; password?: string }): Promise<User | null>;
  requestEmailChange(newEmail: string, password: string): Promise<{ success: boolean; message?: string }>;
  verifyEmailChange(code: string): Promise<{ success: boolean; message?: string }>;
  // Admin methods
  getAll(params?: { search?: string; role_id?: number; is_active?: boolean; per_page?: number; page?: number }): Promise<{ data: User[], total: number, current_page: number, per_page: number, last_page: number }>;
  getById(id: number): Promise<{ user: User; statistics: any } | null>;
  create(data: { name: string; email: string; role_id: number; directorate_id?: string }): Promise<{ user: User; temp_password: string }>;
  update(id: number, data: { name?: string; email?: string; phone?: string; role_id?: number; directorate_id?: string }): Promise<User | null>;
  toggleStatus(id: number): Promise<{ is_active: boolean } | null>;
}


class MockUserRepository implements IUserRepository {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'أحمد محمود',
      email: 'admin@moe.gov.sy',
      role_id: 1,
      role: { id: 1, name: 'admin', label: 'مدير النظام', permissions: [] },
      phone: '+963 11 1234567',
      is_active: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-05-20T10:30:00Z',
      last_login_at: '2024-05-20T10:30:00Z'
    },
    {
      id: 2,
      name: 'سارة علي',
      email: 'staff@moe.gov.sy',
      role_id: 2,
      role: { id: 2, name: 'staff', label: 'موظف', permissions: [] },
      phone: '+963 11 7654321',
      directorate_id: 'd1',
      is_active: true,
      created_at: '2024-02-10T09:15:00Z',
      updated_at: '2024-05-15T14:20:00Z',
      last_login_at: '2024-05-18T09:00:00Z'
    },
    {
      id: 3,
      name: 'محمد خالد',
      email: 'citizen@example.com',
      role_id: 3,
      role: { id: 3, name: 'citizen', label: 'مواطن', permissions: [] },
      phone: '+963 955 123456',
      national_id: '12345678901',
      is_active: false,
      created_at: '2024-03-20T11:00:00Z',
      updated_at: '2024-05-10T16:45:00Z'
    }
  ];

  async updateProfile(data: any): Promise<User | null> {
    return new Promise(resolve => setTimeout(() => resolve({ id: 1, name: data.name || 'User', email: data.email || 'user@example.com', role_id: 1, is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' }), 500));
  }

  async requestEmailChange(newEmail: string, password: string): Promise<{ success: boolean; message?: string }> {
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Verification code sent' }), 800));
  }

  async verifyEmailChange(code: string): Promise<{ success: boolean; message?: string }> {
    return new Promise(resolve => setTimeout(() => {
      if (code === '123456') {
        resolve({ success: true, message: 'Email updated' });
      } else {
        resolve({ success: false, message: 'Invalid code' });
      }
    }, 800));
  }

  async getAll(params?: any): Promise<{ data: User[], total: number, current_page: number, per_page: number, last_page: number }> {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = [...this.mockUsers];

        if (params?.search) {
          const search = params.search.toLowerCase();
          filtered = filtered.filter(u =>
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
          );
        }

        if (params?.role_id) {
          filtered = filtered.filter(u => u.role_id === Number(params.role_id));
        }

        if (params?.is_active !== undefined) {
          filtered = filtered.filter(u => u.is_active === Boolean(params.is_active));
        }

        resolve({
          data: filtered,
          total: filtered.length,
          current_page: 1,
          per_page: params?.per_page || 15,
          last_page: 1
        });
      }, 400);
    });
  }

  async getById(id: number): Promise<{ user: User; statistics: any } | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (!user) {
          resolve(null);
        } else {
          resolve({
            user,
            statistics: {
              complaints_count: 5,
              suggestions_count: 2,
              last_login: user.last_login_at || null,
              account_age_days: 120
            }
          });
        }
      }, 300);
    });
  }

  async create(data: any): Promise<{ user: User; temp_password: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser: User = {
          id: this.mockUsers.length + 1,
          name: data.name,
          email: data.email,
          role_id: data.role_id,
          directorate_id: data.directorate_id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        this.mockUsers.push(newUser);
        resolve({
          user: newUser,
          temp_password: 'TempPass123!'
        });
      }, 500);
    });
  }

  async update(id: number, data: any): Promise<User | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (!user) {
          resolve(null);
        } else {
          Object.assign(user, data, { updated_at: new Date().toISOString() });
          resolve(user);
        }
      }, 400);
    });
  }

  async toggleStatus(id: number): Promise<{ is_active: boolean } | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.id === id);
        if (!user) {
          resolve(null);
        } else {
          user.is_active = !user.is_active;
          resolve({ is_active: user.is_active });
        }
      }, 300);
    });
  }
}


class ApiUserRepository implements IUserRepository {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Accept': 'application/json'
    };
  }

  async updateProfile(data: any): Promise<User | null> {
    await getCsrfCookie();
    const xsrfToken = getXsrfToken();
    const headers: Record<string, string> = { ...this.getAuthHeaders() };
    if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      const msg = json.message || (json.errors && Object.values(json.errors).flat()[0]) || 'Failed to update profile';
      throw new Error(String(msg));
    }
    const json = await res.json();
    return json.user || json;
  }

  async requestEmailChange(newEmail: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      await getCsrfCookie();
      const xsrfToken = getXsrfToken();
      const headers: Record<string, string> = { ...this.getAuthHeaders() };
      if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
      const res = await fetch(`${API_BASE_URL}/users/me/email/request-change`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ email: newEmail, password })
      });
      const json = await res.json();
      return { success: res.ok, message: json.message };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  async verifyEmailChange(code: string): Promise<{ success: boolean; message?: string }> {
    try {
      await getCsrfCookie();
      const xsrfToken = getXsrfToken();
      const headers: Record<string, string> = { ...this.getAuthHeaders() };
      if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
      const res = await fetch(`${API_BASE_URL}/users/me/email/verify-change`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ code })
      });
      const json = await res.json();
      return { success: res.ok, message: json.message };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }

  async getAll(params?: any): Promise<{ data: User[], total: number, current_page: number, per_page: number, last_page: number }> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.role_id) searchParams.append('role_id', params.role_id.toString());
      if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.page) searchParams.append('page', params.page.toString());

      const res = await fetch(`${API_BASE_URL}/admin/users?${searchParams.toString()}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return { data: [], total: 0, current_page: 1, per_page: 15, last_page: 1 };
      return res.json();
    } catch {
      return { data: [], total: 0, current_page: 1, per_page: 15, last_page: 1 };
    }
  }

  async getById(id: number): Promise<{ user: User; statistics: any } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }

  async create(data: any): Promise<{ user: User; temp_password: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  }

  async update(id: number, data: any): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.user || json;
    } catch {
      return null;
    }
  }

  async toggleStatus(id: number): Promise<{ is_active: boolean } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}/disable`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }
}


export const createUserRepository = () =>
  USE_MOCK_DATA ? new MockUserRepository() : new ApiUserRepository();
