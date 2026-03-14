import { Ticket, ComplaintData, API_BASE_URL, USE_MOCK_DATA, getXsrfToken, getCsrfCookie } from './_shared';

export interface IComplaintRepository {
  submit(data: ComplaintData): Promise<string>;
  submitWithProgress(data: ComplaintData, onProgress?: (progress: number) => void): Promise<string>;
  track(ticketId: string, nationalId?: string): Promise<Ticket | null>;
  myComplaints(): Promise<Ticket[]>;
  delete(id: string): Promise<boolean>;
  rate(trackingNumber: string, rating: number, comment?: string): Promise<boolean>;
}


class MockComplaintRepository implements IComplaintRepository {
  async submit(data: ComplaintData): Promise<string> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: ComplaintData, onProgress?: (progress: number) => void): Promise<string> {
    return new Promise(resolve => {
      if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(progress);
          if (progress >= 100) clearInterval(interval);
        }, 100);
      }
      setTimeout(() => resolve('GOV-' + Math.floor(Math.random() * 100000)), 1500);
    });
  }
  async track(ticketId: string, nationalId?: string): Promise<Ticket | null> {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        id: ticketId,
        status: 'in_progress',
        lastUpdate: new Date().toLocaleDateString('ar-SY'),
        notes: 'الطلب قيد المراجعة من قبل القسم الفني (بيانات محاكاة).'
      }), 1000);
    });
  }
  async myComplaints(): Promise<Ticket[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve([
        { id: '1', title: 'شكوى تجريبية', status: 'new', lastUpdate: '2025-01-01', notes: 'تجربة' },
        { id: '2', title: 'شكوى أخرى', status: 'resolved', lastUpdate: '2025-01-05', notes: 'تم الحل' }
      ] as Ticket[]), 800);
    });
  }
  async delete(id: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
  async rate(trackingNumber: string, rating: number, comment?: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
}


class ApiComplaintRepository implements IComplaintRepository {
  async submit(data: ComplaintData): Promise<string> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: ComplaintData, onProgress?: (progress: number) => void): Promise<string> {
    const formData = new FormData();

    // Map frontend field names to backend expected field names
    const fullName = [data.firstName, data.fatherName, data.lastName].filter(Boolean).join(' ');
    if (fullName) formData.append('full_name', fullName);
    if ((data as any).is_anonymous) formData.append('is_anonymous', '1');
    if (data.directorate) formData.append('directorate_id', data.directorate);
    // Description: use details field, or build from template_fields, or use category as fallback
    if (data.details) {
      formData.append('description', data.details);
    } else {
      let desc = '';
      if ((data as any).template_fields && typeof (data as any).template_fields === 'object') {
        const tf = (data as any).template_fields as Record<string, string>;
        desc = Object.values(tf).filter(Boolean).join(' - ');
      }
      // Always ensure description is sent (backend requires min:10)
      if (!desc || desc.length < 10) {
        desc = desc ? `${data.category || 'شكوى'}: ${desc}` : (data.category || 'شكوى عبر النموذج الإلكتروني');
      }
      if (desc.length < 10) desc = desc.padEnd(10, '.');
      formData.append('description', desc);
    }
    if (data.category) formData.append('category', data.category);
    if (data.nationalId) formData.append('national_id', data.nationalId);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.dob) formData.append('dob', data.dob);
    if (data.recaptcha_token) formData.append('recaptcha_token', data.recaptcha_token);
    if ((data as any).hasPreviousComplaint) {
      formData.append('has_previous_complaint', '1');
    }
    if (data.previousTrackingNumber) formData.append('previous_tracking_number', data.previousTrackingNumber);

    // Template fields
    if ((data as any).template_id) formData.append('template_id', (data as any).template_id);
    if ((data as any).template_fields && typeof (data as any).template_fields === 'object') {
      formData.append('template_fields', JSON.stringify((data as any).template_fields));
    }

    // Guest token
    if ((data as any).guest_token) formData.append('guest_token', (data as any).guest_token);

    // File attachments (single or multiple)
    if (data.files && Array.isArray(data.files)) {
      data.files.forEach((file: File) => {
        formData.append('attachments[]', file);
      });
    } else if (data.file) {
      formData.append('attachments[]', data.file);
    }

    // Fetch CSRF cookie before submitting
    await getCsrfCookie();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result.tracking_number);
          } catch {
            reject(new Error('Invalid response'));
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            console.error('Complaint submission error:', xhr.status, err);
            // Include validation field errors if present
            let errorMessage = err.message || `HTTP ${xhr.status}`;
            if (err.errors && typeof err.errors === 'object') {
              const fieldMessages = Object.values(err.errors as Record<string, string[]>).flat().join('\n');
              if (fieldMessages) errorMessage = fieldMessages;
            }
            reject(new Error(errorMessage));
          } catch {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.open('POST', `${API_BASE_URL}/complaints`);
      xhr.withCredentials = true;

      // Send XSRF token
      const xsrfToken = getXsrfToken();
      if (xsrfToken) {
        xhr.setRequestHeader('X-XSRF-TOKEN', xsrfToken);
      }

      // Send auth token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      // Send guest token as header if present
      if ((data as any).guest_token) {
        xhr.setRequestHeader('X-Guest-Token', (data as any).guest_token);
      }
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.send(formData);
    });
  }
  async track(ticketId: string, nationalId?: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE_URL}/complaints/track/${ticketId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(nationalId ? { national_id: nationalId } : {}),
    });

    if (res.status === 404) return null;

    if (!res.ok) {
      let backendMessage = '';
      try {
        const payload = await res.json();
        if (typeof payload?.error === 'string') {
          backendMessage = payload.error;
        } else if (typeof payload?.message === 'string') {
          backendMessage = payload.message;
        } else if (payload?.errors && typeof payload.errors === 'object') {
          const errorLines = Object.values(payload.errors as Record<string, string[]>).flat();
          backendMessage = errorLines.join('\n');
        }
      } catch {
        // Ignore parse errors and fallback to generic HTTP status.
      }

      throw new Error(backendMessage || `HTTP ${res.status}`);
    }

    return res.json();
  }
  async myComplaints(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE_URL}/users/me/complaints`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Backend may return array directly or wrapped in { data: [...] }
    return Array.isArray(data) ? data : (data.data || []);
  }
  async delete(id: string, nationalId?: string): Promise<boolean> {
    // Fetch CSRF cookie before DELETE (required by Laravel Sanctum)
    await getCsrfCookie();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    // Include XSRF token from cookie
    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    // Include auth token if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      body: JSON.stringify(nationalId ? { national_id: nationalId } : {}),
    });
    return res.ok;
  }
  async rate(trackingNumber: string, rating: number, comment?: string): Promise<boolean> {
    // Fetch CSRF cookie before submitting (required by Laravel Sanctum)
    await getCsrfCookie();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Include XSRF token from cookie
    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    // Include auth token if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/complaints/${trackingNumber}/rate`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ rating, comment }),
    });
    return res.ok;
  }
}


export async function getComplaintTemplates(anonymous?: boolean): Promise<any[]> {
  const params = anonymous ? '?anonymous=true' : '';
  try {
    const res = await fetch(`${API_BASE_URL}/public/complaint-templates${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Open Data API
const openDataApi = {
  async getAll(): Promise<Array<{ id: string; title_ar: string; title_en: string; description_ar: string; description_en: string; date: string; format: string; size: string; category_label: string; download_url: string | null }>> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/open-data`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },
};

// Settings & Contact API
const settingsApi = {
  async getByGroup(group: string): Promise<Record<string, unknown>> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/settings/group/${group}`);
      if (!res.ok) return {};
      const json = await res.json();
      return json.settings || {};
    } catch {
      return {};
    }
  },
  async getPublic(): Promise<Record<string, unknown>> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/settings`);
      if (!res.ok) return {};
      const json = await res.json();
      return json.settings || {};
    } catch {
      return {};
    }
  },
  async submitContactForm(data: { name: string; email: string; subject: string; message: string; department?: string }): Promise<{ success: boolean; message: string; message_en: string }> {
    const res = await fetch(`${API_BASE_URL}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit contact form');
    }
    return res.json();
  },
};


export const createComplaintRepository = () =>
  USE_MOCK_DATA ? new MockComplaintRepository() : new ApiComplaintRepository();
