import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDeck } from '../lib/decks'

function CreateDeck() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [introNote, setIntroNote] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!title.trim()) {
            setError('Please give your deck a title.')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const deck = await createDeck({ title, introNote, theme: 'default' })
            localStorage.setItem(`edit_token_${deck.id}`, deck.edit_token)
            navigate(`/builder/${deck.id}/cards`)
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-amber-400 mb-2">Create a Deck</h1>

                <label className="flex flex-col gap-1">
                    <span className="text-sm text-white/70">Deck title</span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="For My Favorite Person"
                        className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm text-white/70">Intro note (optional)</span>
                    <textarea
                        value={introNote}
                        onChange={(e) => setIntroNote(e.target.value)}
                        placeholder="A little message they'll see before they start flipping cards"
                        className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                        rows={3}
                    />
                </label>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-amber-400 text-black rounded-lg px-6 py-3 font-semibold disabled:opacity-50"
                >
                    {submitting ? 'Creating...' : 'Continue to add cards'}
                </button>
            </form>
        </div>
    )
}

export default CreateDeck

