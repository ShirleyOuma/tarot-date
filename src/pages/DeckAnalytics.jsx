import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDeckAnalytics } from '../lib/decks'

function DeckAnalytics() {
    const { deckId } = useParams()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem(`edit_token_${deckId}`)
        if (!token) {
            setError('No edit permission found for this deck in this browser.')
            setLoading(false)
            return
        }

        getDeckAnalytics(deckId, token)
            .then(setStats)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [deckId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p className="text-red-400">{error}</p>
            </div>
        )
    }

    const totalReveals = stats.reduce((sum, c) => sum + c.reveal_count, 0)
    const totalHearts = stats.reduce((sum, c) => sum + c.heart_count, 0)
    const totalAccepts = stats.reduce((sum, c) => sum + c.accept_count, 0)

    return (
        <div className="min-h-screen text-white p-8 flex flex-col items-center gap-8">
            <Link
                to={`/builder/${deckId}/edit`}
                className="self-start text-white/50 hover:text-amber-400 text-xs uppercase tracking-widest border border-white/20 rounded-full px-4 py-2"
            >
                ← Back to manage deck
            </Link>

            <h1 className="text-2xl sm:text-3xl text-amber-400" style={{ fontFamily: "'Griffy', system-ui" }}>
                Deck Insights
            </h1>

            <div className="w-full max-w-lg grid grid-cols-3 gap-3 text-center">
                <div className="bg-black/60 border border-amber-400/20 rounded-lg p-4">
                    <p className="text-2xl font-bold text-amber-400">{totalReveals}</p>
                    <p className="text-xs text-white/50 mt-1">Card opens</p>
                </div>
                <div className="bg-black/60 border border-amber-400/20 rounded-lg p-4">
                    <p className="text-2xl font-bold text-red-400">{totalHearts}</p>
                    <p className="text-xs text-white/50 mt-1">Hearts</p>
                </div>
                <div className="bg-black/60 border border-amber-400/20 rounded-lg p-4">
                    <p className="text-2xl font-bold text-emerald-400">{totalAccepts}</p>
                    <p className="text-xs text-white/50 mt-1">Accepted</p>
                </div>
            </div>

            <div className="w-full max-w-lg flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-white/80">Per card</h2>
                {stats.length === 0 && (
                    <p className="text-white/50 text-sm">No cards yet.</p>
                )}
                {stats.map((card) => (
                    <div key={card.card_id} className="bg-black/60 border border-amber-400/20 rounded-lg p-3 flex items-center justify-between">
                        <p className="font-semibold">{card.name}</p>
                        <div className="flex gap-4 text-sm text-white/70">
                            <span>👁 {card.reveal_count}</span>
                            <span>♥ {card.heart_count}</span>
                            <span>✓ {card.accept_count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DeckAnalytics