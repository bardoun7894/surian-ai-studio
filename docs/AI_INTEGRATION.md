# AI Integration Guide

## Overview

The MOE platform integrates AI capabilities through a dedicated FastAPI microservice. This document covers all AI features including complaint classification, chat assistant, content tools, and semantic search.

## AI Service Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI Service (FastAPI)                      │
│                        Port: 8000                                │
├─────────────────────────────────────────────────────────────────┤
│  Providers                                                       │
│  ├── GeminiProvider (default)                                   │
│  ├── OpenAIProvider (optional)                                  │
│  └── LocalProvider (for open-source models)                     │
├─────────────────────────────────────────────────────────────────┤
│  Endpoints                                                       │
│  ├── /api/v1/ai/chat              - Conversational AI           │
│  ├── /api/v1/ai/analyze-complaint - Complaint classification    │
│  ├── /api/v1/ai/embeddings        - Vector embeddings           │
│  ├── /api/v1/ai/summarize         - Text summarization          │
│  ├── /api/v1/ai/suggest-title     - Title generation            │
│  ├── /api/v1/ai/proofread         - Arabic proofreading         │
│  └── /api/v1/ai/ocr               - Image text extraction       │
└─────────────────────────────────────────────────────────────────┘
```

## Features

### 1. Complaint Classification (FR-19)

Automatically classifies citizen complaints by:
- **Category/Directorate**: Routes to appropriate department
- **Priority**: High, Medium, Low based on urgency
- **Summary**: One-sentence Arabic summary
- **Keywords**: Extracted for searchability

**Laravel Integration:**
```php
// backend/app/Services/AIService.php
$analysis = $this->aiService->classifyComplaint($complaint);
// Returns: ['directorate', 'priority', 'summary', 'keywords', 'confidence']
```

**Fallback Classification:**
When AI service is unavailable, keywords-based fallback is used:
```php
protected function fallbackClassification(Complaint $complaint): array
{
    $text = strtolower($complaint->description);

    // Keyword matching for directorates
    if (str_contains($text, 'تجارة') || str_contains($text, 'سعر')) {
        return ['directorate' => 'trade', 'priority' => 'medium', ...];
    }
    // ... more rules
}
```

### 2. Chat Assistant (FR-31 to FR-35)

AI-powered chatbot for citizen assistance:
- Answers questions about ministry services
- Guides users to appropriate directorates
- Explains complaint procedures
- Provides information about decrees and news

**System Prompt (Arabic-first):**
```
أنت مساعد ذكي لوزارة الاقتصاد والصناعة في سوريا.
مهمتك هي مساعدة المواطنين والزوار في:
- الإجابة على الأسئلة حول خدمات الوزارة
- توجيههم للمديريات المختصة
- شرح إجراءات الشكاوى والخدمات
- تقديم معلومات عن القرارات والأخبار
```

**API Usage:**
```bash
POST /api/v1/chat/message
{
  "session_id": "uuid",
  "message": "كيف أقدم شكوى؟"
}
```

### 3. Semantic Search (FR-36)

Vector-based content search using embeddings. See [EMBEDDING_SYSTEM.md](./EMBEDDING_SYSTEM.md) for details.

### 4. Content Tools

#### Summarization
```bash
POST /api/v1/ai/summarize
{"text": "النص الطويل هنا..."}
# Returns: {"summary": "ملخص النص"}
```

#### Title Suggestion
```bash
POST /api/v1/ai/suggest-title
{"text": "محتوى المقال..."}
# Returns: {"title": "العنوان المقترح"}
```

#### Proofreading
```bash
POST /api/v1/ai/proofread
{"text": "نص يحتاج تصحيح"}
# Returns: {"corrected_text": "النص المصحح"}
```

#### OCR
```bash
POST /api/v1/ai/ocr
# Form data with file upload
# Returns: {"text": "النص المستخرج من الصورة"}
```

## Configuration

### AI Service Environment

```env
# ai-service/.env

# General Settings
DEBUG=false
SERVICE_NAME=moe-ai-service

# Provider Selection
AI_PROVIDER=gemini  # Options: gemini, openai, local

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# OpenAI Configuration (if using)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# Embedding Configuration
EMBEDDING_PROVIDER=gemini
EMBEDDING_MODEL=models/embedding-001
EMBEDDING_DIMENSIONS=1024

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Chat Settings
MAX_CONVERSATION_HISTORY=20
MAX_INPUT_LENGTH=4000
```

### Laravel Backend Environment

```env
# backend/.env

# AI Service Connection
AI_SERVICE_URL=http://ai-service:8000
AI_SERVICE_TIMEOUT=30
AI_EMBEDDING_DIMENSIONS=1024
```

## Provider Implementation

### Adding a New Provider

1. **Create Provider Class:**

```python
# ai-service/app/services/new_provider.py
from .provider import AIProvider
from typing import Dict, Any

class NewProvider(AIProvider):
    def __init__(self):
        # Initialize your model/client
        pass

    async def generate_content(self, prompt: str) -> str:
        # Implement text generation
        pass

    async def analyze_complaint(self, text: str) -> Dict[str, Any]:
        # Implement complaint analysis
        # Return: {category, priority, summary}
        pass

    async def suggest_title(self, text: str) -> str:
        # Implement title suggestion
        pass

    async def proofread(self, text: str) -> str:
        # Implement proofreading
        pass

    async def generate_embedding(self, text: str, target_dim: int = 1024) -> Dict[str, Any]:
        # Implement embedding generation
        # Return: {embedding, model, original_dim, target_dim}
        pass
```

2. **Register in Factory:**

```python
# ai-service/app/main.py
def get_ai_provider() -> AIProvider:
    provider = os.getenv('AI_PROVIDER', 'gemini')
    if provider == 'gemini':
        return GeminiProvider()
    elif provider == 'openai':
        return OpenAIProvider()
    elif provider == 'local':
        return LocalProvider()
    else:
        raise ValueError(f"Unknown provider: {provider}")
```

### Using Local/Open-Source Models

For production without API costs, use local models:

```python
# ai-service/app/services/local_provider.py
from transformers import pipeline
from sentence_transformers import SentenceTransformer

class LocalProvider(AIProvider):
    def __init__(self):
        # For text generation (Arabic support)
        self.generator = pipeline(
            "text-generation",
            model="aubmindlab/aragpt2-mega"
        )

        # For embeddings
        self.embedder = SentenceTransformer('BAAI/bge-m3')

    async def generate_content(self, prompt: str) -> str:
        result = self.generator(prompt, max_length=500)
        return result[0]['generated_text']

    async def generate_embedding(self, text: str, target_dim: int = 1024) -> dict:
        embedding = self.embedder.encode(text).tolist()
        # Normalize dimensions...
        return {'embedding': embedding, 'model': 'local/bge-m3', ...}
```

**Requirements for local models:**
```txt
# ai-service/requirements.txt
torch>=2.0.0
transformers>=4.30.0
sentence-transformers>=2.2.0
```

## Laravel Services

### AIService

```php
// backend/app/Services/AIService.php

class AIService
{
    // Classify complaint with AI
    public function classifyComplaint(Complaint $complaint): array;

    // Generate chat response
    public function chat(string $message, array $history = []): string;

    // Summarize text
    public function summarize(string $text): string;

    // Suggest title
    public function suggestTitle(string $text): string;

    // Proofread text
    public function proofread(string $text): string;
}
```

### ComplaintService Integration

```php
// backend/app/Services/ComplaintService.php

public function createComplaint(array $data, array $files = []): Complaint
{
    $complaint = Complaint::create([...]);

    // AI Classification (FR-19)
    $this->classifyWithAI($complaint);

    // Notify staff (FR-44)
    $this->notificationService->notifyNewComplaint($complaint);

    return $complaint;
}

protected function classifyWithAI(Complaint $complaint): void
{
    try {
        $analysis = $this->aiService->classifyComplaint($complaint);

        if ($analysis['priority'] === 'high') {
            $complaint->update(['priority' => 'high']);
        }

        $complaint->update([
            'ai_category' => $analysis['directorate'],
            'ai_summary' => $analysis['summary'],
            'ai_keywords' => $analysis['keywords'],
            'ai_confidence' => $analysis['confidence'],
        ]);
    } catch (\Exception $e) {
        Log::error("AI classification failed: {$e->getMessage()}");
        // Complaint keeps default values
    }
}
```

## Error Handling

### Graceful Degradation

All AI features have fallback behavior:

| Feature | Fallback Behavior |
|---------|-------------------|
| Complaint Classification | Keyword-based rules |
| Semantic Search | Text-based LIKE search |
| Chat | Error message to user |
| Summarization | Return original text |
| Title Suggestion | Return "Untitled" |
| Proofreading | Return original text |

### Logging

```php
// All AI errors are logged
Log::error("AI service error", [
    'service' => 'classify',
    'complaint_id' => $complaint->id,
    'error' => $e->getMessage()
]);
```

## Docker Configuration

```yaml
# docker-compose.yml
services:
  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    environment:
      - AI_PROVIDER=gemini
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./ai-service:/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    environment:
      - AI_SERVICE_URL=http://ai-service:8000
```

## Monitoring & Health

### Health Check Endpoint

```bash
GET /health
# Returns: {"status": "ok", "service": "ai-service"}
```

### Metrics to Monitor

- Response time per endpoint
- Error rate
- Token usage (for paid APIs)
- Embedding generation rate
- Cache hit rate

## Security Considerations

1. **API Keys**: Store in environment variables, never in code
2. **Rate Limiting**: Configured per endpoint
3. **Input Validation**: Max input length enforced
4. **Output Sanitization**: AI outputs are sanitized before storage
5. **Audit Logging**: All AI decisions are logged for review

## Cost Optimization

### For Gemini/OpenAI

- Cache frequent queries
- Batch embedding updates (nightly)
- Use smaller models for simple tasks
- Implement request deduplication

### Moving to Open-Source

When costs become significant:
1. Deploy local models on GPU server
2. Use quantized models for efficiency
3. Consider model distillation for specific tasks

## Related Documentation

- [EMBEDDING_SYSTEM.md](./EMBEDDING_SYSTEM.md) - Detailed embedding documentation
- [API.md](./API.md) - Full API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
