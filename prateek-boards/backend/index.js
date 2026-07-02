const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET /boards - Get all boards
app.get('/boards', async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ boards });
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// POST /boards - Create a board
app.post('/boards', async (req, res) => {
  try {
    const { title, category, author, imageUrl } = req.body;

    // Validation
    if (!title || !category || !imageUrl) {
      return res.status(400).json({
        error: 'Title, category, and imageUrl are required'
      });
    }

    const board = await prisma.board.create({
      data: {
        title,
        category,
        author: author || null,
        imageUrl
      }
    });

    res.status(201).json({ board });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});


// DELETE /boards/:id - Delete a board
app.delete('/boards/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.board.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Board not found' });
    }
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
