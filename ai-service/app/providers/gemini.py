"""
Google Gemini AI Provider implementation.
Uses the new google.genai SDK (replaces deprecated google.generativeai).
"""

import json
import re
import logging
from typing import List, Dict, Any, Optional

from google import genai
from google.genai import types

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


logger = logging.getLogger(__name__)


class GeminiProvider(AIProvider):
    """Google Gemini AI provider using google.genai SDK."""

    def __init__(self):
        """Initialize Gemini provider."""
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL

    @staticmethod
    def _extract_json(text: str) -> Any:
        """
        Robustly extract JSON from model response text.

        Handles gemini's tendency to wrap JSON in markdown code blocks,
        include thinking tokens, or add extra text around the JSON.
        """
        # 1. Try direct parse first (cleanest case)
        stripped = text.strip()
        try:
            return json.loads(stripped)
        except json.JSONDecodeError:
            pass

        # 2. Extract from ```json ... ``` blocks
        json_block = re.search(r'```json\s*([\s\S]*?)```', text)
        if json_block:
            try:
                return json.loads(json_block.group(1).strip())
            except json.JSONDecodeError:
                pass

        # 3. Extract from ``` ... ``` blocks (no language tag)
        code_block = re.search(r'```\s*([\s\S]*?)```', text)
        if code_block:
            try:
                return json.loads(code_block.group(1).strip())
            except json.JSONDecodeError:
                pass

        # 4. Find first JSON object {...} or array [...] in text using brace matching
        for start_char, end_char in [('{', '}'), ('[', ']')]:
            start_idx = text.find(start_char)
            if start_idx == -1:
                continue
            depth = 0
            in_string = False
            escape = False
            for i in range(start_idx, len(text)):
                c = text[i]
                if escape:
                    escape = False
                    continue
                if c == '\\' and in_string:
                    escape = True
                    continue
                if c == '"' and not escape:
                    in_string = not in_string
                    continue
                if in_string:
                    continue
                if c == start_char:
                    depth += 1
                elif c == end_char:
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(text[start_idx:i + 1])
                        except json.JSONDecodeError:
                            break

        raise json.JSONDecodeError("No valid JSON found in response", text, 0)

    async def chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> ChatResponse:
        """Send chat message to Gemini."""
        # Build contents list
        contents = []
        for msg in messages:
            contents.append(
                types.Content(
                    role="user" if msg.role == "user" else "model",
                    parts=[types.Part.from_text(text=msg.content)],
                )
            )

        # Build config
        config = types.GenerateContentConfig(
            temperature=temperature,
            max_output_tokens=max_tokens,
        )
        if system_prompt:
            config.system_instruction = system_prompt

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=contents,
            config=config,
        )

        return ChatResponse(
            content=response.text,
            finish_reason="stop",
            usage={
                "prompt_tokens": getattr(response.usage_metadata, 'prompt_token_count', 0) if response.usage_metadata else 0,
                "completion_tokens": getattr(response.usage_metadata, 'candidates_token_count', 0) if response.usage_metadata else 0,
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
    "confidence": 0.95,
    "is_valid": true
}}"""

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=2048,
            ),
        )

        # Parse JSON response
        try:
            data = self._extract_json(response.text)

            return AnalysisResponse(
                directorate=data.get("directorate", "مديرية الشؤون الإدارية والمالية"),
                directorate_id=DIRECTORATES.get(data.get("directorate")),
                priority=data.get("priority", "medium"),
                summary=data.get("summary", ""),
                keywords=data.get("keywords", []),
                confidence=data.get("confidence", 0.5),
                is_valid=data.get("is_valid", True),
            )
        except (json.JSONDecodeError, KeyError, AttributeError) as e:
            logger.warning(f"Failed to parse analyze_complaint response: {e}\nRaw: {response.text[:500]}")
            return AnalysisResponse(
                directorate="مديرية الشؤون الإدارية والمالية",
                directorate_id=6,
                priority="medium",
                summary="شكوى تحتاج مراجعة يدوية",
                keywords=[],
                confidence=0.3,
                is_valid=True,
            )

    async def summarize(
        self,
        text: str,
        max_length: int = 200,
        language: str = "ar",
        system_prompt: Optional[str] = None,
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

        config = types.GenerateContentConfig(
            temperature=0.3,
            max_output_tokens=4096,
        )
        if system_prompt:
            config.system_instruction = system_prompt

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config,
        )

        try:
            data = self._extract_json(response.text)

            summary = data.get("summary", "")
            return SummarizeResponse(
                summary=summary,
                key_points=data.get("key_points", []),
                word_count=len(summary.split()),
            )
        except (json.JSONDecodeError, KeyError, AttributeError) as e:
            logger.warning(f"Failed to parse summarize response: {e}\nRaw: {response.text[:500]}")
            return SummarizeResponse(
                summary=response.text[:max_length * 5],
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

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=2048,
            ),
        )

        try:
            return self._extract_json(response.text)
        except (json.JSONDecodeError, KeyError, AttributeError) as e:
            logger.warning(f"Failed to parse suggest_title response: {e}\nRaw: {response.text[:500]}")
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

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=4096,
            ),
        )

        try:
            return self._extract_json(response.text)
        except (json.JSONDecodeError, KeyError, AttributeError) as e:
            logger.warning(f"Failed to parse proofread response: {e}\nRaw: {response.text[:500]}")
            return {
                "corrected_text": text,
                "corrections": [],
                "suggestions": [],
            }

    async def ocr_with_vision(self, image_bytes: bytes, mime_type: str = "image/png") -> str:
        """Extract text from image using Gemini vision API."""
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=[
                    types.Content(
                        parts=[
                            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                            types.Part.from_text(
                                text="استخرج كل النص الموجود في هذه الصورة. أعد النص فقط بدون أي تعليقات أو شرح. إذا كان النص بالعربية حافظ عليه بالعربية. Extract all text from this image. Return only the text without comments."
                            ),
                        ]
                    )
                ],
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=4096,
                ),
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini Vision OCR error: {e}")
            return ""
