# Project: Social Feed — Take Home Assignment

## What this is
A minimal social feed app: predefined users log in, view posts, add a post,
delete their own posts. Take-home assignment for a junior fullstack interview.
Graded on: code structure, API design, auth flow, scoping judgment, and the
ability to explain/defend every decision in a follow-up interview.

## Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Storage: in-memory only, no database
- Auth: opaque token (crypto.randomUUID()), NOT JWT — stored server-side in a
  Map (token -> username). Chosen for simplicity; no expiry/revocation needed.
- Linting: ESLint (default Vite config)

## API Contract (do not deviate without asking)
POST   /login
       Body: { username, password }
       200 { token } | 400 missing fields | 401 bad credentials

GET    /posts
       Header: Authorization: Bearer <token>
       200 [ { id, author, text, createdAt } ] | 401 invalid/missing token

POST   /posts
       Header: Authorization: Bearer <token>
       Body: { text }
       author is derived server-side from the token via the tokens Map —
       NEVER taken from the request body (security requirement, not a
       style preference)
       201 { id, author, text, createdAt } | 400 empty text | 401 invalid token

DELETE /posts/:id
       Header: Authorization: Bearer <token>
       200 { message } | 401 invalid token | 403 valid token, not the owner
       | 404 post not found

## Scope — explicitly OUT
- No registration (fixed hardcoded user list only)
- No password hashing / token expiry (assignment says not required)
- No media upload (images/video/emoji-as-file) — text only
- No likes, comments, or any feature beyond: view feed, add post, delete own post
- Do not add features not listed above without asking first, even if they
  seem like natural extensions.

## Frontend conventions
- Token persistence: sessionStorage (survives refresh, clears on tab/browser
  close) — not localStorage.
- Use fetch, not axios (no new dependency needed, keeps it simple to explain).
- Keep components small and named clearly (Login.jsx, Feed.jsx, etc.)

## Git workflow
- Never commit directly to master.
- Before starting any new feature, create a branch: feature/<short-name>
- When a feature is complete, STOP and tell me — do not merge or push to
  master yourself. I review and merge manually.
- Keep commits scoped to one logical change each, with clear messages.

## Working style
- Build one endpoint/component at a time. Don't scaffold multiple features
  in a single response unless explicitly asked.
- Explain non-obvious code choices in comments sparingly — I need to be able
  to explain this code myself in an interview, so favor clarity over
  cleverness.
