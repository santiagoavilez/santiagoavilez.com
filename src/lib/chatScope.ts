const BLOCKED = [
  // Code generation and implementation requests
  /\b(codigo|code|snippet|boilerplate|scaffold|template|script|funcion|function)\b/,
  /\b(genera|generame|crea|hazme|implementa|desarrolla|programa|escribe|write|build|develop)\b.{0,60}\b(codigo|code|app|api|login|algoritmo|algorithm|componente|component)\b/,
  /\b(como\s+(hago|hacer|programar|implementar)|how\s+to\s+(build|code|implement))\b/,
  /\b(ejemplo|example|tutorial|paso\s+a\s+paso|step\s+by\s+step)\b.{0,60}\b(react|next|node|typescript|javascript|python|java|sql|nestjs|astro)\b/,
  /\b(debug|debuggear|arreglar\s+bug|fix\s+bug|stack\s+trace|error\s+de\s+compilacion|compilation\s+error)\b/,

  // Prompt-injection / jailbreak
  /\b(ignore|ignora)\b.{0,40}\b(instructions|instruction|prompt|reglas|rules)\b/,
  /\b(system\s+prompt|developer\s+message|mensaje\s+de\s+sistema|mensaje\s+del\s+desarrollador)\b/,
  /\b(jailbreak|bypass|evade|override|roleplay|act\s+as|simula\s+ser)\b/,

  // Generic non-profile knowledge requests
  /\b(clima|weather|noticias|news|matematica|math|historia|history|traduce|translate|tarea|homework|receta|recipe)\b/,
].map((pattern) => new RegExp(pattern.source, "i"));

// Stack terms that contain blocked words ("code", "function"); removed before the BLOCKED check.
const STACK_PHRASES = /\b(claude\s+code|function\s+calling)\b/gi;
// Stripping those phrases must not let code-generation requests through.
const GENERATION_REQUEST =
  /\b(write|escribe|genera|generame|generate|crea|create|hazme|haz|make|build|implementa|implement|develop|desarrolla|programa)\b/i;

const ALLOWED = [
  // Identity / availability / contact
  /\b(santiago|avilez|perfil|portfolio|portafolio|resume|cv|bio|about|sobre\s+el|sobre\s+santiago)\b/,
  /\b(contacto|contact|linkedin|github|email|correo|remote|remoto|ubicacion|location|disponibilidad|available)\b/,

  // Experience and roles
  /\b(experiencia|experience|trabajo|work|career|rol|role|seniority|años|years|impacto|impact)\b/,
  /\b(zoada|fulbbo|lead\s+engineer|full\s+stack)\b/,

  // Skills / stack
  /\b(skill|skills|habilidades|stack|tech\s+stack|tecnologias|tecnología|tools|herramientas)\b/,
  /\b(react|next\.?js|astro|tailwind|redux|zustand|node\.?js|nestjs|express|trpc|postgres(?:ql)?|mysql|mongodb|redis|docker|aws|vercel|ci\/cd|jest|vitest|ddd|solid|clean\s+architecture)\b/,

  // AI stack (specific enough to imply the profile)
  /\b(llms?|rag|mcp|openai|tool\s+calling|function\s+calling|claude\s+code|zod|ollama)\b/,

  // Projects and education
  /\b(proyecto|project|proyectos|projects|case\s+study|portfolio\s+project)\b/,
  /\b(repo\s+rag|solucionado|laborar|melina\s+batalla|alerta\s+digital|glassy\s+europe|ieia|unco\s+activa|amcumbre)\b/,
  /\b(educacion|education|universidad|university|engineering|ingenieria|systems\s+engineering)\b/,

  // Services
  /\b(servicios|services|mantenimiento|maintenance|optimizacion|optimization|lighthouse|seo)\b/,
].map((pattern) => new RegExp(pattern.source, "i"));

// Generic AI terms only pass when the message also refers to Santiago.
const GENERIC_AI =
  /\b(ai|ia|inteligencia\s+artificial|artificial\s+intelligence|gpt|claude|embeddings?|chatbots?|agents?|agentes?)\b/i;
const PROFILE_REFERENCE = /\b(he|his|him|hizo|construyo)\b/i;

export interface ScopeEvaluationResult {
  allowed: boolean;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateScope(rawMessage: string): ScopeEvaluationResult {
  const message = normalizeText(rawMessage);
  if (message.length === 0) {
    return { allowed: false };
  }

  const guardText = message.replace(STACK_PHRASES, " ");
  const strippedStackPhrase = guardText !== message;
  const matchesBlocked =
    BLOCKED.some((pattern) => pattern.test(guardText)) ||
    (strippedStackPhrase && GENERATION_REQUEST.test(guardText));
  if (matchesBlocked) {
    return { allowed: false };
  }

  const matchesAllowed = ALLOWED.some((pattern) => pattern.test(message));
  const matchesProfileAi =
    GENERIC_AI.test(message) && PROFILE_REFERENCE.test(message);
  if (!matchesAllowed && !matchesProfileAi) {
    return { allowed: false };
  }

  return { allowed: true };
}
