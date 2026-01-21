import pytesseract
from PIL import Image
import io
import logging

logger = logging.getLogger("uvicorn")

class OCRService:
    @staticmethod
    def extract_text(file_bytes: bytes) -> str:
        try:
            image = Image.open(io.BytesIO(file_bytes))
            # Language: Arabic + English
            text = pytesseract.image_to_string(image, lang='ara+eng')
            return text.strip()
        except Exception as e:
            logger.error(f"OCR Error: {e}")
            return ""
