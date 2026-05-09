import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/email/contact";
import { sendLeadToTrello } from "@/lib/leads/trello";

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // Fail fast on abusive sources before doing any work.
  const rl = await checkContactRateLimit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { ok: false, reason: "rate-limited" },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid-json" },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "invalid" },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  // Honeypot tripped — accept silently so bots can't tell the trap is being read.
  if (payload.honeypot && payload.honeypot.length > 0) {
    console.info("[contact] honeypot triggered");
    return NextResponse.json({ ok: true });
  }

  const turnstile = await verifyTurnstile(
    payload.turnstileToken || undefined,
    ip,
  );
  if (!turnstile.success) {
    return NextResponse.json(
      { ok: false, reason: "turnstile-failed" },
      { status: 400 },
    );
  }

  // Email is the source of truth; Trello is a convenience surface. Run in
  // parallel so the form response stays tight, and fail open on Trello so a
  // downed Trello never blocks a real lead.
  const [emailSettled, trelloSettled] = await Promise.allSettled([
    sendContactEmail(payload),
    sendLeadToTrello(payload),
  ]);

  const send =
    emailSettled.status === "fulfilled"
      ? emailSettled.value
      : { delivered: false, reason: "exception" };

  if (!send.delivered && send.reason !== "skipped-no-key") {
    return NextResponse.json(
      { ok: false, reason: "send-failed" },
      { status: 502 },
    );
  }

  const trelloDelivered =
    trelloSettled.status === "fulfilled" && trelloSettled.value.delivered;

  // Log shape only — never the body — so we know enquiries are arriving.
  console.info(
    `[contact] accepted ip=${ip.slice(0, 7)}… types=${payload.projectTypes.length} email=${send.delivered} trello=${trelloDelivered}`,
  );

  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
