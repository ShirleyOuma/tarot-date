import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DeckView from './pages/DeckView'
import CreateDeck from './pages/CreateDeck.jsx'
import AddCards from './pages/AddCards.jsx'
import BuilderDone from './pages/BuilderDone.jsx'
import EditDeck from './pages/EditDeck.jsx'
import DeckAnalytics from './pages/DeckAnalytics.jsx'

function App() {
  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/manage-deck-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/d/:slug" element={<DeckView />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/builder/:deckId/cards" element={<AddCards />} />
          <Route path="/builder/:deckId/done" element={<BuilderDone />} />
          <Route path="/builder/:deckId/edit" element={<EditDeck />} />
          <Route path="/builder/:deckId/insights" element={<DeckAnalytics />} />
        </Routes>
      </div>
    </div>
  )
}

export default App