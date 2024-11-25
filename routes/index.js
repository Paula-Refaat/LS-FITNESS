const multer = require("multer"); // Import multer
const authRoute = require("./apis/authRoute");
const userRoute = require("./apis/userRoute");
const bodyPartRoute = require("./apis/bodyPartRoute");
const deepAnatomyRoute = require("./apis/deepAnatomyRoute");
const toolOrMachineRoute = require("./apis/toolOrMachineRoute");
const exerciseRoute = require("./apis/exerciseRoute");
const mealsCalculationRoute = require("./apis/mealsCalculationRoute");
const progressRoute = require("./apis/progressRoute");
const mealsCategoryRoute = require("./apis/mealsCategoryRoute");
const couponRoute = require("./apis/couponRoute");

const { getNutritionDetails } = require("../utils/helpers/nutrition");

const mountRoute = (app) => {
  // Configure multer to handle form-data (optional storage)
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  // Mount Routes with multer middleware for form-data
  app.use("/api/v1/auth", upload.none(), authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/bodyParts", upload.none(), bodyPartRoute);
  app.use("/api/v1/deepAnatomy", upload.none(), deepAnatomyRoute);
  app.use("/api/v1/toolOrMachine", upload.none(), toolOrMachineRoute);
  app.use("/api/v1/exercises", upload.none(), exerciseRoute);
  app.use("/api/v1/mealsCalculation", mealsCalculationRoute);
  app.use("/api/v1/progress", upload.none(), progressRoute);
  app.use("/api/v1/mealsCategory", upload.none(), mealsCategoryRoute);
  app.use("/api/v1/coupons", upload.none(), couponRoute);

  // API endpoint to upload and analyze an image
  app.post("/api/v1/nutrition", upload.single("image"), getNutritionDetails);
};

module.exports = mountRoute;
