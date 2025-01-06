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
    notificationService.createFilterObjToGetBasicNotifications,
    notificationService.getMyNotifications
  )
  .post(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin"),
    checkPermission("Notification", "create"),
    notificationService.convertToArray,
    notificationService.sendSystemNotificationToUsers
  ) //send notification to users
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin", "user", "trainer", "Ls-trainer"),
    notificationService.readAllBasicNotification
  ); //read all
router
  .route("/chat")
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin", "user", "trainer", "Ls-trainer"),
    notificationService.readAllChatNotification
  );
router
  .route("/:id")
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin", "user", "trainer", "Ls-trainer"),
    checkPermission("Notification", "update"),
    notificationService.readBasicNotification
  )
  .delete(authServices.protect, notificationService.deleteNotification);
router
  .route("/:id/chat")
  .put(
    authServices.protect,
    authServices.allowTo("admin", "sub-admin", "user", "trainer", "Ls-trainer"),
    notificationService.readChatNotification
  );
router.get(
  "/event",
  authServices.protect,
  notificationService.listenOnNotificationsExceptChat
);

router.get(
  "/event/chat",
  authServices.protect,
  notificationService.listenOnChatNotifications
);

router
  .route("/unreadCount")
  .get(
    authServices.protect,
    notificationService.getUnreadBasicNotificationCount
  );

router
  .route("/unreadCount/chat")
  .get(
    authServices.protect,
    notificationService.getUnreadChatNotificationCount
  );

router
  .route("/chat")
  .get(
    authServices.protect,
    notificationService.createFilterObj,
    notificationService.createFilterObjToGetChatNotification,
    notificationService.getMyNotifications
  );
module.exports = router;
