import { createClient } from '@supabase/supabase-js'
import { createRateLimiter, getClientIp } from './_ratelimit.js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
const limiter = createRateLimiter(30, '1 h') // 30 cards per IP per hour

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const ip = getClientIp(req)
    const { success } = await limiter.limit(ip)
    if (!success) return res.status(429).json({ error: 'Too many cards created recently. Please try again later.' })

    const { deckId, token, position, name, quote, dateDescription, location, imageUrl, altText, vibeUrl, unlockAt } = req.body

    const { data, error } = await supabase.rpc('add_card', {
        deck_id: deckId,
        token,
        card_position: position,
        name,
        quote: quote ?? null,
        date_description: dateDescription ?? null,
        location: location ?? null,
        image_url: imageUrl ?? null,
        alt_text: altText ?? null,
        vibe_url: vibeUrl ?? null,
        unlock_at: unlockAt ?? null,
    })

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ id: data })
}