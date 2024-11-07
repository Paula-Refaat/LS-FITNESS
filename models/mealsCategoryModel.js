const mongoose = require("mongoose");

const mealsCategorySchema = new mongoose.Schema({
  title_AR: {
    type: String,
    required: [true, "Please provide a title in arabic"],
  },
  title_EN: {
    type: String,
    required: [true, "Please provide a title in english"],
  },
});
module.exports = mongoose.model("MealCategory", mealsCategorySchema);
