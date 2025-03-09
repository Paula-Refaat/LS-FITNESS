const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Vitamin = require("../../models/vitaminModel");

exports.getVitaminValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid Vitamin id format"),
  //catch error
  validatorMiddleware,
];
exports.createVitaminValidator = [
  check("title")
    .notEmpty()
    .withMessage("Vitamin required")
    .isLength({ min: 3 })
    .withMessage("too short Vitamin title")
    .isLength({ max: 32 })
    .withMessage("too long Vitamin title")
    .customSanitizer((val) => {
      if (!val) return "";
      return val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .custom((val) =>
      Vitamin.findOne({ title: val }).then((vitamin) => {
        if (vitamin) {
          throw new Error(
            `Vitamin title already exists and must it to be unique`
          );
        }
      })
    ),
  check("description")
    .notEmpty()
    .withMessage("Description required")
    .isLength({ min: 10 })
    .withMessage("too short description")
    .isLength({ max: 50000 })
    .withMessage("too long Description, max must be 50000 character"),
  check("image").notEmpty().withMessage("image required"),
  // check("benefits").notEmpty().withMessage("benefits required"),

  check("vimeo_video_Url")
    .notEmpty()
    .withMessage("vimeo_video_Url required")
    .isURL()
    .withMessage("vimeo_video_Url must be a valid URL"),
  // TODO: Check if the video URL is unique or not
  // .custom((val, { req }) => {
  //   return Vitamin.findOne({ "video.url": val }).then((Vitamin) => {
  //     if (Vitamin) {
  //       throw new Error(`videoUrl already exists and must it to be unique`);
  //     }
  //   });
  // })

  validatorMiddleware,
];
exports.updateVitaminValidator = [
  check("id").isMongoId().withMessage("Invalid Vitamin id format"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Vitamin required")
    .isLength({ min: 3 })
    .withMessage("too short Vitamin title, min title must be 3 character")
    .isLength({ max: 32 })
    .withMessage("too long Vitamin title, max title must be 32 character")
    .customSanitizer((val) => {
      if (!val) return "";
      return val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .custom((val, { req }) => {
      return Vitamin.findById(req.params.id).then((vitamin) => {
        if (vitamin.title === val) {
          return;
        }
        return Vitamin.findOne({ title: val }).then((vitamin) => {
          if (vitamin) {
            throw new Error(
              `Vitamin title already exists and must it to be unique`
            );
          }
        });
      });
    }),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Description required")
    .isLength({ min: 10 })
    .withMessage("too short Description, min must be 10 character")
    .isLength({ max: 50000 })
    .withMessage("too long Description, max must be 50000 character"),
  check("image").optional().notEmpty().withMessage("image required"),
  // check("benefits").optional().notEmpty().withMessage("benefits required"),

  check("vimeo_video_Url")
    .optional()
    .notEmpty()
    .withMessage("videoUrl required")
    .isURL()
    .withMessage("videoUrl must be a valid URL"),
  // TODO: Check if the video URL is unique or not
  // .custom((val, { req }) => {
  //   return Vitamin.findById(req.params.id).then((Vitamin) => {
  //     if (Vitamin.videoUrl === val) {
  //       return;
  //     }
  //     return Vitamin.findOne({ videoUrl: val }).then((Vitamin) => {
  //       if (Vitamin) {
  //         throw new Error(
  //           `Vitamin video Url already exists and must it to be unique`
  //         );
  //       }
  //     });
  //   });
  // })

  validatorMiddleware,
];
exports.deleteVitaminValidator = [
  check("id").isMongoId().withMessage("Invalid Vitamin id format"),
  validatorMiddleware,
];
