# Portfolio Redesign Spec — santiagoavilez.com
> Objetivo: transformar el portfolio de orientación freelance/LATAM a orientación empleo remoto USA.
> Metodología: Spec Driven Development — Planear → Ejecutar → Verificar → Archivar.

---

## TRACKER — Estado general

> Marcar cada tarea cuando esté 100% completa. El orden recomendado está en FASE 3.

| # | Tarea | Estado |
|---|-------|--------|
| 1 | Metadata y SEO | ✅ Completo |
| 2 | Hero Section | ✅ Completo |
| 3 | About Me Section | ✅ Completo |
| 4 | Navegación | ✅ Completo |
| 5a | Separar proyectos en Featured / Other Work | ✅ Completo |
| 5b | Agregar proyecto Fulbbo | ⬜ Pendiente |
| 5c | Traducir descripciones de proyectos | ✅ Completo |
| 5d | Stack badges en Featured Projects | ⬜ Pendiente |
| 5e | Stack & Experience section | ✅ Completo |
| 5f | Experience timeline section | ✅ Completo |
| 6 | CV descargable (`public/resume.pdf`) | ⬜ Pendiente |
| 7 | Footer | ⬜ Pendiente |
| 8 | Eliminar sección "Marcas que confían" | ✅ Completo |

**Progreso: 9 / 13**

---

## FASE 0 — CONTEXTO Y RESTRICCIONES

- Framework: Astro (no cambiar el framework)
- Idioma final del sitio: **100% inglés** — eliminar todo el español del contenido público
- No rediseñar el layout visual — reutilizar los componentes existentes
- El diseño base (colores, tipografía, estructura) se mantiene
- Stack del candidato: TypeScript · JavaScript · React · Next.js · Tailwind CSS · Redux/Zustand · Node.js · NestJS · Express · tRPC · REST APIs · PostgreSQL · MySQL · TypeORM · Drizzle · Docker · Vercel · GitHub Actions · AWS · CI/CD · Jest

---

## FASE 1 — PLAN DE CAMBIOS

### TAREA 1 — Metadata y SEO
**Archivos a modificar:** `src/layouts/Layout.astro` o equivalente donde se define el `<head>`

- [ ] Cambiar `<title>` de `"Santiago Avilez | Desarrollador Web"` a `"Santiago Avilez | Full Stack Developer"`
- [ ] Cambiar o agregar `<meta name="description">` en inglés:
  ```
  Full Stack Developer with 5+ years building scalable web products. 
  React, Next.js, TypeScript, Node.js, NestJS. Open to full-time remote roles — US, Canada, Europe & Latin America.
  ```
- [ ] Agregar Open Graph tags en inglés:
  ```html
  <meta property="og:title" content="Santiago Avilez | Full Stack Developer" />
  <meta property="og:description" content="Full Stack Developer — React · Next.js · TypeScript · Node.js · NestJS. Open to full-time remote roles — US, Canada, Europe & Latin America." />
  <meta property="og:url" content="https://santiagoavilez.com" />
  ```

---

### TAREA 2 — Hero Section
**Archivos a modificar:** componente del hero (probablemente `src/components/Hero.astro` o similar)

Reemplazar TODO el contenido del hero:

**ANTES:**
```
Headline:    "Lleva tu sitio web al siguiente nivel"
Subheadline: "Creo MVP´S que validan tu idea en tiempo récord."
CTA:         WhatsApp link (wa.me/549...)
```

**DESPUÉS:**
```
Headline:    "Full Stack Developer"
Subheadline: "React · Next.js · TypeScript · Node.js · NestJS · PostgreSQL"
Body:        "I design and build scalable web products end-to-end — from clean, 
              performant frontends to well-architected backends. 5+ years shipping 
              real features in production.
              Currently open to full-time remote roles at product companies in the US."
CTA primario:   [Download Resume] → link al PDF del CV (ver Tarea 6)
CTA secundario: [LinkedIn ↗] → https://linkedin.com/in/santiago-avilez-ariza/
```

- [ ] Eliminar el bloque "¿Qué puedo hacer por tí?" con los tres servicios (Desarrollo / Optimización web / Mantenimiento) — ese bloque es orientado a clientes freelance y no tiene lugar en un portfolio de empleo
- [ ] Eliminar todos los links a `wa.me/...` del sitio completo

---

### TAREA 3 — About Me Section
**Archivos a modificar:** sección about en `index.astro` o componente `About.astro`

**ANTES:**
```
"En tan solo tres años de trayectoria como desarrollador web, he tenido la
oportunidad de colaborar en más de 20 proyectos de gran envergadura..."
CTA: "Cotizar proyecto" → WhatsApp
```

**DESPUÉS — copy completo:**
```
I'm a Full Stack Developer based in Argentina, with 5+ years of experience 
building web products that actually scale.

I work across the full stack — building React and Next.js frontends, designing 
REST and tRPC APIs with Node.js and NestJS, and managing PostgreSQL databases 
with a focus on data integrity and performance. On the infrastructure side, I'm 
comfortable with Docker, CI/CD pipelines on GitHub Actions, and deployments on 
AWS and Vercel.

I care a lot about how code is structured. I gravitate toward Clean Architecture 
and Domain-Driven Design not because they're fashionable, but because they make 
systems easier to maintain and evolve over time — especially in startup 
environments where requirements change fast.

I've worked on SaaS platforms, marketplace apps, and MVPs across different 
industries. I'm used to working asynchronously, communicating in English, and 
owning features from spec to deployment.

Looking for a remote, full-time role where I can contribute to a product team 
and grow alongside it.
```

**CTAs del about:**
```
CTA primario:   [Download Resume] → link al PDF del CV
CTA secundario: [Let's connect on LinkedIn ↗] → https://linkedin.com/in/santiago-avilez-ariza/
```

- [ ] Eliminar el CTA "Cotizar proyecto" que lleva a WhatsApp

---

### TAREA 4 — Navegación
**Archivos a modificar:** componente de navbar/header

- [ ] Traducir items de navegación al inglés:
  - `Inicio` → `Home`
  - `Proyectos` → `Projects`
  - `Sobre mí` → `About`
- [ ] Eliminar links a Instagram y TikTok del **header/nav** (pueden mantenerse en el footer si se desea)
- [ ] Agregar link a CV descargable en el nav: `Resume` → link al PDF

---

### TAREA 5 — Proyectos: jerarquía y traducción
**Archivos a modificar:** `src/pages/projects/index.astro` y cada página de proyecto individual

#### 5a — Separar proyectos en dos categorías

**Featured Projects** (proyectos de código, con stack badges y GitHub):
1. Fulbbo ← NUEVO, ver Tarea 5b
2. Laborar
3. Solucionado App

**Other Work** (client work, sin stack ni GitHub, solo live preview y métrica clave):
4. Glassy Europe — métrica: "98 Lighthouse score"
5. Alerta Digital — métrica: "96 Lighthouse score"
6. Melina Batalla
7. IEIA
8. AMCumbre
9. Unco Activa

#### 5b — Agregar proyecto Fulbbo

> Estado: ✅ LISTO PARA EJECUTAR
> Posición en la página de proyectos: PRIMER proyecto (Featured Projects, card destacada)

---

## Datos del proyecto

| Campo | Valor |
|---|---|
| Nombre | Fulbbo |
| Tipo | Featured Project (con stack badges y link live) |
| Rol | Co-Founder & Lead Engineer |
| Live URL | https://fulbbo.vercel.app |
| Repo | Privado — no agregar link de GitHub |
| Nota de repo | `Private codebase` |
| Stack | TypeScript · Next.js · React · Node.js · PostgreSQL · Vercel · Vitest · Vertical Slice Architecture |

---

## Copy de la card (vista en grilla de proyectos)

**Título:**
```
Fulbbo
```

**Descripción corta (para la card):**
```
Social platform connecting soccer players with nearby fields — featuring 
real-time chat, booking, payments, and friend coordination.
```

**Badge de rol (opcional, si el diseño lo permite):**
```
Co-Founder & Lead Engineer
```

---

## Copy de la página de detalle del proyecto

### Headline
```
Fulbbo — Soccer Social Platform
```

### Descripción larga
```
Fulbbo is a full-stack social platform that connects soccer players with 
nearby fields based on their location. Players can discover available fields, 
invite friends, book and pay for court time, and coordinate through a 
built-in real-time chat — all in one product.

I co-founded Fulbbo and served as Lead Engineer, designing and building the 
platform end-to-end: from the Next.js frontend and booking flows, to the 
Node.js backend, database architecture, and CI/CD infrastructure.
```

### Highlights técnicos (mostrar como lista de bullets o cards)
```
• Designed a geographic cache system over Google Places API using PostgreSQL 
  with a 5km grid, reducing external API costs by ~90% in high-traffic zones.

• Built a real-time chat system enabling live coordination between players, 
  handling concurrent interactions and real-time updates.

• Architected a scalable monorepo with end-to-end type safety (TypeScript 
  across frontend and backend) and automated CI/CD pipelines.

• Designed the full booking and payment flow, covering field availability, 
  reservations, and in-app payments.
```

### Stack (badges)
```
TypeScript · Next.js · React · Node.js · PostgreSQL · Vercel · Vitest
Architecture: Vertical Slice Architecture
```

### CTAs
```
[Live Preview ↗] → https://fulbbo.vercel.app
[Private codebase]  ← texto plano, sin link, con un icono de candado si el diseño lo permite
```

---

## Instrucciones para Claude Code

1. Crear el archivo de contenido del proyecto en `src/content/projects/fulbbo.md` (o el formato que use el proyecto — `.json`, `.ts`, etc. Revisar cómo están definidos los otros proyectos antes de crear el archivo).

2. La card de Fulbbo debe aparecer **primera** en la sección Featured Projects, antes que Laborar y Solucionado.

3. Para la imagen de portada: usar un placeholder por ahora con el nombre `fulbbo-cover` y dejar un comentario `// TODO: reemplazar con screenshot real de Fulbbo`. Santiago debe proveer la imagen.
   - Dimensiones recomendadas: mismas que las otras cards del proyecto (revisar las imágenes existentes con `ls public/` o `ls src/assets/`).

4. No agregar link de GitHub. En su lugar, mostrar el texto `Private codebase` con el mismo estilo visual que usarían los otros proyectos cuando no tienen repo público.

5. Si el proyecto detail page tiene sección de "stack", agregar los badges con estas tecnologías en este orden:
   ```
   TypeScript, Next.js, React, Node.js, PostgreSQL, Vercel, Vitest
   ```

6. Si el proyecto detail page tiene sección de descripción larga con highlights, usar los bullets de la sección "Highlights técnicos" de este spec.

---

## Verificación post-ejecución (solo para Fulbbo)

- [ ] Fulbbo aparece como primera card en la sección Featured Projects
- [ ] La card muestra: título, descripción corta, stack badges, link al live preview
- [ ] La página de detalle existe y tiene: descripción larga, highlights técnicos, stack completo, CTA al live preview
- [ ] No aparece link de GitHub (repo es privado)
- [ ] Aparece indicación de `Private codebase`
- [ ] El live preview (https://fulbbo.vercel.app) abre correctamente
- [ ] La imagen de portada existe (aunque sea placeholder por ahora)

#### 5c — Traducir todas las descripciones de proyectos al inglés

**Laborar (traducción sugerida):**
```
A freelance marketplace platform for domestic workers and professionals, 
featuring a real-time chat system and a peer-to-peer reviews system.
Stack: [completar con stack real usado]
```

**Solucionado App (traducción sugerida):**
```
MVP for a tech startup connecting domestic service providers with potential 
clients. Built and shipped end-to-end.
Stack: [completar con stack real usado]
```

**Glassy (traducción sugerida):**
```
Web optimization for Glassy Europe — a surf and casual fashion ecommerce brand. 
Improved load speed and SEO, reaching a 98/100 Lighthouse score.
```

**Alerta Digital (traducción sugerida):**
```
Performance and SEO optimization for an independent news platform. 
Achieved a 96/100 Google Lighthouse score.
```

#### 5d — Agregar stack badges a los Featured Projects
Cada proyecto Featured debe mostrar visualmente las tecnologías usadas. Ejemplo de estructura de datos a agregar en cada proyecto:
```
stack: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Docker"]
```
# Tarea 5e — Agregar sección "Stack & Experience"

> Estado: ✅ LISTO PARA EJECUTAR
> Posición en la página: Entre el Hero y la sección de Proyectos (index.astro)

---

## ANTES DE EJECUTAR

1. Revisar cómo están estructurados los componentes existentes:
   ```bash
   ls src/components/
   cat src/pages/index.astro
   ```
2. Identificar el sistema de estilos (Tailwind, CSS modules, etc.)
3. Respetar la paleta de colores, tipografía y espaciado existente — esta sección debe sentirse parte del mismo sitio, no un bloque ajeno.

---

## ESTRUCTURA DEL COMPONENTE

Crear un nuevo componente: `src/components/StackAndExperience.astro`

La sección tiene dos bloques visuales side-by-side en desktop, apilados en mobile:

```
┌─────────────────────────────────────────────────┐
│                 Tech Stack                       │  <- título de sección
├────────────────────┬────────────────────────────┤
│                    │                            │
│   Stack (grilla    │   Experience (timeline     │
│   de categorías)   │   vertical simple)         │
│                    │                            │
└────────────────────┴────────────────────────────┘
```

---

## BLOQUE 1 — TECH STACK

Mostrar el stack organizado por categorías. Cada categoría tiene un label y una lista de badges/chips de tecnología.

**Datos:**

```javascript
const stack = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "SQL"]
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Redux", "Zustand", "shadcn/ui"]
  },
  {
    category: "Backend",
    items: ["Node.js", "NestJS", "Express", "tRPC", "REST APIs"]
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "TypeORM", "Drizzle"]
  },
  {
    category: "Infra & Testing",
    items: ["Docker", "AWS", "GitHub Actions", "Vercel", "CI/CD", "Jest", "Vitest"]
  },
  {
    category: "Architecture",
    items: ["Clean Architecture", "DDD", "Vertical Slice", "SOLID"]
  }
]
```

**Render esperado por categoría:**
```
Languages
[TypeScript] [JavaScript] [SQL]

Frontend
[React] [Next.js] [Tailwind CSS] [Redux] [Zustand] [shadcn/ui]

...etc
```

Los badges deben ser elementos visuales simples (texto con borde redondeado o fondo sutil), no iconos — para que sea rápido de leer y escalar bien si se agregan tecnologías.

---

## BLOQUE 2 — EXPERIENCE

Timeline vertical simple con 3 items. Cada item tiene: rol, empresa/proyecto, período y una línea de descripción.

**Datos:**

```javascript
const experience = [
  {
    role: "Full Stack Developer",
    company: "Secretaría de Modernización — Municipalidad de Neuquén",
    period: "Feb 2025 – Present",
    description: "Architected citizen-facing digital platforms (React + NestJS + PostgreSQL) serving 12,000+ users/year, replacing manual government processes with online services. Led performance refactor reducing load times by 30% and boosting form completion by 15%.",
    url: null  // plataforma interna, sin link público
  },
  {
    role: "Full Stack Developer",
    company: "Eximo",
    period: "Dec 2020 – Jan 2025",
    description: "Built full-stack applications for enterprise clients with 5,000+ active users, owning end-to-end delivery from DB modeling to production deployment. Reduced page load times by 40% through frontend and backend optimizations.",
    url: null  // empresa de clientes, sin link público representativo
  },
  {
    role: "Co-Founder & Lead Engineer",
    company: "Fulbbo",
    period: "2023 – Present",
    description: "Designed and built a full-stack soccer social platform — booking, payments, real-time chat, and geographic search. Reduced Google Places API costs by ~90% with a custom PostgreSQL cache system.",
    url: "https://fulbbo.vercel.app"
  }
]
```

⚠️ Nota de orden: los items van de más reciente a más antiguo (Municipalidad → Eximo → Fulbbo). Fulbbo va último porque es un proyecto personal/side, no un empleo — pero tiene URL así que mantiene visibilidad.

Render esperado por item:
●  Full Stack Developer
   Secretaría de Modernización — Municipalidad de Neuquén · Feb 2025 – Present
   Architected citizen-facing digital platforms serving 12,000+ users/year...

●  Full Stack Developer
   Eximo · Dec 2020 – Jan 2025
   Built full-stack applications for enterprise clients with 5,000+ active users...

●  Co-Founder & Lead Engineer
   Fulbbo · 2023 – Present
   Designed and built a full-stack soccer social platform...
   [fulbbo.vercel.app ↗]
La línea vertical que conecta los puntos (●) es el único elemento decorativo — mantenerla sutil, del color del tema existente.
Si el item tiene URL, mostrar el link al final. Si no tiene URL (Municipalidad, Eximo), mostrar solo texto plano sin link.

---

## INTEGRACIÓN EN index.astro

Importar y ubicar el componente entre el Hero y la sección de Proyectos:

```astro
---
import Hero from '../components/Hero.astro';
import StackAndExperience from '../components/StackAndExperience.astro'; // <- nuevo
import Projects from '../components/Projects.astro'; // nombre real puede variar
import About from '../components/About.astro';       // nombre real puede variar
---

<Hero />
<StackAndExperience />   <!-- entre hero y proyectos -->
<Projects />
<About />
```

> ⚠️ Los nombres de los componentes existentes pueden ser distintos. Verificar con `cat src/pages/index.astro` antes de editar.

---

## TÍTULO DE LA SECCIÓN

```
Skills & Experience
```

Usar el mismo estilo visual de título que usan las secciones "Proyectos realizados" y "Sobre mí" ya existentes (mismo tamaño, mismo peso, mismo espaciado).

---

## RESPONSIVE

- **Desktop (md+):** dos columnas — stack a la izquierda, experience a la derecha
- **Mobile:** una columna — stack arriba, experience abajo
- Los badges del stack deben hacer wrap naturalmente en mobile

---

## NOTAS DE ESTILO

- No introducir nuevos colores — usar los variables CSS o clases Tailwind ya presentes en el proyecto
- El espaciado vertical entre esta sección y las adyacentes (Hero arriba, Projects abajo) debe ser consistente con el espaciado entre las otras secciones del sitio
- Si el sitio usa `section` como contenedor semántico, mantener esa convención

---

## VERIFICACIÓN POST-EJECUCIÓN

- [ ] La sección aparece entre el Hero y los Proyectos en el home
- [ ] El stack muestra las 6 categorías con todos sus items
- [ ] Los badges/chips del stack son legibles en mobile y desktop
- [ ] La timeline de Experience muestra los 3 items en orden
- [ ] Fulbbo tiene link clickeable (fulbbo.vercel.app)
- [ ] Food Handler Platform NO tiene link (solo texto)
- [ ] "Freelance & Agency Work" linkea a /projects
- [ ] La sección es responsive: 2 columnas en desktop, 1 en mobile
- [ ] El estilo visual es consistente con el resto del sitio (mismos colores, tipografía, espaciado)
- [ ] El título de sección "Skills & Experience" usa el mismo estilo que los otros títulos de sección

---

### TAREA 6 — CV descargable
**Archivos a modificar/agregar:** `public/resume.pdf`

- [ ] Generar o actualizar el CV en inglés (esto lo hace Santiago externamente)
- [ ] Colocar el archivo en `public/resume.pdf`
- [ ] Todos los CTAs "Download Resume" deben apuntar a `/resume.pdf` con `download` attribute:
  ```html
  <a href="/resume.pdf" download>Download Resume</a>
  ```

---

### TAREA 7 — Footer
**Archivos a modificar:** componente de footer

- [ ] Traducir al inglés: `"Designed & Developed in Argentina with Astro"` puede mantenerse o simplificarse a `"Designed & built by Santiago Avilez"`
- [ ] Verificar que los links del footer estén correctos (LinkedIn, GitHub)
- [ ] Opcional: mantener Instagram/TikTok en footer, sacarlos del header

---

### TAREA 8 — Eliminar sección "Marcas que confían"
**Archivos a modificar:** index o componente correspondiente

- [ ] Eliminar el texto/bloque "Más de 20 marcas confían en mi trabajo" — orientado a clientes, no a recruiters

---

## FASE 2 — VERIFICACIÓN (checklist post-ejecución)

Antes de hacer deploy, verificar ítem por ítem:

### Contenido
- [ ] No queda ninguna palabra en español en el sitio (excepto nombres propios)
- [ ] No queda ningún link a `wa.me/...`
- [ ] No aparece "Cotizar proyecto" ni "Conocer más" en ningún lado
- [ ] No aparece "tres años" — debe decir "5+ years"
- [ ] El stack (React, Next.js, TypeScript, etc.) es visible en el hero sin scrollear
- [ ] Existe sección About con el nuevo copy completo en inglés
- [ ] Fulbbo aparece como primer proyecto Featured (una vez que se agreguen los datos)
- [ ] Los proyectos WordPress/client work están en una sección separada "Other Work"

### CTAs y links
- [ ] CTA primario del hero → `/resume.pdf` con descarga
- [ ] CTA secundario del hero → LinkedIn
- [ ] CTA del About → LinkedIn y/o resume
- [ ] `public/resume.pdf` existe y se puede descargar
- [ ] Todos los links de LinkedIn, GitHub y email funcionan

### SEO y metadata
- [ ] `<title>` dice "Santiago Avilez | Full Stack Developer"
- [ ] `<meta name="description">` está en inglés con keywords relevantes
- [ ] Open Graph tags presentes y en inglés

### Navegación
- [ ] Nav en inglés: Home · Projects · About · Resume
- [ ] Instagram y TikTok fuera del header

### UX
- [ ] El sitio se ve bien en mobile
- [ ] No hay links rotos

---

## FASE 3 — ORDEN DE EJECUCIÓN RECOMENDADO

Ejecutar en este orden para minimizar conflictos:

1. **Tarea 1** — Metadata (cambio de bajo riesgo, alto impacto SEO)
2. **Tarea 4** — Navegación (afecta todas las páginas, hacerlo temprano)
3. **Tarea 2** — Hero (cambio de mayor impacto visual)
4. **Tarea 3** — About Me
5. **Tarea 8** — Eliminar sección marcas
6. **Tarea 5c** — Traducir descripciones de proyectos existentes
7. **Tarea 5a** — Reorganizar proyectos en Featured / Other Work
8. **Tarea 6** — Agregar resume.pdf (depende de que Santiago lo prepare)
9. **Tarea 7** — Footer
10. **Tarea 5b** — Agregar Fulbbo (depende de datos de Santiago — puede ir en un segundo PR)

---

## FASE 4 — ARCHIVO

Una vez completado y en producción, registrar:

- Fecha de deploy: ___________
- URL en producción: https://santiagoavilez.com
- Tasks completadas: ___ / 10
- Tasks pendientes (y por qué): ___________
- Fulbbo agregado: Sí / No / Pendiente de datos
- CV en inglés subido: Sí / No / Pendiente
- Próxima revisión sugerida: agregar sección "Experience" con timeline laboral formal

---

## NOTAS PARA CLAUDE CODE

- Este es un sitio Astro — los componentes pueden ser `.astro`, `.tsx` o `.jsx`
- Antes de editar, explorar la estructura del repo con `ls src/` y `ls src/components/`
- No hay que instalar dependencias nuevas — todos los cambios son de contenido y copy
- Si un componente mezcla inglés y español durante la transición, priorizar terminar la tarea completa antes de hacer commit
- El archivo de CV (`public/resume.pdf`) es externo a este spec — dejar el CTA apuntando a `/resume.pdf` y documentar que falta el archivo si no está presente