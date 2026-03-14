import { Investment, InvestmentStats, InvestmentApplication, InvestmentApplicationData, API_BASE_URL, USE_MOCK_DATA, getXsrfToken, getCsrfCookie } from './_shared';

// --- Investment Repository ---
export interface IInvestmentRepository {
  getAll(params?: { category?: string; status?: string; featured?: boolean }): Promise<Investment[]>;
  getByCategory(category: string): Promise<Investment[]>;
  getById(id: number): Promise<Investment | null>;
  getStats(): Promise<InvestmentStats>;
}

class MockInvestmentRepository implements IInvestmentRepository {
  private mockData: Investment[] = [];

  async getAll(params?: { category?: string; status?: string; featured?: boolean }): Promise<Investment[]> {
    return new Promise(resolve => setTimeout(() => resolve(this.mockData), 400));
  }
  async getByCategory(category: string): Promise<Investment[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.filter(i => i.category === category)), 300);
    });
  }
  async getById(id: number): Promise<Investment | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.find(i => i.id === id) || null), 300);
    });
  }
  async getStats(): Promise<InvestmentStats> {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        total_opportunities: 0,
        available_count: 0,
        total_investment_value: 0,
        sectors_count: 0,
        labels: {}
      }), 300);
    });
  }
}
class ApiInvestmentRepository implements IInvestmentRepository {
  async getAll(params?: { category?: string; status?: string; featured?: boolean }): Promise<Investment[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.featured) searchParams.append('featured', 'true');

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/public/investments${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }
  async getByCategory(category: string): Promise<Investment[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/investments/category/${category}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    } catch {
      return [];
    }
  }
  async getById(id: number): Promise<Investment | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/investments/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || json;
    } catch {
      return null;
    }
  }
  async getStats(): Promise<InvestmentStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/investments/stats`);
      if (!res.ok) {
        return { total_opportunities: 0, available_count: 0, total_investment_value: 0, sectors_count: 0, labels: {} } as InvestmentStats;
      }
      const json = await res.json();
      return json.data || json;
    } catch {
      return {
        total_opportunities: 0,
        available_count: 0,
        total_investment_value: 0,
        sectors_count: 0,
        labels: {}
      };
    }
  }
}
// --- Investment Application Repository ---
export interface IInvestmentApplicationRepository {
  submit(data: InvestmentApplicationData): Promise<string>;
  track(trackingNumber: string): Promise<InvestmentApplication | null>;
}

export interface IStaffInvestmentApplicationRepository {
  listAll(
    params?: any,
  ): Promise<{
    data: InvestmentApplication[];
    total: number;
    last_page: number;
  }>;
  getById(id: number): Promise<InvestmentApplication | null>;
  updateStatus(
    id: number,
    status: string,
    staffNotes?: string,
  ): Promise<boolean>;
}

class ApiInvestmentApplicationRepository implements IInvestmentApplicationRepository {
  async submit(data: InvestmentApplicationData): Promise<string> {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("national_id", data.national_id);
    formData.append("company_name", data.company_name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("proposed_amount", String(data.proposed_amount));
    if (data.description) formData.append("description", data.description);
    if (data.investment_id)
      formData.append("investment_id", String(data.investment_id));
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append("attachments[]", file);
      });
    }

    const res = await fetch(`${API_BASE_URL}/public/investment-applications`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "فشل في تقديم الطلب");
    }

    const result = await res.json();
    return result.tracking_number;
  }

  async track(trackingNumber: string): Promise<InvestmentApplication | null> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/public/investment-applications/track/${trackingNumber}`,
      );
      if (!res.ok) return null;
      const result = await res.json();
      return result.data;
    } catch {
      return null;
    }
  }
}

class ApiStaffInvestmentApplicationRepository implements IStaffInvestmentApplicationRepository {
  async listAll(
    params?: any,
  ): Promise<{
    data: InvestmentApplication[];
    total: number;
    last_page: number;
  }> {
    const query = new URLSearchParams(params || {}).toString();
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_BASE_URL}/staff/investment-applications?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.json();
  }

  async getById(id: number): Promise<InvestmentApplication | null> {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/staff/investment-applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) return null;
      const result = await res.json();
      return result.data;
    } catch {
      return null;
    }
  }

  async updateStatus(
    id: number,
    status: string,
    staffNotes?: string,
  ): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/staff/investment-applications/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, staff_notes: staffNotes }),
        },
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}


export const createInvestmentRepository = () =>
  USE_MOCK_DATA ? new MockInvestmentRepository() : new ApiInvestmentRepository();
export const createInvestmentApplicationRepository = () => new ApiInvestmentApplicationRepository();
export const createStaffInvestmentApplicationRepository = () => new ApiStaffInvestmentApplicationRepository();
