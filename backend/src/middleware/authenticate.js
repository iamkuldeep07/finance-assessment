import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export default async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = header.split(' ')[1];

    // 2. Verify access token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Get user from DB
    const user = await User.findById(decoded.id).lean();

    if (!user || !user.isActive) {
      throw new ApiError(401, 'User not found or account is inactive.');
    }

    // 4. Check if password changed after token issued
    if (
      user.passwordChangedAt &&
      decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
    ) {
      throw new ApiError(401, 'User recently changed password. Please log in again.');
    }

    // 5. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    // Handle JWT errors properly
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Access token expired. Please refresh.'));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid access token.'));
    }

    next(error);
  }
};