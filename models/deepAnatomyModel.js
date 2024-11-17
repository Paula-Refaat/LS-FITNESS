// database
const mongoose = require("mongoose");
//1- create schema
const deepAnatomySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Deep Anatomy title required"],
      unique: [true, "Deep Anatomy title must be unique"],
      minlength: [3, "too short Deep Anatomy  title "],
      maxlength: [32, "too long Deep Anatomy title"],
    },
  },
  { timestamps: true }
);

//2- create model
const DeepAnatomyModel = mongoose.model("DeepAnatomy", deepAnatomySchema);

module.exports = DeepAnatomyModel;
