const mongoose = require("mongoose");

// 2. Training Plan Schema
const trainingPlanSchema = new mongoose.Schema({
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
});

// Models
const TrainingPlan = mongoose.model("TrainingPlan", trainingPlanSchema);

module.exports = TrainingPlan;
