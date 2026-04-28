const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  console.log(error);

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};

module.exports = errorHandler;
