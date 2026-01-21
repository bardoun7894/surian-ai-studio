from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from app.providers.factory import get_provider, get_available_providers
from app.providers.base import AIProvider, Message
from app.services.ocr_service import OCRService
from app.config import settings
import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MOE AI Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection for AI Provider
def get_ai_provider(provider: Optional[str] = Query(None, description="Override AI provider (gemini or openai)")) -> AIProvider:
    """Get AI provider - can be overridden via query param for testing."""
    try:
        return get_provider(provider)
    except Exception as e:
        logger.error(f"Failed to initialize provider: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize AI provider: {str(e)}")

# Models
class ChatRequest(BaseModel):
    prompt: str

class ComplaintRequest(BaseModel):
    text: str

class SummarizeRequest(BaseModel):
    text: str

class ProofreadRequest(BaseModel):
    text: str

class TitleRequest(BaseModel):
    text: str

class EmbeddingRequest(BaseModel):
    text: str
    target_dim: int = 1024  # Default to 1024 dimensions

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "ar"  # ar or en
    target_lang: str = "en"  # ar or en

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ai-service",
        "provider": settings.AI_PROVIDER,
        "available_providers": get_available_providers()
    }

@app.get("/api/v1/ai/providers")
async def list_providers():
    """List available AI providers and current configuration."""
    return {
        "current_provider": settings.AI_PROVIDER,
        "available_providers": get_available_providers(),
        "models": {
            "gemini": settings.GEMINI_MODEL,
            "openai": settings.OPENAI_MODEL
        }
    }

@app.post("/api/v1/ai/chat")
async def chat(request: ChatRequest, provider: AIProvider = Depends(get_ai_provider)):
    """Chat with AI assistant."""
    try:
        messages = [Message(role="user", content=request.prompt)]
        response = await provider.chat(messages, system_prompt=settings.CHAT_SYSTEM_PROMPT)
        return {
            "response": response.content,
            "provider": settings.AI_PROVIDER
        }
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ai/analyze-complaint")
async def analyze_complaint(request: ComplaintRequest, provider: AIProvider = Depends(get_ai_provider)):
    """Analyze and classify a complaint."""
    try:
        result = await provider.analyze_complaint(request.text)
        return {
            "directorate": result.directorate,
            "directorate_id": result.directorate_id,
            "priority": result.priority,
            "summary": result.summary,
            "keywords": result.keywords,
            "confidence": result.confidence,
            "provider": settings.AI_PROVIDER
        }
    except Exception as e:
        logger.error(f"Analyze complaint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ai/summarize")
async def summarize(request: SummarizeRequest, provider: AIProvider = Depends(get_ai_provider)):
    """Summarize text content."""
    try:
        result = await provider.summarize(request.text)
        return {
            "summary": result.summary,
            "key_points": result.key_points,
            "word_count": result.word_count,
            "provider": settings.AI_PROVIDER
        }
    except Exception as e:
        logger.error(f"Summarize error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ai/suggest-title")
async def suggest_title(request: TitleRequest, provider: AIProvider = Depends(get_ai_provider)):
    """Suggest SEO-friendly titles."""
    try:
        titles = await provider.suggest_title(request.text)
        return {
            "titles": titles if isinstance(titles, list) else [titles],
            "provider": settings.AI_PROVIDER
        }
    except Exception as e:
        logger.error(f"Suggest title error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ai/proofread")
async def proofread(request: ProofreadRequest, provider: AIProvider = Depends(get_ai_provider)):
    """Proofread and correct text."""
    try:
        result = await provider.proofread(request.text)
        return {
            **result,
            "provider": settings.AI_PROVIDER
        }
    except Exception as e:
        logger.error(f"Proofread error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ai/ocr")
async def ocr(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    text = OCRService.extract_text(content)
    return {"text": text}

@app.post("/api/v1/ai/embeddings")
async def generate_embeddings(request: EmbeddingRequest, provider: AIProvider = Depends(get_ai_provider)):
    """FR-36: Generate text embeddings for semantic search.

    Returns embedding vector with model metadata.
    Note: Embeddings are only supported with Gemini provider currently.
    """
    try:
        # Embeddings require specific implementation - use Gemini for now
        from app.services.gemini_provider import GeminiProvider
        gemini = GeminiProvider()
        result = await gemini.generate_embedding(request.text, request.target_dim)
        return result
    except Exception as e:
        logger.error(f"Embedding error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate embedding: {str(e)}")

@app.post("/api/v1/ai/translate")
async def translate(request: TranslateRequest, provider: AIProvider = Depends(get_ai_provider)):
    """Translate text between Arabic and English.

    Used for auto-translating content in the CMS.
    """
    try:
        lang_names = {"ar": "Arabic", "en": "English"}
        source = lang_names.get(request.source_lang, "Arabic")
        target = lang_names.get(request.target_lang, "English")

        prompt = f"""Translate the following text from {source} to {target}.
Maintain the original formatting, tone, and meaning.
Only return the translated text without any explanations or notes.

Text to translate:
{request.text}"""

        # Use chat method for translation
        messages = [Message(role="user", content=prompt)]
        response = await provider.chat(messages, temperature=0.3, max_tokens=2000)

        return {
            "success": True,
            "translated_text": response.content.strip(),
            "source_lang": request.source_lang,
            "target_lang": request.target_lang,
            "provider": settings.AI_PROVIDER
        }
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
