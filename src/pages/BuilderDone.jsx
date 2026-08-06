import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { publishDeck, getDeckBySlug } from '../lib/decks'
import { supabase } from '../lib/supabaseClient'

function BuilderDone() {
  const { deckId } = useParams()
  const [status, setStatus] = useState('publishing')
  const [slug, setSlug] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function run() {
      const editToken = localStorage.getItem(`edit_token_${deckId}`)
      if (!editToken) {
        setStatus('error')
        setError('No edit permission found for this deck in this browser.')
        return
      }

      try {
        await publishDeck(deckId, editToken)

        const { data, error: fetchError } = await supabase
          .from('decks')
          .select('slug')
          .eq('id', deckId)
          .single()

        if (fetchError) throw fetchError

        setSlug(data.slug)
        setStatus('done')
      } catch (err) {
        setStatus('error')
        setError(err.message)
      }
    }

    run()
  }, [deckId])

  if (status === 'publishing') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Publishing your deck...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  const shareUrl = `${window.location.origin}/d/${slug}`

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4 p-8">
      <h1 className="text-3xl font-bold text-amber-400">Your deck is live!</h1>
      <p className="text-white/70">Share this link:</p>
      <div className="bg-white/10 rounded-lg px-4 py-3 font-mono text-sm break-all max-w-md">
        {shareUrl}
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(shareUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
        className="bg-amber-400 text-black rounded-lg px-6 py-2 font-semibold"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <Link to={`/builder/${deckId}/edit`} className="text-white/50 hover:text-amber-400 text-sm underline">
        Manage this deck
      </Link>
    </div>
  )
}

export default BuilderDone