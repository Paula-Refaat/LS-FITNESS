const express = require("express");

const authServices = require("../../services/authServices");
const {
  AddToProgressValidator,
  getProgressByExerciseIdValidator,
} = require("../../utils/validators/progressValidator");
const {
  AddToProgress,
  getMyProgressByExerciseId,
} = require("../../services/progressServices");

const router = express.Router();

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowTo("user"),
    AddToProgressValidator,
    AddToProgress
  );
router
  .route("/:exerciseId")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getProgressByExerciseIdValidator,
    getMyProgressByExerciseId
  );

module.exports = router;
