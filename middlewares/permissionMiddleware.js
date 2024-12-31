const Permission = require("../models/permissionModel");

const checkPermission = (modelName, action) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role; // افترض أن الدور يتم تخزينه في req.user

      // السماح إذا كان المستخدم Admin أو أي دور آخر غير Sub-Admin
      if (userRole !== "sub-admin") {
        return next(); // السماح مباشرة بدون التحقق من الصلاحيات
      }

      // التحقق من الصلاحيات إذا كان الدور Sub-Admin
      const userId = req.user._id;
      const permissions = await Permission.findOne({ userId });

      if (!permissions) {
        return res
          .status(403)
          .json({ message: "Permissions not found for this user" });
      }

      // استخدام hasPermission للتحقق من الإذن للمودل والعملية
      const hasPermission = permissions.hasPermission(modelName, action);

      if (!hasPermission) {
        return res.status(403).json({
          message: `Access denied: insufficient permissions for ${modelName}`,
        });
      }

      next(); // السماح بالوصول إذا كانت الصلاحيات متوفرة
    } catch (error) {
      res.status(500).json({ message: "Error checking permissions", error });
    }
  };
};

module.exports = checkPermission;
