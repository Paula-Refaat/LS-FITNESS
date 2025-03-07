const path = require("path");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const compression = require("compression");

// Load environment variables from.env file
dotenv.config({ path: "config.env" });


const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const globalError = require("./middlewares/errorMiddleware");
const mountRoute = require("./routes");
const trimAll = require("./middlewares/trimMiddleware");
const {
  handleImageMiddleware,
} = require("./middlewares/handleImageFieldsMiddleware");

const cleanupTokens = require("./utils/cronJobs/cleanupTokens");

// DB Connection
dbConnection();

// Express app
const app = express();
// Enable trust proxy to properly handle 'X-Forwarded-For'
app.set("trust proxy", 1); // Trust the first proxy (Koyeb or similar platforms)
// Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GZIP Compression
app.use(compression());

// Static Files
app.use(express.static(path.join(__dirname, "uploads")));

// Trim Input Middleware
app.use(trimAll);

app.use(handleImageMiddleware);

// Enable CORS
app.use(
  cors({
    origin: true,
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

// تشغيل Cron Job
cleanupTokens; // Node-Cron يبدأ تلقائيًا

// Initialize Passport
app.use(passport.initialize());

// Handel unhanding Routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't found this Route : ${req.originalUrl}`, 400));
});
// const mongoose = require("mongoose");
// const validModels = mongoose.modelNames();
// console.log(validModels);
// Global error handling middleware
app.use(globalError);

// Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

// Initialize Socket.IO server and integrate with Express
const { initSocket } = require("./socket/index");

initSocket(server);

// Handle unhandled promise rejection
process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Error : ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Shutting down.... ");
    process.exit(1);
  });
});
