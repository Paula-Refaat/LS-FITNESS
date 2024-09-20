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
  .get(authServices.protect, authServices.allowTo("admin"), getUsers)
  .post(
    authServices.protect,
    authServices.allowTo("admin"),
    uploadProfileImage,
    resizeImage,
    setRestrictionOnCreateUser,
    // convertInterestsToArray,
    createUserValidator,
    authServices.signup
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

module.exports = router;
