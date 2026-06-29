import { useState } from 'react'
import { createBoard } from '../api'
import './CreateBoardForm.css'

// Prateek's component (built from spec).
// Props: onBoardCreated(board)
function CreateBoardForm({ onBoardCreated }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('celebration')
  const [author, setAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title || !category || !imageUrl) {
      setError('Title, category, and image URL are required.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const { board } = await createBoard({
        title,
        category,
        author: author || undefined,
        imageUrl,
      })
      onBoardCreated(board)
      setTitle('')
      setCategory('celebration')
      setAuthor('')
      setImageUrl('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="create-board-form" onSubmit={handleSubmit}>
      <h3 className="create-board-form__heading">Create a board</h3>
      <div className="create-board-form__fields">
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="celebration">Celebration</option>
          <option value="thank-you">Thank You</option>
          <option value="inspiration">Inspiration</option>
        </select>
        <input
          type="text"
          placeholder="Author (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL *"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      {error && <p className="create-board-form__error">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create board'}
      </button>
    </form>
  )
}

export default CreateBoardForm
