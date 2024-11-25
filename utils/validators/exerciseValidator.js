const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Exercise = require("../../models/exerciseModel");
const DeepAnatomy = require("../../models/deepAnatomyModel");
const ToolOrMachine = require("../../models/toolOrMachineModel");
const BodyPart = require("../../models/bodyPartModel");

exports.getExerciseValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid exercise id format"),
  //catch error
  validatorMiddleware,
];
exports.createExerciseValidator = [
  check("title")
    .notEmpty()
    .withMessage("Exercise required")
    .isLength({ min: 3 })
    .withMessage("too short Exercise title")
    .isLength({ max: 32 })
    .withMessage("too long Exercise title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ),
  // .custom((val) =>
  //   Exercise.findOne({ title: val }).then((exercise) => {
  //     if (exercise) {
  //       throw new Error(
  //         `Exercise title already exists and must it to be unique`
  //       );
  //     }
  //   })
  // )
  check("toolOrMachine")
    .notEmpty()
    .withMessage("toolOrMachine required")
    .isMongoId()
    .withMessage("Invalid toolOrMachine id format")
    .custom((val) => {
      return ToolOrMachine.findById(val).then((toolOrMachine) => {
        if (!toolOrMachine) {
          throw new Error(`This ID not related to toolOrMachine`);
        }
      });
    }),
  check("bodyPart")
    .notEmpty()
    .withMessage("bodyPart required")
    .isMongoId()
    .withMessage("Invalid BodyPart id format")
    .custom((val) => {
      return BodyPart.findById(val).then((bodyPart) => {
        if (!bodyPart) {
          throw new Error(`This ID not related to bodyPart`);
        }
      });
    }),
  check("deepAnatomy")
    .notEmpty()
    .withMessage("deepAnatomy field is required")
    .isArray({ min: 1 })
    .withMessage("deepAnatomy must be a non-empty array")
    .custom(async (val) => {
      // التحقق من تكرار العناصر في المصفوفة
      const uniqueIds = [...new Set(val)];
      if (uniqueIds.length !== val.length) {
        throw new Error("Duplicate IDs found in deepAnatomy array");
      }

      // التحقق من صحة كل معرف ووجوده في قاعدة البيانات
      const deepAnatomies = await DeepAnatomy.find({ _id: { $in: val } });
      if (deepAnatomies.length !== val.length) {
        throw new Error(
          "One or more IDs in deepAnatomy do not exist in the database"
        );
      }
      return true;
    }),
  check("Cardio").isBoolean().withMessage("Cardio must be a boolean"),
  check("Warmup").isBoolean().withMessage("Warmup must be a boolean"),
  check("recoveryAndStretching")
    .isBoolean()
    .withMessage("recoveryAndStretching must be a boolean"),

  check("targetGender")
    .notEmpty()
    .withMessage("targetGender required")
    .toLowerCase()
    .isIn(["men", "women"])
    .withMessage("targetGender must be men or women"),
  check("vimeo_video_Url")
    .notEmpty()
    .withMessage("vimeo_video_Url required")
    .isURL()
    .withMessage("vimeo_video_Url must be a valid URL"),
  // TODO: Check if the video URL is unique or not
  // .custom((val, { req }) => {
  //   return Exercise.findOne({ "video.url": val }).then((exercise) => {
  //     if (exercise) {
  //       throw new Error(`videoUrl already exists and must it to be unique`);
  //     }
  //   });
  // })
  check("instructions")
    .optional()
    .isLength({ min: 10 })
    .withMessage("too short instructions")
    .isLength({ max: 1000 })
    .withMessage("too long instructions"),
  validatorMiddleware,
];
exports.updateExerciseValidator = [
  check("id").isMongoId().withMessage("Invalid Exercise id format"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Exercise required")
    .isLength({ min: 3 })
    .withMessage("too short Exercise title")
    .isLength({ max: 32 })
    .withMessage("too long Exercise title")
    .customSanitizer((val) =>
      val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ),
  // .custom((val, { req }) => {
  //   return Exercise.findById(req.params.id).then((exercise) => {
  //     if (exercise.title === val) {
  //       return;
  //     }
  //     return Exercise.findOne({ title: val }).then((exercise) => {
  //       if (exercise) {
  //         throw new Error(
  //           `Exercise title already exists and must it to be unique`
  //         );
  //       }
  //     });
  //   });
  // })
  check("toolOrMachine")
    .optional()
    .notEmpty()
    .withMessage("toolOrMachine required")
    .isMongoId()
    .withMessage("Invalid toolOrMachine id format")
    .custom((val) => {
      return ToolOrMachine.findById(val).then((toolOrMachine) => {
        if (!toolOrMachine) {
          throw new Error(`This ID not related to toolOrMachine`);
        }
      });
    }),
  check("bodyPart")
    .optional()
    .notEmpty()
    .withMessage("bodyPart required")
    .isMongoId()
    .withMessage("Invalid BodyPart id format")
    .custom((val) => {
      return BodyPart.findById(val).then((bodyPart) => {
        if (!bodyPart) {
          throw new Error(`This ID not related to bodyPart`);
        }
      });
    }),
  check("deepAnatomy")
    .optional()
    .notEmpty()
    .withMessage("deepAnatomy field is required")
    .isArray({ min: 1 })
    .withMessage("deepAnatomy must be a non-empty array")
    .custom(async (val) => {
      // التحقق من تكرار العناصر في المصفوفة
      const uniqueIds = [...new Set(val)];
      if (uniqueIds.length !== val.length) {
        throw new Error("Duplicate IDs found in deepAnatomy array");
      }

      // التحقق من صحة كل معرف ووجوده في قاعدة البيانات
      const deepAnatomies = await DeepAnatomy.find({ _id: { $in: val } });
      if (deepAnatomies.length !== val.length) {
        throw new Error(
          "One or more IDs in deepAnatomy do not exist in the database"
        );
      }
      return true;
    }),
  check("Cardio")
    .optional()
    .isBoolean()
    .withMessage("Cardio must be a boolean"),
  check("Warmup")
    .optional()
    .isBoolean()
    .withMessage("Warmup must be a boolean"),
  check("recoveryAndStretching")
    .optional()
    .isBoolean()
    .withMessage("recoveryAndStretching must be a boolean"),

  check("vimeo_video_Url")
    .optional()
    .notEmpty()
    .withMessage("videoUrl required")
    .isURL()
    .withMessage("videoUrl must be a valid URL"),
  // TODO: Check if the video URL is unique or not
  // .custom((val, { req }) => {
  //   return Exercise.findById(req.params.id).then((exercise) => {
  //     if (exercise.videoUrl === val) {
  //       return;
  //     }
  //     return Exercise.findOne({ videoUrl: val }).then((exercise) => {
  //       if (exercise) {
  //         throw new Error(
  //           `Exercise video Url already exists and must it to be unique`
  //         );
  //       }
  //     });
  //   });
  // })
  check("instructions")
    .optional()
    .isLength({ min: 10 })
    .withMessage("too short instructions")
    .isLength({ max: 1000 })
    .withMessage("too long instructions"),
  check("Description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("too short Description")
    .isLength({ max: 1000 })
    .withMessage("too long Description"),

  validatorMiddleware,
];
exports.deleteExerciseValidator = [
  check("id").isMongoId().withMessage("Invalid Exercise id format"),
  validatorMiddleware,
];
