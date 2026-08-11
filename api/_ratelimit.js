import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Reusable limiter factory — lets each endpoint define its own limit/window.
export function createRateLimiter(requests, window) {
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(requests, window),
    })
}

// Extracts the real client IP from a Vercel serverless request.
export function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for']
    return forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown'
}