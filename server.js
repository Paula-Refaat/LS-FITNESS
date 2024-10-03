const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");

dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");
const mountRoute = require("./routes");
const trimAll = require("./middlewares/trimMiddleware");

// DB Connection
dbConnection();

// Express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(trimAll); // Use the trimAll middleware
app.use(express.static(path.join(__dirname, "uploads")));

// Enable CORS
//enable other domains access your application
app.use(
  cors({
    origin: true, // dynamically set the origin based on request origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
mountRoute(app);

// Initialize Passport
app.use(passport.initialize());

// Handel unhanding Routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't found this Route : ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

// Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Error : ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Shutting down.... ");
    process.exit(1);
  });
});
