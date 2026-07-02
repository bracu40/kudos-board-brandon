import React, { useState } from 'react';
import './BoardTile.css';

function BoardTile({ board, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking delete

    if (window.confirm(`Delete "${board.title}"?`)) {
      setIsDeleting(true);
      await onDelete(board.id);
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    console.log('Navigate to board:', board.id);
    // Charles will wire this up to React Router later during integration
    alert(`Clicked board: ${board.title}\n(Navigation will be added during integration)`);
  };

  
  return (
    <div className="board-tile" onClick={handleClick}>
      <img
        src={board.imageUrl}
        alt={board.title}
        className="board-image"
      />

      <div className="board-info">
        <h3 className="board-title">{board.title}</h3>
        <p className="board-category">{board.category}</p>
        {board.author && (
          <p className="board-author">By: {board.author}</p>
        )}
      </div>

      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : '🗑️ Delete'}
      </button>
    </div>
  );
}

export default BoardTile;
