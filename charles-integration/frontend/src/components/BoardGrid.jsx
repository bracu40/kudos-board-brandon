import BoardTile from './BoardTile'
import './BoardGrid.css'

// Prateek's component (built from spec).
// Props: boards, onBoardDeleted(id), onBoardOpen(id), deletingId
function BoardGrid({ boards, onBoardDeleted, onBoardOpen, deletingId }) {
  if (boards.length === 0) {
    return <p className="board-grid__empty">No boards to show.</p>
  }

  return (
    <div className="board-grid">
      {boards.map((board) => (
        <BoardTile
          key={board.id}
          board={board}
          onDelete={onBoardDeleted}
          onOpen={onBoardOpen}
          isDeleting={deletingId === board.id}
        />
      ))}
    </div>
  )
}

export default BoardGrid
