"""
Provider factory for selecting AI provider based on configuration.
"""

from functools import lru_cache
from typing import Optional

from app.providers.base import AIProvider
from app.config import settings


@lru_cache()
def get_provider(provider_name: Optional[str] = None) -> AIProvider:
    """
    Get the configured AI provider instance.

    Args:
        provider_name: Override the configured provider (optional)

    Returns:
        AIProvider instance

    Raises:
        ValueError: If the provider is not supported
    """
    name = provider_name or settings.AI_PROVIDER

    if name == "gemini":
        from app.providers.gemini import GeminiProvider
        return GeminiProvider()

    elif name == "openai":
        from app.providers.openai import OpenAIProvider
        return OpenAIProvider()

    else:
        raise ValueError(f"Unsupported AI provider: {name}")


def get_available_providers() -> list[str]:
    """Get list of available AI providers."""
    return ["gemini", "openai"]
