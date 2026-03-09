# surian-ai-studio Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-26

## Active Technologies
- TypeScript 5.x (Next.js 14), PHP 8.2+ (Laravel 11) + Next.js 14 (App Router), React 18, Tailwind CSS 3.4.1, GSAP, Framer Motion, Laravel Sanctum, Filament 3.3 (002-frontend-fixes)
- PostgreSQL 15+ (existing), Redis 7+ (cache) (002-frontend-fixes)
- TypeScript 5.x (Next.js 14.2.35), PHP 8.2+ (Laravel 11) + React 18, Tailwind CSS 3.4.1, GSAP 3.14.2, Framer Motion 11.18.2, Lucide React, Sonner, Laravel Sanctum (003-ui-amendments)
- TypeScript 5.x (Next.js 14 App Router), React 18 + Tailwind CSS 3.4.1, Next.js 14, Framer Motion, GSAP (004-unified-dark-mode)
- N/A (frontend-only changes) (004-unified-dark-mode)
- TypeScript 5.x (Next.js 14.2.35 App Router), PHP 8.2+ (Laravel 11) + React 18, Tailwind CSS 3.4.1, GSAP 3.14.2, Framer Motion 11.18.2, Lucide React 0.562, Sonner 2.0.7, react-simple-maps 3.0, Sharp 0.34.5 (005-ministry-frontend-fixes)

- PHP 8.2+ (Laravel 11), TypeScript 5.x (Next.js 14) + Laravel Sanctum, Next.js App Router, Filament Admin, FastAPI AI Service (001-moe-website)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

PHP 8.2+ (Laravel 11), TypeScript 5.x (Next.js 14): Follow standard conventions

## Recent Changes
- 005-ministry-frontend-fixes: Added TypeScript 5.x (Next.js 14.2.35 App Router), PHP 8.2+ (Laravel 11) + React 18, Tailwind CSS 3.4.1, GSAP 3.14.2, Framer Motion 11.18.2, Lucide React 0.562, Sonner 2.0.7, react-simple-maps 3.0, Sharp 0.34.5
- 004-unified-dark-mode: Added TypeScript 5.x (Next.js 14 App Router), React 18 + Tailwind CSS 3.4.1, Next.js 14, Framer Motion, GSAP
- 003-ui-amendments: Added TypeScript 5.x (Next.js 14.2.35), PHP 8.2+ (Laravel 11) + React 18, Tailwind CSS 3.4.1, GSAP 3.14.2, Framer Motion 11.18.2, Lucide React, Sonner, Laravel Sanctum


<!-- MANUAL ADDITIONS START -->

## Docker Development Rules

**IMPORTANT: Always use hot-reload mode during development.**

### Quick commands (Rules Always Run)
```bash
# Development (hot-reload) - USE THIS
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f frontend-next

# Clear Laravel cache if needed
docker-compose -f docker-compose.dev.yml exec backend php artisan cache:clear # after any changes
```

### Production Mode (Requires Rebuild)
```bash
# Only use for production deployment or testing production builds
docker-compose up -d

# Rebuild after changes
docker-compose build --no-cache frontend-next backend
docker-compose down && docker-compose up -d
```

### Service Ports
| Service | Port | Description |
|---------|------|-------------|
| Frontend (Next.js) | 3002 | Web UI |
| Backend (Laravel/Nginx) | 8002 | API |
| AI Service (FastAPI) | 8001 | AI endpoints |
| PostgreSQL | 5432 | Database |

### Hot Reload Behavior
- **Frontend (Next.js)**: Changes to `frontend-next/src/` reflect instantly
- **Backend (Laravel)**: Changes to `backend/app/`, `backend/routes/` reflect instantly
- **No rebuild needed** for code changes in development mode

### When to Rebuild
Only rebuild Docker when:
- Adding new npm/composer packages
- Changing Dockerfile
- Changing docker-compose configuration
- Deploying to production

### Clear Backend Cache (if needed)
```bash
docker-compose -f docker-compose.dev.yml exec backend php artisan cache:clear
docker-compose -f docker-compose.dev.yml exec backend php artisan config:clear
docker-compose -f docker-compose.dev.yml exec backend php artisan route:clear
```

<!-- MANUAL ADDITIONS END -->

## NotebookLM - Source of Truth

**IMPORTANT: Always consult NotebookLM as the single source of truth before making architectural decisions, implementing features, or resolving ambiguities.**

- **Notebook ID**: `b495a242-38b2-400c-9068-c2a322046278`
- **Docs Source ID**: `0a77799e-6dfb-45aa-9932-1bcdb7593c23` (combined code docs & specs)

### When to query NotebookLM:
- Before starting any new feature or significant change
- When unsure about project architecture, API contracts, or design decisions
- To verify specs, plans, and requirements
- To check security guidelines and integration patterns

### How to use:
```
# Query the notebook for context
mcp__notebooklm-mcp__notebook_query(notebook_id="b495a242-38b2-400c-9068-c2a322046278", query="your question")

# Query specific docs source only
mcp__notebooklm-mcp__notebook_query(notebook_id="b495a242-38b2-400c-9068-c2a322046278", query="your question", source_ids=["0a77799e-6dfb-45aa-9932-1bcdb7593c23"])
```
