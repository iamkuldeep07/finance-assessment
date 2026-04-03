import ApiError from '../utils/ApiError.js';

export default (err, req, res, next) => {
  let error = { ...err };
  
  error.message = err.message;
  error.name = err.name;

  // Log the raw error to the console for the developer
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid format for ${err.path}: ${err.value}`;
    error = new ApiError(404, message);
  }

  // 2. Mongoose Duplicate Key (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    error = new ApiError(409, message);
  }

  // 3. Mongoose Schema Validation Error 
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, 'Database validation failed', messages);
  }

  // Final Response Construction
  const statusCode = error.statusCode || 500;
  
  // If it's not a known operational error, hide the internal message in production
  const finalMessage = error.isOperational 
    ? error.message 
    : 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: finalMessage,
    errors: error.errors || [],
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};