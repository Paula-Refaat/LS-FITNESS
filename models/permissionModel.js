const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  create: {
    type: Boolean,
    default: false,
  },
  read: {
    type: Boolean,
    default: true, // الافتراضي أن القراءة مسموحة
  },
  fullAccess: {
    type: Boolean,
    default: false,
  },
});

permissionSchema.methods.hasPermission = function (action) {
  // إذا كانت fullAccess=true، يتم منح جميع الصلاحيات
  if (this.fullAccess) {
    return true;
  }

  // التحقق من الصلاحيات بناءً على الحقل المطلوب
  return this[action] || false;
};

module.exports = mongoose.model("Permission", permissionSchema);
