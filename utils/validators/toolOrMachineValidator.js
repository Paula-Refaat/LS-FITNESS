const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ToolOrMachine = require("../../models/toolOrMachineModel");

exports.getToolOrMachineValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid ToolOrMachine id format"),
  //catch error
  validatorMiddleware,
];
exports.createToolOrMachineValidator = [
  check("title")
    .notEmpty()
    .withMessage("ToolOrMachine required")
    .isLength({ min: 3 })
    .withMessage("too short ToolOrMachine title")
    .isLength({ max: 32 })
    .withMessage("too long ToolOrMachine title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val) =>
      ToolOrMachine.findOne({ title: val }).then((toolOrMachine) => {
        if (toolOrMachine) {
          throw new Error(
            `ToolOrMachine title already exists and must it to be unique`
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.updateToolOrMachineValidator = [
  check("id").isMongoId().withMessage("Invalid ToolOrMachine id format"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("ToolOrMachine required")
    .isLength({ min: 3 })
    .withMessage("too short ToolOrMachine title")
    .isLength({ max: 32 })
    .withMessage("too long ToolOrMachine title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .custom((val, { req }) => {
      return ToolOrMachine.findById(req.params.id).then((toolOrMachine) => {
        if (toolOrMachine.title === val) {
          return;
        }
        return ToolOrMachine.findOne({ title: val }).then((toolOrMachine) => {
          if (toolOrMachine) {
            throw new Error(
              `ToolOrMachine title already exists and must it to be unique`
            );
          }
        });
      });
    }),

  validatorMiddleware,
];
exports.deleteToolOrMachineValidator = [
  check("id").isMongoId().withMessage("Invalid ToolOrMachine id format"),
  validatorMiddleware,
];
