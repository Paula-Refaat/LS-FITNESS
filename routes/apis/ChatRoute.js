const express = require("express");
const {
  createSingleChat,
  createGroupChat,
  findChat,
  getChatDetails,
  deleteChat,
  pinMessageInChat,
  unpinMessageInChat,
  archiveChat,
  unarchiveChat,
  getMyChats,
  getAllChats,
  uploadChatImg,
  resizeImage,
} = require("../../services/ChatServices");
const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
router.get(
  "/",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Chat", "read"),
  getAllChats
);

router.post(
  "/:receiverId",
  authServices.protect,
  // authServices.allowTo("admin"),
  createSingleChat
);
router.post(
  "/group/groupChat",
  authServices.protect,
  uploadChatImg,
  resizeImage,
  createGroupChat
);

router.get("/myChats", authServices.protect, getMyChats);
router.get("/:chatId/details", authServices.protect, getChatDetails);
router.get("/find/:secondPersonId", authServices.protect, findChat);
router.delete(
  "/:chatId",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Chat", "read"),
  deleteChat
);
router.post("/:chatId/pin/:messageId", authServices.protect, pinMessageInChat);
router.delete(
  "/:chatId/unpin/:messageId",
  authServices.protect,
  unpinMessageInChat
);
router.put("/:chatId/archive", authServices.protect, archiveChat);
router.put("/:chatId/unarchive", authServices.protect, unarchiveChat);

module.exports = router;
