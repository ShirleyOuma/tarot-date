import { createClient } from '@supabase/supabase-js'
import { createRateLimiter, getClientIp } from './_ratelimit.js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
const limiter = createRateLimiter(20, '1 h') // 20 uploads per IP per hour

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const ip = getClientIp(req)
    const { success } = await limiter.limit(ip)
    if (!success) return res.status(429).json({ error: 'Too many uploads recently. Please try again later.' })

    const { fileBase64, fileName, contentType } = req.body

    if (!fileBase64 || !fileName) {
        return res.status(400).json({ error: 'Missing file data' })
    }

    const buffer = Buffer.from(fileBase64, 'base64')

    const { error } = await supabase.storage.from('card-images').upload(fileName, buffer, {
        contentType: contentType || 'image/jpeg',
    })

    if (error) return res.status(400).json({ error: error.message })

    const { data } = supabase.storage.from('card-images').getPublicUrl(fileName)
    return res.status(200).json({ url: data.publicUrl })
}