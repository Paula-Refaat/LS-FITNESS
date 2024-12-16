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

const router = express.Router();
router.use(authServices.protect, authServices.allowTo("admin"));

router.post("/", sanitizeCouponData, createCouponValidator, createCoupon);
router.get("/", filterOnCouponsNotInTrash, getCoupons);
router.get("/:id", getCouponValidator, getCoupon);
router.put("/:id", sanitizeCouponData, updateCouponValidator, updateCoupon);
router.delete("/:id", deleteCouponValidator, deleteCoupon);

router.delete("/:id/moveToTrash", moveCouponToRecycleBin);
router.put("/:id/restore", restoreCouponFromRecycleBin);
router.get("/deleted/trash", filterOnCouponsInTrash, getCoupons);

module.exports = router;
