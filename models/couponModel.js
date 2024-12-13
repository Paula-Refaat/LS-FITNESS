const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name required"],
      lowercase: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    numberOfUsage: {
      type: Number,
      // required: [true, "Coupon number Of Usage required"],
      default: 0,
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount required"],
    },
  },
  { timestamps: true }
);
couponSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (!obj.createdAt) {
    obj.createdAt = "2024-11-23T19:20:13.186Z";
  }
  if (!obj.updatedAt) {
    obj.updatedAt = "2024-11-23T19:20:13.186Z";
  }
  delete obj.__v;
  return obj;
};
module.exports = mongoose.model("Coupon", couponSchema);
