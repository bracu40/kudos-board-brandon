import { useState } from 'react'
import './SearchBar.css'

// Props:
//   searchQuery — the currently applied search term (controlled by parent)
//   onSearch(query) — called when the user submits a search
//   onClear() — called when the user clears the search
function SearchBar({ searchQuery, onSearch, onClear }) {
  // Local draft text so the parent only filters on submit, not every keystroke.
  const [draft, setDraft] = useState(searchQuery ?? '')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(draft.trim())
  }

  function handleClear() {
    setDraft('')
    onClear()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search boards by title…"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label="Search boards by title"
      />
      <button type="submit" className="search-bar__button">
        Search
      </button>
      {draft && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  )
}

export default SearchBar
