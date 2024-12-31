const express = require("express");

const authServices = require("../../services/authServices");
const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  sanitizeCouponData,
  moveCouponToRecycleBin,
  restoreCouponFromRecycleBin,
  filterOnCouponsInTrash,
  filterOnCouponsNotInTrash,
} = require("../../services/couponServices");
const {
  createCouponValidator,
  updateCouponValidator,
  getCouponValidator,
  deleteCouponValidator,
} = require("../../utils/validators/couponValidator");
const checkPermission = require("../../middlewares/permissionMiddleware");

const router = express.Router();
router.use(authServices.protect, authServices.allowTo("sub-admin", "admin"));

router.post(
  "/",
  checkPermission("Coupon", "create"),
  sanitizeCouponData,
  createCouponValidator,
  createCoupon
);
router.get(
  "/",
  checkPermission("Coupon", "read"),
  filterOnCouponsNotInTrash,
  getCoupons
);
router.get(
  "/:id",
  checkPermission("Coupon", "read"),
  getCouponValidator,
  getCoupon
);
router.put(
  "/:id",
  checkPermission("Coupon", "update"),
  sanitizeCouponData,
  updateCouponValidator,
  updateCoupon
);
router.delete(
  "/:id",
  checkPermission("Coupon", "delete"),
  deleteCouponValidator,
  deleteCoupon
);

router.delete(
  "/:id/moveToTrash",
  checkPermission("Coupon", "delete"),
  moveCouponToRecycleBin
);
router.put(
  "/:id/restore",
  checkPermission("Coupon", "delete"),
  restoreCouponFromRecycleBin
);
router.get(
  "/deleted/trash",
  checkPermission("Coupon", "delete"),
  filterOnCouponsInTrash,
  getCoupons
);

module.exports = router;
