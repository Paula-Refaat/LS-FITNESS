const express = require("express");

const notificationService = require("../../services/notificationService");

const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();

router
  .route("/")
  .get(
    authServices.protect,
    notificationService.createFilterObj,
    notificationService.getMyNotifications
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Notification", "create"),
    notificationService.convertToArray,
    notificationService.sendSystemNotificationToUsers
  ) //send notification to users
  .put(authServices.protect, notificationService.readAllNotification); //read all
router
  .route("/:id")
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Notification", "update"),
    notificationService.readNotification
  )
  .delete(authServices.protect, notificationService.deleteNotification);

router.get(
  "/event",
  authServices.protect,
  notificationService.listenOnMyNotification
);

router
  .route("/unreadCount")
  .get(authServices.protect, notificationService.getUnreadNotificationCount);
module.exports = router;
