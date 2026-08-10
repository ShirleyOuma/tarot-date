import { supabase } from './supabaseClient'

// Creates a new card under a deck. Requires the deck's edit_token to prove ownership.
export async function createCard({ deckId, editToken, position, name, imageUrl, altText, quote, dateDescription, location, vibeUrl, unlockAt }) {
    const { data, error } = await supabase.rpc('add_card', {
        deck_id: deckId,
        token: editToken,
        card_position: position,
        name,
        quote: quote ?? null,
        date_description: dateDescription ?? null,
        location: location ?? null,
        image_url: imageUrl ?? null,
        alt_text: altText ?? null,
        vibe_url: vibeUrl ?? null,
        unlock_at: unlockAt ? new Date(unlockAt).toISOString() : null,
    })

    if (error) throw error
    return data // the new card's id
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