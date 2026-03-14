import { SuggestionData, Suggestion, API_BASE_URL, USE_MOCK_DATA, getXsrfToken, getCsrfCookie } from './_shared';

export interface ISuggestionRepository {
  submit(data: SuggestionData): Promise<Suggestion>;
  submitWithProgress(data: SuggestionData, onProgress?: (progress: number) => void): Promise<Suggestion>;
  track(trackingNumber: string, nationalId?: string): Promise<any>;
  mySuggestions(): Promise<Suggestion[]>;
  submitRating(data: { tracking_number: string; rating: number; comment?: string; feedback_type?: 'positive' | 'negative' }): Promise<any>;
  getRatingsStats(trackingNumber?: string): Promise<any>;
}


class MockSuggestionRepository implements ISuggestionRepository {
  async submit(data: SuggestionData): Promise<Suggestion> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: SuggestionData, onProgress?: (progress: number) => void): Promise<Suggestion> {
    return new Promise(resolve => {
      // Simulate upload progress
      if (onProgress && data.files && data.files.length > 0) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress(Math.min(progress, 90));
          if (progress >= 90) clearInterval(interval);
        }, 100);
      }

      setTimeout(() => {
        onProgress?.(100);
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          trackingNumber: 'SUG-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
          status: 'received',
          createdAt: new Date().toISOString()
        });
      }, 1500);
    });
  }

  async track(trackingNumber: string, _nationalId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (trackingNumber.startsWith('SUG-')) {
          resolve({
            success: true,
            data: {
              tracking_number: trackingNumber,
              status: 'pending',
              submitted_at: new Date().toISOString(),
              last_updated: new Date().toISOString(),
              response: null,
              reviewed_at: null
            }
          });
        } else {
          reject(new Error('Not found'));
        }
      }, 800);
    });
  }

  async mySuggestions(): Promise<Suggestion[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            tracking_number: 'SUG-12345678',
            description: 'اقتراح تحسين الخدمات',
            status: 'pending',
            status_label: { ar: 'قيد المراجعة', en: 'Pending Review' },
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            response: null,
            reviewed_at: null,
            attachments_count: 2
          },
          {
            id: 2,
            tracking_number: 'SUG-87654321',
            description: 'اقتراح تطوير موقع الوزارة',
            status: 'approved',
            status_label: { ar: 'تمت الموافقة', en: 'Approved' },
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            response: 'شكراً لاقتراحكم القيم. سيتم العمل على تنفيذه قريباً.',
            reviewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            attachments_count: 0
          }
        ]);
      }, 600);
    });
  }

  async submitRating(data: { tracking_number: string; rating: number; comment?: string; feedback_type?: 'positive' | 'negative' }): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'تم إرسال التقييم بنجاح',
        });
      }, 500);
    });
  }

  async getRatingsStats(trackingNumber?: string): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            total_ratings: 45,
            average_rating: 4.2,
            rating_distribution: { '5': 25, '4': 12, '3': 5, '2': 2, '1': 1 },
            helpful_count: { positive: 40, negative: 5 },
          },
        });
      }, 300);
    });
  }
}


class ApiSuggestionRepository implements ISuggestionRepository {
  async submit(data: SuggestionData): Promise<Suggestion> {
    return this.submitWithProgress(data);
  }

  async submitWithProgress(data: SuggestionData, onProgress?: (progress: number) => void): Promise<Suggestion> {
    const formData = new FormData();

    // Map frontend field names to backend expected field names
    const isAnonymous = data.is_anonymous === true;
    if (isAnonymous) {
      formData.append('name', 'مجهول الهوية'); // Anonymous placeholder
      formData.append('is_anonymous', '1');
    } else {
      const fullName = [data.firstName, data.fatherName, data.lastName].filter(Boolean).join(' ');
      if (fullName) formData.append('name', fullName);
    }
    if (data.nationalId) formData.append('national_id', data.nationalId);
    if (data.dob) formData.append('dob', data.dob);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.description) formData.append('description', data.description);
    if (data.directorate_id) formData.append('directorate_id', data.directorate_id);
    if (data.recaptcha_token) formData.append('recaptcha_token', data.recaptcha_token);
    if (data.guest_token) formData.append('guest_token', data.guest_token);

    // Files
    if (data.files && Array.isArray(data.files)) {
      data.files.forEach(file => formData.append('files[]', file));
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
            // Backend returns { success: true, data: { tracking_number, status } }
            const responseData = result.data || result;
            resolve({
              id: responseData.id || '',
              tracking_number: responseData.tracking_number || '',
              description: data.description,
              status: responseData.status || 'pending',
              created_at: responseData.created_at || new Date().toISOString(),
            } as any);
          } catch {
            reject(new Error('Invalid response'));
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            const msg = err.message || (err.errors ? Object.values(err.errors).flat().join(', ') : `HTTP ${xhr.status}`);
            reject(new Error(msg));
          } catch {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

      xhr.open('POST', `${API_BASE_URL}/suggestions`);
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
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.send(formData);
    });
  }

  async track(trackingNumber: string, nationalId?: string): Promise<any> {
    const params = nationalId ? `?national_id=${encodeURIComponent(nationalId)}` : '';
    const res = await fetch(`${API_BASE_URL}/suggestions/track/${trackingNumber}${params}`);
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('الرقم الوطني غير مطابق');
      }
      throw new Error('Suggestion not found');
    }
    return res.json();
  }

  async submitRating(data: { tracking_number: string; rating: number; comment?: string; feedback_type?: 'positive' | 'negative' }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/public/suggestions/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Failed to submit rating');
    }
    return res.json();
  }

  async getRatingsStats(trackingNumber?: string): Promise<any> {
    const url = trackingNumber
      ? `${API_BASE_URL}/public/suggestions/ratings/stats?tracking_number=${trackingNumber}`
      : `${API_BASE_URL}/public/suggestions/ratings/stats`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch ratings stats');
    }
    return res.json();
  }

  async mySuggestions(): Promise<Suggestion[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const res = await fetch(`${API_BASE_URL}/users/me/suggestions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    const data = await res.json();
    return data.success ? data.data : [];
  }
}


export const createSuggestionRepository = () =>
  USE_MOCK_DATA ? new MockSuggestionRepository() : new ApiSuggestionRepository();
