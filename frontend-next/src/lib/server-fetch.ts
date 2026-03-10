const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://backend-web';

export async function serverFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1${endpoint}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
