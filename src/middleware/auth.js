import jwt from 'jsonwebtoken';

/**
 * JWT authentication middleware.
 * Expects header: Authorization: Bearer <token>
 * Attaches req.user = { id, email, name }
 */
export default function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
}
