const paypal = require("../../services/orderServices");

const authServices = require("../../services/authServices");

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
  authServices.allowTo("admin", "user"),
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
  authServices.allowTo("admin"),
  paypal.updateOrderToPay
);

module.exports = router;
