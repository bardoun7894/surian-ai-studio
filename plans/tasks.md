# Implementation Tasks - Ministry of Economy Digital Platform

This document contains concrete, atomic tasks derived from the gap analysis. Each task is ready to be imported into Jira, ClickUp, or similar project management tools.

---

## Legend
- **Type**: Feature, Bug, Refactor, Infrastructure, Documentation
- **Priority**: High (blocks launch), Medium (important), Low (nice‑to‑have)
- **Effort**: S (< 1 day), M (1‑3 days), L (3‑5 days), XL (>5 days)
- **Dependencies**: Task IDs that must be completed before this task can start.

---

## Task List

### T01: Citizen Self‑Registration Page
- **Description**: Implement frontend registration page (`/auth/register`) with form validation, password strength, and 2FA enrollment. Connect to existing backend API `POST /api/v1/auth/register`.
- **Type**: Feature
- **Priority**: High
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: User can register, receive confirmation email, and log in.

### T02: Citizen Profile Editing Page
- **Description**: Build profile page (`/profile`) where citizens can update their email, phone, and password. Use API `PUT /api/v1/users/me`.
- **Type**: Feature
- **Priority**: High
- **Effort**: S
- **Dependencies**: T01
- **Acceptance Criteria**: Changes are persisted and reflected after refresh.

### T03: Session Timeout After 15 Minutes
- **Description**: Add middleware to invalidate session after 15 minutes of inactivity; frontend should detect idle time and show warning modal.
- **Type**: Feature
- **Priority**: Medium
- **Effort**: S
- **Dependencies**: T01
- **Acceptance Criteria**: User is logged out automatically; unsaved work is warned.

### T04: SMS OTP Integration for Complaints
- **Description**: Integrate SMS gateway (Twilio or local provider) to send OTP during complaint submission. Extend existing OTP verification flow to support SMS.
- **Type**: Feature
- **Priority**: Medium
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: User can choose SMS or email OTP; OTP is delivered and verified.

### T05: AI Priority Display in Admin UI
- **Description**: Show AI‑suggested priority (urgent/normal/low) in admin complaint list and detail view. Add filter/sort by AI priority.
- **Type**: Feature
- **Priority**: Low
- **Effort**: S
- **Dependencies**: AI‑service running
- **Acceptance Criteria**: Column appears in table; filtering works.

### T06: Citizen Complaint Deletion
- **Description**: Allow citizen to delete their own complaint only when status = "received". Implement API endpoint `DELETE /api/complaints/{id}` with validation, and add delete button in frontend complaint list.
- **Type**: Feature
- **Priority**: Medium
- **Effort**: S
- **Dependencies**: T01
- **Acceptance Criteria**: Deletion succeeds only when allowed; proper error messages.

### T07: Verify & Enforce 3‑Complaints‑Per‑Day Limit
- **Description**: Verify that rate‑limiting middleware works; add frontend warning when user reaches limit; log violations for monitoring.
- **Type**: Bug/Feature
- **Priority**: Medium
- **Effort**: S
- **Dependencies**: T01
- **Acceptance Criteria**: Limit enforced; user sees clear message.

### T08: Print Complaint as PDF (UI)
- **Description**: Add "Print" button on complaint detail pages (admin & citizen) that calls existing endpoint `/api/complaints/{trackingNumber}/pdf` and opens print dialog.
- **Type**: Feature
- **Priority**: Low
- **Effort**: S
- **Dependencies**: None
- **Acceptance Criteria**: PDF is generated and printable.

### T09: Snooze Complaint UI
- **Description**: Add snooze button and duration dropdown (1‑3 days) in admin complaint detail view. Integrate with existing API `POST /api/staff/complaints/{id}/snooze`.
- **Type**: Feature
- **Priority**: Low
- **Effort**: S
- **Dependencies**: None
- **Acceptance Criteria**: Complaint disappears from active list for selected duration.

### T10: Real‑Time Notifications for New Complaints
- **Description**: Build notifications dropdown in admin navbar that polls `/api/notifications` and shows new complaints. Implement email/SMS reminders for overdue complaints (FR‑45).
- **Type**: Feature
- **Priority**: High
- **Effort**: M
- **Dependencies**: T04
- **Acceptance Criteria**: Admins see instant alerts; reminders are sent.

### T11: WhatsApp & Telegram Chatbot Integration
- **Description**: Implement message routing, NLP intent detection, and response generation via AI‑service. Store conversations in `chat_conversations` table.
- **Type**: Feature
- **Priority**: High
- **Effort**: L
- **Dependencies**: AI‑service
- **Acceptance Criteria**: Bot responds to basic queries on both platforms.

### T12: Chatbot Handoff to Human Agent (UI)
- **Description**: Add handoff button in chatbot UI; create admin panel to view pending handoffs, assign agents, and respond.
- **Type**: Feature
- **Priority**: Medium
- **Effort**: M
- **Dependencies**: T11
- **Acceptance Criteria**: Handoff requests appear in admin panel; agent can take over.

### T13: Semantic Search Frontend
- **Description**: Create search results page with filter sidebar (date, directorate, content type). Connect to existing endpoint `/api/v1/public/search/semantic`.
- **Type**: Feature
- **Priority**: Low
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: Filters produce correct results; UI is responsive.

### T14: AI‑Powered Content Drafting in CMS
- **Description**: Add "AI enhance" button in content editor (admin) that calls AI‑service and suggests improvements (title, keywords, grammar).
- **Type**: Feature
- **Priority**: Low
- **Effort**: S
- **Dependencies**: AI‑service
- **Acceptance Criteria**: Suggestions appear; user can accept/reject.

### T15: Content Version History UI
- **Description**: Add version history panel in content edit page with restore/diff buttons. Use existing API `/api/admin/content/{contentId}/versions`.
- **Type**: Feature
- **Priority**: Low
- **Effort**: S
- **Dependencies**: None
- **Acceptance Criteria**: Versions listed; diff view works.

### T16: Reports Dashboard
- **Description**: Build reports dashboard with charts (complaints over time, resolution rate, satisfaction scores) and AI‑generated summaries. Use existing endpoints `/api/reports/statistics` and `/api/reports/summaries`.
- **Type**: Feature
- **Priority**: High
- **Effort**: L
- **Dependencies**: None
- **Acceptance Criteria**: Charts render; summaries are readable.

### T17: Audit Log UI
- **Description**: Create audit‑log page in admin panel with filters (user, date, action) and export to CSV. Use `AuditLog` model.
- **Type**: Feature
- **Priority**: Medium
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: Logs are searchable; export works.

### T18: IP Restriction Configuration UI
- **Description**: Add system‑settings UI to manage allowed IP ranges for admin panel. Integrate with `AdminIpRestrictionMiddleware`.
- **Type**: Feature
- **Priority**: High
- **Effort**: S
- **Dependencies**: None
- **Acceptance Criteria**: IP list can be edited; changes take effect immediately.

### T19: Security Headers Audit & Enforcement
- **Description**: Audit and enforce full set of OWASP headers (CSP, X‑Frame‑Options, etc.). Implement CSP nonce generation for inline scripts.
- **Type**: Infrastructure
- **Priority**: Medium
- **Effort**: S
- **Dependencies**: None
- **Acceptance Criteria**: Headers present; no broken functionality.

### T20: Performance Monitoring Setup
- **Description**: Implement monitoring with Laravel Telescope / New Relic; optimize slow queries; cache static content.
- **Type**: Infrastructure
- **Priority**: High
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: Response times <200ms; dashboard shows metrics.

### T21: Load Testing & Scaling
- **Description**: Load‑test with k6 (2000 concurrent users, 500 RPS). Scale horizontally (add more Laravel queues, Redis cache, DB replicas) based on results.
- **Type**: Infrastructure
- **Priority**: High
- **Effort**: L
- **Dependencies**: T20
- **Acceptance Criteria**: System meets performance targets under load.

### T22: Accessibility Audit & Fixes
- **Description**: Conduct WCAG 2.1 AA audit; fix contrast, keyboard navigation, screen‑reader labels. Implement language switcher (Arabic/English).
- **Type**: Feature
- **Priority**: High
- **Effort**: L
- **Dependencies**: None
- **Acceptance Criteria**: Accessibility score >90; language toggle works.

### T23: English Translation
- **Description**: Extract all translatable strings; create `lang/en` JSON files; integrate Laravel localization & Next.js i18n.
- **Type**: Feature
- **Priority**: Medium
- **Effort**: L
- **Dependencies**: None
- **Acceptance Criteria**: Entire UI available in English.

### T24: CI/CD Pipeline (GitHub Actions)
- **Description**: Set up workflow that runs PHPUnit, ESLint, builds Docker images, and deploys to staging/production.
- **Type**: Infrastructure
- **Priority**: High
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: Pipeline runs on each PR; deployment automated.

### T25: Backup & Snapshot UI
- **Description**: Create admin UI for triggering manual snapshots, downloading backups, and exporting data to CSV/PDF. Use existing backup endpoints.
- **Type**: Feature
- **Priority**: Low
- **Effort**: S
- **Dependencies**: None
- **Acceptance Criteria**: Backups can be triggered and downloaded.

### T26: Investment Portal Frontend
- **Description**: Build investment listing, detail, and category pages in Next.js; connect to existing API `/api/v1/public/investments`.
- **Type**: Feature
- **Priority**: Medium
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: Pages display investment data; filters work.

### T27: Promotional Sections Admin UI
- **Description**: Create admin UI to manage promotional sections (hero, sidebar, etc.). Integrate into homepage hero grid.
- **Type**: Feature
- **Priority**: Low
- **Effort**: S
- **Dependencies**: None
- **Acceptance Criteria**: Sections appear on homepage; admin can edit.

### T28: Suggestions Portal Frontend
- **Description**: Build suggestion submission form and tracking page similar to complaints portal. Use existing API `/api/v1/suggestions`.
- **Type**: Feature
- **Priority**: High
- **Effort**: M
- **Dependencies**: None
- **Acceptance Criteria**: Users can submit & track suggestions.

### T29: Unit & Feature Tests
- **Description**: Write PHPUnit tests for Complaint, User, Content models; add Jest tests for critical Next.js components.
- **Type**: Infrastructure
- **Priority**: High
- **Effort**: L
- **Dependencies**: None
- **Acceptance Criteria**: Test coverage >70% for core modules.

### T30: Monitoring Alerts (CPU >80%)
- **Description**: Integrate Laravel Health checks with notification channels (email, Slack); set up Prometheus/Grafana for resource monitoring.
- **Type**: Infrastructure
- **Priority**: Medium
- **Effort**: M
- **Dependencies**: T20
- **Acceptance Criteria**: Alerts fire when threshold exceeded.

---

## Sprint Recommendations

### Sprint 1 (High‑Priority & Security)
- T01, T02, T10, T18, T19, T20, T29

### Sprint 2 (Chatbot & Complaints)
- T04, T06, T07, T11, T12, T28

### Sprint 3 (Reports & Accessibility)
- T16, T17, T22, T23, T08, T13

### Sprint 4 (DevOps & Polish)
- T24, T21, T30, T25, T26, T27

---

## Notes
- Tasks are designed to be independent and assignable to a single developer.
- Effort estimates are approximate; adjust based on team velocity.
- Dependencies are minimal; where present, they are listed.
- Each task should have a dedicated branch, code review, and merge to `main` after passing tests.

*Generated from brownfield analysis on 2026‑01‑26.*