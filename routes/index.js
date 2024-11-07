const multer = require("multer"); // Import multer
const authRoute = require("./apis/authRoute");
const userRoute = require("./apis/userRoute");
const categoryRoute = require("./apis/categoryRoute");
const bodyPartRoute = require("./apis/bodyPartRoute");
const exerciseRoute = require("./apis/exerciseRoute");
const mealsCalculationRoute = require("./apis/mealsCalculationRoute");
const progressRoute = require("./apis/progressRoute");
const mealsCategoryRoute = require("./apis/mealsCategoryRoute");

const { getNutritionDetails } = require("../utils/helpers/nutrition");

const mountRoute = (app) => {
  // Configure multer to handle form-data (optional storage)
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  // Mount Routes with multer middleware for form-data
  app.use("/api/v1/auth", upload.none(), authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/categories", upload.none(), categoryRoute);
  app.use("/api/v1/bodyParts", upload.none(), bodyPartRoute);
  app.use("/api/v1/exercises", upload.none(), exerciseRoute);
  app.use("/api/v1/mealsCalculation", upload.none(), mealsCalculationRoute);
  app.use("/api/v1/progress", upload.none(), progressRoute);
  app.use("/api/v1/mealsCategory", upload.none(), mealsCategoryRoute);

  // API endpoint to upload and analyze an image
  app.post("/api/v1/nutrition", upload.single("image"), getNutritionDetails);
};

module.exports = mountRoute;
