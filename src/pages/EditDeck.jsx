import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDeckForEdit, publishDeck } from '../lib/decks'
import { createCard, deleteCard, updateCard } from '../lib/cards'
import ImageUploadField from '../components/ImageUploadField'


function EditDeck() {
    const { deckId } = useParams()
    const [editToken, setEditToken] = useState(null)
    const [deck, setDeck] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [name, setName] = useState('')
    const [quote, setQuote] = useState('')
    const [dateDescription, setDateDescription] = useState('')
    const [location, setLocation] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [vibeUrl, setVibeUrl] = useState('')
    const [saving, setSaving] = useState(false)
    const [editingCardId, setEditingCardId] = useState(null)
    const [editForm, setEditForm] = useState({})

    async function loadDeck(token) {
        setLoading(true)
        setError(null)
        try {
            const data = await getDeckForEdit(deckId, token)
            setDeck(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem(`edit_token_${deckId}`)
        if (!token) {
            setError('No edit permission found for this deck in this browser.')
            setLoading(false)
            return
        }
        setEditToken(token)
        loadDeck(token)
    }, [deckId])

    async function handleAddCard(e) {
        e.preventDefault()
        if (!name.trim()) return
        setSaving(true)
        try {
            await createCard({
                deckId,
                editToken,
                position: (deck.cards?.length || 0) + 1,
                name,
                quote: quote || null,
                dateDescription: dateDescription || null,
                location: location || null,
                imageUrl: imageUrl || null,
                vibeUrl: vibeUrl || null,
            })
            setName('')
            setQuote('')
            setDateDescription('')
            setLocation('')
            setImageUrl('')
            setVibeUrl('')
            await loadDeck(editToken)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDeleteCard(cardId, cardName) {
        const confirmed = window.confirm(`Delete "${cardName}"? This can't be undone.`)
        if (!confirmed) return

        try {
            await deleteCard(cardId, editToken)
            await loadDeck(editToken)
        } catch (err) {
            setError(err.message)
        }
    }

    async function handlePublish() {
        try {
            await publishDeck(deckId, editToken)
            await loadDeck(editToken)
        } catch (err) {
            setError(err.message)
        }
    }

    function startEditing(card) {
        setEditingCardId(card.id)
        setEditForm({
            name: card.name || '',
            quote: card.quote || '',
            dateDescription: card.date_description || '',
            location: card.location || '',
            imageUrl: card.image_url || '',
            vibeUrl: card.vibe_url || '',
        })
    }

    async function handleSaveEdit(cardId) {
        try {
            await updateCard(cardId, editToken, editForm)
            setEditingCardId(null)
            await loadDeck(editToken)
        } catch (err) {
            setError(err.message)
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
                <p className="text-red-400">{error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center gap-8">
            <div className="w-full max-w-lg flex items-center justify-between">
                <h1 className="text-xl text-emerald-950" style={{ fontFamily: "'Sekuya', system-ui" }}>{deck.title}</h1>
                <span className={`text-xs px-3 py-1 rounded-full ${deck.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                    {deck.status}
                </span>
            </div>

            {deck.status === 'published' && (
                <div className="w-full max-w-lg bg-white/5 rounded-lg p-3 font-mono text-xs break-all">
                    {window.location.origin}/d/{deck.slug}
                </div>
            )}

            {deck.status !== 'published' && (
                <button onClick={handlePublish} className="bg-amber-400 text-black rounded-lg px-6 py-2 font-semibold">
                    Publish this deck
                </button>
            )}

            <div className="w-full max-w-lg flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-white/80">Cards ({deck.cards.length})</h2>
                {deck.cards.map((card) =>
                    editingCardId === card.id ? (
                        <div key={card.id} className="bg-white/5 rounded-lg p-3 flex flex-col gap-2">
                            <input
                                value={editForm.name}
                                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="Card name"
                                className="bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <input
                                value={editForm.quote}
                                onChange={(e) => setEditForm((f) => ({ ...f, quote: e.target.value }))}
                                placeholder="Quote"
                                className="bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <textarea
                                value={editForm.dateDescription}
                                onChange={(e) => setEditForm((f) => ({ ...f, dateDescription: e.target.value }))}
                                placeholder="The date idea"
                                rows={6}
                                className="bg-white/10 rounded-lg px-3 py-2 text-lg outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                            />
                            <input
                                value={editForm.location}
                                onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                                placeholder="Location"
                                className="bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <ImageUploadField value={editForm.imageUrl} onChange={(url) => setEditForm((f) => ({ ...f, imageUrl: url }))} />
                            <input
                                value={editForm.vibeUrl}
                                onChange={(e) => setEditForm((f) => ({ ...f, vibeUrl: e.target.value }))}
                                placeholder="Vibe song — YouTube link"
                                className="bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <div className="flex gap-2 mt-1">
                                <button onClick={() => handleSaveEdit(card.id)} className="bg-amber-400 text-black rounded-lg px-4 py-2 text-sm font-semibold">
                                    Save
                                </button>
                                <button onClick={() => setEditingCardId(null)} className="text-white/50 text-sm hover:text-white">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div key={card.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{card.name}</p>
                                {card.date_description && <p className="text-xs text-white/50">{card.date_description}</p>}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => startEditing(card)} className="text-amber-400 text-xs hover:text-amber-300">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteCard(card.id, card.name)} className="text-red-400 text-xs hover:text-red-300">
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>

            <form onSubmit={handleAddCard} className="w-full max-w-lg flex flex-col gap-3 bg-white/5 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white/80">Add a card</h2>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Card name" className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
                <input value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Quote (optional)" className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
                <textarea value={dateDescription} onChange={(e) => setDateDescription(e.target.value)} placeholder="The date idea" rows={3} className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (optional)" className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
                <ImageUploadField value={imageUrl} onChange={setImageUrl} />
                <input value={vibeUrl} onChange={(e) => setVibeUrl(e.target.value)} placeholder="Vibe song — YouTube link (optional)" className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400" />
                <button type="submit" disabled={saving} className="bg-amber-400 text-black rounded-lg px-6 py-2 font-semibold disabled:opacity-50">
                    {saving ? 'Adding...' : 'Add card'}
                </button>
            </form>
        </div>
    )
}

export default EditDeck