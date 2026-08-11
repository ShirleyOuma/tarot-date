import { useEffect, useRef, useState } from 'react'
import { getPlaybackTarget, getMusicEmbed } from '../lib/musicEmbed'

let ytApiPromise = null
function loadYouTubeAPI() {
    if (ytApiPromise) return ytApiPromise
    ytApiPromise = new Promise((resolve) => {
        if (window.YT && window.YT.Player) return resolve(window.YT)
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
        window.onYouTubeIframeAPIReady = () => resolve(window.YT)
    })
    return ytApiPromise
}

let spotifyApiPromise = null
function loadSpotifyAPI() {
    if (spotifyApiPromise) return spotifyApiPromise
    spotifyApiPromise = new Promise((resolve) => {
        if (window.SpotifyIframeApi) return resolve(window.SpotifyIframeApi)
        const tag = document.createElement('script')
        tag.src = 'https://open.spotify.com/embed/iframe-api/v1'
        document.body.appendChild(tag)
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            window.SpotifyIframeApi = IFrameAPI
            resolve(IFrameAPI)
        }
    })
    return spotifyApiPromise
}

let soundcloudApiPromise = null
function loadSoundCloudAPI() {
    if (soundcloudApiPromise) return soundcloudApiPromise
    soundcloudApiPromise = new Promise((resolve) => {
        if (window.SC && window.SC.Widget) return resolve(window.SC)
        const tag = document.createElement('script')
        tag.src = 'https://w.soundcloud.com/player/api.js'
        tag.onload = () => resolve(window.SC)
        document.body.appendChild(tag)
    })
    return soundcloudApiPromise
}

function NativeFallback({ url }) {
    const embed = getMusicEmbed(url)
    if (!embed) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline text-sm">
                🎵 Listen to the vibe
            </a>
        )
    }
    return (
        <div className="flex flex-col gap-1 w-full max-w-xs">
            <span className="text-xs text-white/50 uppercase tracking-wide">The vibe</span>
            <div className="rounded-xl overflow-hidden border border-amber-400/30 shadow-lg shadow-black/40">
                <iframe width="100%" height={embed.height} src={embed.src} title="Vibe" allow="autoplay; encrypted-media" style={{ border: 0 }} loading="lazy" />
            </div>
        </div>
    )
}

function VibePlayer({ url }) {
    const target = getPlaybackTarget(url)
    const containerRef = useRef(null)
    const controllerRef = useRef(null)
    const [ready, setReady] = useState(false)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        if (!target) return
        let cancelled = false

        if (target.platform === 'youtube') {
            loadYouTubeAPI().then((YT) => {
                if (cancelled) return
                controllerRef.current = new YT.Player(containerRef.current, {
                    height: '200',
                    width: '200',
                    videoId: target.videoId,
                    playerVars: { playsinline: 1 },
                    events: {
                        onReady: () => setReady(true),
                        onStateChange: (e) => setPlaying(e.data === YT.PlayerState.PLAYING),
                    },
                })
            })
        }

        if (target.platform === 'spotify') {
            loadSpotifyAPI().then((IFrameAPI) => {
                if (cancelled) return
                IFrameAPI.createController(containerRef.current, { uri: target.uri, width: 300, height: 80 }, (EmbedController) => {
                    controllerRef.current = EmbedController
                    setReady(true)
                    EmbedController.addListener('playback_update', (e) => setPlaying(!e.data.isPaused))
                })
            })
        }

        if (target.platform === 'soundcloud') {
            const iframe = document.createElement('iframe')
            iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(target.url)}&auto_play=false`
            iframe.width = '300'
            iframe.height = '166'
            iframe.style.border = '0'
            containerRef.current.appendChild(iframe)

            loadSoundCloudAPI().then((SC) => {
                if (cancelled) return
                const widget = SC.Widget(iframe)
                widget.bind(SC.Widget.Events.READY, () => {
                    controllerRef.current = widget
                    setReady(true)
                })
                widget.bind(SC.Widget.Events.PLAY, () => setPlaying(true))
                widget.bind(SC.Widget.Events.PAUSE, () => setPlaying(false))
            })
        }

        return () => {
            cancelled = true
            if (controllerRef.current?.destroy) controllerRef.current.destroy()
            if (containerRef.current) containerRef.current.innerHTML = ''
        }
    }, [target?.platform, target?.videoId, target?.uri, target?.url])

    function toggle() {
        if (!controllerRef.current) return
        if (target.platform === 'youtube') {
            playing ? controllerRef.current.pauseVideo() : controllerRef.current.playVideo()
        }
        if (target.platform === 'spotify') {
            controllerRef.current.togglePlay()
        }
        if (target.platform === 'soundcloud') {
            playing ? controllerRef.current.pause() : controllerRef.current.play()
        }
    }

    if (!target) {
        return <NativeFallback url={url} />
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
                <span className="mr-2 text-xs transition-all duration-500 ease-in-out group-hover:translate-x-5.75">
                    {playing ? '❚❚' : '▶'}
                </span>
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