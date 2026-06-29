import { useMemo, useState } from 'react'
import Header from './Header'
import Banner from './Banner'
import Footer from './Footer'
import SearchBar from './SearchBar'
import FilterButtons from './FilterButtons'
import { filterBoards } from '../utils/filterBoards'
import { mockBoards } from '../data/mockBoards'
import './HomePage.css'

function HomePage() {
  // Phase 1 uses mock data; Phase 2 replaces this with a GET /boards fetch.
  const [boards] = useState(mockBoards)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredBoards = useMemo(
    () => filterBoards(boards, searchQuery, selectedCategory),
    [boards, searchQuery, selectedCategory],
  )

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

        {/* BoardGrid lands here in Phase 2.
            Simple list for now so search + filter are visibly testable. */}
        {filteredBoards.length > 0 ? (
          <>
            <p className="home__count">
              {filteredBoards.length}{' '}
              {filteredBoards.length === 1 ? 'board' : 'boards'}
            </p>
            <ul className="home__board-list">
              {filteredBoards.map((board) => (
                <li key={board.id} className="home__board-item">
                  {board.title}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="home__placeholder">No boards match your search and filter.</p>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
