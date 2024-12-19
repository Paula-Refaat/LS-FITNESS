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
const multer = require("multer"); // Import multer

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
  authServices.allowTo("admin"),
  changeUserPasswordValidator,
  changeUserPassword
);
router.delete("/deleteMyAccount", authServices.protect, deleteLoggedUser);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowTo("admin"),
    filterOnUsersNotInTrash,
    getUsers
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
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
    authServices.allowTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authServices.protect,
    authServices.allowTo("admin"),
    uploadProfileImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authServices.protect,
    authServices.allowTo("admin"),
    deleteUserValidator,
    deleteUser
  );

router.delete(
  "/:id/moveToTrash",
  authServices.protect,
  authServices.allowTo("admin"),
  moveUserToRecycleBin
);
router.put(
  "/:id/restore",
  authServices.protect,
  authServices.allowTo("admin"),
  restoreUserFromRecycleBin
);
router.get(
  "/deleted/trash",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnUsersInTrash,
  getUsers
);

router.get(
  "/getAll/admins",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnAdminUsers,
  getUsers
);
router.get(
  "/getAll/sub-admins",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnSubAdminUsers,
  getUsers
);
router.get(
  "/getAll/trainers",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnTrainerUsers,
  getUsers
);
router.get(
  "/getAll/ls-trainers",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnLsTrainerUsers,
  getUsers
);
router.get(
  "/getAll/trainees",
  authServices.protect,
  authServices.allowTo("admin"),
  filterOnUsersRole,
  getUsers
);

module.exports = router;
