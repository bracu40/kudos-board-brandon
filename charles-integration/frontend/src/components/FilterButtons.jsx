import { FILTERS } from '../categories'

// Props:
//   selectedCategory — active filter value
//   onFilterChange(value) — called when a pill is clicked
function FilterButtons({ selectedCategory, onFilterChange }) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter boards by category"
    >
      {FILTERS.map((f) => {
        const active = selectedCategory === f.value
        return (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            aria-pressed={active}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:shadow-sm'
            }`}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

export default FilterButtons
