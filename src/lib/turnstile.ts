// Cloudflare Turnstile server-side verification.
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type VerifyResult = { success: boolean; reason?: string };

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Dev / preview without keys: skip verification but log so it's visible.
  // Production deploys must set TURNSTILE_SECRET_KEY for this branch to be unreachable.
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY unset — skipping verification");
    return { success: true, reason: "skipped-no-secret" };
  }

  if (!token) {
    return { success: false, reason: "missing-token" };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (data.success) return { success: true };
    return { success: false, reason: data["error-codes"]?.join(",") ?? "unknown" };
  } catch {
    return { success: false, reason: "network-error" };
  }
}
