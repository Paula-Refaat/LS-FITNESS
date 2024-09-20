const multer = require("multer"); // Import multer
const authRoute = require("./apis/authRoute");
const userRoute = require("./apis/userRoute");
const mountRoute = (app) => {
  // Configure multer to handle form-data (optional storage)
  const upload = multer();

  // Mount Routes with multer middleware for form-data
  app.use("/api/v1/auth", upload.none(), authRoute);
  app.use("/api/v1/users", userRoute);
};

module.exports = mountRoute
