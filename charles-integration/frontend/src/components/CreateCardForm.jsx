import { useState } from 'react'
import { createCard, GIPHY_API_KEY } from '../api'
import './CreateCardForm.css'

// Brandon's component (built from spec) — message + author + GIPHY search/select.
// Props: boardId, onCardCreated(card)
function CreateCardForm({ boardId, onCardCreated }) {
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [giphySearchQuery, setGiphySearchQuery] = useState('')
  const [giphyResults, setGiphyResults] = useState([])
  const [selectedGif, setSelectedGif] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleGiphySearch(e) {
    e.preventDefault()
    if (!giphySearchQuery) return

    setIsSearching(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          giphySearchQuery,
        )}&limit=12`,
      )
      const data = await res.json()
      setGiphyResults(data.data || [])
    } catch {
      setError('GIPHY search failed. Try again.')
    } finally {
      setIsSearching(false)
    }
  }

  function selectGif(gif) {
    setSelectedGif(gif)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const gifUrl = selectedGif?.images?.original?.url
    if (!message || !gifUrl) {
      setError('A message and a selected GIF are required.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const { card } = await createCard({
        boardId,
        message,
        gifUrl,
        author: author || undefined,
      })
      onCardCreated(card)
      setMessage('')
      setAuthor('')
      setGiphySearchQuery('')
      setGiphyResults([])
      setSelectedGif(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="create-card-form" onSubmit={handleSubmit}>
      <h3 className="create-card-form__heading">Add a card</h3>

      <textarea
        className="create-card-form__message"
        placeholder="Your message *"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author (optional)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* GIPHY search. Nested forms aren't allowed, so this is a div with a
          button that triggers search instead of a submit. */}
      <div className="create-card-form__giphy">
        <div className="create-card-form__giphy-search">
          <input
            type="text"
            placeholder="Search GIPHY…"
            value={giphySearchQuery}
            onChange={(e) => setGiphySearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGiphySearch(e)
            }}
          />
          <button type="button" onClick={handleGiphySearch} disabled={isSearching}>
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        </div>

        {giphyResults.length > 0 && (
          <div className="create-card-form__giphy-results">
            {giphyResults.map((gif) => (
              <img
                key={gif.id}
                src={gif.images.fixed_height_small?.url || gif.images.original.url}
                alt={gif.title}
                className={
                  'create-card-form__giphy-thumb' +
                  (selectedGif?.id === gif.id ? ' is-selected' : '')
                }
                onClick={() => selectGif(gif)}
              />
            ))}
          </div>
        )}

        {selectedGif && (
          <div className="create-card-form__selected">
            <span>Selected GIF:</span>
            <img src={selectedGif.images.original.url} alt="selected gif" />
          </div>
        )}
      </div>

      {error && <p className="create-card-form__error">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting…' : 'Post card'}
      </button>
    </form>
  )
}

export default CreateCardForm
