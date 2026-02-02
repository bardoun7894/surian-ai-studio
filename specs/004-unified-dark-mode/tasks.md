# Tasks: Unified Dark Mode Color System

**Input**: Design documents from `/specs/004-unified-dark-mode/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not requested — manual visual inspection per quickstart.md.

**Organization**: Tasks are grouped by user story. US1 and US2 are tightly coupled (centralization enables consistency), so US2 is the foundational phase and US1 is the systematic replacement phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify environment and capture baseline

- [x] T001 Start dev environment and verify dark mode toggle works at `http://localhost:3002` — run `docker-compose -f docker-compose.dev.yml up -d`
- [x] T002 Capture baseline (2,112 instances): run `grep -rn "dark:" frontend-next/src/ | wc -l` to count current dark mode class instances for comparison

**Checkpoint**: Dev environment running, baseline captured

---

## Phase 2: Foundational — Central Dark Mode Definition (US2, Priority: P1)

**Goal**: Define the authoritative dark mode palette in one central location so all subsequent component changes reference it.

**Independent Test**: Change `--dm-surface` to a bright color (e.g., red), toggle dark mode — verify the change appears on elevated surfaces across multiple pages without modifying component files.

- [x] T003 [US2] Update `.dark` CSS variables in `frontend-next/src/app/globals.css` — add `--dm-background: #1a1a1a`, `--dm-surface: #2a2a2a`, `--dm-card: rgba(179,163,211,0.1)`, `--dm-button: #094239`, `--dm-title: #b9a779`, `--dm-text: #ffffff`, `--dm-text-secondary: rgba(255,255,255,0.7)`, `--dm-border: rgba(185,167,121,0.15)`, `--dm-input-bg: rgba(255,255,255,0.05)` to the `.dark` block
- [x] T004 [US2] Add `dm` semantic color group to `frontend-next/tailwind.config.ts` — add `dm: { bg: 'var(--dm-background)', surface: 'var(--dm-surface)', card: 'var(--dm-card)', text: 'var(--dm-text)', 'text-secondary': 'var(--dm-text-secondary)', border: 'var(--dm-border)', input: 'var(--dm-input-bg)' }` inside `colors`
- [x] T005 [US2] Update `.dark` component utility classes in `frontend-next/src/app/globals.css` — update `.card` class to use `dark:bg-dm-surface` and `.glass-card` to use `dark:bg-dm-surface`, `.input` to use `dark:bg-dm-input dark:border-dm-border dark:text-white`

**Checkpoint**: Central palette defined. All subsequent tasks reference these tokens.

---

## Phase 3: Consistent Dark Mode — Core Layout Files (US1, Priority: P1) 🎯 MVP

**Goal**: Fix the highest-impact files first — layout, home page, navbar, footer — so the core browsing experience is consistent.

**Independent Test**: Toggle dark mode on home page. Verify: page bg = #1a1a1a (not black), titles = gold, text = white, cards = gray, buttons = dark green.

### 3a: Critical layout + page background fixes

- [ ] T006 [US1] Fix `dark:bg-black` in `frontend-next/src/app/layout.tsx` — replace with `dark:bg-dm-bg` or remove (body inherits from CSS variable `--background`)
- [ ] T007 [US1] Fix `dark:bg-black` and `dark:bg-gov-forest/30` in `frontend-next/src/app/page.tsx` — replace black bg with `dark:bg-dm-bg`, forest bg with `dark:bg-dm-surface`

### 3b: Shared components (navbar, footer, hero)

- [ ] T008 [P] [US1] Update dark mode classes in `frontend-next/src/components/Navbar.tsx` — replace `dark:bg-gov-charcoal` with `dark:bg-dm-surface`, verify services dropdown uses `dark:bg-dm-surface` not green
- [ ] T009 [P] [US1] Update dark mode classes in `frontend-next/src/components/Footer.tsx` — replace `dark:text-gray-*` with `dark:text-white/70`, card bg with `dark:bg-dm-surface`
- [ ] T010 [P] [US1] Update dark mode classes in `frontend-next/src/components/HeroSection.tsx` — replace `dark:bg-gov-charcoal/80` with `dark:bg-dm-bg`

### 3c: Home page sections

- [ ] T011 [P] [US1] Update dark mode classes in `frontend-next/src/components/NewsSection.tsx` — replace `dark:text-gray-*` with `dark:text-white/70`, standardize card bg
- [ ] T012 [P] [US1] Update dark mode classes in `frontend-next/src/components/FeaturedDirectorates.tsx` — remove `dark:bg-black` if present, use `dark:bg-dm-card`
- [ ] T013 [P] [US1] Update dark mode classes in `frontend-next/src/components/QuickServices.tsx` — replace `dark:bg-gov-charcoal/80` with `dark:bg-dm-card`
- [ ] T014 [P] [US1] Update dark mode classes in `frontend-next/src/components/GovernmentPartners.tsx` — standardize text and bg to `dark:text-white`, `dark:bg-dm-card`
- [ ] T015 [P] [US1] Update dark mode classes in `frontend-next/src/components/NewsletterSection.tsx` — replace `dark:bg-gov-charcoal/80` with `dark:bg-dm-surface`, `dark:border-gov-border/15` with `dark:border-dm-border`
- [ ] T016 [P] [US1] Update dark mode classes in `frontend-next/src/components/NewsletterSignup.tsx` — standardize input and button dark mode colors
- [ ] T017 [P] [US1] Update dark mode classes in `frontend-next/src/components/StatsAchievements.tsx` — standardize to palette
- [ ] T018 [P] [US1] Update dark mode classes in `frontend-next/src/components/FAQSection.tsx` — replace `dark:bg-gray-700` with `dark:bg-dm-surface`, `dark:text-gray-*` with `dark:text-white/70`
- [ ] T019 [P] [US1] Update dark mode classes in `frontend-next/src/components/ContactSection.tsx` — replace `dark:bg-gov-emeraldStatic` with `dark:bg-dm-surface`, `dark:bg-black/20` with `dark:bg-dm-bg`, text to `dark:text-white`

**Checkpoint**: Home page fully consistent in dark mode.

---

## Phase 4: Consistent Dark Mode — Content Pages (US1, Priority: P1)

**Goal**: All content/detail pages follow the unified palette.

### 4a: Article/News components

- [ ] T020 [P] [US1] Fix `dark:bg-[#2a2a2a]` in `frontend-next/src/components/ArticleCard.tsx` — replace hardcoded hex with `dark:bg-dm-surface`, fix `dark:text-gov-teal` to `dark:text-white`
- [ ] T021 [P] [US1] Update dark mode in `frontend-next/src/components/ArticleDetail.tsx` — replace `dark:text-gray-*` with `dark:text-white/70`, keep `dark:prose-headings:text-gov-gold`
- [ ] T022 [P] [US1] Update dark mode in `frontend-next/src/components/CentralDirectorateNews.tsx` — standardize to palette
- [ ] T023 [P] [US1] Update dark mode in `frontend-next/src/components/Announcements.tsx` — replace `dark:bg-black` (line 107) with `dark:bg-dm-bg`, `dark:bg-gov-emeraldStatic` with `dark:bg-dm-surface`

### 4b: Directorate components

- [ ] T024 [P] [US1] Update dark mode in `frontend-next/src/components/DirectorateCard.tsx` — replace `dark:bg-gov-charcoal/80` with `dark:bg-dm-card`
- [ ] T025 [P] [US1] Update dark mode in `frontend-next/src/components/DirectorateDetail.tsx` — replace `dark:bg-gov-charcoal/80` with `dark:bg-dm-surface`, `dark:text-gray-*` with `dark:text-white/70`
- [ ] T026 [P] [US1] Update dark mode in `frontend-next/src/components/DirectoratesList.tsx` — standardize to palette

### 4c: Search and misc components

- [ ] T027 [P] [US1] Update dark mode in `frontend-next/src/components/SearchResultsPage.tsx` — replace `dark:bg-black` and `dark:bg-gov-charcoal` with `dark:bg-dm-surface`, `dark:border-gray-600` with `dark:border-dm-border`
- [ ] T028 [P] [US1] Update dark mode in `frontend-next/src/components/Skeleton.tsx` — replace `dark:bg-gray-700` with `dark:bg-dm-surface`
- [ ] T029 [P] [US1] Update dark mode in `frontend-next/src/components/LoadingSpinner.tsx` — standardize to palette
- [ ] T030 [P] [US1] Update dark mode in `frontend-next/src/components/NotificationsDropdown.tsx` — replace `dark:text-gray-*` with `dark:text-white/70`
- [ ] T031 [P] [US1] Update dark mode in `frontend-next/src/components/ExternalLinkModal.tsx` — replace `dark:text-gray-*` with `dark:text-white/70`
- [ ] T032 [P] [US1] Update dark mode in `frontend-next/src/components/UploadProgress.tsx` — replace `dark:text-gray-*` with `dark:text-white/70`
- [ ] T033 [P] [US1] Update dark mode in `frontend-next/src/components/SnoozeButton.tsx` — standardize to palette
- [ ] T034 [P] [US1] Update dark mode in `frontend-next/src/components/AIContentTools.tsx` — standardize to palette

**Checkpoint**: All content components follow unified dark mode palette.

---

## Phase 5: Consistent Dark Mode — App Pages (US1, Priority: P1)

**Goal**: All page-level files follow the unified palette.

### 5a: Auth pages

- [ ] T035 [P] [US1] Update dark mode in `frontend-next/src/app/(auth)/login/page.tsx` — replace `dark:text-gray-*` with `dark:text-white/70`
- [ ] T036 [P] [US1] Update dark mode in `frontend-next/src/app/(auth)/register/page.tsx` — replace `dark:bg-gray-*` with `dark:bg-dm-surface`, `dark:text-gray-*` with `dark:text-white/70`
- [ ] T037 [P] [US1] Fix `dark:bg-green-*` bright green leak in `frontend-next/src/app/(auth)/two-factor/page.tsx` — replace with `dark:bg-gov-forest`
- [ ] T038 [P] [US1] Update dark mode in `frontend-next/src/app/(auth)/forgot-password/page.tsx` — standardize to palette
- [ ] T039 [P] [US1] Update dark mode in `frontend-next/src/app/(auth)/reset-password/page.tsx` — standardize to palette

### 5b: Public pages

- [ ] T040 [P] [US1] Update dark mode in `frontend-next/src/app/news/page.tsx` — standardize to palette
- [ ] T041 [P] [US1] Update dark mode in `frontend-next/src/app/faq/page.tsx` — standardize to palette
- [ ] T042 [P] [US1] Update dark mode in `frontend-next/src/app/contact/page.tsx` — standardize to palette
- [ ] T043 [P] [US1] Update dark mode in `frontend-next/src/app/services/page.tsx` and `frontend-next/src/app/services/[id]/page.tsx` — standardize to palette
- [ ] T044 [P] [US1] Update dark mode in `frontend-next/src/app/announcements/page.tsx` — standardize to palette
- [ ] T045 [P] [US1] Update dark mode in `frontend-next/src/app/decrees/page.tsx` — standardize to palette
- [ ] T046 [P] [US1] Update dark mode in `frontend-next/src/app/media/page.tsx` — standardize to palette
- [ ] T047 [P] [US1] Update dark mode in `frontend-next/src/app/search/page.tsx` and `frontend-next/src/app/search/semantic/page.tsx` — standardize to palette
- [ ] T048 [P] [US1] Update dark mode in `frontend-next/src/app/about/page.tsx` — standardize to palette
- [ ] T049 [P] [US1] Update dark mode in `frontend-next/src/app/open-data/page.tsx` — standardize to palette
- [ ] T050 [P] [US1] Update dark mode in `frontend-next/src/app/investment/page.tsx` and `frontend-next/src/app/investment/[slug]/page.tsx` — standardize to palette
- [ ] T051 [P] [US1] Update dark mode in `frontend-next/src/app/directorates/[id]/sub-directorates/page.tsx` — standardize to palette
- [ ] T052 [P] [US1] Update dark mode in `frontend-next/src/app/sitemap/page.tsx` — standardize to palette
- [ ] T053 [P] [US1] Update dark mode in `frontend-next/src/app/privacy-policy/page.tsx` and `frontend-next/src/app/terms/page.tsx` — standardize to palette
- [ ] T054 [P] [US1] Update dark mode in `frontend-next/src/app/newsletter/unsubscribe/page.tsx` — standardize to palette
- [ ] T055 [P] [US1] Update dark mode in `frontend-next/src/app/suggestions/track/page.tsx` — standardize to palette
- [ ] T056 [P] [US1] Update dark mode in `frontend-next/src/app/dashboard/page.tsx` — standardize to palette

### 5c: Protected pages

- [ ] T057 [P] [US1] Update dark mode in `frontend-next/src/app/(protected)/profile/page.tsx` — standardize to palette
- [ ] T058 [P] [US1] Update dark mode in `frontend-next/src/app/(protected)/dashboard/notifications/page.tsx` — standardize to palette
- [ ] T059 [P] [US1] Update dark mode in `frontend-next/src/app/settings/notifications/page.tsx` — standardize to palette

### 5d: Admin pages

- [ ] T060 [P] [US1] Update dark mode in `frontend-next/src/app/admin/page.tsx` — replace `dark:bg-gray-*` with `dark:bg-dm-surface`, standardize borders and text
- [ ] T061 [P] [US1] Update dark mode in `frontend-next/src/app/admin/layout.tsx` — standardize to palette
- [ ] T062 [P] [US1] Update dark mode in `frontend-next/src/app/admin/faqs/page.tsx` — replace `dark:bg-gray-*` with `dark:bg-dm-surface`
- [ ] T063 [P] [US1] Update dark mode in `frontend-next/src/app/admin/settings/page.tsx` — replace `dark:bg-gray-*` with `dark:bg-dm-surface`
- [ ] T064 [P] [US1] Update dark mode in `frontend-next/src/app/admin/users/page.tsx` — standardize to palette
- [ ] T065 [P] [US1] Update dark mode in `frontend-next/src/app/admin/notifications/page.tsx` — standardize to palette
- [ ] T066 [P] [US1] Update dark mode in `frontend-next/src/app/admin/complaints/page.tsx` — standardize to palette
- [ ] T067 [P] [US1] Update dark mode in `frontend-next/src/app/admin/content/page.tsx` — standardize to palette
- [ ] T068 [P] [US1] Update dark mode in `frontend-next/src/app/admin/reports/page.tsx` — standardize to palette
- [ ] T069 [P] [US1] Update dark mode in `frontend-next/src/app/admin/newsletters/page.tsx` — standardize to palette
- [ ] T070 [P] [US1] Update dark mode in `frontend-next/src/app/admin/webhooks/page.tsx` — standardize to palette
- [ ] T071 [P] [US1] Update dark mode in `frontend-next/src/app/admin/backups/page.tsx` — standardize to palette
- [ ] T072 [P] [US1] Update dark mode in `frontend-next/src/app/admin/suggestions/page.tsx` — standardize to palette
- [ ] T073 [P] [US1] Update dark mode in `frontend-next/src/app/admin/promotional/page.tsx` — standardize to palette
- [ ] T074 [P] [US1] Update dark mode in `frontend-next/src/app/admin/chat-handoffs/page.tsx` — standardize to palette

**Checkpoint**: All pages follow unified dark mode palette.

---

## Phase 6: Visual Hierarchy Verification (US3, Priority: P2)

**Goal**: Ensure dark mode preserves clear visual hierarchy — titles stand out from text, cards from background, buttons from cards.

**Independent Test**: Toggle dark mode on home page. Gold headings must be distinct from white text. Cards must be visible against page background. Buttons must contrast with cards.

- [ ] T075 [US3] Audit heading colors across all pages — verify all h1/h2/section titles use `dark:text-gov-gold` and are visually distinct from body text in `frontend-next/src/app/globals.css` component classes and all component files
- [ ] T076 [US3] Audit card-to-background contrast — verify cards using `dark:bg-dm-card` or `dark:bg-gov-card/10` are visually distinct from `#1a1a1a` page background across all components
- [ ] T077 [US3] Audit button-to-card contrast — verify buttons using `dark:bg-gov-forest` are visually distinct from card backgrounds across all components

**Checkpoint**: Visual hierarchy verified.

---

## Phase 7: Problem Components (US4, Priority: P2)

**Goal**: Fix the 6 known problem components that had existing dark mode bugs.

**Independent Test**: In dark mode, open ChatBot, expand services dropdown, visit complaint form, visit suggestion form, check Quick Links, check "Read More" buttons.

- [ ] T078 [P] [US4] Fix ChatBot dark mode in `frontend-next/src/components/ChatBot.tsx` — replace `dark:bg-gray-900/95` and `dark:bg-gray-800` with `dark:bg-dm-surface`, ensure no white background leak, all text white, send button dark green
- [ ] T079 [P] [US4] Fix services dropdown dark mode in `frontend-next/src/components/Navbar.tsx` — ensure dropdown menu uses `dark:bg-dm-surface` not bright green or white background
- [ ] T080 [P] [US4] Unify complaint form dark mode in `frontend-next/src/components/ComplaintPortal.tsx` — replace `dark:bg-gray-900/50` and `dark:bg-gov-emeraldStatic` with `dark:bg-dm-surface`, inputs use `dark:bg-dm-input`, buttons use `dark:bg-gov-forest`
- [ ] T081 [P] [US4] Unify suggestion form dark mode in `frontend-next/src/components/SuggestionsForm.tsx` — match exact same dark mode styling as ComplaintPortal (T080): same bg, input, button, text colors
- [ ] T082 [P] [US4] Fix Quick Links dark mode in `frontend-next/src/components/QuickLinks.tsx` — remove opaque colored background, use transparent or `dark:bg-dm-card`
- [ ] T083 [P] [US4] Fix "Read More" button visibility in `frontend-next/src/components/ArticleCard.tsx` — ensure button uses `dark:bg-gov-forest dark:text-white` and is clearly visible against card background
- [ ] T084 [P] [US4] Fix SatisfactionRating bright green leak in `frontend-next/src/components/SatisfactionRating.tsx` — replace `dark:bg-green-*` with `dark:bg-gov-forest`
- [ ] T085 [P] [US4] Fix RequestedServices dark mode in `frontend-next/src/components/RequestedServices.tsx` — standardize to palette

**Checkpoint**: All 6 problem components verified in dark mode.

---

## Phase 8: Polish & Verification

**Purpose**: Final audit, cleanup, and validation

- [ ] T086 Run grep audit: `grep -rn "dark:bg-black\b" frontend-next/src/` — verify zero results
- [ ] T087 Run grep audit: `grep -rn 'dark:bg-\[#' frontend-next/src/` — verify zero hardcoded hex backgrounds
- [ ] T088 Run grep audit: `grep -rn "dark:bg-gray-[789]" frontend-next/src/` — verify zero Tailwind gray backgrounds
- [ ] T089 Run grep audit: `grep -rn "dark:border-gray-[67]" frontend-next/src/` — verify zero Tailwind gray borders
- [ ] T090 Run final count: `grep -rn "dark:" frontend-next/src/ | wc -l` — compare with T002 baseline
- [ ] T091 Visual audit: Toggle dark mode and navigate all pages listed in `specs/004-unified-dark-mode/quickstart.md` testing checklist — verify consistent palette
- [ ] T092 Verify light mode not broken: Toggle to light mode, navigate 5+ pages — verify no regressions
- [ ] T093 Verify high-contrast mode: Enable high-contrast mode — verify it still overrides dark mode properly
- [ ] T094 Verify mobile responsive: Check home page and one form page at 375px width in dark mode — verify no layout breaks
- [ ] T095 Centralization test (SC-003): Temporarily change `--dm-surface` in `globals.css` to a bright color, verify it appears on 5+ pages without editing component files, then revert

**Checkpoint**: All verification complete. Feature ready for review.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational/US2)**: Depends on Phase 1 — BLOCKS all component changes
- **Phase 3 (Core Layout/US1)**: Depends on Phase 2 — do T006-T007 first (layout), then T008-T019 in parallel
- **Phase 4 (Content/US1)**: Depends on Phase 2 — can run in parallel with Phase 3
- **Phase 5 (Pages/US1)**: Depends on Phase 2 — can run in parallel with Phases 3-4
- **Phase 6 (Hierarchy/US3)**: Depends on Phases 3-5 — audit after replacements
- **Phase 7 (Problem Components/US4)**: Depends on Phase 2 — can run in parallel with Phases 3-5
- **Phase 8 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **US2 (Centralization)**: Phase 2 — must complete first
- **US1 (Consistency)**: Phases 3-5 — depends on US2, massive parallelization possible
- **US3 (Hierarchy)**: Phase 6 — depends on US1 completion
- **US4 (Problem Components)**: Phase 7 — depends on US2 only, can run in parallel with US1

### Parallel Opportunities

**Maximum parallelism within Phase 3 (after T006-T007):**
T008, T009, T010, T011, T012, T013, T014, T015, T016, T017, T018, T019 — all different files

**Maximum parallelism within Phase 4:**
T020-T034 — all different files, all [P] marked

**Maximum parallelism within Phase 5:**
T035-T074 — all different files, all [P] marked

**Maximum parallelism within Phase 7:**
T078-T085 — all different files, all [P] marked

**Cross-phase parallelism:**
Phases 3, 4, 5, and 7 can all run concurrently after Phase 2 completes.

---

## Parallel Example: Phase 3 Home Page Components

```bash
# After T006-T007 complete, launch all home page component updates:
Task: "Update dark mode in Navbar.tsx"
Task: "Update dark mode in Footer.tsx"
Task: "Update dark mode in HeroSection.tsx"
Task: "Update dark mode in NewsSection.tsx"
Task: "Update dark mode in FeaturedDirectorates.tsx"
Task: "Update dark mode in QuickServices.tsx"
Task: "Update dark mode in GovernmentPartners.tsx"
Task: "Update dark mode in NewsletterSection.tsx"
Task: "Update dark mode in FAQSection.tsx"
Task: "Update dark mode in ContactSection.tsx"
```

---

## Implementation Strategy

### MVP First (Phases 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Central definition (3 tasks)
3. Complete Phase 3: Core layout + home page components
4. **STOP and VALIDATE**: Toggle dark mode on home page — verify palette
5. Deploy/demo if ready — home page is the highest-traffic page

### Incremental Delivery

1. Phase 2 → Central palette defined
2. Phase 3 → Home page consistent → Demo
3. Phases 4-5 → All pages consistent → Demo
4. Phase 6 → Hierarchy verified
5. Phase 7 → Problem components fixed → Demo
6. Phase 8 → Full audit passed → Ship

---

## Notes

- All [P] tasks can run in parallel within their phase
- "Standardize to palette" means: replace `dark:bg-black`/`dark:bg-gray-*`/`dark:bg-[#hex]` with `dark:bg-dm-surface` or `dark:bg-dm-card`, replace `dark:text-gray-*` with `dark:text-white` or `dark:text-white/70`, replace `dark:border-gray-*` with `dark:border-dm-border` or `dark:border-gov-border/15`
- Do NOT change light mode classes — only modify `dark:` prefixed classes
- Do NOT change high-contrast mode styles
- Commit after each phase or logical group
