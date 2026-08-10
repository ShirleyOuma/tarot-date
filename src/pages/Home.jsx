import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white text-center p-8 gap-6">
      <h1 className="text-6xl font-bold text-amber-400">DateMatch</h1>
      <p className="text-white/70 max-w-md" style={{ fontFamily: "'Caveat', cursive", fontSize: '1.5rem' }}>
        Build someone a deck of cards. Each one hides a little something for them.
      </p>
      <Link
        to="/create"
        className="bg-amber-400 text-black rounded-full px-8 py-3 font-semibold hover:bg-amber-300 transition-colors"
      >
        Create a deck
      </Link>
    </div>
  )
}

export default Home