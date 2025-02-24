/* eslint-disable no-shadow */
const socketIO = require("socket.io");

let io;
let users = [];

const getUserSocketId = (userId) => {
  const user = users.find((user) => user.userId === userId);
  return user ? user.socketId : null;
};

// Add functions for managing users and messages
const addUser = (userId, socketId, roomId = null) => {
  const user = users.find((user) => user.userId === userId);
  if (user) {
    user.socketId = socketId;
    user.roomId = roomId; // Update the room ID if the user rejoins or changes rooms
  } else {
    users.push({ userId, socketId, roomId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const sendPrivateMessage = (
  socket,
  { messageId, senderId, receiverId, ownMessageName, text, media = [] }
) => {
  if ((!text || text.trim() === "") && media.length === 0) {
    return socket.emit(
      "errorMessage",
      "Message must contain either text or media."
    );
  }
  const receiverSocketId = getUserSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", {
      messageId,
      senderId,
      ownMessageName,
      text,
      media,
      private: true,
    });
  } else {
    socket.emit("errorMessage", "User not found or offline.");
  }
};

const sendPrivateReplyMessage = (
  socket,
  {
    messageId,
    senderId,
    receiverId,
    ownMessageName,
    repliedToMessageData,
    repliedToMessageId,
    text,
    media = [],
  }
) => {
  if ((!text || text.trim() === "") && media.length === 0) {
    return socket.emit(
      "errorMessage",
      "Message must contain either text or media."
    );
  }
  const receiverSocketId = getUserSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveRepliedMessage", {
      messageId,
      senderId,
      text,
      ownMessageName,
      repliedToMessageData,
      repliedToMessageId,
      media,
      private: true,
    });
  } else {
    socket.emit("errorMessage", "User not found or offline.");
  }
};

const toggleReactionToPrivateMessage = (
  socket,
  { receiverId, senderId, messageId, emoji }
) => {
  if (!emoji || emoji.trim() === "") {
    return socket.emit("errorMessage", "Reaction must contain a valid emoji.");
  }
  const receiverSocketId = getUserSocketId(receiverId);

  io.to(receiverSocketId).emit("receiveReactionToMessage", {
    senderId,
    messageId,
    emoji,
  });
};

const sendGroupMessage = (
  socket,
  { messageId, senderId, roomId, payload, media = [], action }
) => {
  if ((!payload || payload.trim() === "") && media.length === 0) {
    return socket.emit(
      "errorMessage",
      "Message must contain either text or media."
    );
  }
  if (!roomId || !senderId) {
    return socket.emit("errorMessage", "Invalid sender or room.");
  }
  socket
    .to(roomId)
    .emit("receiveMessage", { messageId, senderId, payload, action, media });
};

const sendGroupReplyMessage = (
  socket,
  {
    messageId,
    senderId,
    roomId,
    payload,
    ownMessageName,
    repliedToMessageData,
    repliedToMessageId,
    media = [],
    action,
  }
) => {
  if ((!payload || payload.trim() === "") && media.length === 0) {
    return socket.emit(
      "errorMessage",
      "Message must contain either text or media."
    );
  }
  if (!roomId || !senderId) {
    return socket.emit("errorMessage", "Invalid sender or room.");
  }
  socket.to(roomId).emit("receiveRepliedMessage", {
    messageId,
    senderId,
    payload,
    ownMessageName,
    repliedToMessageData,
    repliedToMessageId,
    action,
    media,
  });
};

const toggleReactionToGroupMessage = (
  socket,
  { senderId, messageId, roomId, emoji }
) => {
  if (!emoji || emoji.trim() === "") {
    return socket.emit("errorMessage", "Reaction must contain a valid emoji.");
  }
  socket
    .to(roomId)
    .emit("receiveReactionToMessage", { senderId, messageId, emoji });
};

function initSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "*", // Allow all origins for now, adjust as needed
    },
  });

  io.on("connection", (socket) => {
    socket.on("addUser", ({ userId }) => {
      addUser(userId, socket.id);
      console.log(`User ${userId} connected`);
    });

    socket.on("joinRoom", ({ userId, roomId }) => {
      addUser(userId, socket.id, roomId);
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("leaveRoom", ({ userId, roomId }) => {
      socket.leave(roomId);
      console.log(`User ${userId} left room ${roomId}`);
    });

    socket.on("sendMessage", (messageData) => {
      console.log("sendMessage => ", {
        messageData,
        users,
      });

      if (messageData.roomId) {
        sendGroupMessage(socket, messageData);
      } else if (messageData.repliedToMessageData) {
        sendPrivateReplyMessage(socket, messageData);
      } else if (messageData.repliedToMessageData && messageData.roomId) {
        sendGroupReplyMessage(socket, messageData);
      } else {
        sendPrivateMessage(socket, messageData);
      }
    });
    socket.on("toggleReaction", (reactionData) => {
      if (reactionData.roomId) {
        toggleReactionToGroupMessage(socket, reactionData);
      } else {
        toggleReactionToPrivateMessage(socket, reactionData);
      }
    });
    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.IO server is running.");
}

module.exports = {
  initSocket,
  getUserSocketId,
};
