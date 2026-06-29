// Pure board filtering used by HomePage. Kept separate so it can be unit-tested
// and reused in Phase 2 (where mock data is swapped for a GET /boards fetch).
//
//   boards           — array of board objects
//   searchQuery      — title search term ('' = no search)
//   selectedCategory — 'all' | 'recent' | a category string
export function filterBoards(boards, searchQuery, selectedCategory) {
  let result = boards

  // Search: match boards whose title contains the query (case-insensitive).
  if (searchQuery) {
    result = result.filter((board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Category filter.
  if (selectedCategory === 'recent') {
    // Sort by newest first, take the first 6. Copy first so we don't mutate input.
    result = [...result]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
  } else if (selectedCategory !== 'all') {
    result = result.filter((board) => board.category === selectedCategory)
  }

  return result
}
