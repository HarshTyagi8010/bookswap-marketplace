import mongoose from 'mongoose';

/**
 * Book schema
 * - owner: User who posted the book
 * - title, author, condition: book details
 * - imageUrl: optional image (URL string)
 */
const bookSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  condition: { type: String, enum: ['new', 'like new', 'good', 'fair', 'poor'], default: 'good' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
