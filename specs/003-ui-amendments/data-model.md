# Data Model: 003-ui-amendments

**Date**: 2026-02-02

## Overview

The 54 UI amendments are primarily frontend changes. No new database tables or schema migrations are required. The data model changes are limited to:

1. **No new entities** - All items modify existing UI behavior
2. **No schema changes** - Existing tables sufficient
3. **Minor API contract additions** - AI summary endpoint, profile complaints endpoint

## Existing Entities (Referenced)

### Complaint
- Already exists in database
- **UI change**: Remove directorate selection from form (Item 41), remove identity verification section (Item 42), add confirmation message (Item 38)
- **Profile linkage** (Item 6): Uses existing `GET /api/v1/users/me/complaints` endpoint (already defined in repository.ts)
- **No schema change needed**

### Suggestion
- Already exists in database
- **UI change**: National ID validation (11 digits, numbers only) (Item 49), Arabic error messages (Item 48)
- **No schema change needed**

### Rating (SatisfactionRating)
- Already exists in database
- **Fix**: Rating submission endpoint may need debugging (Item 46)
- **No schema change needed**

### Article / News
- Already exists in database
- **New feature**: AI summary (Item 33) - generated on-demand, not stored
- **No schema change needed** (summary is transient, not persisted)

### User Profile
- Already exists in database
- **UI change**: Remove sections (Items 3, 4, 7), require old password (Item 5), show complaints (Item 6)
- **Password change** (Item 5): Backend `PUT /api/v1/users/me` already accepts `current_password` field - frontend needs to send it
- **No schema change needed**

## Translation Keys (New)

Added to `LanguageContext.tsx` translation dictionary:

| Key | Arabic | English | Item |
|-----|--------|---------|------|
| `directorates_subtitle` | (existing Arabic) | (needs English) | 18 |
| `newsletter_subscribed` | (exists) | (needs English) | 24 |
| `directorate_subtitle` | (existing Arabic) | (needs English) | 31 |
| `published_at` | نُشر في | Published at | 34 |
| `time_ago` | منذ {time} | {time} ago | 34 |
| `announcements_title` | الإعلانات | Announcements | 37 |
| `general_form` | النموذج العام | General Form | 40 |
| `suggestion_failed` | فشل في تقديم الاقتراح | Failed to submit suggestion | 48 |
| `copied` | تم النسخ | Copied | 44 |
| `view_all` | عرض الكل | View All | 21 |
| `ai_summary` | ملخص ذكي | AI Summary | 33 |
| `loading_summary` | جاري التلخيص... | Generating summary... | 33 |
| `share` | مشاركة | Share | 25 |
| `link_copied` | تم نسخ الرابط | Link copied | 25 |

## State Changes

### ThemeContext
- No changes to context interface
- CSS variable additions for card gray color: `--color-card-dark: #b3a3d3`

### LanguageContext
- Add ~14 new translation keys (table above)
- No interface changes

### AuthContext
- Add `pending2FA: boolean` state for 2FA flow stability (Item 10)
- Add `cancelLogin(): void` method for tab-switch cancellation (Item 9)

## No Database Migrations Required

All 54 items are achievable with frontend modifications and minor backend logic fixes. The existing database schema supports all required functionality.
