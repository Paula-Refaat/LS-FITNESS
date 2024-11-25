const Coupon = require("../models/couponModel");
const factory = require("./handllerFactory");

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

//@desc   Delete specific Coupon
//@route  DELETE  /api/v1/Coupons/:id
//@access Private
exports.deleteCoupon = factory.deleteOne(Coupon);
