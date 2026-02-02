"""
Summarization endpoints.
"""

from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.providers import get_provider

router = APIRouter()


class SummarizeRequest(BaseModel):
    """Summarization request."""
    text: str = Field(..., min_length=20, max_length=20000)
    max_length: int = Field(default=200, ge=50, le=500)
    language: str = Field(default="ar", pattern="^(ar|en)$")


class SummarizeResponse(BaseModel):
    """Summarization response."""
    summary: str
    key_points: List[str]
    word_count: int
    original_word_count: int


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    """
    Summarize text content.

    Returns:
    - Condensed summary
    - Key points extracted
    - Word counts
    """
    try:
        provider = get_provider()

        result = await provider.summarize(
            text=request.text,
            max_length=request.max_length,
            language=request.language,
        )

        return SummarizeResponse(
            summary=result.summary,
            key_points=result.key_points,
            word_count=result.word_count,
            original_word_count=len(request.text.split()),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization error: {str(e)}")


class ExtractKeyPointsRequest(BaseModel):
    """Extract key points request."""
    text: str = Field(..., min_length=20, max_length=20000)
    max_points: int = Field(default=5, ge=3, le=10)
    language: str = Field(default="ar", pattern="^(ar|en)$")


class ExtractKeyPointsResponse(BaseModel):
    """Key points extraction response."""
    key_points: List[str]
    count: int


@router.post("/extract-key-points", response_model=ExtractKeyPointsResponse)
async def extract_key_points(request: ExtractKeyPointsRequest):
    """
    Extract key points from text without full summarization.
    """
    try:
        provider = get_provider()

        # Use summarize but only return key points
        result = await provider.summarize(
            text=request.text,
            max_length=50,  # Short summary, focus on key points
            language=request.language,
        )

        # Limit to requested number of points
        key_points = result.key_points[:request.max_points]

        return ExtractKeyPointsResponse(
            key_points=key_points,
            count=len(key_points),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction error: {str(e)}")
