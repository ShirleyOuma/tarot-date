import { useState } from 'react'
import { createDeck } from './lib/decks'

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

  return (
    <div className="min-h-screen bg-[#0B0A14] flex flex-col items-center justify-center gap-4 text-white">
      <h1 className="text-4xl font-bold text-amber-400">TarotDate</h1>
      <button
        onClick={handleTestCreate}
        className="px-6 py-3 bg-amber-400 text-black rounded-lg font-semibold"
      >
        Test Create Deck
      </button>
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