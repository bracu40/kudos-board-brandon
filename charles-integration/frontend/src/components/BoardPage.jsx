import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import CreateCardForm from './CreateCardForm'
import CardGrid from './CardGrid'
import CommentModal from './CommentModal'
import { getBoards, getCards, upvoteCard, deleteCard, pinCard } from '../api'
import { CATEGORY_LABELS, CATEGORY_STYLE } from '../categories'

// Pinned cards first (most-recent pin first), then the rest by creation time.
// Mirrors the backend ordering so the grid stays consistent after a client-side
// pin toggle without needing a refetch.
function sortCards(cards) {
  return [...cards].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
    if (a.isPinned && b.isPinned) {
      return new Date(b.pinnedAt) - new Date(a.pinnedAt)
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

function BoardPage() {
  const { id } = useParams()
  const boardId = Number(id)
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [upvotingId, setUpvotingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [pinningId, setPinningId] = useState(null)
  const [activeCard, setActiveCard] = useState(null)

  // Fetch the board (from the list) + its cards in parallel.
  useEffect(() => {
    let active = true
    Promise.all([getBoards(), getCards(boardId)])
      .then(([{ boards }, { cards }]) => {
        if (!active) return
        setBoard(boards.find((b) => b.id === boardId) || null)
        setCards(sortCards(cards))
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [boardId])

  function handleCardCreated(card) {
    setCards((prev) => sortCards([card, ...prev]))
  }

  async function handleCardUpvoted(cardId) {
    setUpvotingId(cardId)
    try {
      const { card } = await upvoteCard(cardId)
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, ...card } : c)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpvotingId(null)
    }
  }

  async function handleCardPinned(cardId, isPinned) {
    setPinningId(cardId)
    try {
      const { card } = await pinCard(cardId, isPinned)
      // Merge (keep comment count from the list) then re-sort so the card jumps
      // to / falls back from the top immediately.
      setCards((prev) =>
        sortCards(prev.map((c) => (c.id === cardId ? { ...c, ...card } : c))),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setPinningId(null)
    }
  }

  async function handleCardDeleted(cardId) {
    setDeletingId(cardId)
    try {
      await deleteCard(cardId)
      setCards((prev) => prev.filter((c) => c.id !== cardId))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // Bump a card's comment count after a comment is posted from the modal.
  function handleCommentAdded(cardId) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, comments: [...(c.comments || []), { id: Date.now() }] }
          : c,
      ),
    )
  }

  const style = board && (CATEGORY_STYLE[board.category] || { bg: '#7c3aed', text: '#fff' })
  const label = board && (CATEGORY_LABELS[board.category] || board.category)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[1126px] px-6 py-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to boards
          </button>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="max-w-xs text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <>
              {/* Board header */}
              <div className="mb-8 flex items-start gap-4">
                {board?.imageUrl && (
                  <div className="hidden h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary shadow-sm sm:block">
                    <img
                      src={board.imageUrl}
                      alt={board.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {board && (
                    <span
                      className="mb-2 inline-block rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: style.bg, color: style.text }}
                    >
                      {label}
                    </span>
                  )}
                  <h1 className="mb-1 truncate text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                    {board ? board.title : `Board #${boardId}`}
                  </h1>
                  {board?.author && (
                    <p className="text-sm text-muted-foreground">by {board.author}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
                {/* Cards grid */}
                <div className="min-w-0">
                  <p className="mb-5 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {cards.length}
                    </span>{' '}
                    card{cards.length !== 1 ? 's' : ''}
                  </p>
                  <CardGrid
                    cards={cards}
                    onCardUpvoted={handleCardUpvoted}
                    onCardDeleted={handleCardDeleted}
                    onCardPinned={handleCardPinned}
                    onOpenComments={setActiveCard}
                    upvotingId={upvotingId}
                    deletingId={deletingId}
                    pinningId={pinningId}
                  />
                </div>

                {/* Add card form (sticky) */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <CreateCardForm boardId={boardId} onCardCreated={handleCardCreated} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      {activeCard && (
        <CommentModal
          card={activeCard}
          onClose={() => setActiveCard(null)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  )
}

export default BoardPage
