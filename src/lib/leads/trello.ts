import {
  budgetLabels,
  companySizeLabels,
  dataSensitivityLabels,
  projectTypeLabels,
  timelineLabels,
  type ContactPayload,
} from "@/lib/validation/contact";

type Result = { delivered: boolean; reason?: string };

function nonEmpty<T>(value: T | undefined | null | ""): value is T {
  return value !== undefined && value !== null && value !== "";
}

function attributionSummary(payload: ContactPayload): string | null {
  const parts = [
    payload.utmSource,
    payload.utmMedium,
    payload.utmCampaign,
    payload.utmContent,
    payload.utmTerm,
  ].filter((v): v is string => nonEmpty(v));
  return parts.length > 0 ? parts.join(" / ") : null;
}

function buildCardDescription(payload: ContactPayload): string {
  const lines: string[] = [];

  const source = attributionSummary(payload);
  if (source) {
    lines.push(`**Source:** ${source}`, "---", "");
  }

  lines.push(
    `**Email:** ${payload.email}`,
    `**Budget:** ${budgetLabels[payload.budget]}`,
    `**Project types:** ${payload.projectTypes
      .map((t) => projectTypeLabels[t])
      .join(", ")}`,
    "",
    "**Brief**",
    payload.brief,
  );

  const extras: string[] = [];
  if (nonEmpty(payload.scale)) extras.push(`- **Scale:** ${payload.scale}`);
  if (nonEmpty(payload.dataSensitivity))
    extras.push(`- **Data sensitivity:** ${dataSensitivityLabels[payload.dataSensitivity]}`);
  if (nonEmpty(payload.integrations))
    extras.push(`- **Integrations:** ${payload.integrations}`);
  if (nonEmpty(payload.timeline))
    extras.push(`- **Timeline:** ${timelineLabels[payload.timeline]}`);
  if (nonEmpty(payload.companySize))
    extras.push(`- **Company size:** ${companySizeLabels[payload.companySize]}`);
  if (nonEmpty(payload.sector)) extras.push(`- **Sector:** ${payload.sector}`);
  if (nonEmpty(payload.source)) extras.push(`- **Source:** ${payload.source}`);

  if (extras.length > 0) {
    lines.push("", "---", ...extras);
  }
  return lines.join("\n");
}

export async function sendLeadToTrello(
  payload: ContactPayload,
): Promise<Result> {
  const apiKey = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const listId = process.env.TRELLO_LIST_ID;

  if (!apiKey || !token || !listId) {
    console.warn("[trello] not configured — skipping");
    return { delivered: false, reason: "skipped-no-config" };
  }

  try {
    const url = new URL("https://api.trello.com/1/cards");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("token", token);
    url.searchParams.set("idList", listId);
    url.searchParams.set("name", `${payload.name} — ${payload.company}`);
    url.searchParams.set("desc", buildCardDescription(payload));
    url.searchParams.set("pos", "top");

    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[trello] http ${res.status}: ${text.slice(0, 200)}`);
      return { delivered: false, reason: `http-${res.status}` };
    }
    return { delivered: true };
  } catch (err) {
    console.error("[trello] unexpected error", err);
    return { delivered: false, reason: "unexpected" };
  }
}
