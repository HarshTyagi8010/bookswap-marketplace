import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User schema
 * - email: unique identifier for login
 * - name: display name
 * - password: hashed via bcrypt (never store plain text)
 */
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

// Hash password before save if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password with hash
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
