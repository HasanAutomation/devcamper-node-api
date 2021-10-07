const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  console.log(err.name);
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad object Id
  if (err.name === 'CastError') {
    const message = `Record with id ${err.value} is not found`;
    error = new ErrorResponse(message, 404);
  }

  // Duplicate value
  if (err.code === 11000) {
    const message = `Duplicate value entered ${err?.keyValue?.name}`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });

  next();
};

module.exports = errorHandler;
