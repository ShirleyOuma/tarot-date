import { isLocked } from '../lib/locking'

function TarotCard({ card, onSelect }) {
  const locked = isLocked(card)

  return (
    <div
      onClick={() => onSelect(card)}
      className="w-36 sm:w-44 aspect-2/3 cursor-pointer rounded-sm overflow-hidden border-2 border-[#f5f0e6] bg-[#f5f0e6] shadow-lg shadow-black/50 animate-[float_4s_ease-in-out_infinite] flex flex-col"
    >
      <div
        className={`flex-1 flex items-center justify-center overflow-hidden relative ${locked || !card.image_url ? 'bg-cover bg-center' : ''
          }`}
        style={locked || !card.image_url ? { backgroundImage: "url('/manage-deck-bg.jpg')" } : undefined}
      >
        {(locked || !card.image_url) && <div className="absolute inset-0 bg-black/60" />}
        {locked ? (
          <span className="text-4xl relative z-10">🔒</span>
        ) : card.image_url ? (
          <img src={card.image_url} alt={card.alt_text || card.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl text-amber-300/70 relative z-10">✦</span>
        )}
      </div>
      <div className="bg-[#f5f0e6] text-[#0B0A14] text-center text-sm uppercase tracking-wide py-1.5 px-1" style={{ fontFamily: "'Griffy', system-ui" }}>
        {card.name}
      </div>
    </div>
  )
}

export default TarotCard