import Clarity from "@microsoft/clarity";

const PROJECT_ID = import.meta.env.PUBLIC_CLARITY_PROJECT_ID as string | undefined;

let initialized = false;

export function initClarity(): void {
  if (initialized || !PROJECT_ID || import.meta.env.DEV) return;
  Clarity.init(PROJECT_ID);
  initialized = true;
}

/**
 * Fires a Clarity custom event. Put any varying dimension in the event name:
 * Clarity tags are session-level, so per-event values would overwrite each other.
 */
export function trackEvent(name: string): void {
  if (!initialized) return;
  try {
    Clarity.event(name);
  } catch {
    // Analytics must never break the page (blocked script, SDK failure).
  }
}
