import './CardTile.css'

// Brandon's component (built from spec).
// Props: card, onUpvote(id), onDelete(id), isUpvoting, isDeleting
function CardTile({ card, onUpvote, onDelete, isUpvoting, isDeleting }) {
  return (
    <div className="card-tile">
      <img className="card-tile__gif" src={card.gifUrl} alt="" />
      <p className="card-tile__message">{card.message}</p>
      {card.author && <p className="card-tile__author">— {card.author}</p>}
      <div className="card-tile__actions">
        <button
          type="button"
          className="card-tile__upvote"
          disabled={isUpvoting}
          onClick={() => onUpvote(card.id)}
        >
          ▲ {card.upvotes}
        </button>
        <button
          type="button"
          className="card-tile__delete"
          disabled={isDeleting}
          onClick={() => onDelete(card.id)}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

export default CardTile
