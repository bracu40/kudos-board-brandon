import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { searchGifs } from '../api'

const labelCls =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'

// Debounced GIPHY search + thumbnail picker.
// Props: selected (gif | null), onSelect(gif | null)
function GifSearch({ selected, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const timerRef = useRef(null)

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setSearching(true)
    try {
      setResults(await searchGifs(q))
    } catch {
      setResults([])
    } finally {
      setSearching(false)
      setSearched(true)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(query), 500)
    return () => clearTimeout(timerRef.current)
  }, [query, doSearch])

  return (
    <div>
      <label className={labelCls}>GIF Search</label>
      <div className="relative mb-3">
        <Search
          size={13}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIPHY… e.g. celebrate, thank you"
          className="w-full rounded-xl border border-border bg-background py-2 pl-8 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {searching && (
        <div className="flex justify-center py-5">
          <Loader2 size={18} className="animate-spin text-primary" />
        </div>
      )}

      {!searching && results.length > 0 && (
        <div
          className="mb-3 grid grid-cols-3 gap-1.5 overflow-y-auto pr-0.5 sm:grid-cols-4"
          style={{ maxHeight: 200 }}
        >
          {results.map((g) => {
            const isSel = selected?.id === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelect(isSel ? null : g)}
                className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                  isSel
                    ? 'scale-[0.97] border-primary ring-2 ring-primary/30'
                    : 'border-transparent hover:border-primary/40'
                }`}
              >
                <img src={g.previewUrl} alt={g.title} className="h-full w-full object-cover" />
              </button>
            )
          })}
        </div>
      )}

      {!searching && searched && results.length === 0 && (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No GIFs found — try a different search.
        </p>
      )}

      {selected && (
        <div className="mt-1">
          <p className={labelCls}>Selected Preview</p>
          <div
            className="relative w-full overflow-hidden rounded-xl bg-secondary"
            style={{ aspectRatio: '16/9' }}
          >
            <img
              src={selected.url}
              alt={selected.title}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onSelect(null)}
              aria-label="Remove selected gif"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              <X size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GifSearch
