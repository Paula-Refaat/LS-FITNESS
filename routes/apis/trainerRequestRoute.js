const express = require("express");

// const {
//   idCheckValidator,
//   requestToBeTrainerValidator,
//   updateTrainerRequestValidator,
// } = require("../utils/validators/TrainerRequestValidator");
const {
  getTrainerRequest,
  getTrainerRequests,
  deleteTrainerRequest,
  requestToBeTrainer,
  uploadinfo,
  handleMarketingReqsPdfs,
  updateTrainerRequest,
  acceptTrainerRequest,
  rejectTrainerRequest,
  createFilterObj,
  // requestToBeTrainer,
} = require("../../services/trainerRequestService");
const checkPermission = require("../../middlewares/permissionMiddleware");

const authServices = require("../../services/authServices");
const { handleImageMiddleware } = require("../../middlewares/handleImageFieldsMiddleware");

const router = express.Router();
router.post(
  "/",
  authServices.protect,
  uploadinfo,
  handleMarketingReqsPdfs,
  // requestToBeTrainerValidator,
  requestToBeTrainer
);
router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("admin", "user", "trainer", "sub-admin"),
    checkPermission("TrainerRequest", "read"),
    createFilterObj,
    getTrainerRequests
  );

router.use(authServices.protect, authServices.allowTo("admin", "sub-admin"));

router
  .route("/:id")
  .get(
    // idCheckValidator,
    checkPermission("TrainerRequest", "read"),
    getTrainerRequest
  )
  .delete(
    // idCheckValidator,
    checkPermission("TrainerRequest", "delete"),
    deleteTrainerRequest
  )
  .put(
    checkPermission("TrainerRequest", "update"),
    uploadinfo,
    handleImageMiddleware,
    handleMarketingReqsPdfs,
    // idCheckValidator,
    // updateTrainerRequestValidator,
    updateTrainerRequest
  );
router.put(
  "/:id/accept",
  checkPermission("TrainerRequest", "update"),
  acceptTrainerRequest
);
router.put(
  "/:id/reject",
  checkPermission("TrainerRequest", "update"),
  rejectTrainerRequest
);

module.exports = router;
