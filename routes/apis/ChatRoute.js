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
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "create"),
  createSingleChat
);
router.post(
  "/group/groupChat",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "create"),
  uploadChatImg,
  resizeImage,
  createGroupChat
);

router.get(
  "/myChats",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "read"),
  getMyChats
);
router.get(
  "/:chatId/details",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "read"),
  getChatDetails
);
router.get(
  "/find/:secondPersonId",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "read"),
  findChat
);
router.delete(
  "/:chatId",
  authServices.protect,
  authServices.allowTo("sub-admin", "admin"),
  checkPermission("Chat", "delete"),
  deleteChat
);
router.post(
  "/:chatId/pin/:messageId",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "create"),
  pinMessageInChat
);
router.delete(
  "/:chatId/unpin/:messageId",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "delete"),
  unpinMessageInChat
);
router.put(
  "/:chatId/archive",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "update"),
  archiveChat
);
router.put(
  "/:chatId/unarchive",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Chat", "update"),
  unarchiveChat
);

module.exports = router;
