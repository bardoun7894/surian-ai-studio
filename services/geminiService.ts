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

export const chatWithAssistant = async (
  message: string, 
  history: {role: string, parts: {text: string}[]}[],
  attachment?: { data: string; mimeType: string }
): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "عذراً، نظام الذكاء الاصطناعي غير متصل حالياً. يرجى المحاولة لاحقاً.";

    try {
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "أنت المساعد الذكي الرسمي للبوابة الإلكترونية للحكومة السورية. هدفك هو مساعدة المواطنين وتسهيل معاملاتهم.\n\n" +
                "توجيهات التفاعل:\n" +
                "1. ابدأ بالترحيب والتعريف بنفسك إذا كانت بداية المحادثة.\n" +
                "2. كن تفاعلياً: إذا كان استفسار المستخدم يتطلب تقديم شكوى أو معاملة رسمية، اطلب منه بلطف تزويدك باسمه، رقم هاتفه، أو أي تفاصيل ضرورية لمساعدته بشكل أفضل.\n" +
                "3. إذا رفع المستخدم صورة أو ملف PDF، قم بتحليل محتواه بدقة (OCR) واستخدم المعلومات الموجودة فيه للإجابة.\n" +
                "4. تحدث باللغة العربية الفصحى المبسطة والرسمية.\n" +
                "5. إذا سأل عن خدمة معينة، وجهه للجهة المسؤولة أو الرابط المباشر في البوابة.\n" +
                "6. لا تتردد في طرح أسئلة استيضاحية للتأكد من فهمك لحاجة المواطن."
            },
            history: history
        });

        let result;

        if (attachment) {
            // Multimodal Request
            const msgParts: any[] = [
                { text: message || " " }, // Ensure text is not empty if only image is sent
                {
                    inlineData: {
                        mimeType: attachment.mimeType,
                        data: attachment.data
                    }
                }
            ];
            
            // Correctly structuring for SDK v1
            result = await chat.sendMessage({ 
              message: { parts: msgParts } 
            });
        } else {
            // Text-only Request
            result = await chat.sendMessage({ message: message });
        }

        return result.text || "عذراً، لم أتمكن من فهم طلبك.";
    } catch (error: any) {
        console.error("Chat Error:", error);
        return "حدث خطأ فني في النظام أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.";
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

export const analyzeDocument = async (base64Image: string, mimeType: string): Promise<string | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "قم باستخراج النص الموجود في هذه الصورة بدقة. إذا كان النص عبارة عن شكوى رسمية أو طلب، قم بتلخيصه واستخراج التفاصيل المهمة باللغة العربية. اجعل النص المستخرج جاهزاً لملء استمارة."
          }
        ]
      }
    });

    return response.text || null;
  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};