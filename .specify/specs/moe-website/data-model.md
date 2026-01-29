# Data Model: MOE Website - Final 2 Gaps

**Date**: 2026-01-26 | **Plan**: [plan.md](./plan.md)

## Summary

No new database entities required. Both features work with existing data models.

## Existing Entities Used

### Complaint (FR-28: Print Button)

```
Entity: Complaint
─────────────────
Fields used by print functionality:
- tracking_number: string (unique) - Used in PDF filename
- full_name: string - Citizen name on PDF
- national_id: string - Citizen ID on PDF
- title: string - Complaint title
- description: text - Complaint details
- status: enum - Current status
- priority: enum - Priority level
- created_at: timestamp - Submission date
- directorate: relationship - Associated directorate name

Relationship: directorate (belongsTo Directorate)
Relationship: responses (hasMany ComplaintResponse) - For resolution info
```

### Content (FR-14: AI Tools)

```
Entity: Content
───────────────
Fields used by AI tools:
- title_ar: string - Arabic title (AI can suggest improvements)
- title_en: string|null - English title
- content_ar: text - Arabic content (AI proofreading/summarization)
- content_en: text|null - English content

No modifications needed - AI tools work on in-memory form data
```

## Database Schema

No migrations required. Existing schema supports all needed functionality:

```sql
-- Existing complaints table (no changes)
-- Existing contents table (no changes)
```

## State Transitions

### Complaint Print Flow

```
[Tracking Result Displayed]
    → [User Clicks Print]
    → [API Call: GET /complaints/{tracking}/pdf]
    → [PDF Downloaded]
```

No state change in database - print is read-only operation.

### AI Content Tools Flow

```
[Content Form Open]
    → [User Clicks AI Tool Button]
    → [API Call to AI Service]
    → [Result Displayed in UI]
    → [User Accepts/Rejects]
    → [If Accepted: Form Field Updated]
```

All changes are in-memory until user saves the form. No intermediate database writes.

## Validation Rules

### Print Button

- `trackingNumber` must exist in database
- User must have verified identity (national_id match) for public access

### AI Tools

- `content` must be non-empty (min 10 characters for meaningful AI processing)
- Language detection automatic based on content
- Results are suggestions only - user controls final content
