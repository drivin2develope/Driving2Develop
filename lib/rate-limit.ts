/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Process-local by design: fine for a single-instance deployment, but on a
 * horizontally-scaled serverless platform each instance has its own counts,
 * so this is a best-effort guard, not a hard cap. A production rollout
 * across multiple regions/instances should back this with a shared store
 * (e.g. Redis/Upstash) - tracked as a known limitation, not solved here.
 */
const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= maxRequests) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}
