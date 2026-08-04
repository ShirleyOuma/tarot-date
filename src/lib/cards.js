import { supabase } from './supabaseClient'

// Creates a new card belonging to a deck. Returns the new card row.
export async function createCard({ deckId, position, name, imageUrl, altText, quote, dateTime, dateDescription, location, vibeUrl, unlockAt }) {
    const newCard = {
        id: crypto.randomUUID(),
        deck_id: deckId,
        position,
        name,
        image_url: imageUrl ?? null,
        alt_text: altText ?? null,
        quote: quote ?? null,
        date_time: dateTime ?? null,
        date_description: dateDescription ?? null,
        location: location ?? null,
        vibe_url: vibeUrl ?? null,
        unlock_at: unlockAt ?? null,
    }

    const { error } = await supabase
        .from('cards')
        .insert(newCard)

    if (error) throw error
    return newCard
}