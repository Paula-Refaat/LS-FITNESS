// database
const mongoose = require("mongoose");
//1- create schema
const toolOrMachineSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tool or Machine title required"],
      unique: [true, "Tool or Machine title must be unique"],
      minlength: [3, "too short Tool or Machine  title "],
      maxlength: [32, "too long Tool or Machine title"],
    },
  },
  { timestamps: true }
);

toolOrMachineSchema.methods.toJSON = function () {
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
const ToolOrMachineModel = mongoose.model("ToolOrMachine", toolOrMachineSchema);

module.exports = ToolOrMachineModel;
