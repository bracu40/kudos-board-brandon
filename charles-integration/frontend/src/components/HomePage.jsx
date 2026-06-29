import { useMemo, useState } from 'react'
import Header from './Header'
import Banner from './Banner'
import Footer from './Footer'
import SearchBar from './SearchBar'
import { mockBoards } from '../data/mockBoards'
import './HomePage.css'

function HomePage() {
  // Phase 1 uses mock data; Phase 2 replaces this with a GET /boards fetch.
  const [boards] = useState(mockBoards)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBoards = useMemo(() => {
    let result = boards

    // Search: match boards whose title contains the query (case-insensitive).
    if (searchQuery) {
      result = result.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return result
  }, [boards, searchQuery])

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

        {/* FilterButtons + BoardGrid land here on Day 3.
            Simple list for now so search is visibly testable. */}
        {filteredBoards.length > 0 ? (
          <ul className="home__board-list">
            {filteredBoards.map((board) => (
              <li key={board.id} className="home__board-item">
                {board.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="home__placeholder">No boards match "{searchQuery}".</p>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
