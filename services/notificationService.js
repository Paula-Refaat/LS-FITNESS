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
  const { users, message } = req.body; // array of users

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
exports.listenOnMyNotification = asyncHandler(async (req, res, next) => {
  // Set up the response headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Connection established message
  res.write("event: connected\n");
  res.write("data: Connection established\n\n");
  res.flush(); // Force the response to flush immediately

  console.log("Waiting for notifications...");

  // إرسال إشعار فارغ (heartbeat) كل 30 ثانية
  const heartbeat = setInterval(() => {
    res.write(`data: {}\n\n`); // إرسال إشعار فارغ
    res.flush(); // التأكد من إرسال البيانات فورًا
    console.log("Heartbeat sent to keep the connection alive.");
  }, 30000); // كل 30 ثانية

  // Start watching the Notification collection
  const changeStream = Notification.watch();

  changeStream.on("change", (change) => {
    console.log("Change detected:", change); // Log changes from MongoDB
    const notification = change.fullDocument;

    if (notification) {
      console.log("Notification data:", notification); // Log notification details
    }

    // Check if the notification belongs to the current user
    if (
      notification &&
      notification.user.toString() === req.user._id.toString()
    ) {
      console.log("Sending notification to client...");
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
      res.flush(); // Make sure the data is sent immediately
    } else {
      console.log("Notification does not belong to the current user.");
    }
  });

  // Handle connection closure
  req.on("close", () => {
    console.log(`Connection closed for user: ${req.user._id.toString()}`);
    clearInterval(heartbeat); // إيقاف إرسال الإشعارات الفارغة
    changeStream.close(); // إغلاق ChangeStream
  });
});

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
//     changeStream.close();
//   });
// });

// exports.listenOnMyNotification = asyncHandler(async (req, res, next) => {
//   // Set up the response headers for SSE
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   // Connection established message
//   res.write("event: connected\n");
//   res.write("data: Connection established\n\n");
//   res.flush(); // Force the response to flush immediately

//   // Start watching the Notification collection
//   const changeStream = Notification.watch();

//   changeStream.on("change", (change) => {
//     // Log the change to debug
//     console.log("Change detected:", change);

//     const notification = change.fullDocument;

//     // Log the notification details and user details
//     console.log("Notification:", notification);
//     console.log("Current User:", req.user._id.toString());

//     // Check if the notification belongs to the current user
//     if (
//       notification &&
//       notification.user.toString() === req.user._id.toString()
//     ) {
//       res.write(`data: ${JSON.stringify(notification)}\n\n`);
//     }
//   });

//   // Handle connection closure
//   req.on("close", () => {
//     console.log(`Connection closed for user: ${req.user._id.toString()}`);
//     changeStream.close();
//   });
// });

//@desc delete notification
//@route DELETE /api/v1/notifications/:id
//@access private
exports.deleteNotification = factory.deleteOne(Notification);

//@desc read notification
//@route Put /api/v1/notifications/:id
//@access private
exports.readNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
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
exports.readAllNotification = asyncHandler(async (req, res, next) => {
  await Notification.updateMany({ user: req.user.id }, { read: true });
  res.status(200).json({
    status: "success",
    message: "All notification read",
  });
});

//@desc get unread notification count
//@route Put /api/v1/notifications/unreadCount
//@access private
exports.getUnreadNotificationCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    read: false,
  });
  res.status(200).json({
    count,
  });
});
