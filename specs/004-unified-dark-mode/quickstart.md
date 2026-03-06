# Quickstart: 004-unified-dark-mode

**Branch**: `004-unified-dark-mode`

## Prerequisites

- Docker and Docker Compose installed
- Git with access to the repository
- Branch `004-unified-dark-mode` checked out

## Setup

```bash
# 1. Start development environment (hot-reload)
docker-compose -f docker-compose.dev.yml up -d

# 2. Verify services are running
# Frontend: http://localhost:3002
# Backend:  http://localhost:8002
```

## Development Workflow

All changes are CSS/Tailwind only. Hot-reload applies instantly.

```bash
# View frontend logs
docker-compose -f docker-compose.dev.yml logs -f frontend-next
```

## Key File Locations

| What | Where |
|------|-------|
| Central dark mode CSS variables | `frontend-next/src/app/globals.css` (`.dark` block) |
| Tailwind color config | `frontend-next/tailwind.config.ts` |
| Theme toggle | `frontend-next/src/contexts/ThemeContext.tsx` |
| Components (93 files) | `frontend-next/src/components/*.tsx` |
| Pages | `frontend-next/src/app/**/*.tsx` |

## Testing Checklist (Manual)

### 1. Central Definition Verification
1. In `globals.css`, temporarily change `--dm-background` to a bright color (e.g., red)
2. Toggle dark mode on the home page
3. Verify the background changes across multiple pages
4. Revert the change

### 2. Full Page Audit — Dark Mode
Toggle dark mode, then visit each page and verify:

| Page | URL | Check |
|------|-----|-------|
| Home | `/` | Cards gray, titles gold, text white, buttons green |
| News | `/news` | Same palette, article cards consistent |
| Directorates | `/directorates` | Cards, subtitles, links consistent |
| Complaints | `/contact` | Form inputs, buttons, labels follow palette |
| Suggestions | `/suggestions/track` | Same form styling as complaints |
| FAQ | `/faq` | Cards, filter buttons consistent |
| Services | `/services` | No bright green dropdown, cards consistent |
| Profile | `/profile` | Cards, text consistent |
| Contact | `/contact` | No map, address text white |
| Search | `/search` | Results cards, clear filters button visible |
| Announcements | `/announcements` | Cards, share/print buttons consistent |
| Admin | `/admin` | Dashboard follows same palette |

### 3. Problem Components
1. **ChatBot**: Click chat icon → verify dark bg, white text, green buttons
2. **Services dropdown**: Hover/click Services in navbar → verify dark dropdown bg
3. **Quick Links**: Scroll to Quick Links section → verify no opaque colored bg
4. **"Read More" buttons**: On any article card → verify visible dark green button
5. **Complaint form**: Visit complaints → verify form inputs, buttons match palette
6. **Suggestion form**: Visit suggestions → verify identical to complaint form

### 4. Transition Quality
1. Toggle dark mode on/off repeatedly
2. Verify smooth transition (no flash of wrong colors)
3. Verify no FOUC (flash of unstyled content)

### 5. Regression Checks
1. Toggle to **light mode** — verify nothing changed
2. Enable **high-contrast mode** — verify it still overrides dark mode
3. Check **mobile viewport** (375px width) — verify no layout breaks
4. Check **RTL layout** — verify no direction-dependent color issues

## Grep Audit Commands

```bash
# Find remaining hardcoded dark backgrounds (should be zero after completion)
grep -rn "dark:bg-black\b" frontend-next/src/
grep -rn "dark:bg-\[#" frontend-next/src/
grep -rn "dark:bg-gray-[789]" frontend-next/src/

# Find remaining hardcoded dark borders (should be zero)
grep -rn "dark:border-gray-[67]" frontend-next/src/

# Count total dark mode classes (for progress tracking)
grep -rn "dark:" frontend-next/src/ | wc -l
```

## Rebuild (Only If Needed)

```bash
# Only after adding npm packages or changing Docker/Tailwind config
docker-compose -f docker-compose.dev.yml build --no-cache frontend-next
docker-compose -f docker-compose.dev.yml up -d
```
