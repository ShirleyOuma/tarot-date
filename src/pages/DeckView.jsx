import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDeckBySlug } from '../lib/decks'

function DeckView() {
    const { slug } = useParams()
    const [deck, setDeck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function fetchDeck() {
            setLoading(true)
            setError(null)
            try {
                const data = await getDeckBySlug(slug)
                if (!cancelled) setDeck(data)
            } catch (err) {
                if (!cancelled) setError(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchDeck()

        return () => {
            cancelled = true
        }
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0A14] flex items-center justify-center text-white">
                <p>Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0B0A14] flex items-center justify-center text-white">
                <p className="text-red-400">This deck doesn't exist or isn't published yet.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0B0A14] flex flex-col items-center justify-center text-white gap-4 p-8">
            <h1 className="text-4xl font-bold text-amber-400">{deck.title}</h1>
            {deck.intro_note && <p className="text-white/70 max-w-md text-center">{deck.intro_note}</p>}
            <p className="text-sm text-white/50">{deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}</p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
                {deck.cards.map((card) => (
                    <div key={card.id} className="bg-white/10 rounded-lg p-4 w-40">
                        <p className="font-semibold">{card.name}</p>
                        {card.date_description && <p className="text-xs text-white/60 mt-2">{card.date_description}</p>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DeckView