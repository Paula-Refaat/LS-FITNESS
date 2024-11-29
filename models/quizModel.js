const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
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
});
quizSchema.methods.toJSON = function () {
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
module.exports = mongoose.model("Quiz", quizSchema);
