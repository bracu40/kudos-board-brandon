// Integrated Kudos Board backend (port 5000).
//
// Combines the board routes (Prateek) and card routes (Brandon) into one
// Express server backed by the merged `kudos_full` database. Implements the
// API contract in planning.md Section 2.
//
// Integration changes vs. the standalone apps:
//   - Brandon's `GET /cards` becomes `GET /boards/:boardId/cards` (filtered by board).
//   - `POST /cards` validates that the referenced board exists (404 if not).

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// --- Boards (Prateek) ---------------------------------------------------------

// GET /boards — return all boards.
app.get('/boards', async (req, res) => {
  try {
    const boards = await prisma.board.findMany({ orderBy: { createdAt: 'desc' } })
    res.status(200).json({ boards })
  } catch (err) {
    console.error('GET /boards', err)
    res.status(500).json({ error: 'Failed to fetch boards' })
  }
})

// POST /boards — title & category required, author optional, imageUrl required.
app.post('/boards', async (req, res) => {
  const { title, category, author, imageUrl } = req.body

  if (!title || !category) {
    return res.status(400).json({ error: 'Missing required field: title and category are required' })
  }
  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing required field: imageUrl is required' })
  }

  try {
    const board = await prisma.board.create({
      data: { title, category, author: author ?? null, imageUrl },
    })
    res.status(201).json({ board })
  } catch (err) {
    console.error('POST /boards', err)
    res.status(500).json({ error: 'Failed to create board' })
  }
})

// DELETE /boards/:id — delete board by id (cascades to its cards).
app.delete('/boards/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid board id' })
  }

  try {
    await prisma.board.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Board not found' })
    }
    console.error('DELETE /boards/:id', err)
    res.status(500).json({ error: 'Failed to delete board' })
  }
})

// --- Cards (Brandon) ----------------------------------------------------------

// GET /boards/:boardId/cards — cards for a board (integration: was GET /cards).
app.get('/boards/:boardId/cards', async (req, res) => {
  const boardId = Number(req.params.boardId)
  if (Number.isNaN(boardId)) {
    return res.status(400).json({ error: 'Invalid board id' })
  }

  try {
    const board = await prisma.board.findUnique({ where: { id: boardId } })
    if (!board) {
      return res.status(404).json({ error: 'Board not found' })
    }
    // Pinned cards first (most-recent pin first), then the rest by creation time.
    // Include comment ids so the UI can show a per-card comment count.
    const cards = await prisma.card.findMany({
      where: { boardId },
      orderBy: [
        { isPinned: 'desc' },
        { pinnedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      include: { comments: { select: { id: true } } },
    })
    res.status(200).json({ cards })
  } catch (err) {
    console.error('GET /boards/:boardId/cards', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  }
})

// POST /cards — boardId, message, gifUrl required; author optional.
app.post('/cards', async (req, res) => {
  const { boardId, message, gifUrl, author } = req.body

  if (!boardId || !message || !gifUrl) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: boardId, message and gifUrl are required' })
  }

  try {
    const board = await prisma.board.findUnique({ where: { id: Number(boardId) } })
    if (!board) {
      return res.status(404).json({ error: 'Board not found' })
    }
    const card = await prisma.card.create({
      data: {
        boardId: Number(boardId),
        message,
        gifUrl,
        author: author ?? null,
      },
    })
    res.status(201).json({ card })
  } catch (err) {
    console.error('POST /cards', err)
    res.status(500).json({ error: 'Failed to create card' })
  }
})

// PATCH /cards/:id/upvote — increment upvotes by 1 (repeatable).
app.patch('/cards/:id/upvote', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid card id' })
  }

  try {
    const card = await prisma.card.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    })
    res.status(200).json({ card })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Card not found' })
    }
    console.error('PATCH /cards/:id/upvote', err)
    res.status(500).json({ error: 'Failed to upvote card' })
  }
})

// PATCH /cards/:id/pin — toggle pinned state. Body: { isPinned: boolean }.
// Sets pinnedAt to now when pinning (drives most-recent-pin-first ordering),
// clears it when unpinning.
app.patch('/cards/:id/pin', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid card id' })
  }
  const { isPinned } = req.body
  if (typeof isPinned !== 'boolean') {
    return res.status(400).json({ error: 'isPinned (boolean) is required' })
  }

  try {
    const card = await prisma.card.update({
      where: { id },
      data: { isPinned, pinnedAt: isPinned ? new Date() : null },
    })
    res.status(200).json({ card })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Card not found' })
    }
    console.error('PATCH /cards/:id/pin', err)
    res.status(500).json({ error: 'Failed to pin card' })
  }
})

// --- Comments -----------------------------------------------------------------

// GET /cards/:cardId/comments — comments for a card (oldest first).
app.get('/cards/:cardId/comments', async (req, res) => {
  const cardId = Number(req.params.cardId)
  if (Number.isNaN(cardId)) {
    return res.status(400).json({ error: 'Invalid card id' })
  }

  try {
    const card = await prisma.card.findUnique({ where: { id: cardId } })
    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }
    const comments = await prisma.comment.findMany({
      where: { cardId },
      orderBy: { createdAt: 'asc' },
    })
    res.status(200).json({ comments })
  } catch (err) {
    console.error('GET /cards/:cardId/comments', err)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

// POST /cards/:cardId/comments — message required; author optional (guests ok).
app.post('/cards/:cardId/comments', async (req, res) => {
  const cardId = Number(req.params.cardId)
  if (Number.isNaN(cardId)) {
    return res.status(400).json({ error: 'Invalid card id' })
  }
  const { message, author } = req.body
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Missing required field: message is required' })
  }

  try {
    const card = await prisma.card.findUnique({ where: { id: cardId } })
    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }
    const comment = await prisma.comment.create({
      data: { cardId, message: message.trim(), author: author?.trim() || null },
    })
    res.status(201).json({ comment })
  } catch (err) {
    console.error('POST /cards/:cardId/comments', err)
    res.status(500).json({ error: 'Failed to create comment' })
  }
})

// DELETE /cards/:id — delete card by id.
app.delete('/cards/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid card id' })
  }

  try {
    await prisma.card.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Card not found' })
    }
    console.error('DELETE /cards/:id', err)
    res.status(500).json({ error: 'Failed to delete card' })
  }
})

app.listen(PORT, () => {
  console.log(`Kudos Board backend listening on http://localhost:${PORT}`)
})

module.exports = app
