import { supabase } from './supabaseClient';
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

export async function logRevealEvent({ cardId, deckId }) {
  const res = await fetch('/api/react', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind: 'reveal', cardId, deckId, sessionId: getSessionId() }),
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error)
  }
}

export async function logReaction({ cardId, type }) {
  const res = await fetch('/api/react', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind: 'reaction', cardId, type, sessionId: getSessionId() }),
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error)
  }
}