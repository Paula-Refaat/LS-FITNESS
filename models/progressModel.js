const mongoose = require("mongoose");

const progressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    volumes: [
      {
        type: Number,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// progressSchema.pre(/^find/, function (next) {
//   this.populate({ path: "userId", select: "username" })
//     .populate({ path: "exerciseId", select: "title" })
//   next();
// });

progressSchema.pre(/^find/, function (next) {
  this.populate({ path: "userId", select: "username" })
    .populate({ path: "exerciseId", select: "title" })
    .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  next();
});

const ProgressModel = mongoose.model("Progress", progressSchema);
module.exports = ProgressModel;
