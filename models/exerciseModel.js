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
    //FIXME:fix this video schema
    videoUrl: {
      type: String,
      required: [true, "videoUrl field is required"],
      unique: [true, "exercise video Url must be unique"],
    },
    // must me like that
    /*
        video: {
      public_id: {
        type:string,
      },
      vide_url: {
        type: String,
        required: [true, "videoUrl field is required"],
        unique: [true, "exercise video Url must be unique"],
      }
    },
    */
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
  // console.log(videoUrl)
  next();
});

// exerciseSchema.methods.toJSON = function () {
//   const obj = this.toObject();

//   // Create a copy of the object to safely remove videoUrl
//   const { videoUrl, ...responseWithoutVideoUrl } = obj;
//   const data = {
//     ...responseWithoutVideoUrl,
//     video: {
//       url: videoUrl,
//       public_id: videoUrl.split("/").pop(),
//     },
//   };

//   return data;
// };

//2- create model
const ExerciseModel = mongoose.model("Exercise", exerciseSchema);

module.exports = ExerciseModel;
