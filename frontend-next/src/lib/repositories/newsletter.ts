import { API_BASE_URL, USE_MOCK_DATA } from './_shared';

// --- Newsletter Repository ---
export interface INewsletterRepository {
  subscribe(email: string, recaptchaToken?: string | null): Promise<{ success: boolean; message?: string }>;
}

class MockNewsletterRepository implements INewsletterRepository {
  async subscribe(email: string): Promise<{ success: boolean; message?: string }> {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: 'Subscribed successfully (Mock)' }), 1000);
    });
  }
}

class ApiNewsletterRepository implements INewsletterRepository {
  async subscribe(email: string, recaptchaToken?: string | null): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/public/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptcha_token: recaptchaToken }),
      });
      const data = await res.json();
      return { success: res.ok && data.success, message: data.message };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }
}


export const createNewsletterRepository = () =>
  USE_MOCK_DATA ? new MockNewsletterRepository() : new ApiNewsletterRepository();
