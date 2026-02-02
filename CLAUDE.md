# surian-ai-studio Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-26

## Active Technologies
- TypeScript 5.x (Next.js 14), PHP 8.2+ (Laravel 11) + Next.js 14 (App Router), React 18, Tailwind CSS 3.4.1, GSAP, Framer Motion, Laravel Sanctum, Filament 3.3 (002-frontend-fixes)
- PostgreSQL 15+ (existing), Redis 7+ (cache) (002-frontend-fixes)

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
- 002-frontend-fixes: Added TypeScript 5.x (Next.js 14), PHP 8.2+ (Laravel 11) + Next.js 14 (App Router), React 18, Tailwind CSS 3.4.1, GSAP, Framer Motion, Laravel Sanctum, Filament 3.3

- 001-moe-website: Added PHP 8.2+ (Laravel 11), TypeScript 5.x (Next.js 14) + Laravel Sanctum, Next.js App Router, Filament Admin, FastAPI AI Service

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
