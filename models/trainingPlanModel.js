const mongoose = require("mongoose");

// 2. Training Plan Schema
const trainingPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // اسم الخطة
    description: { type: String, required: true }, // الوصف
    image: { type: String, required: true }, // الصورة
    days: [
      {
        dayNumber: { type: Number, required: true }, // اليوم رقم
        dayTitle: { type: String, required: true }, // اليوم عنوان
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
    targetGender: {
      type: String,
      enum: ["men", "women"],
      required: [true, "targetGender field is required"],
    },
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
const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const ImageUrl = `${process.env.BASE_URL}/trainingPlan/${doc.image}`;
    doc.image = ImageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
trainingPlanSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
trainingPlanSchema.post("save", (doc) => {
  setImageURL(doc);
});
// Models
const TrainingPlan = mongoose.model("TrainingPlan", trainingPlanSchema);

module.exports = TrainingPlan;
