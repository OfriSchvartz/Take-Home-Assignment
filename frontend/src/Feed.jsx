import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3000'

function Feed({ token, username }) {
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      } else {
        setError('Could not load posts.')
      }
    } catch {
      setError('Could not reach the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  let ignore = false

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (ignore) return
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      } else {
        setError('Could not load posts.')
      }
    } catch {
      if (!ignore) setError('Could not reach the server.')
    } finally {
      if (!ignore) setLoading(false)
    }
  }

  fetchPosts()

  return () => {
    ignore = true
  }
}, [token])

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