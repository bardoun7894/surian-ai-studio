# MOE Government Portal Constitution

## Core Principles

### I. Security-First (NON-NEGOTIABLE)

All development MUST prioritize security as the primary concern for this government portal.

- OWASP Top 10 compliance is MANDATORY for all code changes
- All sensitive data MUST be encrypted: TLS 1.2+ in transit, AES-256 at rest
- Passwords MUST use Argon2 hashing with salt (Laravel default)
- Session management MUST enforce single-session per user and 15-minute idle timeout
- Audit logging MUST capture all security-relevant events (logins, data changes, admin actions)
- Rate limiting MUST be applied to all public endpoints
- Generic error messages only; no stack traces or internal details exposed to users
- Admin panel access MUST be restricted to Syrian government IP ranges in production

**Rationale**: Government portals are high-value targets. Security failures have legal, political, and citizen trust implications.

### II. Arabic-First (NON-NEGOTIABLE)

The system MUST treat Arabic as the primary language, with English as secondary.

- All user-facing text MUST have Arabic translations before English
- RTL (Right-to-Left) layout MUST be the default
- Arabic content MUST be validated for proper display (font rendering, character support)
- Government brand identity (الهوية البصرية) MUST use Qomra Arabic font family
- Date formats, number formats, and currency MUST follow Arabic/Syrian conventions
- All AI interactions MUST support Arabic natural language processing

**Rationale**: This is a Syrian government portal serving Arabic-speaking citizens as the primary audience.

### III. Citizen Value First

Features MUST be prioritized by direct citizen impact.

- Complaint submission and tracking is the MVP - all other features are secondary
- User journeys MUST complete in under 5 minutes for primary tasks
- Accessibility (WCAG 2.1 AA) MUST be maintained for all citizen-facing features
- Error messages MUST be clear, actionable, and in the user's selected language
- Mobile-first design is MANDATORY; 70%+ of users expected on mobile devices

**Rationale**: The portal exists to serve citizens. Technical elegance is worthless if citizens cannot use the system.

### IV. Decoupled Architecture

Frontend and backend MUST remain independent and communicate via API contracts only.

- Frontend: React 18 + Vite (existing ~70% complete)
- Backend: Laravel 11 with PHP 8.2+
- AI Service: FastAPI (Python) - provider-agnostic
- No direct database access from frontend
- All communication via versioned REST APIs (api/v1/)
- Each service MUST be independently deployable (Kubernetes)

**Rationale**: Decoupled architecture enables independent scaling, deployment, and team parallelization. Required by SRS.

### V. Data Integrity

Government data MUST be treated as immutable historical record where applicable.

- Content MUST use soft-delete (archive) instead of hard-delete
- All content changes MUST create version history
- Audit logs MUST be append-only and tamper-resistant
- Complaints MUST NOT be editable after submission (except status changes by authorized staff)
- Database backups MUST be performed regularly with point-in-time recovery capability

**Rationale**: Government records have legal significance. Data loss or tampering has serious consequences.

### VI. Observability

All system behavior MUST be traceable and monitorable.

- Structured logging MUST be implemented for all services
- Request tracing MUST span frontend → backend → AI service
- Performance metrics MUST track response times (<200ms page load, <500ms chatbot)
- Resource monitoring MUST alert at 80% CPU/memory utilization
- All AI classifications MUST log confidence scores for model improvement

**Rationale**: Production issues in government systems require rapid diagnosis. Citizen complaints about service unavailability are politically sensitive.

### VII. Simplicity

Avoid over-engineering. Build what is needed, not what might be needed.

- Start with the simplest solution that meets requirements
- Abstractions MUST solve current problems, not hypothetical future ones
- Three similar lines of code are better than a premature abstraction
- External dependencies MUST be justified; prefer standard library where sufficient
- Configuration MUST have sensible defaults; require explicit opt-in for complexity

**Rationale**: Government projects have long maintenance cycles. Simple code is maintainable code.

## Technology Standards

### Required Stack (per SRS)

| Layer | Technology | Version | Status |
|-------|------------|---------|--------|
| Frontend | React + Vite | 18.x / 5.x | Implemented |
| Backend | Laravel | 11.x | Implemented |
| AI Service | FastAPI | Latest | Pending |
| Database | PostgreSQL | 15+ | Configured |
| Cache | Redis | 7+ | Configured |
| Server | Nginx | 1.24+ | Configured |
| Container | Docker/K8s | Latest | Pending |

### Performance Requirements

- Page load: <200ms (95th percentile)
- Chatbot response: <500ms
- API throughput: 500 RPS minimum
- Concurrent users: 2000 minimum
- Uptime: 99% monthly

### Hosting Constraint

All production infrastructure MUST be hosted within Syrian government data centers (NFR-25).

## Development Workflow

### Before Any Code Change

1. Verify change aligns with a task in tasks.md
2. Check Constitution compliance (this document)
3. Review existing code in affected areas

### Code Quality Gates

- All public API endpoints MUST have input validation
- All database queries MUST prevent SQL injection (use Eloquent/query builder)
- All user input displayed MUST prevent XSS (use Laravel's {{ }} escaping)
- All file uploads MUST validate type, size (5MB max), and count (5 max)
- All authentication routes MUST use rate limiting

### Testing Requirements

- Backend: PHPUnit for unit and feature tests
- Frontend: Vitest for component tests (when added)
- Integration: API endpoint testing required for all routes
- Security: OWASP ZAP scan before production deployment

### Commit Standards

- Commits MUST reference task IDs when applicable
- Commit messages MUST be in English
- Breaking changes MUST be documented in commit body

## Governance

### Authority

This Constitution supersedes all other development practices and guidelines for this project. When conflicts arise between this document and external standards, this Constitution takes precedence (except for legal/compliance requirements which always override).

### Amendments

1. Proposed changes MUST be documented with rationale
2. Changes affecting security (Principle I) require explicit security review
3. Changes affecting citizen features (Principle III) require stakeholder approval
4. All amendments MUST update the version number and Last Amended date

### Version Policy

- **MAJOR**: Principle removal, redefinition, or backward-incompatible governance changes
- **MINOR**: New principle added, section materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance

- All pull requests MUST verify compliance with Core Principles
- Constitution Check section in plan.md MUST reference applicable principles
- Non-compliant code MUST document justification in Complexity Tracking section

**Version**: 1.0.0 | **Ratified**: 2026-01-14 | **Last Amended**: 2026-01-14
