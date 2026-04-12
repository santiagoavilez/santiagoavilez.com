# Spec: AI Chatbot para Portfolio — santiagoavilez.com

## Objetivo

Agregar un chatbot flotante al portfolio que responda **únicamente** preguntas sobre Santiago Avilez (experiencia, skills, proyectos, educación, disponibilidad). Usa la API de OpenRouter (modelos gratuitos, formato OpenAI-compatible) desde un endpoint serverless. Incluye preguntas sugeridas para guiar al usuario.

---

## Arquitectura

```
[React Component] → [Astro API Route /api/chat] → [OpenRouter API]
```

- **Frontend**: Componente React (`ChatBot.tsx`) con `client:load` en el layout principal de Astro.
- **Backend**: Endpoint serverless en `src/pages/api/chat.ts` (Astro API route). La API key se almacena en variable de entorno `OPENROUTER_API_KEY`.
- **API**: OpenRouter (`https://openrouter.ai/api/v1/chat/completions`) — formato OpenAI-compatible.
- **Modelo**: Fallback chain — se intenta en orden hasta obtener respuesta exitosa:
  1. `openai/gpt-oss-120b:free`
  2. `google/gemma-3-27b-it:free`
  3. `deepseek/deepseek-chat-v3.1:free`
  4. `qwen/qwen3-235b-a22b:free`
  5. `mistralai/mistral-small-3.1-24b-instruct:free`
  
  Si un modelo devuelve 429 (rate limit) o 5xx, se pasa al siguiente. Si todos fallan, se retorna error al frontend.

---

## System Prompt (hardcodeado en el backend)

El system prompt incluye el CV completo de Santiago (experiencia, proyectos, skills, educación, datos de contacto) y las siguientes instrucciones:

- Responder SOLO preguntas relacionadas con Santiago Avilez.
- Si la pregunta no tiene relación, responder amablemente: _"I can only answer questions about Santiago. Feel free to ask about his experience, skills, or projects!"_
- Responder en el idioma en que se le pregunte (español o inglés).
- Tono profesional pero cercano. Respuestas concisas (máx 3-4 oraciones).
- Nunca inventar información que no esté en el contexto provisto.

---

## Preguntas Sugeridas

Se muestran como chips clickeables al abrir el chat y cuando no hay mensajes:

1. "What's Santiago's tech stack?"
2. "Tell me about Fulbbo"
3. "What's his work experience?"
4. "Is he open to remote roles?"

---

## UI / UX

- **Botón flotante**: esquina inferior derecha, ícono de chat, con badge animado "Ask AI" que desaparece tras abrir.
- **Panel de chat**: se expande sobre el contenido (no desplaza layout). Ancho ~380px desktop, fullscreen en mobile.
- **Header del panel**: "Chat with Santiago's AI" + botón cerrar.
- **Chips de preguntas sugeridas**: visibles al inicio, desaparecen tras el primer mensaje.
- **Área de mensajes**: burbujas diferenciadas user/assistant, auto-scroll al último mensaje.
- **Input**: campo de texto + botón enviar. Deshabilitado mientras se espera respuesta.
- **Loading**: indicador de typing (tres dots animados) mientras se espera la respuesta.
- **Estilo**: coherente con el design system del portfolio existente (consultar variables CSS/Tailwind del sitio).

---

## Fases de Implementación

### Fase 1: Backend — API Route `[4 checks]`

- [x] **1.1** Crear `src/pages/api/chat.ts` con método POST que recibe `{ messages: Array<{role, content}> }`.
- [x] **1.2** Hardcodear el system prompt con el CV completo de Santiago + instrucciones de restricción de scope.
- [x] **1.3** Implementar función `callWithFallback(systemPrompt, userMessages)` que itera sobre el array de modelos en orden. Para cada modelo, hace fetch a `https://openrouter.ai/api/v1/chat/completions` con headers `Authorization: Bearer $OPENROUTER_API_KEY` y `Content-Type: application/json`. Si la respuesta es 429 o 5xx, pasa al siguiente modelo. Si es exitosa, retorna `{ reply: string }`. Si todos fallan, retorna error.
- [x] **1.4** Manejo de errores: validar body, input vacío, mensajes muy largos. Si todos los modelos fallan, retornar `{ error: "AI is temporarily unavailable, please try again later" }` con status 503. Variable de entorno `OPENROUTER_API_KEY` configurada en `.env`.

### Fase 2: Componente React — ChatBot `[6 checks]`

- [x] **2.1** Crear `src/components/ChatBot.tsx`. Estado: `isOpen`, `messages[]`, `isLoading`, `input`.
- [x] **2.2** Botón flotante fijo (bottom-right) con ícono de chat. Toggle `isOpen`.
- [x] **2.3** Panel de chat: header con título + close, área de mensajes scrolleable, input + send button.
- [x] **2.4** Preguntas sugeridas como chips clickeables. Se muestran solo cuando `messages.length === 0`. Al hacer click, se envían como mensaje del usuario.
- [x] **2.5** Lógica de envío: POST a `/api/chat` con historial de mensajes. Mostrar indicador de typing. Agregar respuesta al historial. Auto-scroll.
- [x] **2.6** Responsive: panel fullscreen en mobile (`max-w-full h-full` en `<640px`), panel flotante en desktop.

### Fase 3: Integración en Astro `[2 checks]`

- [x] **3.1** Importar `<ChatBot client:load />` en el layout principal (`Layout.astro` o equivalente) para que aparezca en todas las páginas.
- [ ] **3.2** No se necesita SDK externo (se usa `fetch` nativo). Verificar que la API route funciona con `astro dev` y que `OPENROUTER_API_KEY` está en `.env`.

### Fase 4: Estilo y Polish `[4 checks]`

- [ ] **4.1** Aplicar estilos coherentes con el design system del sitio (colores, tipografía, border-radius, sombras). Usar Tailwind classes existentes.
- [ ] **4.2** Animación de entrada/salida del panel (slide-up o scale con opacity).
- [ ] **4.3** Animación del indicador de typing (tres dots pulsantes).
- [ ] **4.4** Badge "Ask AI" en el botón flotante con animación sutil (pulse o bounce) que desaparece tras la primera apertura.

### Fase 5: Testing y Edge Cases `[3 checks]`

- [ ] **5.1** Verificar que preguntas fuera de scope reciben la respuesta de restricción.
- [ ] **5.2** Verificar manejo de errores: API key faltante, fallback entre modelos cuando uno devuelve 429, todos los modelos caídos (debe mostrar mensaje amigable), input vacío, mensajes muy largos.
- [ ] **5.3** Verificar UX en mobile y desktop. Verificar que el chat no interfiere con el scroll del portfolio.

---

## Tracker Resumen

| Fase | Descripción | Checks | Estado |
|------|-------------|--------|--------|
| 1 | Backend API Route | 4 | ✅ |
| 2 | Componente React | 6 | ✅ |
| 3 | Integración Astro | 2 | ⬜ |
| 4 | Estilo y Polish | 4 | ⬜ |
| 5 | Testing y Edge Cases | 3 | ⬜ |
| **Total** | | **19** | |

---

## Notas para Claude Code

- Antes de empezar, leer la estructura del proyecto (`src/`) para entender layouts, componentes existentes y design tokens.
- El system prompt del backend debe incluir el contenido completo del CV (copiado textualmente del PDF).
- No usar localStorage para el historial — solo estado en memoria (se reinicia al cerrar).
- La API key nunca debe exponerse en el frontend. Usar `OPENROUTER_API_KEY` en el server-side únicamente.
- OpenRouter usa formato OpenAI-compatible: no se necesita SDK, solo `fetch` con los headers correctos.
- Rate limits del tier gratuito: 20 req/min, 200 req/día. Considerar mostrar mensaje amigable si se alcanza el límite (HTTP 429).
- Si el modelo free no está disponible temporalmente, retornar error graceful al usuario ("AI is temporarily unavailable, please try again later").
- Adaptar el deploy al adapter que esté usando el sitio (Vercel, Node, etc.) para que la API route funcione en producción.