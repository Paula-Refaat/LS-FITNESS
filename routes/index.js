const multer = require("multer"); // Import multer
const authRoute = require("./apis/authRoute");
const userRoute = require("./apis/userRoute");
const categoryRoute = require("./apis/categoryRoute");
const bodyPartRoute = require("./apis/bodyPartRoute");
const exerciseRoute = require("./apis/exerciseRoute");
const mealsCalculationRoute = require("./apis/mealsCalculationRoute");

const mountRoute = (app) => {
  // Configure multer to handle form-data (optional storage)
  const upload = multer();

  // Mount Routes with multer middleware for form-data
  app.use("/api/v1/auth", upload.none(), authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/categories", upload.none(), categoryRoute);
  app.use("/api/v1/bodyParts", upload.none(), bodyPartRoute);
  app.use("/api/v1/exercises", upload.none(), exerciseRoute);
  app.use("/api/v1/mealsCalculation", upload.none(), mealsCalculationRoute);
};

module.exports = mountRoute;
