// Returns true if a card has a future unlock_at timestamp — i.e. it's still locked.
export function isLocked(card) {
  if (!card.unlock_at) return false
  return new Date(card.unlock_at) > new Date()
}

// Formats an unlock timestamp into something readable, e.g. "Feb 14, 2026 at 7:00 PM"
export function formatUnlockTime(unlockAt) {
  return new Date(unlockAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}