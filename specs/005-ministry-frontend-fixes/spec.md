# Feature Specification: Ministry Portal Comprehensive Amendments

**Feature Branch**: `005-ministry-frontend-fixes`
**Created**: 2026-02-10
**Status**: Draft
**Input**: All amendments from SURIA MINISTER WORK Trello board (3 lists, ~93 items)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile-First Responsive Experience (Priority: P1)

A citizen accesses the ministry portal from their mobile phone. The site displays correctly on all screen sizes, with the logo properly sized, news cards fully visible without clipping, card images filling full width without white margins, and all text/icons visible without overflow issues.

**Why this priority**: The majority of users will access the portal from mobile devices. Poor mobile experience directly impacts citizen engagement with government services.

**Independent Test**: Can be tested by loading every page on various mobile screen sizes and verifying no visual breakage, overflow, or clipping occurs.

**Acceptance Scenarios**:

1. **Given** a user on a small mobile screen, **When** they load the homepage, **Then** the header logo scales responsively without stretching or overlapping other elements.
2. **Given** a user viewing news cards on mobile, **When** the cards render, **Then** all card content (text, icons, images) is fully visible with no clipping or overflow.
3. **Given** a user viewing a news card on mobile, **When** the card image loads, **Then** it fills the full top width of the card without white padding on edges.
4. **Given** a user in the media center on mobile, **When** switching from grid to list view, **Then** alignment is consistent and text/visual elements are uniformly sized.
5. **Given** a user in the media center on mobile, **When** viewing a media card, **Then** download and share buttons are visible and functional.

---

### User Story 2 - Authentication & Login Flow (Priority: P1)

A citizen logs in, completes two-factor authentication, and navigates the portal. The login flow handles window focus loss gracefully, prevents back-navigation to auth pages after completion, and the "Forgot Password" feature works correctly.

**Why this priority**: Authentication is the gateway to all protected services. Broken auth flows block citizens from complaints, profile management, and personalized features.

**Independent Test**: Can be tested by completing full login → 2FA → dashboard flow, testing window switching during 2FA, testing back button after auth, and testing forgot password.

**Acceptance Scenarios**:

1. **Given** a user on the 2FA verification page, **When** they switch away from the browser window and return, **Then** the loading state persists and verification continues without requiring a new login.
2. **Given** a user who has completed 2FA, **When** they press the browser back button, **Then** they are NOT taken back to the 2FA or login page.
3. **Given** a user on the login page, **When** they click "Forgot Password", **Then** the password recovery flow works correctly end-to-end.
4. **Given** a user on the login page, **When** viewing the login form, **Then** a WhatsApp contact option is available for support.
5. **Given** a user on the login page, **When** viewing the green branding section, **Then** it remains fixed/sticky and does not scroll away.

---

### User Story 3 - Complaints & Suggestions System (Priority: P1)

A citizen submits a complaint or suggestion, receives a tracking number, and can track its status. The system enforces proper complaint statuses (Received, In Progress, Completed/Responded), allows rating at submission and upon resolution, and shows the receiving entity when selecting a complaint form.

**Why this priority**: The complaints and suggestions system is a core citizen service for government accountability and public engagement.

**Independent Test**: Can be tested by submitting a complaint, tracking it, verifying status flow, and checking rating functionality.

**Acceptance Scenarios**:

1. **Given** a citizen on the complaints page, **When** they select a complaint form type, **Then** they see which entity/department will receive their complaint.
2. **Given** a citizen submitting a complaint, **When** submission completes, **Then** they are prompted to rate the submission experience.
3. **Given** a citizen with a resolved complaint, **When** they view the resolution, **Then** they are prompted to rate the resolution experience.
4. **Given** a citizen tracking a complaint, **When** viewing status, **Then** only valid statuses are shown: Received (واردة), In Progress (قيد المعالجة), Completed/Responded (منتهية/تم الرد عليها).
5. **Given** an admin on the dashboard, **When** managing complaints, **Then** they can configure complaint submission rules/controls.
6. **Given** a citizen on the suggestions page, **When** they submit a suggestion (known or anonymous), **Then** they receive a tracking number and can track its status.
7. **Given** a citizen on the suggestions page, **When** the form loads, **Then** no identity verification section is shown (removed requirement).
8. **Given** a citizen uploading attachments, **When** the file upload is in progress, **Then** a live progress bar shows the upload percentage.

---

### User Story 4 - Favorites & Personalization (Priority: P2)

A logged-in user can add content (news, announcements, services, laws) to their favorites. A favorites section appears in their profile. The save icon on news cards is replaced with a heart icon for adding to favorites.

**Why this priority**: Personalization increases user engagement and return visits, making the portal more useful for citizens who follow specific topics.

**Independent Test**: Can be tested by favoriting content from different sections and verifying it appears in the profile favorites section.

**Acceptance Scenarios**:

1. **Given** a logged-in user viewing a news article, **When** they tap the heart/favorite icon, **Then** the article is saved to their favorites.
2. **Given** a logged-in user on their profile, **When** they navigate to favorites, **Then** all favorited content (news, announcements, services, laws) is displayed.
3. **Given** a user on the homepage news section, **When** they see a news card, **Then** the save button is a heart icon (not a bookmark) that adds to favorites.

---

### User Story 5 - Homepage & Hero Section Improvements (Priority: P2)

A citizen visits the homepage and sees an updated hero section with a larger eagle emblem (with shadow, cursor-following animation but no pulsing), a narrower news ticker integrated within the hero, animated promotional taglines, and a triangular layout for the three main departments.

**Why this priority**: The homepage is the first impression of the ministry portal and sets the tone for citizen trust and engagement.

**Independent Test**: Can be tested by loading the homepage and verifying each visual element matches the specification.

**Acceptance Scenarios**:

1. **Given** a user on the homepage, **When** they view the hero section, **Then** the eagle emblem is larger, has a shadow effect, follows the cursor, and does NOT pulse.
2. **Given** a user on the homepage, **When** they view the news ticker, **Then** it is narrower, positioned within the hero section, and news items scroll in the reversed direction.
3. **Given** a user on the homepage, **When** they view taglines (Secure Portal, Integrated Services, Digital Future), **Then** they animate/rotate rather than displaying statically.
4. **Given** a user on the homepage, **When** they view the three departments, **Then** they are displayed in a triangular arrangement with smaller, more visually appealing cards.
5. **Given** a user on the homepage, **When** they view the hero section buttons, **Then** the buttons are updated per ministry requirements and the section has reduced excess whitespace.
6. **Given** a user on the homepage, **When** they scroll down, **Then** a complaints section appears before quick links, and a suggestions section appears after affiliated entities.
7. **Given** a user on the homepage, **When** viewing the page, **Then** the "Stay Updated" newsletter section is removed from the main content (kept only in footer).

---

### User Story 6 - Directorate & Organizational Structure (Priority: P2)

A citizen clicks on a directorate and lands on a dedicated page for that specific directorate (not the parent administration). Each directorate page resembles the homepage structure but with directorate-specific content. Sub-directorates show their own detailed information. The page is renamed from "Directorates" to "Organizational Structure" and displays directorates in a structured/hierarchical format.

**Why this priority**: Citizens need to navigate the ministry structure to find relevant services and contacts for their specific directorate.

**Independent Test**: Can be tested by clicking on each directorate and sub-directorate and verifying correct routing and content display.

**Acceptance Scenarios**:

1. **Given** a user on the homepage, **When** they click a directorate card, **Then** they navigate to that directorate's dedicated page (not a generic administration page).
2. **Given** a user on a directorate page, **When** viewing the page, **Then** it resembles the homepage layout with directorate-specific content (news, services, contact info).
3. **Given** a user on a directorate page, **When** they click a sub-directorate, **Then** they see specific information about that sub-directorate.
4. **Given** a user navigating to the directorates section, **When** the page loads, **Then** the page title reads "Organizational Structure" and directorates are shown in a hierarchical/structured format.
5. **Given** a user on a directorate page, **When** viewing contact information, **Then** the contact details are specific to that directorate (not generic ministry-wide).

---

### User Story 7 - Internationalization & Translation (Priority: P2)

A user switches to English and all portal content, forms, date/time displays, newsletter confirmations, and complaint forms are fully translated. No Arabic-only text remains in the English version.

**Why this priority**: A government portal must be accessible to non-Arabic speakers, and incomplete translations undermine credibility.

**Independent Test**: Can be tested by switching to English and verifying every page, form, and message displays correctly in English.

**Acceptance Scenarios**:

1. **Given** a user in English mode viewing a news article, **When** they see publication time and date, **Then** it is displayed in English format.
2. **Given** a user in English mode subscribing to the newsletter, **When** they receive a confirmation message, **Then** it is in English.
3. **Given** a user in English mode on the complaints page, **When** they select the general complaint form, **Then** all form labels and content are in English.
4. **Given** a user in English mode on the announcements page, **When** viewing announcements, **Then** all content is fully translated to English.

---

### User Story 8 - Navigation, Loading & UX Improvements (Priority: P2)

A user navigates the portal with breadcrumbs on all inner pages, sees branded loading animations when transitioning between pages, skeleton loading states while content loads, a scroll-to-top arrow, and hover shadows on cards.

**Why this priority**: Smooth navigation and loading feedback creates a professional, trustworthy experience for a government portal.

**Independent Test**: Can be tested by navigating between pages and verifying breadcrumbs, loading states, skeleton loaders, and scroll-to-top functionality.

**Acceptance Scenarios**:

1. **Given** a user on any inner page, **When** the page renders, **Then** a breadcrumb trail is visible (e.g., Home > Services > Industrial Services).
2. **Given** a user clicking a navigation link, **When** the new page loads, **Then** a branded loading indicator (eagle emblem + loading animation) appears.
3. **Given** a user waiting for content to load, **When** data is being fetched, **Then** skeleton loading placeholders are shown instead of blank space.
4. **Given** a user who has scrolled down, **When** they want to return to the top, **Then** a scroll-to-top arrow button is visible and functional.
5. **Given** a user hovering over any card, **When** the hover state activates, **Then** a professional gold-tinted shadow appears on the card.

---

### User Story 9 - Media Center & Content Fixes (Priority: P2)

A user visits the media center and all media types (videos, photos, infographics) load and play correctly, including video audio. The filter system matches the news page filter pattern. Pagination is applied across media, announcements, and services pages.

**Why this priority**: Non-functional media and inconsistent filtering undermines the portal's content delivery mission.

**Independent Test**: Can be tested by playing videos (checking audio), filtering media, and verifying pagination on content listing pages.

**Acceptance Scenarios**:

1. **Given** a user in the media center, **When** they play a video, **Then** video plays with working audio.
2. **Given** a user in the media center, **When** they browse media items, **Then** all media loads and displays correctly.
3. **Given** a user on announcements, laws, or FAQ pages, **When** they use the filter, **Then** the filter matches the news page filter design.
4. **Given** a user on any content listing page (media, announcements, services), **When** there are many items, **Then** pagination is available to navigate between pages.
5. **Given** a user viewing the AI summary button on a single news article page, **When** they click it, **Then** the AI-generated summary loads and displays correctly.

---

### User Story 10 - Form Validation & Input Improvements (Priority: P2)

All form fields across the portal display clear validation messages when input is incorrect, with visual indicators (green for valid, red for invalid). Phone number fields include country code selectors. All phone numbers and emails throughout the site are clickable links.

**Why this priority**: Proper validation prevents submission errors and reduces citizen frustration with government forms.

**Independent Test**: Can be tested by entering invalid data in every form field and verifying appropriate validation messages appear.

**Acceptance Scenarios**:

1. **Given** a user filling out any form, **When** they enter invalid data, **Then** a clear validation message appears explaining the error and how to fix it, with red visual styling.
2. **Given** a user filling out any form, **When** they enter valid data, **Then** the field shows a green visual indicator.
3. **Given** a user entering a phone number, **When** the phone field is active, **Then** a country code selector is available, and the number format adjusts after selection.
4. **Given** a user viewing any page with phone numbers or emails, **When** they see contact information, **Then** all numbers and emails are clickable links (tel: and mailto:).

---

### User Story 11 - Footer & Header Updates (Priority: P3)

The portal header uses the updated ministry logo, elements are reordered per ministry requirements. The footer replaces quick links with social media links, changes the gold line color to green, updates the copyright to "Ministry of Economy and Industry", and shortens the tagline to "The trusted source for information and services."

**Why this priority**: Branding consistency with the ministry's identity is important for official government portals.

**Independent Test**: Can be tested by checking header/footer elements against the specified requirements on any page.

**Acceptance Scenarios**:

1. **Given** a user on any page, **When** viewing the header, **Then** the logo matches the provided updated logo file and header elements are reordered per specification.
2. **Given** a user on any page, **When** viewing the footer, **Then** quick links are replaced with social media page links.
3. **Given** a user on any page, **When** viewing the footer, **Then** the line color is green (not gold) and copyright reads "Ministry of Economy and Industry."
4. **Given** a user on any page, **When** viewing the footer tagline, **Then** it reads only "The trusted source for information and services."

---

### User Story 12 - Dark Mode Consistency (Priority: P3)

A user in dark mode sees consistent styling across all pages. The work hours card on the contact page matches other cards. All icons and text have proper contrast.

**Why this priority**: Dark mode inconsistencies make the portal look unpolished.

**Independent Test**: Can be tested by enabling dark mode and checking every page for visual consistency.

**Acceptance Scenarios**:

1. **Given** a user in dark mode on the contact page, **When** viewing the work hours card, **Then** it matches the styling of other cards on the page.
2. **Given** a user in dark mode, **When** visiting any page, **Then** all icons and text are clearly visible with proper contrast, with no overlapping.

---

### User Story 13 - Chatbot & Search Intelligence (Priority: P3)

The AI chatbot is trained on portal content, uses the correct ministry name, and provides accurate answers. The search feature suggests similar text as users type (autocomplete).

**Why this priority**: Intelligent search and chatbot reduce the need for manual navigation and support calls.

**Independent Test**: Can be tested by asking the chatbot portal-specific questions and testing search autocomplete.

**Acceptance Scenarios**:

1. **Given** a user interacting with the chatbot, **When** they ask "How many directorates are there?" or "Where is the ministry?", **Then** the chatbot responds accurately based on portal content.
2. **Given** a user viewing the chatbot welcome message, **When** it appears, **Then** the ministry name is correct and the message is concise.
3. **Given** a user typing in the search bar, **When** they begin typing, **Then** suggested matches appear below the search input.

---

### User Story 14 - Profile & Settings Management (Priority: P2)

A logged-in user manages their profile with current password required for password changes. Complaints are linked to the user's profile. The SMS complaint notification section is removed from settings.

**Why this priority**: Profile management is a core authenticated feature for citizen engagement.

**Independent Test**: Can be tested by modifying profile settings, changing password, and verifying linked complaints.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the profile page, **When** they attempt to change their password, **Then** they must enter their current password first.
2. **Given** a logged-in user on the profile page, **When** viewing their complaints, **Then** they see their own submitted complaints linked to their account.
3. **Given** a logged-in user in notification settings, **When** viewing options, **Then** no SMS complaint notification section is displayed.

---

### User Story 15 - Admin Dashboard Controls (Priority: P3)

Administrators can manage complaint submission rules, enable/disable the investment section, and manage announcements from the dashboard.

**Why this priority**: Admin controls allow non-technical staff to manage portal content and behavior.

**Independent Test**: Can be tested by logging in as admin and toggling settings, then verifying changes on the public portal.

**Acceptance Scenarios**:

1. **Given** an admin on the dashboard, **When** they edit complaint/suggestion submission rules, **Then** the changes are reflected on the public complaints page.
2. **Given** an admin on the dashboard, **When** they toggle the investment section on/off, **Then** the investment section appears/disappears on the public portal.

---

### User Story 16 - Animations & Visual Polish (Priority: P3)

The portal features more animations throughout (similar to the media center section on the homepage), with interactive card hover effects and smooth page transitions.

**Why this priority**: Visual polish creates a modern, engaging user experience that reflects well on the ministry.

**Independent Test**: Can be tested by scrolling through pages and verifying animations trigger on scroll, hover, and navigation.

**Acceptance Scenarios**:

1. **Given** a user scrolling the homepage, **When** sections come into view, **Then** smooth entrance animations play (similar to media center section).
2. **Given** a user hovering over any card, **When** the hover is detected, **Then** a gold-tinted shadow animation appears.

---

### User Story 17 - FAQ Content Update (Priority: P3)

The FAQ section's anonymous complaint question is updated to clarify that "no one will see" the anonymous submitter's identity, since the identity of the anonymous complainant is unknown.

**Why this priority**: Accurate FAQ content builds citizen trust in the anonymous complaint system.

**Independent Test**: Can be tested by viewing the FAQ page and locating the anonymous complaint question.

**Acceptance Scenarios**:

1. **Given** a user on the FAQ page, **When** they find the anonymous complaint question, **Then** the answer's last section reads "ولن يطلع عليه أحد" (and no one will see it) clarifying that no one knows the anonymous submitter's identity.

---

### User Story 18 - Map & Directorate Locations (Priority: P3)

The interactive map supports pinning directorates at specific geographic locations, allowing citizens to find nearby government offices.

**Why this priority**: Geographic location of services helps citizens physically access government offices.

**Independent Test**: Can be tested by viewing the map and verifying directorate pins appear at correct locations.

**Acceptance Scenarios**:

1. **Given** an admin managing directorates, **When** they assign a geographic location to a directorate, **Then** the directorate appears as a pin on the interactive map.
2. **Given** a user viewing the map, **When** they click a directorate pin, **Then** they see that directorate's information.

---

### Edge Cases

- What happens when a user on a very old mobile device (small screen) views the portal? All content must degrade gracefully.
- What happens when a user has no internet during file upload? The progress bar should show a clear error state.
- What happens when a user favorites content while not logged in? They should be prompted to log in first.
- What happens when the chatbot cannot answer a question? It should gracefully acknowledge and suggest contacting support.
- What happens when all filters are active and no content matches? A "no results" message should display.
- What happens when a user submits a complaint in English but the complaint form type has no English translation? The form should still be submittable with available translations.

## Requirements *(mandatory)*

### Functional Requirements

**Mobile & Responsiveness:**
- **FR-001**: Portal MUST display correctly on all mobile screen sizes (320px and above) with no overflow, clipping, or element overlap.
- **FR-002**: Header logo MUST scale responsively on all devices without stretching or overlapping.
- **FR-003**: News card images MUST fill the full top width of cards without white padding.
- **FR-004**: Media center list/grid view toggle MUST maintain consistent alignment and sizing.

**Authentication:**
- **FR-005**: Two-factor authentication page MUST continue loading when user switches away from browser window and returns.
- **FR-006**: After completing authentication, browser back button MUST NOT navigate to login or 2FA pages.
- **FR-007**: "Forgot Password" on the login page MUST trigger a working password recovery flow.
- **FR-008**: Login page MUST include a WhatsApp support contact option.
- **FR-009**: Login page green branding section MUST remain fixed (not scroll).

**Complaints & Suggestions:**
- **FR-010**: System MUST display which entity receives the complaint when a user selects a complaint form type.
- **FR-011**: System MUST prompt users to rate the experience both at submission time and when resolution is received.
- **FR-012**: Complaint statuses MUST be limited to: Received (واردة), In Progress (قيد المعالجة), Completed/Responded (منتهية/تم الرد عليها).
- **FR-013**: Suggestion tracking MUST work for both known-identity and anonymous submissions.
- **FR-014**: Suggestions page MUST NOT include an identity verification section.
- **FR-015**: File upload MUST show a live progress bar during upload.
- **FR-016**: Complaint/suggestion submission rules MUST be configurable from the admin dashboard.

**Favorites:**
- **FR-017**: Users MUST be able to add news, announcements, services, and laws to their favorites.
- **FR-018**: News card save button MUST be replaced with a heart/favorite icon.
- **FR-019**: User profile MUST include a favorites section showing all saved content.

**Homepage:**
- **FR-020**: Eagle emblem in hero MUST be larger, include shadow, follow cursor movement, and NOT have pulsing animation.
- **FR-021**: News ticker MUST be narrower, placed within hero section, with reversed scroll direction.
- **FR-022**: Portal taglines MUST animate/rotate rather than display statically.
- **FR-023**: Three main departments MUST display in triangular arrangement with smaller cards.
- **FR-024**: Hero section buttons MUST be updated per ministry specification.
- **FR-025**: Hero section MUST have reduced excess whitespace.
- **FR-026**: Homepage MUST include a complaints section before quick links.
- **FR-027**: Homepage MUST include a suggestions section after affiliated entities.
- **FR-028**: "Stay Updated" newsletter section MUST be removed from homepage (kept in footer only).
- **FR-029**: User satisfaction indicator MUST be added above the AI chatbot icon on the homepage.

**Directorates & Structure:**
- **FR-030**: Clicking a directorate MUST navigate to that specific directorate's dedicated page.
- **FR-031**: Each directorate page MUST resemble the homepage layout with directorate-specific content.
- **FR-032**: Sub-directorate clicks MUST show sub-directorate-specific information.
- **FR-033**: "Directorates" page MUST be renamed to "Organizational Structure" with hierarchical display.
- **FR-034**: Contact information MUST be specific per directorate and sub-directorate.

**Translation:**
- **FR-035**: News article publish time and date MUST display in English when English is selected.
- **FR-036**: Newsletter subscription result messages MUST be translated to English.
- **FR-037**: Complaints general form MUST be fully translated to English.
- **FR-038**: Announcements page MUST be fully translated to English.

**Navigation & Loading:**
- **FR-039**: Breadcrumbs MUST appear on all inner pages.
- **FR-040**: Page transitions MUST show a branded loading indicator with eagle emblem.
- **FR-041**: Content loading MUST use skeleton loading placeholders.
- **FR-042**: A scroll-to-top arrow MUST be present on all pages.
- **FR-043**: Cards MUST show a gold-tinted shadow (box-shadow: 5px 5px 10px #b9a779) on hover.

**Media Center:**
- **FR-044**: All media types (video, photo, infographic) MUST load and display correctly.
- **FR-045**: Video playback MUST include working audio.
- **FR-046**: Media cards MUST include download and share buttons.

**Content & Filtering:**
- **FR-047**: Announcements, laws, and FAQ page filters MUST match the news page filter design.
- **FR-048**: Pagination MUST be applied on media center, announcements, and services pages.
- **FR-049**: Announcement card sizes MUST be uniform.
- **FR-050**: Duplicate filter buttons on announcements page MUST be removed.
- **FR-051**: AI summary button on single news page MUST function correctly.
- **FR-052**: Electronic services MUST have a filtering capability.

**Forms & Input:**
- **FR-053**: All form fields MUST show validation messages with visual indicators (green=valid, red=invalid).
- **FR-054**: Phone number fields MUST include country code selectors.
- **FR-055**: All phone numbers and emails on the portal MUST be clickable action links.

**Header & Footer:**
- **FR-056**: Header logo MUST be updated to the provided new logo file.
- **FR-057**: Header elements MUST be reordered per ministry specification.
- **FR-058**: Footer quick links MUST be replaced with social media links.
- **FR-059**: Footer gold line color MUST be changed to green.
- **FR-060**: Footer copyright MUST read "Ministry of Economy and Industry."
- **FR-061**: Footer tagline MUST be shortened to "The trusted source for information and services."

**Dark Mode:**
- **FR-062**: Contact page work hours card MUST match other card styles in dark mode.
- **FR-063**: All icons and text MUST maintain proper contrast in dark mode without overlapping.

**Chatbot & Search:**
- **FR-064**: Chatbot MUST be trained on portal content and answer portal-specific questions accurately.
- **FR-065**: Chatbot welcome message MUST use the correct ministry name and be concise.
- **FR-066**: Chatbot icon MUST be positioned on the left in the Arabic version with a tooltip that appears then auto-hides.
- **FR-067**: Search MUST offer autocomplete suggestions as users type.

**Profile & Settings:**
- **FR-068**: Password change MUST require entering the current password.
- **FR-069**: User's own complaints MUST be linked and displayed in their profile.
- **FR-070**: SMS complaint notification section MUST be removed from settings.

**Admin:**
- **FR-071**: Dashboard MUST include complaint/suggestion submission rule configuration.
- **FR-072**: Dashboard MUST allow enabling/disabling the investment section.
- **FR-073**: Dashboard MUST support announcement management.

**Map:**
- **FR-074**: Interactive map MUST support pinning directorates at specific geographic locations.

**Animations:**
- **FR-075**: Portal MUST feature scroll-triggered animations throughout (matching media center style).

**FAQ:**
- **FR-076**: Anonymous complaint FAQ answer MUST end with "ولن يطلع عليه أحد" clarifying identity privacy.

**Civil Registry:**
- **FR-077**: System MUST be designed to support future integration with the civil registry via external service.

### Key Entities

- **Favorite**: A saved content reference linking a user to a news item, announcement, service, or law. Attributes: user, content type, content ID, date saved.
- **Complaint**: A citizen-submitted grievance with tracking number, status lifecycle (Received → In Progress → Completed), rating scores, and link to the submitting user.
- **Suggestion**: A citizen-submitted proposal with tracking number, anonymous/known flag, and status tracking.
- **Directorate**: An organizational unit with its own page, contact info, sub-directorates, news, and services. Can be pinned on the map.
- **User Profile**: Extended to include favorites section, linked complaints, and updated password-change security.

### Assumptions

- The updated ministry logo file is available at the provided Google Drive link.
- FAQ content is managed via the admin dashboard (not hardcoded).
- Chatbot training will be done against current portal content at time of deployment.
- Civil registry integration is a future milestone; current work only prepares the architecture.
- The "investment section" toggle affects visibility of the entire investment page/section.
- Complaint/suggestion submission rules refer to configurable text (guidelines/terms), not complex business logic.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of portal pages render correctly on mobile devices (320px–428px width) with no visual breakage.
- **SC-002**: Authentication flow (login → 2FA → dashboard) completes successfully in under 30 seconds with zero navigation errors.
- **SC-003**: 100% of form fields across the portal display validation messages upon invalid input.
- **SC-004**: Complaint submission-to-tracking flow completes in under 2 minutes.
- **SC-005**: All content pages display complete English translations when English language is selected.
- **SC-006**: Video playback works with audio on 100% of uploaded videos.
- **SC-007**: Every directorate click navigates to the correct directorate-specific page (not a generic page) with 100% accuracy.
- **SC-008**: Breadcrumbs display on 100% of inner pages.
- **SC-009**: Users can add content to favorites and view all favorites in their profile.
- **SC-010**: Dark mode styling is consistent across all pages with no visual discrepancies.
- **SC-011**: Portal pages load with skeleton placeholders appearing within 200ms of navigation.
- **SC-012**: Search autocomplete suggestions appear as users type, within 500ms of keystroke.
