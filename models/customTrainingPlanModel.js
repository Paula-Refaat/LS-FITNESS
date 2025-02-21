const mongoose = require("mongoose");

const customTrainingPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    days: [
      {
        dayNumber: { type: Number, required: true },
        dayTitle: { type: String, required: true },
        exercises: [
          {
            exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
            sets: { type: Number, required: true },
            reps: { type: Number, required: true },
            restBetweenSets: { type: Number, required: true },
            restBetweenExercises: { type: Number, required: true },
          },
        ],
        meals: [
          {
            meal: { type: mongoose.Schema.Types.ObjectId, ref: "Meals" },
            quantity: { type: Number, required: false },
          },
        ],
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    type: {
      type: String,
      enum: ["exercises", "meals"],
    },
  },
  { timestamps: true }
);
customTrainingPlanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "days.exercises.exercise",
    select: "-isDeleted -deletedAt",
  }).populate({
    path: "days.meals.meal",
    select: "-isDeleted -deletedAt",
  });

  next();
});
customTrainingPlanSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (!obj.createdAt) {
    obj.createdAt = "2024-11-23T19:20:13.186Z";
  }
  if (!obj.updatedAt) {
    obj.updatedAt = "2024-11-23T19:20:13.186Z";
  }
  delete obj.__v;
  delete obj.isDeleted;
  delete obj.deletedAt;
  return obj;
};
const setImageURL = (doc) => {
  if (doc.image) {
    if (
      doc.image.includes(process.env.BASE_URL) ||
      doc.image.includes("http")
    ) {
      let editingMealImageURL = doc.image;
      const splittedURL = editingMealImageURL.split("/");
      const imageName = splittedURL.pop();

      if (imageName.includes(".")) {
        const URL = `${process.env.BASE_URL}/customTrainingPlan/${imageName}`;
        doc.image = URL;
        return;
      } else {
        const URL = `${process.env.BASE_URL}/customTrainingPlan/${imageName}.webp`;
        doc.image = URL;
        return;
      }
    }

    // For local image names
    if (doc.image.includes(".")) {
      const URL = `${process.env.BASE_URL}/customTrainingPlan/${doc.image}`;
      doc.image = URL;
    } else {
      const URL = `${process.env.BASE_URL}/customTrainingPlan/${doc.image}.webp`;
      doc.image = URL;
    }
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
customTrainingPlanSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
customTrainingPlanSchema.post("save", (doc) => {
  setImageURL(doc);
});
// Models
const CustomTrainingPlanModel = mongoose.model(
  "CustomTrainingPlan",
  customTrainingPlanSchema
);

module.exports = CustomTrainingPlanModel;
