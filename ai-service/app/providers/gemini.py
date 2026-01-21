"""
Google Gemini AI Provider implementation.
"""

import json
from typing import List, Dict, Any, Optional
import google.generativeai as genai

from app.providers.base import (
    AIProvider,
    Message,
    ChatResponse,
    AnalysisResponse,
    SummarizeResponse,
)
from app.config import settings


# Directorate mapping
DIRECTORATES = {
    "مديرية التجارة الداخلية وحماية المستهلك": 1,
    "مديرية التجارة الخارجية": 2,
    "مديرية الصناعة": 3,
    "مديرية التخطيط والتعاون الدولي": 4,
    "مديرية الشؤون القانونية": 5,
    "مديرية الشؤون الإدارية والمالية": 6,
}


class GeminiProvider(AIProvider):
    """Google Gemini AI provider."""

    def __init__(self):
        """Initialize Gemini provider."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Use gemini-pro for chat - the model name should not include version suffix
        model_name = settings.GEMINI_MODEL
        # Fallback to gemini-pro if the specified model is not available
        try:
            self.model = genai.GenerativeModel(model_name)
        except Exception:
            self.model = genai.GenerativeModel("gemini-pro")

    async def chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> ChatResponse:
        """Send chat message to Gemini."""
        # Build conversation history
        history = []
        for msg in messages[:-1]:  # All but last message
            history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content],
            })

        # Create chat session
        chat = self.model.start_chat(history=history)

        # Build prompt with system context
        prompt = messages[-1].content
        if system_prompt and not history:
            prompt = f"{system_prompt}\n\n{prompt}"

        # Generate response
        response = chat.send_message(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            ),
        )

        return ChatResponse(
            content=response.text,
            finish_reason="stop",
            usage={
                "prompt_tokens": 0,  # Gemini doesn't expose this easily
                "completion_tokens": 0,
            },
        )

    async def analyze_complaint(
        self,
        complaint_text: str,
        attachments: Optional[List[str]] = None,
    ) -> AnalysisResponse:
        """Analyze complaint using Gemini."""
        prompt = f"""{settings.COMPLAINT_ANALYSIS_PROMPT}

نص الشكوى:
{complaint_text}

{"المرفقات: " + ", ".join(attachments) if attachments else ""}

أجب بصيغة JSON التالية فقط:
{{
    "directorate": "اسم المديرية",
    "priority": "high|medium|low",
    "summary": "ملخص قصير",
    "keywords": ["كلمة1", "كلمة2"],
    "confidence": 0.95
}}"""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=500,
            ),
        )

        # Parse JSON response
        try:
            # Extract JSON from response
            text = response.text
            # Handle markdown code blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]

            data = json.loads(text.strip())

            return AnalysisResponse(
                directorate=data.get("directorate", "مديرية الشؤون الإدارية والمالية"),
                directorate_id=DIRECTORATES.get(data.get("directorate")),
                priority=data.get("priority", "medium"),
                summary=data.get("summary", ""),
                keywords=data.get("keywords", []),
                confidence=data.get("confidence", 0.5),
            )
        except (json.JSONDecodeError, KeyError):
            # Fallback response
            return AnalysisResponse(
                directorate="مديرية الشؤون الإدارية والمالية",
                directorate_id=6,
                priority="medium",
                summary="شكوى تحتاج مراجعة يدوية",
                keywords=[],
                confidence=0.3,
            )

    async def summarize(
        self,
        text: str,
        max_length: int = 200,
        language: str = "ar",
    ) -> SummarizeResponse:
        """Summarize text using Gemini."""
        lang_instruction = "باللغة العربية" if language == "ar" else "in English"

        prompt = f"""لخص النص التالي {lang_instruction} في {max_length} كلمة كحد أقصى.
استخرج أيضاً 3-5 نقاط رئيسية.

النص:
{text}

أجب بصيغة JSON:
{{
    "summary": "الملخص هنا",
    "key_points": ["نقطة 1", "نقطة 2", "نقطة 3"]
}}"""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=800,
            ),
        )

        try:
            text_response = response.text
            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0]
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0]

            data = json.loads(text_response.strip())

            summary = data.get("summary", "")
            return SummarizeResponse(
                summary=summary,
                key_points=data.get("key_points", []),
                word_count=len(summary.split()),
            )
        except (json.JSONDecodeError, KeyError):
            return SummarizeResponse(
                summary=response.text[:max_length * 5],  # Approximate chars
                key_points=[],
                word_count=len(response.text.split()),
            )

    async def suggest_title(
        self,
        content: str,
        content_type: str = "news",
    ) -> List[str]:
        """Suggest titles using Gemini."""
        type_names = {
            "news": "خبر",
            "decree": "قرار",
            "announcement": "إعلان",
        }
        type_name = type_names.get(content_type, "محتوى")

        prompt = f"""اقترح 5 عناوين جذابة ومناسبة لمحركات البحث لهذا ال{type_name}.
العناوين يجب أن تكون:
- واضحة ومباشرة
- تحتوي على الكلمات المفتاحية
- مناسبة لموقع حكومي رسمي

المحتوى:
{content[:1000]}

أجب بقائمة JSON فقط:
["عنوان 1", "عنوان 2", "عنوان 3", "عنوان 4", "عنوان 5"]"""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                max_output_tokens=300,
            ),
        )

        try:
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]

            return json.loads(text.strip())
        except (json.JSONDecodeError, KeyError):
            return [f"عنوان مقترح ل{type_name}"]

    async def proofread(
        self,
        text: str,
        language: str = "ar",
    ) -> Dict[str, Any]:
        """Proofread text using Gemini."""
        lang_name = "العربية" if language == "ar" else "English"

        prompt = f"""راجع النص التالي باللغة {lang_name} وصحح:
- الأخطاء الإملائية
- الأخطاء النحوية
- علامات الترقيم

النص:
{text}

أجب بصيغة JSON:
{{
    "corrected_text": "النص المصحح",
    "corrections": [
        {{"original": "كلمة خاطئة", "corrected": "كلمة صحيحة", "type": "إملائي"}}
    ],
    "suggestions": ["اقتراح لتحسين الأسلوب"]
}}"""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.2,
                max_output_tokens=1500,
            ),
        )

        try:
            text_response = response.text
            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0]
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0]

            return json.loads(text_response.strip())
        except (json.JSONDecodeError, KeyError):
            return {
                "corrected_text": text,
                "corrections": [],
                "suggestions": [],
            }
