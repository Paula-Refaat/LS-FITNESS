const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: [
          {
            key: { type: String, required: true }, // Example: "a", "b", "c", "d"
            value: { type: String, required: true }, // Example: "Option 1 text"
          },
        ],
        correctAnswer: { type: String, required: true }, // Example: "a"
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);
quizSchema.methods.toJSON = function () {
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
module.exports = mongoose.model("Quiz", quizSchema);
