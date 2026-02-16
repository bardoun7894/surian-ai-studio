
# Embedding System & AI Integration

## Overview

This document describes the semantic search embedding system (FR-36) and AI integration for the MOE platform. The system uses vector embeddings to enable intelligent content search that understands meaning, not just keywords.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Laravel API    │────▶│   AI Service    │
│   (Next.js)     │     │   (Backend)     │     │   (FastAPI)     │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │   PostgreSQL    │     │  Gemini/OpenAI  │
                        │   + pgvector    │     │  or Local Model │
                        └─────────────────┘     └─────────────────┘
```

## Components

### 1. AI Service (FastAPI)

**Location:** `ai-service/`

**Endpoints:**
- `POST /api/v1/ai/embeddings` - Generate text embeddings
- `POST /api/v1/ai/chat` - Chat with AI assistant
- `POST /api/v1/ai/analyze-complaint` - Classify complaints
- `POST /api/v1/ai/summarize` - Summarize text
- `POST /api/v1/ai/suggest-title` - Suggest titles
- `POST /api/v1/ai/proofread` - Proofread Arabic text
- `POST /api/v1/ai/ocr` - Extract text from images

**Configuration (`ai-service/.env`):**
```env
# AI Provider
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key

# Embedding Settings
EMBEDDING_PROVIDER=gemini
EMBEDDING_MODEL=models/embedding-001
EMBEDDING_DIMENSIONS=1024
```

### 2. Laravel VectorSearchService

**Location:** `backend/app/Services/VectorSearchService.php`

**Key Methods:**
```php
// Perform semantic search
$results = $vectorSearch->semanticSearch($query, $limit);

// Generate embedding for text
$result = $vectorSearch->generateEmbedding($text);

// Update content embeddings
$vectorSearch->updateContentEmbedding($content);

// Batch update all embeddings
$vectorSearch->updateAllEmbeddings($batchSize);

// Get statistics
$stats = $vectorSearch->getStats();

// Clear all embeddings (before model change)
$vectorSearch->clearAllEmbeddings();
```

### 3. Database Schema (pgvector)

**Migration:** `database/migrations/2026_01_16_190000_add_vector_search_support.php`

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add columns to contents table
ALTER TABLE contents ADD COLUMN embedding vector(1024);
ALTER TABLE contents ADD COLUMN embedding_model VARCHAR(100);
ALTER TABLE contents ADD COLUMN embedding_updated_at TIMESTAMP;

-- Create similarity search index
CREATE INDEX contents_embedding_idx
ON contents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## Embedding Model Compatibility

### Important: Embeddings Are NOT Compatible Between Models

Different AI models produce embeddings in different semantic spaces. Even if dimensions match, embeddings from different models cannot be mixed.

| Model | Dimensions | Notes |
|-------|------------|-------|
| Gemini embedding-001 | 768 | Google's model |
| OpenAI ada-002 | 1536 | OpenAI's model |
| BGE-M3 | 1024 | Multilingual, good for Arabic |
| E5-large-v2 | 1024 | High quality |
| MiniLM | 384 | Fast, smaller |

### Dimension Normalization

The system normalizes all embeddings to a target dimension (default: 1024):
- **Truncation:** If model produces more dimensions, truncate to target
- **Padding:** If model produces fewer dimensions, pad with zeros

This allows switching models without changing database schema, but **all embeddings must be regenerated**.

## Artisan Commands

### Update Embeddings

```bash
# Update all content embeddings
php artisan content:update-embeddings

# With custom batch size
php artisan content:update-embeddings --batch=100

# Show statistics only
php artisan content:update-embeddings --stats

# Clear all embeddings (use before changing models)
php artisan content:update-embeddings --clear
```

### Scheduled Tasks

Embeddings are automatically updated nightly via Laravel scheduler:

```php
// routes/console.php
Schedule::command('content:update-embeddings --batch=100')
    ->dailyAt('02:00')
    ->withoutOverlapping();
```

## Changing Embedding Models

### Step-by-Step Guide

1. **Update AI Service Configuration**
   ```env
   # ai-service/.env
   EMBEDDING_PROVIDER=openai  # or 'local'
   EMBEDDING_MODEL=text-embedding-ada-002
   ```

2. **Clear Existing Embeddings**
   ```bash
   php artisan content:update-embeddings --clear
   ```

3. **Regenerate All Embeddings**
   ```bash
   php artisan content:update-embeddings --batch=100
   ```

4. **Verify**
   ```bash
   php artisan content:update-embeddings --stats
   ```

### Adding a New Provider

1. Create new provider class in `ai-service/app/services/`:

```python
# ai-service/app/services/local_provider.py
from sentence_transformers import SentenceTransformer
from .provider import AIProvider

class LocalEmbeddingProvider(AIProvider):
    def __init__(self):
        self.model = SentenceTransformer('BAAI/bge-m3')

    async def generate_embedding(self, text: str, target_dim: int = 1024) -> dict:
        embedding = self.model.encode(text).tolist()

        # Normalize dimensions
        if len(embedding) > target_dim:
            embedding = embedding[:target_dim]
        elif len(embedding) < target_dim:
            embedding = embedding + [0.0] * (target_dim - len(embedding))

        return {
            'embedding': embedding,
            'model': 'local/bge-m3',
            'original_dim': len(self.model.encode(text)),
            'target_dim': target_dim
        }
```

2. Update provider factory in `ai-service/app/main.py`

## Search API

### Endpoint

```
GET /api/v1/public/search?q=query&semantic=true
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| q | string | required | Search query |
| semantic | boolean | true | Enable semantic search |

### Response

```json
{
  "results": [
    {
      "id": "1",
      "title": "عنوان المحتوى",
      "type": "news",
      "excerpt": "ملخص المحتوى...",
      "url": "/news/1",
      "similarity": 0.85
    }
  ],
  "total": 1,
  "search_type": "semantic"
}
```

### Search Types

- `semantic`: Vector similarity search (when pgvector available and embeddings exist)
- `text`: Traditional LIKE-based search (fallback)
- `none`: Query too short (< 2 characters)

## Performance Considerations

### Index Tuning

The IVFFlat index uses `lists = 100` by default. For larger datasets:

```sql
-- For ~1M rows, use lists = 1000
CREATE INDEX contents_embedding_idx
ON contents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 1000);
```

### Similarity Threshold

The default similarity threshold is 0.5. Adjust in `VectorSearchService.php`:

```php
return collect($results)->filter(function ($item) {
    return $item->similarity > 0.5;  // Adjust threshold
});
```

### Batch Processing

For large content updates, use smaller batches to avoid memory issues:

```bash
php artisan content:update-embeddings --batch=25
```

## Troubleshooting

### pgvector Not Available

```
Error: pgvector extension is not available
```

**Solution:** Install pgvector in PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt install postgresql-15-pgvector

# Or compile from source
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make && sudo make install
```

### Embeddings Not Updating

Check AI service connectivity:
```bash
curl http://ai-service:8000/health
```

Check logs:
```bash
tail -f storage/logs/embeddings.log
```

### Search Returns No Results

1. Check if embeddings exist:
   ```bash
   php artisan content:update-embeddings --stats
   ```

2. Check if model matches:
   ```sql
   SELECT DISTINCT embedding_model FROM contents WHERE embedding IS NOT NULL;
   ```

3. Lower similarity threshold temporarily for testing

## Recommended Open-Source Models for Arabic

| Model | Size | Arabic Support | Notes |
|-------|------|----------------|-------|
| BAAI/bge-m3 | 2.3GB | Excellent | Best multilingual |
| intfloat/multilingual-e5-large | 2.2GB | Good | Balanced |
| sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 | 471MB | Good | Lightweight |
| aubmindlab/bert-base-arabertv2 | 504MB | Native | Arabic-specific |

## Environment Variables

### Laravel Backend

```env
# backend/.env
AI_SERVICE_URL=http://ai-service:8000
AI_SERVICE_TIMEOUT=30
AI_EMBEDDING_DIMENSIONS=1024
```

### AI Service

```env
# ai-service/.env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key

EMBEDDING_PROVIDER=gemini
EMBEDDING_MODEL=models/embedding-001
EMBEDDING_DIMENSIONS=1024
```

## Related Files

- `backend/app/Services/VectorSearchService.php` - Main search service
- `backend/app/Services/AIService.php` - AI integration for complaints
- `backend/app/Console/Commands/UpdateContentEmbeddings.php` - CLI command
- `backend/app/Http/Controllers/Api/PublicApiController.php` - Search endpoint
- `ai-service/app/main.py` - FastAPI endpoints
- `ai-service/app/services/gemini_provider.py` - Gemini implementation
- `ai-service/app/services/provider.py` - Provider interface
- `ai-service/app/config.py` - AI service configuration
