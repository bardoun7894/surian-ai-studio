import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export interface AIAnalysisResult {
  category: string;
  priority: 'منخفضة' | 'متوسطة' | 'عالية' | 'طارئة';
  suggestedDirectorate: string;
  summary: string;
}

export const analyzeComplaint = async (text: string): Promise<AIAnalysisResult | null> => {
  const ai = getAIClient();
  
  // Fallback simulation
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          category: "غير محدد (محاكاة)",
          priority: "متوسطة",
          suggestedDirectorate: "مكتب الشكاوى المركزي",
          summary: "تم تحليل الشكوى مبدئياً."
        });
      }, 1500);
    });
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      أنت نظام ذكي لفرز الشكاوى الحكومية. قم بتحليل نص الشكوى التالي واستخرج المعلومات بتنسيق JSON فقط.
      
      الشكوى: "${text}"
      
      المطلوب:
      1. التصنيف (مثال: بنية تحتية، تأخر إداري، فساد، صحة، تعليم)
      2. الأولوية (منخفضة، متوسطة، عالية، طارئة)
      3. الجهة المقترحة للمعالجة (مثال: وزارة الصحة، البلدية، الشرطة)
      4. ملخص موجز جداً للمشكلة (أقل من 15 كلمة)

      Response Format (JSON):
      {
        "category": "string",
        "priority": "string",
        "suggestedDirectorate": "string",
        "summary": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    
    return JSON.parse(jsonText) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

export const summarizeArticle = async (text: string, title?: string): Promise<string | null> => {
  const ai = getAIClient();
  if (!ai) {
    return new Promise((resolve) => setTimeout(() => resolve("ملخص تلقائي (محاكاة): يتناول هذا المقال أهمية التحول الرقمي في تحسين الخدمات الحكومية وتسريع الإجراءات للمواطنين."), 1000));
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `لخص المقال التالي في فقرة واحدة موجزة وذكية باللغة العربية:\n\nالعنوان: ${title || 'بدون عنوان'}\n\nالنص:\n${text}`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || null;
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return null;
  }
};