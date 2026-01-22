# Implementation Plan: Ministry of Economy & Industry Website

**Branch**: `main` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: SRS Document (مسودة ال SRS النسخة 3.docx.md)

## Summary

Government portal for Syrian Ministry of Economy & Industry with citizen complaint system, AI-powered chatbot, content management, and admin dashboard. Frontend (React/Vite) is substantially complete; backend (Laravel 11 + PostgreSQL) needs full implementation.

## Technical Context

**Language/Version**: PHP 8.2+ (Laravel 11), TypeScript (React 18), Python 3.11+ (FastAPI)
**Primary Dependencies**: Laravel 11, React 18, Vite, Tailwind CSS, GSAP, FastAPI, SQLAlchemy
**Storage**: PostgreSQL 15+, Redis 7+ (caching/sessions)
**Testing**: PHPUnit, Vitest, Pytest
**Target Platform**: Kubernetes (HPA enabled) on Linux
**Project Type**: Microservice Architecture (React Frontend, Laravel Backend, Python AI Service)
**Performance Goals**: <200ms page load, <500ms chatbot response, 2000 concurrent users
**Constraints**: Syrian hosting only, OWASP Top 10 compliance, AES-256 encryption
**Scale/Scope**: 2000 concurrent users, bilingual (AR/EN), scalable microservices

## Current Implementation Analysis

### Frontend (React/Vite) - ~70% Complete

| Component | Status | Notes |
|-----------|--------|-------|
| App.tsx | Done | Routing, theme, language context |
| Navbar.tsx | Done | Navigation, search, theme toggle |
| HeroSection.tsx | Done | Homepage hero with pillars |
| HeroGrid.tsx | Done | Article grid layout |
| NewsSection.tsx | Done | News display (mock data) |
| NewsTicker.tsx | Done | Breaking news ticker |
| ComplaintPortal.tsx | Done | Form UI + AI analysis (no backend) |
| ChatBot.tsx | Done | Gemini integration (local storage only) |
| AdminDashboard.tsx | Partial | UI scaffold, mock data |
| LoginPage.tsx | Done | UI only, no auth |
| RegisterPage.tsx | Done | UI only, no auth |
| DirectoratesList.tsx | Done | Static data |
| DirectorateDetail.tsx | Done | Static data |
| DecreesArchive.tsx | Done | Static mock data |
| ServicesGuide.tsx | Done | Static categorized |
| Footer.tsx | Done | Accessibility controls |
| SearchResultsPage.tsx | Partial | Basic text match |
| UserDashboard.tsx | Partial | Placeholder |
| StatsAchievements.tsx | Done | Static stats |
| MediaCenter.tsx | Done | Static media |
| FAQSection.tsx | Done | Static FAQ |
| Announcements.tsx | Done | Static announcements |

### Backend - 0% Complete (Laravel)

No Laravel backend exists. Needs initialization.

### AI Microservice - 0% Complete (FastAPI)

No Python service exists. Needs initialization.

### Services Layer (Frontend)

| Service | Status |
|---------|--------|
| geminiService.ts | Done - AI integration for chat + analysis |
| repository.ts | Partial - Mock API, needs real endpoints |
| LanguageContext.tsx | Done - Bilingual support |

## Gap Analysis Summary

### Critical Missing (Must Have for MVP)

1. **Backend API** - No server-side code
2. **Database** - No data persistence
3. **Authentication** - No user login/registration
4. **Complaint Storage** - Submissions not saved
5. **Tracking System** - No real tracking numbers
6. **Audit Trail** - No logging
7. **AI Microservice** - No dedicated AI service

### High Priority Missing

1. **CMS Backend** - Content not manageable
2. **Role-Based Access** - No authorization
3. **Email Notifications** - No notification system
4. **Rate Limiting** - No spam protection
5. **Kubernetes Deployment** - No production infrastructure configs

### Medium Priority Missing

1. **Semantic Search** - Only text match
2. **AI Summarization** - Frontend only
3. **Conversation Persistence** - Local storage only
4. **Reports/Analytics** - Not implemented

### Low Priority Missing

1. **WhatsApp/Telegram** - External integrations
2. **Human Handoff** - Chatbot escalation
3. **PDF Generation** - Print feature

## Project Structure

### Documentation (this feature)

```text
.specify/specs/moe-website/
├── plan.md              # This file
├── spec.md              # Feature specification with requirements
├── tasks.md             # Implementation tasks by phase
└── research.md          # (To be created if needed)
```

### Source Code (repository root)

```text
# Current Structure (Frontend only)
/
├── components/          # React components (33 files)
├── contexts/            # React contexts
├── services/            # API services (mock)
├── constants.ts         # Static data
├── types.ts             # TypeScript types
├── App.tsx              # Main app component
├── index.html           # Entry point
├── package.json         # Frontend dependencies
└── vite.config.ts       # Vite configuration

# Proposed Addition (Backend)
/backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ComplaintController.php
│   │   │   ├── ContentController.php
│   │   │   └── UserController.php
│   │   └── Middleware/
│   │       ├── DirectorateScope.php
│   │       └── AuditLogger.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Complaint.php
│   │   ├── Content.php
│   │   └── AuditLog.php
│   └── Services/
│       ├── ComplaintService.php
│       ├── AIService.php
│       └── NotificationService.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── tests/
├── .env.example
└── docker-compose.yml

# Deployment
/k8s/
├── frontend/ (deployment, service, hpa)
├── backend/ (deployment, service, hpa)
├── ai-service/ (deployment, service, hpa)
├── database/ (statfulset, pvc)
└── ingress.yaml

# AI Service
/ai-service/
├── app/
│   ├── main.py
│   ├── routers/
│   └── services/ (Gemini, OCR)
├── requirements.txt
└── Dockerfile
```

**Structure Decision**: Microservice architecture with React Frontend, Laravel Backend, and independent Python AI Service. Kubernetes for orchestration and scaling.

## Constitution Check

*Reference: [constitution.md](../../memory/constitution.md) v1.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Security-First | PARTIAL | Auth implemented, audit logging pending |
| II. Arabic-First | PASS | RTL, bilingual support implemented |
| III. Citizen Value First | PASS | Complaint flow prioritized as MVP |
| IV. Decoupled Architecture | PASS | Frontend/Backend/AI service separated |
| V. Data Integrity | PENDING | Soft-delete, versioning not yet implemented |
| VI. Observability | PENDING | Structured logging not yet implemented |
| VII. Simplicity | PASS | Following incremental approach |

### SRS Compliance Gates

| Requirement | Status | Action |
|-------------|--------|--------|
| Laravel 11 Backend | NOT MET | Create backend/ with Laravel |
| PostgreSQL 15+ | NOT MET | Add to docker-compose |
| Redis 7+ | NOT MET | Add to docker-compose/k8s |
| FastAPI Service | NOT MET | Create ai-service/ |
| Kubernetes | NOT MET | Create k8s/ configs |
| HTTPS Only | NOT MET | Configure in deployment |
| Syrian Hosting | N/A | Deployment concern |
| AES-256 Encryption | NOT MET | Implement in backend |
| Argon2 Passwords | NOT MET | Default in Laravel |
| 99% Uptime | N/A | Operations concern |
| <200ms Response | PARTIAL | Frontend fast, no backend |

## Phase Summary

| Phase | Description | Tasks | Critical |
|-------|-------------|-------|----------|
| 1 | Backend Foundation | T001-T024 | YES |
| 2 | Authentication | T025-T043 | YES |
| 3 | AI Microservice | T-AI-01-15 | YES |
| 4 | Brand Identity | T-BRAND-01-10 | YES |
| 5 | Animation | T-ANIM-01-09 | YES |
| 6 | Kubernetes | T-K8S-01-19 | HIGH |
| 7 | Complaint System | T044-T085 | YES |
| 8 | Content Management | T096-T111 | HIGH |
| 9 | Chatbot Enhancement | T112-T121 | MEDIUM |
| 10 | Security & Search | T122-T145 | YES |

## MVP Definition

Minimum Viable Product includes:
- **Phase 1**: Backend foundation with database
- **Phase 2**: User authentication with 2FA
- **Phase 3**: Citizen complaint submission with tracking number
- **Phase 4**: Complaint status tracking
- **Phase 10 (partial)**: Basic security hardening

This delivers core citizen value: submit and track complaints.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Laravel unfamiliarity | Schedule | Allocate learning time |
| AI API costs | Budget | Implement usage limits |
| Syrian hosting requirements | Deployment | Early infrastructure planning |
| Email gateway availability | Notifications | Queue + retry + logging |
| Large file uploads | Performance | Client-side validation + chunking |
| 2000 concurrent users | Scale | Load testing early |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-14 | Keep React/Vite frontend | Already implemented, functional |
| 2026-01-14 | Add Laravel backend | Per SRS requirement |
| 2026-01-14 | Use Docker for development | Consistency across environments |
| 2026-01-14 | PostgreSQL with pgvector | Semantic search requirement |
| 2026-01-14 | Phase 1-4 as MVP | Delivers core citizen value |

## Phase 16: Customer UI Modifications V2 (Added: 2026-01-21)

**Customer Request Date**: 2026-01-20
**Scope**: Backend implementation ONLY - No frontend changes without approval
**Tasks**: [tasks.md Phase 16](./tasks.md#phase-16-customer-ui-modifications-v2-request-date-2026-01-20)

### New Features Overview

#### 1. Featured Directorates Section
**Business Need**: Showcase 3 main directorates with sub-departments
**Backend Tasks**:
- Sub-directorates data model and relationships
- Featured directorates flag (exactly 3)
- API endpoints for featured directorates + sub-directorates
- Admin panel management (Filament)

**Data Model**:
```
Directorate (existing)
├── id, name_ar, name_en, description
├── featured (new) - boolean
└── hasMany SubDirectorate

SubDirectorate (new table)
├── id, parent_directorate_id
├── name_ar, name_en
├── url (internal page or external website)
├── external_link (boolean)
└── order, is_active
```

**API Endpoints**:
- `GET /api/v1/directorates/featured` - Returns 3 featured directorates with sub-directorates
- `GET /api/v1/directorates/{id}/sub-directorates` - Returns all sub-directorates

#### 2. Suggestions Portal (مقترحات للعالم)
**Business Need**: Citizens submit project/ministry suggestions with file attachments
**Backend Tasks**:
- Suggestions entity with job title, description
- Multi-file upload support (max 5 files, 10MB each)
- Status workflow (pending → reviewed → approved/rejected)
- Rate limiting (3 suggestions per day)
- Email notifications to admins
- Admin review panel (Filament)

**Data Model**:
```
Suggestion
├── id, name, job_title, description
├── status (pending, reviewed, approved, rejected)
├── user_id (nullable - allows guest submissions)
├── created_at, updated_at, deleted_at

SuggestionAttachment
├── id, suggestion_id
├── file_path, file_name, file_type, file_size
└── uploaded_at
```

**API Endpoints**:
- `POST /api/v1/suggestions` - Submit new suggestion
- `GET /api/v1/suggestions` - List suggestions (admin only)
- `PATCH /api/v1/suggestions/{id}/status` - Update status (admin only)
- `DELETE /api/v1/suggestions/{id}` - Soft delete (admin only)

**Security**:
- File type validation (pdf, doc, docx, jpg, png only)
- Virus scanning integration point (future)
- Rate limiting per IP/user
- Input sanitization for text fields

#### 3. Previous Complaint Reference
**Business Need**: Link new complaints to previous submissions for context
**Backend Tasks**:
- Add `related_complaint_id` foreign key to complaints table
- Validation logic to verify tracking number exists
- Privacy check: Previous complaint must belong to same user (if authenticated)

**API Changes**:
- Update `POST /api/v1/complaints` - Add optional `previous_tracking_number` parameter
- Response includes related complaint details

#### 4. Announcements Grid Configuration
**Business Need**: Display 9 announcements (3x3 grid) instead of 5
**Backend Tasks**:
- Update announcements API pagination (default limit: 9)
- System settings for configurable display count
- Ensure seeder creates sufficient announcements data

### Technical Architecture Updates

```
┌─────────────────────────────────────────────────────────┐
│                    PHASE 16 ADDITIONS                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  NEW ENTITIES                                            │
│  ├── SubDirectorate (child of Directorate)              │
│  ├── Suggestion (standalone portal)                     │
│  └── SuggestionAttachment (file storage)                │
│                                                          │
│  ENHANCED ENTITIES                                       │
│  ├── Directorate.featured (boolean flag)                │
│  └── Complaint.related_complaint_id (self-referencing)  │
│                                                          │
│  NEW API ENDPOINTS: 9 endpoints                          │
│  NEW FILAMENT RESOURCES: 2 resources                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Implementation Strategy

**Phase 16 Approach**:
1. ✅ **Backend First**: Implement all data models, APIs, and business logic
2. ⏸️ **Frontend Deferred**: NO UI changes until customer approves mockups
3. 📋 **Testing**: Unit and feature tests for all backend logic
4. 📖 **Documentation**: API docs for new endpoints
5. 🎨 **Design Review**: Separate process for UI/UX approval

**Why Backend-Only**:
- Customer wants to review designs before implementation
- Backend provides stable API for frontend to consume later
- Allows parallel design work while backend is being built
- Reduces rework if design changes

### Frontend Tasks (DEFERRED)

The following UI tasks are explicitly **NOT INCLUDED** in Phase 16 and require separate approval:

| UI Component | Customer Requirement | Status |
|--------------|---------------------|--------|
| Directorate Cards Section | 3 cards with eagle logo, sub-directorate dropdown | ⏸️ Pending design approval |
| Animated Hero Background | Moving/gradient background | ⏸️ Pending design approval |
| AI Assistant Button | Enlarged with "مرحبا بك" text + AI icon | ⏸️ Pending design approval |
| Announcements 3x3 Grid | 9 cards in grid layout | ⏸️ Pending design approval |
| Header Suggestions Button | "مقترحات للعالم" navigation button | ⏸️ Pending design approval |
| Suggestions Form | Name, job, description, file uploads | ⏸️ Pending design approval |
| Previous Complaint Field | Checkbox + tracking number input | ⏸️ Pending design approval |
| Duplicate Section Removal | Identify & remove repeated sections | ⏸️ Needs customer specification |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Design changes after backend built | Rework | Use flexible API design, avoid tight coupling |
| File upload abuse (suggestions) | Performance/Storage | Rate limiting, file size limits, validation |
| Eagle logo asset unavailable | Visual inconsistency | Provide fallback SVG, request from customer |
| Sub-directorate data incomplete | Poor UX | Work with customer to populate all 12 directorates |
| Previous complaint validation complexity | Development delay | Start with simple lookup, iterate |

### Success Criteria (Backend Only)

- [ ] All 9 new API endpoints functional and documented
- [ ] 56 backend tasks completed with passing tests
- [ ] Filament admin panels for suggestions and sub-directorates operational
- [ ] Database migrations run successfully without data loss
- [ ] API endpoints return data in expected format (verified via Postman/tests)
- [ ] Rate limiting prevents suggestion spam
- [ ] File uploads stored securely with proper validation

### Dependencies

**Before Starting Phase 16**:
- ✅ Phase 1: Backend Foundation (Complete)
- ✅ Phase 2: Authentication (Complete)
- ✅ Phase 3: AI Microservice (Complete)
- ✅ Database schema & seeders (Complete)

**External Dependencies**:
- Eagle logo asset (request from customer)
- Sub-directorate data for all 12 directorates (customer to provide)
- Suggestions portal content/copy (Arabic & English)

### Estimated Effort

| Category | Tasks | Estimated Days |
|----------|-------|----------------|
| Database & Models | 10 | 2 days |
| API Development | 9 | 3 days |
| Business Logic & Services | 8 | 2 days |
| Filament Admin Resources | 5 | 1 day |
| Validation & Security | 7 | 2 days |
| Testing | 7 | 2 days |
| Documentation | 3 | 1 day |
| Data & Configuration | 7 | 1 day |
| **Total** | **56** | **~14 days** |

**Note**: Frontend implementation (when approved) estimated at additional 10-12 days.

### Decision Log Updates

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-21 | Backend-only for Phase 16 | Customer wants design approval before frontend work |
| 2026-01-21 | Suggestions portal as new entity | Separate from complaints to avoid confusion |
| 2026-01-21 | Self-referencing complaints | Simpler than complaint threads/chains |
| 2026-01-21 | Featured flag on directorates | Flexible - allows changing featured set without code changes |
| 2026-01-21 | 5 file limit for suggestions | Balance between usability and storage costs |

## Next Steps

1. ✅ Review this plan (Phase 16 additions)
2. ✅ Review tasks.md Phase 16 (56 tasks)
3. ✅ Customer approval for backend scope
4. 🔄 Execute Phase 16 Backend tasks (if approved)
5. ⏸️ Parallel: Customer provides design mockups for frontend
6. ⏸️ Frontend implementation (after design approval)
7. 🔄 Review and iterate
