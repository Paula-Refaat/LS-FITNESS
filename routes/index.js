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
const categoryRoute = require("./apis/categoryRoute");
const courseRoute = require("./apis/courseRoute");
const lessonRoute = require("./apis/lessonRoute");
const quizRoute = require("./apis/quizRoute");
const notificationRoute = require("./apis/notificationRoute");
const orderRoute = require("./apis/orderRoute");
const vimeoSignedUrlRoute = require("./apis/vimeoSignedUrlRoute");

const { getNutritionDetails } = require("../utils/helpers/nutrition");
const trimAll = require("../middlewares/trimMiddleware");

const mountRoute = (app) => {
  // Configure multer to handle form-data (optional storage)
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  app.use(trimAll);
  // Mount Routes with multer middleware for form-data
  app.use("/api/v1/auth", upload.none(), trimAll, authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/bodyParts", upload.none(), trimAll, bodyPartRoute);
  app.use("/api/v1/deepAnatomy", upload.none(), trimAll, deepAnatomyRoute);
  app.use("/api/v1/toolOrMachine", upload.none(), trimAll, toolOrMachineRoute);
  app.use("/api/v1/exercises", upload.none(), trimAll, exerciseRoute);
  app.use("/api/v1/mealsCalculation", trimAll, mealsCalculationRoute);
  app.use("/api/v1/progress", upload.none(), trimAll, progressRoute);
  app.use("/api/v1/mealsCategory", upload.none(), trimAll, mealsCategoryRoute);
  app.use("/api/v1/coupons", upload.none(), trimAll, couponRoute);
  app.use("/api/v1/categories", upload.none(), trimAll, categoryRoute);
  app.use("/api/v1/courses", courseRoute);
  app.use("/api/v1/lessons", lessonRoute);
  app.use("/api/v1/quizzes", quizRoute);
  app.use("/api/v1/notifications", notificationRoute);
  app.use("/api/v1/orders", orderRoute);

  // API endpoint to generate a signed URL for Vimeo video uploads
  app.use("/api/v1/vimeo", vimeoSignedUrlRoute);

  // API endpoint to upload and analyze an image
  app.post("/api/v1/nutrition", upload.single("image"), getNutritionDetails);
};

module.exports = mountRoute;
