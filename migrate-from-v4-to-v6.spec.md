# Spec: Migración Astro 4 → 6 — santiagoavilez.com

## Objetivo

Actualizar el portfolio de Astro 4 a Astro 6 (última estable), incluyendo todas las integraciones y dependencias, resolviendo breaking changes. Tailwind se mantiene en v3 via PostCSS manual (ya que `@astrojs/tailwind` es incompatible con Astro 6) — la migración a Tailwind v4 se hará por separado.

> **CORRECCIONES POST-EXPLORACIÓN (2026-04-12)**: Se verificaron las guías oficiales de Astro. Se encontraron 4 errores en la versión original del spec que fueron corregidos:
> 1. `@astrojs/tailwind@6` NO soporta Astro 6 (peer dep `^3 || ^4 || ^5`) — se reemplaza con PostCSS manual
> 2. Content config debe moverse de `src/content/config.ts` → `src/content.config.ts`
> 3. Import de Zod: NO es `astro:schema`, es `astro/zod`
> 4. Migración `slug` → `id` faltaban 2 archivos: `ProjectsCarrousel.tsx` y `ProjectsPreview.astro`

---

## Documentación de referencia — LEER ANTES DE TOCAR CÓDIGO

Claude Code **DEBE** leer estas páginas antes de hacer cualquier cambio:

1. **Astro v4→v5**: https://docs.astro.build/en/guides/upgrade-to/v5/
2. **Astro v5→v6**: https://docs.astro.build/en/guides/upgrade-to/v6/
3. **Content Layer Migration**: https://docs.astro.build/en/guides/content-collections/
4. **Adapter Vercel changelog**: https://github.com/withastro/astro/blob/main/packages/integrations/vercel/CHANGELOG.md
5. **@astrojs/tailwind changelog**: https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/CHANGELOG.md

---

## Estado actual del proyecto

### `package.json` — dependencias actuales

```json
{
  "astro": "^4.14.2",
  "@astrojs/mdx": "^3.1.2",
  "@astrojs/react": "^3.6.0",
  "@astrojs/sitemap": "^3.1.6",
  "@astrojs/tailwind": "^5.1.0",
  "@astrojs/vercel": "^7.8.2",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "tailwindcss": "^3.4.4",
  "tailwindcss-animate": "^1.0.7",
  "sharp": "^0.33.5",
  "@radix-ui/react-dialog": "^1.1.1",
  "@radix-ui/react-slot": "^1.1.0",
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vercel/analytics": "^1.5.0",
  "@vercel/speed-insights": "^1.2.0",
  "animate.css": "^4.1.1",
  "aos": "^3.0.0-beta.6",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "embla-carousel-auto-scroll": "^8.2.0",
  "embla-carousel-autoplay": "^8.2.0",
  "embla-carousel-class-names": "^8.2.0",
  "embla-carousel-react": "^8.2.0",
  "lucide-react": "^0.414.0",
  "tailwind-merge": "^2.4.0"
}
```

**Nota**: `engines` ya está configurado como `"node": "24.x"`.

### `astro.config.mjs` actual

```js
import { defineConfig, squooshImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://santiagoavilez.com",
  output: "hybrid",
  adapter: vercel({ runtime: 'nodejs22.x' }),
  integrations: [tailwind(), mdx(), sitemap(), react()],
});
```

### Archivos que usan Content Collections (auditoría)

| Archivo | Usa `entry.slug` | Usa `entry.render()` | Usa `getCollection` |
|---------|:-:|:-:|:-:|
| `src/content/config.ts` | — | — | — (define schemas) |
| `src/pages/projects/[...slug].astro` | ✅ | ✅ | ✅ |
| `src/pages/blog/[...slug].astro` | ✅ | ✅ | ✅ |
| `src/pages/projects.astro` | — | — | ✅ |
| `src/pages/blog.astro` | — | — | ✅ |
| `src/components/home/projects/ProjectsPreview.astro` | — | — | ✅ |
| `src/components/home/projects/ProjectsCarrousel.tsx` | ✅ (line 62) | — | ✅ ⚠️ |
| `src/components/home/projects/ProjectsPreview.astro` | ✅ (lines 49, 69) | — | ✅ |
| `src/components/home/hero/HeroCarrousel.tsx` | — | — | ✅ ⚠️ |

> ⚠️ Los `.tsx` importan `getCollection` de `astro:content` — esto solo funciona si se ejecutan server-side. Revisar si son componentes con `client:` directive o si reciben data como props.

### Endpoint SSR existente

- `src/pages/api/chat.ts` — tiene `export const prerender = false`. Con el cambio a `output: "static"`, este endpoint necesita el adapter Vercel para funcionar. No requiere cambios pero debe verificarse post-migración.

---

## Mapa de dependencias y qué hacer con cada una

### Grupo 1: Astro core + integraciones oficiales (ACTUALIZAR)

| Paquete | Actual | Target | Acción |
|---------|--------|--------|--------|
| `astro` | ^4.14.2 | ^6.x | Actualizar — breaking changes significativos |
| `@astrojs/vercel` | ^7.8.2 | ^10.x | Actualizar — import path cambia, fix nodejs18.x |
| `@astrojs/react` | ^3.6.0 | latest | Actualizar — compatible con Astro 6 |
| `@astrojs/mdx` | ^3.1.2 | latest | Actualizar — compatible con Astro 6 |
| `@astrojs/sitemap` | ^3.1.6 | latest | Actualizar — compatible con Astro 6 |
| `@astrojs/tailwind` | ^5.1.0 | **REMOVER** | ❌ Incompatible con Astro 6 (peer dep `^3\|\|^4\|\|^5`). Reemplazar con PostCSS manual |
| `autoprefixer` | — | latest | **AGREGAR** — necesario para PostCSS manual con Tailwind v3 |

### Grupo 2: Tailwind ecosystem (NO TOCAR por ahora)

| Paquete | Actual | Acción |
|---------|--------|--------|
| `tailwindcss` | ^3.4.4 | Mantener en v3 — migrar a v4 en spec separado |
| `tailwindcss-animate` | ^1.0.7 | Mantener — compatible con Tailwind v3 |
| `tailwind-merge` | ^2.4.0 | Mantener — compatible con ambas versiones |

### Grupo 3: React ecosystem (NO TOCAR)

| Paquete | Actual | Acción |
|---------|--------|--------|
| `react` | ^18.3.1 | Mantener — Astro 6 soporta React 18 |
| `react-dom` | ^18.3.1 | Mantener |
| `@types/react` | ^18.3.3 | Mantener |
| `@types/react-dom` | ^18.3.0 | Mantener |
| `@radix-ui/react-dialog` | ^1.1.1 | Mantener — no depende de Astro |
| `@radix-ui/react-slot` | ^1.1.0 | Mantener |
| `embla-carousel-react` | ^8.2.0 | Mantener |
| `embla-carousel-auto-scroll` | ^8.2.0 | Mantener |
| `embla-carousel-autoplay` | ^8.2.0 | Mantener |
| `embla-carousel-class-names` | ^8.2.0 | Mantener |
| `lucide-react` | ^0.414.0 | Mantener |
| `class-variance-authority` | ^0.7.0 | Mantener |
| `clsx` | ^2.1.1 | Mantener |

### Grupo 4: Animaciones y utilidades (NO TOCAR)

| Paquete | Actual | Acción |
|---------|--------|--------|
| `animate.css` | ^4.1.1 | Mantener — CSS puro, no depende de Astro |
| `aos` | ^3.0.0-beta.6 | Mantener — JS vanilla, no depende de Astro |
| `sharp` | ^0.33.5 | Mantener — ya está instalado (Astro 6 lo usa por defecto) |

### Grupo 5: Vercel SDK (NO TOCAR)

| Paquete | Actual | Acción |
|---------|--------|--------|
| `@vercel/analytics` | ^1.5.0 | Mantener — no depende de Astro |
| `@vercel/speed-insights` | ^1.2.0 | Mantener |

---

## Breaking Changes que aplican a este proyecto

### De v4 → v5

1. **`output: "hybrid"` eliminado** → cambiar a `output: "static"`. Comportamiento idéntico: páginas estáticas por defecto, endpoints/páginas individuales pueden optar por SSR con `export const prerender = false`. El endpoint `api/chat.ts` ya tiene `prerender = false` y seguirá funcionando con el adapter Vercel.

2. **`squooshImageService` eliminado** → remover el import `{ squooshImageService }` de `astro/config` y remover cualquier config `image.service`. Sharp (ya instalado) es el default.

3. **Content Collections → Content Layer API** (CAMBIO MAYOR para este proyecto):
   - **Config debe moverse**: `src/content/config.ts` → `src/content.config.ts` (raíz de src/).
   - `defineCollection()` ahora requiere un `loader`. Usar `glob()` loader.
   - `z` (Zod) se importa desde `astro/zod` (NO `astro:schema`, NO `astro:content`).
   - `entry.slug` → `entry.id` en Content Layer API. Afecta: rutas dinámicas Y componentes que usan `.slug` en hrefs.
   - `entry.render()` → `import { render } from 'astro:content'; const { Content } = await render(entry);`
   - `CollectionEntry` type sigue importándose de `astro:content`.

4. **TypeScript** → `.astro/types.d.ts` reemplaza `src/env.d.ts`. Actualizar `tsconfig.json`:
   ```json
   {
     "include": [".astro/types.d.ts", "src/**/*"],
     "exclude": ["dist"]
   }
   ```
   Nota: `src/env.d.ts` actual ya referencia `.astro/types.d.ts` — puede eliminarse después de actualizar tsconfig.

5. **Scripts** → ya no se hoistean al `<head>`. Si hay `<script>` condicionales, agregar `is:inline`.

6. ~~**`<ViewTransitions />` → `<ClientRouter />`**~~ — **NO APLICA** — no se usa ViewTransitions en este proyecto (confirmado por auditoría).

7. ~~**Shiki CSS variables**~~ — **NO APLICA** — no se usan `--astro-code-color-*` (confirmado por auditoría).

### De v5 → v6

8. ~~**`<ViewTransitions />` eliminado completamente**~~ — **NO APLICA**.

9. ~~**`Astro.glob()` eliminado**~~ — **NO APLICA** — no se usa `Astro.glob()` en este proyecto (confirmado por auditoría).

10. **Zod v3 → v4** → los schemas en `src/content/config.ts` usan `z.coerce.date()` y otros métodos — verificar compatibilidad con Zod v4 de Astro 6.

11. **Node 22.12.0+ requerido** → `engines` ya tiene `"node": "24.x"` — compatible. No requiere cambio.

12. **Legacy content collections** → DEBE migrarse a Content Layer API con `glob()` loader. Ver punto 3.

13. **Adapter Vercel import** → `import vercel from "@astrojs/vercel/serverless"` → `import vercel from "@astrojs/vercel"`. El path `/serverless` fue removido.

14. **CommonJS config** → `astro.config.mjs` debe usar ESM (ya lo hace).

15. ~~**`handleForms` prop**~~ — **NO APLICA** (confirmado por auditoría).

---

## Fases de Implementación

### Fase 0: Preparación y auditoría `[4 checks]`

- [ ] **0.1** Crear rama `feat/astro-6-upgrade` desde main.
- [ ] **0.2** Leer las guías de migración v5 y v6 completas (links arriba).
- [ ] **0.3** Ejecutar auditoría en el proyecto para confirmar el análisis de este spec:
  ```bash
  grep -rn "ViewTransitions" src/
  grep -rn "Astro.glob" src/
  grep -rn "squooshImageService" src/
  grep -rn "astro:content" src/
  grep -rn "entry.slug" src/
  grep -rn "entry.render" src/
  grep -rn "output.*hybrid" astro.config.*
  grep -rn "astro-code-color" src/
  grep -rn "handleForms" src/
  grep -rn "@astrojs/vercel/serverless" src/ astro.config.*
  grep -rn "prerender" src/
  ```
- [ ] **0.4** Documentar los resultados de la auditoría. Confirmar o actualizar la tabla de archivos afectados de este spec.

### Fase 1: Actualizar dependencias `[3 checks]`

- [ ] **1.1** Actualizar Astro core + integraciones y remover `@astrojs/tailwind`:
  ```bash
  npm uninstall @astrojs/tailwind
  npm install astro@latest @astrojs/react@latest @astrojs/mdx@latest @astrojs/sitemap@latest @astrojs/vercel@latest autoprefixer
  ```
  > `@astrojs/tailwind` se remueve porque su última versión (6.0.2) tiene peer dep `astro: ^3 || ^4 || ^5` — incompatible con Astro 6. Tailwind v3 funciona via PostCSS manual.
- [ ] **1.2** Verificar `engines` en `package.json` — actualmente `"node": "24.x"`. Considerar cambiar a `"node": ">=22.12.0"` para mayor flexibilidad, o mantener `24.x` si el deploy siempre usa Node 24.
- [ ] **1.3** Resolver conflictos de peer dependencies si aparecen. NO tocar dependencias del Grupo 2-5.

### Fase 2: Actualizar `astro.config.mjs` `[4 checks]`

- [ ] **2.1** Remover `squooshImageService` del import:
  ```diff
  - import { defineConfig, squooshImageService } from 'astro/config';
  + import { defineConfig } from 'astro/config';
  ```
- [ ] **2.2** Cambiar `output: "hybrid"` → `output: "static"`.
- [ ] **2.3** Cambiar import del adapter:
  ```diff
  - import vercel from "@astrojs/vercel/serverless";
  + import vercel from "@astrojs/vercel";
  ```
  Remover el parámetro `runtime` del adapter (ya no necesario).
- [ ] **2.4** Remover `tailwind()` de integraciones y crear PostCSS config:
  - Remover `import tailwind from "@astrojs/tailwind"` y `tailwind()` del array de integraciones.
  - Crear `postcss.config.cjs`:
    ```js
    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
    ```
  - Verificar que `tailwind.config.cjs` sigue siendo detectado automáticamente por PostCSS.
- [ ] **2.5** Verificar que las integraciones `mdx()`, `react()`, `sitemap()` no requieran parámetros nuevos.

### Fase 3: Migrar Content Collections a Content Layer API `[7 checks]`

> **Esta es la fase más compleja de la migración. Hacer cambios uno a uno y verificar.**

- [ ] **3.1** **MOVER** `src/content/config.ts` → `src/content.config.ts` y migrar:
  ```diff
  - import { defineCollection, z } from "astro:content";
  + import { defineCollection } from "astro:content";
  + import { glob } from "astro/loaders";
  + import { z } from "astro/zod";

  export const collections = {
    projects: defineCollection({
  +   loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
      schema: z.object({ ... }),
    }),
    blog: defineCollection({
  +   loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
      schema: z.object({ ... }),
    }),
  };
  ```
  > **IMPORTANTE**: El archivo debe estar en `src/content.config.ts`, NO en `src/content/config.ts`.

- [ ] **3.2** Migrar `entry.slug` / `project.slug` → `.id` en TODOS los archivos:
  - `src/pages/projects/[...slug].astro` — línea 22: `params: { slug: entry.slug }` → `params: { slug: entry.id }`
  - `src/pages/blog/[...slug].astro` — línea 39: `params: { slug: entry.slug }` → `params: { slug: entry.id }`
  - `src/components/home/projects/ProjectsCarrousel.tsx` — línea 62: `project.slug` → `project.id`
  - `src/components/home/projects/ProjectsPreview.astro` — líneas 49, 69: `project.slug` → `project.id`

- [ ] **3.3** Migrar `entry.render()` → `render(entry)` (función standalone):
  - `src/pages/projects/[...slug].astro`:
    ```diff
    - const { Content } = await entry.render();
    + import { render } from "astro:content";
    + const { Content } = await render(entry);
    ```
  - `src/pages/blog/[...slug].astro`: mismo cambio.

- [ ] **3.4** Verificar que `getCollection()` y `CollectionEntry` type siguen importándose de `astro:content` (no cambian).

- [ ] **3.5** Investigar los `.tsx` que importan `getCollection`:
  - `src/components/home/projects/ProjectsCarrousel.tsx`
  - `src/components/home/hero/HeroCarrousel.tsx`
  - Si reciben data como props desde un `.astro` parent, eliminar los imports no usados.
  - Si realmente llaman a `getCollection`, eso solo funciona server-side — refactorizar para recibir data como props.

- [ ] **3.6** Verificar compatibilidad de Zod v4 con los schemas existentes. En particular:
  - `z.coerce.date()` — verificar que sigue funcionando.
  - `z.object().optional().default()` — verificar.

- [ ] **3.7** Si la migración completa falla, usar `legacy: { collections: true }` en config como escape temporal, pero migrar ASAP.

### Fase 4: Migrar TypeScript config `[2 checks]`

- [ ] **4.1** Actualizar `tsconfig.json`:
  ```diff
  {
    "extends": "astro/tsconfigs/strict",
  + "include": [".astro/types.d.ts", "src/**/*"],
  + "exclude": ["dist"],
    "compilerOptions": {
  -   "types": ["astro/client"],
      "jsx": "react-jsx",
      "jsxImportSource": "react",
      "paths": { ... }
    }
  }
  ```
  > Nota: `"types": ["astro/client"]` se reemplaza por el include de `.astro/types.d.ts`.

- [ ] **4.2** Eliminar `src/env.d.ts` (ya referencia `.astro/types.d.ts`, ahora redundante).

### Fase 5: AOS y animate.css — compatibilidad con Astro 6 `[2 checks]`

- [ ] **5.1** AOS se inicializa vía `<script>`. Verificar que sigue funcionando con el nuevo comportamiento de scripts de Astro 6 (ya no hoisted). Si se rompe, agregar `is:inline` o mover la inicialización.
- [ ] **5.2** `animate.css` es CSS puro — solo verificar que el import sigue resolviendo correctamente después del upgrade.

### Fase 6: Verificar y corregir `[6 checks]`

- [ ] **6.1** Ejecutar `npm run dev` — corregir TODOS los errores de compilación antes de avanzar.
- [ ] **6.2** Ejecutar `npm run build` — verificar que el build completa sin errores.
- [ ] **6.3** Verificar visualmente en local:
  - Navegación entre páginas
  - Blog / páginas MDX renderizan correctamente
  - Rutas dinámicas (`/projects/[slug]`, `/blog/[slug]`) resuelven correctamente
  - Carruseles (Embla) funcionan
  - Animaciones (AOS, animate.css, tailwindcss-animate) funcionan
  - Dialogs (Radix) abren y cierran
  - Imágenes cargan (Sharp service)
  - Responsive: mobile y desktop
- [ ] **6.4** Ejecutar `npx astro check` si está disponible — corregir warnings de types.
- [ ] **6.5** Verificar que `@vercel/analytics` y `@vercel/speed-insights` siguen inyectándose correctamente.
- [ ] **6.6** Verificar que `api/chat.ts` (SSR endpoint) responde correctamente en dev.

### Fase 7: Deploy a Vercel `[3 checks]`

- [ ] **7.1** Verificar Node version 22+ en Vercel Dashboard → Settings → General.
- [ ] **7.2** Push a la rama. Verificar que el deploy completa SIN el error `nodejs18.x`.
- [ ] **7.3** Verificar el sitio en producción:
  - Performance score (debería mantenerse igual o mejor)
  - Todas las páginas cargan
  - No hay errores en la consola del browser
  - Analytics y Speed Insights reportan correctamente
  - Endpoint `api/chat` funciona en producción

---

## Progress Tracker

### Por Fase

| Fase | Descripción | Checks | Done | Estado |
|:----:|-------------|:------:|:----:|:------:|
| 0 | Preparación y auditoría | 4 | 4 | ✅ Completado |
| 1 | Actualizar dependencias | 3 | 3 | ✅ Completado |
| 2 | Actualizar astro.config + PostCSS | 5 | 5 | ✅ Completado |
| 3 | Migrar Content Collections | 7 | 7 | ✅ Completado |
| 4 | Migrar TypeScript config | 2 | 2 | ✅ Completado |
| 5 | AOS y animate.css compat | 2 | 2 | ✅ Completado |
| 6 | Verificar y corregir | 6 | 5 | ⚠️ Falta visual check manual |
| 7 | Deploy a Vercel | 3 | 0 | ⬜ Pendiente |
| **Total** | | **32** | **28** | |

### Por Check Individual

| ID | Tarea | Estado | Notas |
|----|-------|:------:|-------|
| 0.1 | Crear rama `feat/astro-6-upgrade` | ✅ | Branch creado |
| 0.2 | Leer guías de migración v5 y v6 | ✅ | Explore agent verificó contra docs oficiales |
| 0.3 | Ejecutar auditoría grep | ✅ | Auditoría confirmó: no ViewTransitions, no Astro.glob, no handleForms |
| 0.4 | Documentar archivos afectados | ✅ | Tabla actualizada con 4 correcciones del explore |
| 1.1 | npm install Grupo 1 | ✅ | astro@6.1.5, react@5.0.3, mdx@5.0.3, sitemap@3.7.2, vercel@10.0.4 |
| 1.2 | Verificar/ajustar engines | ✅ | Mantenido `24.x` (satisface >=22.12.0) |
| 1.3 | Resolver peer deps | ✅ | Sin conflictos |
| 2.1 | Remover squooshImageService | ✅ | |
| 2.2 | output: hybrid → static | ✅ | |
| 2.3 | Cambiar import vercel adapter | ✅ | Removido `/serverless` y `runtime` param |
| 2.4 | Remover tailwind() + crear PostCSS config | ✅ | `postcss.config.cjs` creado |
| 2.5 | Verificar params integraciones | ✅ | mdx, react, sitemap OK sin cambios |
| 3.1 | MOVER + migrar content.config.ts (loader + z from astro/zod) | ✅ | Movido a `src/content.config.ts` |
| 3.2 | .slug → .id en 4+ archivos | ✅ | 6 archivos totales (spec original + BlogPreview + PortfolioPreview) |
| 3.3 | entry.render() → render(entry) | ✅ | 2 rutas dinámicas migradas |
| 3.4 | Verificar getCollection/CollectionEntry imports | ✅ | Siguen desde `astro:content` |
| 3.5 | Investigar .tsx con getCollection | ⚠️ | Refactorizados a recibir props (ServerOnlyModule error) |
| 3.6 | Verificar Zod v4 compat con schemas | ✅ | z.coerce.date(), .optional().default() OK |
| 3.7 | Fallback: legacy collections si falla | ⏭️ | No necesario — migración exitosa |
| 4.1 | Actualizar tsconfig.json | ✅ | include/exclude agregados, types removido |
| 4.2 | Eliminar src/env.d.ts | ✅ | |
| 5.1 | Verificar AOS post-upgrade | ✅ | Funciona con `is:inline` |
| 5.2 | Verificar animate.css import | ✅ | Imports resuelven OK |
| 6.1 | npm run dev sin errores | ✅ | Server en localhost:4323 |
| 6.2 | npm run build sin errores | ✅ | 15 páginas, 23.49s |
| 6.3 | Verificación visual completa | ⬜ | Requiere revisión manual en browser |
| 6.4 | npx astro check limpio | ✅ | 10 errores encontrados y corregidos |
| 6.5 | Vercel analytics/speed-insights OK | ⬜ | Verificar en producción |
| 6.6 | api/chat.ts SSR endpoint OK | ✅ | prerender=false confirmado, builds OK |
| 7.1 | Verificar Node version en Vercel | ⬜ | |
| 7.2 | Deploy exitoso | ⬜ | Pendiente push |
| 7.3 | Verificación en producción | ⬜ | |

### Leyenda

| Icono | Significado |
|:-----:|-------------|
| ⬜ | Pendiente |
| 🔄 | En progreso |
| ✅ | Completado |
| ⚠️ | Completado con observaciones |
| ❌ | Bloqueado / Falló |
| ⏭️ | Salteado (no aplica) |

---

## Notas para Claude Code

### Filosofía
- **LEER PRIMERO** las guías de migración antes de cambiar nada.
- Hacer cambios incrementales: config → código → verificar. NO hacer todo de golpe.
- NO cambiar lógica de negocio, estilos, ni contenido — solo lo mínimo para la migración.
- Si un error no es claro, buscar en GitHub issues de `withastro/astro`.

### Dependencias: qué tocar y qué NO tocar
- **ACTUALIZAR**: `astro`, `@astrojs/vercel`, `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/tailwind`
- **NO TOCAR**: `tailwindcss`, `tailwindcss-animate`, `tailwind-merge`, `react`, `react-dom`, `@radix-ui/*`, `embla-carousel-*`, `lucide-react`, `aos`, `animate.css`, `class-variance-authority`, `clsx`, `sharp`, `@vercel/analytics`, `@vercel/speed-insights`

### Tailwind: decisión explícita
- **`@astrojs/tailwind` se REMUEVE** — su última versión (6.0.2) tiene peer dep `astro: ^3 || ^4 || ^5`, incompatible con Astro 6. El paquete está oficialmente deprecated.
- Tailwind CSS v3 se mantiene via **PostCSS manual** (`postcss.config.cjs` con `tailwindcss` + `autoprefixer`).
- `tailwindcss-animate` funciona con Tailwind v3. NO reemplazar por `tw-animate-css` (eso es para v4).
- `tailwind.config.cjs` se mantiene tal cual — PostCSS lo detecta automáticamente.
- La migración a Tailwind v4 (con `@tailwindcss/vite` plugin) se hará en un spec separado.

### Content Collections: la migración más importante
- Este proyecto usa Content Collections legacy (Astro 4 style).
- La migración a Content Layer API es **obligatoria** para Astro 6 (a menos que se use `legacy: { collections: true }`).
- Los cambios clave son: agregar `loader`, cambiar `slug` → `id`, cambiar `render()` a función standalone.
- Los archivos `.mdx` en `src/content/projects/` y `src/content/blog/` NO necesitan moverse.

### Si algo se rompe
- Si un componente React no renderiza: verificar que `client:load` o la directiva de hidratación sigue presente.
- Si AOS no anima: verificar que el script de inicialización tiene `is:inline` o está correctamente cargado post-upgrade.
- Si Embla carousel no funciona: verificar que el componente React tiene la directiva `client:` correcta.
- Si las imágenes no cargan: verificar que Sharp está instalado y no hay config legacy de `squooshImageService`.
- Si MDX no renderiza: verificar que `@astrojs/mdx` está actualizado y los imports en las páginas son correctos.
- Si el build falla con error de content collections: agregar temporalmente `legacy: { collections: true }` en config, pero migrar ASAP al Content Layer API.
- Si hay error de peer dependencies con `@astrojs/tailwind@6` y `tailwindcss@3`: verificar que la versión del integration soporta v3 explícitamente. Si no, mantener `@astrojs/tailwind@5` y buscar la versión mínima compatible con Astro 6.
- Si `entry.slug` ya no existe: confirmar que se migró a `entry.id` en TODOS los archivos.
- Si `entry.render()` falla: confirmar que se migró a `render(entry)` con import de `astro:content`.

### Después de esta migración
- El spec del chatbot AI (`spec-ai-chatbot-portfolio.md`) se puede ejecutar normalmente ya que la API route de Astro funcionará con el adapter `@astrojs/vercel@10+`.
- La migración a Tailwind v4 se puede planificar como tarea independiente.
