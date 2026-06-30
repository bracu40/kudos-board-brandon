import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { createCard } from '../api'
import GifSearch from './GifSearch'

const inputCls =
  'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50'
const labelCls =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'

// Props: boardId, onCardCreated(card)
function CreateCardForm({ boardId, onCardCreated }) {
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [selectedGif, setSelectedGif] = useState(null)
  const [errors, setErrors] = useState({})
  const [posting, setPosting] = useState(false)

  function validate() {
    const e = {}
    if (message.trim().length < 10)
      e.message = 'Message must be at least 10 characters.'
    if (!selectedGif) e.gif = 'Please search for and select a GIF.'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setPosting(true)
    try {
      const { card } = await createCard({
        boardId,
        message: message.trim(),
        gifUrl: selectedGif.url,
        author: author.trim() || undefined,
      })
      onCardCreated(card)
      setMessage('')
      setAuthor('')
      setSelectedGif(null)
      setErrors({})
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_2px_16px_rgba(124,58,237,0.08)]">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-card-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles size={13} />
        </span>
        Add a card
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelCls}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Write your message…"
            className={`${inputCls} resize-none`}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>
            Your Name <span className="normal-case opacity-60">(optional)</span>
          </label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Alex Taylor"
            className={inputCls}
          />
        </div>
        <div>
          <GifSearch selected={selectedGif} onSelect={setSelectedGif} />
          {errors.gif && <p className="mt-1 text-xs text-red-500">{errors.gif}</p>}
        </div>
        {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}
        <button
          type="submit"
          disabled={posting}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {posting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Posting…
            </>
          ) : (
            'Post Card'
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateCardForm
