# Implementation Plan: UI Amendments Batch (54 Items)

**Branch**: `003-ui-amendments` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ui-amendments/spec.md`

## Summary

54 UI amendment items spanning dark mode consistency, complaint/suggestion flow fixes, authentication stability, header/navigation improvements, search, localization, and performance optimization. The work is primarily frontend (Next.js 14 components and styles) with minor backend adjustments for rating submission (Item 46), profile complaints linkage (Item 6), and AI summary endpoint (Item 33). All changes target existing components and pages in `frontend-next/src/`.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14.2.35), PHP 8.2+ (Laravel 11)
**Primary Dependencies**: React 18, Tailwind CSS 3.4.1, GSAP 3.14.2, Framer Motion 11.18.2, Lucide React, Sonner, Laravel Sanctum
**Storage**: PostgreSQL 15+ (existing), Redis 7+ (cache)
**Testing**: Manual UI testing via Docker dev environment (`docker-compose -f docker-compose.dev.yml up -d`), no automated frontend tests currently
**Target Platform**: Web (Desktop + Mobile), Docker containers
**Project Type**: Web application (Next.js frontend + Laravel backend + FastAPI AI service)
**Performance Goals**: <200ms page load (p95), <500ms chatbot response (Constitution)
**Constraints**: Arabic-first RTL layout, mobile-first design, WCAG 2.1 AA, Syrian government IP restrictions for admin
**Scale/Scope**: ~70 components affected, ~30 pages, changes across 14 user stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Security-First | PASS | Password change requires old password (Item 5). Clipboard fallback avoids exposing errors. No new attack surfaces. |
| II. Arabic-First | PASS | Multiple items fix Arabic text (Items 16, 17, 48). RTL arrow direction fixed (Item 45). Arabic remains primary. |
| III. Citizen Value First | PASS | Complaint/suggestion flow is prioritized as P1. All items improve citizen experience. Mobile-first maintained. |
| IV. Decoupled Architecture | PASS | Frontend changes communicate via existing API contracts. AI summary uses existing FastAPI service. No direct DB access. |
| V. Data Integrity | PASS | No changes to data persistence model. Complaints remain immutable after submission. |
| VI. Observability | PASS | No degradation. AI summary button adds log-able interaction. |
| VII. Simplicity | PASS | All changes are targeted fixes to existing components. No new abstractions introduced. |

**Pre-design gate: PASSED**

## Project Structure

### Documentation (this feature)

```text
specs/003-ui-amendments/
├── plan.md              # This file
├── research.md          # Phase 0: Research findings
├── data-model.md        # Phase 1: Entity changes
├── quickstart.md        # Phase 1: Developer quickstart
├── contracts/           # Phase 1: API contract changes
│   └── api-changes.md   # Endpoint modifications
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
frontend-next/src/
├── app/
│   ├── globals.css                          # Dark mode CSS variables & utilities
│   ├── page.tsx                             # Home page (Items 18-21, 24-26)
│   ├── (auth)/
│   │   ├── login/page.tsx                   # Items 8, 9
│   │   └── two-factor/page.tsx              # Items 10, 11
│   ├── (protected)/
│   │   └── profile/page.tsx                 # Items 3-7
│   ├── contact/page.tsx                     # Items 16, 54
│   ├── faq/page.tsx                         # Item 17
│   ├── search/
│   │   └── semantic/page.tsx                # Items 13, 28
│   ├── announcements/page.tsx               # Items 15, 36, 37
│   ├── decrees/page.tsx                     # Item 15
│   ├── news/page.tsx                        # Item 14
│   ├── media/page.tsx                       # Item 51
│   ├── services/
│   │   ├── page.tsx                         # Item 52
│   │   └── [id]/page.tsx                    # Item 52
│   └── directorates/
│       └── [id]/sub-directorates/page.tsx   # Items 27, 31, 32, 50
├── components/
│   ├── Navbar.tsx                           # Items 1, 2, 14, 53
│   ├── HeroSection.tsx                      # Item 26
│   ├── ChatBot.tsx                          # Item 29
│   ├── QuickLinks.tsx                       # Item 23
│   ├── ComplaintPortal.tsx                  # Items 38-46
│   ├── SuggestionsForm.tsx                  # Items 47-49
│   ├── SatisfactionRating.tsx               # Items 45, 46
│   ├── ArticleDetail.tsx                    # Items 33-35
│   ├── NewsSection.tsx                      # Items 19, 20, 25
│   ├── Announcements.tsx                    # Items 36, 37
│   ├── ContactSection.tsx                   # Item 16
│   ├── FAQSection.tsx                       # Item 17
│   ├── FeaturedDirectorates.tsx             # Item 18
│   ├── DirectorateDetail.tsx                # Items 27, 31, 32
│   ├── NewsletterSection.tsx                # Item 24
│   ├── SearchResultsPage.tsx                # Items 13, 28
│   ├── QuickServices.tsx                    # Item 52
│   ├── RequestedServices.tsx                # Item 52
│   └── SyriaMap.tsx                         # Item 54 (remove usage)
├── contexts/
│   ├── ThemeContext.tsx                      # Dark mode state
│   ├── LanguageContext.tsx                   # Translation keys (add missing)
│   └── AuthContext.tsx                       # Auth flow (Items 8-11)
├── lib/
│   └── repository.ts                        # API layer (Items 6, 33, 46)
└── types/
    └── index.ts                             # Type definitions

backend/
├── app/Http/Controllers/                    # Rating fix (Item 46), AI summary (Item 33)
├── routes/api.php                           # Route adjustments
└── [minimal backend changes]
```

**Structure Decision**: Existing web application structure. All 54 items map to modifications of existing files. No new architectural patterns or directories needed. The only new component consideration is the AI summary button (Item 33), which will be added inline to `ArticleDetail.tsx`.

## Complexity Tracking

No constitution violations. All changes are targeted modifications to existing components following established patterns.

## Implementation Approach

### Change Categories

| Category | Items | Primary Files | Approach |
|----------|-------|---------------|----------|
| **Dark Mode** | 12, 22, 23, 29, 47, 53 | globals.css, ThemeContext, individual components | Update CSS variables and Tailwind dark: classes |
| **Remove Sections** | 3, 4, 7, 41, 42, 52, 54 | profile/page, ComplaintPortal, services/page, contact/page | Delete JSX blocks |
| **Translation Fixes** | 18, 24, 31, 34, 37, 40, 48 | LanguageContext (add keys), individual components | Add missing translation keys, use t() function |
| **Bug Fixes** | 10, 16, 43, 44, 46, 50, 51 | Various components | Component-specific logic fixes |
| **Layout/Style** | 1, 2, 14, 15, 21, 26, 27, 28, 32, 35, 39 | Navbar, HeroSection, various pages | Tailwind class adjustments |
| **Feature Additions** | 6, 13, 19, 20, 25, 33, 36 | profile/page, SearchResultsPage, ArticleDetail | New UI functionality |
| **Auth Flow** | 8, 9, 10, 11 | login/page, two-factor/page, AuthContext | State management fixes |
| **Form Fixes** | 5, 38, 45, 48, 49 | profile/page, ComplaintPortal, SuggestionsForm | Validation and feedback |
| **Performance** | 30 | Next.js config, image optimization, lazy loading | Bundle and render optimization |

### Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Security-First | PASS | Old password required for change. No new endpoints exposed publicly. Rate limiting preserved. |
| II. Arabic-First | PASS | 7 translation items add missing Arabic/English. FAQ text corrected in Arabic. |
| III. Citizen Value First | PASS | Complaint MVP prioritized as P1. Mobile layout maintained. Error messages localized. |
| IV. Decoupled Architecture | PASS | AI summary uses existing FastAPI `/api/v1/ai/summarize` pattern. No coupling introduced. |
| V. Data Integrity | PASS | No schema changes. Existing soft-delete and versioning preserved. |
| VI. Observability | PASS | No logging changes needed. Existing patterns sufficient. |
| VII. Simplicity | PASS | No new abstractions. Direct component modifications only. |

**Post-design gate: PASSED**
