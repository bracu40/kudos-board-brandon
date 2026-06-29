import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import BoardPage from './components/BoardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/boards/:id" element={<BoardPage />} />
    </Routes>
  )
}

export default App
