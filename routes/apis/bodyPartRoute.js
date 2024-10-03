const express = require("express");

const {
  getBodyPartValidator,
  createBodyPartValidator,
  updateBodyPartValidator,
  // deleteBodyPartValidator,
} = require("../../utils/validators/bodyPartValidator");
const {
  getBodyParts,
  createBodyPart,
  getBodyPart,
  updateBodyPart,
  // deleteBodyPart,
} = require("../../services/bodyPartServices");

const authServices = require("../../services/authServices");

// const serviceRoute = require("./serviceRoute");

const router = express.Router();

// router.use("/:BodyPartId/service", serviceRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getBodyParts
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    createBodyPartValidator,
    createBodyPart
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin"),
    getBodyPartValidator,
    getBodyPart
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    updateBodyPartValidator,
    updateBodyPart
  );
// .delete(
//   authServices.protect,
//   authServices.allowTo("admin"),
//   deleteBodyPartValidator,
//   deleteBodyPart
// );

module.exports = router;
