const Coupon = require("../models/couponModel");
const factory = require("./handllerFactory");

// Sanitize the coupon data from request data

exports.sanitizeCouponData = (req, res, next) => {
  if (req.body.discount) {
    req.body.discount = parseFloat(req.body.discount).toFixed(2);
  }
  if (req.body.numberOfUsage) {
    delete req.body.numberOfUsage;
  }

  next();
};
// Filter out Category that are not in the trash
exports.filterOnCouponsNotInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  // شمل المستندات التي لا تحتوي على isDeleted أو التي isDeleted ليست true
  req.filterObj.$or = [
    { isDeleted: { $exists: false } }, // المستندات التي لا تحتوي على isDeleted
    { isDeleted: false }, // المستندات التي isDeleted = false
  ];

  next();
};
// Filter out Category that are in the trash
exports.filterOnCouponsInTrash = (req, res, next) => {
  if (!req.filterObj) {
    req.filterObj = {};
  }

  req.filterObj.isDeleted = true;

  next();
};
//@desc   Create Coupon
//@route  POST  /api/v1/coupons
//@access Private
exports.createCoupon = factory.createOne(Coupon);

//@desc   Get All Coupons
//@route  GET  /api/v1/coupons
//@access Public
exports.getCoupons = factory.getAll(Coupon);

//@desc   Get specific Coupon
//@route  GET  /api/v1/Coupons/:id
//@access Public
exports.getCoupon = factory.getOne(Coupon);

//@desc   Update specific Coupon
//@route  PUT  /api/v1/Coupons/:id
//@access Private
exports.updateCoupon = factory.updateOne(Coupon);

exports.moveCouponToRecycleBin = factory.moveToRecycleBin(Coupon);
exports.restoreCouponFromRecycleBin = factory.restoreFromRecycleBin(Coupon);

//@desc   Delete specific Coupon
//@route  DELETE  /api/v1/Coupons/:id
//@access Private
exports.deleteCoupon = factory.deleteOne(Coupon);
