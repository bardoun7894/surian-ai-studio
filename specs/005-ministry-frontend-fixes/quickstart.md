# Quickstart: Ministry Portal Comprehensive Amendments

**Branch**: `005-ministry-frontend-fixes`

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development without Docker)
- Git access to the repository

## Development Setup

```bash
# 1. Switch to feature branch
git checkout 005-ministry-frontend-fixes

# 2. Start development environment (hot-reload)
docker-compose -f docker-compose.dev.yml up -d

# 3. Verify services are running
# Frontend: http://localhost:3002
# Backend:  http://localhost:8002
# AI:       http://localhost:8001
```

## Key Files to Modify

### Frontend (frontend-next/src/)

| File/Directory | What to Change |
|---------------|---------------|
| `app/page.tsx` | Homepage hero section, department cards, sections layout |
| `app/(auth)/login/page.tsx` | WhatsApp contact, sticky green section |
| `app/(auth)/two-factor/page.tsx` | Visibility change handling (already done) |
| `app/(protected)/profile/page.tsx` | Complaints removed, add favorites section |
| `app/settings/notifications/page.tsx` | SMS section removed (already done) |
| `app/contact/page.tsx` | Work hours dark mode (already done) |
| `app/suggestions/page.tsx` | Identity verification removed (already done) |
| `app/media/page.tsx` | Fix media loading, video audio |
| `app/news/[id]/page.tsx` | Fix AI summary button, date translation |
| `app/announcements/page.tsx` | Unified filter, duplicate removal |
| `app/faq/page.tsx` | Unified filter pattern |
| `app/directorates/[id]/page.tsx` | Homepage-like layout per directorate |
| `components/Navbar.tsx` | Updated logo, reordered elements |
| `components/Footer.tsx` | Social links, green line, copyright |
| `components/Breadcrumbs.tsx` | NEW - breadcrumb navigation |
| `components/ScrollToTop.tsx` | NEW - scroll-to-top button |
| `contexts/LanguageContext.tsx` | Add missing translation keys |
| `lib/repository.ts` | Add favorites API, autocomplete API |
| `types/index.ts` | Add Favorite type |

### Backend (backend/)

| File/Directory | What to Change |
|---------------|---------------|
| `database/migrations/` | Create favorites table, add directorate location columns |
| `app/Models/Favorite.php` | NEW - Favorite model |
| `app/Http/Controllers/FavoriteController.php` | NEW - CRUD for favorites |
| `app/Http/Controllers/SearchController.php` | Add autocomplete endpoint |
| `routes/api.php` | Register new routes |

## Testing

```bash
# Frontend lint check
docker-compose -f docker-compose.dev.yml exec frontend-next npm run lint

# Backend tests
docker-compose -f docker-compose.dev.yml exec backend php artisan test

# Manual testing checklist:
# - Switch to dark mode and check all pages
# - Switch to English and check all translations
# - Test on mobile viewport (320px, 375px, 428px)
# - Test login → 2FA → dashboard flow
# - Test complaint submission and tracking
# - Test media center video playback
```

## Implementation Priority

1. **P1 - Critical fixes** (Stories 1-3, 14): Auth flow, complaints system, profile cleanup
2. **P2 - Major features** (Stories 4-10): Favorites, homepage, directorates, translations, navigation, media, forms
3. **P3 - Polish** (Stories 11-18): Header/footer, dark mode, chatbot, animations, FAQ, map
