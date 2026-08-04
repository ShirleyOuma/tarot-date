import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import DeckView from './pages/DeckView.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/d/:slug" element={<DeckView />} />
    </Routes>
  )
}

export default App
