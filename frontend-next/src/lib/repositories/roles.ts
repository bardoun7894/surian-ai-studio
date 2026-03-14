import { API_BASE_URL, USE_MOCK_DATA } from './_shared';

// --- Roles Repository ---
export interface Role {
  id: number;
  name: string;
  label: string;
  permissions: string[];
}

export interface IRolesRepository {
  getAll(): Promise<Role[]>;
}

class MockRolesRepository implements IRolesRepository {
  private mockRoles: Role[] = [
    { id: 1, name: 'admin', label: 'مدير النظام', permissions: ['all'] },
    { id: 2, name: 'staff', label: 'موظف', permissions: ['manage_complaints', 'view_reports'] },
    { id: 3, name: 'citizen', label: 'مواطن', permissions: ['submit_complaint', 'track_complaint'] }
  ];

  async getAll(): Promise<Role[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.mockRoles), 300));
  }
}

class ApiRolesRepository implements IRolesRepository {
  async getAll(): Promise<Role[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/roles`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        // Fallback to mock data if endpoint doesn't exist yet
        return [
          { id: 1, name: 'admin', label: 'مدير النظام', permissions: ['all'] },
          { id: 2, name: 'staff', label: 'موظف', permissions: ['manage_complaints', 'view_reports'] },
          { id: 3, name: 'citizen', label: 'مواطن', permissions: ['submit_complaint', 'track_complaint'] }
        ];
      }
      const json = await res.json();
      return json.data || json;
    } catch {
      return [
        { id: 1, name: 'admin', label: 'مدير النظام', permissions: ['all'] },
        { id: 2, name: 'staff', label: 'موظف', permissions: ['manage_complaints', 'view_reports'] },
        { id: 3, name: 'citizen', label: 'مواطن', permissions: ['submit_complaint', 'track_complaint'] }
      ];
    }
  }
}


export const createRolesRepository = () =>
  USE_MOCK_DATA ? new MockRolesRepository() : new ApiRolesRepository();
