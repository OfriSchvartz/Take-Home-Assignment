# Social Feed — Take Home Assignment

A minimal social feed app: users log in with a predefined account, view all posts, add a post, and delete their own posts.

## Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Storage: in-memory (no database)
- Auth: opaque token (random UUID), sent via `Authorization: Bearer <token>` header

## How to Run

### Backend
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:3000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

Open the frontend URL in your browser. The backend must be running for login/feed to work.

### Test users
| username | password    |
|----------|-------------|
| alice    | password123 |
| bob      | hunter2     |
| carol    | letmein     |

## API Contract
POST   /login
Body: { username, password }
200 { token, username } | 400 missing fields | 401 bad credentials

GET    /posts
Header: Authorization: Bearer <token>
200 [ { id, author, text, createdAt } ] | 401 invalid/missing token

POST   /posts
Header: Authorization: Bearer <token>
Body: { text }
201 { id, author, text, createdAt } | 400 empty text | 401 invalid token

DELETE /posts/:id
Header: Authorization: Bearer <token>
200 { message } | 401 invalid token | 403 not the owner | 404 post not found

## Decisions & Tradeoffs

- **Opaque tokens instead of JWT** — no expiry/revocation was required, so a simple server-side token→user map was simpler to implement and explain than signed JWTs.
- **Hardcoded user array instead of a file/DB** — assignment says no registration is needed, so a fixed in-memory list met the requirement with the least complexity.
- **Text-only posts, no media upload** — assignment scope is "short text posts"; file/image upload would add significant complexity (storage, validation) not required by the brief.
- **Author derived from the token server-side, never from client-submitted data** — prevents a logged-in user from posting or deleting as someone else. Verified this is enforced at the API level (not just hidden in the UI) by attempting a cross-user delete directly via curl — correctly returns 403.
- **Single-file backend** — small enough API surface that splitting into routes/controllers/services would add structure without real benefit at this scale.
- **sessionStorage for the token (frontend)** — survives page refresh, clears when the tab/browser closes. A UX choice on top of the assignment's minimum requirement (which only needed the token attached to requests), not a security mechanism.
- **Refetching the full post list after create/delete**, rather than manually patching local state — simpler and less error-prone at this scale than manual state reconciliation.
- **Native `window.confirm()` for delete confirmation** — avoids building a custom modal component for a single, low-frequency interaction.

## What I'd add with more time
- Password hashing (bcrypt) and token expiry — explicitly out of scope per the assignment, but would be necessary for anything beyond a demo.
- Pagination or infinite scroll for the feed, once post volume grows.
- Optimistic UI updates instead of refetching the whole list after every create/delete.
- Automated tests (backend route tests, frontend component tests).
- Visual styling/design pass — current UI is functional but unstyled.
- A custom confirmation modal instead of the native browser dialog, for better visual consistency.