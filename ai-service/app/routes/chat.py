"""
Chat endpoints for AI assistant.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.providers import get_provider
from app.providers.base import Message
from app.config import settings

router = APIRouter()


class ChatMessage(BaseModel):
    """Single chat message."""
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=settings.MAX_INPUT_LENGTH)


class ChatRequest(BaseModel):
    """Chat request model."""
    messages: List[ChatMessage] = Field(..., min_length=1, max_length=settings.MAX_CONVERSATION_HISTORY)
    system_prompt: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=1.0)
    max_tokens: int = Field(default=1000, ge=100, le=4000)


class ChatMessageResponse(BaseModel):
    """Chat response model."""
    content: str
    role: str = "assistant"
    finish_reason: Optional[str] = None


@router.post("/chat", response_model=ChatMessageResponse)
async def chat(request: ChatRequest):
    """
    Chat with AI assistant.

    Send a conversation history and get a response from the AI.
    The system prompt is automatically set for the MOE website context.
    """
    try:
        provider = get_provider()

        # Convert to provider message format
        messages = [Message(role=m.role, content=m.content) for m in request.messages]

        # Use default system prompt if not provided
        system_prompt = request.system_prompt or settings.CHAT_SYSTEM_PROMPT

        response = await provider.chat(
            messages=messages,
            system_prompt=system_prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        return ChatMessageResponse(
            content=response.content,
            role="assistant",
            finish_reason=response.finish_reason,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


class QuickChatRequest(BaseModel):
    """Simple single-message chat request."""
    message: str = Field(..., min_length=1, max_length=settings.MAX_INPUT_LENGTH)
    language: str = Field(default="ar", pattern="^(ar|en)$")


@router.post("/chat/quick", response_model=ChatMessageResponse)
async def quick_chat(request: QuickChatRequest):
    """
    Quick single-message chat.

    For simple one-off questions without conversation history.
    """
    try:
        provider = get_provider()

        messages = [Message(role="user", content=request.message)]

        # Adjust system prompt based on language
        system_prompt = settings.CHAT_SYSTEM_PROMPT
        if request.language == "en":
            system_prompt = """You are an AI assistant for the Syrian Ministry of Economy & Industry.
Help citizens and visitors with:
- Questions about ministry services
- Directing them to relevant directorates
- Explaining complaint and service procedures
- Providing information about decisions and news

Be polite, professional, and concise.
If unsure, suggest contacting the relevant directorate."""

        response = await provider.chat(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=800,
        )

        return ChatMessageResponse(
            content=response.content,
            role="assistant",
            finish_reason=response.finish_reason,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
