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
  },
  { timestamps: true }
);
mealsCategorySchema.methods.toJSON = function () {
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
module.exports = mongoose.model("MealCategory", mealsCategorySchema);
