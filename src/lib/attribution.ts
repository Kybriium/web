// Lightweight UTM attribution. Captures utm_* on every page load (last-touch
// within the session) and exposes them at submit time so leads carry their
// origin. No PII; just the campaign tags the visitor brought along.

const STORAGE_KEY = "kybrium:attr";
const MAX_LEN = 200;

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const PARAM_TO_FIELD: Array<[string, keyof Attribution]> = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_content", "utmContent"],
  ["utm_term", "utmTerm"],
];

function readFromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const out: Attribution = {};
  for (const [param, field] of PARAM_TO_FIELD) {
    const v = params.get(param);
    if (v && v.length > 0) out[field] = v.slice(0, MAX_LEN);
  }
  return out;
}

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const fresh = readFromUrl();
  if (Object.keys(fresh).length === 0) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // sessionStorage may be disabled (private mode, full quota) — silently skip.
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Attribution;
    return {};
  } catch {
    return {};
  }
}
