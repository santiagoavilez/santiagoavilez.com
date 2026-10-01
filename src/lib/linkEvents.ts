const SOCIAL_HOSTS: Record<string, string> = {
  "linkedin.com": "linkedin",
  "github.com": "github",
  "instagram.com": "instagram",
  "tiktok.com": "tiktok",
};

const MAX_SLUG = 40;
const HASH_LENGTH = 6;

function shortHash(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36).padStart(HASH_LENGTH, "0").slice(-HASH_LENGTH);
}

/**
 * Turns free text into a safe, bounded suffix for an event name.
 * Never empty ("other" fallback); truncated texts keep a hash so long inputs sharing a prefix stay distinct.
 */
export function slug(text: string): string {
  const normalized = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!normalized) return "other";
  if (normalized.length <= MAX_SLUG) return normalized;
  return `${normalized.slice(0, MAX_SLUG - HASH_LENGTH - 1)}_${shortHash(normalized)}`;
}

/**
 * Maps a clicked href to Clarity event names. The varying dimension (source, host)
 * lives in the event name because Clarity tags are session-level and later values overwrite earlier ones.
 */
export function classifyLink(href: string, origin: string, source: string): string[] {
  if (!href) return [];

  if (href.toLowerCase().endsWith(".pdf")) {
    return ["cv_download", `cv_download_${slug(source)}`];
  }
  if (href.startsWith("mailto:")) {
    return ["email_click"];
  }

  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return [];
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return [];

  if (url.origin === origin) {
    return /^\/(projects|blog)\//.test(url.pathname) ? ["project_or_post_open"] : [];
  }

  const host = url.hostname.replace(/^www\./, "");
  const network = SOCIAL_HOSTS[host];
  if (network) return [`social_click_${network}`];

  return ["external_link_click", `external_link_click_${slug(host)}`];
}
