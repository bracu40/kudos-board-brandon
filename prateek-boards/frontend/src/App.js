import React, { useState, useEffect } from 'react';
import BoardGrid from './BoardGrid';
import CreateBoardForm from './CreateBoardForm';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch boards from backend when component mounts
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch(`${API_URL}/boards`);
      const data = await response.json();
      setBoards(data.boards);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      setIsLoading(false);
    }
  };

  // Handler for creating a new board
  const handleBoardCreated = async (boardData) => {
    try {
      const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boardData)
      });

      if (!response.ok) throw new Error('Failed to create board');

      const data = await response.json();
      setBoards([data.board, ...boards]); // Add new board to top
    } catch (error) {
      console.error('Failed to create board:', error);
      throw error;
    }
  };

  // Handler for deleting a board
  const handleBoardDeleted = async (id) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete board');

      setBoards(boards.filter(board => board.id !== id));
    } catch (error) {
      console.error('Failed to delete board:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>🎊 Kudos Boards</h1>
          <p>Create boards to celebrate, thank, and inspire!</p>
        </header>
        <div style={{ textAlign: 'center', padding: '60px', fontSize: '24px' }}>
          Loading boards...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎊 Kudos Boards</h1>
        <p>Create boards to celebrate, thank, and inspire!</p>
      </header>

      <main>
        <CreateBoardForm onBoardCreated={handleBoardCreated} />
        <BoardGrid boards={boards} onBoardDeleted={handleBoardDeleted} />
      </main>

      <footer className="app-footer">
        <p>Built by Prateek | Kudos Board Project</p>
      </footer>
    </div>
  );
}

export default App;
