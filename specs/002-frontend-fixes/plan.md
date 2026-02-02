# Implementation Plan: Frontend UI Fixes and Improvements

**Branch**: `002-frontend-fixes` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-frontend-fixes/spec.md`

## Summary

Resolve 47 frontend issues identified during review, covering registration page validation, complaint submission flow fixes, news article navigation, dark mode styling, Arabic/English localization, homepage content cleanup, footer fixes, FAQ updates, and various text/label corrections. The work is primarily frontend (Next.js 14 / TypeScript) with minor backend adjustments for API contracts (email edit endpoint, complaint template endpoint). All changes align with the existing architecture and use the established LanguageContext, ThemeContext, and component patterns.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14), PHP 8.2+ (Laravel 11)
**Primary Dependencies**: Next.js 14 (App Router), React 18, Tailwind CSS 3.4.1, GSAP, Framer Motion, Laravel Sanctum, Filament 3.3
**Storage**: PostgreSQL 15+ (existing), Redis 7+ (cache)
**Testing**: Manual testing (no frontend test framework currently configured), PHPUnit (backend)
**Target Platform**: Web (desktop + mobile), Docker/Kubernetes
**Project Type**: Web application (frontend + backend + AI service)
**Performance Goals**: <200ms page load (p95), <500ms chatbot response, 500 RPS, 2000 concurrent users
**Constraints**: Syrian government data center hosting, WCAG 2.1 AA accessibility, Arabic-first RTL design
**Scale/Scope**: ~50 pages/routes, 30+ components, 650+ translation keys, 24 backend models

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Security-First | PASS | No new security surfaces. Existing validation enhanced (input length limits). Email edit requires re-verification. |
| II. Arabic-First | PASS | Core deliverable: Arabic error messages, RTL compliance. English as secondary language. |
| III. Citizen Value First | PASS | All 47 fixes directly improve citizen experience. Complaint flow is MVP priority. WCAG 2.1 AA maintained. |
| IV. Decoupled Architecture | PASS | Frontend changes use existing API contracts. New email edit endpoint follows REST pattern. No direct DB access from frontend. |
| V. Data Integrity | PASS | No data model changes. Complaint templates are read-only lookups. Email changes create audit trail. |
| VI. Observability | PASS | No new services. Existing logging sufficient. |
| VII. Simplicity | PASS | All changes are targeted fixes to existing components. No new abstractions introduced. |

**Gate Result**: PASS - All principles satisfied. No violations to track.

## Project Structure

### Documentation (this feature)

```text
specs/002-frontend-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-changes.md   # New/modified API endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend-next/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── register/page.tsx      # Tasks 1-8: Registration validation fixes
│   │   │   └── login/page.tsx         # Task 47: Logo replacement
│   │   ├── news/
│   │   │   ├── page.tsx               # Tasks 16-17: News page fixes
│   │   │   └── [id]/page.tsx          # Task 16: Article detail fix
│   │   ├── complaints/page.tsx        # Tasks 12-14, 41: Complaint flow fixes
│   │   ├── suggestions/page.tsx       # Tasks 10-11: Suggestions integration
│   │   ├── services/page.tsx          # Task 20: Filter removal
│   │   ├── faq/page.tsx               # Tasks 21-23: FAQ updates
│   │   ├── search/page.tsx            # Tasks 36-37: Search page fixes
│   │   ├── directorates/page.tsx      # Task 24: Wireframe compliance
│   │   ├── terms/page.tsx             # Tasks 33-34: Terms of use updates
│   │   ├── privacy-policy/page.tsx    # Task 35: Date update
│   │   ├── contact/page.tsx           # Task 44: Address update
│   │   ├── (protected)/
│   │   │   └── profile/page.tsx       # Tasks 42-43: Profile fixes
│   │   ├── globals.css                # Task 25: Dark mode background
│   │   └── page.tsx                   # Tasks 18-19, 31-32, 46: Homepage fixes
│   ├── components/
│   │   ├── Navbar.tsx                 # Task 15: Dropdown UX
│   │   ├── Footer.tsx                 # Tasks 26-29: Footer fixes
│   │   ├── ComplaintPortal.tsx        # Tasks 12-14: Complaint form fixes
│   │   ├── NewsSection.tsx            # Task 17: News section title
│   │   ├── ArticleDetail.tsx          # Task 16: Article display fix
│   │   ├── FAQSection.tsx             # Tasks 21-23: FAQ content
│   │   ├── ChatBot.tsx                # Task 45: AI assistant button
│   │   ├── Announcements.tsx          # Task 46: Section rename
│   │   ├── StatsAchievements.tsx      # Task 31: Statistics removal
│   │   ├── HeroSection.tsx            # Task 31: Hero stats removal
│   │   ├── QuickServices.tsx          # Task 32: E-services removal
│   │   └── SuggestionsForm.tsx        # Tasks 10-11: Suggestions updates
│   ├── contexts/
│   │   ├── LanguageContext.tsx         # Tasks 7, 27, 30, 38-40: Translation keys
│   │   ├── ThemeContext.tsx            # Task 25: Dark mode colors
│   │   └── AuthContext.tsx             # Task 8-9: 2FA flow updates
│   └── lib/
│       └── repository.ts              # API calls for new endpoints
│
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Api/PublicApiController.php # News/article API fixes
│   │   └── UserController.php         # Email edit endpoint
│   ├── Models/
│   │   └── ComplaintTemplate.php      # Complaint template listing
│   └── Services/
│       └── NotificationService.php    # Email verification for email change
├── routes/
│   └── api.php                        # New route registrations
└── database/
    └── seeders/ContentSeeder.php      # Content data updates (FAQ, terms)
```

**Structure Decision**: Existing web application structure (frontend-next + backend). No new directories needed. All changes are modifications to existing files.

## Complexity Tracking

> No violations. All changes follow existing patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
