import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import DeckView from './pages/DeckView.jsx'
import CreateDeck from './pages/CreateDeck.jsx'
import AddCards from './pages/AddCards.jsx'
import BuilderDone from './pages/BuilderDone.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/d/:slug" element={<DeckView />} />
      <Route path="/create" element={<CreateDeck />} />
      <Route path="/builder/:deckId/cards" element={<AddCards />} />
      <Route path="/builder/:deckId/done" element={<BuilderDone />} />
    </Routes>
  )
}

export default App
