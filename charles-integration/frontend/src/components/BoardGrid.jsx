import BoardTile from './BoardTile'

// Props: boards, onBoardDeleted(id), onBoardOpen(id), deletingId, emptyMessage
function BoardGrid({ boards, onBoardDeleted, onBoardOpen, deletingId, emptyMessage }) {
  if (boards.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="max-w-xs text-sm text-muted-foreground">
          {emptyMessage || 'No boards yet. Create one to get started.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {boards.map((board) => (
        <BoardTile
          key={board.id}
          board={board}
          onOpen={onBoardOpen}
          onDelete={onBoardDeleted}
          isDeleting={deletingId === board.id}
        />
      ))}
    </div>
  )
}

export default BoardGrid
