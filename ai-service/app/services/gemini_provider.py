from google import genai
from .provider import AIProvider
from typing import Dict, Any
import os
import json
import logging
from app.config import settings

logger = logging.getLogger("uvicorn")


class GeminiProvider(AIProvider):
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment")

        self.client = genai.Client(api_key=api_key) if api_key else None
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    async def generate_content(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
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
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            cleaned_text = (
                response.text.strip().replace("```json", "").replace("```", "")
            )
            return json.loads(cleaned_text)
        except Exception as e:
            logger.error(f"Gemini analyze_complaint error: {e}")
            return {
                "category": "Other",
                "priority": "Medium",
                "summary": "Analysis failed",
            }

    async def suggest_title(self, text: str) -> str:
        prompt = f"""
        Suggest a formal, concise title for a government announcement or article based on the following text.
        Return ONLY the title text, nothing else.

        Text: "{text[:1000]}..."
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            return response.text.strip().replace('"', "")
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
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini proofread error: {e}")
            return text

    async def generate_embedding(self, text: str, target_dim: int = 1024) -> dict:
        """
        Generate text embedding using Gemini embedding model.
        """
        try:
            configured_model = settings.EMBEDDING_MODEL or "models/embedding-001"
            candidate_models = [
                configured_model,
                "models/gemini-embedding-001",
                "gemini-embedding-001",
                "models/embedding-001",
                "models/text-embedding-004",
                "embedding-001",
                "text-embedding-004",
            ]

            # Keep order while removing duplicates
            candidate_models = list(dict.fromkeys(candidate_models))

            result = None
            model_name = None
            last_error = None

            for candidate in candidate_models:
                try:
                    result = self.client.models.embed_content(
                        model=candidate,
                        contents=text,
                    )
                    model_name = candidate
                    break
                except Exception as embed_error:
                    last_error = embed_error
                    logger.warning(
                        f"Embedding model '{candidate}' failed: {embed_error}"
                    )

            if result is None or model_name is None:
                raise last_error or RuntimeError("No embedding model succeeded")

            embedding = result.embeddings[0].values
            original_dim = len(embedding)

            # Normalize to target dimensions
            if len(embedding) > target_dim:
                embedding = list(embedding[:target_dim])
            elif len(embedding) < target_dim:
                embedding = list(embedding) + [0.0] * (target_dim - len(embedding))
            else:
                embedding = list(embedding)

            return {
                "embedding": embedding,
                "model": f"gemini/{model_name}",
                "original_dim": original_dim,
                "target_dim": target_dim,
            }
        except Exception as e:
            logger.error(f"Gemini generate_embedding error: {e}")
            raise
