import { Resend } from "resend";
import {
  budgetLabels,
  companySizeLabels,
  dataSensitivityLabels,
  projectTypeLabels,
  timelineLabels,
  type ContactPayload,
} from "@/lib/validation/contact";
import { site } from "@/lib/site";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nonEmpty<T>(value: T | undefined | null | ""): value is T {
  return value !== undefined && value !== null && value !== "";
}

type Line = { label: string; value: string };

function buildLines(payload: ContactPayload): Line[] {
  const lines: Line[] = [
    { label: "Name", value: payload.name },
    { label: "Company", value: payload.company },
    { label: "Email", value: payload.email },
    { label: "Budget", value: budgetLabels[payload.budget] },
    {
      label: "Project types",
      value: payload.projectTypes.map((t) => projectTypeLabels[t]).join(", "),
    },
    { label: "Brief", value: payload.brief },
  ];

  if (nonEmpty(payload.scale)) lines.push({ label: "Scale", value: payload.scale });
  if (nonEmpty(payload.dataSensitivity))
    lines.push({ label: "Data sensitivity", value: dataSensitivityLabels[payload.dataSensitivity] });
  if (nonEmpty(payload.integrations))
    lines.push({ label: "Integrations", value: payload.integrations });
  if (nonEmpty(payload.timeline))
    lines.push({ label: "Timeline", value: timelineLabels[payload.timeline] });
  if (nonEmpty(payload.companySize))
    lines.push({ label: "Company size", value: companySizeLabels[payload.companySize] });
  if (nonEmpty(payload.sector)) lines.push({ label: "Sector", value: payload.sector });
  if (nonEmpty(payload.source)) lines.push({ label: "Source", value: payload.source });

  return lines;
}

function buildEmail(payload: ContactPayload): { subject: string; text: string; html: string } {
  const lines = buildLines(payload);
  const subject = `[${site.name}] New enquiry — ${payload.name} (${payload.company})`;
  const text = lines.map((l) => `${l.label}: ${l.value}`).join("\n");
  const html = `
<!doctype html>
<html lang="en">
  <body style="font-family: -apple-system, system-ui, sans-serif; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
    <h1 style="font-size: 18px; margin: 0 0 16px;">New ${escapeHtml(site.name)} enquiry</h1>
    <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
      ${lines
        .map(
          (l) => `
        <tr>
          <td style="padding: 8px 12px 8px 0; vertical-align: top; color: #6b7280; font-size: 13px; width: 140px;">${escapeHtml(l.label)}</td>
          <td style="padding: 8px 0; vertical-align: top; font-size: 14px; white-space: pre-wrap;">${escapeHtml(l.value)}</td>
        </tr>`,
        )
        .join("")}
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

let resend: Resend | null = null;
function getClient(): Resend | null {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resend = new Resend(key);
  return resend;
}

type SendResult = { delivered: boolean; reason?: string };

export async function sendContactEmail(payload: ContactPayload): Promise<SendResult> {
  const client = getClient();
  const email = buildEmail(payload);

  if (!client) {
    // Dev / preview without keys: log shape (not full body) and pretend success.
    console.warn("[email] RESEND_API_KEY unset — skipping send");
    console.info(`[email] would send: ${email.subject}`);
    return { delivered: false, reason: "skipped-no-key" };
  }

  try {
    const { error } = await client.emails.send({
      from: `${site.name} <onboarding@resend.dev>`, // TODO(launch): swap to noreply@kybrium.com once domain is verified in Resend.
      to: [site.email],
      replyTo: payload.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    if (error) {
      console.error("[email] resend error", error.name, error.message);
      return { delivered: false, reason: error.name };
    }
    return { delivered: true };
  } catch (err) {
    console.error("[email] unexpected error", err);
    return { delivered: false, reason: "unexpected" };
  }
}
