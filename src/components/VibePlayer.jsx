import { useEffect, useRef, useState } from 'react'
import { extractYouTubeId } from '../lib/youtube'

let apiLoadPromise = null

// Loads YouTube's IFrame Player API script exactly once, no matter how many
// VibePlayer instances exist on the page — subsequent calls reuse the same promise.
function loadYouTubeAPI() {
    if (apiLoadPromise) return apiLoadPromise

    apiLoadPromise = new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            resolve(window.YT)
            return
        }
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
        window.onYouTubeIframeAPIReady = () => resolve(window.YT)
    })

    return apiLoadPromise
}

function VibePlayer({ url }) {
    const videoId = extractYouTubeId(url)
    const containerRef = useRef(null)
    const playerRef = useRef(null)
    const [ready, setReady] = useState(false)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        if (!videoId) return
        let cancelled = false

        loadYouTubeAPI().then((YT) => {
            if (cancelled) return
            playerRef.current = new YT.Player(containerRef.current, {
                height: '0',
                width: '0',
                videoId,
                playerVars: { playsinline: 1 },
                events: {
                    onReady: () => setReady(true),
                    onStateChange: (e) => setPlaying(e.data === YT.PlayerState.PLAYING),
                },
            })
        })

        return () => {
            cancelled = true
            if (playerRef.current?.destroy) playerRef.current.destroy()
        }
    }, [videoId])

    function toggle() {
        if (!playerRef.current) return
        playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
    }

    if (!videoId) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline text-sm">
                Listen to the vibe
            </a>
        )
    }

    return (
        <div className="flex items-center gap-3 bg-white/5 border border-amber-400/20 rounded-full px-4 py-2 w-fit">
            <div ref={containerRef} style={{ display: 'none' }} />
            <button onClick={toggle} disabled={!ready} className="text-amber-400 disabled:opacity-40">
                {playing ? '❚❚' : '▶'}
            </button>
            <span className="text-xs text-white/60">
                {playing ? 'Vibe playing' : ready ? 'Play the vibe' : 'Loading vibe...'}
            </span>
        </div>
    )
}

export default VibePlayer