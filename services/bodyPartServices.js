// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/apiError");
const BodyPart = require("../models/bodyPartModel");
const factory = require("./handllerFactory");

//@desc get list of bodyParts
//@route GET /api/v1/bodyParts
//@access public
exports.getBodyParts = factory.getAll(BodyPart, "BodyPart");

//@desc get specific bodyParts by id
//@route GET /api/v1/bodyParts/:id
//@access public
exports.getBodyPart = factory.getOne(BodyPart);

//@desc create bodyPart
//@route POST /api/v1/bodyParts
//@access private
exports.createBodyPart = factory.createOne(BodyPart);

//@desc update specific bodyPart
//@route PUT /api/v1/bodyParts/:id
//@access private
exports.updateBodyPart = factory.updateOne(BodyPart);

// TODO:
//@desc delete bodyPart
//@route DELETE /api/v1/bodyParts/:id
//@access private
exports.deleteBodyPart = factory.deleteOne(BodyPart);
