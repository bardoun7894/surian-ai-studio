// Use relative URLs to leverage Next.js rewrites for proxying to AI service
// The rewrite in next.config.mjs maps /ai/* to the AI service

export interface ChatRequest {
  prompt: string;
}

export interface ComplaintAnalysis {
  category: string;
  priority: string;
  summary: string;
}

export interface AIServiceClient {
  chat(prompt: string): Promise<string>;
  analyzeComplaint(text: string): Promise<ComplaintAnalysis>;
  summarize(text: string, language?: string, maxLength?: number): Promise<string>;
  suggestTitle(text: string): Promise<string>;
  proofread(text: string): Promise<string>;
  extractTextFromImage(file: File): Promise<string>;
  translate(text: string, sourceLang?: string, targetLang?: string): Promise<string>;
}

class AIService implements AIServiceClient {
  private readonly summarizeTimeoutMs = 25000;
  private readonly maxSummarizeInputChars = 12000;

  private normalizeSummaryInput(text: string): string {
    return (text || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildFallbackSummary(text: string, language: string): string {
    if (!text) {
      return language === 'en'
        ? 'Not enough content to generate a summary.'
        : 'لا يوجد محتوى كافٍ لإنشاء ملخص.';
    }

    const sentenceRegex = language === 'en'
      ? /[^.!?]+[.!?]?/g
      : /[^.!؟\n]+[.!؟]?/g;
    const sentences = text.match(sentenceRegex) || [text];
    const selected = sentences
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(' ');

    const fallback = selected || text;
    return fallback.slice(0, 420).trim();
  }

  private extractSummaryFromResponse(data: unknown): string {
    if (!data || typeof data !== 'object') return '';

    const payload = data as {
      summary?: unknown;
      result?: { summary?: unknown };
      key_points?: unknown;
    };

    if (typeof payload.summary === 'string' && payload.summary.trim()) return payload.summary.trim();
    if (typeof payload.result?.summary === 'string' && payload.result.summary.trim()) return payload.result.summary.trim();
    if (Array.isArray(payload.key_points) && payload.key_points.length > 0) {
      return payload.key_points.filter(Boolean).slice(0, 4).join(' ');
    }
    return '';
  }

  async chat(prompt: string): Promise<string> {
    const response = await fetch(`/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('AI chat request failed');
    }

    const data = await response.json();
    return data.response;
  }

  async analyzeComplaint(text: string): Promise<ComplaintAnalysis> {
    const response = await fetch(`/ai/analyze-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Complaint analysis failed');
    }

    return await response.json();
  }

  async summarize(text: string, language: string = 'ar', maxLength: number = 120): Promise<string> {
    const normalizedText = this.normalizeSummaryInput(text);
    if (!normalizedText) {
      return this.buildFallbackSummary('', language);
    }

    const boundedText = normalizedText.slice(0, this.maxSummarizeInputChars);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.summarizeTimeoutMs);

    try {
      const response = await fetch(`/ai/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: boundedText, language, max_length: maxLength }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.detail || `Summarization failed (${response.status})`);
      }

      return this.extractSummaryFromResponse(data) || this.buildFallbackSummary(boundedText, language);
    } catch {
      return this.buildFallbackSummary(boundedText, language);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async suggestTitle(text: string): Promise<string> {
    const response = await fetch(`/ai/suggest-title`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Title suggestion failed');
    }

    const data = await response.json();
    return data.title;
  }

  async proofread(text: string): Promise<string> {
    const response = await fetch(`/ai/proofread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Proofreading failed');
    }

    const data = await response.json();
    return data.corrected_text;
  }

  async translate(text: string, sourceLang: string = 'ar', targetLang: string = 'en'): Promise<string> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
    const response = await fetch(`${API_BASE_URL}/admin/content/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translated_text;
  }

  async extractTextFromImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/ai/ocr`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('OCR extraction failed');
    }

    const data = await response.json();
    return data.text;
  }
}

export const aiService = new AIService();
