const express = require("express");

const authServices = require("../../services/authServices");

const checkPermission = require("../../middlewares/permissionMiddleware");
const {
  getAllTrainerProfile,
  filterOnTrainerProfilesNotInTrash,
  createTrainerProfile,
  getTrainerProfile,
  updateTrainerProfile,
  deleteTrainerProfile,
  moveTrainerProfileToRecycleBin,
  restoreTrainerProfileFromRecycleBin,
  filterOnTrainerProfilesInTrash,
  getMyTrainerProfile,
  updateMyTrainerProfile,
  lockMyTrainerProfile,
  unlockMyTrainerProfile,
  addTrainerPlan,
  uploadinfo,
  handleMarketingReqsPdfs,
  getMyTrainerProfilePlans,
  getMyTrainerProfileSubscribers,
  updateMyTrainerPlan,
  removeSpecificPlanFromMyProfile,
} = require("../../services/trainerProfileService");

const router = express.Router();

router.get(
  "/myTrainerProfile",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  getMyTrainerProfile
);
router.put(
  "/updateMyTrainerProfile",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  uploadinfo,
  handleMarketingReqsPdfs,
  updateMyTrainerProfile
);
router.put(
  "/lockMyTrainerProfile",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  lockMyTrainerProfile
);
router.put(
  "/unlockMyTrainerProfile",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  unlockMyTrainerProfile
);
router.post(
  "/addPlanToMyTrainerProfile",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  uploadinfo,
  addTrainerPlan
);
router.get(
  "/myPlans",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  getMyTrainerProfilePlans
);
router.put(
  "/myPlans/:planIndex",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  uploadinfo,
  updateMyTrainerPlan
);
router.delete(
  "/myPlans/:planIndex",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  removeSpecificPlanFromMyProfile
);
router.get(
  "/mySubscribers",
  authServices.protect,
  authServices.allowTo("trainer", "Ls-trainer"),
  getMyTrainerProfileSubscribers
);
////////////////////////////////////////////////////////////////////////
/* Dashboard */
////////////////////////////////////////////////////////////////////////

router
  .route("/")
  .get(
    // authServices.protect,
    // authServices.allowTo("user", "admin", "sub-admin"),
    // checkPermission("ToolOrMachine", "read"),
    filterOnTrainerProfilesNotInTrash,
    getAllTrainerProfile
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("TrainerProfile", "create"),
    uploadinfo,
    handleMarketingReqsPdfs,
    // createToolOrMachineValidator,
    createTrainerProfile
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("user", "admin", "sub-admin", "trainer", "Ls-trainer"),
    checkPermission("TrainerProfile", "read"),
    // getToolOrMachineValidator,
    getTrainerProfile
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("TrainerProfile", "update"),
    uploadinfo,
    handleMarketingReqsPdfs,
    // updateToolOrMachineValidator,
    updateTrainerProfile
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("TrainerProfile", "delete"),
    // deleteToolOrMachineValidator,
    deleteTrainerProfile
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainerProfile", "delete"),
  moveTrainerProfileToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainerProfile", "delete"),
  restoreTrainerProfileFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("TrainerProfile", "delete"),
  filterOnTrainerProfilesInTrash,
  getAllTrainerProfile
);

module.exports = router;
