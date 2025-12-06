# StechX v2 — STEP 1: Brand, UX, and Page Map
/* Responsive global type scale */
html {
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "SF Pro Display", sans-serif;
}

@media (max-width: 900px) {
  html {
    font-size: 15px;
  }
}

@media (max-width: 600px) {
  html {
    font-size: 14px;
  }
}

/* Default body text */
body {
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Generic heading style (Apple-like) */
h1,
h2,
h3 {
  font-weight: 700;
  letter-spacing: -0.03em;
}

/* Your custom classes below keep working (stechx-body, hero, etc.) */

## 1. Visual Direction (Final)

- Background: Dark graphite with soft gradients and depth.
- Primary colors: logo white/silver, accent of cool sky/blue.
- Typography:
  - Headings: bold, futuristic display style.
  - Body: clean, simple sans-serif, very readable.

## 2. Page List (Information Architecture)

### Public marketing

- `/` → Home
- `/services` → Services overview
- `/services/web`
- `/services/app`
- `/services/video`
- `/services/ai`
- `/portfolio` → All projects (filter by service)
- `/portfolio/[slug]` → Project case study
- `/contact`
- `/apply/client`
- `/apply/talent`

### Auth flows

- `/login/client` → “Continue with Google as Client”
- `/login/talent` → “Continue with Google as Talent”
- `/admin/login` → “Continue with Google as Admin”

### Admin (protected)

- `/admin/dashboard`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]/edit`
- `/admin/testimonials`
- `/admin/applications` (optional later)

## 3. UX Sections Per Page

### Home (`/`)

- Hero: STX logo, headline “Full-Stack Growth Partner”
  - Buttons: “Get a Service” (client), “Get Hired” (talent)
- Why StechX
- Services preview (Web, App, Video, AI)
- Selected Work (featured projects)
- Process (3–4 simple steps)
- Testimonials
- Final Call to Action

### Services Overview (`/services`)

- Intro: what StechX does for startups
- List of 4 wings with short descriptions
- How we work (high-level process)
- CTA: “Start a Project”

### Service Detail (`/services/web`, `/services/app`, `/services/video`, `/services/ai`)

- Hero explaining that specific service
- “What you get” list
- Tech stack
- Process for that service
- Highlighted portfolio for that service
- FAQ + CTA: “Start a [Service] Project”

### Portfolio (`/portfolio`)

- Intro line
- Filters: All / Web / App / Video / AI
- Grid of project cards (title, short line, tags)
- Each card links to `/portfolio/[slug]`

### Project Detail (`/portfolio/[slug]`)

- Hero: title, service tag, hero image
- Overview
- Problem
- Solution
- Results
- Tech Stack
- Gallery

### Contact (`/contact`)

- Heading and short trust line
- Contact form:
  - Name
  - Email
  - Startup / Company
  - What you need (Web/App/Video/AI/Not sure)
  - Budget range
  - Timeline
  - Message
- Side info: response time, location/timezone, call tools

### Apply Client (`/apply/client`)

- Heading: Apply as a client / start a project
- Short explanation of how StechX works with clients
- Form:
  - Name
  - Email
  - Startup / Company
  - Service interest (Web/App/Video/AI)
  - Budget range
  - Timeline
  - Project brief
- Trust note: what happens after you submit

### Apply Talent (`/apply/talent`)

- Heading: Join StechX as talent
- Short explanation of talent pool
- Form:
  - Name
  - Email
  - Role (Web Dev / App Dev / Video / AI)
  - Portfolio links
  - Experience / skills
  - Short note
- Trust note: how selection and projects work

## 4. Status

- STEP 1 (Brand, UX, Page Map): LOCKED
- Next: STEP 2 — Data Model & API Contract

