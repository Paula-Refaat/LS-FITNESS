const factory = require("./handllerFactory");
const Settings = require("../models/settingsModels");

// create new settings
exports.createSettings = factory.createOne(Settings);
// get all settings

exports.getSettings = factory.getAll(Settings, "Settings");

// get single settings

exports.getSingleSettings = factory.getOne(Settings);

// update single settings

exports.updateSettings = factory.updateOne(Settings);

// delete single settings

exports.deleteSettings = factory.deleteOne(Settings);
