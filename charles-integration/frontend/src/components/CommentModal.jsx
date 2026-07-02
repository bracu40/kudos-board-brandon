import { useEffect, useState } from 'react'
import { X, Loader2, Send } from 'lucide-react'
import { getComments, createComment } from '../api'

const inputCls =
  'w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50'

// Modal showing a card (message, gif, author) and its comments, plus a form to
// add more. Props: card, onClose(), onCommentAdded(cardId).
function CommentModal({ card, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load comments for this card. (loading defaults to true; the modal mounts
  // fresh per card, so no need to reset it here.)
  useEffect(() => {
    let active = true
    getComments(card.id)
      .then(({ comments }) => active && setComments(comments))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [card.id])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const { comment } = await createComment(card.id, {
        message: message.trim(),
        author: author.trim() || undefined,
      })
      setComments((prev) => [...prev, comment])
      setMessage('')
      onCommentAdded?.(card.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-card-foreground">Card & Comments</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Card preview */}
          {card.gifUrl && (
            <div className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-secondary">
              <img src={card.gifUrl} alt="kudos gif" className="h-full w-full object-cover" />
            </div>
          )}
          <p className="text-sm leading-relaxed text-card-foreground">“{card.message}”</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {card.author ? `— ${card.author}` : '— Anonymous'}
          </p>

          {/* Comments list */}
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Comments{!loading ? ` (${comments.length})` : ''}
            </p>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <p className="py-2 text-xs text-muted-foreground">
                No comments yet. Be the first.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-xl bg-secondary px-3 py-2">
                    <p className="text-sm text-card-foreground">{c.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.author ? `— ${c.author}` : '— Anonymous'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Add comment form */}
        <form onSubmit={handleSubmit} className="border-t border-border p-4">
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="mb-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name (optional)"
              className={`${inputCls} sm:w-40`}
            />
          </div>
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a comment…"
              className={`${inputCls} min-w-0 flex-1`}
            />
            <button
              type="submit"
              disabled={!message.trim() || submitting}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommentModal
