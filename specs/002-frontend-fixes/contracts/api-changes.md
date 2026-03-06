# API Contract Changes: Frontend UI Fixes

**Feature**: 002-frontend-fixes
**Date**: 2026-01-29

## Summary

Minimal API changes required. Most fixes are frontend-only. Two new endpoints needed, plus one existing endpoint fix.

---

## New Endpoints

### 1. GET /api/v1/public/complaint-templates

**Purpose**: List available complaint templates for the submission dropdown (Task 13)

**Authentication**: None (public endpoint)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | No | Filter by template type ("open", "structured") |
| anonymous | boolean | No | If true, excludes templates requiring identification |

**Response** (200):
```json
{
  "data": [
    {
      "id": 1,
      "name": "شكوى مفتوحة",
      "name_en": "Open Complaint",
      "description": "نموذج الشكوى المفتوح لإدخال تفاصيل حرة",
      "description_en": "Open complaint form for free-text details",
      "type": "open",
      "requires_identification": true,
      "fields": null,
      "sort_order": 1
    },
    {
      "id": 2,
      "name": "شكوى تجارية",
      "name_en": "Commercial Complaint",
      "description": "نموذج شكوى تجارية",
      "description_en": "Commercial complaint template",
      "type": "structured",
      "requires_identification": false,
      "fields": [
        { "name": "business_name", "label": "اسم المنشأة", "type": "text", "required": true },
        { "name": "license_number", "label": "رقم الترخيص", "type": "text", "required": false }
      ],
      "sort_order": 2
    }
  ]
}
```

**Error Responses**:
- 500: Internal server error (generic message)

---

### 2. PUT /api/v1/users/email

**Purpose**: Update user email address with verification (Task 43)

**Authentication**: Required (Sanctum bearer token)

**Request Body**:
```json
{
  "email": "new-email@example.com",
  "password": "current_password"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format, unique in users table |
| password | string | Yes | Must match current user password |

**Response** (200):
```json
{
  "message": "تم إرسال رمز التحقق إلى بريدك الإلكتروني الجديد",
  "message_en": "Verification code sent to your new email",
  "requires_verification": true
}
```

**Error Responses**:
- 401: Unauthorized (invalid token)
- 422: Validation error (invalid email, email already exists, wrong password)
- 429: Rate limited

---

### 3. POST /api/v1/users/email/verify

**Purpose**: Verify new email address with OTP code (Task 43)

**Authentication**: Required (Sanctum bearer token)

**Request Body**:
```json
{
  "code": "123456"
}
```

**Response** (200):
```json
{
  "message": "تم تحديث البريد الإلكتروني بنجاح",
  "message_en": "Email updated successfully",
  "user": {
    "id": 1,
    "email": "new-email@example.com"
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 422: Invalid or expired code
- 429: Rate limited

---

## Existing Endpoint Fixes

### GET /api/v1/public/news/{id}

**Issue**: Returns 404 or error when article ID is valid (Task 16)

**Expected Fix**: Verify the endpoint correctly resolves article by ID and returns full article data including content body, attachments, and metadata.

**Current Response (broken)**:
```json
{
  "error": "الخبر غير موجود"
}
```

**Expected Response (fixed)** (200):
```json
{
  "data": {
    "id": 123,
    "title": "...",
    "title_en": "...",
    "content": "...",
    "content_en": "...",
    "image": "...",
    "published_at": "2026-01-15T10:00:00Z",
    "directorate": {
      "id": 1,
      "name": "..."
    },
    "attachments": []
  }
}
```

---

## No Changes Required

The following existing endpoints are used as-is:
- `GET /api/v1/public/news` — News listing
- `GET /api/v1/public/directorates` — Directorates listing
- `GET /api/v1/public/announcements` — Announcements listing
- `GET /api/v1/public/services` — Services listing
- `GET /api/v1/public/faqs` — FAQ listing
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/register` — Registration
- `POST /api/v1/auth/two-factor/verify` — 2FA verification (existing)
- `POST /api/v1/complaints` — Submit complaint
- `POST /api/v1/suggestions` — Submit suggestion
- `GET /api/v1/public/settings` — Site settings
