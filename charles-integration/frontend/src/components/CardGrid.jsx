import CardTile from './CardTile'
import './CardGrid.css'

// Brandon's component (built from spec).
// Props: cards, onCardDeleted(id), onCardUpvoted(id), upvotingId, deletingId
function CardGrid({ cards, onCardDeleted, onCardUpvoted, upvotingId, deletingId }) {
  if (cards.length === 0) {
    return <p className="card-grid__empty">No cards yet. Add the first one!</p>
  }

  return (
    <div className="card-grid">
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
