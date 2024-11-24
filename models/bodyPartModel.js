// database
const mongoose = require("mongoose");
//1- create schema
const bodyPartSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "body part title required"],
      unique: [true, "body part title must be unique"],
      minlength: [3, "too short body part  title "],
      maxlength: [32, "too long body part title"],
    },
  },
  { timestamps: true }
);
bodyPartSchema.methods.toJSON = function () {
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
const BodyPartModel = mongoose.model("BodyPart", bodyPartSchema);

module.exports = BodyPartModel;
