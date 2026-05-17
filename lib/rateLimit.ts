/**
 * In-memory sliding-window rate limiter.
 *
 * Two tiers:
 *   1. Per-minute  — prevents burst abuse
 *   2. Per-hour    — prevents sustained abuse
 *
 * State lives in the Node.js process (no Redis needed for a portfolio site).
 * Entries are automatically evicted once all timestamps inside them expire,
 * so memory usage stays bounded.
 */

interface WindowEntry {
  minuteHits: number[];   // unix-ms timestamps of hits in the last 60 s
  hourHits:   number[];   // unix-ms timestamps of hits in the last 3600 s
}

// Singleton Map — survives across requests in the same server process
const store = new Map<string, WindowEntry>();

const MINUTE_MS = 60_000;
const HOUR_MS   = 3_600_000;

/** How many requests each IP may send per window */
export const LIMITS = {
  perMinute: 10,
  perHour:   50,
} as const;

/**
 * Check and record a request from the given key (usually an IP address).
 *
 * @returns `{ allowed, remaining, resetInSeconds }`
 *   - `allowed`         — whether the request should proceed
 *   - `remaining`       — lowest remaining capacity across both windows
 *   - `resetInSeconds`  — seconds until the most-restrictive window resets
 */
export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
} {
  const now = Date.now();

  const entry: WindowEntry = store.get(key) ?? { minuteHits: [], hourHits: [] };

  // Evict expired timestamps
  entry.minuteHits = entry.minuteHits.filter((t) => now - t < MINUTE_MS);
  entry.hourHits   = entry.hourHits.filter((t)   => now - t < HOUR_MS);

  const minuteCount = entry.minuteHits.length;
  const hourCount   = entry.hourHits.length;

  const minuteRemaining = LIMITS.perMinute - minuteCount;
  const hourRemaining   = LIMITS.perHour   - hourCount;

  const allowed = minuteRemaining > 0 && hourRemaining > 0;

  if (allowed) {
    entry.minuteHits.push(now);
    entry.hourHits.push(now);
  }

  store.set(key, entry);

  // Evict entirely if both windows are empty to keep the Map small
  if (entry.minuteHits.length === 0 && entry.hourHits.length === 0) {
    store.delete(key);
  }

  // Reset time: when does the oldest hit in the blocking window expire?
  let resetInSeconds = 0;
  if (!allowed) {
    if (minuteRemaining <= 0 && entry.minuteHits.length > 0) {
      resetInSeconds = Math.ceil((MINUTE_MS - (now - entry.minuteHits[0])) / 1000);
    } else if (hourRemaining <= 0 && entry.hourHits.length > 0) {
      resetInSeconds = Math.ceil((HOUR_MS - (now - entry.hourHits[0])) / 1000);
    }
  }

  return {
    allowed,
    remaining: Math.min(minuteRemaining, hourRemaining),
    resetInSeconds,
  };
}
