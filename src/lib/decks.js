import { supabase } from './supabaseClient'
import { generateUUID } from './uuid'

// Generating a random, url=safe slug for new deck's public link
function generateSlug(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

//Generating a random secret token, used to prove deck ownership without login
function generateEditToken() {
    return generateUUID()
}

export async function createDeck({ title, introNote, theme }) {
    const newDeck = {
        id: generateUUID(),
        slug: generateSlug(),
        edit_token: generateEditToken(),
        title,
        intro_note: introNote,
        theme,
        status: 'draft',
    }

    const res = await fetch('/api/create-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDeck),
    })

    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
    }

    return newDeck
}

//Fetching a published deck (and its cards) by its public slug
export async function getDeckBySlug(slug) {
    const { data: deck, error: deckError } = await supabase
        .from('decks')
        .select('*')
        .eq('slug', slug)
        .single()

    if (deckError) throw deckError

    const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deck.id)
        .order('position', { ascending: true })

    if (cardsError) throw cardsError

    return { ...deck, cards }
}

// Marks a deck as published, using its edit_token to prove ownership.
export async function publishDeck(deckId, editToken) {
    const { error } = await supabase.rpc('publish_deck', {
        deck_id: deckId,
        token: editToken,
    })

    if (error) throw error
}

// Fetches a deck (draft or published) plus its cards, using edit_token to prove ownership.
export async function getDeckForEdit(deckId, editToken) {
    const { data, error } = await supabase.rpc('get_deck_for_edit', {
        deck_id: deckId,
        token: editToken,
    })

    if (error) throw error
    return data
}

// Takes a published deck offline. The share link stops working immediately,
export async function unpublishDeck(deckId, editToken) {
    const { error } = await supabase.rpc('unpublish_deck', {
        deck_id: deckId,
        token: editToken,
    })

    if (error) throw error
}

// Fetches per-card engagement stats (reveals, hearts, accepts) for a deck.
export async function getDeckAnalytics(deckId, editToken) {
    const { data, error } = await supabase.rpc('get_deck_analytics', {
        deck_id: deckId,
        token: editToken,
    })

    if (error) throw error
    return data
}

