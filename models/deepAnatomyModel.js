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
deepAnatomySchema.methods.toJSON = function () {
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
//2- create model
const DeepAnatomyModel = mongoose.model("DeepAnatomy", deepAnatomySchema);

module.exports = DeepAnatomyModel;
