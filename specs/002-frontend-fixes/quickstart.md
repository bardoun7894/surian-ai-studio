# Quickstart: Frontend UI Fixes and Improvements

**Feature**: 002-frontend-fixes
**Date**: 2026-01-29

## Prerequisites

- Docker and Docker Compose installed
- Git checkout on branch `002-frontend-fixes`
- Access to the project repository

## Development Setup

```bash
# 1. Switch to feature branch
git checkout 002-frontend-fixes

# 2. Start development environment (hot-reload mode)
docker-compose -f docker-compose.dev.yml up -d

# 3. Verify services are running
# Frontend (Next.js): http://localhost:3002
# Backend (Laravel/Nginx): http://localhost:8002
# AI Service (FastAPI): http://localhost:8001
```

## Key Files to Edit

### Priority 1 (P1) — Start Here

| Task | File | Change |
|------|------|--------|
| 1-8 | `frontend-next/src/app/(auth)/register/page.tsx` | Add maxLength, validation, remove 2FA toggle, fix messages |
| 7,30 | `frontend-next/src/contexts/LanguageContext.tsx` | Add Arabic error message translation keys |
| 12-14 | `frontend-next/src/components/ComplaintPortal.tsx` | Add template dropdown, conditional fields, remove elements |
| 16 | `frontend-next/src/app/news/[id]/page.tsx` + `ArticleDetail.tsx` | Fix article detail page error |
| 17 | `frontend-next/src/components/NewsSection.tsx` | Update news section titles |
| 18 | `frontend-next/src/app/page.tsx` | Fix "Read More" to link to article detail |

### Priority 2 (P2) — After P1

| Task | File | Change |
|------|------|--------|
| 25 | `frontend-next/src/contexts/ThemeContext.tsx` | Change dark bg to #000000 |
| 6,25 | `frontend-next/src/app/globals.css` | Update dark mode CSS variables |
| 9 | `frontend-next/src/app/(auth)/two-factor/page.tsx` | Create 2FA page (new file) |
| 31-32 | `frontend-next/src/app/page.tsx` | Remove stats and e-services sections |
| 38-40 | `frontend-next/src/contexts/LanguageContext.tsx` | Add English translations |
| 43 | `frontend-next/src/app/(protected)/profile/page.tsx` | Add email edit feature |
| 46 | `frontend-next/src/components/Announcements.tsx` | Rename section |
| 19 | Homepage announcements | Fix "View More" button navigation |

### Priority 3 (P3) — Final Polish

| Task | File | Change |
|------|------|--------|
| 15 | `frontend-next/src/components/Navbar.tsx` | Fix dropdown hover delay |
| 20 | `frontend-next/src/app/services/page.tsx` | Remove filter |
| 21-23 | `frontend-next/src/components/FAQSection.tsx` | Update/remove FAQ items |
| 24 | `frontend-next/src/app/directorates/page.tsx` | Match wireframe |
| 26-29 | `frontend-next/src/components/Footer.tsx` | Remove admin login, fix year, fix buttons |
| 33-34 | `frontend-next/src/app/terms/page.tsx` | Remove sections |
| 35 | `frontend-next/src/app/privacy-policy/page.tsx` | Update date |
| 36-37 | `frontend-next/src/app/search/page.tsx` | Fix dark mode, add loading indicator |
| 41-42 | Complaints + Profile pages | Rename labels |
| 44 | `frontend-next/src/app/contact/page.tsx` | Update address |
| 45 | `frontend-next/src/components/ChatBot.tsx` | Enlarge button, fix popup position |
| 47 | Login + Register pages | Replace logo asset |

## Verification

After making changes, verify in the browser:

1. **Registration page** (http://localhost:3002/register): Test all 8 validation items
2. **Complaint page** (http://localhost:3002/complaints): Test template flow
3. **News page** (http://localhost:3002/news): Click articles, verify detail pages
4. **Homepage** (http://localhost:3002): Verify removed sections, renamed labels
5. **Dark mode**: Toggle and verify black background, contrast on all pages
6. **Arabic mode**: Switch language and verify all error messages are in Arabic
7. **Footer**: Verify removed admin login, copyright year, accessibility buttons
8. **Profile** (http://localhost:3002/profile): Test email edit (requires login)

## Cache Clearing (if needed)

```bash
docker-compose -f docker-compose.dev.yml exec backend php artisan cache:clear
docker-compose -f docker-compose.dev.yml exec backend php artisan config:clear
docker-compose -f docker-compose.dev.yml exec backend php artisan route:clear
```
