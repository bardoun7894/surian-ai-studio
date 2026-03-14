FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Tesseract OCR and health check
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-ara \
    tesseract-ocr-eng \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create non-root user for security
RUN groupadd -g 1001 aiuser && useradd -u 1001 -g aiuser -s /bin/sh aiuser
RUN chown -R aiuser:aiuser /app

USER aiuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
