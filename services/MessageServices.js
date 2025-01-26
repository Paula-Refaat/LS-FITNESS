const asyncHandler = require("express-async-handler");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");
const Notification = require("../models/notificationModel");
// const User = require("../models/userModel");
const factory = require("./handllerFactory");
const ApiError = require("../utils/ApiError");
// const sendEmail = require("../utils/sendEmail");
const { uploadMixOfMedia } = require("../middlewares/uploadImageMiddleware");
const ObjectId = require("mongoose").Types.ObjectId;

const allowedMimeTypes =
  process.env.ALLOWED_MIME_TYPES ||
  "image/jpeg|image/png|image/gif|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|video/mp4|video/mpeg|audio/mpeg|audio/wav";

const ALLOWED_MIME_TYPES = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "application/pdf": "pdf",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "document",
  "video/mp4": "video",
  "video/mpeg": "video",
  "audio/mpeg": "audio",
  "audio/wav": "audio",
  "application/zip": "archive",
  "application/x-zip-compressed": "archive",
  "application/octet-stream": "archive",
  "application/x-rar-compressed": "archive",
  "application/x-tar": "archive",
  "application/x-7z-compressed": "archive",
  "text/plain": "text",
  "text/csv": "text",
  "application/vnd.ms-excel": "spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "spreadsheet",
};

exports.uploadMedia = uploadMixOfMedia(
  [
    {
      name: "media",
      maxCount: 15,
    },
  ],
  allowedMimeTypes
);

exports.resize = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.media && req.files.media.length) {
    req.body.media = [];
    const uploadDir = path.join("uploads", "messages");
    await fs.mkdir(uploadDir, { recursive: true });

    for (const file of req.files.media) {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const newFileName = `media-${uuidv4()}-${Date.now()}${fileExtension}`;
      const fileType = ALLOWED_MIME_TYPES[file.mimetype] || `${fileExtension}`;

      await fs.writeFile(path.join(uploadDir, newFileName), file.buffer);

      req.body.media.push({
        url: newFileName,
        type: fileType,
      });
    }

    if (!req.body.media.length) {
      return next(new ApiError("No files were uploaded.", 400));
    }
  }
  next();
});

//@desc check if chat is muted and prevent user,lawyer from sending message
//@access protected
exports.isMutedChat = asyncHandler(async (req, res, next) => {
  try {
    const { chatId } = req.params; //chatId
    const { messageId } = req.params;
    if (chatId) {
      const chat = await Chat.findOne({ _id: chatId, status: "muted" });
      if (chat) {
        return next(new ApiError("Chat is muted", 403));
      }
    }
    if (messageId) {
      const message = await Message.findOne({ _id: messageId });
      const chat = await Chat.findOne({ _id: message.chat, status: "muted" });
      if (chat) {
        return next(new ApiError("Chat is muted", 403));
      }
    }
    next();
  } catch (error) {
    console.error("Error checking if chat is muted:", error);
    next(error);
  }
});

// exports.addMessage = asyncHandler(async (req, res, next) => {
//   try {
//     const { chatId } = req.params;
//     const { text, media } = req.body;

//     const sender = req.user._id; // logged user id

//     // Check if the logged-in user is a participant of the chat
//     const chat = await Chat.findById(chatId);

//     if (!chat) {
//       return res.status(404).json({ error: "Chat not found" });
//     }

//     // Check if the logged-in user is a participant of the chat
//     const participantIds = chat.participants.map((participant) =>
//       String(participant.user ? participant.user._id : null)
//     );

//     if (!participantIds.includes(String(sender))) {
//       return next(
//         new ApiError(
//           "Unauthorized access: You are not a participant of this chat",
//           403
//         )
//       );
//     }

//     // Create a new message
//     const messageData = {
//       chat,
//       sender,
//       text,
//     };

//     if (media) {
//       messageData.media = media;
//     }

//     const msg = await Message.create(messageData);
//     const newMessage = await Message.findById(msg._id);
//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.error("Error adding message to chat:", error);
//     next(error);
//   }
// });

exports.addMessage = asyncHandler(async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { text, media } = req.body;

    const sender = req.user._id; // logged user id

    // Check if the logged-in user is a participant of the chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Check if the logged-in user is a participant of the chat
    const participantIds = chat.participants.map((participant) =>
      String(participant.user ? participant.user._id : null)
    );

    if (!participantIds.includes(String(sender))) {
      return next(
        new ApiError(
          "Unauthorized access: You are not a participant of this chat",
          403
        )
      );
    }

    // Create a new message
    const messageData = {
      chat,
      sender,
      text,
    };

    if (media) {
      messageData.media = media;
    }

    const msg = await Message.create(messageData);
    const newMessage = await Message.findById(msg._id);

    // Send notification to other participants (added logic)
    try {
      const notificationMessage = `New message in chat ${chatId}: ${text}`;
      const recipients = chat.participants.filter(
        (participant) => String(participant.user._id) !== String(sender)
      );

      console.log(
        `Sending Notifications to ${recipients.map((participant) =>
          String(participant.user._id)
        )}`
      );

      for (const recipient of recipients) {
        await Notification.create({
          user: recipient.user._id,
          message: notificationMessage,
          targetModelId: chat._id,
          targetModel: "Chat",
        });
      }
    } catch (error) {
      console.error("Failed to send notifications:", error);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error adding message to chat:", error);
    next(error);
  }
});

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  filterObject = { chat: req.params.chatId };
  req.filterObj = filterObject;
  next();
};

//@desc get all messages in chat
//@route GET /api/v1/message/chatId
//@access protected
exports.getMessages = factory.getAll(Message, "Message", "reactions.user");

//@desc Update a message by ID
//@route PUT /api/v1/message/:messageId
//@access protected
exports.updateMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const { text, media } = req.body;
  const userId = req.user._id; // logged user id

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new ApiError("Message not found", 404));
  }

  const sixHoursInMillis = 6 * 60 * 60 * 1000;
  const now = new Date();

  // Check if the logged-in user is the sender of the message
  if (String(message.sender._id) !== String(userId)) {
    return next(
      new ApiError("Unauthorized access: You cannot update this message", 403)
    );
  }
  // user cannot update the message after 6h from he sent it unless he is an admin
  if (now - message.createdAt > sixHoursInMillis) {
    if (req.user.role !== "admin") {
      return next(
        new ApiError(
          "Unauthorized access: You cannot update this message after 6 hours",
          403
        )
      );
    }
  }

  // Create an update object based on provided data
  const updateData = {};
  if (text !== undefined && text !== null) {
    updateData.text = text;
  }
  if (media !== undefined && media !== null) {
    updateData.media = media;
  }

  // Update the message if updateData is not empty
  if (Object.keys(updateData).length > 0) {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedMessage);
  } else {
    // If no data is provided to update, return the unmodified message
    res.status(200).json(message);
  }
});

//@desc Delete a message by ID
//@route DELETE /api/v1/message/:messageId
//@access protected

exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user._id; // logged user id

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new ApiError("Message not found", 404));
  }

  const sixHoursInMillis = 6 * 60 * 60 * 1000;
  const now = new Date();

  // Check if the logged-in user is the sender of the message or an admin
  if (String(message.sender._id) !== String(userId)) {
    if (req.user.role !== "admin") {
      return next(
        new ApiError("Unauthorized access: You cannot delete this message", 403)
      );
    }
    // If the user is an admin, allow deletion of any message regardless of the time it was sent
    // user cannot delete the message after 6h from he sent it unless he is an admin
  } else if (now - message.createdAt > sixHoursInMillis) {
    if (req.user.role !== "admin") {
      return next(
        new ApiError(
          "Unauthorized access: You cannot delete this message after 6 hours",
          403
        )
      );
    }
  }

  await Message.findByIdAndDelete(messageId);

  res.status(200).json({ message: "Message deleted successfully" });
});

//@desc Add a reaction to a message
//@route POST /api/v1/message/:messageId/reactions
//@access protected
// exports.toggleReactionToMessage = asyncHandler(async (req, res, next) => {
//   const { messageId } = req.params;
//   const { emoji } = req.body;
//   const userId = req.user._id; // logged user id

//   let message = await Message.findById(messageId);

//   if (!message) {
//     return next(new ApiError("Message not found", 404));
//   }

//   // Check if the user has already reacted to this message
//   const existingReactionIndex = message.reactions.findIndex(
//     (reaction) => String(reaction.user) === String(userId)
//   );

//   if (existingReactionIndex !== -1) {
//     const existingReaction = message.reactions[existingReactionIndex];
//     if (existingReaction.emoji === emoji) {
//       // If the new reaction is the same as the existing one, do nothing
//       message = await Message.findById(messageId).populate({
//         path: "reactions.user",
//         select: "username profileImg",
//       });
//       return res.status(200).json({ data: message });
//     } else {
//       // If the new reaction is different, update the existing reaction
//       await Message.updateOne(
//         { _id: messageId, "reactions.user": userId },
//         { $set: { "reactions.$.emoji": emoji } },
//         { new: true }
//       );
//     }
//   } else {
//     // If the user has not reacted, add the reaction
//     await Message.findByIdAndUpdate(
//       messageId,
//       { $push: { reactions: { user: userId, emoji: emoji } } },
//       { new: true }
//     );
//   }

//   // Fetch the updated message after toggling the reaction
//   const updatedMessage = await Message.findById(messageId).populate({
//     path: "reactions.user",
//     select: "username profileImg",
//   });

//   res.status(200).json({ data: updatedMessage });
// });

exports.toggleReactionToMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const { emoji } = req.body;
  const userId = req.user._id; // logged user id

  let message = await Message.findById(messageId);

  if (!message) {
    return next(new ApiError("Message not found", 404));
  }

  // Check if the user has already reacted to this message
  const existingReactionIndex = message.reactions.findIndex(
    (reaction) => String(reaction.user) === String(userId)
  );

  if (existingReactionIndex !== -1) {
    const existingReaction = message.reactions[existingReactionIndex];
    if (existingReaction.emoji === emoji) {
      // If the new reaction is the same as the existing one, do nothing
      message = await Message.findById(messageId).populate({
        path: "reactions.user",
        select: "username profileImg",
      });
      return res.status(200).json({ data: message });
    } else {
      // If the new reaction is different, update the existing reaction
      await Message.updateOne(
        { _id: messageId, "reactions.user": userId },
        { $set: { "reactions.$.emoji": emoji } },
        { new: true }
      );
    }
  } else {
    // If the user has not reacted, add the reaction
    await Message.findByIdAndUpdate(
      messageId,
      { $push: { reactions: { user: userId, emoji: emoji } } },
      { new: true }
    );
  }

  // Fetch the updated message after toggling the reaction
  const updatedMessage = await Message.findById(messageId).populate({
    path: "reactions.user",
    select: "username profileImg",
  });

  // Send notification to the message sender (added logic)
  try {
    if (String(updatedMessage.sender) !== String(userId)) {
      const notificationMessage = `
        Someone reacted to your message: "${emoji}"
      `;

      await Notification.create({
        user: updatedMessage.sender, // Notify the message sender
        message: notificationMessage,
        targetModelId: messageId,
        targetModel: "Message",
      });
    }
  } catch (error) {
    console.error("Failed to send notification:", error);
  }

  res.status(200).json({ data: updatedMessage });
});

//@desc Get reactions to a message
//@route GET /api/v1/message/:messageId/reactions
//@access protected
exports.getReactionsToMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  // Find the message by ID
  const message = await Message.findById(messageId).populate({
    path: "reactions.user",
    select: "username profileImg",
  });

  if (!message) {
    return next(new ApiError("Message not found", 404));
  }

  // Assuming reactions are stored in the message document
  const reactions = message.reactions || [];

  res.status(200).json({
    status: "success",
    data: reactions,
  });
});

//@desc Reply to a message
//@route POST /api/v1/message/:messageId/reply
//@access protected
exports.replyToMessage = asyncHandler(async (req, res, next) => {
  const { replyToMessageId } = req.params;
  const { text, media } = req.body;
  const sender = req.user._id; // logged user id

  const repliedMessage = await Message.findById(replyToMessageId);

  if (!repliedMessage) {
    return next(new ApiError("Message not found", 404));
  }

  // Prepare reply message data
  const replyData = {
    chat: repliedMessage.chat,
    sender,
    text,
    repliedTo: repliedMessage._id,
  };

  // Include media if provided
  if (media) {
    replyData.media = media;
  }

  // Create reply message
  const replyMessage = await Message.create(replyData);

  // Check if the sender of the replied message is not the same as the sender of the reply
  if (repliedMessage.sender._id.toString() !== sender.toString()) {
    const notificationMessage = `
    \n You have a new reply to your message.
    \n\n Message: ${text} `;
    // \n\nClick here to view the message: https://domain.com/en/chat/${repliedMessage.chat}`;

    await Notification.create({
      user: sender._id,
      message: notificationMessage,
      targetModelId: repliedMessage.chat,
      targetModel: "Chat",
    });

    //send email to the sender of the replied message
    //   const user = await User.findById(repliedMessage.sender._id);

    //   const emailMessage = `Hi ${user.name},
    //   \n You have a new reply to your message.
    //   \n\n Message: ${text}
    //   \n\nClick here to view the message: https://domain.com/en/chat/${repliedMessage.chat}
    //   \n\n Regards,
    //   \n Team     `;

    //   // Try to send the email, ignore errors
    //   try {
    //     await sendEmail({
    //       to: user.email,
    //       subject: "New reply to your message",
    //       text: emailMessage,
    //     });
    //   } catch (error) {
    //     // Log the error (optional) or handle it as needed
    //     console.error("Failed to send email:", error);
    //   }
  }
  const message = await Message.findById(replyMessage._id);

  res.status(200).json({ data: message });
});

//@desc Get replies to a message
//@route GET /api/v1/message/:messageId/replies
//@access protected
exports.getRepliesToMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const replies = await Message.find({ repliedTo: messageId });

  res.status(200).json({ data: replies });
});
