# Tasks: Frontend UI Fixes and Improvements

**Input**: Design documents from `/specs/002-frontend-fixes/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not requested. No test tasks included.

**Organization**: Tasks are grouped by user story (18 stories from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend-next/src/`
- **Backend**: `backend/app/`
- **Routes**: `backend/routes/`

---

## Phase 1: Setup

**Purpose**: No new project setup required. This feature modifies an existing codebase. Phase 1 confirms the working environment.

- [x] T001 Verify development environment is running with `docker-compose -f docker-compose.dev.yml up -d` and confirm frontend at localhost:3002 and backend at localhost:8002

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared translation keys and dark mode base changes that multiple user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add missing Arabic error/validation translation keys to `frontend-next/src/contexts/LanguageContext.tsx` — add keys for registration errors, complaint form errors, newsletter errors, general validation messages (e.g., `validation_national_id_max`, `validation_phone_max`, `validation_email_invalid`, `validation_dob_invalid`, `error_generic`, `error_required_field`)
- [x] T003 Add missing English translation keys to `frontend-next/src/contexts/LanguageContext.tsx` — add keys for news content, complaints/suggestions section, FAQ content, and any missing UI labels to ensure full English coverage when language is set to English
- [x] T004 Update dark mode background color from `#094239` to `#000000` in `frontend-next/src/contexts/ThemeContext.tsx` — change the dark mode CSS variable `--background` value
- [x] T005 Update dark mode CSS variables and any hardcoded dark mode color references in `frontend-next/src/app/globals.css` to use black (#000000) background instead of forest green (#094239)
- [x] T006 Update label translation keys in `frontend-next/src/contexts/LanguageContext.tsx` — change "Track Request Status" (متابعة حالة طلب) to "Track Complaint Status" (متابعة حالة شكوى) in both Arabic and English, rename "Announcements and Notifications" to "Announcements" (الإعلانات) in both languages

**Checkpoint**: Foundation ready — all user stories can now reference updated translation keys and dark mode base.

---

## Phase 3: User Story 1 — Registration Page Validation and UX Fixes (Priority: P1) MVP

**Goal**: Registration page enforces proper field validation, shows Arabic error messages, hides 2FA toggle, and has visible dropdowns in dark mode.

**Independent Test**: Navigate to /register, test all field validations, switch to Arabic, verify error messages, enable dark mode and check governorate dropdown visibility.

### Implementation for User Story 1

- [x] T007 [P] [US1] Add `maxLength={11}` attribute to the national ID input field in `frontend-next/src/app/(auth)/register/page.tsx` — ensure the field does not accept more than 11 characters
- [x] T008 [P] [US1] Add `maxLength={10}` attribute to the phone number input field in `frontend-next/src/app/(auth)/register/page.tsx` — ensure the field does not accept more than 10 characters
- [x] T009 [P] [US1] Add date of birth validation in `frontend-next/src/app/(auth)/register/page.tsx` — reject future dates, invalid date formats, and optionally enforce minimum age; display error using `t()` translation function
- [x] T010 [P] [US1] Add email validation in `frontend-next/src/app/(auth)/register/page.tsx` — validate email format using regex or standard validation; display error using `t()` translation function
- [x] T011 [US1] Replace all hardcoded English error message strings with `t()` calls in `frontend-next/src/app/(auth)/register/page.tsx` — ensure every validation error and form error message uses the LanguageContext translation function
- [x] T012 [US1] Update the verification code confirmation message in `frontend-next/src/app/(auth)/register/page.tsx` — change text to indicate code is sent via email only (not phone), using `t()` for both Arabic and English
- [x] T013 [US1] Remove the two-factor authentication toggle/checkbox option from `frontend-next/src/app/(auth)/register/page.tsx` — 2FA is mandatory, so the opt-in UI element must be removed
- [x] T014 [US1] Fix governorate dropdown dark mode visibility in `frontend-next/src/app/(auth)/register/page.tsx` — add proper dark mode Tailwind classes (e.g., `dark:bg-black dark:text-white dark:border-gray-600`) to the governorate select/dropdown element and its options

**Checkpoint**: Registration page fully functional with all 8 validation/UX fixes. Test at /register.

---

## Phase 4: User Story 2 — Complaint Submission Flow Fixes (Priority: P1)

**Goal**: Complaint form has template dropdown after type selection, hides open template for anonymous, shows details field only for open template, removes "select entity" and anonymous warning.

**Independent Test**: Navigate to /complaints, select anonymous and identified types, verify template dropdown, field visibility logic, and removed elements.

### Implementation for User Story 2

- [x] T015 [US2] Add complaint templates API call to `frontend-next/src/lib/repository.ts` — add function `getComplaintTemplates(anonymous?: boolean)` that calls `GET /api/v1/public/complaint-templates`
- [x] T016 [US2] Add complaint templates API endpoint in `backend/app/Http/Controllers/Api/PublicApiController.php` — implement `getComplaintTemplates()` method that returns active templates, filtering by `requires_identification` when `anonymous=true` query param is passed
- [x] T017 [US2] Register the complaint templates route in `backend/routes/api.php` — add `GET /v1/public/complaint-templates` route pointing to `PublicApiController@getComplaintTemplates`
- [x] T018 [US2] Remove the anonymous complaint warning message from `frontend-next/src/components/ComplaintPortal.tsx` — delete the message that says "الشكاوى المجهولة لن يمكن متابعتها أو الرد عليها" (anonymous complaints cannot be tracked)
- [x] T019 [US2] Add complaint template dropdown to `frontend-next/src/components/ComplaintPortal.tsx` — after user selects complaint type (identified/anonymous), show a dropdown populated from the complaint templates API; filter out "open" template when anonymous is selected
- [x] T020 [US2] Make the details/free-text input field conditionally visible in `frontend-next/src/components/ComplaintPortal.tsx` — only show the details textarea after the user selects the "open complaint" template from the dropdown
- [x] T021 [US2] Remove the "select entity" (اختر الجهة) dropdown/option from `frontend-next/src/components/ComplaintPortal.tsx`
- [x] T022 [US2] Replace hardcoded English error strings with `t()` calls in `frontend-next/src/components/ComplaintPortal.tsx` for all complaint form validation messages

**Checkpoint**: Complaint submission flow works correctly for both anonymous and identified paths. Test at /complaints.

---

## Phase 5: User Story 3 — News Page and Article Navigation Fixes (Priority: P1)

**Goal**: News articles display correctly when clicked, news section titles reflect department names, and homepage "Read More" links to article detail.

**Independent Test**: Click articles from /news and homepage, verify detail pages load without errors and correct titles display.

### Implementation for User Story 3

- [x] T023 [US3] Debug and fix the news article detail page in `frontend-next/src/app/news/[id]/page.tsx` — investigate why clicking a news article shows "عفواً، الخبر غير موجود" error; fix the article ID parameter passing and API data fetching
- [x] T024 [P] [US3] Fix the article detail rendering in `frontend-next/src/components/ArticleDetail.tsx` — ensure the component correctly handles the article data response and renders title, content, image, date, and directorate info
- [x] T025 [P] [US3] Fix the backend news article detail endpoint in `backend/app/Http/Controllers/Api/PublicApiController.php` — verify the `GET /api/v1/public/news/{id}` endpoint correctly resolves articles by ID and returns full article data
- [x] T026 [US3] Update news section titles in `frontend-next/src/components/NewsSection.tsx` — change the section title to display the appropriate department name (أخبار الوزارة / أخبار الإدارة العامة للصناعة / أخبار الإدارة العامة للتجارة / أخبار الإدارة العامة للتجارة الداخلية وحماية المستهلك) based on the directorate; add corresponding translation keys
- [x] T027 [US3] Fix "Read More" (اقرأ المزيد) button on homepage news items in `frontend-next/src/app/page.tsx` — change the link to navigate to the specific article detail page (`/news/{id}`) instead of the general news listing page (`/news`)

**Checkpoint**: News articles accessible from both news page and homepage without errors. Test at /news and homepage.

---

## Phase 6: User Story 4 — Arabic Localization and Translation Support (Priority: P2)

**Goal**: All error messages display in Arabic when Arabic is selected; English translations available for all content sections.

**Independent Test**: Switch to Arabic, trigger errors across pages; switch to English, verify content is translated.

### Implementation for User Story 4

- [x] T028 [P] [US4] Audit and replace all remaining hardcoded English error strings with `t()` calls in `frontend-next/src/components/Footer.tsx` — newsletter subscription errors must use translation keys
- [x] T029 [P] [US4] Audit and replace hardcoded English strings in `frontend-next/src/app/page.tsx` (homepage) — ensure all user-visible text uses `t()` calls
- [x] T030 [P] [US4] Audit and replace hardcoded English strings in `frontend-next/src/app/news/page.tsx` — ensure news page labels, error messages, and content labels use `t()` calls
- [x] T031 [P] [US4] Audit and replace hardcoded English strings in `frontend-next/src/app/complaints/page.tsx` and `frontend-next/src/app/suggestions/page.tsx` — ensure all labels and messages use `t()` calls
- [x] T032 [US4] Verify complete English translation coverage in `frontend-next/src/contexts/LanguageContext.tsx` — review all `t()` keys used across the codebase and ensure every key has both Arabic and English values

**Checkpoint**: All pages display correct language based on user selection. Test by switching languages across all major pages.

---

## Phase 7: User Story 5 — Dark Mode Visual Fixes (Priority: P2)

**Goal**: Dark mode uses black background with proper contrast on all elements.

**Independent Test**: Enable dark mode, navigate through all pages, check dropdowns, filters, and form elements.

### Implementation for User Story 5

- [x] T033 [P] [US5] Fix dark mode contrast for all dropdown elements across the application — search for `<select>` and dropdown components in `frontend-next/src/components/` and add appropriate `dark:` Tailwind classes for background, text, and border
- [x] T034 [P] [US5] Fix dark mode contrast for search page filters in `frontend-next/src/app/search/page.tsx` — add `dark:` Tailwind utility classes to all filter elements (selects, checkboxes, labels) to ensure visibility against black background
- [x] T035 [US5] Review and fix dark mode contrast across remaining pages — check `frontend-next/src/app/` pages for any elements that have poor contrast against the new black background (previously designed for forest green #094239)

**Checkpoint**: All pages readable in dark mode with black background. Visual review at localhost:3002.

---

## Phase 8: User Story 6 — Homepage Content and Section Fixes (Priority: P2)

**Goal**: Homepage removes statistics and e-services section, renames announcements section, and "View More" on announcements works.

**Independent Test**: Load homepage, verify stats gone, e-services gone, announcements section renamed, "View More" navigates correctly.

### Implementation for User Story 6

- [x] T036 [P] [US6] Remove the statistics/achievements section from the homepage in `frontend-next/src/app/page.tsx` — remove the `<StatsAchievements />` component import and usage, including the "1500 electronic services" stat in the hero section
- [x] T037 [P] [US6] Remove the electronic services section from the homepage in `frontend-next/src/app/page.tsx` — remove the `<QuickServices />` or equivalent electronic services component import and usage
- [x] T038 [P] [US6] Rename the "Announcements and Notifications" section title in `frontend-next/src/components/Announcements.tsx` — use the updated translation key to display "Announcements" (الإعلانات) only
- [x] T039 [US6] Fix the "View More" (عرض المزيد) button on homepage announcements in `frontend-next/src/app/page.tsx` or `frontend-next/src/components/Announcements.tsx` — make the button navigate to the specific announcement detail page (`/announcements/{id}`) instead of being non-functional

**Checkpoint**: Homepage displays correctly without stats, without e-services, with renamed announcements, and working "View More". Test at localhost:3002.

---

## Phase 9: User Story 7 — Suggestions Section Updates (Priority: P2)

**Goal**: Suggestions are included in the complaints and suggestions section with updated submission mechanism.

**Independent Test**: Navigate to /complaints or /suggestions, verify suggestions are accessible alongside complaints.

### Implementation for User Story 7

- [x] T040 [P] [US7] Update the complaints page to include suggestions navigation in `frontend-next/src/app/complaints/page.tsx` — add a tab or link to suggestions so users can access both from the same section
- [x] T041 [US7] Update the suggestions form mechanism in `frontend-next/src/components/SuggestionsForm.tsx` — review and update the submission flow per the previously agreed design (ensure the form follows the same patterns as complaint submission)

**Checkpoint**: Users can access both complaints and suggestions from a unified section. Test at /complaints and /suggestions.

---

## Phase 10: User Story 8 — Two-Factor Authentication Page (Priority: P2)

**Goal**: Dedicated 2FA verification page exists and integrates with the authentication flow.

**Independent Test**: Log in with a test account, verify redirect to /two-factor page, enter OTP code, complete authentication.

### Implementation for User Story 8

- [x] T042 [US8] Create the two-factor authentication page at `frontend-next/src/app/(auth)/two-factor/page.tsx` — build a page with OTP code input (6 digits), submit button, resend code button, and email-only messaging; use `t()` for all text; style consistently with login/register pages
- [x] T043 [US8] Update the auth flow in `frontend-next/src/contexts/AuthContext.tsx` — when login response indicates 2FA is required, redirect user to `/two-factor` page instead of completing login; after successful 2FA verification, complete the authentication flow
- [x] T044 [US8] Add 2FA verification API call to `frontend-next/src/lib/repository.ts` — add function to call `POST /api/v1/auth/two-factor/verify` with the OTP code (endpoint should already exist in backend)

**Checkpoint**: Full login flow works with 2FA redirect and verification. Test by logging in.

---

## Phase 11: User Story 9 — Footer Fixes (Priority: P3)

**Goal**: Footer has no admin login link, correct copyright year, working accessibility buttons, and localized error messages.

**Independent Test**: Scroll to footer on any page, verify all 4 fixes.

### Implementation for User Story 9

- [x] T045 [P] [US9] Remove the "admin login" (تسجيل دخول المدير) link from `frontend-next/src/components/Footer.tsx` — delete the link and its associated markup from the Quick Links section
- [x] T046 [P] [US9] Update the copyright year to "2026" in `frontend-next/src/components/Footer.tsx` — change the year in the copyright notice text
- [x] T047 [P] [US9] Fix the zoom in/zoom out/contrast accessibility buttons in `frontend-next/src/components/Footer.tsx` — ensure the font size increase, font size decrease, and high contrast toggle buttons actually modify the page styling (check if the click handlers are properly connected and functional)
- [x] T048 [US9] Replace hardcoded English newsletter subscription error messages with `t()` calls in `frontend-next/src/components/Footer.tsx` or `frontend-next/src/components/NewsletterSignup.tsx` — ensure errors display in the current interface language

**Checkpoint**: Footer displays correctly with all fixes. Test on any page.

---

## Phase 12: User Story 10 — Header Dropdown UX Improvement (Priority: P3)

**Goal**: Header dropdown menus stay visible when moving cursor toward items.

**Independent Test**: Hover over header menu items and move cursor downward, verify dropdown stays open.

### Implementation for User Story 10

- [x] T049 [US10] Fix header dropdown hover behavior in `frontend-next/src/components/Navbar.tsx` — add a delay (200-300ms) on `onMouseLeave` before hiding the dropdown, or implement a "safe zone" approach where the dropdown stays open while the cursor is moving toward the dropdown items; cancel the hide timeout if cursor re-enters the dropdown area

**Checkpoint**: Header dropdowns remain usable when navigating to sub-items. Test on desktop at localhost:3002.

---

## Phase 13: User Story 11 — FAQ Section Updates (Priority: P3)

**Goal**: "All Questions" button works or is removed, anonymous complaint FAQ updated, electronic transactions FAQ removed.

**Independent Test**: Navigate to /faq, verify button behavior, updated FAQ content, and removed FAQ.

### Implementation for User Story 11

- [x] T050 [P] [US11] Fix or remove the "All Questions" (جميع الأسئلة) button in `frontend-next/src/components/FAQSection.tsx` or `frontend-next/src/app/faq/page.tsx` — if the button has no meaningful action, remove it; if it should link to the full FAQ page, make it navigate to /faq
- [x] T051 [P] [US11] Update the anonymous complaint FAQ answer in `frontend-next/src/components/FAQSection.tsx` or in the backend seeder `backend/database/seeders/ContentSeeder.php` — change the answer to clarify that the identity of anonymous complainants is protected by the system (no one knows their identity)
- [x] T052 [US11] Remove the FAQ about electronic transaction processing time from `frontend-next/src/components/FAQSection.tsx` or from the backend seeder `backend/database/seeders/ContentSeeder.php` — this FAQ is irrelevant as there are no electronic transactions on the site

**Checkpoint**: FAQ section shows correct content. Test at /faq and homepage FAQ section.

---

## Phase 14: User Story 12 — Services Page Filter Fix (Priority: P3)

**Goal**: Electronic/in-person filter removed from services page.

**Independent Test**: Navigate to /services, verify no electronic/in-person filter exists.

### Implementation for User Story 12

- [x] T053 [US12] Remove the electronic/in-person (إلكترونية/حضورية) filter from `frontend-next/src/app/services/page.tsx` — delete the filter UI element and any associated state/logic since all services are in-person

**Checkpoint**: Services page shows services without type filter. Test at /services.

---

## Phase 15: User Story 13 — Departments Page Wireframe Compliance (Priority: P3)

**Goal**: Departments page layout matches approved wireframe.

**Independent Test**: Compare /directorates page against the wireframe design.

### Implementation for User Story 13

- [x] T054 [US13] Review and update the departments page layout in `frontend-next/src/app/directorates/page.tsx` and `frontend-next/src/components/DirectoratesList.tsx` — compare current layout against the approved wireframe and adjust component structure, spacing, grid layout, and visual elements to match

**Checkpoint**: Departments page matches wireframe. Test at /directorates.

---

## Phase 16: User Story 14 — Search Page Improvements (Priority: P3)

**Goal**: Search filters visible in dark mode, loading indicator shown during search.

**Independent Test**: Enable dark mode, navigate to /search, verify filter visibility and perform a search to see loading indicator.

### Implementation for User Story 14

- [x] T055 [P] [US14] Fix dark mode styling for search page filters in `frontend-next/src/app/search/page.tsx` or `frontend-next/src/components/SearchResultsPage.tsx` — add `dark:` Tailwind classes to filter elements for proper contrast against black background
- [x] T056 [US14] Add loading/search indicator in `frontend-next/src/app/search/page.tsx` or `frontend-next/src/components/SearchResultsPage.tsx` — show a spinner or skeleton loading state while search results are being fetched; use existing `LoadingSpinner.tsx` or `Skeleton.tsx` components

**Checkpoint**: Search page works correctly in dark mode with loading feedback. Test at /search.

---

## Phase 17: User Story 15 — Minor Text, Label, and Content Updates (Priority: P3)

**Goal**: Text corrections across complaints section, profile, contact page, privacy policy, and AI assistant.

**Independent Test**: Navigate to each affected page and verify corrected text.

### Implementation for User Story 15

- [x] T057 [P] [US15] Rename "Track Request Status" to "Track Complaint Status" in `frontend-next/src/app/complaints/page.tsx` or `frontend-next/src/components/ComplaintPortal.tsx` — update the label text or use the updated translation key from T006
- [x] T058 [P] [US15] Rename "Track Request Status" to "Track Complaint Status" in `frontend-next/src/app/(protected)/profile/page.tsx` — update the label text or use the updated translation key from T006
- [x] T059 [P] [US15] Update the ministry address on the contact page in `frontend-next/src/app/contact/page.tsx` or `frontend-next/src/components/ContactSection.tsx` — change the address to "الجمارك مقابل الأمن الجنائي" (Customs, opposite Criminal Security); also update English translation
- [x] T060 [P] [US15] Update the privacy policy update date in `frontend-next/src/app/privacy-policy/page.tsx` — change the "last updated" date to the current date (2026-01-29)
- [x] T061 [US15] Fix the AI assistant popup button size and positioning in `frontend-next/src/components/ChatBot.tsx` — make the floating button larger and more visible; fix the popup so it does not push the user to the middle of the page (use fixed positioning or ensure scroll position is maintained)

**Checkpoint**: All text corrections verified across affected pages.

---

## Phase 18: User Story 16 — Terms of Use Updates (Priority: P3)

**Goal**: Remove "Publishing offensive content" section and second intellectual property clause from terms of use.

**Independent Test**: Navigate to /terms, verify removed sections.

### Implementation for User Story 16

- [x] T062 [P] [US16] Remove the "Publishing offensive and inappropriate content" (نشر محتوى مسيء وغير لائق) section from `frontend-next/src/app/terms/page.tsx` — delete the entire section including heading and content
- [x] T063 [US16] Remove the second clause from the intellectual property section in `frontend-next/src/app/terms/page.tsx` — delete only the second clause (البند الثاني) while preserving all other clauses

**Checkpoint**: Terms of use page reflects the required content changes. Test at /terms.

---

## Phase 19: User Story 17 — Profile Email Edit Feature (Priority: P2)

**Goal**: Users can edit their email address from the profile page with verification.

**Independent Test**: Log in, navigate to /profile, change email, verify verification flow.

### Implementation for User Story 17

- [x] T064 [US17] Add email update API endpoint in `backend/app/Http/Controllers/UserController.php` — implement `POST /api/v1/users/me/email/request-change` endpoint that validates new email (unique, valid format), confirms current password, sends verification code to new email, and returns success response per contracts/api-changes.md
- [x] T065 [US17] Add email verify API endpoint in `backend/app/Http/Controllers/UserController.php` — implement `POST /api/v1/users/me/email/verify-change` endpoint that validates OTP code, updates user email, and returns updated user per contracts/api-changes.md
- [x] T066 [US17] Register email update routes in `backend/routes/api.php` — add `POST /v1/users/me/email/request-change` and `POST /v1/users/me/email/verify-change` routes with Sanctum auth middleware and rate limiting
- [x] T067 [US17] Add email update API calls to `frontend-next/src/lib/repository.ts` — add `requestEmailChange(email, password)` and `verifyEmailChange(code)` functions
- [x] T068 [US17] Add email edit UI to the profile page in `frontend-next/src/app/(protected)/profile/page.tsx` — add an "Edit Email" button that opens an inline form with new email input, current password confirmation, submit button, and a verification code step; use `t()` for all labels and messages

**Checkpoint**: Email edit flow works end-to-end. Test by logging in and changing email at /profile.

---

## Phase 20: User Story 18 — Logo Replacement (Priority: P3)

**Goal**: Registration and login pages use the approved logo.

**Independent Test**: View /register and /login pages, verify correct logo displayed.

### Implementation for User Story 18

- [ ] T069 [P] [US18] Download the approved logo from the provided Google Drive source and save to `frontend-next/public/images/` or the appropriate assets directory — replace the existing logo file or add the new one
- [ ] T070 [US18] Update the logo reference in `frontend-next/src/app/(auth)/register/page.tsx` and `frontend-next/src/app/(auth)/login/page.tsx` — change the `<img>` or `<Image>` src to point to the new approved logo file

**Checkpoint**: Correct logo displayed on auth pages. Test at /register and /login.

---

## Phase 21: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and fixes that span multiple user stories.

- [ ] T071 Full dark mode visual audit — navigate through all pages in dark mode and fix any remaining contrast issues missed by individual story tasks, especially pages that previously relied on the forest green (#094239) background
- [ ] T072 Full Arabic language audit — switch to Arabic and navigate through all pages, verify every user-visible string is in Arabic (no stray English text)
- [ ] T073 Full English language audit — switch to English and navigate through all pages, verify content displays in English
- [ ] T074 Mobile responsiveness check — verify all changed components render correctly on mobile viewport (375px width)
- [ ] T075 Run quickstart.md validation — follow all 8 verification steps in `specs/002-frontend-fixes/quickstart.md` and confirm all checks pass
- [x] T076 Clear backend caches with `docker-compose -f docker-compose.dev.yml exec backend php artisan cache:clear && php artisan config:clear && php artisan route:clear`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phases 3-20)**: All depend on Foundational (Phase 2) completion
  - P1 stories (US1-US3) should be completed first
  - P2 stories (US4-US8, US17) can proceed after P1 or in parallel
  - P3 stories (US9-US16, US18) can proceed after P2 or in parallel
- **Polish (Phase 21)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Registration)**: Independent — no dependencies on other stories
- **US2 (Complaint Flow)**: Independent — no dependencies on other stories
- **US3 (News)**: Independent — no dependencies on other stories
- **US4 (Localization)**: Best done after US1-US3 to audit their `t()` calls, but can start independently
- **US5 (Dark Mode)**: Depends on Phase 2 (T004-T005) for base color change; can run in parallel with other stories
- **US6 (Homepage)**: Independent — no dependencies on other stories
- **US7 (Suggestions)**: Independent — can benefit from US2 complaint flow patterns
- **US8 (2FA Page)**: Independent — no dependencies on other stories
- **US9-US18**: All independent — no cross-story dependencies

### Within Each User Story

- Backend API tasks before frontend tasks that depend on them (US2: T016-T017 before T019; US17: T064-T066 before T067-T068)
- Translation key tasks (Phase 2) before component tasks that use `t()` calls
- Model/service tasks before UI integration tasks

### Parallel Opportunities

- **Phase 2**: T002-T006 can all run in parallel (different concerns in same/different files)
- **US1**: T007, T008, T009, T010 can all run in parallel (different form fields)
- **US2**: T015-T017 (backend) can run in parallel with T018 (frontend removal)
- **US3**: T024, T025 can run in parallel (frontend/backend)
- **US4**: T028, T029, T030, T031 can all run in parallel (different files)
- **US6**: T036, T037, T038 can all run in parallel (different components)
- **US9**: T045, T046, T047 can all run in parallel (different footer elements)
- **US11**: T050, T051 can run in parallel
- **US15**: T057, T058, T059, T060 can all run in parallel (different pages)
- **US16**: T062, T063 can run in parallel (different sections of same file — care needed)
- **US17**: T064, T065 can run in parallel (different endpoints)
- **US18**: T069 before T070 (need asset before referencing it)

---

## Parallel Example: User Story 1

```bash
# Launch all field validation tasks together (parallel - different fields):
Task: "T007 Add maxLength to national ID in register/page.tsx"
Task: "T008 Add maxLength to phone in register/page.tsx"
Task: "T009 Add date of birth validation in register/page.tsx"
Task: "T010 Add email validation in register/page.tsx"

# Then sequential tasks (depend on parallel tasks):
Task: "T011 Replace hardcoded error strings with t() calls"
Task: "T012 Update verification code message"
Task: "T013 Remove 2FA toggle"
Task: "T014 Fix governorate dropdown dark mode"
```

## Parallel Example: User Story 2

```bash
# Backend tasks first (parallel):
Task: "T015 Add API call to repository.ts"
Task: "T016 Add backend endpoint"
Task: "T017 Register route"

# Frontend tasks (sequential, after backend ready):
Task: "T018 Remove anonymous warning"
Task: "T019 Add template dropdown"
Task: "T020 Make details field conditional"
Task: "T021 Remove select entity option"
Task: "T022 Replace hardcoded error strings"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (translation keys + dark mode base)
3. Complete Phase 3: US1 — Registration fixes
4. Complete Phase 4: US2 — Complaint flow fixes
5. Complete Phase 5: US3 — News page fixes
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo if ready — core citizen-facing issues resolved

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Registration) → Test → Deploy (MVP increment 1)
3. US2 (Complaints) → Test → Deploy (MVP increment 2)
4. US3 (News) → Test → Deploy (MVP increment 3)
5. US4-US8, US17 (P2 stories) → Test → Deploy
6. US9-US16, US18 (P3 stories) → Test → Deploy
7. Polish → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Registration) + US4 (Localization)
   - Developer B: US2 (Complaints) + US7 (Suggestions)
   - Developer C: US3 (News) + US6 (Homepage)
3. Then distribute P2 and P3 stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No test tasks generated (not requested)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total: 76 tasks across 21 phases (1 setup + 1 foundational + 18 user stories + 1 polish)
