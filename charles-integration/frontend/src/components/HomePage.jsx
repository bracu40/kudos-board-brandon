import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Banner from './Banner'
import Footer from './Footer'
import SearchBar from './SearchBar'
import FilterButtons from './FilterButtons'
import CreateBoardForm from './CreateBoardForm'
import BoardGrid from './BoardGrid'
import { filterBoards } from '../utils/filterBoards'
import { getBoards, deleteBoard } from '../api'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Fetch all boards on mount.
  useEffect(() => {
    let active = true
    getBoards()
      .then(({ boards }) => {
        if (active) setBoards(boards)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredBoards = useMemo(
    () => filterBoards(boards, searchQuery, selectedCategory),
    [boards, searchQuery, selectedCategory],
  )

  function handleBoardCreated(board) {
    setBoards((prev) => [board, ...prev])
  }

  async function handleBoardDeleted(id) {
    setDeletingId(id)
    try {
      await deleteBoard(id)
      setBoards((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="home">
      <Header />
      <Banner />
      <main className="home__content">
        <SearchBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <FilterButtons
          selectedCategory={selectedCategory}
          onFilterChange={setSelectedCategory}
        />
        <CreateBoardForm onBoardCreated={handleBoardCreated} />

        {isLoading ? (
          <p className="home__placeholder">Loading boards…</p>
        ) : error ? (
          <p className="home__error">{error}</p>
        ) : (
          <>
            <p className="home__count">
              {filteredBoards.length}{' '}
              {filteredBoards.length === 1 ? 'board' : 'boards'}
            </p>
            <BoardGrid
              boards={filteredBoards}
              onBoardDeleted={handleBoardDeleted}
              onBoardOpen={(id) => navigate(`/boards/${id}`)}
              deletingId={deletingId}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
