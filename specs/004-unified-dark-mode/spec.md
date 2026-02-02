# Feature Specification: Unified Dark Mode Color System

**Feature Branch**: `004-unified-dark-mode`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Dark mode 12 — تعديل ألوان: الأزرار والأيقونات أخضر غامق، العناوين الرئيسية ذهبي، العناوين الفرعية وبقية النصوص أبيض، البطاقات رمادي #b3a3d3. This should apply across the entire website — need to unify the CSS of dark mode, possibly in the main CSS. Check all pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Consistent Dark Mode Colors Across All Pages (Priority: P1)

A visitor enables dark mode via the navbar toggle. Every page on the website — home, news, directorates, complaints, FAQ, contact, services, announcements, profile, admin — displays with the same unified color palette:

| Element                          | Dark Mode Color                                  |
|----------------------------------|--------------------------------------------------|
| Buttons & icons                  | Dark green (#094239)                             |
| Main titles / headings           | Gold (#b9a779)                                   |
| Subtitles, body text, labels     | White (#ffffff)                                  |
| Card backgrounds                 | Gray (#b3a3d3 at appropriate dark-mode opacity)  |
| Page background                  | Dark (#1a1a1a or equivalent dark surface)        |
| Borders                          | Gold-tinted at low opacity                       |

No page should show pure black cards, bright green backgrounds, mismatched gray shades, or any other color that deviates from this palette.

**Why this priority**: This is the core deliverable — a single, authoritative dark mode palette applied site-wide. Without it, the website looks visually broken in dark mode.

**Independent Test**: Toggle dark mode on, navigate through every major section (home, news detail, directorates, complaints form, suggestion form, FAQ, contact, services, profile, admin dashboard). Verify each element category matches the palette above.

**Acceptance Scenarios**:

1. **Given** dark mode is enabled, **When** the user visits any page, **Then** all buttons and clickable icons render in dark green (#094239).
2. **Given** dark mode is enabled, **When** the user views any page, **Then** all primary headings (h1, h2, section titles) render in gold (#b9a779).
3. **Given** dark mode is enabled, **When** the user views any page, **Then** all subtitles, body text, form labels, and secondary text render in white (#ffffff).
4. **Given** dark mode is enabled, **When** the user views any page, **Then** all card containers render with the gray card color (#b3a3d3 with dark-appropriate opacity).
5. **Given** dark mode is enabled, **When** the user views any page, **Then** no element displays pure black (#000000) as a background, nor bright/neon green.

---

### User Story 2 — Centralized Dark Mode Definition (Priority: P1)

The dark mode color rules are defined in one central location (the main stylesheet / design tokens). Individual page components do not override these colors with hard-coded values. Changing a dark mode color in the central definition propagates across the entire site without touching individual components.

**Why this priority**: Without centralization, any future color change requires editing 93+ files. This is a maintenance and consistency prerequisite.

**Independent Test**: Change one dark mode variable in the central stylesheet and confirm the change appears on at least 5 different pages without modifying any other file.

**Acceptance Scenarios**:

1. **Given** the dark mode card background is defined centrally, **When** a developer changes it, **Then** all cards on all pages reflect the new value.
2. **Given** a component previously used a hard-coded dark background color, **When** the unification is complete, **Then** that component uses the central dark mode definition instead.

---

### User Story 3 — Dark Mode Toggle Preserves Visual Hierarchy (Priority: P2)

When a user toggles between light mode and dark mode, the visual hierarchy remains clear: main titles are more prominent than subtitles, subtitles are more prominent than body text, and interactive elements (buttons, links) are clearly distinguishable from static content.

**Why this priority**: Unifying colors is necessary but not sufficient — the result must preserve readability and visual hierarchy.

**Independent Test**: On the home page, toggle dark mode. Verify that headings, subtitles, body text, buttons, and cards are visually distinct from each other and the background.

**Acceptance Scenarios**:

1. **Given** dark mode is enabled, **When** the user views any page, **Then** gold headings are visually distinct from white body text.
2. **Given** dark mode is enabled, **When** the user views a card, **Then** the card background is clearly distinguishable from the page background.
3. **Given** dark mode is enabled, **When** the user views a button, **Then** the button is clearly distinguishable from surrounding card or page backgrounds.

---

### User Story 4 — Dark Mode in Special Components (Priority: P2)

Components with unique styling — ChatBot widget, services dropdown, complaint/suggestion forms, search results, newsletter signup — all follow the unified dark mode palette. No component has a "white background leak" or uses a color outside the defined palette.

**Why this priority**: These components were identified as having existing dark mode bugs (items 22, 23, 29, 47, 53 from the original 54-item list). They need explicit attention.

**Independent Test**: In dark mode, open the ChatBot, expand the services dropdown, visit the complaint form, visit the suggestion form, and check the Quick Links section. Each should use the unified palette.

**Acceptance Scenarios**:

1. **Given** dark mode is enabled, **When** the user opens the ChatBot, **Then** it displays with dark background, white text, and dark green buttons — no white background visible.
2. **Given** dark mode is enabled, **When** the user expands the services dropdown in the navbar, **Then** it uses the dark card background — no bright green or white background.
3. **Given** dark mode is enabled, **When** the user views the complaint or suggestion form, **Then** both forms use identical dark mode styling (same card background, input backgrounds, text colors, button colors).
4. **Given** dark mode is enabled, **When** the user views the Quick Links section, **Then** it has no opaque colored background — uses transparent or dark surface treatment.
5. **Given** dark mode is enabled, **When** the user views a "Read More" button, **Then** the button text or background is dark green, not invisible or same-color as its container.

---

### Edge Cases

- What happens when high-contrast mode is also enabled? High-contrast mode overrides dark mode styling as currently implemented — this feature does not change that behavior.
- What happens with user-uploaded images or embedded content (YouTube iframes) in dark mode? Media content is not color-shifted; only UI chrome follows the dark mode palette.
- What happens on pages with no cards (e.g., simple text content pages)? Page background and text colors still follow the palette; card rules only apply where cards exist.
- What happens during the dark/light mode transition animation? The transition must be smooth with no flash of unstyled or wrong-colored content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: In dark mode, all button backgrounds and icon colors MUST render as dark green (#094239).
- **FR-002**: In dark mode, all primary headings (h1, h2, section titles, card titles) MUST render in gold (#b9a779).
- **FR-003**: In dark mode, all subtitles, body text, form labels, input text, and secondary content MUST render in white (#ffffff).
- **FR-004**: In dark mode, all card container backgrounds MUST use the gray tone (#b3a3d3) at an opacity appropriate for dark surfaces.
- **FR-005**: In dark mode, the page background MUST be a dark surface (#1a1a1a or equivalent) — never pure black (#000000).
- **FR-006**: In dark mode, borders MUST use the gold-tinted border color at low opacity, consistent across all components.
- **FR-007**: The dark mode color palette MUST be defined in a single central location (main stylesheet / design token file). Individual components MUST NOT hard-code dark mode colors that override the central definition.
- **FR-008**: The ChatBot widget MUST NOT display a white or light background in dark mode.
- **FR-009**: The services dropdown in the navigation MUST NOT display a bright green or white background in dark mode.
- **FR-010**: The complaint form and suggestion form MUST use identical dark mode styling (same backgrounds, text colors, input styles, button colors).
- **FR-011**: The Quick Links section MUST NOT have an opaque colored background in dark mode.
- **FR-012**: "Read More" buttons MUST be clearly visible and use the dark green color in dark mode.
- **FR-013**: All inline/hard-coded dark mode colors across all component files MUST be replaced with references to the central dark mode palette.
- **FR-014**: The dark mode toggle transition MUST be smooth (no flash of wrong colors during switch).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of pages pass visual dark mode audit — no element uses a color outside the defined palette (dark green, gold, white, gray #b3a3d3, dark background #1a1a1a).
- **SC-002**: Zero instances of hard-coded dark mode color overrides remain in individual component files; all dark mode colors trace back to the central definition.
- **SC-003**: A single-variable change to the central dark mode card color propagates to all card components across the site without additional file edits.
- **SC-004**: The 6 previously-identified problem components (ChatBot, services dropdown, complaint form, suggestion form, Quick Links, "Read More" buttons) all pass individual dark mode visual inspection.
- **SC-005**: Users perceive consistent branding — in a side-by-side comparison of any 3 randomly selected pages in dark mode, the color palette is identical.

## Assumptions

- The site's dark mode is toggled by a class-based mechanism (`.dark` class on the root element), not by `prefers-color-scheme` media query.
- The existing color values are correct as specified: dark green = #094239, gold = #b9a779, card gray = #b3a3d3, dark background = #1a1a1a.
- High-contrast mode is a separate concern and is not modified by this feature.
- Print styles are not affected by dark mode changes.
- The admin dashboard pages follow the same dark mode palette as public-facing pages.
- The card color #b3a3d3 may need opacity adjustment in dark mode (e.g., 10-20% opacity on dark surfaces) to avoid being too bright — the exact opacity will be determined during implementation.

## Scope Boundaries

**In scope**:
- All public-facing pages (home, news, directorates, complaints, suggestions, FAQ, contact, services, announcements, search, profile, media, investments, decrees, privacy, terms, sitemap)
- All admin pages
- All shared components (Navbar, Footer, ChatBot, modals, dropdowns, forms)
- The central stylesheet and design token definitions

**Out of scope**:
- Light mode color changes (light mode palette is not modified)
- High-contrast mode changes
- New dark mode features (e.g., auto-detection from OS preference)
- Color changes to third-party embedded content (YouTube, maps)
- Backend/API changes
