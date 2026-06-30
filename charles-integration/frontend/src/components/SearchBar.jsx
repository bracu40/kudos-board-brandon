import { Search, X } from 'lucide-react'

// Props:
//   searchQuery — current applied query (controlled by parent)
//   onSearch(query) — called as the user types
//   onClear() — called when the clear button is pressed
function SearchBar({ searchQuery, onSearch, onClear }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search boards by title…"
          aria-label="Search boards"
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-9 text-sm text-foreground transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
        {searchQuery && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95">
        Search
      </button>
    </div>
  )
}

export default SearchBar
