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

//2- create model
const ToolOrMachineModel = mongoose.model("ToolOrMachine", toolOrMachineSchema);

module.exports = ToolOrMachineModel;
