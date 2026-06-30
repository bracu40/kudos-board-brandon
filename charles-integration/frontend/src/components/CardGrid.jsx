import CardTile from './CardTile'

// Props: cards, onCardDeleted(id), onCardUpvoted(id), upvotingId, deletingId
function CardGrid({ cards, onCardDeleted, onCardUpvoted, upvotingId, deletingId }) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="max-w-xs text-sm text-muted-foreground">
          No cards yet. Add one using the form.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onUpvote={onCardUpvoted}
          onDelete={onCardDeleted}
          isUpvoting={upvotingId === card.id}
          isDeleting={deletingId === card.id}
        />
      ))}
    </div>
  )
}

export default CardGrid
