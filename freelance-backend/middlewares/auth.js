import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (user.isBanned) {
      return res.status(403).json({ message: 'This account has been banned' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
  }
  next();
};