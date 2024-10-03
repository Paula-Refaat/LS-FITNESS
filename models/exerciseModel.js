// database
const mongoose = require("mongoose");
//1- create schema
const exerciseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "exercise title required"],
      unique: [true, "exercise title must be unique"],
      minlength: [3, "too short exercise  title "],
      maxlength: [32, "too long exercise title"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    bodyPart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BodyPart",
    },
    targetGender: {
      type: String,
      enum: ["men", "women"],
      required: [true, "targetGender field is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "videoUrl field is required"],
      unique: [true, "exercise video Url must be unique"],
    },
    instructions: {
      type: String,
      minlength: [10, "too short instructions "],
      maxlength: [1000, "too long instructions"],
    },
  },
  { timestamps: true }
);

exerciseSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "title" })
    .populate({ path: "bodyPart", select: "title" })
    .sort({ title: 1 }); // Sort by title in ascending order
  next();
});
//2- create model
const ExerciseModel = mongoose.model("Exercise", exerciseSchema);

module.exports = ExerciseModel;
