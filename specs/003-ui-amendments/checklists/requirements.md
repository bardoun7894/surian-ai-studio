# Requirements Checklist: 003-ui-amendments

**Feature Branch**: `003-ui-amendments`
**Created**: 2026-02-02

## Validation Criteria

### Spec Completeness

- [x] All 54 items are mapped to at least one user story
- [x] Each user story has priority assigned (P1/P2/P3)
- [x] Each user story has acceptance scenarios in Given/When/Then format
- [x] Each user story has an independent test description
- [x] Edge cases are documented
- [x] Functional requirements (FR-001 through FR-054) cover all 54 items
- [x] Success criteria are defined and measurable
- [x] Key entities are identified

### Item Coverage Matrix

| Item | Description | User Story | FR | Verified |
|------|-------------|------------|-----|----------|
| 1 | Move Home button next to Quick Links | US4 | FR-001 | [ ] |
| 2 | Bigger logo, narrower search bar | US4 | FR-002 | [ ] |
| 3 | Remove "Track My Complaint Status" from profile | US6 | FR-004 | [ ] |
| 4 | Remove "Latest Complaints" from profile | US6 | FR-005 | [ ] |
| 5 | Password change requires old password | US6 | FR-006 | [ ] |
| 6 | Link complaints to profile | US6 | FR-007 | [ ] |
| 7 | Remove "SMS Complaint Status Notifications" | US6 | FR-008 | [ ] |
| 8 | Login loading state | US3 | FR-009 | [ ] |
| 9 | Stop loading on tab switch during auth | US3 | FR-010 | [ ] |
| 10 | 2FA page stability | US3 | FR-011 | [ ] |
| 11 | Block back-navigation after 2FA | US3 | FR-012 | [ ] |
| 12 | Dark mode color palette | US1 | FR-013 | [ ] |
| 13 | Unified search as main search | US5 | FR-019 | [ ] |
| 14 | Remove standalone search bars from sub-pages | US4 | FR-003 | [ ] |
| 15 | Match announcement/decree filters to news/FAQ | US10 | FR-021 | [ ] |
| 16 | Fix ministry address on contact page | US11 | FR-022 | [ ] |
| 17 | Fix FAQ anonymous complaint answer text | US11 | FR-023 | [ ] |
| 18 | Directorates section subtitle English translation | US7 | FR-025 | [ ] |
| 19 | News video fullscreen capability | US7 | FR-026 | [ ] |
| 20 | "View All" button per directorate news | US7 | FR-027 | [ ] |
| 21 | Rename "View Archive" to "View All" | US7 | FR-028 | [ ] |
| 22 | "Read More" button dark mode color | US1 | FR-014 | [ ] |
| 23 | Quick Links remove background in dark mode | US1 | FR-015 | [ ] |
| 24 | Newsletter confirmation locale-aware | US7 | FR-029 | [ ] |
| 25 | Fix share button, handle save button | US7 | FR-030 | [ ] |
| 26 | Hero section fits in viewport | US7 | FR-031 | [ ] |
| 27 | Directorate page margin fix | US8 | FR-032 | [ ] |
| 28 | Clear filters button visibility | US5 | FR-020 | [ ] |
| 29 | ChatBot dark mode fix | US1 | FR-016 | [ ] |
| 30 | Site performance optimization | US14 | FR-054 | [ ] |
| 31 | Directorate subtitles English translation | US8 | FR-033 | [ ] |
| 32 | Remove "e" from service translation | US8 | FR-034 | [ ] |
| 33 | AI smart summary button on articles | US9 | FR-036 | [ ] |
| 34 | Publication info English translation | US9 | FR-037 | [ ] |
| 35 | Meaningful time-since-published display | US9 | FR-038 | [ ] |
| 36 | Print and share buttons on announcements | US10 | FR-039 | [ ] |
| 37 | Announcements English translation | US10 | FR-040 | [ ] |
| 38 | Confirmation message after complaint submit | US2 | FR-041 | [ ] |
| 39 | Complaint/suggestion form margin fix | US2 | FR-042 | [ ] |
| 40 | Translate "General Form" label | US2 | FR-043 | [ ] |
| 41 | Remove directorate selection from complaint | US2 | FR-044 | [ ] |
| 42 | Remove identity verification from complaint | US2 | FR-045 | [ ] |
| 43 | Fix clipboard error on non-HTTPS | US2 | FR-046 | [ ] |
| 44 | Show "Copied" message for tracking number | US2 | FR-047 | [ ] |
| 45 | Rating arrow RTL/LTR direction | US2 | FR-048 | [ ] |
| 46 | Fix rating submission failure | US2 | FR-049 | [ ] |
| 47 | Unify dark mode complaint/suggestion forms | US1 | FR-017 | [ ] |
| 48 | Arabic error message for failed suggestion | US2 | FR-050 | [ ] |
| 49 | Suggestion tracking national ID validation | US2 | FR-051 | [ ] |
| 50 | Sub-directorate wrong directorate name | US8 | FR-035 | [ ] |
| 51 | Videos don't work on media page | US13 | FR-053 | [ ] |
| 52 | Remove electronic services and submit button | US12 | FR-052 | [ ] |
| 53 | Services dropdown dark mode green fix | US1 | FR-018 | [ ] |
| 54 | Remove interactive map from contact | US11 | FR-024 | [ ] |

### Quality Checks

- [x] No duplicate items across user stories (item 47 appears in US1 for dark mode aspect and US2 for form unification - intentional cross-reference)
- [x] All P1 stories cover blocking/critical issues (auth, core flows, site-wide visual, navigation, search)
- [x] All P2 stories cover important but non-blocking improvements
- [x] P3 reserved for performance (broad optimization)
- [x] Each acceptance scenario is testable without ambiguity
- [x] Arabic text strings are included verbatim where relevant (items 16, 17)
- [x] RTL/LTR considerations documented (item 45)
- [x] HTTPS/HTTP edge case documented (item 43)
- [x] Removal items are explicit "MUST NOT display" requirements

### Cross-Cutting Concerns

- [ ] Dark mode changes tested across all affected components
- [ ] Locale switching tested (Arabic <-> English) for all translation items
- [ ] RTL/LTR layout verified for directional UI elements
- [ ] Mobile responsiveness verified for layout changes (hero, margins, header)
- [ ] Performance baseline measured before optimization work begins
- [ ] Accessibility not degraded by any visual changes

### Implementation Readiness

- [x] Spec has no NEEDS CLARIFICATION markers
- [x] All items have clear pass/fail criteria
- [x] No external dependencies blocking implementation
- [x] Frontend component files identified for each change (completed in plan.md)
- [x] Backend API changes identified where needed (items 6, 33, 46) (completed in contracts/api-changes.md)
