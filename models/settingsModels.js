const mongoose = require("mongoose");
const settingsSchema = new mongoose.Schema({
  MAX_LOGINS_PER_DEVICE: { type: Number, required: true, default: 3 }, // الحد الأقصى
});

module.exports = mongoose.model("Settings", settingsSchema);
