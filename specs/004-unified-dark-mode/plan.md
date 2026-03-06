# Implementation Plan: Unified Dark Mode Color System

**Branch**: `004-unified-dark-mode` | **Date**: 2026-02-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-unified-dark-mode/spec.md`

## Summary

Unify the dark mode color palette across the entire Syrian Ministry of Economy portal. Currently 93 files use 2,022 dark mode class instances with inconsistent colors (pure black, hardcoded hex values, mixed Tailwind grays, brand colors used inconsistently). This plan centralizes all dark mode colors into CSS variables and Tailwind config, then systematically replaces all hardcoded dark mode overrides in every component file to reference the central palette: buttons/icons = dark green (#094239), titles = gold (#b9a779), text = white (#ffffff), cards = gray (#b3a3d3), page background = dark (#1a1a1a).

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 14 App Router), React 18
**Primary Dependencies**: Tailwind CSS 3.4.1, Next.js 14, Framer Motion, GSAP
**Storage**: N/A (frontend-only changes)
**Testing**: Manual visual inspection across all pages in dark mode; Tailwind class audit via grep
**Target Platform**: Web (mobile-first, responsive)
**Project Type**: Web application (frontend only for this feature)
**Performance Goals**: No regressions; dark mode toggle transition <300ms
**Constraints**: Must not change light mode; must not break high-contrast mode; 93 files to update
**Scale/Scope**: 93 component/page files with 2,022 dark mode class instances

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Applies | Status | Notes |
|-----------|---------|--------|-------|
| I. Security-First | No | PASS | Pure CSS/styling changes, no security implications |
| II. Arabic-First | Yes | PASS | RTL layout unaffected; colors are language-agnostic; Qomra font unaffected |
| III. Citizen Value First | Yes | PASS | Improves visual consistency for all users; maintains WCAG 2.1 AA contrast ratios; mobile-first preserved |
| IV. Decoupled Architecture | Yes | PASS | Frontend-only changes; no backend/API changes needed |
| V. Data Integrity | No | PASS | No data changes |
| VI. Observability | No | PASS | No logging changes needed |
| VII. Simplicity | Yes | PASS | Centralizing into CSS variables is the simplest approach; reduces 93-file scattered definitions to 1 central file |

**Gate Result**: PASS — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-unified-dark-mode/
├── plan.md              # This file
├── research.md          # Phase 0 output - color system analysis
├── quickstart.md        # Phase 1 output - dev setup and testing guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
frontend-next/
├── src/
│   ├── app/
│   │   ├── globals.css              # Central dark mode CSS variables (PRIMARY)
│   │   ├── page.tsx                 # Home page
│   │   ├── (auth)/                  # Auth pages (login, register, etc.)
│   │   ├── (protected)/             # Protected pages (profile, dashboard)
│   │   └── [domain]/               # Domain pages (news, faq, contact, etc.)
│   └── components/
│       ├── Navbar.tsx               # Navigation + services dropdown
│       ├── Footer.tsx               # Footer
│       ├── ChatBot.tsx              # ChatBot widget
│       ├── QuickLinks.tsx           # Quick links section
│       ├── ComplaintPortal.tsx      # Complaint form
│       ├── SuggestionsForm.tsx      # Suggestion form
│       ├── ArticleCard.tsx          # News cards
│       ├── SearchResultsPage.tsx    # Search results
│       └── [90+ other components]   # All other components
├── tailwind.config.ts               # Tailwind dark mode colors (SECONDARY)
└── package.json
```

**Structure Decision**: This is a frontend-only feature modifying existing files. No new directories or files needed beyond the spec artifacts. The two primary files are `globals.css` (CSS variables) and `tailwind.config.ts` (Tailwind color mappings). All other changes are replacing hardcoded values in existing component files.

## Implementation Strategy

### Approach: Centralize-then-Replace

**Phase A — Central Definition** (1 file):
Update `globals.css` `.dark` section with the authoritative dark mode CSS variables. Update `tailwind.config.ts` to map semantic color names to these variables.

**Phase B — Systematic Replacement** (93 files):
Replace all hardcoded dark mode colors in component files with the centralized Tailwind utility classes. Group by replacement pattern:

| Current Pattern | Replacement | Count |
|----------------|-------------|-------|
| `dark:bg-black` | `dark:bg-[#1a1a1a]` or CSS var | 27 |
| `dark:bg-[#2a2a2a]` | `dark:bg-[#1a1a1a]` or CSS var | ~5 |
| `dark:bg-gray-700/800/900` | `dark:bg-[#1a1a1a]` or CSS var | ~20 |
| `dark:border-gray-600/700` | `dark:border-gov-border/15` | ~80 |
| `dark:text-gray-300/400` inconsistencies | `dark:text-white` or `dark:text-white/70` | ~220 |
| `dark:bg-green-*` (bright green leaks) | `dark:bg-gov-forest` | ~10 |

**Phase C — Problem Components** (6 files):
Special attention to ChatBot, services dropdown, complaint form, suggestion form, Quick Links, "Read More" buttons.

**Phase D — Verification**:
Visual audit of all pages in dark mode. Grep audit for remaining hardcoded colors.

### Key Design Decisions

1. **CSS Variables vs. Tailwind-only**: Use CSS variables in `globals.css` as the source of truth, with Tailwind config referencing them. This enables the "change one variable, update everywhere" requirement (FR-007, SC-003).

2. **Card background opacity**: The card color #b3a3d3 at full opacity is too bright on dark surfaces. Use `dark:bg-gov-card/10` (10% opacity) as the standard card dark mode background — this is already the most common pattern (224 instances). Standardize on this.

3. **Page background**: Use `#1a1a1a` (already set as `--background` in dark mode). This is not pure black, meeting FR-005.

4. **Text hierarchy**: Gold for headings (`dark:text-gov-gold`), white for body (`dark:text-white`), white at reduced opacity for secondary text (`dark:text-white/70`).

5. **Button approach**: Buttons use `dark:bg-gov-forest` (dark green). This already works for most buttons; need to fix ones using other colors.

## Complexity Tracking

No constitution violations — no entries needed.
