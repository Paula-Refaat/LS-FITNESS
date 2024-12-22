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
  // requestToBeTrainer,
} = require("../../services/trainerRequestService");

const authServices = require("../../services/authServices");

const router = express.Router();
router.post(
  "/",
  authServices.protect,
  uploadinfo,
  handleMarketingReqsPdfs,
  // requestToBeTrainerValidator,
  requestToBeTrainer
);
router.use(authServices.protect, authServices.allowTo("admin"));

router.route("/").get(getTrainerRequests);

router
  .route("/:id")
  .get(
    // idCheckValidator,
    getTrainerRequest
  )
  .delete(
    // idCheckValidator,
    deleteTrainerRequest
  )
  .put(
    uploadinfo,
    handleMarketingReqsPdfs,
    // idCheckValidator,
    // updateTrainerRequestValidator,
    updateTrainerRequest
  );
router.put("/:id/accept", acceptTrainerRequest);
router.put("/:id/reject", rejectTrainerRequest);

module.exports = router;
