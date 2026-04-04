# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npx astro check   # TypeScript/Astro type checking
```

No test framework is configured.

## Architecture

This is a personal portfolio and blog built with **Astro 4** (SSG), deployed to Vercel at `santiagoavilez.com`.

### Content Collections

Content lives in `src/content/` and is typed via `src/content/config.ts`:
- `projects/` — portfolio project entries (`.mdx`)
- `blog/` — blog post entries (`.mdx`)

Both collections share the same schema: `title`, `description`, `publishDate`, `tags`, `tools[]`, `img`, optional `live`/`git` links.

### Layouts

- `BaseLayout.astro` — wraps every page; includes `Nav`, `Footer`, AOS scroll animations (initialized inline), and Vercel Analytics/Speed Insights
- `BlogLayout.astro` — extends base for blog/project detail pages

### Component Conventions

Components split by type:
- **`.astro` components** — used for layout, static sections (Hero, Nav, Footer, Grid, Skills, etc.)
- **React `.tsx` components** — used only when interactivity is needed (carousel, animated CTA, mobile nav)
- `src/components/ui/` — shadcn/ui-style primitives (button, card, carousel, sheet) using Radix UI + CVA
- `src/components/home/` — page sections organized by subdirectory (`hero/`, `services/`, `projects/`, `about/`)

### Path Aliases

Defined in `tsconfig.json`:
- `@components/*` → `src/components/*`
- `@assets/*` → `src/assets/*`
- `@lib/*` → `src/lib/*`

### Styling

Tailwind CSS with a custom `cerulean` color palette and CSS variable-based design tokens (`--border`, `--primary`, etc. via HSL). Dark mode uses the `class` strategy. Custom animations defined in `tailwind.config.cjs`: `bg-animation`, `fade-in`, `fade-out`, `zoom-in`, `zoom-out`.

Global styles in `src/styles/global.css`.

### Adding Content

To add a project or blog post, create a new `.mdx` file in `src/content/projects/` or `src/content/blog/` following the schema in `src/content/config.ts`. Images are referenced from `public/` or external URLs.
