import { Trash2 } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_STYLE } from '../categories'

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

// Props: board, onOpen(id), onDelete(id), isDeleting
function BoardTile({ board, onOpen, onDelete, isDeleting }) {
  const style = CATEGORY_STYLE[board.category] || { bg: '#7c3aed', text: '#fff' }
  const label = CATEGORY_LABELS[board.category] || board.category

  return (
    <div
      onClick={() => onOpen(board.id)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(124,58,237,0.18)]"
    >
      <div className="relative h-40 overflow-hidden bg-secondary">
        {board.imageUrl && (
          <img
            src={board.imageUrl}
            alt={board.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span
          className="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: style.bg, color: style.text }}
        >
          {label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(board.id)
          }}
          disabled={isDeleting}
          aria-label="Delete board"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 transition-all duration-150 hover:bg-red-500 group-hover:opacity-100 disabled:opacity-60"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-1.5 text-sm font-semibold leading-snug text-card-foreground">
          {board.title}
        </h3>
        {board.author && (
          <p className="text-xs text-muted-foreground">by {board.author}</p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">
          {timeAgo(board.createdAt)}
        </p>
      </div>
    </div>
  )
}

export default BoardTile
