const express = require("express");

const notificationService = require("../../services/notificationService");

const authServices = require("../../services/authServices");

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
    authServices.allowTo("admin"),
    notificationService.convertToArray,
    notificationService.sendSystemNotificationToUsers
  ) //send notification to users
  .put(authServices.protect, notificationService.readAllNotification); //read all
router
  .route("/:id")
  .put(authServices.protect, notificationService.readNotification)
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
