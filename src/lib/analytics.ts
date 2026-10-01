import Clarity from "@microsoft/clarity";

const PROJECT_ID = import.meta.env.PUBLIC_CLARITY_PROJECT_ID as string | undefined;

let initialized = false;

export function initClarity(): void {
  if (initialized || !PROJECT_ID || import.meta.env.DEV) return;
  Clarity.init(PROJECT_ID);
  initialized = true;
}

/** Fires a Clarity custom event; optional tags make it filterable in the dashboard. */
export function trackEvent(name: string, tags?: Record<string, string>): void {
  if (!initialized) return;
  Clarity.event(name);
  if (tags) {
    for (const [key, value] of Object.entries(tags)) {
      Clarity.setTag(key, value);
    }
  }
}
