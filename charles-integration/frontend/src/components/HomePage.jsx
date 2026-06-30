import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Header from './Header'
import Banner from './Banner'
import Footer from './Footer'
import SearchBar from './SearchBar'
import FilterButtons from './FilterButtons'
import CreateBoardForm from './CreateBoardForm'
import BoardGrid from './BoardGrid'
import { filterBoards } from '../utils/filterBoards'
import { getBoards, deleteBoard } from '../api'

function HomePage() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true
    getBoards()
      .then(({ boards }) => active && setBoards(boards))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setIsLoading(false))
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

  const emptyMessage = searchQuery
    ? `No boards matching "${searchQuery}"`
    : selectedCategory !== 'all'
      ? 'No boards in this category yet.'
      : 'No boards yet — create the first one!'

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Banner />
        <div className="mx-auto max-w-[1126px] px-6 py-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            {/* Left: search + filters + grid */}
            <div className="flex min-w-0 flex-col gap-6">
              <SearchBar
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
              <FilterButtons
                selectedCategory={selectedCategory}
                onFilterChange={setSelectedCategory}
              />
              {!isLoading && !error && (
                <p className="-mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {filteredBoards.length}
                  </span>{' '}
                  board{filteredBoards.length !== 1 ? 's' : ''}
                </p>
              )}

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={24} className="animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                  <p className="max-w-xs text-sm text-red-500">{error}</p>
                </div>
              ) : (
                <BoardGrid
                  boards={filteredBoards}
                  onBoardDeleted={handleBoardDeleted}
                  onBoardOpen={(id) => navigate(`/boards/${id}`)}
                  deletingId={deletingId}
                  emptyMessage={emptyMessage}
                />
              )}
            </div>

            {/* Right: create form (sticky) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CreateBoardForm onBoardCreated={handleBoardCreated} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
