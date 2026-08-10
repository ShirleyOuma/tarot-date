import { motion } from 'framer-motion'
import VibePlayer from './VibePlayer'
import ReactionButtons from './ReactionButtons'
import { isLocked, formatUnlockTime } from '../lib/locking'

function CardDetail({ card, onBack }) {
    if (isLocked(card)) {
        return (
            <div className="min-h-screen flex flex-col text-white p-8 gap-10 items-center justify-center text-center">
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 text-white/50 hover:text-amber-400 text-xs uppercase tracking-widest border border-white/20 rounded-full px-4 py-2"
                >
                    ← Return to deck
                </button>
                <span className="text-5xl">🔒</span>
                <h1 className="text-3xl text-amber-400" style={{ fontFamily: "'Griffy', system-ui" }}>{card.name}</h1>
                <p className="text-white/60">This card unlocks on</p>
                <p className="text-lg text-amber-300">{formatUnlockTime(card.unlock_at)}</p>
            </div>
        )
    }
    return (
        <div className="min-h-screen flex flex-col text-white p-8 gap-10">
            <button
                onClick={onBack}
                className="self-start text-white/50 hover:text-amber-400 text-xs uppercase font-serif tracking-widest px-4 py-2 w-fit"
            >
                ← Return to deck
            </button>

            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-10 max-w-3xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20, rotate: -4 }}
                    animate={{ opacity: 1, y: 0, rotate: -2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-52 aspect-2/3 shrink-0 rounded-xl overflow-hidden border-2 border-[#f5f0e6] bg-[#f5f0e6] shadow-2xl shadow-black/60 flex flex-col"
                >
                    <div className="flex-1 bg-linear-to-br from-indigo-900 to-[#0B0A14] flex items-center justify-center overflow-hidden">
                        {card.image_url ? (
                            <img src={card.image_url} alt={card.alt_text || card.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl text-amber-300/70">✦</span>
                        )}
                    </div>
                    <div className="bg-[#f5f0e6] text-[#0B0A14] text-center text-xs uppercase tracking-wide py-2" style={{ fontFamily: "'Griffy', system-ui" }}>
                        {card.name}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                    className="flex flex-col gap-4 text-center sm:text-left"
                >
                    <h1 className="text-5xl text-red-500" style={{ fontFamily: "'Caveat', cursive" }}>
                        {card.name}
                    </h1>
                    {card.quote && (
                        <p className="text-lg text-white/80 italic" style={{ fontFamily: "'Caveat', cursive" }}>
                            {card.quote}
                        </p>
                    )}

                    {(card.date_description || card.location) && (
                        <div className="bg-slate-950 border border-white/10 rounded-sm p-4 text-left">
                            <p className="text-xs uppercase tracking-widest text-white font-bold mb-2">
                                The Date Idea
                            </p>

                            {card.date_description && (
                                <p className="text-sm text-white/90 font-serif whitespace-pre-wrap">
                                    {card.date_description}
                                </p>
                            )}

                            {card.location && (
                                <p className="text-xs text-white/50 mt-1">
                                    {card.location}
                                </p>
                            )}
                        </div>
                    )}

                    {card.vibe_url && <VibePlayer url={card.vibe_url} />}
                    <ReactionButtons cardId={card.id} />
                </motion.div>
            </div>
        </div>
    )
}

export default CardDetail