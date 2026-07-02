import { useState } from 'react'
import { ChevronUp, Trash2, Pin, MessageCircle } from 'lucide-react'

// Props: card, onUpvote(id), onDelete(id), onPin(id, isPinned), onOpenComments(card),
//        isUpvoting, isDeleting, isPinning
// Upvotes are repeatable (per spec); the pill bumps on each click.
function CardTile({
  card,
  onUpvote,
  onDelete,
  onPin,
  onOpenComments,
  isUpvoting,
  isDeleting,
  isPinning,
}) {
  const [bumping, setBumping] = useState(false)

  function handleUpvote() {
    setBumping(true)
    onUpvote(card.id)
    setTimeout(() => setBumping(false), 350)
  }

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(124,58,237,0.13)] ${
        card.isPinned ? 'border-primary ring-2 ring-primary/40' : 'border-border'
      }`}
    >
      {card.gifUrl && (
        <div className="relative h-44 flex-shrink-0 overflow-hidden bg-secondary">
          <img src={card.gifUrl} alt="kudos gif" className="h-full w-full object-cover" />
          {card.isPinned && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              <Pin size={10} className="fill-current" />
              Pinned
            </span>
          )}
          <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-all duration-150 group-hover:opacity-100">
            <button
              onClick={() => onPin(card.id, !card.isPinned)}
              disabled={isPinning}
              aria-label={card.isPinned ? 'Unpin card' : 'Pin card'}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-white transition-all duration-150 disabled:opacity-60 ${
                card.isPinned ? 'bg-primary hover:bg-primary/80' : 'bg-black/50 hover:bg-primary'
              }`}
            >
              <Pin size={12} className={card.isPinned ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              disabled={isDeleting}
              aria-label="Delete card"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white transition-all duration-150 hover:bg-red-500 disabled:opacity-60"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="flex-1 text-sm leading-relaxed text-card-foreground">
          “{card.message}”
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">
            {card.author ? `— ${card.author}` : '— Anonymous'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenComments(card)}
              aria-label="View comments"
              className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle size={12} />
              {card.comments?.length ?? 0}
            </button>
            <button
              onClick={handleUpvote}
              disabled={isUpvoting}
              aria-label="Upvote card"
              className={`flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground disabled:opacity-60 ${
                bumping ? 'scale-125' : 'scale-100'
              }`}
            >
              <ChevronUp size={12} />
              {card.upvotes}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardTile
