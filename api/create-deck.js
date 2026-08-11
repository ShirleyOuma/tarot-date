import { createClient } from '@supabase/supabase-js'
import { createRateLimiter, getClientIp } from './_ratelimit.js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
const limiter = createRateLimiter(5, '1 h') // 5 new decks per IP per hour

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const ip = getClientIp(req)
    const { success, remaining } = await limiter.limit(ip)

    if (!success) {
        return res.status(429).json({ error: 'Too many decks created recently. Please try again later.' })
    }

    const { id, slug, edit_token, title, intro_note, theme, status, creator_email } = req.body

    const { error } = await supabase.from('decks').insert({ id, slug, edit_token, title, intro_note, theme, status, creator_email: creator_email || null })

    if (error) {
        return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ id, slug, edit_token, title, intro_note, theme, status, remaining })
}