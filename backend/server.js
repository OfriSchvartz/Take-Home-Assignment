const crypto = require('crypto');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const users = [
  { username: 'alice', password: 'password123' },
  { username: 'bob', password: 'hunter2' },
  { username: 'carol', password: 'letmein' },
];

const tokens = new Map();
const posts = [];

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token || !tokens.has(token)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  req.username = tokens.get(token);
  return next();
}

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const token = crypto.randomUUID();
  tokens.set(token, username);

  return res.status(200).json({ token, username });
});

app.get('/posts', authenticate, (req, res) => {
  return res.status(200).json(posts);
});

app.post('/posts', authenticate, (req, res) => {
  const { text } = req.body || {};

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const post = {
    id: crypto.randomUUID(),
    author: req.username,
    text,
    createdAt: new Date().toISOString(),
  };
  posts.push(post);

  return res.status(201).json(post);
});

app.delete('/posts/:id', authenticate, (req, res) => {
  const index = posts.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'post not found' });
  }

  if (posts[index].author !== req.username) {
    return res.status(403).json({ error: 'not allowed to delete this post' });
  }

  posts.splice(index, 1);

  return res.status(200).json({ message: 'post deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
