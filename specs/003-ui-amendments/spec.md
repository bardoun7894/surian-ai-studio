# Feature Specification: UI Amendments Batch

**Feature Branch**: `003-ui-amendments`
**Created**: 2026-02-02
**Status**: Draft
**Input**: 54 UI amendment items covering header, profile, auth, dark mode, search, filters, contact, FAQ, home page, directorates, articles, announcements, complaints/suggestions, media, services, and performance.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dark Mode Visual Consistency (Priority: P1)

A user browsing the site in dark mode sees consistent, readable styling across all pages and components. Buttons and icons use dark green, main titles use gold, subtitles and body text are white, and card backgrounds use gray (#b3a3d3). No component falls back to a white or bright green background.

**Why this priority**: Dark mode inconsistencies affect every page and give an unfinished impression. Fixing these provides immediate visual polish site-wide.

**Independent Test**: Toggle dark mode on, navigate through home, complaints, suggestions, FAQ, services dropdown, ChatBot, Quick Links, and "Read More" buttons. Verify no bright/white backgrounds leak through.

**Acceptance Scenarios**:

1. **Given** dark mode is enabled, **When** user views any page, **Then** buttons/icons are dark green, main titles gold, subtitles/text white, cards gray #b3a3d3
2. **Given** dark mode is enabled, **When** user opens the ChatBot, **Then** background is dark-themed, not white (Item 29)
3. **Given** dark mode is enabled, **When** user views Quick Links section, **Then** section has no bright background (Item 23)
4. **Given** dark mode is enabled, **When** user clicks "Read More" on any card, **Then** button color follows dark mode palette (Item 22)
5. **Given** dark mode is enabled, **When** user opens complaint form then suggestion form, **Then** both use identical dark mode styling (Item 47)
6. **Given** dark mode is enabled, **When** user opens the Services dropdown, **Then** dropdown background is not green (Item 53)

**Items covered**: 12, 22, 23, 29, 47, 53

---

### User Story 2 - Complaint & Suggestion Flow Fixes (Priority: P1)

A user submits a complaint or suggestion and receives clear confirmation, correct behavior for clipboard operations, working rating submission, and proper form fields.

**Why this priority**: Complaints and suggestions are core citizen interaction features. Broken submission flows and silent failures directly undermine trust in the platform.

**Independent Test**: Submit a complaint and a suggestion end-to-end, verify confirmation messages, clipboard copy, rating, and tracking lookup.

**Acceptance Scenarios**:

1. **Given** user fills out complaint form and submits, **When** submission succeeds, **Then** a confirmation message is displayed (Item 38)
2. **Given** complaint form is displayed, **When** user views fields, **Then** directorate selection field is not present (Item 41)
3. **Given** complaint form is displayed, **When** user views fields, **Then** identity verification section is not present (Item 42)
4. **Given** user receives a tracking number, **When** user clicks copy, **Then** number is copied without error on both HTTP and HTTPS, and "Copied" message is shown (Items 43, 44)
5. **Given** user submits a rating, **When** in RTL mode, **Then** submit arrow points left; in LTR mode arrow points right (Item 45)
6. **Given** user submits a rating, **When** submission completes, **Then** rating is saved successfully without error (Item 46)
7. **Given** user submits a suggestion and it fails, **When** locale is Arabic, **Then** error message appears in Arabic (Item 48)
8. **Given** user tracks a suggestion, **When** entering national ID, **Then** only numbers are allowed (max 11 digits) and system validates that national ID matches the suggestion (Item 49)
9. **Given** complaint or suggestion form is displayed, **When** user views form title, **Then** "General Form" label is translated to current locale (Item 40)
10. **Given** complaint or suggestion form page loads, **When** user views layout, **Then** proper margin exists between form content and header (Item 39)

**Items covered**: 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49

---

### User Story 3 - Authentication Flow Stability (Priority: P1)

A user logging in experiences proper loading states, stable two-factor authentication, and cannot bypass 2FA by navigating back.

**Why this priority**: Authentication is a gating experience. Broken auth flows completely block user access.

**Independent Test**: Log in with 2FA-enabled account. Verify loading indicator, window-blur behavior, 2FA stability, and back-button blocking.

**Acceptance Scenarios**:

1. **Given** user submits login credentials, **When** authentication is processing, **Then** a loading indicator is shown (Item 8)
2. **Given** login is processing and user switches away from browser tab, **When** user returns, **Then** loading stops and login form is re-shown (Item 9)
3. **Given** user reaches 2FA page, **When** page loads, **Then** it remains stable and does not redirect back to login (Item 10)
4. **Given** user has passed 2FA, **When** user presses browser back button, **Then** user cannot return to 2FA page (Item 11)

**Items covered**: 8, 9, 10, 11

---

### User Story 4 - Header & Navigation Improvements (Priority: P1)

The site header displays a larger logo, repositioned Home button next to Quick Links, a narrower search bar, and standalone search bars are removed from sub-pages (filters remain).

**Why this priority**: The header is visible on every page. Layout and navigation clarity directly affect usability.

**Independent Test**: Load any page, verify header layout. Navigate to pages that previously had standalone search bars and confirm they are removed.

**Acceptance Scenarios**:

1. **Given** any page loads, **When** user views header, **Then** logo is larger than current size and search bar is narrower (Item 2)
2. **Given** any page loads, **When** user views header, **Then** Home button is positioned next to Quick Links section (Item 1)
3. **Given** user navigates to news, decrees, or announcements pages, **When** page loads, **Then** no standalone search bar is present (header search is used instead); filter inputs remain (Item 14)

**Items covered**: 1, 2, 14

---

### User Story 5 - Search Functionality (Priority: P1)

The unified search page works correctly as the main search experience. Users can perform searches, see results, refine queries, and clear filters.

**Why this priority**: Search is a primary discovery mechanism. A broken search prevents users from finding content.

**Independent Test**: Use header search bar, verify results page loads with results, perform a new search from results page, and test clear-filters button visibility.

**Acceptance Scenarios**:

1. **Given** user types a query in header search bar and submits, **When** search page loads, **Then** results are displayed correctly and match the query (Item 13)
2. **Given** user is on search results page, **When** user types a new query and submits, **Then** results update to reflect the new query (Item 13)
3. **Given** user has applied filters on search results, **When** user looks for clear-filters button, **Then** button is clearly visible and accessible (Item 28)

**Items covered**: 13, 28

---

### User Story 6 - Profile Page Cleanup (Priority: P2)

The profile page shows only relevant sections: user info, password change (requiring old password), and linked complaints. Removed sections: "Track My Complaint Status", "Latest Complaints", and "SMS Complaint Status Notifications".

**Why this priority**: Profile clutter and non-functional sections confuse users. Password security (requiring old password) is important but not blocking.

**Independent Test**: Navigate to profile page, verify removed sections are gone, change password requiring old password, and verify complaints list.

**Acceptance Scenarios**:

1. **Given** user navigates to profile page, **When** page loads, **Then** "Track My Complaint Status" section is not present (Item 3)
2. **Given** user navigates to profile page, **When** page loads, **Then** "Latest Complaints" section is not present (Item 4)
3. **Given** user navigates to profile page, **When** page loads, **Then** "SMS Complaint Status Notifications" section is not present (Item 7)
4. **Given** user clicks change password, **When** form appears, **Then** old password field is required before setting new password (Item 5)
5. **Given** user has submitted complaints, **When** user views profile, **Then** their submitted complaints are listed and accessible (Item 6)

**Items covered**: 3, 4, 5, 6, 7

---

### User Story 7 - Home Page Enhancements (Priority: P2)

The home page hero section fits within the viewport, directorates section has English subtitles, news videos support fullscreen, directorate news has "View All" links, archive button is renamed, newsletter confirmation respects locale, and share/save buttons work.

**Why this priority**: The home page is the primary landing experience. These are polish items that improve usability but don't block core functionality.

**Independent Test**: Load home page in both Arabic and English, verify hero height, directorate subtitles, video fullscreen, "View All" buttons, newsletter confirmation locale, and share button.

**Acceptance Scenarios**:

1. **Given** user loads home page, **When** viewport renders, **Then** hero section fits within the visible viewport without scrolling (Item 26)
2. **Given** English locale is active, **When** user views directorates section, **Then** subtitle text is in English (Item 18)
3. **Given** user clicks play on a news video, **When** video player loads, **Then** fullscreen button is available and functional (Item 19)
4. **Given** user views a directorate news section, **When** user looks for navigation, **Then** a "View All" button links to media page filtered by that directorate (Item 20)
5. **Given** user views archive button, **When** page loads, **Then** button text reads "View All" instead of "View Archive" (Item 21)
6. **Given** English locale is active, **When** user subscribes to newsletter, **Then** confirmation message is in English (Item 24)
7. **Given** user clicks share on a news article, **When** share action triggers, **Then** sharing works correctly; save button is either removed or links to a saved section in profile (Item 25)

**Items covered**: 18, 19, 20, 21, 24, 25, 26

---

### User Story 8 - Directorate Page Fixes (Priority: P2)

Directorate and sub-directorate pages have correct margins, English translations for subtitles, no erroneous "e" in service labels, and correct directorate names in sub-directorate detail views.

**Why this priority**: These are content and layout issues that affect readability but not core functionality.

**Independent Test**: Navigate to a directorate page and sub-directorate, verify margins, translations, service labels, and "More Details" directorate name.

**Acceptance Scenarios**:

1. **Given** user navigates to a directorate page, **When** page loads, **Then** proper margin exists between media content and header (Item 27)
2. **Given** English locale is active on a directorate page, **When** user views subtitles, **Then** text is in English (Item 31)
3. **Given** English locale is active, **When** user views service labels, **Then** label reads "service" not "service e" (Item 32)
4. **Given** user clicks "More Details" on a sub-directorate, **When** detail view loads, **Then** the correct directorate name is displayed (Item 50)

**Items covered**: 27, 31, 32, 50

---

### User Story 9 - Article & News Detail Improvements (Priority: P2)

Article detail pages include an AI smart summary button, English-translated publication info, and meaningful time display.

**Why this priority**: Article reading experience improvements. AI summary adds value; translation and time fixes are polish.

**Independent Test**: Open an article detail page in English, verify AI summary button, publication date/time in English, and time-since-published format.

**Acceptance Scenarios**:

1. **Given** user opens an article detail page, **When** page loads, **Then** an AI smart summary button is visible (Item 33)
2. **Given** user clicks AI smart summary button, **When** summary generates, **Then** a concise summary of the article is displayed
3. **Given** English locale is active, **When** user views publication info, **Then** time and date are displayed in English (Item 34)
4. **Given** user views article, **When** publication time is shown, **Then** it displays meaningful relative time or absolute date (not unhelpful "time since" text) (Item 35)

**Items covered**: 33, 34, 35

---

### User Story 10 - Announcements Fixes (Priority: P2)

Announcements page has working print and share buttons, English translation, and filters matching the News/FAQ design.

**Why this priority**: Functional buttons and translations for government announcements are important for public communication.

**Independent Test**: Navigate to announcements in English locale, verify print/share, translation, and filter design.

**Acceptance Scenarios**:

1. **Given** user views an announcement, **When** user clicks print button, **Then** print dialog opens with announcement content (Item 36)
2. **Given** user views an announcement, **When** user clicks share button, **Then** sharing works correctly (Item 36)
3. **Given** English locale is active, **When** user views announcements page, **Then** all content is translated to English (Item 37)
4. **Given** user views announcements or decrees page, **When** user sees filters, **Then** filter design matches News and FAQ page filters (Item 15)

**Items covered**: 15, 36, 37

---

### User Story 11 - Contact Page & FAQ Fixes (Priority: P2)

The contact page displays the correct ministry address persistently and removes the interactive map. The FAQ has the correct answer text for anonymous complaints.

**Why this priority**: Correct contact info is essential for government credibility. Map removal is a simplification.

**Independent Test**: Load contact page, verify address stays correct after re-render, verify no map. Check FAQ anonymous complaint answer.

**Acceptance Scenarios**:

1. **Given** user navigates to contact page, **When** page loads and after any re-render, **Then** ministry address shows "الجمارك مقابل الأمن الجنائي" and does not revert (Item 16)
2. **Given** user navigates to contact page, **When** page loads, **Then** no interactive map is displayed (Item 54)
3. **Given** user views FAQ about anonymous complaints, **When** reading the answer, **Then** the last part reads "ولن يطلع عليه أحد" (Item 17)

**Items covered**: 16, 17, 54

---

### User Story 12 - Services Page Cleanup (Priority: P2)

Electronic services and "Submit Request" buttons are removed since no electronic services exist. Services dropdown dark mode is fixed (covered in Story 1).

**Why this priority**: Showing non-existent electronic services misleads users.

**Independent Test**: Navigate to services page, verify no electronic services list and no "Submit Request" button.

**Acceptance Scenarios**:

1. **Given** user navigates to services page, **When** page loads, **Then** electronic services listing is not present (Item 52)
2. **Given** user views any service detail, **When** page loads, **Then** "Submit Request" button is not present (Item 52)

**Items covered**: 52

---

### User Story 13 - Media Page Video Playback (Priority: P2)

Videos on the media page play correctly.

**Why this priority**: Non-functional videos are a broken feature.

**Independent Test**: Navigate to media page, click play on a video, verify it plays.

**Acceptance Scenarios**:

1. **Given** user navigates to media page, **When** user clicks play on a video, **Then** video plays correctly (Item 51)

**Items covered**: 51

---

### User Story 14 - Performance Optimization (Priority: P3)

The site loads faster, especially on slow internet connections.

**Why this priority**: Performance is important but is a broader optimization effort, not a single fix.

**Independent Test**: Measure page load times on throttled network, compare before and after.

**Acceptance Scenarios**:

1. **Given** user loads the site on a slow connection (3G equivalent), **When** page loads, **Then** initial meaningful content appears faster than current baseline (Item 30)
2. **Given** user navigates between pages, **When** on slow connection, **Then** transitions complete without excessive delay

**Items covered**: 30

---

### Edge Cases

- What happens when clipboard API is unavailable (non-HTTPS, older browsers)? Use fallback copy method (document.execCommand) (Item 43)
- What happens when user rapidly toggles dark/light mode? All components must re-render correctly without stale styles
- What happens when 2FA page is accessed directly via URL without prior login? Redirect to login page
- What happens when user submits a complaint with empty required fields? Validation errors displayed inline
- What happens when AI summary API is unavailable? Show graceful error message, hide or disable the button
- What happens when newsletter subscription is attempted with invalid email? Show localized validation error
- What happens when video source URL is broken or unavailable? Show placeholder/error state instead of blank player

## Requirements *(mandatory)*

### Functional Requirements

**Header & Navigation**
- **FR-001**: System MUST position the Home button adjacent to the Quick Links section in the header (Item 1)
- **FR-002**: System MUST display the logo at a larger size than current and narrow the search bar (Item 2)
- **FR-003**: System MUST remove standalone search bars from sub-pages (news, decrees, announcements); filter inputs remain (Item 14)

**Profile**
- **FR-004**: System MUST NOT display "Track My Complaint Status" section on profile page (Item 3)
- **FR-005**: System MUST NOT display "Latest Complaints" section on profile page (Item 4)
- **FR-006**: System MUST require old password entry when changing password (Item 5)
- **FR-007**: System MUST display user's submitted complaints on profile page (Item 6)
- **FR-008**: System MUST NOT display "SMS Complaint Status Notifications" section on profile page (Item 7)

**Authentication**
- **FR-009**: System MUST show loading indicator during login authentication (Item 8)
- **FR-010**: System MUST cancel loading and return to login form if user leaves the browser tab during authentication (Item 9)
- **FR-011**: System MUST keep 2FA page stable without redirecting back to login (Item 10)
- **FR-012**: System MUST prevent browser back-navigation from returning to 2FA page after successful verification (Item 11)

**Dark Mode**
- **FR-013**: System MUST apply dark mode palette: buttons/icons = dark green, main titles = gold, subtitles/text = white, cards = gray #b3a3d3 (Item 12)
- **FR-014**: System MUST apply dark mode colors to "Read More" buttons (Item 22)
- **FR-015**: System MUST remove background from Quick Links section in dark mode (Item 23)
- **FR-016**: System MUST apply dark theme to ChatBot component (Item 29)
- **FR-017**: System MUST unify dark mode styling between complaint and suggestion forms (Item 47)
- **FR-018**: System MUST fix Services dropdown background in dark mode (not green) (Item 53)

**Search**
- **FR-019**: System MUST make unified search the primary search page with working results and re-search capability (Item 13)
- **FR-020**: System MUST make clear-filters button clearly visible on search results (Item 28)

**Filters**
- **FR-021**: System MUST match announcements and decrees filter design to News and FAQ filter design (Item 15)

**Contact & FAQ**
- **FR-022**: System MUST display correct ministry address "الجمارك مقابل الأمن الجنائي" persistently without reverting (Item 16)
- **FR-023**: System MUST display correct FAQ text "ولن يطلع عليه أحد" for anonymous complaint answer (Item 17)
- **FR-024**: System MUST NOT display an interactive map on the contact page (Item 54)

**Home Page**
- **FR-025**: System MUST display English translation for directorates section subtitle (Item 18)
- **FR-026**: System MUST provide fullscreen capability for news videos (Item 19)
- **FR-027**: System MUST display "View All" button on each directorate news section linking to filtered media page (Item 20)
- **FR-028**: System MUST rename "View Archive" button to "View All" (Item 21)
- **FR-029**: System MUST display newsletter confirmation message in the active locale (Item 24)
- **FR-030**: System MUST make news share button functional; save button removed or linked to profile saved section (Item 25)
- **FR-031**: System MUST render hero section within viewport height without scrolling (Item 26)

**Directorates**
- **FR-032**: System MUST add proper margin between media content and header on directorate pages (Item 27)
- **FR-033**: System MUST display English translation for directorate subtitles (Item 31)
- **FR-034**: System MUST display "service" (not "service e") in English locale (Item 32)
- **FR-035**: System MUST display correct directorate name in sub-directorate "More Details" view (Item 50)

**Articles**
- **FR-036**: System MUST display an AI smart summary button on article detail pages (Item 33)
- **FR-037**: System MUST display publication info (time, date) in English when English locale is active (Item 34)
- **FR-038**: System MUST display meaningful time information for article publication (Item 35)

**Announcements**
- **FR-039**: System MUST provide working print and share buttons on announcements (Item 36)
- **FR-040**: System MUST translate announcements page content to English when English locale is active (Item 37)

**Complaints & Suggestions**
- **FR-041**: System MUST display confirmation message after successful complaint submission (Item 38)
- **FR-042**: System MUST add proper margin between form content and header (Item 39)
- **FR-043**: System MUST translate "General Form" label to current locale (Item 40)
- **FR-044**: System MUST NOT display directorate selection field in complaint form (Item 41)
- **FR-045**: System MUST NOT display identity verification section in complaint form (Item 42)
- **FR-046**: System MUST handle clipboard copy without error on non-HTTPS environments (Item 43)
- **FR-047**: System MUST display "Copied" confirmation when tracking number is copied (Item 44)
- **FR-048**: System MUST orient rating submit arrow correctly for RTL (left) and LTR (right) (Item 45)
- **FR-049**: System MUST successfully submit ratings without error (Item 46)
- **FR-050**: System MUST display failed suggestion error message in Arabic when Arabic locale is active (Item 48)
- **FR-051**: System MUST restrict suggestion tracking national ID input to numbers only (11 digits) and validate ownership match (Item 49)

**Services**
- **FR-052**: System MUST NOT display electronic services listing or "Submit Request" button (Item 52)

**Media**
- **FR-053**: System MUST play videos correctly on the media page (Item 51)

**Performance**
- **FR-054**: System MUST improve page load performance, particularly on slow connections (Item 30)

### Key Entities

- **Complaint**: User-submitted complaint linked to user profile, tracked by generated tracking number
- **Suggestion**: User-submitted suggestion tracked by tracking number and national ID
- **Rating**: User satisfaction rating submitted after interaction, with directional submit control
- **Article**: News content with publication date, AI summary capability, and share functionality
- **Announcement/Decree**: Official communications with print and share functionality
- **Directorate**: Organizational unit with sub-directorates, news, and services

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 dark mode items (12, 22, 23, 29, 47, 53) pass visual review with no bright/white background leaks in dark mode
- **SC-002**: Complaint submission flow completes end-to-end with confirmation message displayed
- **SC-003**: Suggestion submission flow completes end-to-end with localized error/success messages
- **SC-004**: Login with 2FA completes without page instability or ability to navigate back past 2FA
- **SC-005**: Unified search returns results and supports re-querying from results page
- **SC-006**: All locale-dependent text (items 18, 24, 31, 34, 37, 40, 48) displays correctly in both Arabic and English
- **SC-007**: Clipboard copy works on both HTTPS and HTTP environments without JavaScript errors
- **SC-008**: Rating submission succeeds and arrow direction matches text direction
- **SC-009**: Videos play on both media page and home page news section with fullscreen support
- **SC-010**: Hero section renders within viewport bounds (100vh or less)
- **SC-011**: Page load time on simulated 3G connection improves measurably over current baseline
- **SC-012**: No removed sections (items 3, 4, 7, 41, 42, 52, 54) appear in the UI
