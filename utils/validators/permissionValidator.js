const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
// const MealCategory = require("../../models/mealsCategoryModel");

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
];

exports.createPermissionValidator = [
  check("userId")
    .notEmpty()
    .withMessage("userId required")
    .isMongoId()
    .withMessage("Invalid userId format"),

  check("models")
    .notEmpty()
    .withMessage("models required")
    .isArray({ min: 1 })
    .withMessage("models must be an array with at least one item")
    .custom((models) => {
      // تحقق من أن كل modelName في الموديل من الـ allowedModels
      models.forEach((model) => {
        if (!allowedModels.includes(model.modelName)) {
          throw new Error(`Invalid modelName: ${model.modelName}`);
        }
        // تحقق من أن الـ create, read, update, delete هي قيم Boolean صحيحة إذا تم تمريرها
        if (model.create !== undefined && typeof model.create !== "boolean") {
          throw new Error("Invalid create permission, must be a boolean");
        }
        if (model.read !== undefined && typeof model.read !== "boolean") {
          throw new Error("Invalid read permission, must be a boolean");
        }
        if (model.update !== undefined && typeof model.update !== "boolean") {
          throw new Error("Invalid update permission, must be a boolean");
        }
        if (model.delete !== undefined && typeof model.delete !== "boolean") {
          throw new Error("Invalid delete permission, must be a boolean");
        }
        if (
          model.fullAccess !== undefined &&
          typeof model.fullAccess !== "boolean"
        ) {
          throw new Error("Invalid fullAccess permission, must be a boolean");
        }
      });
      return true;
    }),

  validatorMiddleware,
];
