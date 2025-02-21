const mongoose = require("mongoose");

const mealsCategorySchema = new mongoose.Schema(
  {
    title_AR: {
      type: String,
      required: [true, "Please provide a title in arabic"],
    },
    title_EN: {
      type: String,
      required: [true, "Please provide a title in english"],
    },
    targetModel: {
      type: String,
      enum: ["MealsCalculation", "Meals"],
      default: "MealsCalculation",
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

mealsCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: "parentCategory", model: "MealCategory" });

  next();
});

mealsCategorySchema.methods.toJSON = function () {
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

module.exports = mongoose.model("MealCategory", mealsCategorySchema);
