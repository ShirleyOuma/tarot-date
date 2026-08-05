import { motion } from 'framer-motion'
import VibePlayer from './VibePlayer'

function CardDetail({ card, onBack }) {
    return (
        <div className="min-h-screen bg-[#0B0A14] flex flex-col text-white p-8 gap-10">
            <button
                onClick={onBack}
                className="self-start text-white/50 hover:text-amber-400 text-xs uppercase tracking-widest border border-white/20 rounded-full px-4 py-2 w-fit"
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
                    <div className="bg-[#f5f0e6] text-[#0B0A14] text-center text-xs font-semibold uppercase tracking-wide py-2">
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
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                            <p className="text-xs uppercase tracking-widest text-amber-400/80 mb-2">The Date Idea</p>
                            {card.date_description && <p className="text-sm text-white/90">{card.date_description}</p>}
                            {card.location && <p className="text-xs text-white/50 mt-1">{card.location}</p>}
                        </div>
                    )}

                    {card.vibe_url && <VibePlayer url={card.vibe_url} />}
                </motion.div>
            </div>
        </div>
    )
}

export default CardDetail