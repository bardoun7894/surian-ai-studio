# Quickstart: 003-ui-amendments

**Branch**: `003-ui-amendments`

## Prerequisites

- Docker and Docker Compose installed
- Git with access to the repository
- Branch `003-ui-amendments` checked out

## Setup

```bash
# 1. Start development environment (hot-reload)
docker-compose -f docker-compose.dev.yml up -d

# 2. Verify services are running
# Frontend: http://localhost:3002
# Backend:  http://localhost:8002
# AI:       http://localhost:8001
```

## Development Workflow

All changes use hot-reload. No rebuild needed for code changes.

```bash
# View frontend logs
docker-compose -f docker-compose.dev.yml logs -f frontend-next

# Clear backend cache (if needed after route changes)
docker-compose -f docker-compose.dev.yml exec backend php artisan cache:clear
docker-compose -f docker-compose.dev.yml exec backend php artisan config:clear
docker-compose -f docker-compose.dev.yml exec backend php artisan route:clear
```

## Key File Locations

| What | Where |
|------|-------|
| Dark mode CSS | `frontend-next/src/app/globals.css` |
| Theme toggle | `frontend-next/src/contexts/ThemeContext.tsx` |
| Translations | `frontend-next/src/contexts/LanguageContext.tsx` |
| Auth state | `frontend-next/src/contexts/AuthContext.tsx` |
| API layer | `frontend-next/src/lib/repository.ts` |
| Tailwind config | `frontend-next/tailwind.config.ts` |
| Backend routes | `backend/routes/api.php` |

## Testing Checklist (Manual)

### Dark Mode (Items 12, 22, 23, 29, 47, 53)
1. Toggle dark mode via navbar moon/sun icon
2. Check: buttons/icons = dark green, titles = gold, text = white, cards = gray
3. Navigate to: ChatBot, Quick Links, Services dropdown, complaint form, suggestion form
4. Verify no white or bright green backgrounds leak through

### Auth Flow (Items 8-11)
1. Go to `/login`, submit credentials
2. Verify loading spinner appears
3. Switch browser tab during loading, return - verify loading stops
4. If 2FA enabled: verify 2FA page stays stable, verify back button blocked after passing

### Complaints (Items 38-46)
1. Submit a complaint - verify confirmation message
2. Copy tracking number - verify "Copied" toast appears
3. Submit a rating - verify it succeeds
4. Check RTL: rating arrow should point left

### Localization (Items 18, 24, 31, 34, 37, 40, 48)
1. Switch to English (navbar language toggle)
2. Check: directorate subtitles, newsletter confirmation, announcement text, form labels
3. Switch back to Arabic - verify all text reverts

### Removals (Items 3, 4, 7, 41, 42, 52, 54)
1. Profile page: no "Track Complaint", "Latest Complaints", "SMS Notifications" sections
2. Complaint form: no directorate selection, no identity verification
3. Services page: no electronic services list, no "Submit Request" button
4. Contact page: no interactive map

## Rebuild (Only If Needed)

```bash
# Only after adding npm/composer packages or changing Docker config
docker-compose -f docker-compose.dev.yml build --no-cache frontend-next
docker-compose -f docker-compose.dev.yml up -d
```
