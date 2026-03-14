import { API_BASE_URL, USE_MOCK_DATA } from './_shared';

// --- Reports Repository ---
export interface StatisticsData {
  complaints: {
    total: number;
    this_week: number;
    today: number;
    overdue: number;
    by_status: Record<string, number>;
    by_priority: Record<string, number>;
    by_directorate: Array<{ name: string; count: number }>;
  };
  users: {
    total: number;
    active: number;
    active_today: number;
    new_this_week: number;
    by_role: Record<string, number>;
  };
  performance: {
    sla_compliance_rate: number;
    avg_first_response_hours: number;
    avg_resolution_hours: number;
  };
  content: {
    total: number;
    published: number;
    draft: number;
    by_type: Record<string, number>;
  };
  generated_at: string;
}

// Alias for backwards compatibility
export type AdminStatistics = StatisticsData;

export interface IReportsRepository {
  getStatistics(period?: string): Promise<StatisticsData>;
  exportData(type: string, params?: any): Promise<Blob>;
}

class MockReportsRepository implements IReportsRepository {
  async getStatistics(period?: string): Promise<StatisticsData> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          complaints: {
            total: 342,
            this_week: 45,
            today: 8,
            overdue: 12,
            by_status: {
              new: 45,
              in_progress: 78,
              resolved: 198,
              rejected: 21
            },
            by_priority: {
              low: 100,
              normal: 150,
              high: 80,
              urgent: 12
            },
            by_directorate: [
              { name: 'الإدارة العامة للصناعة', count: 120 },
              { name: 'الإدارة العامة للاقتصاد', count: 80 },
              { name: 'الإدارة العامة للتجارة الداخلية وحماية المستهلك', count: 142 },
            ]
          },
          users: {
            total: 1250,
            active: 890,
            active_today: 150,
            new_this_week: 34,
            by_role: {
              citizen: 1200,
              staff: 45,
              admin: 5
            }
          },
          performance: {
            sla_compliance_rate: 0.92,
            avg_first_response_hours: 4.5,
            avg_resolution_hours: 24.5
          },
          content: {
            total: 150,
            published: 120,
            draft: 30,
            by_type: {
              news: 100,
              article: 50
            }
          },
          generated_at: new Date().toISOString()
        });
      }, 500);
    });
  }

  async exportData(type: string, params?: any): Promise<Blob> {
    // Mock CSV export
    const csvContent = 'id,status,date\n1,resolved,2026-01-15\n2,in_progress,2026-01-16';
    return new Blob([csvContent], { type: 'text/csv' });
  }
}

class ApiReportsRepository implements IReportsRepository {
  async getStatistics(period?: string): Promise<StatisticsData> {
    const res = await fetch(`${API_BASE_URL}/reports/statistics?period=${period || 'week'}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.json();
  }

  async exportData(type: string, params?: any): Promise<Blob> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/reports/export?type=${type}&${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return res.blob();
  }
}


export const createReportsRepository = () =>
  USE_MOCK_DATA ? new MockReportsRepository() : new ApiReportsRepository();
