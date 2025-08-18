import mongoose from 'mongoose';

/**
 * Request schema
 * - book: The book being requested
 * - requester: The user who requested it
 * - status: pending | accepted | declined
 * - NOTE: Only the book's owner can accept/decline
 */
const requestSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { timestamps: true });

// Prevent duplicate active requests for the same user-book pair while pending
requestSchema.index({ book: 1, requester: 1, status: 1 });

export default mongoose.model('Request', requestSchema);
