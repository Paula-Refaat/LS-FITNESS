// database
const mongoose = require("mongoose");
//1- create schema
const mealsCalculationSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "meal title required"],
    unique: [true, "meal title must be unique"],
    minlength: [3, "too short meal  title "],
    maxlength: [32, "too long meal title"],
  },
  quantities: {
    type: Number,
    required: [true, "quantity required"],
    min: [1, "quantity must be at least 1"],
    max: [100, "quantity must be less than or equal to 100"],
  },
  calories: {
    type: Number,
    required: [true, "calories required"],
    min: [0, "calories must be at least 0"],
    max: [10000, "calories must be less than or equal to 10000"],
  },
  proteins: {
    type: Number,
    required: [true, "proteins required"],
    min: [0, "proteins must be at least 0"],
    max: [1000, "proteins must be less than or equal to 1000"],
  },
  carbohydrates: {
    type: Number,
    required: [true, "carbohydrates required"],
    min: [0, "carbohydrates must be at least 0"],
    max: [1000, "carbohydrates must be less than or equal to 1000"],
  },
  fats: {
    type: Number,
    required: [true, "fats required"],
    min: [0, "fats must be at least 0"],
    max: [1000, "fats must be less than or equal to 1000"],
  },
  fibers: {
    type: Number,
    required: [true, "fibers required"],
    min: [0, "fibers must be at least 0"],
    max: [1000, "fibers must be less than or equal to 1000"],
  },
});

//2- create model
const MealsCalculationModel = mongoose.model(
  "mealsCalculation",
  mealsCalculationSchema
);

module.exports = MealsCalculationModel;
