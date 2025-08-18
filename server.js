/**
 * BookSwap Marketplace - Express Server
 * -------------------------------------
 * Features
 *  - JWT-based auth (register/login)
 *  - Users can post books (title, author, condition, imageUrl)
 *  - Book requests with statuses: pending, accepted, declined
 *  - Owners can manage their books and incoming requests
 *  - Minimal HTML frontend served from ./public
 *
 * Tech stack: Node.js, Express, Mongoose (MongoDB), JWT
 *
 * To run:
 * 1) Copy .env.example to .env and set values
 * 2) npm install
 * 3) npm run dev
 */
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './src/routes/auth.js';
import bookRouter from './src/routes/books.js';
import requestRouter from './src/routes/requests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/requests', requestRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler (last)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookswap';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
