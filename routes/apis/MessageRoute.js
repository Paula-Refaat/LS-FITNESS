const express = require("express");
const {
  getMessagesValidator,
} = require("../../utils/validators/messagesValidator");
const {
  replyToMessage,
  getRepliesToMessage,
  uploadMedia,
  resize,
  addMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  toggleReactionToMessage,
  createFilterObj,
  isMutedChat,
  getReactionsToMessage,
} = require("../../services/MessageServices");
const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/:chatId",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "create"),
  uploadMedia,
  resize,
  isMutedChat,
  addMessage
);

router.get(
  "/:chatId",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "read"),
  getMessagesValidator,
  createFilterObj,
  getMessages
);

router.put(
  "/:messageId",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "update"),
  uploadMedia,
  resize,
  isMutedChat,
  updateMessage
);

router.post(
  "/:replyToMessageId/reply",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "create"),
  uploadMedia,
  resize,
  isMutedChat,
  replyToMessage
);

router.get(
  "/:messageId/replies",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "read"),
  getRepliesToMessage
);

router.delete(
  "/:messageId",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "delete"),
  isMutedChat,
  deleteMessage
);

router.post(
  "/:messageId/reactions",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "create"),
  toggleReactionToMessage
);

router.get(
  "/:messageId/reactions",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "Ls-trainer", "trainer", "user"),
  checkPermission("Message", "read"),
  getReactionsToMessage
);

module.exports = router;
