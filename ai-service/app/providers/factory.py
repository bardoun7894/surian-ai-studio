"""
Provider factory for selecting AI provider based on configuration.

Supported providers:
- gemini: Google Gemini API (current default)
- openai: OpenAI API (GPT-4, etc.)
- ollama: Local Ollama server (future - open source models)
- local: Direct local model inference (future - llama.cpp, etc.)

To add a new provider:
1. Create provider class in app/providers/ implementing AIProvider interface
2. Add case to get_provider() factory function
3. Add to get_available_providers() list
4. Update config.py with any new settings needed
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

    # Future: Open-source model support
    # elif name == "ollama":
    #     from app.providers.ollama import OllamaProvider
    #     return OllamaProvider()
    #
    # elif name == "local":
    #     from app.providers.local import LocalProvider
    #     return LocalProvider()

    else:
        raise ValueError(
            f"Unsupported AI provider: {name}. "
            f"Available: {', '.join(get_available_providers())}"
        )


def get_available_providers() -> list[str]:
    """Get list of available AI providers."""
    return ["gemini", "openai"]  # Add "ollama", "local" when implemented
