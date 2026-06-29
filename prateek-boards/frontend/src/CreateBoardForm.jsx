import React, { useState } from 'react';
import './CreateBoardForm.css';

function CreateBoardForm({ onBoardCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('celebration');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call parent function with new board data
      await onBoardCreated({
        title: title.trim(),
        category,
        author: author.trim() || null,
        imageUrl: imageUrl.trim()
      });

      // Reset form after successful creation
      setTitle('');
      setCategory('celebration');
      setAuthor('');
      setImageUrl('');
    } catch (err) {
      setError('Failed to create board. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="create-board-form" onSubmit={handleSubmit}>
      <h2>Create New Board</h2>

      <div className="form-group">
        <label htmlFor="title">
          Board Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="celebration">🎉 Celebration</option>
          <option value="thank-you">🙏 Thank You</option>
          <option value="inspiration">💡 Inspiration</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="author">Author (optional)</label>
        <input
          id="author"
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">
          Image URL <span className="required">*</span>
        </label>
        <input
          id="imageUrl"
          type="url"
          placeholder="https://media.giphy.com/..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSubmitting}
        />
        <small className="hint">
          Tip: Search for GIFs on{' '}
          <a
            href="https://giphy.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Giphy.com
          </a>
          , right-click a GIF, and copy the image address
        </small>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? 'Creating...' : '✨ Create Board'}
      </button>
    </form>
  );
}

export default CreateBoardForm;
