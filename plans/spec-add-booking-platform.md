# SPEC: Add Booking Platform to Portfolio

**Target portfolio:** santiagoavilez.com (Astro 6, MDX, Tailwind CSS v3)  
**Repos:** `santiagoavilez/booking-platform-api` + `santiagoavilez/booking-platform-web`  
**Section placement:** "Other Work" grid on homepage + new MDX project page at `/projects/booking-platform`  
**Priority:** Medium — architecture showcase, not a product demo

---

## Context & Framing

This project is **not** presented as a product with users. It's presented as a **technical architecture showcase** — the goal is to demonstrate Clean Architecture, CI/CD discipline, testing, and engineering judgment. The README in the API repo (with technical decision rationale) is the strongest signal, and the project page should reflect that.

---

## Phase 1 — Create the MDX project page

### 1.1 File to create

```
src/content/projects/booking-platform.mdx
```

### 1.2 Frontmatter

```mdx
---
title: "Booking Platform"
description: "Calendly-inspired scheduling system built as an architecture showcase — Clean Architecture, NestJS, CI/CD with CircleCI, and ~90% test coverage."
date: 2024-01-01
tags: ["TypeScript", "NestJS", "React", "PostgreSQL", "Drizzle", "Docker", "CircleCI"]
featured: false
cover: "/images/projects/booking-platform-cover.png"
liveUrl: ""
githubUrl: "https://github.com/santiagoavilez/booking-platform-api"
githubUrlWeb: "https://github.com/santiagoavilez/booking-platform-web"
role: "Solo Engineer"
---
```

> **Note on cover image:** Use a clean architecture diagram or a neutral dark code screenshot. If no image is available yet, use the same placeholder mechanism as other projects and add a TODO comment. Do not leave a broken image.

### 1.3 Page body (English, production-ready)

Write the following content in the MDX file. Do not change the wording — it has been written deliberately to position the project correctly.

---

```mdx
## Overview

A Calendly-inspired appointment scheduling system built across two repositories — a NestJS REST API and a React frontend. The goal wasn't to compete with Calendly in the market; it was to build a real-world domain problem from scratch using proper engineering practices, then document every decision.

The result: Clean Architecture applied end-to-end, ~90% test coverage enforced by CI, Docker environments for dev/test/prod, and a README that explains _why_ each technical choice was made — not just what was chosen.

[API Repository ↗](https://github.com/santiagoavilez/booking-platform-api) · [Web Repository ↗](https://github.com/santiagoavilez/booking-platform-web)

## Architecture

The API follows Clean Architecture with a strict 4-layer separation:

| Layer | Responsibility |
|---|---|
| `domain/` | Framework-agnostic entities, enums, and service interfaces |
| `application/` | Use cases — pure business logic with no infrastructure dependencies |
| `infrastructure/` | Drizzle ORM, PostgreSQL, external services |
| `interfaces/` | NestJS controllers, HTTP adapters |

This separation means the domain layer has zero dependencies on NestJS, Drizzle, or anything external. Use cases depend only on interfaces (repository contracts), making them fully testable by swapping in mocks — no database required for unit tests.

## Technical Decisions

Every major choice in this project was documented with explicit rationale:

**NestJS over Express/Fastify** — Built-in dependency injection, guards, interceptors, and pipes enforce consistent patterns at scale. The modular architecture maps directly to Clean Architecture modules, which isn't the case with Express.

**Drizzle over Prisma/TypeORM** — SQL-like query API gives more control over complex queries without abstraction overhead. Lower runtime cost and smaller bundle than Prisma, and better TypeScript inference than TypeORM.

**Clean Architecture over layered MVC** — The domain layer is framework-independent and portable. Swapping ORMs or HTTP frameworks only requires changes in the infrastructure layer. This matters in fast-moving environments where requirements and tooling change.

## CI/CD & Testing

- **CircleCI** pipeline runs on every push to `main`
- **Unit + E2E tests** isolated in a Docker test environment (`docker-compose.test.yml`)
- **~90% test coverage** tracked via Coveralls
- Three Docker Compose configurations: `dev` (hot reload), `test` (isolated), `prod` (production build)

The test environment spins up a dedicated PostgreSQL container, so tests never touch the dev database and can run fully reproducibly in any environment.

## What I Learned

Building a domain that already has a mature solution (Calendly) forced good architectural decisions early — there was no excuse to cut corners because the domain is well-understood. It was a useful constraint: you know exactly what the system _should_ do, so you can focus entirely on _how_ it's built.
```

---

## Phase 2 — Add card to homepage "Other Work" grid

### 2.1 Locate the homepage projects data

Find where the "Other Work" project cards are defined. This is either:
- A frontmatter collection in `src/content/projects/`
- A hardcoded array in the homepage `.astro` file
- A shared data file (e.g., `src/data/projects.ts`)

Inspect the existing "Other Work" cards (Solucionado, Melina Batalla, Laborar, Unco Activa, Glassy) to confirm the data source.

### 2.2 Card data to add

```ts
{
  title: "Booking Platform",
  description: "Calendly-inspired scheduling system. Clean Architecture, NestJS, ~90% test coverage with CircleCI, and full Docker setup across dev/test/prod environments.",
  tags: ["TypeScript", "NestJS", "React", "PostgreSQL", "Drizzle", "Docker"],
  href: "/projects/booking-platform",
  githubUrl: "https://github.com/santiagoavilez/booking-platform-api",
  cover: "/images/projects/booking-platform-cover.png",
  featured: false,
  publishDate: 2026-02-01 00:00:00
}
```

### 2.3 Placement

Insert as the **first card** in the "Other Work" section — it's the strongest technical piece in that group.

### 2.4 GitHub link behavior

The card should show a GitHub link (same as Melina Batalla and Laborar currently show). No "Live Preview" link — there's no deployed frontend URL.

---

## Phase 3 — Cover image
 `src/assets/previews/booking-platform-preview.webp`

---

## Phase 4 — Verify

- [ ] `/projects/booking-platform` renders without errors
- [ ] Cover image loads
- [ ] Both GitHub links open correctly (API repo + Web repo)
- [ ] Card appears in the "Other Work" grid on homepage
- [ ] Card has no "Live Preview" button (there's no deployed URL)
- [ ] Tags match the existing tag component format used by other "Other Work" cards
- [ ] Page title in browser tab reads "Booking Platform | Santiago Avilez"
- [ ] MDX prose renders correctly (no raw markdown visible)

---

## Out of scope for this spec

- Deploying a live demo of the booking platform
- Adding it to the `/projects` listing page (that page is being translated in a separate spec — add it there after this spec is merged)