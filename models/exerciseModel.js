// database
const mongoose = require("mongoose");
//1- create schema
const exerciseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "exercise title required"],
      // unique: [true, "exercise title must be unique"],
      minlength: [3, "too short exercise  title "],
      maxlength: [32, "too long exercise title"],
    },
    bodyPart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BodyPart",
    },
    toolOrMachine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ToolOrMachine",
    },
    Cardio: {
      type: Boolean,
    },
    Warmup: {
      type: Boolean,
    },
    recoveryAndStretching: {
      type: Boolean,
    },
    deepAnatomy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeepAnatomy",
      },
    ],

    targetGender: {
      type: String,
      enum: ["men", "women"],
      required: [true, "targetGender field is required"],
    },
    video: {
      thumbnail: {},
      public_id: {},
      url: {},
    },
    Description: {
      type: String,
      minlength: [10, "too short Description "],
      maxlength: [1000, "too long Description"],
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
  this.populate({ path: "deepAnatomy", select: "title" })
    .populate({ path: "bodyPart", select: "title" })
    .populate({ path: "toolOrMachine", select: "title" });
  // .sort({ title: 1 }); // Sort by title in ascending order
  // console.log(videoUrl)
  next();
});
exerciseSchema.methods.toJSON = function () {
  const exercise = this.toObject();

  // List all fields with default values as null if missing
  const defaultFields = {
    bodyPart: null,
    toolOrMachine: null,
    Cardio: null,
    Warmup: null,
    recoveryAndStretching: null,
    deepAnatomy: [],
    video: {
      thumbnail: null,
      public_id: null,
      url: null,
    },
    Description: null,
    instructions: null,
    createdAt: "2024-11-23T19:20:13.186Z",
    updatedAt: "2024-11-23T19:20:13.186Z",
  };

  // Merge missing fields with default values
  return { ...defaultFields, ...exercise };
};

//2- create model
const ExerciseModel = mongoose.model("Exercise", exerciseSchema);

module.exports = ExerciseModel;
