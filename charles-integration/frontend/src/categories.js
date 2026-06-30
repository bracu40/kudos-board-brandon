// Category values stored in the DB (planning.md spec) mapped to display labels
// and badge colors. Keep DB values as the source of truth; only the UI prettifies.
export const CATEGORY_LABELS = {
  celebration: 'Celebration',
  'thank-you': 'Thank You',
  inspiration: 'Inspiration',
}

export const CATEGORY_STYLE = {
  celebration: { bg: '#f59e0b', text: '#fff' },
  'thank-you': { bg: '#10b981', text: '#fff' },
  inspiration: { bg: '#3b82f6', text: '#fff' },
}

// Filter pills: value is what we match/sort on; label is what we show.
export const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'recent', label: 'Recent' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'inspiration', label: 'Inspiration' },
]

// Categories available in the create-board dropdown.
export const CATEGORY_OPTIONS = [
  { value: 'celebration', label: 'Celebration' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'inspiration', label: 'Inspiration' },
]
