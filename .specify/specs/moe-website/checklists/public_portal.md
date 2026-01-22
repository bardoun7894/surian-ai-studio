# Requirements Checklist: Public Portal & User Dashboard
**Purpose**: Validate requirement quality for Public Pages and User/Complaint features.
**Created**: 2026-01-15
**Focus**: Requirements Quality (Completeness, Clarity, Consistency) - NOT Implementation Testing.

## Public Portal (Content & Services)

- [ ] CHK001 Are the specific data fields for the "Breaking News Ticker" explicitly defined? [Clarity, Spec §FR-11]
- [ ] CHK002 Is the logic for selecting the "latest 3 news per directorate" unambiguously defined (e.g., date based, sticky flag)? [Clarity, Spec §FR-11]
- [x] CHK003 Are the visible attributes for "Decrees" and "Laws" in the archive lists completely specified? [Completeness, Spec §FR-09]
- [x] CHK004 Is the "Service Catalog" categorization structure (hierarchy depth, category names) clearly defined? [Clarity, Spec §FR-12]
- [x] CHK005 Are requirements for "Service" descriptions consistent across all directorates? [Consistency, Spec §FR-12]
- [ ] CHK006 Is the fallback behavior for missing "Media Center" images specified? [Edge Case, Gap]
- [ ] CHK007 Are "FAQ" categorization and search requirements defined? [Completeness, Spec §FR-43]
- [x] CHK008 Are "Announcements" display durations or expiration behaviors specified? [Completeness, Spec §FR-09]
- [x] CHK009 Are "Search Results" ranking criteria (relevance vs date) defined? [Clarity, Spec §FR-36]
- [ ] CHK010 Is the "Services Guide" printable view requirement specified? [Gap]

## User Dashboard (Profile & Auth)

- [ ] CHK011 Are password complexity rules explicitly defined for "Profile Settings" updates? [Clarity, Spec §FR-02]
- [ ] CHK012 Is the behavior for "Email Update" verification (e.g., re-verify new email) specified? [Completeness, Spec §FR-02]
- [ ] CHK013 Are "Session Timeout" warning requirements defined before the 15-minute logout? [Completeness, Spec §FR-04]
- [ ] CHK014 Are "citizen self-register" validation rules (National ID format, uniqueness) clearly specified? [Clarity, Spec §FR-05]
- [x] CHK015 Are failure states for "Profile Update" (e.g., database error, network timeout) defined? [Exception Flow, Spec §FR-06]

## Smart Complaint System

- [x] CHK016 Are all required "Complaint Form" fields and their validation rules listed? [Completeness, Spec §FR-15]
- [x] CHK017 Is the "Unique Tracking Number" format (length, characters) explicitly defined? [Clarity, Spec §FR-17]
- [x] CHK018 Are "File Upload" constraints (MIME types, max size feedback) clearly specified? [Clarity, Spec §FR-18]
- [x] CHK019 Is the "Guest Inquiry" verification flow (National ID + Tracking # match) unambiguously defined? [Clarity, Spec §FR-24]
- [x] CHK020 Are "Status Workflow" transitions (e.g., can user cancel 'in progress'?) fully mapped? [Completeness, Spec §FR-21]
- [x] CHK021 Are "AI Auto-classification" fallback behaviors for service outages defined? [Exception Flow, Spec §FR-19]
- [x] CHK022 Is the "Complaint History" pagination or sorting strategy defined for the user dashboard? [Completeness, Spec §FR-23]
- [ ] CHK023 Is the "Print Complaint" layout and content requirements explicitly defined? [Completeness, Spec §FR-28]
- [ ] CHK024 Are "Rate Limiting" (3/day) message requirements user-friendly and specific? [Clarity, Spec §FR-27]

## General & UI/UX

- [x] CHK025 Are "Bilingual" (AR/EN) behavior requirements consistent for all form inputs? [Consistency, Spec §NFR-18]
- [ ] CHK026 Is the "External Link Warning" trigger scope (all external domains vs whitelist) defined? [Clarity, Spec §FR-47]
- [x] CHK027 Are "Dark Mode" color contrast requirements for accessibility defined? [Completeness, Spec §FR-42]
- [x] CHK028 Are "Mobile Responsiveness" breakpoints and layout shifts defined for complex tables? [Completeness, Spec §NFR-20]
- [x] CHK029 Is the "Loading State" behavior for dynamic content (News, Services) specified? [Gap]
- [x] CHK030 Are "Error Message" content requirements defined for all API failures? [Completeness, Spec §NFR-14]
