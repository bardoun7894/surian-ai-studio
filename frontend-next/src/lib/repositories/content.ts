import { API_BASE_URL, USE_MOCK_DATA, getXsrfToken } from './_shared';

export interface IContentRepository {
  getAll(params?: any): Promise<{ data: any[], total: number, last_page?: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<any>;
  getVersions(id: string): Promise<any[]>;
  restoreVersion(id: string, versionNumber: number): Promise<any>;
}



class MockContentRepository implements IContentRepository {
  async getAll(params?: any): Promise<{ data: any[], total: number }> {
    return new Promise(resolve => setTimeout(() => resolve({
      data: [],
      total: 0
    }), 500));
  }
  async create(data: any): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ ...data, id: Math.random().toString() }), 500));
  }
  async update(id: string, data: any): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ ...data, id }), 500));
  }
  async delete(id: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
  async getById(id: string): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ id, title_ar: 'Mock Content' }), 500));
  }
  async getVersions(id: string): Promise<any[]> {
    return new Promise(resolve => setTimeout(() => resolve([]), 500));
  }
  async restoreVersion(id: string, versionNumber: number): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({ id, versionNumber }), 500));
  }
}


class ApiContentRepository implements IContentRepository {
  async getAll(params?: any): Promise<{ data: any[], total: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/admin/content?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async create(data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  async update(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.ok;
  }
  async getById(id: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async getVersions(id: string): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}/versions`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async restoreVersion(id: string, versionNumber: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/content/${id}/versions/${versionNumber}/restore`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
}


export const createContentRepository = () =>
  USE_MOCK_DATA ? new MockContentRepository() : new ApiContentRepository();
