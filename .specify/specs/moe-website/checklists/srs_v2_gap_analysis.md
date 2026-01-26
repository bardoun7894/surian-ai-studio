# Checklist: SRS v2.0 Gap Analysis - New Requirements Quality

**Purpose**: Unit tests for requirements quality - validating that NEW SRS v2.0 requirements are complete, clear, and implementation-ready
**Created**: 2026-01-22
**Source**: وثيقة ال SRS v2.pdf (Revision History shows V2 changes dated 21-1-2026)
**Focus Areas**: Suggestions Module, User Satisfaction Rating, Snooze Feature, Notifications, Service Model

---

## V2 Revision Summary (From SRS Revision History Page 3)

The SRS v2 document includes these NEW features added on 21-1-2026:
1. **قسم مقترحات** (Suggestions Section) - NEW MODULE
2. **تعديل في بنود الشكوى** (Complaint modifications - reference complaint)
3. **مؤشر رضا المستخدمين** للوحة التحكم الذكية (User satisfaction indicator for dashboard)
4. **تقييم رضا المستخدم** بعد تقييم الشكوى (User satisfaction rating after complaint resolution)
5. **ميزة Snooze** للأسئلة المقترحة من AI وللشكاوى الواردة (Snooze feature)
6. **إشعارات جديدة** (New notifications)
7. **اعتماد النموذج التجريدي للخدمات** (Abstract service model adoption)

---

## Category 1: Suggestions Module (FR-41 to FR-48) - NEW IN V2

### Requirement Completeness

- [ ] CHK001 - Is the exact workflow for suggestions status transitions (وارد → قيد الدراسة → مقبول/مرفوض) fully documented with state machine? [Completeness, Spec §FR-45]
- [ ] CHK002 - Are the mandatory vs optional fields for suggestion submission explicitly specified? [Completeness, Spec §FR-41]
- [ ] CHK003 - Are notification requirements defined for suggestion status changes (FR-68)? [Gap, Spec §FR-68]
- [ ] CHK004 - Is the audit trail requirement for suggestions explicitly defined? [Completeness, Spec §FR-60]
- [ ] CHK005 - Are requirements for suggestion deletion rules (only if status="وارد") documented? [Completeness, Spec §FR-48]

### Requirement Clarity

- [ ] CHK006 - Is "مقترح" vs "مشروع" vs "فكرة تطويرية" differentiated with clear criteria? [Clarity, Spec §FR-41]
- [ ] CHK007 - Is the file upload limit for suggestions quantified (max files, max size per file)? [Gap - NOT SPECIFIED in FR-41]
- [ ] CHK008 - Are the allowed file types for suggestion attachments specified? [Gap - NOT SPECIFIED]
- [ ] CHK009 - Is rate limiting for suggestions defined (similar to FR-36 for complaints)? [Gap - NOT SPECIFIED]

### Scenario Coverage

- [ ] CHK010 - Are requirements defined for guest vs authenticated user suggestion submission? [Coverage, Spec §FR-41]
- [ ] CHK011 - Is the tracking number generation for suggestions specified (similar to FR-23 for complaints)? [Gap]
- [ ] CHK012 - Are requirements for suggestion inquiry/tracking by citizens specified? [Coverage, Spec §FR-42, FR-43]
- [ ] CHK013 - Is the employee notification mechanism for new suggestions defined? [Coverage, Spec §FR-70]

---

## Category 2: User Satisfaction Rating (FR-25) - NEW IN V2

### Requirement Completeness

- [ ] CHK014 - Is the rating scale explicitly defined (5 stars mentioned in FR-25)? [Completeness, Spec §FR-25]
- [ ] CHK015 - Is the timing for when rating is requested clearly specified (after status="تم الرد")? [Completeness, Spec §FR-25]
- [ ] CHK016 - Is the "one-time only, no modification" constraint for ratings specified? [Completeness, Spec §FR-25]
- [ ] CHK017 - Are requirements for aggregating satisfaction scores for dashboard (مؤشر رضا المستخدمين) defined? [Gap, Spec §FR-55]

### Requirement Clarity

- [ ] CHK018 - Is the UI trigger for satisfaction rating clearly defined (popup, email link, in-page)? [Clarity]
- [ ] CHK019 - Are requirements for anonymous vs identified ratings specified? [Clarity]

### Scenario Coverage

- [ ] CHK020 - Are requirements defined for what happens if user doesn't rate? [Edge Case, Gap]
- [ ] CHK021 - Is there a time limit for submitting a rating after complaint resolution? [Edge Case, Gap]
- [ ] CHK022 - Are reporting requirements for satisfaction metrics in dashboard specified? [Coverage, Spec §FR-55]

---

## Category 3: Snooze Feature (FR-35, FR-58) - NEW IN V2

### Requirement Completeness

- [ ] CHK023 - Are the snooze duration options explicitly listed for complaints (يوم، يومين، ثلاثة أيام)? [Completeness, Spec §FR-35]
- [ ] CHK024 - Are the snooze duration options explicitly listed for FAQ suggestions (يوم، ثلاثة أيام، أسبوع)? [Completeness, Spec §FR-58]
- [ ] CHK025 - Is the behavior after snooze expiration clearly defined? [Completeness]

### Requirement Clarity

- [ ] CHK026 - Is "snooze" behavior clearly defined - does it hide from list or just suppress notifications? [Clarity, Spec §FR-35]
- [ ] CHK027 - Can a snoozed item be unsnoozed early? Is this specified? [Clarity, Gap]
- [ ] CHK028 - Is the snooze feature available to all staff or specific roles? [Clarity, Gap]

### Scenario Coverage

- [ ] CHK029 - What happens when snooze expires during non-working hours? [Edge Case, Gap]
- [ ] CHK030 - Are audit requirements for snooze actions defined? [Coverage, Spec §FR-60]

---

## Category 4: Reference Complaint (FR-32) - NEW IN V2

### Requirement Completeness

- [ ] CHK031 - Is the linking mechanism between complaints clearly specified (foreign key to complaints table)? [Completeness, Spec §FR-32]
- [ ] CHK032 - Are validation rules for reference complaint number specified? [Completeness, Spec §FR-32]
- [ ] CHK033 - Is the display of related complaint in staff view specified? [Completeness]

### Requirement Clarity

- [ ] CHK034 - Can a complaint reference another complaint that itself has a reference? (Chain of references) [Clarity, Gap]
- [ ] CHK035 - Is the reference complaint field mandatory or optional? [Clarity - appears optional in FR-32]
- [ ] CHK036 - Can a resolved complaint be referenced by a new complaint? [Clarity, Gap]

### Scenario Coverage

- [ ] CHK037 - What happens if the referenced complaint is deleted/archived? [Edge Case, Gap]
- [ ] CHK038 - Are privacy requirements for cross-user complaint references defined? (If authenticated, must be same user) [Coverage]

---

## Category 5: New Notifications (FR-63 to FR-70) - ENHANCED IN V2

### Requirement Completeness

- [ ] CHK039 - Are all notification triggers enumerated? [Completeness, Spec §FR-63-70]
  - FR-63: Staff notification on new complaint (existing)
  - FR-64: Overdue reminder by priority (existing)
  - FR-65: Security alert to admin (existing)
  - FR-66: External link warning (existing)
  - FR-67: Citizen notification on complaint status change (existing)
  - **FR-68: Citizen notification on suggestion status change** (NEW)
  - **FR-69: Admin notification for overdue complaints** (NEW - escalation)
  - **FR-70: Staff notification on new suggestion** (NEW)

- [ ] CHK040 - Is the escalation chain for overdue complaints (FR-69: notify admin after staff timeout) fully specified? [Completeness, Spec §FR-69]
- [ ] CHK041 - Are notification delivery channels specified (in-app, email, push)? [Completeness]

### Requirement Clarity

- [ ] CHK042 - Is "فوري" (immediate) notification latency quantified? [Clarity, Spec §FR-63, FR-70]
- [ ] CHK043 - Are notification templates/content requirements specified? [Clarity, Gap]

### Scenario Coverage

- [ ] CHK044 - What happens when email delivery fails? (Retry mechanism) [Edge Case, Gap]
- [ ] CHK045 - Are notification preferences (opt-out) requirements specified for citizens? [Coverage, Gap]

---

## Category 6: Abstract Service Model - NEW IN V2

### Requirement Completeness

- [ ] CHK046 - Is the "النموذج التجريدي للخدمات" (abstract service model) structure defined? [Completeness, Spec - Revision History mentions adoption]
- [ ] CHK047 - Are service template fields explicitly listed? [Gap - need to check FR-14, FR-15]
- [ ] CHK048 - Is the relationship between services and directorates specified? [Coverage, Spec §FR-14]

### Requirement Clarity

- [ ] CHK049 - What differentiates the "abstract service model" from current service implementation? [Clarity, Gap]
- [ ] CHK050 - Are service versioning requirements specified? [Clarity, Gap]

---

## Category 7: Dashboard User Satisfaction Indicator - NEW IN V2

### Requirement Completeness

- [ ] CHK051 - Is the calculation method for user satisfaction indicator specified (average rating, weighted, etc.)? [Completeness, Spec §FR-55]
- [ ] CHK052 - Is the display format for satisfaction indicator on dashboard specified? [Completeness]
- [ ] CHK053 - Is data granularity specified (per directorate, overall, per period)? [Completeness]

### Requirement Clarity

- [ ] CHK054 - Is "مؤشر رضا المستخدمين" clearly defined with measurable criteria? [Clarity]
- [ ] CHK055 - Is the time range for satisfaction metrics specified (daily, weekly, monthly)? [Clarity, Gap]

---

## Category 8: Cross-Cutting Requirements Quality

### Consistency

- [ ] CHK056 - Are suggestion attachments constraints consistent with complaint attachments (FR-24 vs new FR)? [Consistency]
- [ ] CHK057 - Is the tracking number format consistent between complaints (FR-23) and suggestions? [Consistency]
- [ ] CHK058 - Are status values consistent across complaints and suggestions? [Consistency]

### Traceability

- [ ] CHK059 - Does every new FR have a corresponding use case in the SRS? [Traceability]
  - FR-41 to FR-48 (Suggestions): Check use case existence
- [ ] CHK060 - Are new notification requirements (FR-68, FR-69, FR-70) traceable to specific triggers? [Traceability]

### Dependencies

- [ ] CHK061 - Are dependencies between suggestions module and existing auth system documented? [Dependency]
- [ ] CHK062 - Is the AI integration for suggestions (classification/analysis) specified or explicitly excluded? [Dependency, Gap]

---

## Implementation Status Summary

**Last Updated**: 2026-01-24

Based on verification, the following SRS v2 requirements have been **FULLY IMPLEMENTED** in backend:

### HIGH PRIORITY (New Modules) - ALL IMPLEMENTED

| FR | Description | Backend Status | Implementation Details |
|----|-------------|----------------|------------------------|
| FR-41 | Suggestion submission (citizen/guest) | ✅ IMPLEMENTED | `SuggestionController::store()` |
| FR-42 | Authenticated user view suggestions | ✅ IMPLEMENTED | `SuggestionController::index()` |
| FR-43 | Guest suggestion tracking | ✅ IMPLEMENTED | `SuggestionController::track()` |
| FR-44 | Staff dashboard for suggestions | ✅ IMPLEMENTED | Filament SuggestionResource |
| FR-45 | Suggestion status workflow | ✅ IMPLEMENTED | `SuggestionController::updateStatus()` |
| FR-46 | Suggestion search by tracking number | ✅ IMPLEMENTED | Track endpoint |
| FR-47 | Suggestion print feature | ✅ IMPLEMENTED | `SuggestionController::printView()` |
| FR-48 | Suggestion delete (if status=وارد) | ✅ IMPLEMENTED | `SuggestionController::destroy()` |

### MEDIUM PRIORITY (Enhancements) - ALL IMPLEMENTED

| FR | Description | Backend Status | Implementation Details |
|----|-------------|----------------|------------------------|
| FR-25 | User satisfaction rating post-complaint | ✅ IMPLEMENTED | `Complaint::rate()`, `ComplaintController::rate()` |
| FR-32 | Reference/related complaint field | ✅ IMPLEMENTED | `related_complaint_id` in Complaint model |
| FR-35 | Snooze for complaints (1-3 days) | ✅ IMPLEMENTED | `Complaint::snooze()`, `ComplaintController::snooze()` |
| FR-58 | Snooze for FAQ suggestions (1d, 3d, 1wk) | ✅ IMPLEMENTED | `FaqSuggestionController::snooze()` |
| FR-68 | Notification: suggestion status change | ✅ IMPLEMENTED | NotificationService |
| FR-69 | Escalation for overdue complaints (5/10 days) | ✅ IMPLEMENTED | `EscalateOldComplaints` command |
| FR-70 | Notification: new suggestion to staff | ✅ IMPLEMENTED | NotificationService |

### LOW PRIORITY (Dashboard/Reports) - ALL IMPLEMENTED

| FR | Description | Backend Status | Implementation Details |
|----|-------------|----------------|------------------------|
| FR-55 | User satisfaction indicator in dashboard | ✅ IMPLEMENTED | `ComplaintController::getSatisfactionAnalytics()` |
| Abstract Service Model | Service template standardization | ✅ IMPLEMENTED | Service model with directorates |

---

## Backend Files Implementing SRS v2 Features

### Complaint Features (FR-25, FR-35, FR-69)
- `backend/app/Models/Complaint.php` - Rating, snooze, escalation fields and methods
- `backend/app/Http/Controllers/ComplaintController.php` - rate(), snooze(), getSatisfactionAnalytics()
- `backend/database/migrations/2026_01_23_160000_add_rating_and_snooze_to_complaints.php`
- `backend/database/migrations/2026_01_23_160300_add_escalation_fields_to_complaints.php`
- `backend/app/Console/Commands/EscalateOldComplaints.php` - Escalation command (5/10 day thresholds)

### Suggestion Features (FR-41-48)
- `backend/app/Models/Suggestion.php` - Suggestion model with status workflow
- `backend/app/Http/Controllers/Api/V1/SuggestionController.php` - Full CRUD + print
- `backend/database/migrations/2026_01_23_160200_add_response_fields_to_suggestions.php`

### FAQ Suggestion Snooze (FR-58)
- `backend/app/Models/FaqSuggestion.php` - Snooze fields
- `backend/app/Http/Controllers/Api/FaqSuggestionController.php` - snooze(), unsnooze()
- `backend/database/migrations/2026_01_23_160100_add_snooze_to_faq_suggestions.php`

### API Routes (backend/routes/api.php)
- `POST /complaints/{trackingNumber}/rate` - FR-25
- `POST /staff/complaints/{id}/snooze` - FR-35
- `DELETE /staff/complaints/{id}/snooze` - FR-35
- `GET /staff/analytics/satisfaction` - FR-55
- `POST /admin/faq-suggestions/{id}/snooze` - FR-58
- `DELETE /admin/faq-suggestions/{id}/snooze` - FR-58
- `GET /suggestions/track/{trackingNumber}` - FR-43
- `GET /suggestions/{trackingNumber}/print` - FR-47

---

## Remaining Work: FRONTEND ONLY

All backend features are complete. The following frontend components need UI implementation:

1. **Complaint Rating UI** - Rating stars component after complaint resolution
2. **Snooze UI for Staff** - Snooze buttons in complaint management
3. **Snooze UI for FAQ Suggestions** - Snooze in admin panel
4. **Satisfaction Dashboard Widget** - Display analytics in dashboard
5. **Suggestion Print Page** - Print-friendly suggestion view
6. **Escalation Indicators** - Show escalation status in staff view

---

**Checklist Summary**: 62 items | Focus: SRS v2 new requirements quality validation
**Backend Status**: ALL FEATURES IMPLEMENTED
**Frontend Status**: UI implementation pending (separate task for another team)
