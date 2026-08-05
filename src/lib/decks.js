import { supabase } from './supabaseClient'

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
    return crypto.randomUUID()
}

// Creates a new draft deck. Returns the new deck row, including its edit_token.
export async function createDeck({ title, introNote, theme }) {
    const newDeck = {
        id: crypto.randomUUID(),
        slug: generateSlug(),
        edit_token: generateEditToken(),
        title,
        intro_note: introNote,
        theme,
        status: 'draft',
    }

    const { error } = await supabase
        .from('decks')
        .insert(newDeck)

    if (error) throw error
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