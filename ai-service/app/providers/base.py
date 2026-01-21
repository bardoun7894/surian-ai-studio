"""
Base AI Provider interface.
All AI providers must implement this interface.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class Message(BaseModel):
    """Chat message model."""
    role: str  # "user" or "assistant"
    content: str


class ChatResponse(BaseModel):
    """Chat response model."""
    content: str
    finish_reason: Optional[str] = None
    usage: Optional[Dict[str, int]] = None


class AnalysisResponse(BaseModel):
    """Complaint analysis response model."""
    directorate: str
    directorate_id: Optional[int] = None
    priority: str  # "high", "medium", "low"
    summary: str
    keywords: List[str]
    confidence: float


class SummarizeResponse(BaseModel):
    """Text summarization response model."""
    summary: str
    key_points: List[str]
    word_count: int


class AIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    async def chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> ChatResponse:
        """
        Send a chat message and get a response.

        Args:
            messages: List of conversation messages
            system_prompt: Optional system prompt to set context
            temperature: Creativity level (0.0-1.0)
            max_tokens: Maximum tokens in response

        Returns:
            ChatResponse with the assistant's reply
        """
        pass

    @abstractmethod
    async def analyze_complaint(
        self,
        complaint_text: str,
        attachments: Optional[List[str]] = None,
    ) -> AnalysisResponse:
        """
        Analyze a complaint and classify it.

        Args:
            complaint_text: The complaint content
            attachments: Optional list of attachment descriptions

        Returns:
            AnalysisResponse with classification details
        """
        pass

    @abstractmethod
    async def summarize(
        self,
        text: str,
        max_length: int = 200,
        language: str = "ar",
    ) -> SummarizeResponse:
        """
        Summarize text content.

        Args:
            text: Text to summarize
            max_length: Maximum summary length in words
            language: Target language code

        Returns:
            SummarizeResponse with summary and key points
        """
        pass

    @abstractmethod
    async def suggest_title(
        self,
        content: str,
        content_type: str = "news",
    ) -> List[str]:
        """
        Suggest SEO-friendly titles for content.

        Args:
            content: The content to generate titles for
            content_type: Type of content (news, decree, announcement)

        Returns:
            List of suggested titles
        """
        pass

    @abstractmethod
    async def proofread(
        self,
        text: str,
        language: str = "ar",
    ) -> Dict[str, Any]:
        """
        Proofread and correct text.

        Args:
            text: Text to proofread
            language: Language code

        Returns:
            Dict with corrected text and suggestions
        """
        pass
