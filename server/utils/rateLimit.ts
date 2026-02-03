// In-memory sliding-window rate limiter, keyed by IP.
// Limit: 3 submissions per IP per 60-minute rolling window.
// Single-instance only — fine for our Coolify deployment. Swap for Redis
// if we ever go multi-instance.

const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_HITS = 3
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000 // 10 min

const hits = new Map<string, number[]>()

let cleanupStarted = false
function startCleanupOnce() {
  if (cleanupStarted) return
  cleanupStarted = true
  setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS
    for (const [ip, timestamps] of hits) {
      const fresh = timestamps.filter(t => t > cutoff)
      if (fresh.length === 0) hits.delete(ip)
      else hits.set(ip, fresh)
    }
  }, CLEANUP_INTERVAL_MS)
}

export function checkRateLimit(ip: string): boolean {
  startCleanupOnce()
  const now = Date.now()
  const cutoff = now - WINDOW_MS
  const timestamps = (hits.get(ip) || []).filter(t => t > cutoff)
  if (timestamps.length >= MAX_HITS) {
    hits.set(ip, timestamps)
    return false
  }
  timestamps.push(now)
  hits.set(ip, timestamps)
  return true
}
