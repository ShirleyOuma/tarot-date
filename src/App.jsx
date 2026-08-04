import { useState } from 'react'
import { createDeck, getDeckBySlug } from './lib/decks'
import { createCard } from './lib/cards'

function App() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleTestCreate() {
    setError(null)
    try {
      const deck = await createDeck({
        title: 'Test Deck',
        introNote: 'Just testing the connection',
        theme: 'default',
      })
      setResult(deck)
      console.log('Created deck:', deck)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  async function handleTestFetch() {
    setError(null)
    try {
      const deck = await getDeckBySlug('22TlgdgmYf')
      setResult(deck)
      console.log('Fetched deck:', deck)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  async function handleTestCard() {
    setError(null)
    try {
      const card = await createCard({
        deckId: '4f80223e-007f-47aa-ad22-12880253c643',
        position: 1,
        name: 'The Wanderer',
        quote: 'A journey begins with a single step.',
        dateDescription: 'Coffee at that place you mentioned',
      })
      setResult(card)
      console.log('Created card:', card)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0A14] flex flex-col items-center justify-center gap-4 text-white">
      <h1 className="text-4xl font-bold text-amber-400">TarotDate</h1>
      <div className="flex gap-3">
        <button
          onClick={handleTestCreate}
          className="px-6 py-3 bg-amber-400 text-black rounded-lg font-semibold"
        >
          Test Create Deck
        </button>
        <button
          onClick={handleTestFetch}
          className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold"
        >
          Test Fetch Deck
        </button>
        <button
          onClick={handleTestCard}
          className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold"
        >
          Test Create Card
        </button>
      </div>
      {result && (
        <pre className="text-xs bg-white/10 p-4 rounded max-w-xl overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      {error && <p className="text-red-400">Error: {error}</p>}
    </div>
  )
}

export default App