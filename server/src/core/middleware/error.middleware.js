export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
