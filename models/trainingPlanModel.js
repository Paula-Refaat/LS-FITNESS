const mongoose = require("mongoose");

// 2. Training Plan Schema
const trainingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // اسم الخطة
    days: [
      {
        dayNumber: { type: Number, required: true }, // اليوم رقم
        exercises: [
          {
            exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }, // التمرين

            sets: { type: Number, required: true }, // عدد المجموعات
            reps: { type: Number, required: true }, // عدد التكرارات
            restBetweenSets: { type: Number, required: true }, // الراحة بين المجموعات (بالثواني)
            restBetweenExercises: { type: Number, required: true }, // الراحة بين التمارين (بالثواني)
          },
        ],
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);
trainingPlanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "days.exercises.exercise",
    select: "-isDeleted -deletedAt",
  });
  next();
});
trainingPlanSchema.methods.toJSON = function () {
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

// Models
const TrainingPlan = mongoose.model("TrainingPlan", trainingPlanSchema);

module.exports = TrainingPlan;
