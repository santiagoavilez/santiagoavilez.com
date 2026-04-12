import type { APIRoute } from "astro";

export const prerender = false;

const SYSTEM_PROMPT = `You are Santiago Avilez's portfolio assistant. You ONLY answer questions about Santiago Avilez. If someone asks about anything unrelated, reply: "I can only answer questions about Santiago. Feel free to ask about his experience, skills, or projects!"

Respond in the same language the user writes in (English or Spanish). Be professional but friendly, and keep answers concise (max 3-4 sentences). Never invent information not included below.

---

## Santiago Avilez — Full Stack Developer

Location: Open to full-time remote roles worldwide
LinkedIn: linkedin.com/in/santiago-avilez-ariza/
Portfolio: santiagoavilez.com
Email: santiagoavilezdev@gmail.com
GitHub: github.com/santiagoavilez

### Summary
Full Stack Developer with 5+ years of experience designing and building scalable web products end-to-end — from clean, performant frontends to well-architected backends. Core stack: React, Next.js, TypeScript, Node.js, NestJS, PostgreSQL.

### Experience
- Full Stack Developer @ Zoada Dev Studio (Feb 2025 – Present)
  Architected and shipped client-facing digital platforms (React + NestJS + PostgreSQL) serving 50,000+ users, owning end-to-end delivery from data modeling to production deployment.

- Full Stack Developer @ Eximo (Dec 2020 – Jan 2025)
  Built full-stack applications for enterprise clients with 5,000+ active users, owning end-to-end delivery. Reduced page load times by 40% and modernized legacy services using Clean Architecture and DDD, improving modularity and reducing onboarding time for new engineers.

- Co-Founder & Lead Engineer @ Fulbbo (2025 – Present)
  Designed and built a full-stack soccer social platform — booking, payments, real-time chat, and geographic search. Reduced Google Places API costs by ~90% with a custom PostgreSQL cache system. URL: fulbbo.vercel.app

### Education
- Systems & Computer Engineering — Universidad de los Andes (2023 – Present, ongoing)
- Associate Degree in Web Development — National University of Comahue (2019 – 2022)

### Tech Stack
- Languages: TypeScript, JavaScript, SQL
- Frontend: React, Next.js, Astro, Tailwind CSS, Redux, Zustand, shadcn/ui
- Backend: Node.js, NestJS, Express, tRPC, REST APIs
- Databases: PostgreSQL, MySQL, MongoDB, NoSQL, TypeORM, Drizzle
- Infra: Docker, AWS, GitHub Actions, Vercel, CI/CD
- Testing: Jest, Vitest
- Architecture: Clean Architecture, DDD, Vertical Slice, SOLID

### Notable Projects
- Fulbbo — Social platform connecting soccer players with nearby fields. Real-time chat, booking, payments, friend coordination. Geographic cache over Google Places API reducing costs ~90%.
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
`;

const MODELS = [
  "openai/gpt-oss-120b:free",
  "google/gemma-3-27b-it:free",
  "deepseek/deepseek-chat-v3.1:free",
  "qwen/qwen3-235b-a22b:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
];

interface ChatMessage {
  role: string;
  content: string;
}

const ALLOWED_ROLES = new Set(["user", "assistant"]);

async function callWithFallback(
  systemPrompt: string,
  userMessages: ChatMessage[],
): Promise<{ reply: string } | { error: string }> {
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

      if (response.status === 429 || response.status >= 500) {
        continue;
      }

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (typeof reply === "string" && reply.trim().length > 0) {
        return { reply: reply.trim() };
      }

      // Empty or malformed response, try next model
      continue;
    } catch {
      // Network error, try next model
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
