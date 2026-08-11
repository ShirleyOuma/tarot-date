import { createClient } from '@supabase/supabase-js'
import { createRateLimiter, getClientIp } from './_ratelimit.js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
const limiter = createRateLimiter(60, '10 m') // 60 reactions/reveals per IP per 10 minutes

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const ip = getClientIp(req)
    const { success } = await limiter.limit(ip)
    if (!success) return res.status(429).json({ error: 'Too many requests. Please slow down.' })

    const { kind, cardId, deckId, type, sessionId } = req.body

    if (kind === 'reveal') {
        const { error } = await supabase.from('reveal_events').insert({
            id: crypto.randomUUID(),
            card_id: cardId,
            deck_id: deckId,
            session_id: sessionId,
        })
        if (error) return res.status(400).json({ error: error.message })
        return res.status(200).json({ ok: true })
    }

    if (kind === 'reaction') {
        const { error } = await supabase.from('reactions').insert({
            id: crypto.randomUUID(),
            card_id: cardId,
            type,
            session_id: sessionId,
        })
        if (error) return res.status(400).json({ error: error.message })
        return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Invalid kind' })
}