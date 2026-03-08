# /task — Delegate a Single Task to a Specialist Subagent

Spawns a specialist subagent for the task described in `$ARGUMENTS`.

## Usage

```
/task FE: Fix mobile nav collapse animation in Navbar.tsx
/task BE: Add rate-limiting middleware to /api/v1/chat endpoint
/task AI: Add Arabic text summarization route to FastAPI service
/task SEC: Audit complaint file upload endpoint for path traversal
/task QA: Write PHPUnit tests for ComplaintService
```

## Protocol

1. **Parse** the workstream prefix (FE/BE/AI/DO/QA/SEC/DOC/REV) from `$ARGUMENTS`.
2. **Query NotebookLM** for relevant context on the task area.
3. **Read** the relevant source files before delegating.
4. **Spawn** the appropriate subagent with the full Task Brief below.
5. **Report** the subagent output back to the user.

## Task Brief Template (sent to subagent)

```
Context: Surian AI Studio (Next.js 14 / Laravel 11 / FastAPI)
Branch: 005-ministry-frontend-fixes
Server: ssh MyContabo → /var/local/surian-ai-studio/
NotebookLM: b495a242-38b2-400c-9068-c2a322046278

Goal: $ARGUMENTS

Workstream ownership:
- FE → frontend-next/src/ only
- BE → backend/app/, backend/routes/ only
- AI → ai-service/app/ only
- DO → docker-compose*.yml, Dockerfile* only
- QA → test files
- SEC → audit only, no production changes without approval

Constraints:
- Dev mode: docker-compose.dev.yml (hot-reload, no rebuild for code changes)
- PHP 8.2+ / Laravel 11 / Next.js 14.2.35 / FastAPI conventions
- RTL Arabic layout must be preserved
- Sanctum auth & RBAC must not be broken
- No new packages without explicit user approval

Quality gates (must pass before done):
- Frontend: npm run lint && npx tsc --noEmit
- Backend: php artisan test
- Docker: hot-reload still works

Output format required:
1. Assumptions / Questions (blockers only)
2. Approach (bullets)
3. Steps (numbered)
4. Files changed (list)
5. Tests added/updated
6. Risks + mitigations
7. Done checklist
```

## Workstream → Agent Type Mapping

| Prefix | Agent Type       | Specialty                            |
| ------ | ---------------- | ------------------------------------ |
| FE     | general-purpose  | Next.js 14, React 18, Tailwind, GSAP |
| BE     | general-purpose  | Laravel 11, PHP 8.2, PostgreSQL      |
| AI     | general-purpose  | FastAPI, Python, Gemini              |
| DO     | general-purpose  | Docker Compose, Nginx                |
| QA     | test-writer      | PHPUnit, Jest, Cypress               |
| SEC    | security-auditor | OWASP, Sanctum, RBAC                 |
| DOC    | doc-writer       | Markdown, API docs                   |
| REV    | code-reviewer    | All stacks                           |

Task: **$ARGUMENTS**
