export const FREE_ROUTER = "openrouter/free";

const MODELS_URL = "https://openrouter.ai/api/v1/models";
const CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_FALLBACKS = 4;

interface OpenRouterModel {
  id: string;
  pricing?: { prompt?: string; completion?: string };
  architecture?: { output_modalities?: string[] };
}

// Picks currently-free text chat models; classifier models (safety/guard) can't answer chat.
export function pickFreeModels(models: OpenRouterModel[]): string[] {
  return models
    .filter(
      (m) =>
        m.id !== FREE_ROUTER &&
        m.id.endsWith(":free") &&
        m.pricing?.prompt === "0" &&
        m.pricing?.completion === "0" &&
        (m.architecture?.output_modalities?.includes("text") ?? true) &&
        !/safety|guard/i.test(m.id),
    )
    .map((m) => m.id)
    .slice(0, MAX_FALLBACKS);
}

let cache: { ids: string[]; at: number } | null = null;

// OpenRouter's own free router first, then live free models as fallbacks.
export async function getFreeModels(): Promise<string[]> {
  if (!cache || Date.now() - cache.at > CACHE_TTL_MS) {
    try {
      const response = await fetch(MODELS_URL);
      if (!response.ok) throw new Error(`status ${response.status}`);
      const { data } = await response.json();
      cache = { ids: pickFreeModels(Array.isArray(data) ? data : []), at: Date.now() };
    } catch (error) {
      console.error("[chat] could not refresh free model list:", error);
    }
  }
  return [FREE_ROUTER, ...(cache?.ids ?? [])];
}
