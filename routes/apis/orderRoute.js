const paypal = require("../../services/orderServices");

const authServices = require("../../services/authServices");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = require("express").Router();

router.post("/pay/:courseId", authServices.protect, paypal.createCourseOrder);

//router.get("/complete-order", paypal.capturePayment);

router.post("/capture-payment", paypal.capturePayment);

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
