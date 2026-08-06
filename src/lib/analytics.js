import {supabase} from './supabaseClient';
import { generateUUID } from './uuid'

// Returns a stable anonymous ID for this browser session, creating one if it doesn't exist yet.
function getSessionId() {
  const key = 'tarotdate_session_id'
  let sessionId = sessionStorage.getItem(key)
  if (!sessionId) {
    sessionId = generateUUID()
    sessionStorage.setItem(key, sessionId)
  }
  return sessionId
}

// Logs that a specific card was revealed/opened by whoever is viewing the deck right now.
export async function logRevealEvent({ cardId, deckId }) {
  const { error } = await supabase
    .from('reveal_events')
    .insert({
      id: generateUUID(),
      card_id: cardId,
      deck_id: deckId,
      session_id: getSessionId(),
    })

  if (error) throw error
}

// Logs a reaction (heart or accepting the date) on a specific card.
export async function logReaction({ cardId, type }) {
  const { error } = await supabase
    .from('reactions')
    .insert({
      id: generateUUID(),
      card_id: cardId,
      type,
      session_id: getSessionId(),
    })

  if (error) throw error
}