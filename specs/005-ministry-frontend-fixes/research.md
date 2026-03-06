# Research: Ministry Portal Comprehensive Amendments

**Feature**: 005-ministry-frontend-fixes
**Date**: 2026-02-10

## R1: Mobile Responsiveness Strategy

**Decision**: Use Tailwind CSS responsive breakpoints with mobile-first approach
**Rationale**: The project already uses Tailwind 3.4.1 with responsive utilities. All existing components follow mobile-first patterns (sm:, md:, lg: prefixes). No new framework needed.
**Alternatives considered**:
- CSS Container Queries: Not needed; standard responsive design is sufficient
- Separate mobile components: Over-engineering; responsive Tailwind classes handle all cases

## R2: Unified Filter Component Pattern

**Decision**: Extract the news page filter pattern into a reusable `ContentFilter` component, then apply to announcements, laws, and FAQ pages
**Rationale**: The news page uses directorate-based filtering with month/year selectors. Announcements currently use type/category/month/year filters. Standardizing to a single filter pattern reduces code duplication and ensures visual consistency per ministry request.
**Alternatives considered**:
- Copy-paste news filter into each page: Simpler but violates DRY
- Third-party filter library: Unnecessary dependency for simple category/date filtering

## R3: Favorites System Architecture

**Decision**: New `favorites` table in PostgreSQL with polymorphic relationship (content_type + content_id), exposed via REST API
**Rationale**: Users need to favorite news, announcements, services, and laws. Polymorphic approach is the simplest model that supports all content types without separate tables per type. Laravel's morphTo relationship handles this natively.
**Alternatives considered**:
- Separate tables (favorite_news, favorite_announcements): More tables, more code, no benefit
- Frontend-only (localStorage): Not persistent across devices, doesn't meet spec requirement

## R4: Breadcrumb Implementation

**Decision**: Create a `Breadcrumbs` component that reads the Next.js pathname and maps segments to labels using a route config
**Rationale**: Next.js App Router provides `usePathname()`. A simple mapping from path segments to Arabic/English labels covers all inner pages. No external breadcrumb library needed.
**Alternatives considered**:
- next-breadcrumbs package: Adds dependency for a simple feature
- Server-side breadcrumbs: Unnecessary complexity for client-side rendering

## R5: Skeleton Loading Strategy

**Decision**: Create reusable skeleton components (SkeletonCard, SkeletonList, SkeletonText) using Tailwind's `animate-pulse` on placeholder divs
**Rationale**: Tailwind already provides the `animate-pulse` utility. No new dependency needed. Each page wraps its content in a skeleton while loading state is true.
**Alternatives considered**:
- react-loading-skeleton package: Adds dependency for something achievable with pure Tailwind
- CSS @keyframes custom animation: More work than Tailwind utility

## R6: Directorate Page Restructuring

**Decision**: Enhance existing `/directorates/[id]/page.tsx` to render a homepage-like layout with directorate-specific data (news, services, contact info, sub-directorates)
**Rationale**: The backend already supports `GET /api/v1/public/directorates/{id}`, `GET /api/v1/public/directorates/{id}/services`, and `GET /api/v1/public/directorates/{id}/news`. The frontend route `/directorates/[id]` exists. Simply needs enhanced content layout.
**Alternatives considered**:
- New page structure per directorate: Over-engineering; dynamic routing handles this

## R7: Translation Completeness Strategy

**Decision**: Add missing translation keys to LanguageContext translations object for all identified gaps (newsletter messages, date formats, complaint forms)
**Rationale**: The existing `useLanguage()` hook and `t()` function handle all translations. Missing translations just need new key-value pairs added to the translations dictionary.
**Alternatives considered**:
- i18next library: Over-engineering for a system that already has a working translation pattern
- JSON translation files: Would require refactoring existing inline translations

## R8: Media Center Video Fix

**Decision**: Debug and fix the `API.media.getByType()` call and video player modal in `/media/page.tsx`
**Rationale**: The media page code is structurally correct (has video modal with YouTube detection and native video player). The issue is likely that `API.media.getByType()` returns empty data or the video URLs are malformed. Fix involves ensuring the API returns proper media data and the video element has correct attributes.
**Alternatives considered**:
- Replace with third-party video player (video.js, plyr): Unnecessary complexity; native HTML5 video and YouTube iframes are sufficient

## R9: AI Summary Button Fix

**Decision**: Debug the `API.ai.summarize()` call on the news detail page and ensure proper error handling
**Rationale**: The API endpoint `POST /api/v1/ai/summarize` exists in repository.ts. The button likely fails due to CORS, auth, or the AI service being unavailable. Fix involves proper error handling and loading state.
**Alternatives considered**:
- Client-side summarization: Not feasible for a government portal; server-side AI is appropriate

## R10: Card Hover Shadow Standard

**Decision**: Apply `box-shadow: 5px 5px 10px #b9a779` on hover using a Tailwind custom utility or inline style
**Rationale**: Ministry specifically requested this exact shadow value. Add as a Tailwind utility class `hover:shadow-gov` in tailwind.config.ts.
**Alternatives considered**:
- Inline styles: Works but less maintainable than a Tailwind utility
- CSS module: Unnecessary; Tailwind config is the standard approach

## R11: Map Integration for Directorates

**Decision**: Use existing `react-simple-maps` (already a dependency) to display directorate locations
**Rationale**: react-simple-maps 3.0 is already installed. Can render a Syria map with pins for each directorate's geographic coordinates stored in the database.
**Alternatives considered**:
- Leaflet/MapboxGL: Heavier dependencies, react-simple-maps already available
- Google Maps: Requires API key and external service dependency

## R12: Newsletter Translation

**Decision**: Add English translation key for newsletter subscription result message in LanguageContext
**Rationale**: The `ApiNewsletterRepository.subscribe()` returns `{ success, message }` from the backend. The frontend needs to either use the backend message directly (if backend returns English) or translate a standard success/error message client-side.
**Alternatives considered**:
- Backend returns localized messages: Would require Accept-Language header handling in Laravel
