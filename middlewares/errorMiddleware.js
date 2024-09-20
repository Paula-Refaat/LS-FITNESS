const ApiError = require("../utils/ApiError");

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // for debugging
  });
};

const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Something went wrong!",
  });
};

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again...", 401);

const handleJwtExpired = () =>
  new ApiError("Expired token, please login again...", 401);

// Global error handling middleware
const globalError = (err, req, res, next) => {
  // Set default error status and message if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Check if the environment is development or production
  if (process.env.NODE_ENV === "development") {
    // Handle JWT errors
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    // Send error in development mode
    sendErrorForDev(err, res);
  } else {
    // Handle JWT errors
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    // Send error in production mode
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
