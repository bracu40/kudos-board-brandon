import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { createBoard } from '../api'
import { CATEGORY_OPTIONS } from '../categories'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop&auto=format'

const inputCls =
  'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50'
const labelCls =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'

// Props: onBoardCreated(board)
function CreateBoardForm({ onBoardCreated }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (title.trim().length < 3) e.title = 'Title must be at least 3 characters.'
    if (!category) e.category = 'Please select a category.'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setSubmitting(true)
    try {
      const { board } = await createBoard({
        title: title.trim(),
        category,
        author: author.trim() || undefined,
        imageUrl: imageUrl.trim() || FALLBACK_IMAGE,
      })
      onBoardCreated(board)
      setTitle('')
      setCategory('')
      setAuthor('')
      setImageUrl('')
      setErrors({})
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_2px_16px_rgba(124,58,237,0.08)]">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-card-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Plus size={14} />
        </span>
        Create a board
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelCls}>Board Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 MVP Celebration"
            className={inputCls}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            <option value="">Select a category…</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>
            Your Name <span className="normal-case opacity-60">(optional)</span>
          </label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Jordan Lee"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>
            Cover Image URL <span className="normal-case opacity-60">(optional)</span>
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
        </div>
        {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Creating…
            </>
          ) : (
            'Create Board'
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateBoardForm
