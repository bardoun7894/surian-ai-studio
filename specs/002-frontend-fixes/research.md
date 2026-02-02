# Research: Frontend UI Fixes and Improvements

**Feature**: 002-frontend-fixes
**Date**: 2026-01-29

## Research Summary

This feature involves 47 targeted fixes to the existing frontend. Research focused on understanding current implementation patterns and determining the correct approach for each change category.

---

## R-001: Dark Mode Background Color

**Decision**: Change dark mode background from forest green (#094239) to black (#000000)

**Rationale**: The spec requires "black background" for dark mode (Task 25). The current implementation uses a forest green (#094239) in ThemeContext.tsx. The constitution requires using the government brand colors, but the review feedback explicitly overrides this to black.

**Files affected**:
- `frontend-next/src/contexts/ThemeContext.tsx` — Change dark background CSS variable from `#094239` to `#000000`
- `frontend-next/src/app/globals.css` — Update any hardcoded dark mode color references
- `frontend-next/tailwind.config.ts` — Verify `gov-forest` color usage in dark mode utility classes

**Alternatives considered**:
- Near-black (#111111): Rejected. Spec explicitly says "black."
- Keep forest green and only fix contrast: Rejected. Task 25 explicitly requests black background.

---

## R-002: Localization Architecture for Error Messages

**Decision**: Add missing Arabic translation keys to LanguageContext.tsx for all error/validation messages

**Rationale**: The existing LanguageContext.tsx already has 650+ translation keys and a `t(key)` function. The issue is not architectural — the system supports Arabic. The problem is that some components use hardcoded English strings for error messages instead of calling `t()`. The fix is: (1) add missing translation keys, (2) replace hardcoded English strings with `t()` calls in affected components.

**Files affected**:
- `frontend-next/src/contexts/LanguageContext.tsx` — Add missing error/validation translation keys
- `frontend-next/src/app/(auth)/register/page.tsx` — Replace hardcoded error strings with `t()` calls
- `frontend-next/src/components/Footer.tsx` — Newsletter subscription error messages
- `frontend-next/src/components/ComplaintPortal.tsx` — Complaint form error messages
- All components with hardcoded English error strings

**Alternatives considered**:
- Separate i18n library (next-intl, react-i18next): Rejected. Existing LanguageContext pattern is established and working. Switching frameworks is out of scope.
- Backend-driven translations: Rejected. Error messages are client-side validation; keeping them in the frontend context is simpler.

---

## R-003: Complaint Template Dropdown Flow

**Decision**: Refactor ComplaintPortal.tsx to add a complaint template selection step between type selection and details entry

**Rationale**: The current ComplaintPortal.tsx (69.5KB) has a direct flow from complaint type (anonymous/identified) to a free-text description field. The spec requires an intermediate step: select a complaint template from a dropdown. The "open complaint" (free-text) template is only available for identified complaints. The details field only appears after selecting the open template.

**Files affected**:
- `frontend-next/src/components/ComplaintPortal.tsx` — Add template dropdown, conditional field visibility
- `frontend-next/src/lib/repository.ts` — Add API call for complaint templates list
- `backend/app/Http/Controllers/Api/PublicApiController.php` — Add endpoint to list complaint templates
- `backend/app/Models/ComplaintTemplate.php` — Ensure model supports listing

**Alternatives considered**:
- Hardcode templates in frontend: Rejected. Templates are managed in the backend database. API-driven approach follows decoupled architecture principle.
- Single-step form with all fields visible: Rejected. Spec explicitly requires progressive disclosure based on template selection.

---

## R-004: News Article Detail Page Error

**Decision**: Debug and fix the news article detail page routing and data fetching in `frontend-next/src/app/news/[id]/page.tsx`

**Rationale**: Clicking a news article shows "article not found" error. This is likely a data-fetching issue — either the article ID format doesn't match the API, or the API endpoint returns an error. The existing `ArticleDetail.tsx` component and `repository.ts` have the infrastructure. The fix involves verifying the ID parameter passes correctly to the API and the response is properly handled.

**Files affected**:
- `frontend-next/src/app/news/[id]/page.tsx` — Fix article ID routing/fetching
- `frontend-next/src/components/ArticleDetail.tsx` — Verify rendering logic
- `frontend-next/src/lib/repository.ts` — Verify API call for single article
- `backend/app/Http/Controllers/Api/PublicApiController.php` — Verify article detail endpoint

**Alternatives considered**:
- Static generation (getStaticProps): Rejected. Dynamic content requires server-side or client-side fetching.

---

## R-005: Profile Email Edit Feature

**Decision**: Add email edit functionality to the profile page with email verification flow

**Rationale**: Task 43 requires users to edit their email from the profile page. This requires both a frontend form and a backend endpoint. The email change should trigger a verification email to the new address before the change takes effect (security-first principle).

**Files affected**:
- `frontend-next/src/app/(protected)/profile/page.tsx` — Add email edit UI
- `frontend-next/src/lib/repository.ts` — Add API call for email update
- `backend/app/Http/Controllers/UserController.php` — Add email update endpoint with verification
- `backend/routes/api.php` — Register new route
- `backend/app/Services/NotificationService.php` — Send verification email

**Alternatives considered**:
- Immediate email change without verification: Rejected. Constitution Principle I (Security-First) requires verification for sensitive account changes.
- Email change via admin only: Rejected. Spec explicitly requires self-service from profile page.

---

## R-006: Header Dropdown Hover Behavior

**Decision**: Add a delay/buffer zone to the Navbar dropdown menus to prevent premature closing

**Rationale**: Task 15 reports that dropdown menus disappear too quickly when moving the cursor down. This is a common CSS/JS hover interaction issue. The fix involves adding a small delay (150-300ms) before hiding the dropdown on mouse leave, or using a "safe triangle" approach where the dropdown stays open while the cursor moves toward it.

**Files affected**:
- `frontend-next/src/components/Navbar.tsx` — Add hover delay/buffer to dropdown menus

**Alternatives considered**:
- Click-to-open dropdowns: Rejected. Current hover behavior is standard for desktop navigation. Just needs the timing fixed.
- CSS-only delay (transition-delay): Simpler but less precise. Will try CSS-first, fall back to JS timeout if needed.

---

## R-007: Two-Factor Authentication Page

**Decision**: Create a dedicated 2FA page in the auth flow

**Rationale**: Task 9 requires a 2FA page that currently doesn't exist. The AuthContext already has `twoFactorRequired` state. The page needs to: (1) accept OTP code input, (2) verify against backend, (3) complete authentication. Since Task 5 specifies email-only verification, the 2FA code is sent via email.

**Files affected**:
- `frontend-next/src/app/(auth)/two-factor/page.tsx` — New page (must create)
- `frontend-next/src/contexts/AuthContext.tsx` — Update 2FA flow to redirect to new page
- `backend/app/Http/Controllers/AuthController.php` — Verify 2FA endpoint exists

**Alternatives considered**:
- Modal overlay on login page: Rejected. Spec says "dedicated page."
- SMS-based OTP: Rejected. Task 5 explicitly says email only.

---

## R-008: Homepage Content Removal Approach

**Decision**: Remove components/sections from homepage by removing their JSX from `page.tsx`, not by deleting component files

**Rationale**: Tasks 31-32 require removing statistics and electronic services section from homepage. The components (StatsAchievements.tsx, QuickServices.tsx) may be used elsewhere or may be needed in the future. The simplest approach is to remove the component imports and usage from the homepage `page.tsx`.

**Files affected**:
- `frontend-next/src/app/page.tsx` — Remove StatsAchievements and QuickServices/electronic services section rendering

**Alternatives considered**:
- Delete component files entirely: Rejected. Components may be referenced elsewhere. Removing from homepage is sufficient and simpler.
- Feature flag to hide: Over-engineering for a permanent removal.

---

## R-009: Content Updates (FAQ, Terms, Privacy Policy)

**Decision**: Update content through database seeders and/or admin panel, plus frontend translation keys

**Rationale**: Tasks 22-23 (FAQ updates), 33-34 (Terms of use), and 35 (Privacy policy) involve content changes. The backend uses a Content model with seeders. Static page content may be in translation keys or fetched from API. The approach depends on how each page currently sources its content.

**Files affected**:
- `backend/database/seeders/ContentSeeder.php` — Update FAQ and terms content
- `frontend-next/src/contexts/LanguageContext.tsx` — Update any hardcoded FAQ/terms translation keys
- `frontend-next/src/app/terms/page.tsx` — Remove specific sections
- `frontend-next/src/app/privacy-policy/page.tsx` — Update date
- `frontend-next/src/app/faq/page.tsx` or `frontend-next/src/components/FAQSection.tsx` — Remove/update specific FAQs

**Alternatives considered**:
- Admin panel content management only: May not cover hardcoded frontend content. Combined approach needed.

---

## R-010: English Translation Coverage

**Decision**: Expand existing LanguageContext translation keys to cover all content areas currently missing English translations

**Rationale**: Tasks 38-40 require English translation for news, complaints/suggestions, and general content. The LanguageContext already supports English with 650+ keys, but coverage is incomplete. The fix is to audit all user-visible strings and add missing English translations.

**Files affected**:
- `frontend-next/src/contexts/LanguageContext.tsx` — Add missing English translation keys for news, complaints, suggestions, and general content sections

**Alternatives considered**:
- Machine translation integration: Over-engineering. Manual translation of known UI strings is sufficient.
- Separate translation files per page: Would require architectural change. Current single-context approach works for the current scale.
