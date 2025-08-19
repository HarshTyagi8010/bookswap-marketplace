# 📚 BookSwap Marketplace

A minimal, production-ready _starter_ for a book exchange platform built with **Node.js + Express + MongoDB (Mongoose)** and **JWT authentication**. Includes a small vanilla-HTML frontend that talks to the API via `fetch`.

## ✨ Features

- ✅ **JWT auth**: Register & login, secure protected endpoints
- 📖 **Books**: Post, list all, list mine, update, delete (owner-only)
- 🔁 **Requests**: Create request for a book, view my requests, view incoming requests for my books, accept/decline (owner-only)
- 🖼️ **Images**: Optional `imageUrl` string on books (paste any image URL)
- 🧩 **Minimal frontend**: `public/index.html` lets you try everything without Postman

---

## 🚀 Quick Start

### 1) Clone and setup
```bash
git clone <your-fork-or-download-zip>
cd bookswap-marketplace
cp .env.example .env
npm install
```

Update `.env` if needed:
```
MONGO_URI=mongodb://localhost:27017/bookswap
JWT_SECRET=supersecret-dev-key
PORT=5000
```

> You can use **MongoDB Atlas** (cloud) or **local MongoDB**.

### 2) Run
```bash
npm run dev
```
Open http://localhost:5000 in your browser.

---

## 🧠 API Overview

Base URL: `http://localhost:5000`

### Auth
- `POST /api/auth/register` – `{ name, email, password }`
- `POST /api/auth/login` – `{ email, password }`

Both return:
```json
{ "token": "JWT...", "user": { "id": "...", "name": "...", "email": "..." } }
```
Pass the token in `Authorization: Bearer <token>` for protected routes.

### Books
- `GET /api/books` – list all (public)
- `GET /api/books/mine` – list my books (auth)
- `POST /api/books` – create (auth) `{ title, author, condition, imageUrl }`
- `PUT /api/books/:id` – update (auth, owner-only)
- `DELETE /api/books/:id` – delete (auth, owner-only)

### Requests
- `POST /api/requests` – create (auth) `{ bookId }`
- `GET /api/requests/mine` – requests I made (auth)
- `GET /api/requests/received` – requests for my books (auth)
- `PATCH /api/requests/:id` – accept/decline (auth, owner-only) `{ status: "accepted" | "declined" }`

---

## 🗂️ Project Structure

```
bookswap-marketplace/
├─ public/
│  └─ index.html              # Minimal UI
├─ src/
│  ├─ middleware/
│  │  └─ auth.js              # JWT auth middleware
│  ├─ models/
│  │  ├─ Book.js              # Book schema
│  │  ├─ Request.js           # Request schema
│  │  └─ User.js              # User schema with bcrypt
│  └─ routes/
│     ├─ auth.js              # /api/auth
│     ├─ books.js             # /api/books
│     └─ requests.js          # /api/requests
├─ server.js                  # Express app entry
├─ package.json
├─ .env.example
└─ README.md
```

---

## 🔐 Notes on Security & Auth

- Passwords are **hashed with bcrypt** before storing.
- JWT contains `{ id, email, name }` and defaults to 7d expiry.
- Protected routes require `Authorization: Bearer <token>`.

---

## 🧪 Manual Test Flow

1. Register two users (A and B) from the page.
2. As A, **post a book**.
3. As B, **request** A's book.
4. As A, open **Incoming Requests** and **accept/decline**.
5. Watch statuses update in both lists.

---

## 🛠️ Extending

- Add pagination & search to `/api/books`.
- Replace `imageUrl` with actual image upload (Multer + storage).
- Add chat between owner & requester after acceptance.
- Add email notifications or push.

---

## ✅ Submission Tips

- Code is commented and readable.
- Minimal UI demonstrates **all core features**.
- Works with any MongoDB connection string (local or Atlas).
- No external services required beyond MongoDB.

