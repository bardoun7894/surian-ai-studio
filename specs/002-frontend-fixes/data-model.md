# Data Model: Frontend UI Fixes and Improvements

**Feature**: 002-frontend-fixes
**Date**: 2026-01-29

## Overview

This feature is primarily frontend UI fixes. No new database tables are required. The only data model consideration is the existing `ComplaintTemplate` model which needs to be exposed via API for the complaint template dropdown (Task 13).

## Existing Entities (No Changes)

### User
- Already has email field (editable via new endpoint)
- Already has 2FA support fields
- No schema changes needed

### Complaint
- Already has complaint type (identified/anonymous)
- No schema changes needed

### Content (News, Announcements, FAQs)
- Already supports multiple content types
- Content updates done via seeders/admin panel
- No schema changes needed

## Entity Used by New Feature: ComplaintTemplate

**Purpose**: Predefined complaint submission templates that users select from a dropdown before entering complaint details.

| Field | Description |
|-------|-------------|
| id | Unique identifier |
| name_ar | Template name in Arabic |
| name_en | Template name in English |
| description_ar | Template description in Arabic |
| description_en | Template description in English |
| type | Template type (e.g., "open", "structured") |
| is_active | Whether template is available for selection |
| requires_identification | Whether template requires identified (non-anonymous) user |
| fields | JSON schema of additional fields (for structured templates) |
| sort_order | Display order in dropdown |

**Key Business Rules**:
- Templates with `type = "open"` have `requires_identification = true` (not available for anonymous complaints)
- Only templates with `is_active = true` appear in the dropdown
- The frontend filters templates based on the selected complaint type (anonymous removes open template)

## Frontend State Changes

### ThemeContext
- Dark mode background: `#094239` → `#000000`
- Dark mode foreground: remains `#EDEBE0`

### LanguageContext
- New translation keys added for:
  - Registration error messages (Arabic)
  - Newsletter subscription errors (Arabic)
  - Complaint form errors (Arabic)
  - General error messages (Arabic)
  - News page content (English)
  - Complaints/Suggestions content (English)
  - FAQ content (English/Arabic updates)
  - Label changes ("Track Request Status" → "Track Complaint Status")
  - Section renames ("Announcements and Notifications" → "Announcements")

### AuthContext
- 2FA flow updated to redirect to dedicated `/two-factor` page
- No state schema changes
