import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDeckBySlug } from '../lib/decks'
import { logRevealEvent } from '../lib/analytics'
import TarotCard from '../components/TarotCard'
import CardDetail from '../components/CardDetail'

function DeckView() {
    const { slug } = useParams()
    const [deck, setDeck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)
    const [loggedCardIds, setLoggedCardIds] = useState(new Set())

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

    function handleSelectCard(card) {
        setSelectedCard(card)

        if (!loggedCardIds.has(card.id)) {
            setLoggedCardIds((prev) => new Set(prev).add(card.id))
            logRevealEvent({ cardId: card.id, deckId: deck.id }).catch((err) => {
                console.error('Failed to log reveal event:', err)
            })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <p>Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <p className="text-red-400">This deck doesn't exist or isn't published yet.</p>
            </div>
        )
    }

    if (selectedCard) {
        return <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} />
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4 p-8">
            <h1 className="text-4xl font-bold text-amber-400">{deck.title}</h1>
            {deck.intro_note && <p className="text-white/70 max-w-md text-center">{deck.intro_note}</p>}
            <p className="text-sm text-white/50">{deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}</p>
            <div className="flex flex-wrap gap-6 justify-center mt-4">
                {deck.cards.map((card) => (
                    <TarotCard key={card.id} card={card} onSelect={handleSelectCard} />
                ))}
            </div>
        </div>
    )
}

export default DeckView