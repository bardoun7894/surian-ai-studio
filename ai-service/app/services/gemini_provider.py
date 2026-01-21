import google.generativeai as genai
from .provider import AIProvider
from typing import Dict, Any
import os
import json
import logging

logger = logging.getLogger("uvicorn")

class GeminiProvider(AIProvider):
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment")
            # In production, we might want to raise an error, but for dev we might allow instantiation 
            # and fail on call if needed, or stick to raising error.
            # raise ValueError("GEMINI_API_KEY not found") 
        
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')

    async def generate_content(self, prompt: str) -> str:
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generate_content error: {e}")
            return "Error generating content."

    async def analyze_complaint(self, text: str) -> Dict[str, Any]:
        prompt = f"""
        You are an AI assistant for the Ministry of Economy. Analyze the following citizen complaint.
        Return ONLY a raw JSON object (no markdown, no backticks) with the following keys:
        - "category": Choose best fit from [Infrastructure, Health, Economy, Education, Transport, Other]
        - "priority": Choose from [Low, Medium, High, Critical] based on urgency and impact
        - "summary": A concise one-sentence summary in Arabic.

        Complaint text: "{text}"
        """
        try:
            response = self.model.generate_content(prompt)
            cleaned_text = response.text.strip().replace('```json', '').replace('```', '')
            return json.loads(cleaned_text)
        except Exception as e:
            logger.error(f"Gemini analyze_complaint error: {e}")
            # Fallback
            return {"category": "Other", "priority": "Medium", "summary": "Analysis failed"}

    async def suggest_title(self, text: str) -> str:
        prompt = f"""
        Suggest a formal, concise title for a government announcement or article based on the following text.
        Return ONLY the title text, nothing else.
        
        Text: "{text[:1000]}..."
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip().replace('"', '')
        except Exception as e:
            logger.error(f"Gemini suggest_title error: {e}")
            return "Untitled"

    async def proofread(self, text: str) -> str:
        prompt = f"""
        Proofread the following Arabic text for grammar, spelling, and formal government tone.
        Return ONLY the corrected text.

        Text: "{text}"
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini proofread error: {e}")
            return text

    async def generate_embedding(self, text: str, target_dim: int = 1024) -> dict:
        """
        Generate text embedding using Gemini embedding model.
        Returns dict with embedding vector and model info.

        Args:
            text: Text to embed
            target_dim: Target dimensions (will truncate or pad)

        Returns:
            dict with 'embedding', 'model', 'original_dim'
        """
        try:
            model_name = "models/embedding-001"
            result = genai.embed_content(
                model=model_name,
                content=text,
                task_type="retrieval_document"
            )
            embedding = result['embedding']
            original_dim = len(embedding)

            # Normalize to target dimensions
            if len(embedding) > target_dim:
                # Truncate (loses some information but maintains compatibility)
                embedding = embedding[:target_dim]
            elif len(embedding) < target_dim:
                # Pad with zeros
                embedding = embedding + [0.0] * (target_dim - len(embedding))

            return {
                'embedding': embedding,
                'model': f"gemini/{model_name}",
                'original_dim': original_dim,
                'target_dim': target_dim
            }
        except Exception as e:
            logger.error(f"Gemini generate_embedding error: {e}")
            raise
