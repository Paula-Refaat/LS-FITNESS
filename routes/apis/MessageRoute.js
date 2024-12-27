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

const router = express.Router();

router.post(
  "/:chatId",
  authServices.protect,
  uploadMedia,
  resize,
  isMutedChat,
  addMessage
);
router.get(
  "/:chatId",
  authServices.protect,
  getMessagesValidator,
  createFilterObj,
  getMessages
);

router.put(
  "/:messageId",
  authServices.protect,
  uploadMedia,
  resize,
  isMutedChat,
  updateMessage
);
router.post(
  "/:messageId/reply",
  authServices.protect,
  uploadMedia,
  resize,
  isMutedChat,
  replyToMessage
);
router.get("/:messageId/replies", authServices.protect, getRepliesToMessage);
router.delete("/:messageId", authServices.protect, isMutedChat, deleteMessage);
router.post(
  "/:messageId/reactions",
  authServices.protect,
  toggleReactionToMessage
);
router.get(
  "/:messageId/reactions",
  authServices.protect,
  getReactionsToMessage
);
module.exports = router;
