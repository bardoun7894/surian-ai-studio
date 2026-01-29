# Feature Specification: Ministry of Economy & Industry Website

**Feature Branch**: `main`
**Created**: 2026-01-14
**Last Updated**: 2026-01-21 (Customer Modifications V2)
**Status**: Implementation In Progress
**Source**: SRS Document (مسودة ال SRS النسخة 3.docx.md) + Customer Requests (2026-01-20)

## Clarifications

### Session 2026-01-26
- Q: What is the primary focus for identifying missing features? → A: Full audit of both frontend and backend - identify all incomplete features
- Q: Which gap is most critical for production launch? → A: All gaps are equally critical - implement together (Session Idle Timeout, Print Complaint Button, AI Text Improvement, Guest Tracking Page)
- Q: What should happen when session times out? → A: Silent logout - Redirect to login page immediately when timeout occurs
- Q: What AI capabilities should the content editor provide? → A: All three - Proofreading, summarization, and title suggestions
- Q: Where should print complaint functionality be accessible? → A: Both tracking and admin - Available on public tracking page AND admin complaint view

---

## Executive Summary

This specification covers the complete government portal for the Syrian Ministry of Economy & Industry. The system includes:
- Public website with content management (CMS)
- Smart complaint system with AI classification
- AI-powered chatbot assistant (FastAPI Microservice)
- Admin dashboard with role-based access control
- Bilingual support (Arabic/English)

---

## Architecture Decision (Clarified 2026-01-14)

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Next.js 14 (App Router) | Migrating from React/Vite for SSR, SEO, and code splitting |
| **Backend API** | Laravel 11 + Sanctum | Secure API authentication, keep existing structure |
| **AI Microservice** | FastAPI (Python) | Keep existing async service for AI/ML operations |
| **Admin Dashboard** | Next.js 14 pages | API-driven via Laravel (NOT Blade templates) |
| **Database** | PostgreSQL 14+ | As specified in SRS |
| **Cache** | Redis | Session storage and caching |
| **Container** | Docker + Docker Compose | Multi-service orchestration |

### Migration Notes
- **Vite → Next.js**: Use official [migration guide](https://nextjs.org/docs/app/guides/migrating/from-vite)
- **Env vars**: `VITE_*` → `NEXT_PUBLIC_*` prefix
- **Auth flow**: Laravel Sanctum CSRF + session cookies ([breeze-next](https://github.com/laravel/breeze-next))
- **FastAPI**: Production-ready with [Docker best practices](https://fastapi.tiangolo.com/deployment/docker/)

---

## Implementation Status Analysis (Updated 2026-01-26)

**Overall Completion: 91%** (Frontend: 85%, Backend: 98%)

### FRONTEND STATUS

| Component | Status | SRS Reference | Notes |
|-----------|--------|---------------|-------|
| Homepage with Hero Section | ✅ Done | FR-11 | News ticker, grid articles, video cards |
| Dark Mode | ✅ Done | FR-42, NFR-18 | System preference support |
| Bilingual (AR/EN) | ✅ Done | NFR-18 | Language context working |
| Responsive Design | ✅ Done | NFR-20 | Mobile-first implemented |
| Complaint Form | ✅ Done | FR-15 | Full form with backend integration |
| Complaint Tracking | ✅ Done | FR-24 | OTP verification, backend connected |
| AI Analysis (Complaints) | ✅ Done | FR-19 | FastAPI AI service integration |
| Chatbot | ✅ Done | FR-31-35 | AI chatbot with handoff support |
| Admin Dashboard | ✅ Done | FR-20 | Full CRUD, Filament + Next.js admin |
| Login/Register | ✅ Done | FR-01, FR-05 | Sanctum auth, 2FA support |
| Profile Settings | ✅ Done | FR-02 | Full profile edit with password change |
| Password Reset UI | ✅ Done | FR-03 | Forgot + Reset password pages |
| External Link Modal | ✅ Done | FR-47 | Warning modal component |
| Search Filters | ✅ Done | FR-36 | Date, entity, type filters |
| Newsletter Signup | ✅ Done | - | Email subscription component |
| Video Hover Play | ✅ Done | - | VideoCard with autoPlayOnHover |
| Suggestions Portal | ✅ Done | FR-52-56 | Full form with tracking |
| **Print Complaint UI** | **⚠️ PARTIAL** | **FR-28** | **Backend ready, no print button in UI** |
| **AI Content Tools** | **⚠️ PARTIAL** | **FR-14** | **AI service ready, no "Improve Text" button** |
| **Guest Tracking Page** | **⚠️ PARTIAL** | **FR-24** | **Uses ComplaintPortal, no dedicated page** |

### BACKEND STATUS

| Component | Status | SRS Reference | Notes |
|-----------|--------|---------------|-------|
| Laravel 11 + Sanctum | ✅ Done | FR-01-08 | Full auth system |
| PostgreSQL Database | ✅ Done | Operating Env | All migrations complete |
| Role-Based Access Control | ✅ Done | FR-08, FR-26 | Policies implemented |
| CMS - Content CRUD | ✅ Done | FR-09, FR-10 | Full CRUD with versioning |
| Content Versioning | ✅ Done | FR-10 | Version history + restore |
| Complaint Backend | ✅ Done | FR-15-27 | Full workflow implemented |
| Email Notifications | ✅ Done | FR-44-48 | 7 notification classes |
| AI Classification | ✅ Done | FR-19, FR-25 | FastAPI integration |
| Audit Trail | ✅ Done | FR-40 | Immutable logging |
| Rate Limiting | ✅ Done | FR-27 | 3/day complaint limit |
| Account Lockout | ✅ Done | NFR-16 | 5 attempt threshold |
| WhatsApp/Telegram | ✅ Done | FR-33-34 | Webhook controllers |
| Human Handoff | ✅ Done | FR-35 | Chat handoff endpoint |
| Semantic Search | ✅ Done | FR-36 | pgvector integration |
| Reports & Analytics | ✅ Done | FR-38-39 | Statistics endpoint |
| PDF Generation | ✅ Done | FR-28 | Backend endpoint ready |
| **Session Idle Timeout** | **⚠️ MISSING** | **FR-04** | **15-min timeout not enforced** |

### REMAINING GAPS (Equal Priority)

| Gap | Layer | FR# | Description |
|-----|-------|-----|-------------|
| Print Complaint Button | Frontend | FR-28 | Add print/PDF button to complaint view |
| AI Text Improvement | Frontend | FR-14 | Add "Improve Text" button in content editor |
| Guest Tracking Page | Frontend | FR-24 | Create dedicated tracking verification page |
| Session Idle Timeout | Backend | FR-04 | Implement 15-minute idle logout middleware |

### PUBLIC WEBSITE GAPS (Gap Analysis 2026-01-28)

| Gap | Layer | Priority | Description |
|-----|-------|----------|-------------|
| Anonymous Complaints | Frontend | HIGH | Add مجهول/Anonymous option per sitemap |
| Ministry Name Text | Frontend | HIGH | Add ministry name beside logo in navbar |
| Delete Complaint | Frontend | HIGH | Add delete button for "received" status only |
| AI Summary - News | Frontend | HIGH | Add AI summary button to news page |
| AI Summary - Decrees | Frontend | HIGH | Add AI summary button to decrees page |
| Terms of Use Page | Frontend | MEDIUM | Create dedicated /terms page |
| Quick Links Dropdown | Frontend | MEDIUM | Convert navbar quick links to dropdown menu |
| Service Stages | Frontend | MEDIUM | Show service workflow steps visualization |
| Pre-fill Auth Data | Frontend | MEDIUM | Auto-fill logged-in user data in complaint form |
| Search Categories | Frontend | MEDIUM | Add Services & FAQ tabs to search |
| Sub-Directorates Page | Frontend | LOW | Create /directorates/[id]/sub-directorates route |
| Entity Filter | Frontend | LOW | Wire up existing entity filter definition in search |

### ADMIN DASHBOARD GAPS (Gap Analysis 2026-01-28)

| Gap | Layer | Priority | Description |
|-----|-------|----------|-------------|
| Audit Password | Frontend | HIGH | Add password prompt before audit access |
| Dashboard KPIs | Frontend | MEDIUM | Add users, suggestions, news counts to admin dashboard |
| Priority Adjustment | Frontend | MEDIUM | Allow editing complaint priority in admin |
| Complaint Templates | Frontend | MEDIUM | Create template management UI in admin |
| External Toggles | Frontend | LOW | Channel enable/disable settings (WhatsApp/Email/SMS) |

---

## User Scenarios & Testing

### User Story 1 - Citizen Submits Complaint (Priority: P1) - MVP

A citizen visits the website to submit a complaint about a government service. They fill out the complaint form with personal details, describe the issue, and receive a unique tracking number for follow-up.

**Why this priority**: Core functionality that delivers immediate citizen value. Most requested feature.

**Independent Test**: Complete complaint submission flow can be tested end-to-end with database storage and tracking number generation.

**Acceptance Scenarios**:

1. **Given** citizen on complaints page, **When** fills required fields and submits, **Then** receives unique tracking number and confirmation message
2. **Given** invalid national ID format, **When** attempts submit, **Then** shows validation error in Arabic
3. **Given** AI analysis enabled, **When** complaint text entered, **Then** priority and category auto-suggested
4. **Given** 3 complaints already submitted today, **When** attempts 4th submission, **Then** blocked with limit message (FR-27)

---

### User Story 2 - Citizen Tracks Complaint Status (Priority: P1)

A citizen who previously submitted a complaint wants to check its current status using their tracking number.

**Why this priority**: Essential companion to US1. Citizens need feedback on submissions.

**Independent Test**: Query complaint by tracking ID returns current status, timeline, and any responses.

**Acceptance Scenarios**:

1. **Given** valid tracking number, **When** citizen searches, **Then** displays status, dates, and any staff responses
2. **Given** invalid tracking number, **When** searches, **Then** shows "not found" message
3. **Given** authenticated citizen, **When** views profile, **Then** sees all their submitted complaints

---

### User Story 3 - Staff Manages Complaints (Priority: P2)

A complaint officer logs into the admin dashboard to view, process, and respond to complaints assigned to their directorate.

**Why this priority**: Without staff processing, citizen complaints cannot be resolved.

**Independent Test**: Staff can login, view only their directorate's complaints, change status, and add responses.

**Acceptance Scenarios**:

1. **Given** logged-in staff, **When** accesses complaints, **Then** sees only their directorate's complaints (FR-26)
2. **Given** complaint in "received" status, **When** staff changes to "in progress", **Then** citizen notified via email (FR-48)
3. **Given** AI-suggested priority, **When** staff adjusts, **Then** adjustment logged for ML improvement (FR-25)
4. **Given** completed complaint, **When** staff marks "resolved" with response, **Then** citizen receives final response

---

### User Story 4 - Admin Creates Employee Account (Priority: P2)

System administrator creates new employee accounts with specific roles and directorate assignments.

**Why this priority**: Required for staff to access the system.

**Independent Test**: Admin creates account, employee receives credentials email, can login with temporary password.

**Acceptance Scenarios**:

1. **Given** admin logged in, **When** creates employee account, **Then** system generates temp password and sends email (FR-01)
2. **Given** duplicate email, **When** creates account, **Then** shows "email exists" error
3. **Given** new employee, **When** first login, **Then** must change password (FR-03)
4. **Given** admin, **When** disables account, **Then** employee cannot login (FR-08)

---

### User Story 5 - Content Manager Publishes News (Priority: P2)

A content manager creates and publishes government news, decrees, or announcements through the CMS.

**Why this priority**: Essential for government communication.

**Independent Test**: Manager creates content, publishes, appears on website in correct section.

**Acceptance Scenarios**:

1. **Given** logged-in content manager, **When** creates and publishes news, **Then** appears in news section
2. **Given** published content, **When** archived, **Then** moves to archive but not deleted (FR-10)
3. **Given** AI assistance requested, **When** writing content, **Then** suggests title, SEO keywords (FR-14)
4. **Given** content edited, **When** saved, **Then** previous version preserved (FR-10)

---

### User Story 6 - Visitor Uses AI Chatbot (Priority: P3)

A visitor asks questions about government services through the AI chatbot.

**Why this priority**: Enhances user experience but not critical for core functions.

**Independent Test**: Chatbot responds to service inquiries, can query complaint status.

**Acceptance Scenarios**:

1. **Given** visitor opens chatbot, **When** asks about service, **Then** receives relevant response
2. **Given** complaint tracking number, **When** asked via chatbot, **Then** returns status
3. **Given** complex question, **When** AI cannot handle, **Then** offers human handoff (FR-35)
4. **Given** 3 months, **When** conversation logged, **Then** available for audit (FR-32)

---

### User Story 7 - Semantic Search (Priority: P3)

A user searches for laws or decrees using natural language instead of exact keywords.

**Why this priority**: Nice-to-have for improved discoverability.

**Independent Test**: Search "tax reduction for small businesses" returns relevant decrees even without exact match.

**Acceptance Scenarios**:

1. **Given** user enters natural language query, **When** searches, **Then** returns semantically relevant results
2. **Given** search results, **When** displayed, **Then** categorized by type (laws, decrees, news)

---

### Edge Cases

- What happens when email gateway is unavailable? (Queue and retry)
- What happens when AI service is down? (Fall back to manual classification)
- How does system handle concurrent edits to same content? (Version conflict detection)
- What happens when user session times out? (15-minute idle logout per FR-04)
- What happens when file upload exceeds 5MB limit? (Client-side validation + server rejection)

---

## Requirements

### Functional Requirements (From SRS)

#### User Management (FR-01 to FR-08)
- **FR-01**: Admin creates employee accounts (name, email, title, password)
- [x] FR-02: Employees can update their email and password (UI: Profile Settings Page)
- [ ] FR-03: Password reset via admin (employees) or OTP (admin accounts) (UI: Forgot/Reset Pages)
- [ ] FR-04: Single session per account, 15-min idle timeout (silent logout with immediate redirect to login)
- **FR-05**: Citizens can self-register
- **FR-06**: Citizens can update profile
- **FR-07**: Secure login/logout (OTP Skipped per user request)
- **FR-08**: Admin manages roles and can disable accounts

#### Content Management (FR-09 to FR-14)
- **FR-09**: CRUD for decrees, laws, news, announcements per section
- **FR-10**: No hard delete - archive only with version history
- **FR-11**: Breaking news ticker + latest 3 news per directorate on homepage
- **FR-12**: Service catalog per directorate with descriptions
- **FR-13**: Service management with multi-attachment support
- **FR-14**: AI for drafts, proofreading, text summarization (UI: Content Editor with 3 AI buttons - Proofread, Summarize, Suggest Titles)
- **FR-14.1**: AI OCR for document text extraction

#### Smart Complaints (FR-15 to FR-30)
- **FR-15**: Complaint form with personal data fields
- **FR-16**: Secure submission (OTP Verification SKIPPED)
- **FR-17**: Unique random tracking number
- **FR-18**: Up to 5 attachments, 5MB each
- **FR-19**: AI auto-classification by category and priority
- **FR-20**: Per-directorate dashboard with filtering
- **FR-21**: Status workflow (received → in progress → responded)
- **FR-22**: No edit after submit, delete only if "received"
- **FR-23**: Authenticated users see complaint history
- **FR-24**: Guest inquiry with personal data + tracking number (UI: Tracking Verification Form)
- **FR-25**: Staff can adjust AI classification (feedback loop)
- **FR-26**: Staff sees only their directorate's complaints
- **FR-27**: 3 complaints per day limit
- **FR-28**: Print complaint feature (UI: Print/PDF button on public tracking page AND admin complaint view)
- **FR-29**: Admin adds new complaint templates
- **FR-30**: Admin archives old templates

#### AI Chatbot (FR-31 to FR-35)
- **FR-31**: Natural language interaction for service inquiries
- **FR-32**: Store conversations 3+ months for audit
- **FR-33**: WhatsApp & Telegram integration (inquiry only)
- **FR-34**: No new complaints via messaging apps
- **FR-35**: Human handoff when AI fails (UI: "Contact Support" option in Chatbot)

#### Archive & Reports (FR-36 to FR-39)
- **FR-36**: Text + semantic search with filters
- **FR-37**: Archive from launch date, shows unpublished content
- **FR-38**: Periodic reports (news count, complaints stats, visits)
- **FR-39**: AI summary of recurring complaints

#### Security & Audit (FR-40 to FR-43)
- **FR-40**: Immutable audit log (login, user management, content, complaints)
- **FR-41**: CAPTCHA (SKIPPED per user request)
- **FR-42**: Global settings (language, dark mode, channel toggles)
- **FR-43**: FAQ management with AI suggestions from chatbot

#### Notifications (FR-44 to FR-48)
- **FR-44**: Internal notification on new complaint
- **FR-45**: Reminder notifications by priority (48h/7d/10d)
- **FR-46**: Admin alerts for suspicious activity
- **FR-47**: External link warning modal (UI: Global Modal Component)
- **FR-48**: Citizen notification on status change

#### Customer Modifications V2 (FR-49 to FR-61) - Added 2026-01-21
**Source**: Customer feedback on v1.0 deployment (2026-01-20)
**Priority**: High - Required for production launch

##### Featured Directorates Section (FR-49 to FR-51)
- **FR-49**: Display 3 featured directorates as cards below news ticker
  - Each card shows ministry eagle logo (centered) + directorate name below
  - Cards positioned in horizontal layout (responsive to mobile)
  - Visual design: Government brand colors, consistent with existing cards
- **FR-50**: Directorate card click reveals sub-directorates list
  - Display all sub-directorates for selected directorate
  - Each sub-directorate shows name + navigation link
  - Links can be internal pages or external websites
  - Interaction: Dropdown/modal/expand (UX to be determined)
- **FR-51**: Admin can configure which 3 directorates are featured
  - Exactly 3 directorates marked as "featured" at any time
  - Admin can add/edit/reorder sub-directorates per directorate
  - Sub-directorates include: name (AR/EN), URL, external flag, display order

##### Suggestions Portal (FR-52 to FR-56)
- **FR-52**: New "Suggestions for the World" (مقترحات للعالم) portal for citizen input
  - Citizens can submit project suggestions or ministry improvement ideas
  - Available to both authenticated users and guests
  - Separate from complaints system (different workflow)
- **FR-53**: Suggestions submission form fields
  - Full name (required)
  - Job title/Position (وظيفته) (required)
  - Suggestion description (textarea, required, min 50 chars)
  - File attachments (optional, max 5 files, 10MB each)
  - Supported file types: PDF, DOC, DOCX, JPG, PNG
- **FR-54**: Header navigation includes "Suggestions" button
  - Button labeled "مقترحات للعالم" (Arabic) / "Suggestions" (English)
  - Links to suggestions portal page
  - Consistent with existing header button styling
- **FR-55**: Admin review and manage suggestions
  - Staff can view all submitted suggestions
  - Status workflow: Pending → Under Review → Approved/Rejected
  - Staff can add internal notes
  - Email notification to admin on new suggestion
- **FR-56**: Suggestions security & rate limiting
  - Rate limit: 3 suggestions per day per IP/user
  - File type validation (whitelist only)
  - Input sanitization for all text fields
  - Virus scanning for uploaded files (future enhancement)

##### Complaint Form Enhancement (FR-57)
- **FR-57**: Add "Previous Complaint" reference field
  - Checkbox/radio: "Is this related to a previous complaint?"
  - If YES: Show tracking number input field
  - System validates tracking number exists
  - Privacy: If user authenticated, previous complaint must belong to them
  - Stores relationship between complaints (related_complaint_id foreign key)
  - Display related complaint info in admin view

##### UI/UX Enhancements (FR-58 to FR-61)
- **FR-58**: Announcements section layout change
  - Display 9 announcements in 3×3 grid layout
  - Previously showed 5 items in horizontal scroll
  - Responsive: Adjust to 2 columns on tablet, 1 column on mobile
- **FR-59**: AI Assistant button enhancement
  - Increase button size (specific dimensions TBD by design)
  - Add AI indicator icon/badge
  - Add welcome text beside icon: "مرحبا بك بالمساعد الذكي" (AR) / "Welcome to the AI Assistant" (EN)
  - Ensure visibility on all screen sizes
- **FR-60**: Animated hero section background
  - Add subtle motion/animation to hero section background
  - Animation type: Moving gradient, particles, or wave effect (TBD by design)
  - Performance: Maintain 60fps, respect prefers-reduced-motion
  - Should not distract from hero content
- **FR-61**: Content quality requirements
  - No UI element should be missing images (placeholders required)
  - All text content must be grammatically correct (Arabic & English)
  - Remove duplicate sections from homepage (specific sections TBD by customer)
  - Verify all pages load and function correctly
  - Bilingual support verified for all new components

### Non-Functional Requirements

#### Performance (NFR-01 to NFR-05)
- **NFR-01**: Page response <200ms, Chatbot <500ms
- **NFR-02**: 99% uptime, 24/7 chatbot
- **NFR-03**: 2000 concurrent users, 500 RPS
- **NFR-04**: PageSpeed >90
- **NFR-05**: Manual backup/snapshot capability

#### Security (NFR-06 to NFR-17)
- **NFR-06**: TLS 1.2+ in transit, AES-256 at rest
- **NFR-07**: OWASP Top 10 compliance
- **NFR-08**: Admin access from Syrian IPs only
- **NFR-09**: HTTPS only, HSTS enabled
- **NFR-10**: Rate limiting
- **NFR-11**: Argon2/bcrypt password hashing with salt
- **NFR-12**: Security headers (CSP, X-Frame-Options)
- **NFR-13**: Secure session management, regenerate on login
- **NFR-14**: Generic error messages, no stack traces
- **NFR-15**: Database server isolated from web server
- **NFR-16**: Account lockout on failed attempts
- **NFR-17**: Chatbot must not answer sensitive questions

#### Quality (NFR-18 to NFR-24)
- **NFR-18**: Arabic/English, dark mode, responsive
- **NFR-19**: WCAG 2.1 AA, audio CAPTCHA
- **NFR-20**: Mobile-first design
- **NFR-21**: Decoupled architecture, Docker, CI/CD
- **NFR-22**: Zero-downtime deployment
- **NFR-23**: Resource monitoring, alerts at 80% CPU
- **NFR-24**: 95% AI classification accuracy

#### Other (NFR-25)
- **NFR-25**: Hosting in Syrian government data center only

---

### Key Entities

- **User**: Citizens and employees with different roles
- **Role**: Admin, Content Manager, Complaint Officer
- **Complaint**: Citizen submission with status lifecycle
- **ComplaintTemplate**: Form configurations per directorate
- **Content**: News, Decrees, Laws, Announcements
- **ContentVersion**: Historical versions of content
- **Directorate**: Ministry departments
- **Service**: Government services with requirements
- **AuditLog**: Immutable activity records
- **ChatConversation**: AI chatbot session history
- **Notification**: Internal and email notifications

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Citizens can submit and track complaints end-to-end within 5 minutes
- **SC-002**: Staff complaint processing time reduced by 40% vs paper
- **SC-003**: 95% of AI classifications match staff's final decision
- **SC-004**: System handles 2000 concurrent users without degradation
- **SC-005**: Page load time under 200ms for 95th percentile
- **SC-006**: Zero data breaches or unauthorized access incidents
- **SC-007**: 99% uptime measured monthly
- **SC-008**: All content changes traceable via audit log
