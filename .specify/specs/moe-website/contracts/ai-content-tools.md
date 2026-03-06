# API Contract: AI Content Tools (FR-14)

## Existing Endpoints (via Next.js proxy to FastAPI)

### POST /ai/proofread

**Purpose**: Grammar and spelling correction for Arabic/English text

#### Request

```json
POST /ai/proofread
Content-Type: application/json

{
  "text": "النص المراد تدقيقه لغوياً"
}
```

#### Response

```json
{
  "corrected_text": "النص المصحح لغوياً",
  "changes": [
    { "original": "المراد", "corrected": "المُراد", "type": "spelling" }
  ]
}
```

---

### POST /ai/summarize

**Purpose**: Generate concise summary of content

#### Request

```json
POST /ai/summarize
Content-Type: application/json

{
  "text": "محتوى طويل يحتاج إلى تلخيص..."
}
```

#### Response

```json
{
  "summary": "ملخص المحتوى في جملة أو جملتين"
}
```

---

### POST /ai/suggest-title

**Purpose**: Generate title suggestions for content

#### Request

```json
POST /ai/suggest-title
Content-Type: application/json

{
  "text": "محتوى المقال أو الخبر..."
}
```

#### Response

```json
{
  "title": "العنوان المقترح",
  "alternatives": [
    "عنوان بديل 1",
    "عنوان بديل 2"
  ]
}
```

## Frontend Component Contract

### AIContentTools

```typescript
interface AIContentToolsProps {
  /** The text content to process */
  content: string;
  /** Current language of the content */
  language: 'ar' | 'en';
  /** Callback when proofread result is accepted */
  onAcceptProofread?: (correctedText: string) => void;
  /** Callback when summary is generated */
  onAcceptSummary?: (summary: string) => void;
  /** Callback when title suggestion is accepted */
  onAcceptTitle?: (title: string) => void;
  /** Optional additional CSS classes */
  className?: string;
}
```

**UI Structure**:
```
┌──────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ تدقيق    │  │ تلخيص    │  │ اقتراح عناوين    │   │
│  │ لغوي     │  │          │  │                  │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ نتيجة التدقيق اللغوي:                        │   │
│  │ "النص المصحح هنا..."                          │   │
│  │                                              │   │
│  │  [تطبيق]  [تجاهل]                             │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

**States per Tool**:
- `idle`: Button enabled
- `loading`: Spinner shown, button disabled
- `result`: Result panel shown with Accept/Reject buttons
- `error`: Error message with retry option

## Integration Points

### Content Create/Edit Modal

Insert AIContentTools below Arabic content textarea:

```tsx
{/* After content_ar textarea (around line 569) */}
<AIContentTools
  content={formData.content_ar}
  language="ar"
  onAcceptProofread={(text) => setFormData({ ...formData, content_ar: text })}
  onAcceptSummary={(summary) => {
    // Could auto-fill a summary field or show in alert
    alert(`ملخص: ${summary}`);
  }}
  onAcceptTitle={(title) => setFormData({ ...formData, title_ar: title })}
/>
```

Similarly for English content if present.

## Error Handling

| Error | User Message (AR) | User Message (EN) |
|-------|-------------------|-------------------|
| Network Error | فشل الاتصال بخدمة الذكاء الاصطناعي | AI service connection failed |
| Empty Content | الرجاء إدخال محتوى للمعالجة | Please enter content to process |
| Rate Limited | الرجاء الانتظار قبل المحاولة مجدداً | Please wait before trying again |
| Service Error | حدث خطأ، الرجاء المحاولة لاحقاً | An error occurred, please try later |

## Minimum Content Requirements

| Tool | Min Characters | Rationale |
|------|----------------|-----------|
| Proofread | 10 | Need meaningful text |
| Summarize | 100 | Need enough content to summarize |
| Suggest Title | 50 | Need context for title generation |
