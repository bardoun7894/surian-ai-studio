# Data Model: Ministry Portal Comprehensive Amendments

**Feature**: 005-ministry-frontend-fixes
**Date**: 2026-02-10

## New Entities

### Favorite

Polymorphic relationship linking users to favorited content.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | bigint (PK) | auto-increment | Primary key |
| user_id | bigint (FK) | references users(id), NOT NULL | User who favorited |
| content_type | string | NOT NULL, enum: news, announcement, service, law | Type of favorited content |
| content_id | string | NOT NULL | ID of the favorited content |
| created_at | timestamp | NOT NULL | When favorited |

**Indexes**: unique(user_id, content_type, content_id), index(user_id)
**Validation**: User must be authenticated. Cannot favorite same item twice (unique constraint).

### DirectorateLocation (extension to existing Directorate)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| latitude | decimal(10,7) | nullable | Geographic latitude |
| longitude | decimal(10,7) | nullable | Geographic longitude |
| address_ar | text | nullable | Arabic address |
| address_en | text | nullable | English address |

**Note**: Added as columns to existing `directorates` table, not a new table.

## Modified Entities

### Ticket (Complaint)

**Status field update**: Restrict to valid statuses only.

| Status Value | Arabic Label | English Label |
|-------------|-------------|---------------|
| received | واردة | Received |
| in_progress | قيد المعالجة | In Progress |
| completed | منتهية / تم الرد عليها | Completed / Responded |

**State transitions**:
```
received → in_progress → completed
```

No backward transitions allowed. Only authorized staff can change status.

### Complaint Rating (extension)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| submission_rating | integer | nullable, 1-5 | Rating at submission time |
| resolution_rating | integer | nullable, 1-5 | Rating when resolved |
| submission_rating_comment | text | nullable | Comment at submission |
| resolution_rating_comment | text | nullable | Comment at resolution |

**Note**: Added as columns to existing `complaints` table.

### User Profile (no schema change)

- Complaint tracking section: REMOVED from UI (already done)
- Latest complaints section: REMOVED from UI (already done)
- SMS notification section: REMOVED from UI (already done)
- Favorites section: NEW in UI, reads from Favorite entity
- Password change: Already requires current password (verified)

### Setting (admin-configurable)

Existing `settings` table with key-value pairs. New keys needed:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| investment_section_enabled | boolean | true | Toggle investment section visibility |
| complaint_rules_ar | text | '' | Arabic complaint submission rules |
| complaint_rules_en | text | '' | English complaint submission rules |
| suggestion_rules_ar | text | '' | Arabic suggestion submission rules |
| suggestion_rules_en | text | '' | English suggestion submission rules |

### SubDirectorate (existing type extension)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| description | LocalizedString | nullable | Sub-directorate description |
| contact_phone | string | nullable | Direct phone number |
| contact_email | string | nullable | Direct email |
| working_hours | string | nullable | Working hours text |

## Existing Entities (no changes)

- **NewsItem**: No schema changes. Translation fields (title_en, content_en) already exist.
- **FAQ**: No schema changes. question_en/answer_en fields already exist. Content update (item 9) is admin data change.
- **MediaItem**: No schema changes. URL field supports both YouTube and direct video URLs.
- **Announcement**: No schema changes. Translation handled at display level.
- **Service**: No schema changes.
- **Decree**: No schema changes.
