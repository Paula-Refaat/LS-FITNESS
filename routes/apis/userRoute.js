const express = require("express");
const {
  getUserValidator,

  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  changeLoggedUserPasswordValidator,
} = require("../../utils/validators/userValidator");
const authServices = require("../../services/authServices");
const {
  setRestrictionOnCreateUser,
  convertInterestsToArray,
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  uploadProfileImage,
  resizeImage,
  deleteLoggedUser,
  moveUserToRecycleBin,
  restoreUserFromRecycleBin,
  filterOnUsersInTrash,
  filterOnUsersNotInTrash,
  filterOnAdminUsers,
  filterOnSubAdminUsers,
  filterOnTrainerUsers,
  filterOnLsTrainerUsers,
  filterOnUsersRole,
  // deleteLoggedUser,
  // activeLoggedUser,
} = require("../../services/userService");
const checkPermission = require("../../middlewares/permissionMiddleware");

const multer = require("multer"); // Import multer
const { handleImageMiddleware } = require("../../middlewares/handleImageFieldsMiddleware");

const router = express.Router();
const upload = multer();
router.get("/getMe", authServices.protect, getLoggedUserData, getUser);
// router.delete("/deleteMe", authServices.protect, deleteLoggedUser);
// router.put("/activeMe", authServices.protect, activeLoggedUser);

router.put(
  "/changeMyPassword",
  authServices.protect,
  upload.none(),
  changeLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/changeMyData",
  authServices.protect,
  uploadProfileImage,
  handleImageMiddleware,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.post(
  "/MyGoals",
  authServices.protect,
  authServices.protect,
  uploadProfileImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.put(
  "/changePassword/:id",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "update"),
  changeUserPasswordValidator,
  changeUserPassword
);
router.delete("/deleteMyAccount", authServices.protect, deleteLoggedUser);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("User", "read"),
    filterOnUsersNotInTrash,
    getUsers
  )
  .post(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("User", "create"),
    uploadProfileImage,
    resizeImage,
    setRestrictionOnCreateUser,
    // convertInterestsToArray,
    createUserValidator,
    createUser
    // authServices.signup
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("User", "read"),
    getUserValidator,
    getUser
  )
  .put(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("User", "update"),
    uploadProfileImage,
    handleImageMiddleware,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authServices.protect,
    authServices.allowTo("sub-admin", "admin"),
    checkPermission("User", "delete"),
    deleteUserValidator,
    deleteUser
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "delete"),
  moveUserToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "delete"),
  restoreUserFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "delete"),
  filterOnUsersInTrash,
  getUsers
);

router.get(
  "/getAll/admins",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "read"),
  filterOnAdminUsers,
  getUsers
);
router.get(
  "/getAll/sub-admins",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "read"),
  filterOnSubAdminUsers,
  getUsers
);
router.get(
  "/getAll/trainers",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "read"),
  filterOnTrainerUsers,
  getUsers
);
router.get(
  "/getAll/ls-trainers",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "read"),
  filterOnLsTrainerUsers,
  getUsers
);
router.get(
  "/getAll/trainees",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("User", "read"),
  filterOnUsersRole,
  getUsers
);

module.exports = router;
