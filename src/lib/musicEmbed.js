// Detects which platform a URL belongs to and returns everything needed to embed it.
// Returns null if the URL doesn't match any supported platform.
export function getMusicEmbed(url) {
    if (!url) return null

    // YouTube
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (yt) {
        return {
            platform: 'youtube',
            src: `https://www.youtube.com/embed/${yt[1]}?playsinline=1`,
            height: 180,
        }
    }

    // Spotify — tracks, albums, playlists, episodes, shows
    const sp = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/)
    if (sp) {
        return {
            platform: 'spotify',
            src: `https://open.spotify.com/embed/${sp[1]}/${sp[2]}`,
            height: 152,
        }
    }

    // SoundCloud — accepts the original URL as a query param, no ID extraction needed
    if (/soundcloud\.com\//.test(url)) {
        return {
            platform: 'soundcloud',
            src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23f59e0b&auto_play=false&show_user=true`,
            height: 166,
        }
    }

    // Apple Music — same URL, just swap the domain to Apple's embed subdomain
    if (/music\.apple\.com\//.test(url)) {
        return {
            platform: 'apple',
            src: url.replace('music.apple.com', 'embed.music.apple.com'),
            height: 175,
        }
    }

    return null
}

// Determines which platform a link belongs to and what's needed to control playback externally.
// Returns null for Apple Music / unrecognized links
export function getPlaybackTarget(url) {
    if (!url) return null

    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (yt) return { platform: 'youtube', videoId: yt[1] }

    const sp = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/)
    if (sp) return { platform: 'spotify', uri: `spotify:${sp[1]}:${sp[2]}` }

    if (/soundcloud\.com\//.test(url)) return { platform: 'soundcloud', url }

    return null // Apple Music and anything unrecognized
}