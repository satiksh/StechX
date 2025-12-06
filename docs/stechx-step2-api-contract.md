# StechX v2 — STEP 2: Data Model & API Contract

Goal: Claude defines the database schema and REST API so the frontend can rely on it without changes.

---

## 1. Data Models (Prisma Entities)

### User

- id: string (uuid)
- name: string
- email: string @unique
- role: enum UserRole = ADMIN | CLIENT | TALENT
- provider: enum AuthProvider = GOOGLE | LOCAL
- providerId: string? (Google sub)
- avatarUrl: string?
- passwordHash: string? (for future local login)
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt

### Service

- id: string
- slug: string (web/app/video/ai) @unique
- title: string
- shortDescription: string
- longDescription: string
- highlights: string[]
- createdAt: DateTime
- updatedAt: DateTime

### Project

- id: string
- title: string
- slug: string @unique
- serviceId: string (FK → Service)
- thumbnailUrl: string
- imageUrls: string[]
- summary: string
- caseStudy: string
- isFeatured: boolean @default(false)
- createdAt: DateTime
- updatedAt: DateTime

### Testimonial

- id: string
- clientName: string
- clientRole: string
- quote: string
- projectId: string? (FK → Project)
- createdAt: DateTime

### Application

- id: string
- type: enum ApplicationType = CLIENT_PROJECT | TALENT
- serviceId: string? (FK → Service, for client projects)
- name: string
- email: string
- message: string
- budget: float? (client only)
- experience: string? (talent only)
- status: enum ApplicationStatus = SUBMITTED | UNDER_REVIEW | ACCEPTED | REJECTED
- createdAt: DateTime

---

## 2. Public API Endpoints (Read + Submit)

### Services

- GET /api/services
- GET /api/services/:slug

### Projects

- GET /api/projects          (optional query: ?service=web|app|video|ai)
- GET /api/projects/:slug

### Testimonials

- GET /api/testimonials

### Contact & Applications

- POST /api/contact           (general inquiries)
- POST /api/apply/client      (client submitting project brief)
- POST /api/apply/talent      (talent applying to join)

---

## 3. Admin API Endpoints (Protected)

### Auth

- POST /api/auth/google/client
- POST /api/auth/google/talent
- POST /api/auth/google/admin

### Projects (Admin only)

- GET    /api/admin/projects
- GET    /api/admin/projects/:id
- POST   /api/admin/projects
- PATCH  /api/admin/projects/:id
- DELETE /api/admin/projects/:id

### Testimonials (Admin only)

- GET    /api/admin/testimonials
- POST   /api/admin/testimonials
- PATCH  /api/admin/testimonials/:id
- DELETE /api/admin/testimonials/:id

### Applications (Admin only)

- GET    /api/admin/applications
- PATCH  /api/admin/applications/:id   (update status)

---

## 4. STEP 2.5 — Auth & Roles with Google

Goal: Google sign‑in for ADMIN, CLIENT, TALENT flows using JWT.

### Role Mapping

- ADMIN: You + trusted team, controlled by `ADMIN_EMAILS` env variable.
- CLIENT: Any user coming via “Get Service” / “Continue with Google as Client”.
- TALENT: Any user coming via “Get Hired” / “Continue with Google as Talent”.

### Backend Auth Logic

On these endpoints:

- POST /api/auth/google/client
- POST /api/auth/google/talent
- POST /api/auth/google/admin

Flow:

1. Verify Google ID token (get email, name, sub, avatar).
2. Look up User by email.
3. If exists:
   - Check role vs requested flow (client/talent/admin).
4. If not exists:
   - client endpoint → create User with role=CLIENT.
   - talent endpoint → create User with role=TALENT.
   - admin endpoint → only create if email is in ADMIN_EMAILS.
5. Create JWT with `{ userId, email, role }`.
6. Return JWT to frontend.

### Middleware

- `authenticate`:
  - Read JWT from Authorization header or cookie.
  - Verify and attach `req.user`.
- `authorizeRole('ADMIN')`:
  - Only allow if `req.user.role === 'ADMIN'`.

### Environment Variables

Backend:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- ADMIN_EMAILS            (comma‑separated)
- JWT_SECRET
- DATABASE_URL
- PORT

Frontend:

- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_GOOGLE_CLIENT_ID

---

## 5. Contract Task for Claude

Save this spec as the **single source of truth** for the backend.

Prompt for Claude:

> Using these models and routes, generate:
> - Prisma schema
> - Express route files
> - Controllers + services
> - Zod validators for all POST/PATCH inputs
> - JWT auth middleware (authenticate + authorizeRole)
>
> Follow this spec exactly. Do not change field names, enums, or routes.
>
> Output everything as a backend codebase ready to run with:
> - Express
> - TypeScript
> - Prisma
> - PostgreSQL (Neon-compatible)

Status:

- STEP 2 (Data Model & API Contract): LOCKED after this file is saved.
- Next: STEP 3 — Backend implementation from this contract.

