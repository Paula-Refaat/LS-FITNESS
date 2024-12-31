const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const factory = require("./handllerFactory");
const Permission = require("../models/permissionModel");
const User = require("../models/userModel");

exports.createPermission = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { models } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  if (user.role && user.role !== "sub-admin") {
    throw new ApiError(
      "You are not authorized to create permissions for this user",
      400
    );
  }

  try {
    // قم بتحضير التحديث بناءً على الـ models المرسلة في الـ body
    const updateData = {
      $set: {},
    };

    models.forEach((model) => {
      updateData.$set[`models.$[model].fullAccess`] = model.fullAccess;
      updateData.$set[`models.$[model].create`] = model.create;
      updateData.$set[`models.$[model].read`] = model.read;
      updateData.$set[`models.$[model].update`] = model.update;
      updateData.$set[`models.$[model].delete`] = model.delete;
    });

    // فلترة الـ array على أساس المودل الذي نريد تحديثه
    const filter = {
      userId,
      "models.modelName": { $in: models.map((model) => model.modelName) },
    };

    const options = {
      arrayFilters: models.map((model) => ({
        "model.modelName": model.modelName,
      })),
      new: true, // إرجاع المستند بعد التحديث
    };

    // تحديث الصلاحيات
    let permissions = await Permission.findOneAndUpdate(
      filter,
      updateData,
      options
    );

    if (!permissions) {
      // إذا لم تكن هناك صلاحيات لهذا المودل، أضفها
      permissions = await Permission.findOneAndUpdate(
        { userId },
        {
          $push: {
            models: {
              $each: models,
            },
          },
        },
        { new: true, upsert: true } // إنشاء مستند جديد إذا لم يكن موجودًا
      );
    }

    res.json({
      message: "Permissions updated successfully",
      permissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating permissions", error });
  }
});
