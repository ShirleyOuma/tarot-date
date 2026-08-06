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
                height: '200',
                width: '200',
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
        <div className="flex items-center gap-3 bg-[#C9BEFF] font-extrabold border-white/10 rounded-[60%_40%_60%_40%/40%_60%_40%_60%] px-2 py-2 w-fit">
            <div ref={containerRef} style={{ width: 1, height: 1, overflow: 'hidden', position: 'absolute' }} />

            <button
                onClick={toggle}
                disabled={!ready}
                className="
      relative overflow-hidden inline-flex items-center justify-center 
      w-30 h-10 px-3 
      bg-[#15ccbe] text-white text-[14px] uppercase text-center font-normal tracking-[1px] font-['Istok_Web'] [text-shadow:0_1px_0_rgba(0,0,0,0.3)]
      border border-[#0f988e] rounded-[3px] outline-none select-none cursor-pointer 
      translate-y-0 transition-all duration-150 ease-in-out group
      disabled:opacity-40 disabled:pointer-events-none
      [box-shadow:inset_0_30px_30px_-15px_rgba(255,255,255,0.1),_inset_0_0_0_1px_rgba(255,255,255,0.3),_inset_0_1px_20px_rgba(0,0,0,0),_0_3px_0_#0f988e,0_3px_2px_rgba(0,0,0,0.2),_0_5px_10px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]
      
      active:translate-y-0.75 
      active:[box-shadow:inset_0_16px_2px_-15px_rgba(0,0,0,0),_inset_0_0_0_1px_rgba(255,255,255,0.15),_inset_0_1px_20px_rgba(0,0,0,0.1),_0_0_0_#0f988e,0_0_0_2px_rgba(255,255,255,0.5),_0_0_0_rgba(0,0,0,0),_0_0_0_rgba(0,0,0,0)]
    "
            >
                {/* The Icon Element (Play / Pause symbols) */}
                <span className="mr-2 text-xs transition-all duration-500 ease-in-out group-hover:translate-x-5.75">
                    {playing ? '❚❚' : '▶'}
                </span>

                {/* The Text Element */}
                <span className="text-xs transition-all duration-500 ease-in-out group-hover:translate-x-20 whitespace-nowrap">
                    {playing ? 'Pause' : 'Play'}
                </span>
            </button>

            <span className="text-xs text-white/60">
                {playing ? 'Vibe playing' : ready ? 'Play the vibe' : 'Loading vibe...'}
            </span>
        </div>

    )
}

export default VibePlayer