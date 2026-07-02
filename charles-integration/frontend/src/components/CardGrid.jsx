import CardTile from './CardTile'

// Props: cards, onCardDeleted(id), onCardUpvoted(id), onCardPinned(id, isPinned),
//        onOpenComments(card), upvotingId, deletingId, pinningId
function CardGrid({
  cards,
  onCardDeleted,
  onCardUpvoted,
  onCardPinned,
  onOpenComments,
  upvotingId,
  deletingId,
  pinningId,
}) {
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
          onPin={onCardPinned}
          onOpenComments={onOpenComments}
          isUpvoting={upvotingId === card.id}
          isDeleting={deletingId === card.id}
          isPinning={pinningId === card.id}
        />
      ))}
    </div>
  )
}

export default CardGrid
