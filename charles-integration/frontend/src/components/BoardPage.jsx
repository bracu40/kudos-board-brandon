import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CreateCardForm from './CreateCardForm'
import CardGrid from './CardGrid'
import { getCards, upvoteCard, deleteCard } from '../api'
import './BoardPage.css'

function BoardPage() {
  const { id } = useParams()
  const boardId = Number(id)
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [upvotingId, setUpvotingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Fetch this board's cards on mount / when boardId changes.
  useEffect(() => {
    let active = true
    getCards(boardId)
      .then(({ cards }) => {
        if (active) setCards(cards)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [boardId])

  function handleCardCreated(card) {
    setCards((prev) => [card, ...prev])
  }

  async function handleCardUpvoted(cardId) {
    setUpvotingId(cardId)
    try {
      const { card } = await upvoteCard(cardId)
      setCards((prev) => prev.map((c) => (c.id === cardId ? card : c)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpvotingId(null)
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

  return (
    <div className="board-page">
      <Header />
      <main className="board-page__content">
        <Link to="/" className="board-page__back">
          ← Back to boards
        </Link>
        <h2 className="board-page__title">Board #{boardId}</h2>

        <CreateCardForm boardId={boardId} onCardCreated={handleCardCreated} />

        {isLoading ? (
          <p className="board-page__placeholder">Loading cards…</p>
        ) : error ? (
          <p className="board-page__error">{error}</p>
        ) : (
          <CardGrid
            cards={cards}
            onCardUpvoted={handleCardUpvoted}
            onCardDeleted={handleCardDeleted}
            upvotingId={upvotingId}
            deletingId={deletingId}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default BoardPage
