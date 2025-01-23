const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Notification = require("../models/notificationModel");
const factory = require("./handllerFactory");
const User = require("../models/userModel");

exports.createFilterObj = (req, res, next) => {
  const filterObject = { user: req.user.id };
  req.filterObj = filterObject;
  next();
};

exports.createFilterObjToGetChatNotification = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }
  const filterObject = { targetModel: "Chat" };
  req.filterObj = filterObject;
  next();
};

exports.createFilterObjToGetBasicNotifications = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.targetModel = { $ne: "Chat" };

  next();
};

exports.convertToArray = (req, res, next) => {
  if (req.body.users) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.users)) {
      req.body.users = [req.body.users];
    }
  }
  next();
};

//@desc create system notification to specific users
//@route Post /api/v1/notifications
//@access private
exports.sendSystemNotificationToUsers = asyncHandler(async (req, res, next) => {
  const { users, message, targetModel, targetModelId } = req.body; // array of users

  if (targetModel && targetModelId) {
    const validModels = mongoose.modelNames();
    if (!validModels.includes(targetModel)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid targetModel: ${targetModel}`,
      });
    }
    // البحث عن الـ targetModelId في الموديل المناسب
    const TargetModel = mongoose.model(targetModel);
    const targetDoc = await TargetModel.findById(targetModelId);
    if (!targetDoc) {
      return res.status(404).json({
        status: "error",
        message: `No document found with ID: ${targetModelId} in model: ${targetModel}`,
      });
    }
  }

  // Check if all users exist in the database
  const existingUsers = await User.find({ _id: { $in: users } }).select("_id");
  const existingUserIds = existingUsers.map((user) => user._id.toString());

  const missingUsers = users.filter(
    (userId) => !existingUserIds.includes(userId)
  );

  if (missingUsers.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Some users do not exist in the database",
      missingUsers,
    });
  }

  // Create notifications for users
  await Promise.all(
    users.map(async (user) => {
      await Notification.create({
        user,
        message,
        type: "system",
        targetModel: targetModel || null,
        targetModelId: targetModelId || null,
      });
    })
  );

  // Respond with success message
  res.status(201).json({
    status: "success",
    message: "Notifications sent successfully",
    notificationMessage: message,
  });
});

exports.getMyNotifications = factory.getAll(Notification, "Notification");

//@desc get list of notifications
//@route GET /api/v1/notifications
//@access private
// exports.listenOnMyNotification = asyncHandler(async (req, res, next) => {
//   // Set up the response headers for SSE
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   // Connection established message
//   res.write("event: connected\n");
//   res.write("data: Connection established\n\n");
//   res.flush(); // Force the response to flush immediately

//   console.log("Waiting for notifications...");

//   // إرسال heartbeat كل 30 ثانية لإبقاء الاتصال مفتوحًا
//   const heartbeat = setInterval(() => {
//     res.write(`\n`); // حدث heartbeat مخصص
//     res.flush(); // التأكد من إرسال البيانات فورًا
//     console.log("Heartbeat sent to keep the connection alive.");
//   }, 30000); // كل 30 ثانية

//   // Start watching the Notification collection
//   const changeStream = Notification.watch();

//   changeStream.on("change", (change) => {
//     console.log("Change detected:", change); // Log changes from MongoDB
//     const notification = change.fullDocument;

//     if (notification) {
//       console.log("Notification data:", notification); // Log notification details
//     }

//     // Check if the notification belongs to the current user
//     if (
//       notification &&
//       notification.user.toString() === req.user._id.toString()
//     ) {
//       console.log("Sending notification to client...");
//       res.write(`data: ${JSON.stringify(notification)}\n\n`);
//       res.flush(); // Make sure the data is sent immediately
//     } else {
//       console.log("Notification does not belong to the current user.");
//     }
//   });

//   // Handle connection closure
//   req.on("close", () => {
//     console.log(`Connection closed for user: ${req.user._id.toString()}`);
//     clearInterval(heartbeat); // إيقاف إرسال heartbeats
//     changeStream.close(); // إغلاق ChangeStream
//   });
// });

exports.listenOnNotificationsExceptChat = asyncHandler(
  async (req, res, next) => {
    // Set up the response headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write("event: connected\n");
    res.write("data: Connection established\n\n");
    res.flush();

    console.log("Waiting for notifications (excluding Chat)...");

    const heartbeat = setInterval(() => {
      res.write(`\n`);
      res.flush();
      console.log("Heartbeat sent to keep the connection alive.");
    }, 30000);

    const changeStream = Notification.watch();

    changeStream.on("change", (change) => {
      const notification = change.fullDocument;

      console.log("Notification Change [Chat]: ", change);
      console.log("Notification Change [Chat]: ", notification);

      if (
        notification &&
        notification.user.toString() === req.user._id.toString() &&
        notification.targetModel !== "Chat"
      ) {
        console.log("Sending notification (excluding Chat) to client...");
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
        res.flush();
      }
    });

    req.on("close", () => {
      console.log(`Connection closed for user: ${req.user._id.toString()}`);
      clearInterval(heartbeat);
      changeStream.close();
    });
  }
);

exports.listenOnChatNotifications = asyncHandler(async (req, res, next) => {
  // Set up the response headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("event: connected\n");
  res.write("data: Connection established\n\n");
  res.flush();

  console.log("Waiting for Chat notifications...");

  const heartbeat = setInterval(() => {
    res.write(`\n`);
    res.flush();
    console.log("Heartbeat sent to keep the connection alive.");
  }, 30000);

  const changeStream = Notification.watch();

  changeStream.on("change", (change) => {
    const notification = change.fullDocument;

    console.log("Notification Change [Chat]: ", change);
    console.log("Notification Change [Chat]: ", notification);

    if (
      notification &&
      notification.user.toString() === req.user._id.toString() &&
      notification.targetModel === "Chat"
    ) {
      console.log("Sending Chat notification to client...");
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
      res.flush();
    }
  });

  req.on("close", () => {
    console.log(`Connection closed for user: ${req.user._id.toString()}`);
    clearInterval(heartbeat);
    changeStream.close();
  });
});

//@desc delete notification
//@route DELETE /api/v1/notifications/:id
//@access private
exports.deleteNotification = factory.deleteOne(Notification);

//@desc read notification
//@route Put /api/v1/notifications/:id
//@access private
exports.readBasicNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, targetModel: { $ne: "Chat" } },
    { read: true },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!notification) {
    return next(new ApiError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "notification read",
  });
});

exports.readChatNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, targetModel: "Chat" },
    { read: true },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!notification) {
    return next(new ApiError("Notification not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "notification read",
  });
});

//@desc read all notification
//@route Put /api/v1/notifications/readAll
//@access private
exports.readAllBasicNotification = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, targetModel: { $ne: "Chat" } },
    { read: true }
  );
  res.status(200).json({
    status: "success",
    message: "All notification read",
  });
});

exports.readAllChatNotification = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, targetModel: "Chat" },
    { read: true }
  );
  res.status(200).json({
    status: "success",
    message: "All notification read",
  });
});

//@desc get unread notification count
//@route Put /api/v1/notifications/unreadCount
//@access private
exports.getUnreadBasicNotificationCount = asyncHandler(
  async (req, res, next) => {
    const count = await Notification.countDocuments({
      user: req.user._id,
      targetModel: { $ne: "Chat" },
      read: false,
    });
    res.status(200).json({
      count,
    });
  }
);

exports.getUnreadChatNotificationCount = asyncHandler(
  async (req, res, next) => {
    const count = await Notification.countDocuments({
      user: req.user._id,
      targetModel: "Chat",
      read: false,
    });
    res.status(200).json({
      count,
    });
  }
);
