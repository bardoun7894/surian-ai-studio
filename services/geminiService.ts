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
  
  if (!ai) {
    // Simulation fallback
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
      أنت نظام ذكي لفرز الشكاوى الحكومية في سوريا. قم بتحليل نص الشكوى التالي واستخرج المعلومات بتنسيق JSON فقط.
      
      الشكوى: "${text}"
      
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

export const chatWithAssistant = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "عذراً، نظام الذكاء الاصطناعي غير متصل حالياً. يرجى المحاولة لاحقاً.";

    try {
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "أنت المساعد الذكي الرسمي للبوابة الإلكترونية للحكومة السورية. أجب بمهنية، ودقة، ورسمية. ساعد المواطنين في العثور على الخدمات، فهم الإجراءات، وتوجيههم للوزارات الصحيحة. لا تستخدم الرموز التعبيرية (الإيموجي). استخدم اللغة العربية الفصحى."
            },
            history: history
        });

        const result = await chat.sendMessage({ message });
        return result.text || "عذراً، لم أتمكن من فهم طلبك.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "حدث خطأ فني في النظام.";
    }
};

export const summarizeArticle = async (text: string, title?: string): Promise<string | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `لخص الخبر الحكومي التالي في فقرة واحدة رسمية:\n\nالعنوان: ${title || 'بدون عنوان'}\n\nالنص:\n${text}`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || null;
  } catch (error) {
    return null;
  }
};