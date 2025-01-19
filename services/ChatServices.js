const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const Notification = require("../models/notificationModel");
const ApiError = require("../utils/ApiError");
const factory = require("./handllerFactory");
const { uploadSingleMedia } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
exports.uploadChatImg = uploadSingleMedia("image", "image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const directoryPath = "uploads/chats";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const imageName = `chats-${uuidv4()}-${Date.now()}.webp`;
    const imagePath = `${directoryPath}/${imageName}`;

    fs.writeFileSync(imagePath, req.file.buffer);

    // Save image name into the request body for further use (e.g., saving in DB)
    req.body.image = imageName;
  }
  next();
});

exports.getAllChats = factory.getAll(Chat, "Chat");

//@desc create a chat room between 2 users
//@route POST /api/v1/chat/:receiverId
//@access protected
exports.createSingleChat = asyncHandler(async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;

    // Check if a chat already exists between sender and receiver
    const existingChat = await Chat.findOne({
      $and: [
        { "participants.user": senderId },
        { "participants.user": receiverId },
      ],
      isGroupChat: false,
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists between these users",
        data: existingChat,
      });
    }

    // Create a new chat
    const newChat = await Chat.create({
      participants: [
        { user: senderId, isAdmin: true },
        { user: receiverId, isAdmin: true },
      ],
    });

    // Create a notification for the receiver
    await Notification.create({
      user: receiverId,
      message: `${req.user.username} has started a chat with you`,
      targetModelId: newChat._id,
      targetModel: "Chat",
    });

    res.status(201).json({ data: newChat });
  } catch (error) {
    next(error);
  }
});

//@desc Create a group chat
//@route POST /api/v1/chat/group
//@access Protected
exports.createGroupChat = asyncHandler(async (req, res, next) => {
  try {
    const { userIds, name, description, image } = req.body;
    const loggedUserId = req.user._id;

    // Validate input
    if (!userIds || userIds.length < 1) {
      return res.status(400).json({
        message: "A group chat requires at least two participants.",
      });
    }

    // Ensure the logged-in user is included in the participants
    const uniqueUserIds = [...new Set([loggedUserId, ...userIds])];

    // Check if all users in userIds exist in the database
    const usersInDb = await User.find({ _id: { $in: uniqueUserIds } });
    const usersInDbIds = usersInDb.map((user) => user._id.toString());

    // If there are any users that are not in the database, return an error
    const invalidUserIds = uniqueUserIds.filter(
      (userId) => !usersInDbIds.includes(userId.toString())
    );
    if (invalidUserIds.length > 0) {
      return res.status(400).json({
        message: `The following users do not exist: ${invalidUserIds.join(
          ", "
        )}`,
      });
    }

    // Map participants, making the logged-in user an admin by default
    const participants = uniqueUserIds.map((userId) => ({
      user: userId,
      isAdmin: userId.toString() === loggedUserId.toString(),
    }));

    // Create the group chat
    const newGroupChat = await Chat.create({
      name,
      description,
      participants,
      image,
      isGroupChat: true,
    });

    // Create notifications for all participants (you can uncomment this block if needed)
    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        await Notification.create({
          user: userId,
          message: `You have been added to the group chat "${name}"`,
          targetModelId: newChat._id,
          targetModel: "Chat",
        });
      })
    );

    res.status(201).json({
      message: "Group chat created successfully",
      data: newGroupChat,
    });
  } catch (error) {
    next(error);
  }
});

//@desc get all user chat rooms
//@route GET /api/v1/chat/myChats
//@access private
exports.getMyChats = async (req, res, next) => {
  try {
    const baseUrl = process.env.BASE_URL; // Set your domain URL here
    const chats = await Chat.aggregate([
      {
        $match: {
          "participants.user": new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chat", "$$chatId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderDetails",
              },
            },
            {
              $addFields: {
                media: {
                  $map: {
                    input: "$media",
                    as: "file",
                    in: { $concat: [baseUrl, "/messages/", "$$file.url"] }, // Adjust the path as necessary
                  },
                },
              },
            },
            {
              $project: {
                text: 1,
                media: 1,
                createdAt: 1,
                sender: 1,
                senderDetails: { $arrayElemAt: ["$senderDetails", 0] },
              },
            },
          ],
          as: "lastMessage",
        },
      },
      { $unwind: "$participants" },
      {
        $lookup: {
          from: "users",
          localField: "participants.user",
          foreignField: "_id",
          as: "participants.userDetails",
        },
      },
      { $unwind: "$participants.userDetails" },
      {
        $addFields: {
          "participants.userDetails.profileImg": {
            $cond: {
              if: "$participants.userDetails.profileImg",
              then: {
                $concat: [
                  baseUrl,
                  "/users/",
                  "$participants.userDetails.profileImg",
                ],
              },
              else: null,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          participants: { $push: "$participants" },
          root: { $mergeObjects: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$root", "$$ROOT"],
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
      {
        $addFields: {
          image: {
            $cond: {
              if: "$image",
              then: { $concat: [baseUrl, "/chats/", "$image"] }, // Adjust the path as necessary
              else: null,
            },
          },
        },
      },
      {
        $project: {
          // participants: 1,
          "participants.userDetails._id": 1,
          "participants.userDetails.username": 1,
          "participants.userDetails.profileImg": 1,
          "participants.isAdmin": 1,
          isGroupChat: 1,
          image: 1,
          description: 1,
          archived: 1,
          "lastMessage._id": 1,
          "lastMessage.text": 1,
          "lastMessage.media": 1,
          "lastMessage.createdAt": 1,
          "lastMessage.senderDetails._id": 1,
          "lastMessage.senderDetails.username": 1,
          "lastMessage.senderDetails.profileImg": 1,

          // lastMessage: 1,
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: chats.length,
      data: chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch chats",
    });
  }
};

//@desc Get details of a specific chat including participants' details
//@route GET /api/v1/chat/:chatId/details
//@access protected
exports.getChatDetails = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const baseUrl = process.env.BASE_URL; // Set your domain URL here

  try {
    const chat = await Chat.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(chatId) },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chat", "$$chatId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderDetails",
              },
            },
            {
              $addFields: {
                media: {
                  $map: {
                    input: "$media",
                    as: "file",
                    in: { $concat: [baseUrl, "/messages/", "$$file.url"] },
                  },
                },
              },
            },
            {
              $project: {
                text: 1,
                media: 1,
                createdAt: 1,
                sender: 1,
                senderDetails: { $arrayElemAt: ["$senderDetails", 0] },
              },
            },
          ],
          as: "lastMessage",
        },
      },
      { $unwind: "$participants" },
      {
        $lookup: {
          from: "users",
          localField: "participants.user",
          foreignField: "_id",
          as: "participants.userDetails",
        },
      },
      { $unwind: "$participants.userDetails" },
      {
        $addFields: {
          "participants.userDetails.profileImg": {
            $cond: {
              if: "$participants.userDetails.profileImg",
              then: {
                $concat: [
                  baseUrl,
                  "/users/",
                  "$participants.userDetails.profileImg",
                ],
              },
              else: null,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          participants: { $push: "$participants" },
          root: { $mergeObjects: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$root", "$$ROOT"],
          },
        },
      },
      {
        $addFields: {
          image: {
            $cond: {
              if: "$image",
              then: { $concat: [baseUrl, "/chats/", "$image"] },
              else: null,
            },
          },
        },
      },
      {
        $project: {
          // participants: 1,
          "participants.userDetails._id": 1,
          "participants.userDetails.username": 1,
          "participants.userDetails.profileImg": 1,
          "participants.isAdmin": 1,
          isGroupChat: 1,
          image: 1,
          description: 1,
          archived: 1,
          "lastMessage._id": 1,
          "lastMessage.text": 1,
          "lastMessage.media": 1,
          "lastMessage.createdAt": 1,
          "lastMessage.senderDetails._id": 1,
          "lastMessage.senderDetails.username": 1,
          "lastMessage.senderDetails.profileImg": 1,
          // lastMessage: 1,
          _id: 1,
        },
      },
    ]);

    if (!chat || chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json({
      status: "success",
      results: 1,
      data: chat[0],
    });
  } catch (error) {
    console.error("Error fetching chat details:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch chat details",
    });
  }
});

//@desc Delete a chat along with associated messages, etc.
//@route DELETE /api/v1/chat/:chatId
//@access protected
exports.deleteChat = asyncHandler(async (req, res, next) => {
  try {
    await mongoose.connection.transaction(async (session) => {
      // Find and delete the course
      const chat = await Chat.findByIdAndDelete(req.params.chatId).session(
        session
      );

      // Check if course exists
      if (!chat) {
        return next(
          new ApiError(`chat not found for this id ${req.params.chatId}`, 404)
        );
      }

      // Delete associated lessons and reviews
      await Promise.all([
        Message.deleteMany({ chat: chat._id }).session(session),
        Notification.deleteMany({ chat: chat._id }).session(session),
      ]);
    });

    // Return success response
    res.status(204).send();
  } catch (error) {
    // Handle any transaction-related errors
    console.error("Transaction error:", error);
    if (error instanceof ApiError) {
      // Forward specific ApiError instances
      return next(error);
    }
    // Handle other errors with a generic message
    return next(new ApiError("Error during chat deletion", 500));
  }
});

//filter to get my chats
exports.createFilterObj = (req, res, next) => {
  const filterObject = {
    "participants.user": req.user._id,
  };
  req.filterObj = filterObject;
  next();
};

//@desc Find a specific chat between two users that the logged-in user is part of
//@route GET /api/v1/chat/find/:secondPersonId
//@access private
exports.findChat = asyncHandler(async (req, res, next) => {
  const loggedUserId = req.user._id; // First participant of the chat
  const { secondPersonId } = req.params; // Second participant of the chat

  const chat = await Chat.findOne({
    $and: [
      {
        "participants.user": loggedUserId,
      },
      {
        "participants.user": secondPersonId,
      },
      {
        isGroupChat: false, // Ensuring it's not a group chat
      },
    ],
  });
  if (!chat) {
    return next(new ApiError("Chat not found", 404));
  }
  res.status(200).json({ data: chat });
});

//@desc Pin a message in a chat
//@route POST /api/v1/chat/:chatId/pin/:messageId
//@access protected
exports.pinMessageInChat = asyncHandler(async (req, res, next) => {
  const { chatId, messageId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ApiError("Chat not found", 404));
  }

  // Check if the message exists in the chat
  const isMessageInChat = chat.pinnedMessages.includes(messageId);
  if (isMessageInChat) {
    return next(new ApiError("Message is already pinned in the chat", 400));
  }

  // Update the chat document to add the message to the pinnedMessages array
  await Chat.findByIdAndUpdate(
    chatId,
    { $push: { pinnedMessages: messageId } },
    { new: true } // To return the modified document
  );

  // Fetch the updated chat document after pinning the message
  const updatedChat = await Chat.findById(chatId);

  res.status(200).json(updatedChat);
});

//@desc Unpin a message in a chat
//@route DELETE /api/v1/chat/:chatId/unpin/:messageId
//@access protected
exports.unpinMessageInChat = asyncHandler(async (req, res, next) => {
  const { chatId, messageId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ApiError("Chat not found", 404));
  }

  // Check if the message exists in the pinned messages of the chat
  const messageIndex = chat.pinnedMessages.indexOf(messageId);
  if (messageIndex === -1) {
    return next(new ApiError("Message is not pinned in the chat", 400));
  }

  // Update the chat document to remove the message from the pinnedMessages array
  await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { pinnedMessages: messageId } },
    { new: true } // To return the modified document
  );

  // Fetch the updated chat document after unpinning the message
  const updatedChat = await Chat.findById(chatId);

  res.status(200).json(updatedChat);
});

//@desc Archive a chat
//@route PUT /api/v1/chat/:chatId/archive
//@access protected
exports.archiveChat = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  // Update the chat document to set the archived field to true
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $set: { archived: true } },
    { new: true } // To return the modified document
  );
  if (!chat) {
    return next(new ApiError("Chat not found", 404));
  }

  res.status(200).json({ message: "archived" });
});

//@desc Unarchive a chat
//@route PUT /api/v1/chat/:chatId/unarchive
//@access protected
exports.unarchiveChat = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $set: { archived: false } },
    { new: true }
  );

  if (!chat) {
    return next(new ApiError("Chat not found", 404));
  }

  res.status(200).json({ message: "unarchive" });
});
