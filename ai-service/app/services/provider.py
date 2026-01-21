from abc import ABC, abstractmethod
from typing import Dict, Any, List

class AIProvider(ABC):
    @abstractmethod
    async def generate_content(self, prompt: str) -> str:
        """Generate text from prompt"""
        pass

    @abstractmethod
    async def analyze_complaint(self, text: str) -> Dict[str, Any]:
        """Classify complaint category and priority.
        Returns dict with keys: category, priority, summary
        """
        pass
    
    @abstractmethod
    async def suggest_title(self, text: str) -> str:
        """Suggest a title for the given text"""
        pass

    @abstractmethod
    async def proofread(self, text: str) -> str:
        """Proofread and correct the text"""
        pass

    @abstractmethod
    async def generate_embedding(self, text: str, target_dim: int = 1024) -> Dict[str, Any]:
        """Generate vector embedding for semantic search (FR-36).

        Returns dict with:
        - embedding: List[float] - the embedding vector
        - model: str - model identifier (e.g., "gemini/embedding-001")
        - original_dim: int - original embedding dimensions
        - target_dim: int - normalized dimensions
        """
        pass
