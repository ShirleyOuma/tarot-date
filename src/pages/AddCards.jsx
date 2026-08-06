import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createCard } from '../lib/cards'
import ImageUploadField from '../components/ImageUploadField'

function emptyCard() {
    return { name: '', quote: '', dateDescription: '', location: '', imageUrl: '', vibeUrl: '' }
}

function AddCards() {
    const { deckId } = useParams()
    const navigate = useNavigate()
    const [cards, setCards] = useState([emptyCard()])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    function updateCard(index, field, value) {
        setCards((prev) =>
            prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
        )
    }

    function addCardRow() {
        setCards((prev) => [...prev, emptyCard()])
    }

    function removeCardRow(index) {
        setCards((prev) => prev.filter((_, i) => i !== index))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const editToken = localStorage.getItem(`edit_token_${deckId}`)
        if (!editToken) {
            setError('No edit permission found for this deck in this browser.')
            return
        }
        const validCards = cards.filter((c) => c.name.trim())
        if (validCards.length === 0) {
            setError('Add at least one card with a name.')
            return
        }
        setSubmitting(true)
        setError(null)
        try {
            // Create cards one at a time, in order, so `position` reflects the order they were added
            for (let i = 0; i < validCards.length; i++) {
                const c = validCards[i]
                await createCard({
                    deckId,
                    editToken,
                    position: i + 1,
                    name: c.name,
                    quote: c.quote || null,
                    dateDescription: c.dateDescription || null,
                    location: c.location || null,
                    imageUrl: c.imageUrl || null,
                    vibeUrl: c.vibeUrl || null,
                })
            }
            navigate(`/builder/${deckId}/done`)
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-amber-400">Add your cards</h1>

                {cards.map((card, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 flex flex-col gap-2 relative">
                        {cards.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeCardRow(index)}
                                className="absolute top-2 right-2 text-white/40 hover:text-red-400 text-sm"
                            >
                                Remove
                            </button>
                        )}
                        <input
                            type="text"
                            value={card.name}
                            onChange={(e) => updateCard(index, 'name', e.target.value)}
                            placeholder="Card name (e.g. The Wanderer)"
                            className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <input
                            type="text"
                            value={card.quote}
                            onChange={(e) => updateCard(index, 'quote', e.target.value)}
                            placeholder="A short quote (optional)"
                            className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <textarea
                            value={card.dateDescription}
                            onChange={(e) => updateCard(index, 'dateDescription', e.target.value)}
                            placeholder="The date idea (e.g. 7:00 PM: dinner at... 9:00 PM: walk along...)"
                            className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                            rows={3}
                        />
                        <input
                            type="text"
                            value={card.location}
                            onChange={(e) => updateCard(index, 'location', e.target.value)}
                            placeholder="Location (optional)"
                            className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <ImageUploadField value={card.imageUrl} onChange={(url) => updateCard(index, 'imageUrl', url)} />
                        <input
                            type="text"
                            value={card.vibeUrl}
                            onChange={(e) => updateCard(index, 'vibeUrl', e.target.value)}
                            placeholder="Vibe song — paste a YouTube link (optional)"
                            className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addCardRow}
                    className="bg-white/10 rounded-lg px-4 py-2 self-start text-sm"
                >
                    + Add another card
                </button>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-amber-400 text-black rounded-lg px-6 py-3 font-semibold disabled:opacity-50"
                >
                    {submitting ? 'Saving...' : 'Save cards'}
                </button>
            </form>
        </div>
    )
}

export default AddCards