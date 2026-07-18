import { useState, useEffect, useCallback } from 'react'

const API_URL = 'http://localhost:3000'

function Feed({ token, username }) {
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Pure network call — no state, so it's safe to call from anywhere
  // (the effect, handleSubmit, handleDelete) without upsetting the
  // "don't call setState indirectly in an effect" lint rule.
  const fetchPosts = useCallback(async () => {
    const res = await fetch(`${API_URL}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('failed to load posts')
    return res.json()
  }, [token])

  // Used by handleSubmit/handleDelete after a mutation — no staleness
  // concerns there since they're triggered by direct user action, not
  // by an effect that could re-fire mid-flight.
  async function loadPosts() {
    setLoading(true)
    try {
      const data = await fetchPosts()
      setPosts(data)
    } catch {
      setError('Could not load posts.')
    } finally {
      setLoading(false)
    }
  }

  // No synchronous setLoading(true) here: `loading` already starts `true`
  // via useState, which covers the initial mount. We don't reset it on
  // every re-run because `token` never actually changes while Feed is
  // mounted (logging out unmounts Feed and renders Login instead) — so
  // this effect only ever runs once, on mount.
  useEffect(() => {
    let ignore = false

    fetchPosts()
      .then((data) => {
        if (!ignore) setPosts(data)
      })
      .catch(() => {
        if (!ignore) setError('Could not load posts.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [token, fetchPosts])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) {
      setError('Post cannot be empty.')
      return
    }

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      })
      if (res.status === 201) {
        setText('')
        loadPosts()
      } else {
        setError('Could not create post.')
      }
    } catch {
      setError('Could not reach the server.')
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        loadPosts()
      } else {
        setError('Could not delete post.')
      }
    } catch {
      setError('Could not reach the server.')
    }
  }

  return (
    <div>
      <h1>Feed</h1>
      <p>Logged in as {username}</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <button type="submit">Post</button>
      </form>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <strong>{post.author}</strong>
              <p>{post.text}</p>
              <small>{new Date(post.createdAt).toLocaleString()}</small>
              {post.author === username && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete this post?')) {
                    handleDelete(post.id)
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Feed