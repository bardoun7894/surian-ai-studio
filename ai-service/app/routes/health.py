"""
Health check endpoints.
"""

from fastapi import APIRouter
from app.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "provider": settings.AI_PROVIDER,
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check for Kubernetes."""
    # Check if AI provider is configured
    provider_ready = False

    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        provider_ready = True
    elif settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        provider_ready = True

    return {
        "ready": provider_ready,
        "provider": settings.AI_PROVIDER,
        "provider_configured": provider_ready,
    }
