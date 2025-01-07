const paypal = require("../../services/orderServices");

const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = require("express").Router();

router.post("/pay/:courseId", authServices.protect, paypal.createCourseOrder);

router.post(
  "/pay/:trainerId/subscribeToPlan",
  authServices.protect,
  paypal.createTrainerOrder
);

//router.get("/complete-order", paypal.capturePayment);

router.post("/capture-payment", paypal.capturePayment);
router.post("/captureTrainerPlanPayment", paypal.captureTrainerPlanPayment);


router.get("/cancel-order", async (req, res) => {
  res.redirect("/");
});

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin", "user"),
  checkPermission("Order", "read"),
  paypal.filterOrdersForLoggedUser,
  paypal.findAllOrders
);

// router.get(
//   "/:id",
//   authServices.protect,
//   authServices.allowTo("admin", "user"),
//   paypal.findSpecificOrder
// );

router.put(
  "/:id/pay",
  authServices.protect,
  authServices.allowTo("admin", "sub-admin"),
  checkPermission("Order", "update"),
  paypal.updateOrderToPay
);

module.exports = router;
