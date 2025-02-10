// database
const mongoose = require("mongoose");

//1- create schema
const orderSchema = mongoose.Schema(
  {
    user: {
      required: [true, "user is required"],
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: "TrainerProfile",
    },
    package: {
      type: mongoose.Schema.ObjectId,
      ref: "Package",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    coupon: {
      name: String,
      discount: Number,
    },
    totalPrice: {
      type: Number,
      required: [true, "price is required"],
    },
    paymentMethodType: {
      type: String,
      enum: ["card", "payPal"],
      default: "payPal",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paypalToken: {
      type: String,
    },
    paidAt: Date,
  },
  { timestamps: true }
);

// Custom validation to ensure either course or package is provided
orderSchema.pre("validate", function (next) {
  if (!this.course && !this.package && !this.trainer) {
    return next(
      new Error("Order must include either a course or a package or a trainer")
    );
  }
  next();
});

// Populate user details automatically on queries
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username email profileImg",
  }).populate({
    path: "course",
    select: "_id title",
  });
  next();
});

//2- create model
module.exports = mongoose.model("Order", orderSchema);
