// database
const mongoose = require("mongoose");
//1- create schema
const categorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "category title required"],
      unique: [true, "category title must be unique"],
      minlength: [3, "too short category  title "],
      maxlength: [32, "too long category title"],
      trim: true,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
categorySchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "category",
  // justOne: false,
});
categorySchema.methods.toJSON = function () {
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
//2- create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
