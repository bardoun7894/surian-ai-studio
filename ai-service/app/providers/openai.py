"""
OpenAI GPT Provider implementation.
"""

import json
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI

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


class OpenAIProvider(AIProvider):
    """OpenAI GPT provider."""

    def __init__(self):
        """Initialize OpenAI provider."""
        import httpx
        # Create client without proxy settings to avoid compatibility issues
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            http_client=httpx.AsyncClient(timeout=60.0)
        )
        self.model = settings.OPENAI_MODEL

    async def chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> ChatResponse:
        """Send chat message to OpenAI."""
        # Build messages list
        openai_messages = []

        if system_prompt:
            openai_messages.append({
                "role": "system",
                "content": system_prompt,
            })

        for msg in messages:
            openai_messages.append({
                "role": msg.role,
                "content": msg.content,
            })

        # Generate response
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=openai_messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        choice = response.choices[0]
        return ChatResponse(
            content=choice.message.content,
            finish_reason=choice.finish_reason,
            usage={
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
            },
        )

    async def analyze_complaint(
        self,
        complaint_text: str,
        attachments: Optional[List[str]] = None,
    ) -> AnalysisResponse:
        """Analyze complaint using OpenAI."""
        system_prompt = settings.COMPLAINT_ANALYSIS_PROMPT

        user_prompt = f"""نص الشكوى:
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

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=500,
            response_format={"type": "json_object"},
        )

        try:
            data = json.loads(response.choices[0].message.content)

            return AnalysisResponse(
                directorate=data.get("directorate", "مديرية الشؤون الإدارية والمالية"),
                directorate_id=DIRECTORATES.get(data.get("directorate")),
                priority=data.get("priority", "medium"),
                summary=data.get("summary", ""),
                keywords=data.get("keywords", []),
                confidence=data.get("confidence", 0.5),
            )
        except (json.JSONDecodeError, KeyError):
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
        """Summarize text using OpenAI."""
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

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=800,
            response_format={"type": "json_object"},
        )

        try:
            data = json.loads(response.choices[0].message.content)
            summary = data.get("summary", "")

            return SummarizeResponse(
                summary=summary,
                key_points=data.get("key_points", []),
                word_count=len(summary.split()),
            )
        except (json.JSONDecodeError, KeyError):
            content = response.choices[0].message.content
            return SummarizeResponse(
                summary=content[:max_length * 5],
                key_points=[],
                word_count=len(content.split()),
            )

    async def suggest_title(
        self,
        content: str,
        content_type: str = "news",
    ) -> List[str]:
        """Suggest titles using OpenAI."""
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
{{"titles": ["عنوان 1", "عنوان 2", "عنوان 3", "عنوان 4", "عنوان 5"]}}"""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300,
            response_format={"type": "json_object"},
        )

        try:
            data = json.loads(response.choices[0].message.content)
            return data.get("titles", [f"عنوان مقترح ل{type_name}"])
        except (json.JSONDecodeError, KeyError):
            return [f"عنوان مقترح ل{type_name}"]

    async def proofread(
        self,
        text: str,
        language: str = "ar",
    ) -> Dict[str, Any]:
        """Proofread text using OpenAI."""
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

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1500,
            response_format={"type": "json_object"},
        )

        try:
            return json.loads(response.choices[0].message.content)
        except (json.JSONDecodeError, KeyError):
            return {
                "corrected_text": text,
                "corrections": [],
                "suggestions": [],
            }
