import { supabase } from './supabaseClient'

export async function createCard({ deckId, editToken, position, name, imageUrl, altText, quote, dateDescription, location, vibeUrl, unlockAt }) {
    const res = await fetch('/api/add-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            deckId,
            token: editToken,
            position,
            name,
            quote,
            dateDescription,
            location,
            imageUrl,
            altText,
            vibeUrl,
            unlockAt: unlockAt ? new Date(unlockAt).toISOString() : null,
        }),
    })

    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
    }

    const { id } = await res.json()
    return id
}

// Deletes a card. Requires the parent deck's edit_token to prove ownership.
export async function deleteCard(cardId, editToken) {
    const { error } = await supabase.rpc('delete_card', {
        card_id: cardId,
        token: editToken,
    })

    if (error) throw error
}

// Updates an existing card's fields. Requires the parent deck's edit_token.
export async function updateCard(cardId, editToken, fields) {
    const { error } = await supabase.rpc('update_card', {
        card_id: cardId,
        token: editToken,
        name: fields.name,
        quote: fields.quote ?? null,
        date_description: fields.dateDescription ?? null,
        location: fields.location ?? null,
        image_url: fields.imageUrl ?? null,
        vibe_url: fields.vibeUrl ?? null,
        unlock_at: fields.unlockAt ? new Date(fields.unlockAt).toISOString() : null,
        alt_text: fields.altText ?? null,
    })

    if (error) throw error
}