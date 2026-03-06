# Implementation Plan: Ministry Portal Comprehensive Amendments

**Branch**: `005-ministry-frontend-fixes` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-ministry-frontend-fixes/spec.md`

## Summary

Comprehensive frontend amendments for the Syrian Ministry of Economy portal covering ~93 Trello items across 18 user stories. Changes span mobile responsiveness, authentication flow fixes, complaints/suggestions system improvements, favorites, homepage redesign, directorate restructuring, translation completeness, navigation/loading UX, media center fixes, form validation, header/footer branding, dark mode consistency, chatbot training, and admin dashboard controls. The majority of work is frontend-only (Next.js 14 + React 18 + Tailwind CSS), with some backend API additions for new features (favorites, admin controls, map pins).

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14.2.35 App Router), PHP 8.2+ (Laravel 11)
**Primary Dependencies**: React 18, Tailwind CSS 3.4.1, GSAP 3.14.2, Framer Motion 11.18.2, Lucide React 0.562, Sonner 2.0.7, react-simple-maps 3.0, Sharp 0.34.5
**Storage**: PostgreSQL 15+ (existing), Redis 7+ (cache)
**Testing**: ESLint (frontend), PHPUnit (backend)
**Target Platform**: Web (mobile-first responsive), Docker containers
**Project Type**: Web application (decoupled frontend + backend + AI service)
**Performance Goals**: <200ms page load (p95), <500ms chatbot response
**Constraints**: Syrian government data center hosting, Arabic-first RTL, WCAG 2.1 AA
**Scale/Scope**: ~93 amendment items, 18 user stories, 77 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Security-First | PASS | No new public endpoints without validation. CSRF/Sanctum auth preserved. File uploads validated. |
| II. Arabic-First | PASS | All new UI text has Arabic translations first. RTL remains default. |
| III. Citizen Value First | PASS | Mobile-first design mandatory. Complaints system is core focus. WCAG 2.1 AA maintained. |
| IV. Decoupled Architecture | PASS | Frontend and backend communicate via REST API only. No direct DB access from frontend. |
| V. Data Integrity | PASS | Favorites use soft-delete. Complaints immutable after submission. Audit logging preserved. |
| VI. Observability | PASS | All new API endpoints include structured logging. |
| VII. Simplicity | PASS | Changes are targeted fixes/amendments, not architectural overhauls. Minimal new abstractions. |

**Gate Result**: ALL PASS - proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/005-ministry-frontend-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-additions.yaml
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── Http/Controllers/  # API controllers (favorites, admin settings)
│   ├── Models/             # Eloquent models (Favorite, Setting)
│   └── Filament/           # Admin panel resources
├── routes/api.php          # API routes
└── database/migrations/    # New migrations (favorites table)

frontend-next/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Login, register, two-factor, forgot-password
│   │   ├── (protected)/    # Profile, settings, dashboard
│   │   ├── announcements/  # Announcements with unified filter
│   │   ├── complaints/     # Complaint portal
│   │   ├── contact/        # Contact page (dark mode fix)
│   │   ├── directorates/   # Directorate pages ([id], sub-directorates)
│   │   ├── faq/            # FAQ page
│   │   ├── media/          # Media center
│   │   ├── news/           # News listing and [id] detail
│   │   ├── suggestions/    # Suggestions portal
│   │   └── page.tsx        # Homepage (hero, departments, sections)
│   ├── components/         # Shared components
│   │   ├── Navbar.tsx      # Header with updated logo
│   │   ├── Footer.tsx      # Footer with social links
│   │   ├── Breadcrumbs.tsx # New breadcrumb component
│   │   ├── ScrollToTop.tsx # New scroll-to-top button
│   │   ├── SkeletonLoader.tsx # Skeleton loading component
│   │   └── LoadingSpinner.tsx # Branded loading
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx  # Auth with visibility handling
│   │   └── LanguageContext.tsx # i18n translations
│   ├── lib/
│   │   ├── repository.ts   # API repository layer
│   │   └── api.ts          # Base API client
│   ├── types/index.ts      # TypeScript interfaces
│   └── constants/index.ts  # Mock data constants
└── tailwind.config.ts      # Theme config (dark mode, gov colors)
```

**Structure Decision**: Existing web application structure with decoupled frontend (Next.js) and backend (Laravel). No structural changes needed - all work fits within existing directory layout.

## Complexity Tracking

No constitution violations. All changes fit within existing architecture.
