# Homepage Gap Analysis (SRS v2.0 + LastUpdates)

## Sources Reviewed
- SRS v2.0: [`LastUpdates/SRS_v2.0_ar.md`](LastUpdates/SRS_v2.0_ar.md)
- Public website sitemap: [`LastUpdates/مخطط الموقع نصي (2).docx`](LastUpdates/مخطط الموقع نصي (2).docx)
- Stakeholder feedback: [`LastUpdates/whatsapMessage.md`](LastUpdates/whatsapMessage.md)

---

## Current Homepage Implementation (Frontend)
Based on [`HomePage()`](frontend-next/src/app/page.tsx:20), the current homepage composes these sections:

1. Header/Nav: [`Navbar()`](frontend-next/src/components/Navbar.tsx:17)
2. Hero: [`HeroSection()`](frontend-next/src/components/HeroSection.tsx:14)
3. Breaking news ticker: [`NewsTicker()`](frontend-next/src/components/NewsTicker.tsx:15)
4. Directorates (3 cards): [`FeaturedDirectorates()`](frontend-next/src/components/FeaturedDirectorates.tsx:7)
5. Featured content grid: [`HeroGrid()`](frontend-next/src/components/HeroGrid.tsx:206)
6. News by directorate: [`NewsSection()`](frontend-next/src/components/NewsSection.tsx:14)
7. Announcements grid: [`Announcements()`](frontend-next/src/components/Announcements.tsx:152)
8. Quick services: [`QuickServices()`](frontend-next/src/components/QuickServices.tsx:27)
9. Stats/Achievements: [`StatsAchievements()`](frontend-next/src/components/StatsAchievements.tsx:25)
10. Government partners: [`GovernmentPartners()`](frontend-next/src/components/GovernmentPartners.tsx)
11. FAQ: [`FAQSection()`](frontend-next/src/components/FAQSection.tsx)
12. Contact: [`ContactSection()`](frontend-next/src/components/ContactSection.tsx)
13. Chatbot: [`ChatBot()`](frontend-next/src/components/ChatBot.tsx)
14. Footer: [`Footer()`](frontend-next/src/components/Footer.tsx:16)

---

## Expected Homepage (From Sitemap + SRS)
From the sitemap document, the homepage must include:
- Header: logo + smart search + quick links + login/profile + notifications (if logged in) + language toggle + dark mode
- Hero section
- Breaking news bar
- Latest central directorate news
- Directorates section (3 directorates)
- Main content sections:
  - Latest 3 central directorate news
  - Latest 3 news per subordinate directorate
- Smart assistant
- Quick links section for: laws/decrees, news, announcements, services, complaints/suggestions, FAQ, contact, about
- Footer: official links, privacy policy, terms

From SRS v2.0:
- FR-13: news ticker + news for 3 directorates on homepage
- FR-17/FR-18: unified smart search with filters (type, entity, date)
- UI requirements: header with logo, smart search, language toggle, dark mode

---

## Gap Matrix (Homepage vs SRS + Sitemap)

| Requirement | Source | Current Implementation | Gap | Recommendation |
|---|---|---|---|---|
| Header includes logo, smart search, login/profile, notifications, language toggle, dark mode | Sitemap + UI requirements | [`Navbar()`](frontend-next/src/components/Navbar.tsx:17) has logo, search input, login/profile, notifications, language + dark mode toggle | Missing “quick links” header block; search UI issues (no clear button, icon overlap) | Add a quick-links header block and improve search UX (clear button, alignment) |
| Breaking news bar | Sitemap + FR-13 | [`NewsTicker()`](frontend-next/src/components/NewsTicker.tsx:15) | Stakeholder: “urgent news section not suitable” | Redesign ticker styling and behavior per feedback |
| Latest central directorate news (single latest item) | Sitemap | Not explicit on homepage | Missing | Add a featured “latest central news” card/section |
| Latest 3 central directorate news | Sitemap | [`NewsSection()`](frontend-next/src/components/NewsSection.tsx:14) shows grouped news by directorate | No explicit “central directorate” grouping or 3-item limit | Add a central directorate block with a 3-item limit |
| Latest 3 news per subordinate directorate | Sitemap + FR-13 | [`NewsSection()`](frontend-next/src/components/NewsSection.tsx:14) maps all items per directorate | Limit not enforced | Limit each directorate group to 3 items |
| Directorates section shows 3 directorates | Sitemap | [`FeaturedDirectorates()`](frontend-next/src/components/FeaturedDirectorates.tsx:7) | OK (shows 3) | Keep; ensure labeling matches sitemap |
| Quick links section (laws, news, announcements, services, complaints/suggestions, FAQ, contact, about) | Sitemap | Not present as a dedicated section | Missing | Add a home-page quick links section or anchor block |
| Smart assistant on homepage | Sitemap | [`ChatBot()`](frontend-next/src/components/ChatBot.tsx) | Present | Keep |
| Unified smart search with filters | FR-17/FR-18 | Search input in [`Navbar()`](frontend-next/src/components/Navbar.tsx:17) and search page | Missing semantic + filter UI | Add advanced filters on search page; ensure header search routes to unified search |
| Footer with official links + privacy policy + terms | Sitemap | [`Footer()`](frontend-next/src/components/Footer.tsx:16) has quick links but no explicit privacy/terms in visible list | Partial | Add explicit privacy + terms links |

---

## Additional Gaps from Stakeholder Feedback
- Floating notifications for success/error (ex: suggestions submission) — not consistently visible
- File upload progress indicator — missing
- Video hover playback — reportedly not working
- Dark mode — reported as not working reliably
- Navigation: clicking announcement section should jump to homepage section, not open new page
- Search input UI (icon overlap, missing X button)
- Login page and complaints page issues (non-home but required by docs)

References:
- Feedback list: [`LastUpdates/whatsapMessage.md`](LastUpdates/whatsapMessage.md)

---

## Extras Not in SRS + Sitemap (Potential Removals)
Based on the “no additions” request in stakeholder feedback, these appear non-specified:
- [`StatsAchievements()`](frontend-next/src/components/StatsAchievements.tsx:25)
- [`GovernmentPartners()`](frontend-next/src/components/GovernmentPartners.tsx)
- “AI summary” and promotional blocks in [`HeroGrid()`](frontend-next/src/components/HeroGrid.tsx:206) — not described in sitemap

Recommendation: confirm whether to remove or move these to other pages to align with SRS + sitemap.

---

## Key Alignment Actions (Draft)
1. Add a dedicated homepage quick links block matching the sitemap list.
2. Add “latest central directorate news” and enforce 3-item limits for directorates.
3. Redesign the breaking news bar to match stakeholder expectations.
4. Improve header search UX (clear button, alignment) and implement search filters per FR-17/FR-18.
5. Add explicit privacy policy + terms links in footer.
6. Remove or relocate non-specified homepage sections (StatsAchievements, GovernmentPartners, HeroGrid promos) pending approval.

---

## Notes
- Newsletter subscription already exists in footer via [`NewsletterSignup()`](frontend-next/src/components/NewsletterSignup.tsx:13); stakeholder may want a dedicated homepage section.
- Directorates currently navigate to detail pages in [`DirectorateCard()`](frontend-next/src/components/DirectorateCard.tsx:23), which aligns with feedback for separate pages.

---

**Status:** Draft gap analysis prepared for review and approval.
