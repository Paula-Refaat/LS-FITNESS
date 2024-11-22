const express = require("express");

const {
  getExerciseValidator,
  createExerciseValidator,
  updateExerciseValidator,
  deleteExerciseValidator,
} = require("../../utils/validators/exerciseValidator");
const {
  getExercises,
  createExercise,
  getExercise,
  updateExercise,
  deleteExercise,
  filterExercisesBasedOnGender,
} = require("../../services/exerciseServices");

const authServices = require("../../services/authServices");

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:ExerciseId/service", serviceRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    filterExercisesBasedOnGender,
    getExercises
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createExerciseValidator,
    createExercise
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getExerciseValidator,
    getExercise
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateExerciseValidator,
    updateExercise
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteExerciseValidator,
    deleteExercise
  );

module.exports = router;
