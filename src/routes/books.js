import express from 'express';
import Book from '../models/Book.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/books
 * Query all books (public)
 */
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('owner', 'name email');
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/books/mine
 * Get books owned by current user
 */
router.get('/mine', auth, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/books
 * body: { title, author, condition, imageUrl }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, author, condition = 'good', imageUrl = '' } = req.body;
    if (!title || !author) return res.status(400).json({ message: 'Title and author are required' });
    const book = await Book.create({ owner: req.user.id, title, author, condition, imageUrl });
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/books/:id
 * Update a book (owner only)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Not found' });
    if (String(book.owner) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const { title, author, condition, imageUrl } = req.body;
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (condition !== undefined) book.condition = condition;
    if (imageUrl !== undefined) book.imageUrl = imageUrl;

    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/books/:id
 * Delete a book (owner only)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Not found' });
    if (String(book.owner) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await book.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
