# Tasks: UI Amendments Batch (54 Items)

**Input**: Design documents from `/specs/003-ui-amendments/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Manual testing per quickstart.md.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add shared utilities, translation keys, and CSS variables needed across multiple user stories.

- [x] T001 Add dark mode card color CSS variable `--color-card-dark: #b3a3d3` and print media query styles in `frontend-next/src/app/globals.css`
- [x] T002 Add ~14 missing translation keys (view_all, copied, ai_summary, loading_summary, share, link_copied, general_form, suggestion_failed, published_at, time_ago, announcements_title, directorates_subtitle, directorate_subtitle, newsletter_subscribed) to translation dictionary in `frontend-next/src/contexts/LanguageContext.tsx`
- [x] T003 Add `copyToClipboard()` utility function with clipboard API + execCommand fallback and `shareContent()` utility with Web Share API + clipboard fallback in `frontend-next/src/lib/utils.ts`

**Checkpoint**: Shared infrastructure ready. All user stories can now be implemented.

---

## Phase 2: User Story 1 - Dark Mode Visual Consistency (Priority: P1) 🎯 MVP

**Goal**: Consistent dark mode styling across all components: buttons/icons = dark green, titles = gold, text = white, cards = gray #b3a3d3.

**Independent Test**: Toggle dark mode, navigate all pages. No bright/white backgrounds should leak through.

### Implementation for User Story 1

- [x] T004 [P] [US1] Update dark mode color palette in CSS variables and Tailwind utility classes to enforce buttons/icons=dark green, titles=gold, text=white, cards=#b3a3d3 in `frontend-next/src/app/globals.css`
- [x] T005 [P] [US1] Fix "Read More" button colors in dark mode - ensure all ArticleCard/card components use `dark:` Tailwind classes for the dark green button style in `frontend-next/src/components/ArticleCard.tsx`
- [x] T006 [P] [US1] Remove bright background from Quick Links section in dark mode by updating `dark:` background classes in `frontend-next/src/components/QuickLinks.tsx`
- [x] T007 [P] [US1] Fix ChatBot dark mode - replace white background with dark-themed background using `dark:` Tailwind classes in `frontend-next/src/components/ChatBot.tsx`
- [x] T008 [P] [US1] Unify dark mode styling between complaint and suggestion forms - ensure both use identical dark card backgrounds and text colors in `frontend-next/src/components/ComplaintPortal.tsx` and `frontend-next/src/components/SuggestionsForm.tsx`
- [x] T009 [P] [US1] Fix Services dropdown dark mode - replace green background with proper dark-themed background in the dropdown menu within `frontend-next/src/components/Navbar.tsx`

**Checkpoint**: Dark mode is visually consistent across all components. Toggle and verify.

---

## Phase 3: User Story 2 - Complaint & Suggestion Flow Fixes (Priority: P1)

**Goal**: End-to-end complaint/suggestion submission works with confirmation, proper clipboard, working rating, and correct form fields.

**Independent Test**: Submit complaint, copy tracking number, submit rating, track suggestion. All succeed without errors.

### Implementation for User Story 2

- [x] T010 [US2] Add confirmation message (success toast/modal) after successful complaint submission in `frontend-next/src/components/ComplaintPortal.tsx`
- [x] T011 [P] [US2] Remove directorate selection field from complaint form in `frontend-next/src/components/ComplaintPortal.tsx`
- [x] T012 [P] [US2] Remove identity verification section from complaint form in `frontend-next/src/components/ComplaintPortal.tsx`
- [x] T013 [US2] Replace `navigator.clipboard.writeText()` with `copyToClipboard()` utility (from T003) for tracking number copy, and show localized "Copied" toast via Sonner in `frontend-next/src/components/ComplaintPortal.tsx`
- [x] T014 [P] [US2] Fix rating submit arrow RTL/LTR direction - use `rtl:rotate-180` or conditional arrow direction based on `useLanguage().direction` in `frontend-next/src/components/SatisfactionRating.tsx`
- [x] T015 [US2] Debug and fix rating submission failure - investigate `POST /api/v1/complaints/{id}/rate` request format, CSRF token, and backend handler. Fix frontend request in `frontend-next/src/components/SatisfactionRating.tsx` and backend controller if needed
- [x] T016 [P] [US2] Add Arabic translation for failed suggestion error message using `t('suggestion_failed')` in `frontend-next/src/components/SuggestionsForm.tsx`
- [x] T017 [P] [US2] Restrict suggestion tracking national ID input to numbers only (maxLength=11) and validate ownership match before showing results in `frontend-next/src/components/SuggestionsForm.tsx`
- [x] T018 [P] [US2] Translate "General Form" label using `t('general_form')` in complaint and suggestion form titles in `frontend-next/src/components/ComplaintPortal.tsx` and `frontend-next/src/components/SuggestionsForm.tsx`
- [x] T019 [P] [US2] Add proper margin/padding between form content and page header in complaint and suggestion pages in `frontend-next/src/app/page.tsx` (complaint section) and `frontend-next/src/components/SuggestionsForm.tsx`

**Checkpoint**: Complaint and suggestion flows work end-to-end with proper feedback and localization.

---

## Phase 4: User Story 3 - Authentication Flow Stability (Priority: P1)

**Goal**: Login shows loading state, handles tab-switch gracefully, 2FA is stable and blocks back-navigation.

**Independent Test**: Login with 2FA account. Verify loading, tab-switch, 2FA stability, back-button blocking.

### Implementation for User Story 3

- [x] T020 [US3] Add loading indicator (spinner/disabled state) during login authentication request in `frontend-next/src/app/(auth)/login/page.tsx`
- [x] T021 [US3] Add Page Visibility API listener to cancel in-flight auth request via AbortController when user leaves tab, resetting to login form on return in `frontend-next/src/app/(auth)/login/page.tsx`
- [x] T022 [US3] Fix 2FA page stability - add `pending_2fa` flag in sessionStorage after login returns 2FA requirement, check flag in 2FA page to prevent middleware redirect in `frontend-next/src/app/(auth)/two-factor/page.tsx` and `frontend-next/src/contexts/AuthContext.tsx`
- [x] T023 [US3] Block back-navigation after 2FA success - use `router.replace()` and `window.history.replaceState()` to remove 2FA page from browser history in `frontend-next/src/app/(auth)/two-factor/page.tsx`

**Checkpoint**: Auth flow is stable. Login → 2FA → Dashboard works without instability or back-button bypass.

---

## Phase 5: User Story 4 - Header & Navigation Improvements (Priority: P1)

**Goal**: Larger logo, Home button next to Quick Links, narrower search bar, standalone search bars removed from sub-pages.

**Independent Test**: Load any page, verify header layout. Check news/decrees/announcements pages have no standalone search bar.

### Implementation for User Story 4

- [x] T024 [US4] Increase logo size and narrow search bar width in header layout in `frontend-next/src/components/Navbar.tsx`
- [x] T025 [US4] Reposition Home button adjacent to Quick Links section in header in `frontend-next/src/components/Navbar.tsx`
- [x] T026 [P] [US4] Remove standalone search bar components from news page (keep filters) in `frontend-next/src/app/news/page.tsx`
- [x] T027 [P] [US4] Remove standalone search bar components from decrees page (keep filters) in `frontend-next/src/app/decrees/page.tsx`
- [x] T028 [P] [US4] Remove standalone search bar components from announcements page (keep filters) in `frontend-next/src/app/announcements/page.tsx`

**Checkpoint**: Header shows correct layout. Sub-pages use header search only, filters remain.

---

## Phase 6: User Story 5 - Search Functionality (Priority: P1)

**Goal**: Unified search works as primary search with results, re-search, and visible clear-filters button.

**Independent Test**: Search from header, verify results, re-search from results page, clear filters.

### Implementation for User Story 5

- [x] T029 [US5] Fix unified search page to correctly display results, react to new queries, and handle the search state lifecycle in `frontend-next/src/components/SearchResultsPage.tsx` and `frontend-next/src/app/search/semantic/page.tsx`
- [x] T030 [US5] Make clear-filters button visually prominent (contrasting color, larger size, or outlined style) in `frontend-next/src/components/SearchResultsPage.tsx`

**Checkpoint**: Search works end-to-end with re-search and filter clearing.

---

## Phase 7: User Story 6 - Profile Page Cleanup (Priority: P2)

**Goal**: Profile shows user info, password change (with old password), and linked complaints. Removed sections gone.

**Independent Test**: Navigate to profile, verify removed sections, change password, view complaints.

### Implementation for User Story 6

- [x] T031 [P] [US6] Remove "Track My Complaint Status" section from profile page in `frontend-next/src/app/(protected)/profile/page.tsx`
- [x] T032 [P] [US6] Remove "Latest Complaints" section from profile page in `frontend-next/src/app/(protected)/profile/page.tsx`
- [x] T033 [P] [US6] Remove "SMS Complaint Status Notifications" section from profile page in `frontend-next/src/app/(protected)/profile/page.tsx`
- [x] T034 [US6] Add old/current password field to password change form and send `current_password` in API request to `PUT /api/v1/users/me` in `frontend-next/src/app/(protected)/profile/page.tsx`
- [x] T035 [US6] Add user complaints section to profile page - call `GET /api/v1/users/me/complaints` via repository and display complaint list with status in `frontend-next/src/app/(protected)/profile/page.tsx`

**Checkpoint**: Profile page is clean with working password change and complaints list.

---

## Phase 8: User Story 7 - Home Page Enhancements (Priority: P2)

**Goal**: Hero fits viewport, English subtitles, fullscreen videos, "View All" buttons, newsletter locale, share works.

**Independent Test**: Load home page in Arabic and English, verify all 7 acceptance scenarios.

### Implementation for User Story 7

- [x] T036 [P] [US7] Constrain hero section height to viewport (max-h-screen or h-[100vh]) in `frontend-next/src/components/HeroSection.tsx`
- [x] T037 [P] [US7] Add English translation for directorates section subtitle using `t('directorates_subtitle')` in `frontend-next/src/components/FeaturedDirectorates.tsx`
- [x] T038 [P] [US7] Add `allowFullScreen` attribute and `allow="fullscreen"` to news video iframes/players in `frontend-next/src/components/NewsSection.tsx`
- [x] T039 [P] [US7] Add "View All" button to each directorate news section linking to `/media?directorate={id}` in `frontend-next/src/components/CentralDirectorateNews.tsx`
- [x] T040 [P] [US7] Rename "View Archive" button text to use `t('view_all')` translation in `frontend-next/src/app/page.tsx`
- [x] T041 [P] [US7] Fix newsletter confirmation message to use `t('newsletter_subscribed')` for locale-aware display in `frontend-next/src/components/NewsletterSection.tsx` and `frontend-next/src/components/NewsletterSignup.tsx`
- [x] T042 [P] [US7] Fix share button using `shareContent()` utility (from T003) and remove or repurpose save button on news articles in `frontend-next/src/components/NewsSection.tsx`

**Checkpoint**: Home page renders correctly in both locales with all interactive elements working.

---

## Phase 9: User Story 8 - Directorate Page Fixes (Priority: P2)

**Goal**: Correct margins, English subtitles, "service" not "service e", correct directorate name in sub-directorate view.

**Independent Test**: Navigate to directorate and sub-directorate pages, verify in English locale.

### Implementation for User Story 8

- [x] T043 [P] [US8] Add proper margin between media content and header on directorate pages in `frontend-next/src/components/DirectorateDetail.tsx`
- [x] T044 [P] [US8] Add English translation for directorate subtitles using `t('directorate_subtitle')` in `frontend-next/src/components/DirectorateDetail.tsx`
- [x] T045 [P] [US8] Fix "service e" → "service" translation error in English locale in `frontend-next/src/app/directorates/[id]/sub-directorates/page.tsx`
- [x] T046 [P] [US8] Fix sub-directorate "More Details" to display the correct parent directorate name instead of wrong name in `frontend-next/src/app/directorates/[id]/sub-directorates/page.tsx`

**Checkpoint**: Directorate pages show correct layout, translations, and data in both locales.

---

## Phase 10: User Story 9 - Article & News Detail Improvements (Priority: P2)

**Goal**: AI summary button on articles, English publication info, meaningful time display.

**Independent Test**: Open article in English locale, verify AI summary, publication date, time format.

### Implementation for User Story 9

- [x] T047 [US9] Add AI smart summary button and collapsible summary display to article detail - call `POST /api/v1/ai/summarize` with article content, show loading and error states in `frontend-next/src/components/ArticleDetail.tsx`
- [x] T048 [US9] Add AI summary API method to repository layer in `frontend-next/src/lib/repository.ts`
- [x] T049 [P] [US9] Fix publication info (time, date) to display in English when English locale is active using locale-aware date formatting in `frontend-next/src/components/ArticleDetail.tsx`
- [x] T050 [P] [US9] Replace unhelpful "time since published" with meaningful relative time (e.g., "2 hours ago", "3 days ago") or absolute date in `frontend-next/src/components/ArticleDetail.tsx`

**Checkpoint**: Article detail pages show AI summary, proper dates, and meaningful time in both locales.

---

## Phase 11: User Story 10 - Announcements Fixes (Priority: P2)

**Goal**: Working print and share buttons, English translation, filters matching News/FAQ design.

**Independent Test**: View announcements in English, print, share, verify filter design.

### Implementation for User Story 10

- [x] T051 [P] [US10] Implement working print button using `window.print()` on announcements in `frontend-next/src/components/Announcements.tsx`
- [x] T052 [P] [US10] Implement working share button using `shareContent()` utility (from T003) on announcements in `frontend-next/src/components/Announcements.tsx`
- [x] T053 [P] [US10] Add English translations for announcements page content using `t()` function in `frontend-next/src/components/Announcements.tsx` and `frontend-next/src/app/announcements/page.tsx`
- [x] T054 [P] [US10] Update announcements and decrees filter design to match News and FAQ page filter styling in `frontend-next/src/app/announcements/page.tsx` and `frontend-next/src/app/decrees/page.tsx`

**Checkpoint**: Announcements page has working buttons, English text, and consistent filters.

---

## Phase 12: User Story 11 - Contact Page & FAQ Fixes (Priority: P2)

**Goal**: Correct ministry address persists, no interactive map, FAQ text corrected.

**Independent Test**: Load contact page, verify address after re-render, no map. Check FAQ answer.

### Implementation for User Story 11

- [x] T055 [P] [US11] Fix ministry address to persistently show "الجمارك مقابل الأمن الجنائي" - prevent API response or state update from overwriting the correct address in `frontend-next/src/components/ContactSection.tsx`
- [x] T056 [P] [US11] Remove interactive map component/usage from contact page in `frontend-next/src/app/contact/page.tsx`
- [x] T057 [P] [US11] Fix FAQ anonymous complaint answer text to end with "ولن يطلع عليه أحد" in `frontend-next/src/components/FAQSection.tsx` or FAQ data source

**Checkpoint**: Contact page shows correct address without map. FAQ answer is corrected.

---

## Phase 13: User Story 12 - Services Page Cleanup (Priority: P2)

**Goal**: No electronic services listing or "Submit Request" button displayed.

**Independent Test**: Navigate to services page and service detail, verify removals.

### Implementation for User Story 12

- [x] T058 [P] [US12] Remove electronic services listing from services page in `frontend-next/src/app/services/page.tsx` and/or `frontend-next/src/components/QuickServices.tsx`
- [x] T059 [P] [US12] Remove "Submit Request" button from service detail page in `frontend-next/src/app/services/[id]/page.tsx` and/or `frontend-next/src/components/RequestedServices.tsx`

**Checkpoint**: Services page shows only informational services without electronic service features.

---

## Phase 14: User Story 13 - Media Page Video Playback (Priority: P2)

**Goal**: Videos on media page play correctly.

**Independent Test**: Navigate to media page, play a video.

### Implementation for User Story 13

- [x] T060 [US13] Fix video playback on media page - ensure correct video source URLs, proper `<video>` or `<iframe>` attributes (controls, allowFullScreen), and handle CORS/mixed content in `frontend-next/src/app/media/page.tsx`

**Checkpoint**: Videos play on media page.

---

## Phase 15: User Story 14 - Performance Optimization (Priority: P3)

**Goal**: Faster page loads, especially on slow connections.

**Independent Test**: Measure page load on simulated 3G, compare to baseline.

### Implementation for User Story 14

- [x] T061 [P] [US14] Add dynamic imports (`next/dynamic`) for below-the-fold components: ChatBot, Footer sections, SyriaMap in `frontend-next/src/components/Providers.tsx` and relevant page files
- [x] T062 [P] [US14] Replace `<img>` tags with Next.js `<Image>` component with proper `priority`, `sizes`, and `loading="lazy"` attributes across key components in `frontend-next/src/components/HeroSection.tsx`, `frontend-next/src/components/NewsSection.tsx`, `frontend-next/src/components/ArticleCard.tsx`
- [x] T063 [P] [US14] Review and optimize font loading - ensure `next/font` is used for all fonts with `display: swap` in `frontend-next/src/app/layout.tsx`
- [x] T064 [US14] Audit and tree-shake unused dependencies from `frontend-next/package.json` and review bundle size

**Checkpoint**: Page load performance measurably improved on throttled connection.

---

## Phase 16: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across all stories.

- [x] T065 Verify all 7 removed sections (Items 3, 4, 7, 41, 42, 52, 54) are fully gone from the UI
- [x] T066 Verify all dark mode components render correctly with no white/bright background leaks across full site navigation
- [x] T067 Verify all locale-dependent text displays correctly in both Arabic and English by toggling language on every affected page
- [x] T068 Verify RTL/LTR layout correctness for directional elements (rating arrow, form layouts, navigation) in both languages
- [x] T069 Verify mobile responsiveness is not degraded by layout changes (hero, header, margins) on common viewport sizes
- [x] T070 Run quickstart.md manual testing checklist end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phases 2-6 (P1 Stories)**: Depend on Phase 1 completion. Can run in parallel with each other.
- **Phases 7-14 (P2/P3 Stories)**: Depend on Phase 1 completion. Can run in parallel with each other and with P1 stories.
- **Phase 16 (Polish)**: Depends on all story phases being complete.

### User Story Dependencies

| Story | Phase | Priority | Depends On | Can Parallel With |
|-------|-------|----------|------------|-------------------|
| US1 (Dark Mode) | 2 | P1 | Phase 1 (T001) | US2-US14 |
| US2 (Complaints) | 3 | P1 | Phase 1 (T002, T003) | US1, US3-US14 |
| US3 (Auth) | 4 | P1 | Phase 1 | US1, US2, US4-US14 |
| US4 (Header) | 5 | P1 | Phase 1 | US1-US3, US5-US14 |
| US5 (Search) | 6 | P1 | Phase 1 | US1-US4, US6-US14 |
| US6 (Profile) | 7 | P2 | Phase 1 (T002) | All others |
| US7 (Home) | 8 | P2 | Phase 1 (T002, T003) | All others |
| US8 (Directorates) | 9 | P2 | Phase 1 (T002) | All others |
| US9 (Articles) | 10 | P2 | Phase 1 (T002) | All others |
| US10 (Announcements) | 11 | P2 | Phase 1 (T002, T003) | All others |
| US11 (Contact/FAQ) | 12 | P2 | Phase 1 | All others |
| US12 (Services) | 13 | P2 | Phase 1 | All others |
| US13 (Media) | 14 | P2 | Phase 1 | All others |
| US14 (Performance) | 15 | P3 | All other stories complete | None (final optimization) |

### Within-Story Task Dependencies

- T003 (clipboard/share utils) must complete before T013, T042, T052
- T002 (translations) must complete before T016-T018, T037, T040-T041, T044, T049, T053
- T001 (CSS vars) must complete before T004-T009
- T048 (AI summary repo method) must complete before T047
- T011, T012 can run in parallel (both remove sections from same file but different blocks)

### File Conflict Notes

Tasks modifying the same file should NOT run in parallel:
- `ComplaintPortal.tsx`: T010, T011, T012, T013, T018 (run sequentially within US2)
- `Navbar.tsx`: T009 (US1), T024, T025 (US4) (run US1 before US4 for this file, or merge)
- `profile/page.tsx`: T031-T035 (all US6, run sequentially)
- `ArticleDetail.tsx`: T047, T049, T050 (all US9, run sequentially)
- `announcements/page.tsx`: T028 (US4), T053, T054 (US10) (sequence by story priority)

---

## Parallel Execution Examples

### P1 Stories (after Phase 1 complete):

```
Parallel batch 1 (different files):
  T004 [US1] globals.css dark mode
  T020 [US3] login page loading
  T029 [US5] search results page
  T036 [US7] hero section height

Parallel batch 2 (different files):
  T005 [US1] ArticleCard dark mode
  T006 [US1] QuickLinks dark mode
  T007 [US1] ChatBot dark mode
  T014 [US2] SatisfactionRating arrow
  T024 [US4] Navbar logo/search
```

### P2 Stories (independent, different files):

```
Parallel batch (all different files):
  T031 [US6] profile page removals
  T037 [US7] FeaturedDirectorates
  T043 [US8] DirectorateDetail margin
  T051 [US10] Announcements print
  T055 [US11] ContactSection address
  T058 [US12] services page cleanup
  T060 [US13] media video fix
```

---

## Implementation Strategy

### MVP First (User Story 1 - Dark Mode)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: User Story 1 - Dark Mode (T004-T009)
3. **STOP and VALIDATE**: Toggle dark mode across all pages
4. Provides immediate visual improvement site-wide

### Incremental Delivery (Recommended)

1. Phase 1 → Setup complete
2. US1 (Dark Mode) → Visual consistency ✓
3. US2 (Complaints) → Core citizen flow fixed ✓
4. US3 (Auth) → Login stability ✓
5. US4 (Header) + US5 (Search) → Navigation fixed ✓
6. US6-US13 (P2 stories) → Polish and cleanup ✓
7. US14 (Performance) → Final optimization ✓
8. Phase 16 (Polish) → Cross-cutting validation ✓

### Single Developer (Sequential)

Work through phases 1→16 in order. Each phase is a natural commit point.

### Parallel Team Strategy

- **Dev A**: US1 (Dark Mode) + US7 (Home) + US8 (Directorates)
- **Dev B**: US2 (Complaints) + US6 (Profile) + US12 (Services)
- **Dev C**: US3 (Auth) + US4 (Header) + US5 (Search)
- **Dev D**: US9 (Articles) + US10 (Announcements) + US11 (Contact) + US13 (Media)
- **After all**: US14 (Performance) + Phase 16 (Polish)

---

## Notes

- All tasks target existing files - no new files except utilities added in T003
- No database migrations needed
- Backend changes limited to rating fix (T015) and AI summary endpoint (T047/T048)
- Password validation (T034) may need backend verification
- Manual testing via `docker-compose -f docker-compose.dev.yml up -d`
- Commit after each completed user story phase
