import React from 'react';
import BoardTile from './BoardTile';
import './BoardGrid.css';

function BoardGrid({ boards, onBoardDeleted }) {
  if (boards.length === 0) {
    return (
      <div className="empty-state">
        <h2>No boards yet!</h2>
        <p>Create your first board below to get started.</p>
      </div>
    );
  }

  return (
    <div className="board-grid">
      {boards.map(board => (
        <BoardTile
          key={board.id}
          board={board}
          onDelete={onBoardDeleted}
        />
      ))}
    </div>
  );
}

export default BoardGrid;
