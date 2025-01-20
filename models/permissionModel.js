const mongoose = require("mongoose");

const allowedModels = [
  "User",
  "BlacklistedToken",
  "Settings",
  "Permission",
  "BodyPart",
  "Exercise",
  "MealsCalculation",
  "MealCategory",
  "Progress",
  "Coupon",
  "Category",
  "Course",
  "Lesson",
  "Quiz",
  "Notification",
  "Order",
  "TrainingPlan",
  "TrainerRequest",
  "Supplement",
  "Vitamin",
  "Advertise",
  "Chat",
  "Message",
  "DeepAnatomy",
  "ToolOrMachine",
  "SocialMediaLinks",
  "TrainerProfile",
  "Policies",
  "ContactUs",
];

const permissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  models: [
    {
      modelName: {
        type: String,
        required: true,
        enum: allowedModels, // تحديد القيم المسموح بها فقط
      },
      fullAccess: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      read: {
        type: Boolean,
        default: false,
      },
      update: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

// التحقق من الصلاحية للمودل والعملية
permissionSchema.methods.hasPermission = function (modelName, action) {
  const modelPermission = this.models.find((m) => m.modelName === modelName);
  if (!modelPermission) {
    return false; // إذا لم يتم العثور على صلاحيات لهذا المودل
  }
  if (modelPermission.fullAccess) {
    return true; // السماح إذا كانت الصلاحية الشاملة مفعلة
  }
  return modelPermission[action] || false; // السماح بناءً على العملية
};

module.exports = mongoose.model("Permission", permissionSchema);
