# TarotDate

Build someone a deck of tarot-style cards. Each card hides a date idea, a quote, a location, and a song — flip it open to reveal it. No login required, for either the creator or the recipient.

**Live app:** https://tarot-date.vercel.app

## How it works

1. A creator visits the site, builds a deck (title + a set of cards, each with a name, quote, date idea, optional photo, and optional YouTube song link), and publishes it.
2. They get a shareable link (`/d/some-slug`) and a private "manage" link to edit the deck later — both work without any account, tied instead to a secret token saved in their browser.
3. Whoever opens the share link sees the deck as a grid of tarot-style cards. Tapping one reveals the details, plays the song, and lets them react with a heart or accept the date idea.

## Tech stack

React (Vite) + Tailwind CSS + Framer Motion, backed by Supabase (Postgres, Row-Level Security, Storage), deployed on Vercel.

## Running it locally

```bash
npm install
npm run dev
```

Requires a `.env.local` file (not committed) with:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

## Deployment

Hosted on Vercel, connected to the `main` branch — every push auto-deploys. Environment variables are set directly in Vercel's dashboard.

---


