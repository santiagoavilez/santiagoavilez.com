# SPEC: Translate All Projects to English

**Target portfolio:** santiagoavilez.com (Astro 6, MDX, Tailwind CSS v3)  
**Scope:** `/projects` listing page + 5 individual project MDX pages  
**Goal:** Every public-facing page of the site must be 100% English  

---

## Context

The homepage (`/`) is fully in English and targets international remote recruiters. The `/projects` route and all individual project pages (`/projects/*`) are still in Spanish — a completely different version of the site that wasn't updated during the redesign. Any recruiter who clicks "View all projects" from the home hits a Spanish page.

Additionally, the Glassy project page has a **copy-paste bug**: the body text refers to "Alerta Digital" throughout (a different project) instead of "Glassy". This must be fixed as part of this spec.

---

## Phase 1 — Translate the `/projects` listing page

### 1.1 File to edit

Find the file that renders `/projects`. This is likely:
```
src/pages/projects/index.astro
```
or
```
src/pages/projects.astro
```

### 1.2 Changes required

| Element | Current (ES) | Replace with (EN) |
|---|---|---|
| `<title>` | `Mis Trabajos` | `Projects \| Santiago Avilez` |
| Page heading `<h1>` | `Mis Trabajos` | `Projects` |
| Subheading/intro | `Mira mis trabajos mas recientes...` | `A selection of projects I've shipped — from MVPs to production platforms.` |
| Nav: Home link | `Inicio` | `Home` |
| Nav: Projects link | `Proyectos` | `Projects` |
| Nav: About link | `Sobre mí` | `About` |
| Footer nav links | Same as nav | Same as above |
| Footer copyright | `© 2025 Santiago Avilez` | `© {new Date().getFullYear()} Santiago Avilez` |
| Footer social links | TikTok, Instagram, LinkedIn, GitHub | LinkedIn, GitHub only (remove TikTok and Instagram) |
| CTA section heading | `¿Te interesa trabajar conmigo?` | `Open to remote roles worldwide.` |
| CTA button | `Enviame un mensaje` | `Let's connect on LinkedIn ↗` |
| CTA button href | `mailto:santiago.avilez@est.fi.uncoma.edu.ar` | `https://linkedin.com/in/santiago-avilez-ariza/` |

### 1.3 Project card descriptions (in the listing grid)

Each card in `/projects` has a Spanish description. Replace with the following:

**AMCumbre.com**
```
Radio and TV streaming platform for a regional media outlet in Neuquén. Built and optimized for live broadcast delivery.
```

**Glassy**
```
Web performance and SEO optimization for Glassy Europe, a surf and casual fashion ecommerce brand. Improved Lighthouse score to 98/100 through image optimization, asset minification, and responsive design improvements.
```

**Alerta Digital**
```
Web performance and SEO optimization for an independent news platform. Improved Lighthouse score to 96/100 and increased organic traffic through a full SEO audit and load speed improvements.
```

**IEIA**
```
Landing page for the Instituto Empresarial de Inteligencia Artificial — a modern, conversion-focused design showcasing the institute's AI business courses and programs.
```

**Melina Batalla**
```
Online course platform for a digital creator with an audience across Latin America. Built with Astro and React, integrated Mercado Pago and Lemon Squeezy for dual-market payments, and served course content from DailyMotion via a SQL-backed enrollment system.
```

**Solucionado App**
```
MVP for a tech startup connecting domestic service providers with clients. Led a team of three, selected the stack (Next.js, TypeScript, tRPC, Prisma), and shipped end-to-end — from requirements to production.
```

**Laborar**
```
Freelance marketplace platform connecting domestic workers and professionals with clients. Built a real-time chat system using Socket.io and a peer-to-peer review system on top of a Next.js frontend and Strapi headless CMS backend.
```

**Unco Activa**
```
Designed, built, and deployed a registration platform for a university running event celebrating the 50th anniversary of Universidad del Comahue. Built with React, Laravel REST API, and Tailwind CSS — configured and deployed on the university's own server.
```

> **After completing the booking-platform spec:** Add the booking-platform card to this listing as well.

---

## Phase 2 — Translate individual project MDX pages

Each of the 5 MDX files below has its body content in Spanish. The intro/description line at the top of each page is already in English (it comes from the frontmatter `description` field). Only the **body content** needs to be replaced.

Do not change:
- The page layout/component
- The frontmatter fields (unless explicitly noted)
- The tech stack badges section
- The cover image
- The "Interested in working together?" footer CTA (already in English)

---

### 2.1 `solucionado.mdx`

**File:** `src/content/projects/solucionado.mdx`

**Update frontmatter title tag (browser tab):**
Verify `title` in frontmatter is `"Solucionado App"` — leave as-is.

**Replace body content with:**

```mdx
## Overview

Solucionado App is an MVP built for a tech startup that connects domestic service providers — cleaners, plumbers, electricians — with clients looking to hire them quickly and safely.

I led a team of three developers, managed the client relationship directly, and made the call on the tech stack: Next.js, TypeScript, tRPC, Tailwind CSS, shadcn/ui, and Prisma. The bet was on a modern, type-safe full-stack setup that could move fast without accumulating debt.

[Live site ↗](https://solucionado.com.ar) · [GitHub ↗](https://github.com/solucionado-app/solucionado-app)

## My Role

**Project Lead & Full Stack Developer.** Beyond writing code, I ran the requirements process directly with the client — translating product goals into a prioritized feature list, breaking them into tasks for the team, and running feedback cycles throughout the build.

## Technical Highlights

- **Auth:** Clerk for secure, managed user authentication — no rolling our own JWT logic in an MVP timeline
- **Payments:** Mercado Pago for in-app transactions between clients and service providers
- **Image handling:** Cloudinary for upload, storage, and optimization of provider profile photos
- **Messaging:** Twilio (WhatsApp) for direct client-provider communication
- **Email:** Mailersend for transactional notifications

## Outcome

Delivered a fully functional MVP on time. The client — Francisco Maldonado — was satisfied with both the quality and the pace of delivery. The architecture was designed to be extended post-MVP without requiring a rewrite.
```

---

### 2.2 `melina-batalla.mdx`

**File:** `src/content/projects/melina-batalla.mdx`

**Replace body content with:**

```mdx
## Overview

Melina Batalla is a digital creator and entrepreneur who teaches marketing and social media through online courses. She needed a platform to sell and deliver her courses — with a clean landing page, integrated payments, and a way to serve video content without paying for dedicated video hosting.

[Live site ↗](https://melina-batalla.vercel.app/cursos/root-program) · [GitHub ↗](https://github.com/santiagoavilez/MelinaBatalla)

## Approach

I used Astro for the landing and course pages — static output, fast by default, good for SEO. React handled the interactive parts. For the data layer, I used Astro DB (a SQL-backed solution) to manage enrollments and gate course content.

The design started with paper prototypes, moved to a Figma wireframe for client approval, and then into implementation. The whole data model was designed before writing a line of code: users, enrollments, and course access.

## Technical Highlights

- **Payments:** Dual payment gateway — Mercado Pago for Argentina, Lemon Squeezy for international buyers
- **Video delivery:** Course lessons served directly from DailyMotion, bypassing the need for a separate video hosting backend
- **Enrollment system:** SQL-backed access control — users only see content they've paid for
- **Responsive design:** Built mobile-first, since the majority of the audience accesses via phone

## Outcome

The platform launched with a single course and was designed to scale to additional courses without architectural changes. The dual payment setup allowed Melina to sell to her full Latin American audience without losing international buyers to payment friction.
```

---

### 2.3 `laborar.mdx`

**File:** `src/content/projects/laborar.mdx`

**Replace body content with:**

```mdx
## Overview

Laborar is a freelance marketplace connecting domestic workers and independent professionals — plumbers, electricians, cleaners — with clients who need to hire them. The project started from a real frustration: I had a burst pipe at home and couldn't find a plumber anywhere online.

At the time I was finishing my degree, and the final project was open-topic. I treated the problem as the brief.

[Live site ↗](https://laborar.vercel.app) · [GitHub ↗](https://github.com/lavorar/lavorar)

## Design Process

I started with paper prototypes to sketch the core user flows before touching any tools. Then I designed the data model (users, services, reviews), and built out the UI/UX in Figma. Having a working wireframe before writing code kept the scope clear throughout development.

## Stack & Technical Decisions

**Frontend:** Next.js with Tailwind CSS. SSR for provider profiles (fast load, good SEO), static generation for category pages. Tailwind's utility classes made responsive design fast to iterate on.

**Backend:** Strapi as a headless CMS and REST API. It let me stand up a backend quickly and focus on frontend complexity. The tradeoff was limited WebSocket documentation — integrating Socket.io with Strapi required some research.

**Real-time chat:** Built with Socket.io. Features include live message delivery, typing indicators, read receipts, and a persistent message history stored in the database. Providers also receive real-time notifications when a client contacts them or leaves a review.

**Search:** Algolia powers the service search — instant results, filterable by category and location.

**Infrastructure:** Backend and database deployed on Railway (automated deploys from GitHub).

## Outcome

Shipped a full-featured marketplace as a solo developer for my final degree project. The real-time chat and review systems were the most technically demanding parts and ended up working reliably in production.
```

---

### 2.4 `unco-activa.mdx`

**File:** `src/content/projects/unco-activa.mdx`

**Replace body content with:**

```mdx
## Overview

Unco Activa was a registration and event platform built for a university running race celebrating the 50th anniversary of Universidad del Comahue. The site needed to handle public event information, race registration, and live participant data — and it had to be deployed on the university's own server.

[Live site ↗](https://uncoactiva.fi.uncoma.edu.ar) · [GitHub ↗](https://github.com/Unco-Activa/Unco-Activa)

## Context

This was an internship project in collaboration between the Faculty of Sports and the Faculty of Computer Science. I worked alongside a classmate, under supervision from both faculties. The visual identity was provided by an external designer — our job was to implement it as a functional web application.

## Stack & Decisions

The tech stack had to fit the university's existing server, which we configured from scratch: PHP 8.6, Node.js v16, and MySQL. Server configuration was new territory for me at the time, but we got it running with help from a faculty contact.

**Backend:** Laravel as a REST API. Heavier than strictly necessary for a project this size, but it was a framework I knew well — which reduced risk on a project with an external client and a real deadline.

**Frontend:** React with Tailwind CSS. Mobile-first by design — the majority of registrants accessed the site from their phones. Tailwind made responsive layout fast to implement and easy to adjust based on client feedback.

## Design Process

We built prototypes in Figma first, using the provided visual identity as a base, and got client sign-off before writing any code. This kept the feedback loop short and avoided rework during development.

## Outcome

The platform went live in time for the event. Registrations were collected and managed successfully through the system. The university's server held up throughout the event period.
```

---

### 2.5 `glassy.mdx`

**File:** `src/content/projects/glassy.mdx`

> ⚠️ **Critical bug:** The current body text refers to "Alerta Digital" throughout — this is a copy-paste error from a different project. The entire body must be replaced.

**Replace body content with:**

```mdx
## Overview

Glassy Europe is a surf and casual fashion ecommerce brand with a commitment to environmental responsibility and action sports. They needed their existing WordPress site improved — faster, better SEO, and extended with new sections — without a full rebuild.

[Live site ↗](https://glassyeurope.com)

## What I Did

This was an optimization and extension engagement, not a greenfield build. I audited the existing site, identified the highest-impact changes, and executed them:

- **Performance:** Compressed and converted images, deferred non-critical scripts, minified CSS/JS assets, and improved Core Web Vitals across mobile and desktop
- **SEO:** Full audit — meta tags, structured data, internal linking, heading hierarchy, and sitemap configuration
- **New sections:** Designed and built additional page sections to improve navigation flow and brand storytelling
- **Responsive improvements:** Fixed layout issues on mobile and tablet that were hurting both UX and SEO rankings
- **Social integration:** Added share buttons and social widgets to increase content reach
- **Analytics:** Configured Google Analytics to track traffic sources, user behavior, and conversion events
- **Social publishing automation:** Set up automated social media post scheduling to keep the brand active online without manual effort

## Outcome

After the improvements, the site reached a **98/100 score on Google Lighthouse** — up from a significantly lower baseline. Organic traffic increased following the SEO improvements, and page load times dropped substantially on both mobile and desktop.
```

---

## Phase 3 — Fix remaining layout-level Spanish strings

These are UI strings in layouts or components (not MDX content) that may still be in Spanish.

### 3.1 Tags/categories on project pages

Some project pages show category tags like:
- `Desarrollo web`
- `Diseño web`
- `Branding`
- `Optimización web`

These appear to come from frontmatter (e.g., `category: ["Desarrollo web", "Diseño web"]`). Update the frontmatter values for each project:

| Project | Current | Replace with |
|---|---|---|
| Solucionado | `Desarrollo web, Diseño web, Branding` | `Full Stack, Product` |
| Melina Batalla | `Desarrollo web, Diseño web, Branding` | `Full Stack, Product` |
| Laborar | `Desarrollo web, Diseño web, Branding` | `Full Stack, Product` |
| Unco Activa | `Diseño Web, Desarrollo Web` | `Full Stack` |
| Glassy | `Optimización web, Desarrollo web` | `Performance, SEO` |

### 3.2 `/projects` footer

The `/projects` listing page still shows (confirmed by fetch):
- `© 2025 Santiago Avilez` → fix to dynamic year
- TikTok and Instagram social links → remove
- Email CTA pointing to `santiago.avilez@est.fi.uncoma.edu.ar` → replace with LinkedIn CTA

This was covered in Phase 1 but calling it out again explicitly — it's a separate template from the project detail pages.

---

## Phase 4 — Verification checklist

Run through every page after implementation:

### `/projects` listing page
- [ ] Page title in browser tab: `Projects | Santiago Avilez`
- [ ] `<h1>` reads "Projects" (not "Mis Trabajos")
- [ ] Nav is fully in English
- [ ] All card descriptions are in English
- [ ] Footer shows LinkedIn + GitHub only (no TikTok, no Instagram)
- [ ] Footer copyright year is dynamic
- [ ] CTA links to LinkedIn, not to student email

### `/projects/solucionado`
- [ ] Body content is in English
- [ ] No Spanish text visible anywhere on the page
- [ ] Category tags are in English

### `/projects/melina-batalla`
- [ ] Body content is in English
- [ ] No Spanish text visible anywhere on the page
- [ ] Category tags are in English

### `/projects/laborar`
- [ ] Body content is in English
- [ ] No Spanish text visible anywhere on the page
- [ ] Category tags are in English

### `/projects/unco-activa`
- [ ] Body content is in English
- [ ] No Spanish text visible anywhere on the page
- [ ] Category tags are in English

### `/projects/glassy`
- [ ] Body content is in English
- [ ] Zero references to "Alerta Digital" (use browser Find to confirm)
- [ ] Category tags are in English

### All project pages
- [ ] "Interested in working together?" CTA is present and links to correct email (`santiagoavilezdev@gmail.com`)
- [ ] Footer copyright year is correct
- [ ] No hardcoded `2025` anywhere

---

## Out of scope for this spec

- `/projects/amcumbre`, `/projects/alerta-digital`, `/projects/ieia` — these are lower-traffic pages that appear only in the full `/projects` listing (not on the homepage). Card descriptions are translated in Phase 1. Individual page bodies can be translated in a follow-up spec if needed.
- Booking Platform listing card in `/projects` — handled after `spec-add-booking-platform.md` is merged.