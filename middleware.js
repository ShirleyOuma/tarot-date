export const config = {
    matcher: '/d/:slug*',
}

const BOT_USER_AGENTS = [
    'facebookexternalhit',
    'Twitterbot',
    'WhatsApp',
    'TelegramBot',
    'LinkedInBot',
    'Slackbot',
    'Discordbot',
    'iMessageLinkPreview',
    'SkypeUriPreview',
    'vkShare',
    'redditbot',
    'Applebot',
]

export default async function middleware(request) {
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = BOT_USER_AGENTS.some((bot) =>
        userAgent.toLowerCase().includes(bot.toLowerCase())
    )

    if (!isBot) {
        return
    }

    const url = new URL(request.url)
    const slug = url.pathname.split('/d/')[1]?.split('/')[0]

    if (!slug) {
        return
    }

    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

        const res = await fetch(
            `${supabaseUrl}/rest/v1/decks?slug=eq.${slug}&status=eq.published&select=title,intro_note,cards(image_url)`,
            {
                headers: {
                    apikey: supabaseKey,
                    authorization: `Bearer ${supabaseKey}`,
                },
            }
        )
        const decks = await res.json()
        const deck = decks?.[0]

        if (!deck) {
            return
        }

        const title = escapeHtml(deck.title || 'Date')
        const description = escapeHtml(
            deck.intro_note || 'Someone built you a deck of cards. Each one hides a little something.'
        )
        const image = deck.cards?.find((c) => c.image_url)?.image_url ||
            'https://images.unsplash.com/photo-1601313311770-a7b7c1e12bc0?w=1200&h=630&fit=crop'

        const html = `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body></body>
</html>`

        return new Response(html, {
            headers: { 'content-type': 'text/html' },
        })
    } catch (err) {
        return
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}