# Security Gap Audit (Frontend + Laravel Backend)

Date: 2026-02-11

Scope reviewed:
- `frontend-next` (Next.js)
- `backend` (Laravel 11)

## Executive Summary

Multiple high-risk security gaps were identified across authentication/session handling, authorization boundaries, public PII exposure, webhook trust, and deployment defaults.

Top priorities:
1. Enforce strict admin RBAC on web + API mutation routes.
2. Eliminate public PII exposure from tracking/print endpoints.
3. Remove sensitive values from logs/responses and harden auth flows (2FA/login throttling, token storage).

## Findings

### Critical

1) Public PII exposure via print/track endpoints
- Complaint print/PDF endpoints accessible by tracking number only.
- Suggestion print endpoint accessible by tracking number only.
- Risk: enumeration and unauthorized disclosure of personal data.

2) Admin web authorization gap
- Admin Blade routes rely on `auth` without robust role/permission gating.
- Multiple admin controllers do not enforce policy checks.
- Risk: authenticated low-privilege user may access admin functions.

### High

3) Frontend auth token in browser-accessible storage
- Bearer token stored in `localStorage` and JS-readable cookie.
- Risk: token theft via XSS.

4) Sensitive logging (OTP/reset links/contact payloads)
- OTP and password reset links logged in clear text.
- Contact submissions logged with full payload (PII).

5) Missing/weak abuse controls on auth and public endpoints
- Missing throttles on `verify-2fa`, `forgot-password`, `reset-password`.
- CAPTCHA accepted but not enforced consistently for register/suggestions.

6) WhatsApp webhook authenticity not verified
- Telegram has secret header verification, WhatsApp path lacks equivalent signature verification.

7) Known default/unsafe credentials and exposed DB in compose
- Static DB credentials in compose and host-exposed `5432` in current config.

8) Default seeded privileged users with known password
- Seeder uses predictable default password for admin accounts.

9) Chat guest session hijack surface
- Guest session history/clear APIs can be abused if session ID leaks.

10) Guessable complaint tracking numbers + weak brute-force protections
- Tracking ID generation and public endpoint throttling posture increase enumeration risk.

### Medium

11) CORS/CSRF hardening gaps
- Broad CSRF exemptions and permissive origin patterns with credentials enabled.

12) Admin IP restriction fail-open behavior
- If enabled but no allowed IPs configured, middleware allows access.

13) Dynamic sort/order parameters not allowlisted
- User-controlled `orderBy` fields in multiple controllers.

14) Real client IP may be lost behind Next.js API proxy
- Security controls keyed by IP can degrade if proxy forwarding/trust is incomplete.

15) Internal error detail leakage in API responses
- Some endpoints return raw exception messages.

### Low

16) Reverse-tabnabbing risk in some Blade links
- `target="_blank"` without `rel="noopener noreferrer"` in several templates.

## Dependency Risk Snapshot

- Frontend (`npm audit`): multiple high advisories (including Next.js-related and transitive deps).
- Backend JS (`npm audit` in backend): high advisory on `axios`.
- Composer audit could not be executed in current shell because `composer` binary is unavailable.

## Tracked Remediation Tasks

### High Priority
- `s1` Block public complaint/suggestion print endpoints from exposing PII without identity verification.
- `s2` Replace frontend localStorage bearer token flow with HttpOnly cookie-based session auth.
- `s3` Remove OTP/reset-link logging and sanitize exception messages returned to clients.
- `s4` Add WhatsApp webhook signature validation and remove hardcoded webhook secret defaults.
- `s5` Add login + 2FA attempt throttling for admin web login and API 2FA verification.
- `s6` Restrict uploads to safe MIME/extensions and disable PHP execution in public upload paths.
- `s10` Enforce strict RBAC on admin web routes/controllers and API mutation route groups.
- `s11` Harden tracking identifiers and add brute-force protections on tracking/print endpoints.
- `s12` Secure chat session endpoints against unauthenticated session hijacking.
- `s14` Enforce CAPTCHA/abuse controls for register/suggestions/contact and auth recovery flows.
- `s15` Remove sensitive data from responses (`temp_password`, raw errors) and redact logs.
- `s16` Harden deployment defaults (credentials, token defaults, exposed DB).

### Medium Priority
- `s7` Harden CORS/CSRF config and make admin IP restriction fail-closed when enabled.
- `s8` Patch vulnerable dependencies and re-run audits.
- `s13` Preserve real client IP through proxy path or bypass proxy for sensitive endpoints.
- `s17` Add allowlists for dynamic sort/order params.

### Low Priority
- `s18` Add `rel="noopener noreferrer"` to Blade links using `target="_blank"`.

## Recommended Execution Order

1. Authorization + PII blockers: `s10`, `s1`, `s11`, `s12`
2. Auth/session and secret hygiene: `s2`, `s3`, `s5`, `s14`, `s15`
3. Infra/config hardening: `s7`, `s13`, `s16`
4. Ecosystem and cleanup: `s8`, `s17`, `s18`
