import { useState } from 'react'
import { logReaction } from '../lib/analytics'

function ReactionButtons({ cardId }) {
    const [hearted, setHearted] = useState(false)
    const [accepted, setAccepted] = useState(false)

    function handleHeart() {
        const next = !hearted
        setHearted(next)
        if (next) {
            logReaction({ cardId, type: 'heart' }).catch((err) => {
                console.error('Failed to log heart:', err)
            })
        }
    }

    function handleAccept() {
        if (accepted) return
        setAccepted(true)
        logReaction({ cardId, type: 'accept_date' }).catch((err) => {
            console.error('Failed to log accept:', err)
        })
    }

    return (
        <div className="flex items-center gap-3 mt-2">
            <button
                onClick={handleHeart}
                aria-label="Heart this card"
                className={`text-2xl transition-transform active:scale-90 ${hearted ? 'text-red-500' : 'text-white/30'
                    }`}
            >
                {hearted ? '♥' : '♡'}
            </button>

            <button
                onClick={handleAccept}
                disabled={accepted}
                className={`text-xs rounded-full px-4 py-2 font-semibold transition-colors ${accepted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-400 text-black hover:bg-amber-300'
                    }`}
            >
                {accepted ? "You're in! 🎉" : "Yes, let's do this"}
            </button>
        </div>
    )
}

export default ReactionButtons