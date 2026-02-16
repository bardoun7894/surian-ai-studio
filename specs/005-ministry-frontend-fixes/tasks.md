# Tasks: Ministry Portal Comprehensive Amendments

**Input**: Design documents from `/specs/005-ministry-frontend-fixes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-additions.yaml
**Tests**: Not requested - no test tasks included
**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Tailwind config, type definitions, and API layer additions shared across stories

- [x] T001 [P] Add `shadow-gov` hover utility (`box-shadow: 5px 5px 10px #b9a779`) to `frontend-next/tailwind.config.ts`
- [x] T002 [P] Add `Favorite` and `AutocompleteSuggestion` type interfaces to `frontend-next/src/types/index.ts`
- [x] T003 [P] Add favorites API methods (list, add, remove, check) and search autocomplete API method to `frontend-next/src/lib/repository.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reusable components and backend infrastructure that multiple user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Shared Components

- [x] T004 [P] Create `Breadcrumbs` component in `frontend-next/src/components/Breadcrumbs.tsx` — pathname-based trail with Arabic/English labels, RTL support, dark mode
- [x] T005 [P] Create `ScrollToTop` button component in `frontend-next/src/components/ScrollToTop.tsx` — appears after 300px scroll, RTL-aware positioning, dark mode
- [x] T006 [P] Create `SkeletonLoader` components (SkeletonText, SkeletonCard, SkeletonList, SkeletonGrid) in `frontend-next/src/components/SkeletonLoader.tsx` — animate-pulse placeholders, dark mode

### Backend: Favorites API (US4 prerequisite)

- [x] T007 [P] Create favorites database migration in `backend/database/migrations/2026_02_10_100000_create_favorites_table.php` — user_id, content_type, content_id, metadata with unique constraint and soft deletes (data-model.md)
- [x] T008 [P] Create `Favorite` Eloquent model in `backend/app/Models/Favorite.php` — user relationship, soft deletes, metadata cast
- [x] T009 Create `FavoriteController` in `backend/app/Http/Controllers/FavoriteController.php` — index (with type filter), store (with 409 on duplicate + soft-delete restore), destroy (soft-delete), check endpoints (contracts/api-additions.yaml)
- [x] T010 Register favorites API routes in `backend/routes/api.php` — GET/POST /favorites, DELETE /favorites/{type}/{id}, POST /favorites/check under auth:sanctum middleware

### Backend: Search Autocomplete (US13 prerequisite)

- [x] T011 [P] Create `SearchAutocompleteController` in `backend/app/Http/Controllers/Api/SearchAutocompleteController.php` — searches Content, Service, FAQ with 5-minute caching (contracts/api-additions.yaml)
- [x] T012 Register autocomplete route `GET /api/v1/public/search/autocomplete` in `backend/routes/api.php`

### Backend: Directorate Map (US18 prerequisite)

- [x] T013 [P] Create migration to add latitude, longitude, address_ar, address_en to directorates table in `backend/database/migrations/2026_02_10_100001_add_location_to_directorates_table.php` (data-model.md)
- [x] T014 [P] Update `Directorate` model in `backend/app/Models/Directorate.php` — add location fields to $fillable and $casts
- [x] T015 Create `DirectorateMapController` in `backend/app/Http/Controllers/Api/DirectorateMapController.php` — public map endpoint (cached), admin updateLocation endpoint with audit logging (contracts/api-additions.yaml)
- [x] T016 Register directorate map routes in `backend/routes/api.php` — GET /public/directorates/map (before {id} wildcard), PUT /admin/directorates/{id}/location

### Backend: Admin Settings Seed (US15 prerequisite)

- [x] T017 [P] Create migration to seed portal admin settings (investment_section_enabled, complaint/suggestion rules ar/en) in `backend/database/migrations/2026_02_10_100002_seed_portal_admin_settings.php` — existing SettingsController handles CRUD

**Checkpoint**: Foundation ready — all backend APIs operational, shared components available. User story implementation can begin.

---

## Phase 3: User Story 1 — Mobile-First Responsive Experience (Priority: P1) 🎯 MVP

**Goal**: Portal displays correctly on all mobile screen sizes (320px+) with no overflow, clipping, or element overlap

**Independent Test**: Load every page on 320px, 375px, 428px viewports and verify no visual breakage

- [x] T018 [P] [US1] Fix header logo responsive scaling in `frontend-next/src/components/Navbar.tsx` — prevent stretching/overlapping on small screens (FR-002)
- [x] T019 [P] [US1] Fix news card images to fill full top width without white padding in `frontend-next/src/app/news/page.tsx` and related card components (FR-003)
- [x] T020 [P] [US1] Fix media center grid/list view alignment and consistent sizing on mobile in `frontend-next/src/app/media/page.tsx` (FR-004)
- [x] T021 [US1] Audit and fix all pages for mobile overflow, clipping, and element overlap — systematic review of all page components at 320px breakpoint (FR-001)

**Checkpoint**: All pages render correctly on mobile viewports

---

## Phase 4: User Story 2 — Authentication & Login Flow (Priority: P1)

**Goal**: Login → 2FA → dashboard flow works flawlessly with proper back-navigation prevention and forgot password

**Independent Test**: Complete full auth flow, test window switching during 2FA, test back button after auth, test forgot password

- [x] T022 [P] [US2] Fix 2FA page to handle browser window visibility changes gracefully in `frontend-next/src/app/(auth)/two-factor/page.tsx` — loading state persists when user switches away and returns (FR-005)
- [x] T023 [P] [US2] Prevent back-navigation to login/2FA pages after authentication in `frontend-next/src/contexts/AuthContext.tsx` or auth layout — use router.replace and history management (FR-006)
- [x] T024 [P] [US2] Fix "Forgot Password" flow in `frontend-next/src/app/(auth)/forgot-password/page.tsx` — ensure end-to-end password recovery works (FR-007)
- [x] T025 [US2] Add WhatsApp support contact option to login page in `frontend-next/src/app/(auth)/login/page.tsx` (FR-008)
- [x] T026 [US2] Make green branding section sticky (fixed/non-scrolling) on login page in `frontend-next/src/app/(auth)/login/page.tsx` (FR-009)

**Checkpoint**: Full authentication flow works reliably

---

## Phase 5: User Story 3 — Complaints & Suggestions System (Priority: P1)

**Goal**: Complete complaints/suggestions lifecycle with proper statuses, ratings, entity display, and configurable rules

**Independent Test**: Submit complaint → track → verify status display → test rating at submission and resolution

- [x] T027 [P] [US3] Display receiving entity/department when user selects a complaint form type in `frontend-next/src/app/complaints/page.tsx` (FR-010)
- [x] T028 [P] [US3] Add dual rating UI — submission rating prompt after complaint submission, resolution rating prompt when viewing completed complaint in `frontend-next/src/app/complaints/page.tsx` and tracking views (FR-011)
- [x] T029 [P] [US3] Enforce valid complaint status display: only show Received (واردة), In Progress (قيد المعالجة), Completed/Responded (منتهية/تم الرد عليها) in complaint tracking UI (FR-012)
- [x] T030 [US3] Add file upload progress bar showing live upload percentage in complaint and suggestion forms — update `frontend-next/src/components/SuggestionsForm.tsx` and complaint form components (FR-015)
- [x] T031 [US3] Display configurable complaint/suggestion submission rules (from admin settings API) on complaints and suggestions pages (FR-016)
- [x] T032 [US3] Verify suggestion tracking works for both known-identity and anonymous submissions in `frontend-next/src/app/suggestions/page.tsx` (FR-013)

**Checkpoint**: Complaints and suggestions system fully functional with ratings and rules

---

## Phase 6: User Story 4 — Favorites & Personalization (Priority: P2)

**Goal**: Users can favorite content from anywhere and view all favorites in their profile

**Independent Test**: Favorite news/announcement/service/law items, verify they appear in profile favorites tab

**Dependencies**: Backend favorites API (T007–T010 ✅), Frontend favorites API (T003 ✅), Profile favorites tab (T033 already done)

- [x] T033 [P] [US4] Add favorites tab to profile page showing saved content in `frontend-next/src/app/(protected)/profile/page.tsx` — grid display with remove functionality
- [x] T034 [US4] Replace news card save/bookmark icon with heart/favorite icon across all news card components — use Lucide `Heart` icon, integrate with favorites API (FR-018)
- [x] T035 [US4] Add favorite toggle button (heart icon) to announcement, service, and law detail pages — integrate with favorites check/add/remove API (FR-017)

**Checkpoint**: Favorites work end-to-end across all content types

---

## Phase 7: User Story 5 — Homepage & Hero Section Improvements (Priority: P2)

**Goal**: Updated hero section with eagle emblem, news ticker, animated taglines, triangular departments, and new content sections

**Independent Test**: Load homepage and verify each visual element matches specification

- [x] T036 [P] [US5] Update eagle emblem in hero section — make larger, add shadow effect, implement cursor-following animation, remove pulsing animation in `frontend-next/src/app/page.tsx` (FR-020)
- [x] T037 [P] [US5] Redesign news ticker — narrower width, position within hero section, reverse scroll direction in `frontend-next/src/app/page.tsx` (FR-021)
- [x] T038 [US5] Implement animated/rotating taglines ("Secure Portal", "Integrated Services", "Digital Future") replacing static display in `frontend-next/src/app/page.tsx` (FR-022)
- [x] T039 [US5] Redesign department cards to triangular arrangement with smaller, more visually appealing cards in `frontend-next/src/app/page.tsx` (FR-023)
- [x] T040 [US5] Update hero section buttons per ministry specification and reduce excess whitespace in `frontend-next/src/app/page.tsx` (FR-024, FR-025)
- [x] T041 [US5] Add complaints section before quick links on homepage in `frontend-next/src/app/page.tsx` (FR-026)
- [x] T042 [US5] Add suggestions section after affiliated entities on homepage in `frontend-next/src/app/page.tsx` (FR-027)
- [x] T043 [US5] Remove "Stay Updated" newsletter section from homepage content (keep in footer only) in `frontend-next/src/app/page.tsx` (FR-028)
- [x] T044 [US5] Add user satisfaction indicator (مؤشر الرضا) above AI chatbot icon on homepage in `frontend-next/src/app/page.tsx` (FR-029)

**Checkpoint**: Homepage hero and sections match ministry specification

---

## Phase 8: User Story 6 — Directorate & Organizational Structure (Priority: P2)

**Goal**: Each directorate has its own homepage-like page with specific content, hierarchical structure display

**Independent Test**: Click each directorate and sub-directorate, verify correct routing and content

- [x] T045 [US6] Rename "Directorates" page to "Organizational Structure" (الهيكل التنظيمي) with hierarchical display format in `frontend-next/src/app/directorates/page.tsx` and navigation labels in `frontend-next/src/contexts/LanguageContext.tsx` (FR-033)
- [x] T046 [US6] Enhance directorate detail page to homepage-like layout with directorate-specific news, services, contact info, sub-directorates in `frontend-next/src/app/directorates/[id]/page.tsx` (FR-030, FR-031)
- [x] T047 [US6] Create sub-directorate detail view showing specific information (description, contact phone/email, working hours) in `frontend-next/src/app/directorates/[id]/sub-directorates/page.tsx` or as expandable sections (FR-032)
- [x] T048 [US6] Ensure contact information is directorate-specific (not generic ministry-wide) on each directorate page (FR-034)

**Checkpoint**: Directorate navigation and pages work correctly with hierarchical structure

---

## Phase 9: User Story 7 — Internationalization & Translation (Priority: P2)

**Goal**: Complete English translations across all portal content, forms, and messages

**Independent Test**: Switch to English and verify every page, form, and message displays correctly

- [x] T049 [P] [US7] Fix news article publish date/time to display in English format when English is selected in `frontend-next/src/app/news/[id]/page.tsx` and news card components (FR-035)
- [x] T050 [P] [US7] Add English translation for newsletter subscription success/error messages in `frontend-next/src/contexts/LanguageContext.tsx` (FR-036)
- [x] T051 [P] [US7] Complete English translation of complaints general form — all labels, placeholders, messages in complaint form components (FR-037)
- [x] T052 [P] [US7] Complete English translation of announcements page in `frontend-next/src/app/announcements/page.tsx` (FR-038)

**Checkpoint**: All identified translation gaps resolved

---

## Phase 10: User Story 8 — Navigation, Loading & UX Improvements (Priority: P2)

**Goal**: Breadcrumbs on all inner pages, branded loading, skeleton states, scroll-to-top, card hover shadows

**Independent Test**: Navigate between pages verifying breadcrumbs, loading states, skeleton loaders, scroll-to-top

**Dependencies**: Shared components (T004–T006 ✅)

- [x] T053 [US8] Integrate `Breadcrumbs` component into all inner page layouts — add to root layout or per-page basis ensuring every inner page shows breadcrumb trail (FR-039)
- [x] T054 [P] [US8] Create branded loading indicator component (eagle emblem + loading animation) and integrate into page transitions in `frontend-next/src/components/LoadingSpinner.tsx` or new `BrandedLoader.tsx` (FR-040)
- [x] T055 [US8] Integrate `SkeletonLoader` components into all content-loading pages — replace blank loading states with skeleton placeholders across news, announcements, services, media, directorates pages (FR-041)
- [x] T056 [US8] Integrate `ScrollToTop` component into root layout ensuring it appears on all pages in `frontend-next/src/app/layout.tsx` (FR-042)
- [x] T057 [US8] Apply `shadow-gov` hover effect to all card components across the portal — news cards, service cards, announcement cards, directorate cards (FR-043)

**Checkpoint**: Navigation and loading UX improvements active across all pages

---

## Phase 11: User Story 9 — Media Center & Content Fixes (Priority: P2)

**Goal**: All media loads/plays correctly, unified filters, pagination across listing pages

**Independent Test**: Play videos (check audio), filter media, verify pagination on content listing pages

- [x] T058 [P] [US9] Fix media loading to ensure all media types (video, photo, infographic) load and display correctly in `frontend-next/src/app/media/page.tsx` (FR-044)
- [x] T059 [P] [US9] Fix video playback to include working audio — check video element attributes and YouTube iframe parameters in `frontend-next/src/app/media/page.tsx` (FR-045)
- [x] T060 [US9] Add download and share buttons to media cards in `frontend-next/src/app/media/page.tsx` (FR-046)
- [x] T061 [US9] Unify filter design on announcements, laws, and FAQ pages to match news page filter pattern in `frontend-next/src/app/announcements/page.tsx`, `frontend-next/src/app/faq/page.tsx` — extract reusable ContentFilter component per research.md R2 (FR-047)
- [x] T062 [US9] Add pagination to media center, announcements, and services listing pages (FR-048)
- [x] T063 [P] [US9] Fix uniform announcement card sizes in `frontend-next/src/app/announcements/page.tsx` and remove duplicate filter buttons (FR-049, FR-050)
- [x] T064 [US9] Fix AI summary button on single news article page in `frontend-next/src/app/news/[id]/page.tsx` — debug API call, add proper loading/error states (FR-051)
- [x] T065 [US9] Add filtering capability to electronic services page in `frontend-next/src/components/DirectorateDetail.tsx` (FR-052)

**Checkpoint**: Media center fully functional, consistent filters and pagination across content pages

---

## Phase 12: User Story 10 — Form Validation & Input Improvements (Priority: P2)

**Goal**: All forms show clear validation messages with visual indicators, phone country codes, clickable contacts

**Independent Test**: Enter invalid data in every form field, verify validation messages and visual styling

- [x] T066 [US10] Implement form validation visual indicators (green border for valid, red border + error message for invalid) across all forms — complaints, suggestions, contact, registration, profile in shared form components (FR-053)
- [x] T067 [US10] Add country code selector to all phone number input fields across the portal — complaints, suggestions, contact forms, profile (FR-054)
  - Create `src/components/ui/PhoneInput.tsx` reusable component.
  - Integration with `ComplaintPortal.tsx`, `SuggestionsForm.tsx`, `ContactSection.tsx`.
  - Update validation logic to support international formats.
- [x] T068 [US10] Make all phone numbers and email addresses clickable links (tel: and mailto:) across the portal — contact page, directorate pages, footer (FR-055)
  - [x] Footer.tsx
  - [x] ContactSection.tsx
  - [x] DirectorateDetail.tsx & SubDirectorateDetail.tsx
**Checkpoint**: Form validation and input improvements complete across all forms

---

## Phase 13: User Story 14 — Profile & Settings Management (Priority: P2)

**Goal**: Profile page with password security, linked complaints, no SMS section, favorites

**Independent Test**: Modify profile settings, change password with current password requirement, verify linked complaints

- [x] T069 [P] [US14] Verify password change requires current password in `frontend-next/src/app/(protected)/profile/page.tsx` — already implemented
- [x] T070 [P] [US14] Verify user's complaints are linked and displayed in profile complaints tab — already implemented
- [x] T071 [P] [US14] Verify SMS notification section is removed from `frontend-next/src/app/settings/notifications/page.tsx` — already implemented
- [x] T072 [US14] Verify favorites section displays in profile page — already implemented (T033)

**Checkpoint**: Profile and settings management complete

---

## Phase 14: User Story 11 — Footer & Header Updates (Priority: P3)

**Goal**: Updated branding in header and footer per ministry specification

**Independent Test**: Check header/footer elements on any page against specification

- [x] T073 [P] [US11] Update header logo to provided new logo file in `frontend-next/src/components/Navbar.tsx` (FR-056)
- [x] T074 [P] [US11] Reorder header elements per ministry specification in `frontend-next/src/components/Navbar.tsx` (FR-057)
- [x] T075 [US11] Replace footer quick links with social media page links in `frontend-next/src/components/Footer.tsx` (FR-058)
- [x] T076 [US11] Change footer gold line color to green, update copyright to "Ministry of Economy and Industry", shorten tagline to "The trusted source for information and services." in `frontend-next/src/components/Footer.tsx` (FR-059, FR-060, FR-061)

**Checkpoint**: Header and footer match ministry branding specification

---

## Phase 15: User Story 12 — Dark Mode Consistency (Priority: P3)

**Goal**: Consistent dark mode styling across all pages with proper contrast

**Independent Test**: Enable dark mode and check every page for visual consistency

- [x] T077 [P] [US12] Fix contact page work hours card to match other card styles in dark mode in `frontend-next/src/app/contact/page.tsx` (FR-062) — already implemented
- [x] T078 [US12] Audit and fix all pages for dark mode contrast issues — ensure all icons and text maintain proper contrast without overlapping across all pages (FR-063)

**Checkpoint**: Dark mode consistent across all portal pages

---

## Phase 16: User Story 13 — Chatbot & Search Intelligence (Priority: P3)

**Goal**: AI chatbot trained on portal content with correct ministry name, search autocomplete in UI

**Independent Test**: Ask chatbot portal-specific questions, test search autocomplete

**Dependencies**: Autocomplete backend (T011–T012 ✅)

- [x] T079 [US13] Update chatbot training data/prompts with current portal content and correct ministry name ("Ministry of Economy and Industry") in AI service configuration (FR-064, FR-065)
- [x] T080 [US13] Position chatbot icon on the left side in Arabic version with auto-hiding tooltip in `frontend-next/src/components/` chatbot component (FR-066)
- [x] T081 [US13] Implement search autocomplete UI — show dropdown suggestions as user types in search bar, integrate with `GET /api/v1/public/search/autocomplete` endpoint in `frontend-next/src/components/Navbar.tsx` or dedicated search component (FR-067)

**Checkpoint**: Chatbot responds accurately, search suggests matches while typing

---

## Phase 17: User Story 15 — Admin Dashboard Controls (Priority: P3)

**Goal**: Admins can manage complaint/suggestion rules, investment section toggle, and announcements

**Independent Test**: Log in as admin, toggle settings, verify changes on public portal

**Dependencies**: Backend settings seed (T017 ✅)

- [x] T082 [US15] Create admin settings management page for complaint/suggestion rules editor and investment section toggle — frontend admin page or integrate with existing admin panel (FR-071, FR-072)
- [x] T083 [US15] Implement investment section conditional visibility on public portal based on `investment_section_enabled` setting — read setting via public settings API and conditionally render in `frontend-next/src/app/page.tsx` (FR-072)
- [x] T084 [US15] Verify announcement management is accessible from admin dashboard (FR-073)

**Checkpoint**: Admin controls functional and affecting public portal

---

## Phase 18: User Story 16 — Animations & Visual Polish (Priority: P3)

**Goal**: Scroll-triggered animations throughout the portal, interactive card hover effects

**Independent Test**: Scroll through pages and verify animations trigger on scroll and hover

- [x] T085 [US16] Implement scroll-triggered entrance animations on homepage sections (similar to media center section) using GSAP or Framer Motion in `frontend-next/src/app/page.tsx` (FR-075)
- [x] T086 [US16] Add scroll-triggered animations to inner content pages (news listing, services, directorates) for section entrances (FR-075)

**Checkpoint**: Animations active on scroll across key pages

---

## Phase 19: User Story 17 — FAQ Content Update (Priority: P3)

**Goal**: Anonymous complaint FAQ answer updated to clarify identity privacy

**Independent Test**: View FAQ page and find the anonymous complaint question

- [x] T087 [US17] Update anonymous complaint FAQ answer — ensure the last section reads "ولن يطلع عليه أحد" (and no one will see it) via admin FAQ management or direct content update (FR-076)

**Checkpoint**: FAQ content accurately reflects anonymous complaint privacy

---

## Phase 20: User Story 18 — Map & Directorate Locations (Priority: P3)

**Goal**: Interactive map showing directorate pins at geographic locations

**Independent Test**: View map, verify directorate pins appear at correct locations

**Dependencies**: Backend map API (T013–T016 ✅)

- [x] T088 [US18] Implement interactive Syria map component using `react-simple-maps` (already installed) showing directorate location pins — read from `GET /api/v1/public/directorates/map` endpoint in new `frontend-next/src/components/DirectorateMap.tsx` (FR-074)
- [x] T089 [US18] Add click interaction to directorate map pins showing directorate info popup/tooltip with name, address, and link to directorate page (FR-074)
- [x] T090 [US18] Integrate map component into appropriate page (directorates/organizational structure page or dedicated map page)

**Checkpoint**: Interactive map displays directorates at correct geographic locations

---

## Phase 21: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T091 Run ESLint check across entire frontend codebase — fix any lint errors introduced by changes
- [x] T092 Verify WCAG 2.1 AA compliance — check color contrast, keyboard navigation, screen reader labels on all modified pages
- [x] T093 Performance audit — verify <200ms page load target (p95) with skeleton loaders, check bundle size impact
- [x] T094 Run quickstart.md manual testing checklist — dark mode all pages, English all pages, mobile viewports, auth flow, complaint submission, media playback
- [x] T095 Verify civil registry future integration architecture — ensure no hard blocks on external service integration (FR-077)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** ✅: Complete — shared infrastructure ready
- **Foundational (Phase 2)** ✅: Complete — backend APIs operational, shared components available
- **User Stories (Phase 3+)**: Can proceed in priority order or in parallel
- **Polish (Phase 21)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Mobile)**: Independent — can start immediately
- **US2 (Auth)**: Independent — can start immediately
- **US3 (Complaints)**: Independent — can start immediately
- **US4 (Favorites)**: Backend complete ✅ — frontend work can proceed
- **US5 (Homepage)**: Independent — can start immediately
- **US6 (Directorates)**: Independent — can start immediately
- **US7 (Translation)**: Independent — can start immediately
- **US8 (Navigation/Loading)**: Components complete ✅ — integration work can proceed
- **US9 (Media Center)**: Independent — can start immediately
- **US10 (Forms)**: Independent — can start immediately
- **US11 (Header/Footer)**: Independent — can start immediately
- **US12 (Dark Mode)**: Independent — can start immediately
- **US13 (Chatbot/Search)**: Backend complete ✅ — frontend work can proceed
- **US14 (Profile)**: Complete ✅
- **US15 (Admin)**: Backend complete ✅ — frontend admin controls needed
- **US16 (Animations)**: Independent — can start immediately
- **US17 (FAQ)**: Independent — can start immediately (admin data update)
- **US18 (Map)**: Backend complete ✅ — frontend map component needed

### Cross-Story Dependencies

- **US8 (Navigation)** integrates components into all pages — best done after other page changes to avoid merge conflicts
- **US12 (Dark Mode)** audit should run after major UI changes are complete
- **US16 (Animations)** should be added after page layouts are stable

### Parallel Opportunities

All P1 stories (US1, US2, US3) can run in parallel as they touch different files:
- US1: Responsive fixes (various page CSS)
- US2: Auth pages (`(auth)/` directory)
- US3: Complaints/suggestions pages (`complaints/`, `suggestions/`)

All P2 stories can run in parallel after P1:
- US4: Favorites (news cards, detail pages)
- US5: Homepage (`page.tsx`)
- US6: Directorates (`directorates/`)
- US7: Translation (`LanguageContext.tsx`, various pages)
- US8: Navigation (layout integration)
- US9: Media (`media/`, `announcements/`, `news/[id]`)
- US10: Forms (shared form components)

---

## Parallel Example: P1 Stories

```bash
# Launch all P1 stories in parallel (different files, no conflicts):
Agent 1: US1 — Mobile responsive fixes (T018–T021)
Agent 2: US2 — Authentication flow fixes (T022–T026)
Agent 3: US3 — Complaints & suggestions system (T027–T032)
```

## Parallel Example: Within US5 (Homepage)

```bash
# Launch parallel tasks within homepage story:
Task: T036 — Eagle emblem updates (hero section top)
Task: T037 — News ticker redesign (hero section mid)
Task: T038 — Animated taglines (hero section text)
# Then sequential:
Task: T039 — Department cards layout (depends on hero area)
Task: T040–T044 — Remaining sections (sequential, same file)
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. ~~Phase 1: Setup~~ ✅
2. ~~Phase 2: Foundational~~ ✅
3. Phase 3: US1 — Mobile Responsiveness
4. Phase 4: US2 — Authentication Flow
5. Phase 5: US3 — Complaints & Suggestions
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo critical fixes

### Incremental Delivery

1. ~~Setup + Foundational~~ ✅ → Foundation ready
2. P1 stories (US1–US3) → Test → Deploy (Critical fixes!)
3. P2 stories (US4–US10, US14) → Test → Deploy (Major features)
4. P3 stories (US11–US13, US15–US18) → Test → Deploy (Polish)
5. Phase 21: Polish → Final validation → Release

### Current Progress

| Phase | Status | Tasks |
|-------|--------|-------|
| Setup (Phase 1) | ✅ Complete | T001–T003 |
| Foundational (Phase 2) | ✅ Complete | T004–T017 |
| US1 Mobile (Phase 3) | ✅ Complete | T018–T021 |
| US2 Auth (Phase 4) | ✅ Complete | T022–T026 |
| US3 Complaints (Phase 5) | ✅ Complete | T027–T032 |
| US4 Favorites (Phase 6) | ✅ Complete | T033–T035 |
| US5 Homepage (Phase 7) | ✅ Complete | T036–T044 |
| US6 Directorates (Phase 8) | ✅ Complete | T045–T048 |
| US7 Translation (Phase 9) | ✅ Complete | T049–T052 |
| US8 Navigation (Phase 10) | ✅ Complete | T053–T057 |
| US9 Media (Phase 11) | ✅ Complete | T058–T065 |
| US10 Forms (Phase 12) | ✅ Complete | T066–T068 |
| US14 Profile (Phase 13) | ✅ Complete | T069–T072 |
| US11 Header/Footer (Phase 14) | ✅ Complete | T073–T076 |
| US12 Dark Mode (Phase 15) | ✅ Complete | T077–T078 |
| US13 Chatbot/Search (Phase 16) | ✅ Complete | T079–T081 |
| US15 Admin (Phase 17) | ✅ Complete | T082–T084 |
| US16 Animations (Phase 18) | ✅ Complete | T085–T086 |
| US17 FAQ (Phase 19) | ✅ Complete | T087 |
| US18 Map (Phase 20) | ✅ Complete | T088–T090 |
| Polish (Phase 21) | ✅ Complete | T091–T095 |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Backend tasks (T007–T017) are ALL COMPLETE ✅ — only frontend work remains
- T076 and T085 from the previous tasks.md (Filament admin UI) are NOT included — Filament is not installed in this project
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
