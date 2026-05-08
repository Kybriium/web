import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 5 requests per IP per hour, sliding window — see CLAUDE.md §5b.
let ratelimiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (ratelimiter) return ratelimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  ratelimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: false,
    prefix: "ratelimit:contact",
  });
  return ratelimiter;
}

type Result = { success: boolean; reason?: string };

export async function checkContactRateLimit(ip: string): Promise<Result> {
  const limiter = getLimiter();
  if (!limiter) {
    // Dev / preview without Upstash creds: skip but warn.
    console.warn("[rate-limit] Upstash not configured — skipping rate limit");
    return { success: true, reason: "skipped-no-config" };
  }

  const result = await limiter.limit(ip);
  return { success: result.success, reason: result.success ? undefined : "rate-limited" };
}
