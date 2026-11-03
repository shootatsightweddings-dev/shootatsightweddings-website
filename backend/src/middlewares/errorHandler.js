const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (['ValidationError','CastError'].includes(err.name) ? 400 : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
