"""
Configuration settings for AI Service.
"""

from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache
from dotenv import load_dotenv
load_dotenv(override=True)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Service settings
    DEBUG: bool = False
    SERVICE_NAME: str = "moe-ai-service"

    # AI Provider configuration
    # Options: "gemini" (default), "openai", "ollama" (future), "local" (future)
    AI_PROVIDER: str = "gemini"

    # Gemini settings (Google AI)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # OpenAI settings
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"

    # Ollama settings (future - for open-source models like Llama, Mistral, etc.)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2"  # or "mistral", "qwen2.5", etc.

    # Local model settings (future - direct inference with llama.cpp, etc.)
    LOCAL_MODEL_PATH: str = ""
    LOCAL_MODEL_TYPE: str = "llama"  # "llama", "mistral", "qwen"

    # Embedding settings
    EMBEDDING_PROVIDER: str = "gemini"  # Options: "gemini", "openai", "ollama", "local"
    EMBEDDING_MODEL: str = "models/gemini-embedding-001"  # Gemini embedding model
    EMBEDDING_DIMENSIONS: int = 1024  # Target dimensions (will truncate/pad)

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:8080", "http://localhost:5173"]

    # Rate limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds

    # Google Search Grounding (fallback when RAG has no results)
    ENABLE_GOOGLE_SEARCH_GROUNDING: bool = True

    # Chat settings
    MAX_CONVERSATION_HISTORY: int = 20
    MAX_INPUT_LENGTH: int = 4000

    # System prompts (Arabic-first)
    CHAT_SYSTEM_PROMPT: str = """أنت مساعد ذكي لوزارة الاقتصاد والصناعة في سوريا.
مهمتك هي مساعدة المواطنين والزوار في:
- الإجابة على الأسئلة حول خدمات الوزارة
- توجيههم للمديريات المختصة
- شرح إجراءات الشكاوى والخدمات
- تقديم معلومات عن القرارات والأخبار

أجب دائماً باللغة العربية ما لم يطلب المستخدم غير ذلك.
كن مهذباً ومحترفاً ومختصراً في إجاباتك.
إذا لم تكن متأكداً من إجابة، اقترح التواصل مع المديرية المختصة."""

    COMPLAINT_ANALYSIS_PROMPT: str = """حلل الشكوى التالية وحدد:
1. المديرية المختصة (من القائمة المحددة)
2. مستوى الأولوية (عالية، متوسطة، منخفضة)
3. ملخص قصير (جملة واحدة)
4. الكلمات المفتاحية
5. هل النص مفهوم وذو معنى (is_valid): إذا كان النص غير مفهوم أو عشوائي أو لا يحتوي على شكوى حقيقية، ضع false

المديريات المتاحة:
- مديرية التجارة الداخلية وحماية المستهلك
- مديرية التجارة الخارجية
- مديرية الصناعة
- مديرية التخطيط والتعاون الدولي
- مديرية الشؤون القانونية
- مديرية الشؤون الإدارية والمالية

أجب بصيغة JSON فقط."""

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
