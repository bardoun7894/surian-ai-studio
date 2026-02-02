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
  summarize(text: string): Promise<string>;
  suggestTitle(text: string): Promise<string>;
  proofread(text: string): Promise<string>;
  extractTextFromImage(file: File): Promise<string>;
  translate(text: string, sourceLang?: string, targetLang?: string): Promise<string>;
}

class AIService implements AIServiceClient {
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

  async summarize(text: string): Promise<string> {
    const response = await fetch(`/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Summarization failed');
    }

    const data = await response.json();
    return data.summary;
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
