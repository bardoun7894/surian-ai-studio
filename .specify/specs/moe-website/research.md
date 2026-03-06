# Research: MOE Website - Final 2 Gaps

**Date**: 2026-01-26 | **Plan**: [plan.md](./plan.md)

## Summary

All technical research complete. No unknowns remain - both features use existing infrastructure.

## Feature 1: Print Complaint Button (FR-28)

### Existing Infrastructure

**Backend PDF Endpoint**:
- Route: `GET /api/v1/complaints/{trackingNumber}/pdf`
- File: `backend/routes/api.php` (line 45)
- Controller: `ComplaintController::printPdf()`
- Library: `barryvdh/laravel-dompdf` (verified in `composer.json`)
- View: `resources/views/complaints/print.blade.php`

**Frontend API**:
- Repository file has `API.complaints.track()` for fetching complaint details
- Need to add simple `downloadPdf(trackingNumber)` method

### Implementation Decision

**Decision**: Create standalone `ComplaintPrintButton.tsx` component

**Rationale**:
- Reusable across tracking page and potential admin views
- Encapsulates PDF download logic
- Follows existing component patterns

**Alternatives Considered**:
- Inline button in ComplaintPortal - rejected due to reusability
- Server-side print page - rejected, PDF endpoint already exists

### Technical Approach

```typescript
// Simple PDF download via existing endpoint
const downloadPdf = async (trackingNumber: string) => {
  const response = await fetch(`/api/v1/complaints/${trackingNumber}/pdf`);
  const blob = await response.blob();
  // Create download link
};
```

## Feature 2: AI Content Tools (FR-14)

### Existing Infrastructure

**Frontend AI Service** (`frontend-next/src/lib/aiService.ts`):
- `aiService.proofread(text)` - returns corrected text
- `aiService.summarize(text)` - returns summary
- `aiService.suggestTitle(text)` - returns suggested title

**AI Service Routes** (via Next.js proxy to FastAPI):
- `POST /ai/proofread` - Grammar/spelling correction
- `POST /ai/summarize` - Text summarization
- `POST /ai/suggest-title` - Title generation

**Content Editor** (`frontend-next/src/app/admin/content/page.tsx`):
- Has `formData.content_ar` and `formData.content_en` fields
- Modal-based create/edit forms
- Already imports `Loader2` for loading states

### Implementation Decision

**Decision**: Create `AIContentTools.tsx` component with 3 buttons + results panel

**Rationale**:
- Clean separation of AI functionality
- Can be embedded in existing form modals
- Reusable for both Arabic and English content fields

**Alternatives Considered**:
- Inline buttons directly in page.tsx - rejected for cleaner code
- AI toolbar as Filament component - rejected, using Next.js admin
- Auto-apply results - rejected, user should review before accepting

### Technical Approach

```typescript
interface AIContentToolsProps {
  content: string;
  language: 'ar' | 'en';
  onProofreadResult: (text: string) => void;
  onSummarizeResult: (summary: string) => void;
  onTitleSuggestion: (title: string) => void;
}

// Component shows 3 buttons with loading states
// Results appear in collapsible panels below buttons
// User can accept/reject each suggestion
```

### Language Detection

Arabic content detection pattern (from existing codebase):
```typescript
const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
```

## Dependencies Verified

| Dependency | Version | Purpose | Status |
|------------|---------|---------|--------|
| barryvdh/laravel-dompdf | ^2.0 | PDF generation | ✅ Installed |
| sonner | ^1.x | Toast notifications | ✅ Installed |
| lucide-react | latest | Icons | ✅ Installed |
| Next.js proxy | 14.x | AI service routing | ✅ Configured |

## No Further Research Needed

All technical decisions are straightforward:
1. PDF download uses existing endpoint
2. AI tools use existing service methods
3. UI follows existing patterns in the codebase
