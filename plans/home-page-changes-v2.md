
# Home Page Changes Plan - Ministry of Economy & Industry Portal

## Executive Summary

This document outlines the comprehensive changes needed for the frontend home page based on SRS v2.0 requirements and stakeholder feedback from WhatsApp messages.

---

## Current Home Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar (with search bar)                                  │
├─────────────────────────────────────────────────────────────┤
│ HeroSection (Ministry logo + CTA buttons)                 │
├─────────────────────────────────────────────────────────────┤
│ NewsTicker (Breaking news ticker)                          │
├─────────────────────────────────────────────────────────────┤
│ FeaturedDirectorates (3 directorates with modals)           │
├─────────────────────────────────────────────────────────────┤
│ HeroGrid (Main article + grid articles + promos)          │
├─────────────────────────────────────────────────────────────┤
│ NewsSection (News by directorate)                          │
├─────────────────────────────────────────────────────────────┤
│ Announcements (3x3 grid)                                  │
├─────────────────────────────────────────────────────────────┤
│ QuickServices (6 service cards)                            │
├─────────────────────────────────────────────────────────────┤
│ StatsAchievements                                         │
├─────────────────────────────────────────────────────────────┤
│ GovernmentPartners                                       │
├─────────────────────────────────────────────────────────────┤
│ FAQSection                                               │
├─────────────────────────────────────────────────────────────┤
│ ContactSection                                           │
├─────────────────────────────────────────────────────────────┤
│ ChatBot + HappinessIndicator                              │
└─────────────────────────────────────────────────────────────┘
│ Footer                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Issues Identified (From WhatsApp Feedback)

### Critical Issues
1. **Notifications not floating** - Users don't see success messages unless they scroll up
2. **File upload indicator missing** - No visual feedback during file uploads
3. **Complaints page not working**
4. **Video hover not working** - Videos should play on hover
5. **Section naming issues** - Inconsistent or unclear naming
6. **Navigation issues** - Clicking sections should scroll to home page sections, not open separate pages
7. **Administration section opens in separate page** - Should stay on home page
8. **Dark mode not working properly**
9. **Login page not working**
10. **Urgent news section not suitable** - Design or placement issues
11. **Search button not suitable** - UI/UX issues with search functionality
12. **Search field UI issues** - Icon and text appear misaligned, missing X button to clear

### Feature Requests
13. **Add email subscription field** - For latest news notifications

---

## SRS v2.0 Requirements Analysis

### Relevant Requirements for Home Page

| Requirement | Description | Current Status |
|-------------|-------------|----------------|
| **FR-13** | News ticker for latest news + news from 3 departments on home page | ✅ Implemented (NewsTicker + NewsSection) |
| **FR-17** | Unified smart search: text + semantic (all content: laws, news, services) | ⚠️ Partial (search exists but may need improvement) |
| **FR-18** | Unified search with filtering by type, entity, and date | ❌ Not implemented |
| **FR-62** | Control general settings (language, dark mode, enable/disable channels) | ⚠️ Partial (language toggle exists, dark mode needs fixing) |
| **NFR-18** | Support Arabic/English, dark mode, responsive design | ⚠️ Dark mode needs fixes |
| **NFR-20** | Mobile-First Design | ✅ Implemented |

---

## Proposed Home Page Changes

### Phase 1: Critical Fixes (High Priority)

#### 1. Fix Notifications System
**Issue:** Notifications are not floating, users miss success messages

**Solution:**
- Implement a toast notification system with fixed positioning
- Show notifications at top-right or top-center of screen
- Auto-dismiss after 5 seconds
- Add manual dismiss button
- Support different notification types (success, error, warning, info)

**Files to modify:**
- Create: `frontend-next/src/components/ToastNotifications.tsx`
- Modify: `frontend-next/src/contexts/NotificationContext.tsx`
- Modify: `frontend-next/src/app/layout.tsx` (to add toast container)

---

#### 2. Add File Upload Indicators
**Issue:** No visual feedback during file uploads

**Solution:**
- Add progress bar for file uploads
- Show upload percentage
- Display file name and size
- Add cancel button
- Show success/error state

**Files to modify:**
- Modify: `frontend-next/src/components/UploadProgress.tsx` (already exists, needs enhancement)
- Modify: All forms with file uploads (Complaints, Suggestions)

---

#### 3. Fix Video Hover Playback
**Issue:** Videos don't play on hover

**Solution:**
- Add `autoPlayOnHover` prop to VideoCard component
- Implement mouse enter/leave event handlers
- Pause video when mouse leaves
- Add visual indicator (play icon overlay)

**Files to modify:**
- Modify: `frontend-next/src/components/VideoCard.tsx`
- Modify: `frontend-next/src/components/HeroGrid.tsx` (to enable autoPlayOnHover)

---

#### 4. Improve Search Functionality
**Issue:** Search button not suitable, missing X button, UI alignment issues

**Solution:**
- Add clear button (X) to search input
- Improve search input styling and alignment
- Add search suggestions/autocomplete
- Implement advanced search with filters (FR-17, FR-18)
- Add loading state during search

**Files to modify:**
- Modify: `frontend-next/src/components/Navbar.tsx`
- Create: `frontend-next/src/components/SearchSuggestions.tsx`
- Modify: `frontend-next/src/app/search/page.tsx`

---

#### 5. Fix Dark Mode
**Issue:** Dark mode not working properly

**Solution:**
- Ensure all components support dark mode classes
- Fix color scheme inconsistencies
- Test dark mode across all pages
- Add smooth transitions between light/dark modes

**Files to modify:**
- Review and fix: All component files for dark mode support
- Modify: `frontend-next/src/contexts/ThemeContext.tsx`
- Modify: `frontend-next/src/app/globals.css`

---

### Phase 2: Structural Changes (Medium Priority)

#### 6. Restructure Home Page Sections

**Current Issues:**
- Too many sections creating clutter
- Information hierarchy unclear
- Some sections redundant or not aligned with SRS

**Proposed New Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar (with improved search)                             │
├─────────────────────────────────────────────────────────────┤
│ HeroSection (Simplified, focused on key CTAs)              │
├─────────────────────────────────────────────────────────────┤
│ NewsTicker (Breaking news - keep as is)                    │
├─────────────────────────────────────────────────────────────┤
│ FeaturedDirectorates (Keep, but simplify modals)           │
├─────────────────────────────────────────────────────────────┤
│ HeroGrid (Main article + 2 side articles + 2 promos)     │
├─────────────────────────────────────────────────────────────┤
│ NewsSection (News from 3 departments - FR-13)             │
├─────────────────────────────────────────────────────────────┤
│ QuickServices (6 key services - keep)                     │
├─────────────────────────────────────────────────────────────┤
│ Announcements (Reduce to 6 items, 2x3 grid)             │
├─────────────────────────────────────────────────────────────┤
│ NewsletterSignup (NEW - email subscription)                │
├─────────────────────────────────────────────────────────────┤
│ FAQSection (Keep, but move to bottom)                     │
├─────────────────────────────────────────────────────────────┤
│ ContactSection (Keep)                                     │
├─────────────────────────────────────────────────────────────┤
│ ChatBot + HappinessIndicator                              │
└─────────────────────────────────────────────────────────────┘
│ Footer                                                  │
└─────────────────────────────────────────────────────────────┘
```

**Sections to REMOVE:**
- `StatsAchievements` - Move to footer or remove (redundant with HeroSection stats)
- `GovernmentPartners` - Move to footer or separate page

**Sections to MODIFY:**
- `HeroSection` - Simplify, focus on 3 main CTAs
- `HeroGrid` - Reduce promotional sections from variable to fixed 2
- `Announcements` - Reduce from 9 to 6 items
- `NewsSection` - Ensure exactly 3 departments shown (FR-13)

---

#### 7. Fix Navigation and Section Linking
**Issue:** Clicking sections opens separate pages instead of scrolling to sections

**Solution:**
- Update navigation links to use anchor links for home page sections
- Add smooth scroll behavior
- Ensure sections have proper IDs
- Update FeaturedDirectorates modals to not navigate away

**Files to modify:**
- Modify: `frontend-next/src/components/Navbar.tsx`
- Modify: `frontend-next/src/components/FeaturedDirectorates.tsx`
- Modify: `frontend-next/src/app/page.tsx` (add section IDs)

---

#### 8. Add Newsletter Signup Section
**Issue:** No email subscription for latest news (feature request)

**Solution:**
- Create newsletter signup form
- Add to home page after Announcements section
- Integrate with backend API
- Show success message on subscription

**Files to modify:**
- Create: `frontend-next/src/components/NewsletterSignup.tsx`
- Modify: `frontend-next/src/app/page.tsx`
- Backend: Ensure API endpoint exists (`API.newsletter.subscribe()`)

---

### Phase 3: UI/UX Improvements (Lower Priority)

#### 9. Improve Section Naming and Labels
**Issue:** Inconsistent or unclear naming

**Solution:**
- Review all section titles and labels
- Ensure clarity and consistency
- Use Arabic terminology from SRS
- Add icons for better visual hierarchy

**Files to modify:**
- Modify: All component files with text content
- Modify: `frontend-next/src/lib/constants.ts` (if needed)

---

#### 10. Optimize Hero Section
**Issue:** Hero section may be too complex

**Solution:**
- Simplify animations
- Focus on 3 main CTAs (Services, Decrees, Proposals)
- Reduce visual clutter
- Ensure mobile responsiveness

**Files to modify:**
- Modify: `frontend-next/src/components/HeroSection.tsx`

---

#### 11. Improve NewsTicker Design
**Issue:** Urgent news section not suitable

**Solution:**
- Redesign ticker to be less intrusive
- Add pause on hover (already implemented)
- Improve readability
- Add visual indicator for breaking news

**Files to modify:**
- Modify: `frontend-next/src/components/NewsTicker.tsx`

---

#### 12. Fix Complaints and Login Pages
**Issue:** These pages don't work

**Solution:**
- Debug and fix complaints page functionality
- Fix login page authentication flow
- Ensure proper error handling
- Test thoroughly

**Files to modify:**
- Modify: `frontend-next/src/app/complaints/page.tsx`
- Modify: `frontend-next/src/app/(auth)/login/page.tsx`
- Backend: Check API endpoints and authentication

---

## Detailed Implementation Plan

### Task Breakdown

#### Phase 1: Critical Fixes (Week 1)

| # | Task | Priority | Files | Estimated Effort |
|---|------|----------|-------|-----------------|
| 1.1 | Create toast notification system | HIGH | New: `ToastNotifications.tsx` | Medium |
| 1.2 | Update NotificationContext | HIGH | `NotificationContext.tsx` | Medium |
| 1.3 | Add toast container to layout | HIGH | `layout.tsx` | Low |
| 1.4 | Enhance UploadProgress component | HIGH | `UploadProgress.tsx` | Medium |
| 1.5 | Add upload progress to Complaints form | HIGH | `ComplaintPortal.tsx` | Medium |
| 1.6 | Add upload progress to Suggestions form | HIGH | `SuggestionsForm.tsx` | Medium |
| 1.7 | Fix VideoCard hover playback | HIGH | `VideoCard.tsx` | Medium |
| 1.8 | Enable autoPlayOnHover in HeroGrid | HIGH | `HeroGrid.tsx` | Low |
| 1.9 | Add X button to search input | HIGH | `Navbar.tsx` | Low |
| 1.10 | Improve search input styling | HIGH | `Navbar.tsx` | Medium |
| 1.11 | Fix dark mode in all components | HIGH | Multiple files | High |
| 1.12 | Test dark mode across all pages | HIGH | All pages | Medium |

#### Phase 2: Structural Changes (Week 2)

| # | Task | Priority | Files | Estimated Effort |
|---|------|----------|-------|-----------------|
| 2.1 | Simplify HeroSection | MEDIUM | `HeroSection.tsx` | Medium |
| 2.2 | Reduce HeroGrid promos to 2 | MEDIUM | `HeroGrid.tsx` | Low |
| 2.3 | Reduce Announcements to 6 items | MEDIUM | `Announcements.tsx` | Low |
| 2.4 | Remove StatsAchievements | MEDIUM | `page.tsx` | Low |
| 2.5 | Remove GovernmentPartners | MEDIUM | `page.tsx` | Low |
| 2.6 | Move FAQSection to bottom | MEDIUM | `page.tsx` | Low |
| 2.7 | Add NewsletterSignup component | MEDIUM | New: `NewsletterSignup.tsx` | Medium |
| 2.8 | Add NewsletterSignup to home page | MEDIUM | `page.tsx` | Low |
| 2.9 | Update navbar links to anchors | MEDIUM | `Navbar.tsx` | Medium |
| 2.10 | Add section IDs to page | MEDIUM | `page.tsx` | Low |
| 2.11 | Fix FeaturedDirectorates navigation | MEDIUM | `FeaturedDirectorates.tsx` | Medium |

#### Phase 3: UI/UX Improvements (Week 3)

| # | Task | Priority | Files | Estimated Effort |
|---|------|----------|-------|-----------------|
| 3.1 | Review and update section names | LOW | Multiple files | Medium |
| 3.2 | Improve NewsTicker design | LOW | `NewsTicker.tsx` | Medium |
| 3.3 | Fix complaints page | HIGH | `complaints/page.tsx` | High |
| 3.4 | Fix login page | HIGH | `login/page.tsx` | High |
| 3.5 | Add search suggestions | LOW | New: `SearchSuggestions.tsx` | High |
| 3.6 | Implement advanced search filters | LOW | `search/page.tsx` | High |
| 3.7 | Test all changes | HIGH | All files | High |
| 3.8 | Document changes | MEDIUM | `home-page-changes-v2.md` | Medium |

---

## Component Changes Summary

### Components to Create
1. `ToastNotifications.tsx` - Floating notification system
2. `NewsletterSignup.tsx` - Email subscription form
3. `SearchSuggestions.tsx` - Search autocomplete

### Components to Modify
1. `Navbar.tsx` - Search improvements, dark mode fixes
2. `HeroSection.tsx` - Simplification
3. `HeroGrid.tsx` - Reduce promos, enable video autoplay
4. `NewsTicker.tsx` - Design improvements
5. `NewsSection.tsx` - Ensure 3 departments
6. `Announcements.tsx` - Reduce to 6 items
7. `FeaturedDirectorates.tsx` - Fix navigation
8. `VideoCard.tsx` - Add hover playback
9. `UploadProgress.tsx` - Enhance
10. `ComplaintPortal.tsx` - Add upload progress
11. `SuggestionsForm.tsx` - Add upload progress
12. `page.tsx` - Restructure sections
13. `NotificationContext.tsx` - Toast support
14. `ThemeContext.tsx` - Dark mode fixes
15. `globals.css` - Dark mode styles

### Components to Remove from Home Page
1. `StatsAchievements.tsx` - Remove from home (move to footer if needed)
2. `GovernmentPartners.tsx` - Remove from home (move to footer if needed)

---

## Testing Checklist

### Functional Testing
- [ ] Toast notifications appear and dismiss correctly
- [ ] File upload progress shows correctly
- [ ] Videos play on hover and pause on leave
- [ ] Search input has X button to clear
- [ ] Search suggestions appear when typing
- [ ] Dark mode toggles correctly across all pages
- [ ] Navigation links scroll to correct sections
- [ ] Newsletter signup submits successfully
- [ ] Complaints page loads and works
- [ ] Login page authenticates correctly

### UI/UX Testing
- [ ] All sections properly aligned
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Dark mode colors are readable and consistent
- [ ] Animations are smooth and not distracting
- [ ] Section names are clear and consistent
- [ ] Loading states show correctly
- [ ] Error messages are user-friendly

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] Images load efficiently
- [ ] Videos load and play smoothly
- [ ] Search responds quickly

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Dark mode breaks existing styles | High | Medium | Test thoroughly, use CSS variables |
| Navigation changes break links | Medium | Low | Update all links, test thoroughly |
| Newsletter signup API not ready | Medium | Low | Create mock implementation, integrate later |
| Video autoplay affects performance | Low | Medium | Add option to disable, test performance |
| Too many changes at once | High | High | Implement in phases, test each phase |

---

## Success Criteria

The home page changes will be considered successful when:

1. ✅ All critical issues from WhatsApp feedback are resolved
2. ✅ Home page structure aligns with SRS v2.0 requirements
3. ✅ Dark mode works consistently across all pages
4. ✅ Notifications are floating and visible
5. ✅ File uploads show progress indicators
6. ✅ Videos play on hover
7. ✅ Search functionality is improved with filters
8. ✅ Navigation uses smooth scrolling to sections
9. ✅ Newsletter signup is functional
10. ✅ Page load time is under 3 seconds
11. ✅ Design is responsive on all devices
12. ✅ User testing shows improved satisfaction

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize tasks** based on urgency
3. **Schedule implementation** in phases
4. **Begin Phase 1** (Critical Fixes)
5. **Test thoroughly** after each phase
6. **Gather feedback** and iterate
7. **Deploy to production** when all tests pass

---

**Document Version:** 1.0
**Last Updated:** 2026-01-26
**Status:** Draft - Pending Review
