# Feature Specification: Frontend UI Fixes and Improvements

**Feature Branch**: `002-frontend-fixes`
**Created**: 2026-01-29
**Status**: Draft
**Input**: User description: "Frontend review feedback document containing 47 tasks covering registration page fixes, complaint system updates, news page fixes, dark mode improvements, localization/translation, and various UI/UX improvements"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registration Page Validation and UX Fixes (Priority: P1)

A new user visits the registration page to create an account. The form fields enforce proper validation: the national ID field accepts a maximum of 11 digits, the phone number field accepts a maximum of 10 digits, the date of birth field is validated, and the email field is validated. The confirmation message states that a verification code will be sent via email only (not phone). Error messages display in Arabic when the interface language is Arabic. The two-factor authentication option is not shown (it is mandatory and not optional). Dropdown items for governorate selection are clearly visible in dark mode.

**Why this priority**: Registration is the entry point for all authenticated user interactions. Broken validation and confusing UX on this page blocks user onboarding.

**Independent Test**: Can be fully tested by navigating to the registration page, filling in fields with invalid data, and verifying that validation rules, error messages (in Arabic), and dark mode styling all function correctly.

**Acceptance Scenarios**:

1. **Given** a user is on the registration page, **When** they enter more than 11 characters in the national ID field, **Then** the field does not accept additional characters beyond 11.
2. **Given** a user is on the registration page, **When** they enter more than 10 characters in the phone number field, **Then** the field does not accept additional characters beyond 10.
3. **Given** a user is on the registration page, **When** they enter an invalid date of birth (e.g., future date, impossible date), **Then** a validation error message appears in the current interface language.
4. **Given** a user is on the registration page, **When** they enter an invalid email address, **Then** a validation error message appears in the current interface language.
5. **Given** a user is on the registration page, **When** the interface language is Arabic and a validation error occurs, **Then** the error message displays in Arabic.
6. **Given** a user is on the registration page, **When** viewing the confirmation step, **Then** the message states that a verification code will be sent via email only.
7. **Given** a user is on the registration page in dark mode, **When** they open the governorate dropdown, **Then** all dropdown items are clearly visible with proper contrast.
8. **Given** a user is on the registration page, **When** viewing the form, **Then** there is no option to toggle two-factor authentication (it is enforced by default).

---

### User Story 2 - Complaint Submission Flow Fixes (Priority: P1)

A user wants to submit a complaint. After choosing between identified or anonymous complaint, they must select a complaint template from a dropdown list. The open complaint template (free-text) is only available for identified complaints. The details input field only appears after selecting the open complaint template. The "select entity" option is removed. When submitting an anonymous complaint, the warning message about anonymous complaints not being tracked is removed (the system does handle anonymous complaints).

**Why this priority**: The complaint system is a core public service feature. Incorrect flow and misleading messages undermine user trust and service delivery.

**Independent Test**: Can be fully tested by navigating to the complaint submission page and going through both identified and anonymous complaint flows, verifying template selection, field visibility, and removed elements.

**Acceptance Scenarios**:

1. **Given** a user selects "anonymous complaint", **When** the complaint form loads, **Then** no warning message about anonymous complaints not being trackable appears.
2. **Given** a user selects identified or anonymous complaint type, **When** the form loads, **Then** a dropdown list of complaint templates is displayed.
3. **Given** a user is submitting an anonymous complaint, **When** viewing the complaint templates dropdown, **Then** the open complaint template (free-text) is not available.
4. **Given** a user has not yet selected a complaint template, **When** viewing the form, **Then** the details/free-text input field is not visible.
5. **Given** a user selects the open complaint template, **When** the template is selected, **Then** the details/free-text input field becomes visible.
6. **Given** a user is on the complaint submission form, **When** viewing the form fields, **Then** there is no "select entity" option.

---

### User Story 3 - News Page and Article Navigation Fixes (Priority: P1)

A user browses the news section. When clicking on a specific news article from the news page, the full article details are displayed correctly (no "article not found" error). The news section title reflects the appropriate department (Ministry News / General Directorate of Industry / General Directorate of Commerce / General Directorate of Internal Trade and Consumer Protection). When clicking "Read More" on a news item from the homepage, the user is taken to that specific article's detail page (not the general news listing).

**Why this priority**: News is a primary content feature. Broken article links and incorrect navigation severely impact the user experience and content accessibility.

**Independent Test**: Can be fully tested by clicking on news articles from both the news listing page and the homepage, verifying correct navigation and content display.

**Acceptance Scenarios**:

1. **Given** a user is on the news page, **When** they click on a specific news article, **Then** the full article details are displayed without errors.
2. **Given** a user is on the news page, **When** viewing the page title, **Then** it displays the appropriate department-specific news title.
3. **Given** a user is on the homepage, **When** they click "Read More" on a news item, **Then** they are navigated to the full article detail page for that specific news item.

---

### User Story 4 - Arabic Localization and Translation Support (Priority: P2)

All user-facing error messages and validation messages display in Arabic when the interface language is set to Arabic. English translations are provided for all content when the interface language is set to English. This applies across all pages including the registration page, homepage, footer, news page, and complaints and suggestions section.

**Why this priority**: The primary audience uses Arabic. Displaying English error messages in an Arabic interface creates confusion and reduces accessibility.

**Independent Test**: Can be fully tested by switching the interface to Arabic and triggering various error states across the site, then switching to English and verifying content is translated.

**Acceptance Scenarios**:

1. **Given** the interface language is Arabic, **When** any error occurs on any page, **Then** the error message displays in Arabic.
2. **Given** the interface language is Arabic, **When** a user adds an email for newsletter subscription in the footer, **Then** any validation error displays in Arabic.
3. **Given** the interface language is English, **When** a user views the news page, **Then** content is displayed in English.
4. **Given** the interface language is English, **When** a user views the complaints and suggestions section, **Then** content is displayed in English.
5. **Given** the interface language is English, **When** a user views any page content, **Then** the content is translated to English.

---

### User Story 5 - Dark Mode Visual Fixes (Priority: P2)

When dark mode is enabled, the background is fully black. All UI elements including dropdowns, search page filters, and form elements have proper contrast and are clearly visible. This applies across the entire application.

**Why this priority**: Dark mode is a supported feature. Poor contrast makes the application unusable for dark mode users.

**Independent Test**: Can be fully tested by enabling dark mode and navigating through all major pages, checking visual contrast and readability.

**Acceptance Scenarios**:

1. **Given** dark mode is enabled, **When** viewing any page, **Then** the background color is black.
2. **Given** dark mode is enabled, **When** viewing the search page, **Then** all filter elements are clearly visible with proper contrast.
3. **Given** dark mode is enabled, **When** opening any dropdown on the registration page, **Then** items are clearly visible and readable.

---

### User Story 6 - Homepage Content and Section Fixes (Priority: P2)

The homepage is updated to remove statistics (including the "1500 electronic services" stat in the hero section), remove the electronic services section, and rename the "Announcements and Notifications" section to just "Announcements." The "View More" button on announcements navigates to the full announcement detail page.

**Why this priority**: Inaccurate statistics and non-functional buttons on the homepage damage credibility and user trust.

**Independent Test**: Can be fully tested by loading the homepage and verifying removed elements are gone, renamed sections display correctly, and announcement navigation works.

**Acceptance Scenarios**:

1. **Given** a user is on the homepage, **When** viewing the hero section, **Then** no statistics (including "1500 electronic services") are displayed.
2. **Given** a user is on the homepage, **When** viewing the page sections, **Then** there is no "Electronic Services" section.
3. **Given** a user is on the homepage, **When** viewing the announcements section, **Then** the section title is "Announcements" (not "Announcements and Notifications").
4. **Given** a user is on the homepage, **When** they click "View More" on an announcement, **Then** they are navigated to the full announcement detail page.

---

### User Story 7 - Suggestions Section Updates (Priority: P2)

The suggestions submission mechanism is updated as previously discussed. Suggestions are also included alongside complaints in the "Complaints and Suggestions" section.

**Why this priority**: Suggestions are part of public engagement. Proper integration with the complaints section ensures a unified experience.

**Independent Test**: Can be fully tested by navigating to the complaints and suggestions section and verifying suggestions are listed and submittable.

**Acceptance Scenarios**:

1. **Given** a user navigates to the complaints and suggestions section, **When** viewing the section, **Then** suggestions are listed alongside complaints.
2. **Given** a user wants to submit a suggestion, **When** they use the updated suggestion mechanism, **Then** the suggestion is submitted successfully.

---

### User Story 8 - Two-Factor Authentication Page (Priority: P2)

A dedicated two-factor authentication page exists and is functional. Users are directed to this page during the authentication flow.

**Why this priority**: Two-factor authentication is mandatory. Without a dedicated page, users cannot complete the authentication process.

**Independent Test**: Can be fully tested by registering/logging in and verifying the two-factor authentication page appears and functions correctly.

**Acceptance Scenarios**:

1. **Given** a user has completed initial login, **When** the authentication flow proceeds, **Then** a two-factor authentication page is presented.
2. **Given** a user is on the two-factor authentication page, **When** they enter the correct code, **Then** they are authenticated successfully.

---

### User Story 9 - Footer Fixes (Priority: P3)

The footer is updated: "admin login" link is removed, the copyright notice reads "2026", the font size/accessibility buttons (zoom in, zoom out, contrast) work correctly, and newsletter subscription error messages display in the current interface language.

**Why this priority**: Footer issues are visible on every page but are lower impact than functional bugs.

**Independent Test**: Can be fully tested by scrolling to the footer on any page and verifying each element.

**Acceptance Scenarios**:

1. **Given** a user views the footer, **When** looking at the links, **Then** there is no "admin login" link.
2. **Given** a user views the footer, **When** reading the copyright, **Then** it displays "2026".
3. **Given** a user clicks the zoom in/zoom out/contrast buttons in the footer, **When** each button is clicked, **Then** the corresponding accessibility function works correctly.

---

### User Story 10 - Header Dropdown UX Improvement (Priority: P3)

The navigation dropdown menus in the header do not disappear too quickly when the user moves the cursor downward. The dropdown remains visible long enough for the user to interact with the menu items.

**Why this priority**: Navigation usability issue that affects discoverability but does not block core functionality.

**Independent Test**: Can be fully tested by hovering over header menu items and moving the cursor toward dropdown items.

**Acceptance Scenarios**:

1. **Given** a user hovers over a header menu item, **When** they move the cursor downward toward the dropdown items, **Then** the dropdown remains visible and accessible.

---

### User Story 11 - FAQ Section Updates (Priority: P3)

The "All Questions" button is either made functional or removed. The anonymous complaint FAQ answer is updated to clarify that the identity of anonymous complainants is protected. The FAQ about electronic transaction processing time is removed (no electronic transactions exist on the site).

**Why this priority**: FAQ content accuracy is important but affects a smaller subset of users.

**Independent Test**: Can be fully tested by navigating to the FAQ section and verifying content changes.

**Acceptance Scenarios**:

1. **Given** a user is on the FAQ section, **When** viewing the available questions, **Then** the "All Questions" button either works correctly or is not present.
2. **Given** a user reads the anonymous complaint FAQ, **When** reading the answer, **Then** it correctly states that the identity of anonymous complainants is protected.
3. **Given** a user views the FAQ section, **When** looking for the electronic transactions question, **Then** it is not present.

---

### User Story 12 - Services Page Filter Fix (Priority: P3)

The electronic/in-person filter is removed from the services page since all services are in-person.

**Why this priority**: Minor UI cleanup that removes a misleading filter.

**Independent Test**: Can be fully tested by navigating to the services page and verifying the filter is absent.

**Acceptance Scenarios**:

1. **Given** a user is on the services page, **When** viewing the available filters, **Then** there is no electronic/in-person filter.

---

### User Story 13 - Departments Page Wireframe Compliance (Priority: P3)

The departments page layout and design matches the approved wireframe.

**Why this priority**: Visual consistency with approved designs, but not a functional blocker.

**Independent Test**: Can be fully tested by comparing the departments page against the wireframe design.

**Acceptance Scenarios**:

1. **Given** a user navigates to the departments page, **When** viewing the layout, **Then** it matches the approved wireframe design.

---

### User Story 14 - Search Page Improvements (Priority: P3)

Search page filters are clearly visible in dark mode. When a user searches for new content, a loading/interaction indicator is displayed during the search process.

**Why this priority**: Search usability improvements that enhance but don't block functionality.

**Independent Test**: Can be fully tested by performing searches in dark mode and verifying filter visibility and loading indicators.

**Acceptance Scenarios**:

1. **Given** dark mode is enabled, **When** a user views the search page filters, **Then** all filters are clearly visible with proper contrast.
2. **Given** a user performs a search, **When** results are being loaded, **Then** a loading indicator is displayed.

---

### User Story 15 - Minor Text, Label, and Content Updates (Priority: P3)

Several text and label updates across the application: rename "Track Request Status" to "Track Complaint Status" in the complaints/suggestions section and user profile; update the ministry address on the contact page to "Customs, opposite Criminal Security"; update the privacy policy update date; and update the AI assistant popup button to be larger and more visible.

**Why this priority**: Text corrections that improve clarity but are not functional blockers.

**Independent Test**: Can be fully tested by navigating to each affected page and verifying the text content.

**Acceptance Scenarios**:

1. **Given** a user is on the complaints and suggestions section, **When** viewing the tracking option, **Then** it reads "Track Complaint Status" (not "Track Request Status").
2. **Given** a user is on their profile page, **When** viewing the tracking option, **Then** it reads "Track Complaint Status".
3. **Given** a user views the contact page, **When** reading the ministry address, **Then** it reads "Customs, opposite Criminal Security".
4. **Given** a user views the privacy policy, **When** checking the update date, **Then** it reflects the most recent update date.
5. **Given** a user sees the AI assistant button, **When** viewing it, **Then** the button is large enough to be clearly visible and the popup does not push the user to the middle of the page.

---

### User Story 16 - Terms of Use Updates (Priority: P3)

The "Publishing offensive and inappropriate content" section is removed from the terms of use. The second clause from the intellectual property section is removed.

**Why this priority**: Content policy updates that are straightforward text changes.

**Independent Test**: Can be fully tested by navigating to the terms of use page and verifying removed sections.

**Acceptance Scenarios**:

1. **Given** a user views the terms of use, **When** reading the content, **Then** there is no section about "Publishing offensive and inappropriate content".
2. **Given** a user views the intellectual property section in the terms of use, **When** reading the clauses, **Then** the second clause is not present.

---

### User Story 17 - Profile Email Edit Feature (Priority: P2)

Users can edit their email address from their profile page.

**Why this priority**: Account management feature that affects user autonomy.

**Independent Test**: Can be fully tested by logging in, navigating to the profile, and attempting to change the email address.

**Acceptance Scenarios**:

1. **Given** a logged-in user is on their profile page, **When** they choose to edit their email, **Then** they can enter a new email address and save it.
2. **Given** a user submits a new email address, **When** the change is saved, **Then** the new email is validated and a verification process is initiated.

---

### User Story 18 - Logo Replacement (Priority: P3)

The logo used on the registration and login pages is replaced with the approved logo from the provided source.

**Why this priority**: Branding update that is a straightforward asset replacement.

**Independent Test**: Can be fully tested by viewing the registration and login pages and verifying the correct logo is displayed.

**Acceptance Scenarios**:

1. **Given** a user is on the registration page, **When** viewing the page header/branding, **Then** the approved logo is displayed.
2. **Given** a user is on the login page, **When** viewing the page header/branding, **Then** the approved logo is displayed.

---

### Edge Cases

- What happens when a user enters exactly 11 characters in the national ID field? (Should be accepted)
- What happens when a user enters non-numeric characters in the national ID or phone fields?
- How does the system handle a date of birth that makes the user under a minimum required age?
- What happens if the two-factor authentication page times out?
- What happens when a user tries to submit a complaint without selecting a template?
- How does the search page behave when no results are found in dark mode?
- What happens when a user tries to edit their email to one that is already in use?
- What happens when the newsletter subscription email field is submitted empty?

## Requirements *(mandatory)*

### Functional Requirements

**Registration Page (Tasks 1-8)**
- **FR-001**: The national ID field MUST limit input to a maximum of 11 characters.
- **FR-002**: The phone number field MUST limit input to a maximum of 10 characters.
- **FR-003**: The date of birth field MUST be validated (no future dates, valid date format).
- **FR-004**: The email field MUST be validated against standard email format rules.
- **FR-005**: The verification code confirmation message MUST state "via email" only (not phone).
- **FR-006**: Governorate dropdown items MUST be clearly visible in dark mode with proper contrast.
- **FR-007**: All error messages MUST display in the current interface language (Arabic when Arabic is selected).
- **FR-008**: The two-factor authentication toggle option MUST be removed from the registration page (2FA is mandatory).

**Two-Factor Authentication (Task 9)**
- **FR-009**: A dedicated two-factor authentication page MUST exist and function correctly during the authentication flow.

**Suggestions Section (Tasks 10-11)**
- **FR-010**: The suggestion submission mechanism MUST follow the previously agreed-upon design.
- **FR-011**: Suggestions MUST be included in the "Complaints and Suggestions" section.

**Complaint Submission (Tasks 12-14)**
- **FR-012**: The warning message about anonymous complaints not being trackable MUST be removed.
- **FR-013**: After selecting identified or anonymous complaint type, a complaint template dropdown MUST be displayed.
- **FR-014**: The open complaint template (free-text) MUST NOT be available for anonymous complaints.
- **FR-015**: The details input field MUST only appear after the open complaint template is selected.
- **FR-016**: The "select entity" option MUST be removed from the complaint form.

**Header Navigation (Task 15)**
- **FR-017**: Header dropdown menus MUST remain visible long enough for users to move their cursor to and interact with dropdown items.

**News Section (Tasks 16-18)**
- **FR-018**: Clicking on a news article from the news page MUST display the full article details without errors.
- **FR-019**: The news page title MUST reflect the appropriate department name (Ministry / Industry / Commerce / Internal Trade and Consumer Protection).
- **FR-020**: The "Read More" button on homepage news items MUST navigate to the specific article detail page.

**Homepage (Tasks 19, 31-32, 46)**
- **FR-021**: The "View More" button on homepage announcements MUST navigate to the announcement detail page.
- **FR-022**: All statistics MUST be removed from the homepage, including the "1500 electronic services" stat in the hero section.
- **FR-023**: The electronic services section MUST be removed from the homepage.
- **FR-024**: The "Announcements and Notifications" section MUST be renamed to "Announcements".

**Services Page (Task 20)**
- **FR-025**: The electronic/in-person filter MUST be removed from the services page.

**FAQ Section (Tasks 21-23)**
- **FR-026**: The "All Questions" button MUST either function correctly or be removed.
- **FR-027**: The anonymous complaint FAQ answer MUST be updated to clarify identity protection.
- **FR-028**: The FAQ about electronic transaction processing time MUST be removed.

**Departments Page (Task 24)**
- **FR-029**: The departments page layout MUST match the approved wireframe.

**Dark Mode (Tasks 25, 36)**
- **FR-030**: Dark mode background MUST be black.
- **FR-031**: Search page filters MUST be clearly visible in dark mode.

**Footer (Tasks 26-29)**
- **FR-032**: The "admin login" link MUST be removed from the footer.
- **FR-033**: Newsletter subscription error messages MUST display in the current interface language.
- **FR-034**: The copyright notice MUST read "2026".
- **FR-035**: The zoom in, zoom out, and contrast accessibility buttons MUST function correctly.

**Localization (Tasks 30, 38-40)**
- **FR-036**: All error messages across the site MUST display in the current interface language.
- **FR-037**: English translations MUST be available for news page content.
- **FR-038**: English translations MUST be available for the complaints and suggestions section.
- **FR-039**: All content MUST be translated when the interface language is English.

**Search Page (Task 37)**
- **FR-040**: A loading/interaction indicator MUST display when searching for content.

**Complaints and Suggestions Labels (Tasks 41-42)**
- **FR-041**: "Track Request Status" MUST be renamed to "Track Complaint Status" in the complaints and suggestions section.
- **FR-042**: "Track Request Status" MUST be renamed to "Track Complaint Status" in the user profile.

**Profile (Task 43)**
- **FR-043**: Users MUST be able to edit their email address from the profile page.

**Contact Page (Task 44)**
- **FR-044**: The ministry address MUST be updated to "Customs, opposite Criminal Security".

**AI Assistant (Task 45)**
- **FR-045**: The AI assistant popup button MUST be larger and more clearly visible.
- **FR-046**: The AI assistant popup MUST NOT push the user to the middle of the page.

**Terms of Use (Tasks 33-34)**
- **FR-047**: The "Publishing offensive and inappropriate content" section MUST be removed.
- **FR-048**: The second clause of the intellectual property section MUST be removed.

**Privacy Policy (Task 35)**
- **FR-049**: The privacy policy update date MUST be updated to the current date.

**Logo (Task 47)**
- **FR-050**: The logo on the registration and login pages MUST be replaced with the approved logo from the provided source.

### Key Entities

- **Complaint**: A submission (identified or anonymous) that follows a template-based flow with optional free-text details.
- **Complaint Template**: A predefined format for complaints, including an "open" (free-text) template available only for identified complaints.
- **Suggestion**: A public engagement submission included in the complaints and suggestions section.
- **News Article**: Content item categorized by department with full detail view.
- **Announcement**: A public notice displayed on the homepage with a detail view.
- **User Profile**: Account information including email editing capability and complaint tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of registration form fields enforce their specified validation rules (11-char national ID, 10-char phone, valid email, valid date of birth).
- **SC-002**: 100% of error messages display in the correct interface language (Arabic or English) across all pages.
- **SC-003**: Users can navigate from any news listing (homepage or news page) to the full article detail page in one click without encountering errors.
- **SC-004**: The complaint submission flow allows completion within 3 steps (choose type, select template, submit) without displaying removed elements.
- **SC-005**: All dark mode pages pass a minimum contrast ratio of 4.5:1 for text elements.
- **SC-006**: All 47 identified issues are resolved and verified through manual testing.
- **SC-007**: English content is available for all major sections when the interface language is set to English.
- **SC-008**: All footer accessibility buttons (zoom, contrast) function as expected when clicked.
- **SC-009**: The two-factor authentication flow is completed successfully by 95% of users on first attempt.
- **SC-010**: All text labels match the specified corrections (complaint status tracking, section names, copyright year).

## Assumptions

- The "previously agreed-upon" suggestion submission mechanism (Task 10) refers to an existing design document or discussion that the development team has access to.
- The approved wireframe for the departments page (Task 24) is available to the development team.
- The approved logo (Task 47) is accessible from the provided Google Drive link.
- "Black background" for dark mode (Task 25) means a true black (#000000) or near-black background, consistent with common dark mode implementations.
- The ministry address update (Task 44) uses the exact Arabic phrasing: "الجمارك مقابل الأمن الجنائي".
- English translation (Tasks 38-40) refers to providing translated UI labels and static content; dynamic user-generated content translation is not in scope.
- The two-factor authentication page (Task 9) follows standard OTP-via-email flow since phone-based verification is excluded (Task 5).
