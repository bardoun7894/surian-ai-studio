"""
Analysis endpoints for complaints and content.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.providers import get_provider

router = APIRouter()


class ComplaintAnalysisRequest(BaseModel):
    """Complaint analysis request."""
    complaint_text: str = Field(..., min_length=10, max_length=5000)
    attachments: Optional[List[str]] = Field(default=None, max_length=5)


class ComplaintAnalysisResponse(BaseModel):
    """Complaint analysis response."""
    directorate: str
    directorate_id: Optional[int]
    priority: str
    summary: str
    keywords: List[str]
    confidence: float
    is_valid: bool = True


@router.post("/analyze-complaint", response_model=ComplaintAnalysisResponse)
async def analyze_complaint(request: ComplaintAnalysisRequest):
    """
    Analyze a complaint and classify it.

    Returns:
    - Recommended directorate
    - Priority level (high/medium/low)
    - Short summary
    - Keywords
    - Confidence score
    """
    try:
        provider = get_provider()

        analysis = await provider.analyze_complaint(
            complaint_text=request.complaint_text,
            attachments=request.attachments,
        )

        return ComplaintAnalysisResponse(
            directorate=analysis.directorate,
            directorate_id=analysis.directorate_id,
            priority=analysis.priority,
            summary=analysis.summary,
            keywords=analysis.keywords,
            confidence=analysis.confidence,
            is_valid=analysis.is_valid,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


class TitleSuggestionRequest(BaseModel):
    """Title suggestion request."""
    content: str = Field(..., min_length=50, max_length=10000)
    content_type: str = Field(default="news", pattern="^(news|decree|announcement)$")


class TitleSuggestionResponse(BaseModel):
    """Title suggestion response."""
    titles: List[str]


@router.post("/suggest-title", response_model=TitleSuggestionResponse)
async def suggest_title(request: TitleSuggestionRequest):
    """
    Suggest SEO-friendly titles for content.

    Generates 5 title suggestions based on the content.
    """
    try:
        provider = get_provider()

        titles = await provider.suggest_title(
            content=request.content,
            content_type=request.content_type,
        )

        return TitleSuggestionResponse(titles=titles)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Title suggestion error: {str(e)}")


class ProofreadRequest(BaseModel):
    """Proofread request."""
    text: str = Field(..., min_length=10, max_length=10000)
    language: str = Field(default="ar", pattern="^(ar|en)$")


class Correction(BaseModel):
    """Single correction."""
    original: str
    corrected: str
    type: str


class ProofreadResponse(BaseModel):
    """Proofread response."""
    corrected_text: str
    corrections: List[Correction]
    suggestions: List[str]


@router.post("/proofread", response_model=ProofreadResponse)
async def proofread(request: ProofreadRequest):
    """
    Proofread and correct text.

    Returns:
    - Corrected text
    - List of corrections made
    - Style suggestions
    """
    try:
        provider = get_provider()

        result = await provider.proofread(
            text=request.text,
            language=request.language,
        )

        corrections = [
            Correction(
                original=c.get("original", ""),
                corrected=c.get("corrected", ""),
                type=c.get("type", "unknown"),
            )
            for c in result.get("corrections", [])
        ]

        return ProofreadResponse(
            corrected_text=result.get("corrected_text", request.text),
            corrections=corrections,
            suggestions=result.get("suggestions", []),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Proofread error: {str(e)}")
