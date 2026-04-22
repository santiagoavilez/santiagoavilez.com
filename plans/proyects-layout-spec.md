# Spec: Projects Layout — Carrusel → Grid

## Objetivo

Reemplazar el carrusel de Embla en la sección "Other Work" del homepage por un grid estático donde todos los proyectos sean visibles sin interacción. Mantener la jerarquía: Fulbbo como featured project arriba, el resto en grid abajo.

---

## Por qué hacer este cambio

- Los carruseles tienen tasas de interacción muy bajas — la mayoría de los visitantes solo ven el primer slide.
- Un reclutador con 30 segundos debe poder scanear todos los proyectos sin hacer click ni swipe.
- Los portfolios de desarrolladores senior (brittanychiang.com, leerob.io, joshwcomeau.com) usan grid o stack vertical, nunca carrusel para proyectos.

---

## Estructura actual (lo que hay)

### Homepage (`/`)
```
[Featured] → 1 card grande de Fulbbo (detalle completo, bullets, stack badges, links)
[Other Work] → Carrusel Embla con 8 cards: AMCumbre, Glassy, Alerta Digital, IEIA, Melina Batalla, Solucionado, Laborar, Unco Activa
[View all projects] → link a /projects/
```

### Página `/projects/`
- Lista completa de todos los proyectos (verificar layout actual)

---

## Estructura nueva propuesta

### Homepage (`/`)

```
[Featured Projects] — grid 1 columna
  └─ Fulbbo (card grande, como está ahora: imagen, descripción, bullets, stack, links)

[Other Work] — grid 2 columnas desktop / 1 columna mobile
  └─ Cards compactas (imagen + nombre + descripción 1 línea + stack badges)
  └─ Máximo 4-6 proyectos visibles (los más relevantes)
  └─ [View all projects →] link al final si hay más
```

### Jerarquía de proyectos (orden de relevancia)

**Featured (card grande):**
1. Fulbbo — proyecto propio, full-stack, el más impresionante

**Other Work — fila 1 (más relevantes):**
2. Solucionado App — MVP startup, liderazgo de equipo, Next.js/tRPC
3. Melina Batalla — plataforma de cursos, pagos duales, Astro + React
4. Laborar — marketplace, chat real-time con Socket.io

**Other Work — fila 2 (complementarios):**
5. Unco Activa — React + Laravel, deploy en server propio
6. AMCumbre — WordPress pero con player de streaming
7. Glassy — optimización de performance

**Omitir del homepage (quedan solo en /projects/):**
8. Alerta Digital — similar a Glassy (optimización)
9. IEIA — similar a AMCumbre (WordPress)

> Nota: Santiago puede ajustar este orden. La idea es no repetir el mismo tipo de proyecto (ej: 2 optimizaciones WordPress) en el homepage.

---

## Diseño de las cards

### Featured Card (Fulbbo) — se mantiene como está
- Imagen cover grande
- Badge "Featured" + "Co-Founder & Lead Engineer"
- Título + descripción
- Bullet points con logros
- Stack badges
- Links (Live Preview + Private codebase)

### Other Work Cards — diseño compacto
```
┌─────────────────────────────┐
│  [Imagen cover 16:9]        │
│                             │
├─────────────────────────────┤
│  Título del proyecto        │
│  Descripción 1-2 líneas    │
│                             │
│  [badge] [badge] [badge]    │
│                             │
│  Live ↗   GitHub ↗          │
└─────────────────────────────┘
```

- Imagen: aspect-ratio 16:9, object-cover, border-radius coherente con el design system
- Título: font-semibold, tamaño actual
- Descripción: 1-2 líneas, text-muted, line-clamp-2
- Stack badges: máximo 4-5 badges, los más relevantes del proyecto
- Links: solo si existen (Live Preview y/o GitHub)
- Hover: sutil scale + shadow, o border highlight — coherente con el estilo actual del sitio
- La card entera es clickeable y lleva a la página del proyecto (`/projects/[slug]`)

### Grid responsive
- Desktop (≥1024px): 2 columnas, gap-6
- Tablet (≥640px): 2 columnas, gap-4
- Mobile (<640px): 1 columna, gap-4

---

## Fases de Implementación

### Fase 1: Auditar componentes actuales `[3 checks]`

- [ ] **1.1** Identificar los archivos del carrusel de proyectos: componente React de Embla, componente Astro que lo envuelve, datos/props que alimentan las cards.
- [ ] **1.2** Identificar si los datos de proyectos vienen de content collections, MDX, o están hardcodeados en el componente.
- [ ] **1.3** Verificar la estructura de la página `/projects/` para mantener consistencia visual.

### Fase 2: Crear componente de grid `[4 checks]`

- [ ] **2.1** Crear componente `ProjectGrid` (Astro o React según el patrón del proyecto) que reciba un array de proyectos y los renderice en grid de 2 columnas.
- [ ] **2.2** Crear componente `ProjectCard` compacto: imagen, título, descripción (line-clamp-2), stack badges (máx 5), links opcionales.
- [ ] **2.3** Implementar grid responsive: 2 cols desktop, 2 cols tablet, 1 col mobile.
- [ ] **2.4** Agregar hover state sutil en las cards (scale, shadow, o border) coherente con el design system actual del sitio.

### Fase 3: Reemplazar carrusel en homepage `[3 checks]`

- [ ] **3.1** En la sección "Other Work" del homepage, reemplazar el componente de carrusel por el nuevo `ProjectGrid`.
- [ ] **3.2** Pasar solo los 4-6 proyectos seleccionados (no los 8). Los demás quedan accesibles desde `/projects/`.
- [ ] **3.3** Mantener el link "View all projects" al final de la sección.

### Fase 4: Limpiar dependencias del carrusel `[2 checks]`

- [ ] **4.1** Verificar si Embla Carousel se usa en algún otro lugar del sitio (ej: screenshots dentro de un proyecto, testimonials). Si NO se usa en ningún otro lado, desinstalar:
  ```bash
  npm uninstall embla-carousel-react embla-carousel-auto-scroll embla-carousel-autoplay embla-carousel-class-names
  ```
- [ ] **4.2** Remover el componente de carrusel de proyectos (archivo React). NO borrar si se reutiliza en otra sección.

### Fase 5: Animaciones y polish `[3 checks]`

- [ ] **5.1** Agregar animación de entrada a las cards con AOS (staggered, `data-aos="fade-up"` con `data-aos-delay` incremental) para que las cards aparezcan secuencialmente al hacer scroll.
- [ ] **5.2** Verificar que la transición de la sección Featured → Other Work es fluida visualmente (spacing, separador si existe).
- [ ] **5.3** Verificar responsive: las cards se ven bien en mobile, las imágenes no se deforman, el texto no se corta mal.

### Fase 6: Verificar `[2 checks]`

- [ ] **6.1** Verificar visualmente en desktop y mobile: todas las cards se ven, los links funcionan, las imágenes cargan.
- [ ] **6.2** Verificar que la página `/projects/` sigue funcionando correctamente y que los slugs de navegación no se rompieron.

---

## Tracker Resumen

| Fase | Descripción | Checks | Estado |
|------|-------------|--------|--------|
| 1 | Auditar componentes | 3 | ⬜ |
| 2 | Crear componente grid | 4 | ⬜ |
| 3 | Reemplazar carrusel | 3 | ⬜ |
| 4 | Limpiar dependencias | 2 | ⬜ |
| 5 | Animaciones y polish | 3 | ⬜ |
| 6 | Verificar | 2 | ⬜ |
| **Total** | | **17** | |

---

## Notas para Claude Code

- Antes de empezar, leer la estructura del proyecto para entender cómo se renderizan los proyectos actualmente (content collections, MDX, props hardcodeadas, etc).
- Mantener el design system existente del sitio: colores, tipografía, border-radius, sombras. NO inventar un estilo nuevo.
- La card de Featured (Fulbbo) NO se toca — se mantiene exactamente como está.
- Si los datos de los proyectos vienen de content collections o MDX, usar la misma fuente de datos para el grid. Solo cambiar el componente de presentación.
- El orden de los proyectos en "Other Work" debe ser configurable (array ordenado) para que Santiago pueda reordenar fácilmente.
- NO eliminar Embla sin verificar primero que no se usa en otras partes del sitio.