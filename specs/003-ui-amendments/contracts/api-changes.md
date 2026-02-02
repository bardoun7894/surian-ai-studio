# API Contract Changes: 003-ui-amendments

**Date**: 2026-02-02

## Overview

Minimal API changes required. Most of the 54 items are pure frontend modifications. Only 3 items require backend API attention.

## Existing Endpoints (No Change Needed)

These endpoints already exist and are used by the frontend:

```
GET  /api/v1/users/me/complaints     # Item 6: Already exists, frontend needs to call it
PUT  /api/v1/users/me                # Item 5: Already accepts current_password field
POST /api/v1/complaints              # Items 38-44: Existing, frontend changes only
POST /api/v1/complaints/track/{id}   # Item 44: Existing tracking endpoint
POST /api/v1/suggestions             # Items 47-49: Existing, frontend validation changes
GET  /api/v1/public/search           # Item 13: Existing, frontend integration fix
```

## Endpoint Fixes Required

### 1. Rating Submission (Item 46)

**Endpoint**: `POST /api/v1/complaints/{id}/rate`

**Current Issue**: Rating always fails. Needs investigation.

**Expected Request**:
```json
{
  "rating": 1-5,
  "comment": "optional string"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Rating submitted successfully"
}
```

**Fix checklist**:
- [ ] Verify route exists in `routes/api.php`
- [ ] Verify controller method handles request correctly
- [ ] Verify CSRF/XSRF token is accepted
- [ ] Verify guest users can rate (anonymous complaints)
- [ ] Verify frontend sends correct payload format

---

### 2. AI Article Summary (Item 33) - New Endpoint

**Endpoint**: `POST /api/v1/ai/summarize`

**Description**: Proxies article content to the FastAPI AI service for summarization. Follows existing AI service proxy pattern.

**Request**:
```json
{
  "content": "string (article body text)",
  "language": "ar" | "en"
}
```

**Response (200)**:
```json
{
  "summary": "string (summarized text)",
  "language": "ar" | "en"
}
```

**Response (503 - AI Service Unavailable)**:
```json
{
  "error": "AI service temporarily unavailable",
  "message": "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً"
}
```

**Notes**:
- This endpoint proxies to FastAPI service at `http://ai-service:8001/summarize`
- Rate limited: 10 requests per minute per user
- No authentication required (public articles)
- Response cached for 1 hour per article ID

---

### 3. Password Change - Current Password Validation (Item 5)

**Endpoint**: `PUT /api/v1/users/me`

**Current behavior**: May not validate `current_password` field.

**Required behavior**: When `password` field is present, `current_password` MUST also be present and validated against the stored hash.

**Request**:
```json
{
  "current_password": "string (required when changing password)",
  "password": "string (new password)",
  "password_confirmation": "string"
}
```

**Response (422 - Validation Error)**:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "current_password": ["The current password is incorrect."]
  }
}
```

---

## Frontend-Only API Usage Changes

These items change how the frontend calls existing endpoints but require no backend modifications:

| Item | Change | Endpoint |
|------|--------|----------|
| 6 | Call existing endpoint to show complaints in profile | `GET /api/v1/users/me/complaints` |
| 13 | Fix search result rendering and re-search | `GET /api/v1/public/search?q={query}` |
| 43 | Clipboard copy (no API involved) | N/A |
| 49 | Frontend validation for national ID (11 digits) | `POST /api/v1/suggestions/track` |

## No New Database Migrations

All API changes work with the existing database schema.
