import { createClient } from '@supabase/supabase-js'
import { createRateLimiter, getClientIp } from './_ratelimit.js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
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

        // Notify the creator, if they gave an email — failures here shouldn't break the reaction itself
        try {
            const { data: card, error: cardError } = await supabase.from('cards').select('name, deck_id').eq('id', cardId).single()
            if (cardError) console.error('Email step: failed to fetch card', cardError)

            if (card) {
                const { data: deck, error: deckError } = await supabase.from('decks').select('title, creator_email').eq('id', card.deck_id).single()
                if (deckError) console.error('Email step: failed to fetch deck', deckError)

                console.log('Email step: deck lookup result', deck)

                if (deck?.creator_email) {
                    const action = type === 'heart' ? 'hearted' : 'accepted the date on'
                    const { data: emailData, error: emailError } = await resend.emails.send({
                        from: 'TarotDate <onboarding@resend.dev>',
                        to: deck.creator_email,
                        subject: `Someone ${action} "${card.name}"! 💌`,
                        html: `<p>Good news — someone just ${action} <strong>${card.name}</strong> in your deck "<strong>${deck.title}</strong>".</p>`,
                    })

                    if (emailError) {
                        console.error('Resend rejected the email:', emailError)
                    } else {
                        console.log('Email sent successfully:', emailData)
                    }
                }
            }
        } catch (emailErr) {
            console.error('Failed to send notification email:', emailErr)
        }

        return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Invalid kind' })
}