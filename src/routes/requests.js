import express from 'express';
import Request from '../models/Request.js';
import Book from '../models/Book.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/requests
 * Create a request for a book
 * body: { bookId }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (String(book.owner) === req.user.id) {
      return res.status(400).json({ message: 'Cannot request your own book' });
    }

    const existing = await Request.findOne({ book: bookId, requester: req.user.id, status: 'pending' });
    if (existing) return res.status(409).json({ message: 'You already requested this book (pending)' });

    const reqDoc = await Request.create({ book: bookId, requester: req.user.id, status: 'pending' });
    res.status(201).json(reqDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/requests/mine
 * Requests I have made
 */
router.get('/mine', auth, async (req, res) => {
  try {
    const list = await Request.find({ requester: req.user.id })
      .populate('book');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/requests/received
 * Requests for my books
 */
router.get('/received', auth, async (req, res) => {
  try {
    // Find requests where the book owner is me
    const list = await Request.find().populate('book');
    const filtered = list.filter(r => String(r.book.owner) === req.user.id);
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PATCH /api/requests/:id
 * Update status (only book owner can accept/decline)
 * body: { status: 'accepted' | 'declined' }
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const doc = await Request.findById(req.params.id).populate('book');
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (String(doc.book.owner) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    doc.status = status;
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
