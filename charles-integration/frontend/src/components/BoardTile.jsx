import './BoardTile.css'

// Prateek's component (built from spec — his code wasn't pushed at integration).
// Props: board, onDelete(id), onOpen(id), isDeleting
function BoardTile({ board, onDelete, onOpen, isDeleting }) {
  return (
    <div className="board-tile" onClick={() => onOpen(board.id)}>
      <img className="board-tile__image" src={board.imageUrl} alt={board.title} />
      <div className="board-tile__body">
        <span className="board-tile__category">{board.category}</span>
        <h3 className="board-tile__title">{board.title}</h3>
        {board.author && (
          <p className="board-tile__author">by {board.author}</p>
        )}
      </div>
      <button
        type="button"
        className="board-tile__delete"
        disabled={isDeleting}
        onClick={(e) => {
          e.stopPropagation() // don't trigger navigation
          onDelete(board.id)
        }}
      >
        {isDeleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}

export default BoardTile
