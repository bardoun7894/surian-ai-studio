import { Ticket, API_BASE_URL, USE_MOCK_DATA } from './_shared';

export interface IStaffRepository {
  listComplaints(params?: any): Promise<{ data: Ticket[], total: number }>;
  updateStatus(id: string, status: string): Promise<boolean>;
  updateCategorization(id: string, category: string, priority: string): Promise<boolean>;
  getComplaintLogs(id: string): Promise<any[]>;
  addResponse(id: string, response: string): Promise<boolean>;
  addResponse(id: string, response: string): Promise<boolean>;
  getAnalytics(): Promise<any>;
}


class MockStaffRepository implements IStaffRepository {
  async listComplaints(params?: any): Promise<{ data: Ticket[], total: number }> {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        data: [
          { id: '1', status: 'new', lastUpdate: '2023-10-01', notes: 'تجربة' },
          { id: '2', status: 'resolved', lastUpdate: '2023-10-02', notes: 'تم الحل' }
        ],
        total: 2
      }), 500);
    });
  }
  async updateStatus(id: string, status: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async updateCategorization(id: string, category: string, priority: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async getComplaintLogs(id: string): Promise<any[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: 1, action: 'status_updated', user: { name: 'Admin' }, created_at: '2023-10-01 10:00', changes: { old_status: 'new', new_status: 'in_progress' } }
    ]), 300));
  }
  async addResponse(id: string, response: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async getAnalytics(): Promise<any> {
    return new Promise(resolve => setTimeout(() => resolve({
      total: 150,
      new: 45,
      resolved: 80,
      in_progress: 25
    }), 500));
  }
}


class ApiStaffRepository implements IStaffRepository {
  async listComplaints(params?: any): Promise<{ data: Ticket[], total: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/staff/complaints?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async updateStatus(id: string, status: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ status })
    });
    return res.ok;
  }
  async updateCategorization(id: string, category: string, priority: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/categorization`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ ai_category: category, priority })
    });
    return res.ok;
  }
  async getComplaintLogs(id: string): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/logs`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
  async addResponse(id: string, response: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/staff/complaints/${id}/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ response })
    });
    return res.ok;
  }
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/staff/analytics`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }
}


export const createStaffRepository = () =>
  USE_MOCK_DATA ? new MockStaffRepository() : new ApiStaffRepository();
