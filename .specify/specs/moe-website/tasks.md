# Tasks: Ministry of Economy & Industry Website

**Input**: SRS Document (مسودة ال SRS النسخة 3.docx.md)
**Sequence Diagrams**: `مشروع الحكومة/sequance/` (4 diagrams)
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)
**Last Updated**: 2026-01-17 (Phase 15 SRS Gap Analysis - Major Progress)

---

## Architecture (Updated: Next.js 14 Migration)

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE / K8S                          │
├─────────────────────────────────────────────────────────────────┤
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐     │
│   │   Frontend    │   │    Backend    │   │  AI Service   │     │
│   │   Next.js 14  │   │  Laravel 11   │   │   FastAPI     │     │
│   │  App Router   │   │   Sanctum     │   │   Python      │     │
│   │   SSR/SSG     │   │   REST API    │   │   Async       │     │
│   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘     │
│           │                   │                   │              │
│           └───────────────────┼───────────────────┘              │
│                               │                                  │
│                    ┌──────────▼──────────┐                       │
│                    │ PostgreSQL + Redis  │                       │
│                    └─────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

| Component | Technology | Status |
|-----------|------------|--------|
| **Frontend** | Next.js 14 (App Router) | **MIGRATION REQUIRED** |
| **Backend** | Laravel 11 + Sanctum | ✅ Keep (API Only) |
| **AI Service** | FastAPI (Python) | ✅ Keep |
| **Admin Dashboard** | Laravel Filament 3 | ✅ COMPLETE (Native) |
| **Database** | PostgreSQL 15+ | ✅ Configured |
| **Cache** | Redis 7+ | ✅ Configured |

---

## Key Decisions (Updated 2026-01-14)

| Decision | Rationale |
|----------|-----------|
| **React/Vite → Next.js 14** | SSR, SEO, code splitting, better performance |
| **Laravel 11 Sanctum** | Secure API auth with CSRF + session cookies |
| **Admin = Filament** | Native Laravel dashboard (CRUD, Auth, Audit built-in) |
| **Keep FastAPI** | Async AI operations, provider-agnostic |
| **NO OTP/CAPTCHA** | User request - simplified auth flow |

---

## Skipped Tasks (Per User Request: NO OTP/CAPTCHA)

- ~~T029 2FA with OTP via email~~ → **SKIPPED**
- ~~T048 OTP verification service for complaints~~ → **SKIPPED**
- ~~T053 POST /api/v1/complaints/otp/send~~ → **SKIPPED**
- ~~T054 POST /api/v1/complaints/otp/verify~~ → **SKIPPED**
- ~~T059 reCAPTCHA v3 configuration~~ → **SKIPPED**
- ~~T060 CAPTCHA verification to complaint submission~~ → **SKIPPED**
- ~~T062 OTP input step to complaint form~~ → **SKIPPED**
- ~~T063 reCAPTCHA component to form~~ → **SKIPPED**
- ~~T155 Audio CAPTCHA for accessibility~~ → **SKIPPED**

---

## Phase 0: Next.js 14 Migration (NEW - PRIORITY)

### Project Setup
- [x] T-NX-01 Initialize Next.js 14 project with App Router (`npx create-next-app@14`) <!-- id: 1001-NX -->
- [x] T-NX-02 Configure TypeScript & path aliases (tsconfig.json) <!-- id: 1002-NX -->
- [x] T-NX-03 Setup Tailwind CSS with existing gov colors <!-- id: 1003-NX -->
- [x] T-NX-04 Configure environment variables (`NEXT_PUBLIC_*` prefix) <!-- id: 1004-NX -->
- [x] T-NX-05 Setup next.config.js (images, rewrites to Laravel API) <!-- id: 1005-NX -->

### Authentication (Laravel Sanctum + Next.js)
- [x] T-NX-06 Install next-auth or custom auth with Sanctum <!-- id: 1006-NX -->
- [ ] T-NX-07 Create `/api/auth/csrf` route (fetch sanctum/csrf-cookie)
- [x] T-NX-08 Create auth context/provider with session management <!-- id: 1008-NX -->
- [x] T043-A: UI: Profile Settings Page (FR-02) <!-- id: 1043-A -->
- [x] T043-B: UI: Forgot Password & Reset Password Pages (FR-03) <!-- id: 1043-B -->
- [x] T-NX-09 Implement login page with CSRF flow <!-- id: 1009-NX -->
- [x] T-NX-10 Implement register page <!-- id: 1010-NX -->
- [ ] T-NX-11 Create middleware for protected routes
- [ ] T-NX-12 Handle session timeout (15 min idle)

### Migrate Components (React → Next.js)
- [x] T-NX-13 Create app/layout.tsx (root layout with providers) <!-- id: 1013-NX -->
- [x] T-NX-14 Create app/(public)/page.tsx (homepage) <!-- id: 1014-NX -->
- [x] T-NX-15 Migrate Navbar.tsx → components/Navbar.tsx
- [x] T-NX-16 Migrate Footer.tsx → components/Footer.tsx
- [x] T-NX-17 Migrate HeroSection.tsx → components/HeroSection.tsx
- [x] T-NX-18 Migrate HeroGrid.tsx → components/HeroGrid.tsx
- [x] T-NX-19 Migrate NewsSection.tsx → components/NewsSection.tsx
- [x] T-NX-20 Migrate Announcements.tsx → components/Announcements.tsx
- [x] T-NX-21 Migrate FAQSection.tsx → components/FAQSection.tsx
- [x] T-NX-22 Migrate ContactSection.tsx → components/ContactSection.tsx
- [x] T-NX-23 Migrate ChatBot.tsx → components/ChatBot.tsx
- [x] T-NX-24 Migrate GovernmentPartners.tsx
- [x] T-NX-25 Migrate StatsAchievements.tsx
- [x] T-NX-26 Migrate QuickServices.tsx
- [x] T-NX-27 Migrate MediaCenter.tsx
- [x] T-NX-28 Migrate LoadingSpinner.tsx & Skeleton.tsx

### Public Pages (Next.js Migration)
- [x] T-NX-15 Port Navbar & Footer components to Next.js <!-- id: 1015-NX -->
- [x] T-NX-16 Create app/page.tsx (Home) <!-- id: 1016-NX -->
- [x] T-NX-17 Create app/news/page.tsx & app/news/[id]/page.tsx <!-- id: 1017-NX -->
- [x] T-NX-18 Create app/services/page.tsx & app/services/[id]/page.tsx <!-- id: 1018-NX -->
- [x] T-NX-19 Create app/complaints/page.tsx (Landing) <!-- id: 1019-NX -->
- [x] T-NX-20 Create app/complaints/new/page.tsx (Submission Form) <!-- id: 1020-NX -->
- [x] T-NX-21 Create app/complaints/track/page.tsx (Guest Tracking) <!-- id: 1021-NX -->
- [x] T-NX-29 Create app/(public)/news/page.tsx
- [x] T-NX-30 Create app/(public)/news/[id]/page.tsx
- [x] T-NX-31 Create app/(public)/announcements/page.tsx
- [x] T-NX-32 Create app/(public)/decrees/page.tsx (DecreesArchive)
- [x] T-NX-33 Create app/(public)/services/page.tsx (ServicesGuide)
- [x] T-NX-34 Create app/(public)/services/[category]/page.tsx
- [x] T-NX-35 Create app/(public)/directorates/page.tsx
- [x] T-NX-36 Create app/(public)/directorates/[id]/page.tsx


- [x] T-NX-37 Create app/(public)/faq/page.tsx
- [x] T-NX-38 Create app/(public)/search/page.tsx
- [x] T-NX-39 Create app/(public)/sitemap/page.tsx

### Complaint Portal (Public)
- [x] T-NX-40 Create app/(public)/complaints/page.tsx
- [x] T-NX-41 Create app/(public)/complaints/track/page.tsx
- [x] T-NX-42 Create app/(public)/complaints/[trackingNumber]/page.tsx

### Auth Pages
- [x] T-NX-43 Create app/(auth)/login/page.tsx <!-- id: 1043-NX -->
- [x] T-NX-44 Create app/(auth)/register/page.tsx <!-- id: 1044-NX -->
- [x] T-NX-45 Create app/(auth)/forgot-password/page.tsx <!-- id: 1045-NX -->
- [x] T-NX-46 Create app/(auth)/reset-password/page.tsx <!-- id: 1046-NX -->

- [x] T-CMS-01 Create UserResource (Filament)
- [x] T-CMS-02 Create ComplaintResource (Filament)
- [x] T-CMS-03 Create ContentResource (Filament)
- [x] T-CMS-04 Create DirectorateResource (Filament)
- [x] T-CMS-05 Create StatsOverviewWidget
- [x] T-CMS-06 Create LatestComplaintsWidget
- [x] T-CMS-07 Configure AdminPanelProvider

### CMS Customization (Brand Identity)
- [x] T-CMS-08 Create Custom Filament Theme (Tailwind)
- [x] T-CMS-09 Apply Government Brand Colors to Admin Panel
- [x] T-CMS-10 Customize Login Page Design


### Services & API Integration
- [x] T-NX-61 Create lib/api.ts (axios/fetch wrapper with CSRF) <!-- id: 1061-NX -->
- [x] T-NX-62 Create lib/auth.ts (auth utilities) <!-- id: 1062-NX -->
- [x] T-NX-63 Migrate services/repository.ts → lib/repository.ts (Connected to Laravel API)
- [x] T-NX-64 Migrate services/aiService.ts → lib/aiService.ts
- [x] T-NX-65 Create server actions for form submissions (Skipped: Using Repositories/API Pattern)

### Database & Data Migration (NEW)
- [x] T-DATA-01 Create PublicApiController for public endpoints
- [x] T-DATA-02 Add API routes for /api/v1/public/* endpoints
- [x] T-DATA-03 Create ContentSeeder with news, announcements, decrees, services, media
- [x] T-DATA-04 Create FaqSeeder with comprehensive FAQs
- [x] T-DATA-05 Update DirectoratesSeeder with all 12 directorates
- [x] T-DATA-06 Update Content model with all required fields
- [x] T-DATA-07 Create migration for contents table updates (content_ar, featured, priority, metadata, SEO fields)
- [x] T-DATA-08 Create migration for faqs table updates (category, order, is_active)
- [x] T-DATA-09 Download and store images locally in Laravel storage
- [x] T-DATA-10 Configure storage:link for public file access
- [x] T-DATA-11 Update Next.js repository.ts to use Laravel API (USE_MOCK_DATA = false)
- [x] T-DATA-12 Update Next.js .env.local with correct API URL

### User Dashboard (Citizen Portal)
- [ ] T-NX-81 Create app/(protected)/dashboard/page.tsx (User Dashboard Layout)
- [ ] T-NX-82 Create app/(protected)/dashboard/complaints/page.tsx (My Complaints List - FR-23)
- [ ] T-NX-83 Create app/(protected)/dashboard/profile/page.tsx (Profile Settings - FR-06)
- [ ] T-NX-84 Create app/(protected)/dashboard/settings/page.tsx (Notification Preferences)
- [ ] T-NX-85 Implement complaint deletion for citizen (FR-22 - only if status="received")

### Context & State
- [x] T-NX-66 Migrate LanguageContext → contexts/LanguageContext.tsx <!-- id: 1066-NX -->
- [x] T-NX-67 Create contexts/AuthContext.tsx
- [x] T-NX-68 Create contexts/ThemeContext.tsx (dark mode) <!-- id: 1068-NX -->
- [ ] T-NX-86 Create contexts/NotificationContext.tsx (Real-time notifications)

### Animations (GSAP)
- [x] T-NX-69 Migrate animations/index.ts
- [x] T-NX-70 Create useGSAP hook for client components
- [ ] T-NX-71 Add 'use client' directives where needed

### Docker & Deployment
- [x] T-NX-72 Create Dockerfile for Next.js (standalone output)
- [x] T-NX-73 Update docker-compose.yml for Next.js service
- [x] T-NX-74 Configure nginx proxy for Next.js
- [x] T-NX-75 Update environment variables in docker-compose

### Cleanup
- [x] T-NX-76 Remove Vite configuration files
- [x] T-NX-77 Remove old index.html entry point
- [x] T-NX-78 Update package.json scripts
- [x] T-NX-79 Test all routes and functionality
- [x] T-NX-80 Performance audit (Lighthouse)

---

## Phase 1: Backend Foundation ✅ COMPLETE


- [x] T001 Initialize Laravel 11 project
- [x] T002 Configure PostgreSQL 15+ database
- [x] T003 Configure Redis 7+ for caching/sessions
- [x] T004 Setup Docker Compose
- [x] T005 Configure environment variables
- [x] T006 Setup API routing (api/v1/)
- [x] T007 Configure CORS for Next.js origin
- [x] T008-T020 All database migrations
- [x] T021-T024 All seeders

---

## Phase 2: Authentication ✅ MOSTLY COMPLETE

- [x] T025 Laravel Sanctum (SPA authentication)
- [x] T026 User model with Argon2
- [x] T027 Role model with permissions
- [x] T028 AuthController (login/logout)
- [x] T030 Session timeout (15 min)
- [x] T031 Single-session enforcement
- [x] T032 Account lockout
- [x] T033 POST /api/v1/admin/users
- [x] T034 PUT /api/v1/users/me
- [x] T035 POST /api/v1/auth/password/reset
- [x] T036 POST /api/v1/auth/register
- [x] T037 PUT /api/v1/admin/users/{id}/disable
- [x] T038 Role-based middleware
- [x] T039 Directorate-based middleware
- [x] T040 AuditService
- [x] T041 Login attempt logging
- [x] T042 User management action logging
- [x] T043 Observer for audit trails

### Laravel Sanctum Config for Next.js
- [ ] T-SANC-01 Update config/sanctum.php stateful domains for Next.js
- [ ] T-SANC-02 Update config/cors.php for Next.js origins
- [ ] T-SANC-03 Ensure SESSION_DOMAIN matches Next.js domain
- [ ] T-SANC-04 Test CSRF token flow with Next.js

---

## Phase 3: AI Microservice ✅ COMPLETE

**Directory**: `ai-service/` (FastAPI - Keep as-is)

- [x] T-AI-01 Create FastAPI project structure
- [x] T-AI-02 Implement AIProvider base interface
- [x] T-AI-03 Implement GeminiProvider
- [x] T-AI-05 Create provider factory
- [x] T-AI-06 Create Dockerfile
- [x] T-AI-07 POST /api/v1/ai/chat
- [x] T-AI-08 POST /api/v1/ai/analyze-complaint
- [x] T-AI-09 POST /api/v1/ai/summarize
- [x] T-AI-10 POST /api/v1/ai/ocr
- [x] T-AI-11 POST /api/v1/ai/suggest-title
- [x] T-AI-12 POST /api/v1/ai/proofread

---

## Phase 4: Brand Identity ✅ COMPLETE

**Colors**: gov-forest (#094239), gov-gold (#b9a779), gov-teal (#428177), gov-beige (#edebe0)

- [x] T-BRAND-01 to T-BRAND-10 (All brand updates applied)

---

## Phase 5: Animation & Motion ✅ COMPLETE

**Library**: GSAP 3.14.2 with ScrollTrigger

- [x] T-ANIM-01 to T-ANIM-09 (All animations implemented)

---

## Phase 6: Staff/Admin Functionality ✅ COMPLETE

- [x] T-ADMIN-01 to T-ADMIN-07 (Backend routes, frontend integration)
- [x] Verified against Verification Scheme:
    - User/Role Management (FR-01, FR-08) ✅
    - Directorate Scoping for Staff (FR-26) ✅
    - Content/CMS Features (FR-09) ✅
    - Stats Dashboard (FR-20) ✅

---

## Phase 7: Complaint System ✅ BACKEND COMPLETE

### Backend
- [x] T044-T058 Complaint models, services, API endpoints

### Tracking
- [x] T066-T068 Tracking API endpoints

### Staff
- [x] T072-T078 Staff complaint management

### Frontend (Migrate to Next.js)
- [x] T086: UI: Print Complaint Button & Print View (FR-28) <!-- id: 1086 -->
- [x] T087: UI: Guest Complaint Tracking Verification Form (FR-24) <!-- id: 1087 -->

---

## Phase 8: Content Management

- [x] T096-T104 Content backend (models, service, API)
- [ ] T105-T107 AI integration (via AI service)
- [x] T111-A: UI: CMS AI Helper Tools (Summarize/Improve) (FR-14) <!-- id: 1111-A -->

---

## Phase 9: Chatbot Enhancement ✅ BACKEND COMPLETE

- [x] T112-T118 Backend (conversation storage, handoff)
- [x] T119-T121 Frontend updates in Next.js
- [x] Implemented persistent conversation storage (FR-32: 3+ months retention)
- [x] API endpoints: POST /chat/message, GET /chat/history, DELETE /chat/session
- [x] Human handoff backend (FR-35) ✅ (ChatController handoff methods + routes)
- [ ] Human handoff UI (FR-35) - Frontend integration pending

---

## Phase 10: Semantic Search

- [ ] T122-T126 Backend (pgvector, embeddings, search)
- [x] T127-A: UI: Advanced Search Filters (Date, Type, Entity) (FR-36) <!-- id: 1127-A -->

---

## Phase 11: Security & Production

- [x] T130-T136 Security hardening
    - [x] Rate limiting for complaints (FR-27: 3 per day)
    - [x] Security headers (CSP, X-Frame-Options, HSTS - NFR-12)
    - [x] CORS configuration for Next.js origin
    - [x] Sanctum stateful domains configured
- [ ] T137-T140 Performance optimization
- [ ] T141-T145 Monitoring & DevOps

---

## Phase 12: Notifications

- [ ] T079-T081 Complaint notifications
- [ ] T146-T148 Email service
- [ ] T149-T152 Messaging integrations (optional)

---

## Phase 13: Deployment (Kubernetes)

### Frontend (Next.js)
- [ ] T-K8S-01 frontend/deployment.yaml (Next.js standalone)
- [ ] T-K8S-02 frontend/service.yaml
- [ ] T-K8S-03 frontend/hpa.yaml (2-10 pods)

### Backend (Laravel)
- [ ] T-K8S-07 backend/deployment.yaml
- [ ] T-K8S-08 backend/service.yaml
- [ ] T-K8S-09 backend/hpa.yaml (3-15 pods)

### AI Service (FastAPI)
- [ ] T-K8S-11 ai-service/deployment.yaml
- [ ] T-K8S-12 ai-service/service.yaml
- [ ] T-K8S-13 ai-service/hpa.yaml (2-8 pods)

### Infrastructure
- [ ] T-K8S-14 postgresql-statefulset.yaml
- [ ] T-K8S-15 redis-deployment.yaml
- [ ] T-K8S-17 ingress.yaml
- [ ] T-K8S-18 cert-manager.yaml

---

## Phase 14: Polish & Documentation

- [x] T153-A: UI: External Link Warning Modal (FR-47) <!-- id: 1153-A -->
- [ ] T-DOC-01 to T-DOC-03 Documentation
- [ ] T157-T159 User manuals
- [ ] T160-T161 Testing

---

## Phase 15: Missing SRS Requirements (Gap Analysis)

> **Note**: This phase was added after analyzing the SRS document against current implementation.
> Reference: `مسودة ال SRS النسخة 3.docx.md`

### Backend: User Management Gaps (FR-01 to FR-08)
- [x] FR-01: Admin create employee accounts ✅ (UserController::store)
- [x] FR-02: User profile update ✅ (UserController::updateProfile)
- [x] FR-03: Password reset ✅ (UserController::resetPassword)
- [x] FR-04: Single session + 15 min timeout ✅ (AuthController)
- [x] FR-05: Citizen registration ✅ (UserController::register)
- [x] FR-06: Citizen profile update ✅ (UserController::updateProfile)
- [x] FR-07: 2FA (OTP-based) ✅ (AuthController::verify2fa) - User skipped
- [x] FR-08: Admin manage permissions ✅ (UserController::toggleStatus)

### Backend: CMS Gaps (FR-09 to FR-14)
- [x] FR-09: Publish/edit content ✅ (ContentController)
- [x] FR-10: No hard delete, archive only ✅ (ContentController::destroy uses soft delete)
- [x] T-SRS-01 FR-11: API endpoint for news per directorate ✅ (GET /api/v1/public/directorates/{id}/news)
- [x] FR-12: Services per directorate ✅ (PublicApiController::directorateServices)
- [x] T-SRS-02 FR-13: Service attachments support ✅ (ContentAttachmentController)
- [x] T-SRS-03 FR-14: AI integration for content creation ✅ (ContentResource AI tools - Arabic & English)

### Backend: Complaint System Gaps (FR-15 to FR-30)
- [x] FR-15: Complaint form ✅ (ComplaintController::store)
- [x] FR-16: OTP verification ✅ (Skipped per user request)
- [x] FR-17: Tracking number ✅ (ComplaintService)
- [x] FR-18: Attachments (5 files, 5MB) ✅ (ComplaintController validation)
- [x] T-SRS-04 FR-19: AI classification integration ✅ (ComplaintService::classifyWithAI + AIService::classifyComplaint)
- [x] FR-20: Staff dashboard ✅ (Filament resources)
- [x] FR-21: Staff change status ✅ (ComplaintController::updateStatus)
- [x] T-SRS-05 FR-22: Citizen delete complaint API ✅ (DELETE /api/v1/complaints/{id} - only if status=new/received)
- [x] FR-23: Citizen view complaints ✅ (ComplaintController::myComplaints)
- [x] FR-24: Guest track complaint ✅ (ComplaintController::track)
- [x] FR-25: Staff override AI ✅ (ComplaintController::updateCategorization)
- [x] T-SRS-06 FR-26: Directorate-based access enforcement ✅ (CheckDirectorate middleware)
- [x] FR-27: 3 complaints/day limit ✅ (Rate limiter)
- [x] T-SRS-07 FR-28: Print complaint backend (Generate PDF endpoint) ✅
- [x] T-SRS-08 FR-29: ComplaintTemplateResource for Filament (Admin CRUD for templates) ✅
- [x] T-SRS-09 FR-30: Archive complaint template functionality ✅

### Backend: Chatbot Gaps (FR-31 to FR-35)
- [x] FR-31: Natural language interaction ✅ (ChatController, AI service)
- [x] FR-32: Store conversations 3+ months ✅ (ChatConversation model)
- [ ] T-SRS-10 FR-33: WhatsApp Business API integration (Optional - Future)
- [ ] T-SRS-11 FR-33: Telegram Bot API integration (Optional - Future)
- [x] T-SRS-12 FR-35: Human handoff mechanism (Escalation to staff) ✅

### Backend: Archive/Search/Reports Gaps (FR-36 to FR-39)
- [ ] T-SRS-13 FR-36: Install pgvector extension for semantic search (Requires Docker image update)
- [x] T-SRS-14 FR-36: Create embeddings table and migration ✅ (JSON fallback until pgvector installed)
- [ ] T-SRS-15 FR-36: Implement vector search API endpoint
- [x] FR-37: Digital archive ✅ (Content with archived status)
- [x] T-SRS-16 FR-38: Statistics reporting API ✅ (ReportsController::statistics)
- [x] T-SRS-17 FR-38: Content statistics ✅ (ReportsController + export)
- [x] T-SRS-18 FR-39: AI recurring complaint summary ✅ (GenerateComplaintSummary command + weekly/monthly schedule)

### Backend: Security/Audit Gaps (FR-40 to FR-43)
- [x] FR-40: Audit trail ✅ (AuditLog model, AuditService)
- [x] FR-41: CAPTCHA ✅ (Skipped per user request)
- [x] T-SRS-19 FR-42: System settings table and API ✅ (SettingsController with CRUD)
- [x] T-SRS-20 FR-43: FAQ AI suggestion from chatbot ✅ (FaqSuggestionController)

### Backend: Notifications Gaps (FR-44 to FR-48)
- [x] T-SRS-21 FR-44: Internal notification system ✅ (NotificationController with CRUD + unread count)
- [x] T-SRS-22 FR-44: Notify staff on new complaint ✅ (ComplaintService → NotificationService::notifyNewComplaint)
- [x] T-SRS-23 FR-45: Overdue complaint reminder scheduler ✅ (CheckOverdueComplaints command + daily schedule)
- [x] T-SRS-24 FR-46: Security alert system ✅ (NotificationService::notifySecurityAlert)
- [x] FR-47: External link warning ✅ (ExternalLinkModal component)
- [x] T-SRS-25 FR-48: Notify citizen on complaint status change ✅ (ComplaintController → NotificationService::notifyStatusChange)

### Frontend: Missing Pages & Components
- [x] T-SRS-FE-01 Create authenticated user dashboard layout ✅
- [x] T-SRS-FE-02 Create "My Complaints" page for citizens (FR-23) ✅
- [x] T-SRS-FE-03 Add delete complaint button (FR-22 - only if status=new/received) ✅
- [x] T-SRS-FE-04 Create directorate-specific news section (FR-11) ✅
- [ ] T-SRS-FE-05 Create statistics/reports dashboard (FR-38)
- [x] T-SRS-FE-06 Create notifications dropdown in navbar (FR-44, FR-45, FR-46, FR-48) ✅
- [ ] T-SRS-FE-07 Create notification preferences settings page
- [x] T-SRS-FE-08 AI content tools in Filament CMS (FR-14: Summarize, Proofread, Title suggestion) ✅
- [ ] T-SRS-FE-09 FAQ suggestion management UI for admin (FR-43)
- [ ] T-SRS-FE-10 Semantic search results page with filters (FR-36)

### Non-Functional Requirements Status
| NFR | Description | Status |
|-----|-------------|--------|
| NFR-01 | Response time <200ms, Chatbot <500ms | ⚠️ Needs testing |
| NFR-02 | 99% uptime | ⚠️ Deployment required |
| NFR-03 | 2000 concurrent users, 500 RPS | ⚠️ Load testing needed |
| NFR-04 | PageSpeed Score >90 | ⚠️ Lighthouse audit needed |
| NFR-05 | Manual backup snapshot | ✅ BackupController implemented |
| NFR-06 | TLS 1.2+ & AES-256 encryption | ✅ HTTPS configured |
| NFR-07 | OWASP Top 10 compliance | ⚠️ Security audit needed |
| NFR-08 | IP restriction for admin panel | ✅ AdminIpRestrictionMiddleware |
| NFR-09 | HTTPS + HSTS | ✅ Nginx configured |
| NFR-10 | Rate limiting | ✅ Implemented |
| NFR-11 | Argon2/bcrypt passwords | ✅ Laravel default |
| NFR-12 | Security headers | ✅ SecurityHeadersMiddleware |
| NFR-13 | Secure session management | ✅ Sanctum |
| NFR-14 | Generic error messages | ✅ Implemented |
| NFR-15 | Separate DB server | ✅ Docker containers |
| NFR-16 | Account lockout | ✅ Rate limiter in AuthController |
| NFR-17 | AI no sensitive info responses | ⚠️ Needs AI prompt tuning |
| NFR-18 | Arabic/English + Dark mode | ✅ Implemented |
| NFR-19 | WCAG 2.1 AA accessibility | ⚠️ Needs audit |
| NFR-20 | Mobile-first design | ✅ Tailwind responsive |
| NFR-21 | Decoupled architecture | ✅ Next.js + Laravel |
| NFR-22 | Zero-downtime deployment | ❌ Needs K8s rolling update |
| NFR-23 | Resource monitoring alerts | ❌ Not implemented |
| NFR-24 | AI classification 95% accuracy | ⚠️ Needs training/testing |
| NFR-25 | Syrian data center hosting | ⚠️ Deployment specific |

---

## Execution Priority

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: NEXT.JS MIGRATION (CRITICAL PATH)                      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Project Setup (T-NX-01 to T-NX-05)                           │
│ 2. Auth Integration (T-NX-06 to T-NX-12, T-SANC-01 to T-SANC-04)│
│ 3. Migrate Components (T-NX-13 to T-NX-28)                      │
│ 4. Migrate Pages (T-NX-29 to T-NX-60)                           │
│ 5. Services & State (T-NX-61 to T-NX-71)                        │
│ 6. Docker & Cleanup (T-NX-72 to T-NX-80)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ POST-MIGRATION                                                   │
├─────────────────────────────────────────────────────────────────┤
│ 7. Missing UI Components (T086, T087, T111-A, T127-A, T153-A)   │
│ 8. Chatbot Enhancement (T112-T121)                              │
│ 9. Semantic Search (T122-T126)                                  │
│ 10. Security & Production (T130-T145)                           │
│ 11. Kubernetes Deployment (T-K8S-*)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 0: Next.js Migration | 86 | ✅ MOSTLY COMPLETE |
| Phase 1: Backend Foundation | 24 | ✅ COMPLETE |
| Phase 2: Authentication | 19 | ✅ MOSTLY COMPLETE |
| Phase 3: AI Microservice | 12 | ✅ COMPLETE |
| Phase 4: Brand Identity | 10 | ✅ COMPLETE |
| Phase 5: Animation | 9 | ✅ COMPLETE |
| Phase 6: Staff/Admin | 7 | ✅ COMPLETE |
| Data Migration | 12 | ✅ COMPLETE |
| Phase 7-14: Features | ~50 | Pending |
| **Phase 15: SRS Gap Analysis** | **35** | **⚠️ IN PROGRESS (31/35)** |

### Phase 15 Task Breakdown (SRS Gap Analysis)

| Category | Tasks | Completed | Priority |
|----------|-------|-----------|----------|
| Backend: CMS (FR-09-14) | 3 | 3 | ✅ DONE |
| Backend: Complaints (FR-15-30) | 6 | 6 | ✅ DONE |
| Backend: Chatbot (FR-31-35) | 3 | 1 | ⚠️ Medium (WhatsApp/Telegram deferred) |
| Backend: Search/Reports (FR-36-39) | 6 | 5 | ⚠️ High (pgvector pending) |
| Backend: Security (FR-40-43) | 2 | 2 | ✅ DONE |
| Backend: Notifications (FR-44-48) | 5 | 5 | ✅ DONE |
| Frontend: UI Components | 10 | 7 | ⚠️ High |
| NFR Implementation | - | +2 | ✅ (NFR-05, NFR-08) |
| **Total** | **35** | **31** | - |

### Critical Missing Features (High Priority)

1. ~~**FR-11**: News per directorate - API + UI~~ ✅ DONE
2. ~~**FR-19**: AI complaint classification integration~~ ✅ DONE (ComplaintService::classifyWithAI)
3. ~~**FR-22**: Citizen delete complaint (if status=new/received)~~ ✅ DONE
4. ~~**FR-44**: Internal notifications (new complaints)~~ ✅ DONE
5. ~~**FR-48**: Citizen notification on status change~~ ✅ DONE
6. ~~**FR-36**: Semantic search (embeddings table created)~~ ⚠️ pgvector extension needed
7. ~~**User Dashboard**: Citizen portal for managing complaints~~ ✅ DONE
8. ~~**FR-35**: Human handoff mechanism (backend)~~ ✅ DONE
9. ~~**FR-28**: Print complaint PDF~~ ✅ DONE
10. ~~**FR-30**: Archive complaint templates~~ ✅ DONE
11. ~~**FR-26**: Directorate-based access~~ ✅ DONE (CheckDirectorate middleware)
12. ~~**FR-45**: Overdue complaint scheduler~~ ✅ DONE (Artisan command + daily schedule)

### Remaining Items (4 tasks)

1. **FR-33**: WhatsApp/Telegram integration (Deferred - Optional)
2. **FR-36**: pgvector extension installation (Requires Docker image update)
3. **Frontend**: Human handoff UI integration
4. **Frontend**: Notification preferences page, Semantic search results page

### Non-Functional Requirements Summary

| Status | Count | Items |
|--------|-------|-------|
| ✅ Implemented | 14 | NFR-05, 06, 08, 09-16, 18, 20, 21 |
| ⚠️ Needs Testing/Audit | 8 | NFR-01-04, 07, 17, 19, 24 |
| ❌ Not Implemented | 3 | NFR-22, 23, 25 |

**Total**: ~257 tasks | **Complete**: ~143 | **Skipped**: 9 (OTP/CAPTCHA) | **New from SRS**: 35 (31 completed)
