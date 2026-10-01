import type { APIRoute } from "astro";
import { evaluateScope } from "@lib/chatScope";

export const prerender = false;

const SYSTEM_PROMPT = `You are Santiago Avilez's portfolio assistant. You ONLY answer questions about Santiago Avilez. If someone asks about anything unrelated, reply: "I can only answer questions about Santiago. Feel free to ask about his experience, skills, or projects!"

Respond in the same language the user writes in (English or Spanish). Be professional but friendly, and keep answers concise (max 3-4 sentences). Never invent information not included below.

---

## Santiago Avilez — Senior Full-Stack Engineer

Location: Open to full-time remote roles worldwide
LinkedIn: linkedin.com/in/santiago-avilez-ariza/
Portfolio: santiagoavilez.com
Email: santiagoavilezdev@gmail.com
GitHub: github.com/santiagoavilez

### Summary
Senior Full-Stack Engineer with 5+ years of experience designing and building scalable web products end-to-end — from architecture decisions and trade-offs to production. Builds platforms that serve 100,000+ users, ships production AI features, and mentors developers along the way. Core stack: TypeScript, Node.js, NestJS, React, Next.js, PostgreSQL, AI (LLMs, RAG, MCP).

### Experience
- Full-Stack Engineer @ City of Neuquén — Digital Modernization Office (Feb 2025 – Present)
  I own architecture and technical direction for digital platforms serving 100,000+ users/year, from data modeling to production, with full autonomy.
  - Led a frontend performance refactor: load times −30%, form completion +15%
  - Built an MCP server doing RAG over the organization's repos, commits, PRs and docs (github.com/santiagoavilez/muni-mcp-repos-rag)
  - Mentor junior developers through pairing and architecture guidance
  Stack: TypeScript, React, Next.js, NestJS, PostgreSQL, Docker, Jest

- Full-Stack Engineer @ Zoada Dev Studio (Dec 2020 – Jan 2025)
  Built and shipped full-stack applications for clients in media, e-commerce, education and startups, owning delivery from DB modeling to production.
  - Chose Vertical Slice Architecture over the studio's default Clean Architecture for a platform serving 100,000+ users
  - Reduced server-side response times by 40% through NestJS query optimization
  - Integrated payment gateways and third-party APIs under real production load
  Stack: TypeScript, React, Next.js, NestJS, PostgreSQL, MySQL, Jest

- Lead Engineer @ Fulbbo (Aug 2025 – Present)
  SaaS platform connecting soccer players with nearby fields — real-time booking, match coordination and team management. Live in production; I own every architecture decision.
  - Cut Google Places API costs ~90% with a PostgreSQL geographic cache, keeping responses under 100ms
  - Enforced multi-tenant isolation with Postgres row-level security
  - Built AI search that turns natural-language queries into validated filters (GPT-4o mini, function calling, Zod)
  - Built a WhatsApp booking chatbot with LLM tool calling that maps free text to allow-listed actions
  Stack: TypeScript, Next.js, tRPC, Drizzle, Supabase, PostgreSQL, Redis, OpenAI, Vitest
  URL: fulbbo.com

### Education
- Systems & Computer Engineering — Universidad de los Andes (2023 – Present, ongoing)
- Associate Degree in Web Development — National University of Comahue (2019 – 2022)

### Tech Stack
- Languages: TypeScript, JavaScript, SQL
- Frontend: React, Next.js, Astro, Tailwind CSS, Redux, Zustand, shadcn/ui
- Backend: Node.js, NestJS, Express, tRPC, REST APIs
- AI: OpenAI, LLM Tool Calling, RAG, MCP, Zod, Claude Code
- Databases: PostgreSQL, MySQL, MongoDB, NoSQL, Redis, TypeORM, Drizzle
- Infra: Docker, GitHub Actions, Vercel, CI/CD
- Testing: Jest, Vitest
- Architecture: Clean Architecture, DDD, Vertical Slice, SOLID

### Notable Projects
- Fulbbo — Social platform connecting soccer players with nearby fields: booking, payments, match coordination and AI-powered search. Live in production.
  - Geographic cache over Google Places API (PostgreSQL + 5 km grid), reducing API costs by ~90% in high-traffic zones.
  - AI search layer (GPT-4o mini, function calling, Zod) that turns ambiguous queries into validated filters, cached in Redis.
  - WhatsApp booking chatbot with LLM tool calling that maps free text to allow-listed actions.
  - Fixed a MercadoPago webhook race condition that double-processed payments, using idempotency keys and retry logic.
- Repo RAG MCP Server — MCP server that indexes an organization's repositories (code, commits, PRs and docs) so developers can query the codebase from AI assistants like Claude Code and Cursor. Built with TypeScript, MCP SDK, Ollama embeddings, SQLite and Zod. Public: github.com/santiagoavilez/muni-mcp-repos-rag
- Solucionado App — MVP for a tech startup connecting domestic service providers with clients. Led a team of three, selected stack (Next.js, TypeScript, tRPC, Prisma), shipped end-to-end.
- Laborar — Freelance marketplace platform with real-time chat (Socket.io) and peer-to-peer review system. Next.js + Strapi CMS.
- Melina Batalla — Online course platform with dual-market payments (Mercado Pago + Lemon Squeezy), DailyMotion video integration, SQL-backed enrollment. Built with Astro + React.
- Alerta Digital — Performance and SEO optimization for a news platform. Achieved 96/100 Lighthouse score.
- Glassy Europe — Web performance and SEO optimization for a surf fashion ecommerce brand. Improved Lighthouse score to 98/100.
- IEIA — Landing page and optimization for an AI business institute. Achieved 96/100 Lighthouse score.
- Unco Activa — Registration platform for a university running event (React + Laravel + Tailwind CSS).
- AMCumbre.com — Radio station website with in-browser live stream player, Google Analytics, and automated social media publishing.

### Services
Santiago offers: web development (custom sites from scratch), web performance optimization (near-perfect Lighthouse scores), and website maintenance.

IMPORTANT: At the very end of every response, include exactly 2-3 follow-up questions the user might want to ask next, formatted as a JSON array on its own line, prefixed with "SUGGESTIONS:" — for example:
SUGGESTIONS:["What technologies did he use?","Tell me more about his role","How long did he work there?"]
Do NOT include this in the visible response text. This line must be the LAST line of your response.
`;

const MODELS = [
  "google/gemma-4-31b-it:free",
  "qwen/qwen3.8-27b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-26b-a4b-it:free",
  "thinkingmachines/inkling:free",
];

interface ChatMessage {
  role: string;
  content: string;
}

const ALLOWED_ROLES = new Set(["user", "assistant"]);

function getLastUserMessage(messages: ChatMessage[]): ChatMessage | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === "user") {
      return messages[index];
    }
  }
  return null;
}

function isSpanishText(text: string): boolean {
  return /\b(que|como|sobre|proyecto|experiencia|habilidades|stack|hola|gracias|santiago)\b/i.test(
    text,
  );
}

function buildScopeGuardPayload(spanish: boolean): {
  reply: string;
  suggestions: string[];
} {
  if (spanish) {
    return {
      reply:
        "Solo puedo responder preguntas sobre Santiago: su experiencia, skills, stack, proyectos, educación y disponibilidad laboral.",
      suggestions: [
        "¿Cuál es el stack principal de Santiago?",
        "¿Qué impacto tuvo su trabajo en Zoada Dev Studio?",
        "Cuéntame sobre Fulbbo y su rol allí",
      ],
    };
  }

  return {
    reply:
      "I can only answer questions about Santiago: his experience, skills, tech stack, projects, education, and work availability.",
    suggestions: [
      "What is Santiago's main tech stack?",
      "What impact did he have at Zoada Dev Studio?",
      "Tell me about Fulbbo and his role there",
    ],
  };
}

async function callWithFallback(
  systemPrompt: string,
  userMessages: ChatMessage[],
): Promise<{ reply: string; suggestions: string[] } | { error: string }> {
  const apiKey = import.meta.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { error: "Server misconfiguration: missing API key" };
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...userMessages,
  ];

  for (const model of MODELS) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, messages }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        console.error(
          `[chat] model ${model} failed: ${response.status} ${errorBody.slice(0, 500)}`,
        );
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (typeof reply === "string" && reply.trim().length > 0) {
        const trimmedReply = reply.trim();
        const lines = trimmedReply.split("\n");
        let suggestions: string[] = [];
        let cleanedReply = trimmedReply;

        const lastLine = lines[lines.length - 1].trim();
        if (lastLine.startsWith("SUGGESTIONS:")) {
          try {
            suggestions = JSON.parse(lastLine.slice("SUGGESTIONS:".length));
          } catch {
            suggestions = [];
          }
          cleanedReply = lines.slice(0, -1).join("\n").trim();
        }

        return { reply: cleanedReply, suggestions };
      }

      // Empty or malformed response, try next model
      console.error(`[chat] model ${model} returned empty or malformed reply`);
      continue;
    } catch (error) {
      // Network error, try next model
      console.error(`[chat] model ${model} request threw:`, error);
      continue;
    }
  }

  return { error: "AI is temporarily unavailable, please try again later" };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array is required and must not be empty" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    for (const msg of body.messages) {
      if (
        typeof msg.role !== "string" ||
        typeof msg.content !== "string"
      ) {
        return new Response(
          JSON.stringify({ error: "Invalid request: each message must have a role and content string" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!ALLOWED_ROLES.has(msg.role)) {
        return new Response(
          JSON.stringify({ error: "Invalid request: message role must be 'user' or 'assistant'" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (msg.content.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: "Invalid request: message content must not be empty" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (msg.content.length > 2000) {
        return new Response(
          JSON.stringify({ error: "Message too long: each message must be 2000 characters or less" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    const lastUserMessage = getLastUserMessage(body.messages);
    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: "Invalid request: at least one user message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const scopeEvaluation = evaluateScope(lastUserMessage.content);
    if (!scopeEvaluation.allowed) {
      const isSpanish = isSpanishText(lastUserMessage.content);
      return new Response(JSON.stringify(buildScopeGuardPayload(isSpanish)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await callWithFallback(SYSTEM_PROMPT, body.messages);

    if ("error" in result) {
      return new Response(JSON.stringify(result), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
};
