const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Supplement = require("../../models/supplementModel");

exports.getSupplementValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid Supplement id format"),
  //catch error
  validatorMiddleware,
];
exports.createSupplementValidator = [
  check("title")
    .notEmpty()
    .withMessage("Supplement required")
    .isLength({ min: 3 })
    .withMessage("too short Supplement title")
    .isLength({ max: 32 })
    .withMessage("too long Supplement title")
    .customSanitizer((val) => {
      if (!val) return "";
      return val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .custom((val) =>
      Supplement.findOne({ title: val }).then((supplement) => {
        if (supplement) {
          throw new Error(
            `Supplement title already exists and must it to be unique`
          );
        }
      })
    ),
  check("description")
    .notEmpty()
    .withMessage("Description required")
    .isLength({ min: 10 })
    .withMessage("too short description")
    .isLength({ max: 1000 })
    .withMessage("too long description"),
  check("image").notEmpty().withMessage("image required"),
  check("benefits").notEmpty().withMessage("benefits required"),

  check("vimeo_video_Url")
    .notEmpty()
    .withMessage("vimeo_video_Url required")
    .isURL()
    .withMessage("vimeo_video_Url must be a valid URL"),
  // TODO: Check if the video URL is unique or not
  // .custom((val, { req }) => {
  //   return Supplement.findOne({ "video.url": val }).then((Supplement) => {
  //     if (Supplement) {
  //       throw new Error(`videoUrl already exists and must it to be unique`);
  //     }
  //   });
  // })

  validatorMiddleware,
];
exports.updateSupplementValidator = [
  check("id").isMongoId().withMessage("Invalid Supplement id format"),
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Supplement required")
    .isLength({ min: 3 })
    .withMessage("too short Supplement title, min title must be 3 character")
    .isLength({ max: 32 })
    .withMessage("too long Supplement title, max title must be 32 character")
    .customSanitizer((val) => {
      if (!val) return "";
      return val
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .custom((val, { req }) => {
      return Supplement.findById(req.params.id).then((supplement) => {
        if (supplement.title === val) {
          return;
        }
        return Supplement.findOne({ title: val }).then((supplement) => {
          if (supplement) {
            throw new Error(
              `Supplement title already exists and must it to be unique`
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
    .isLength({ max: 1000 })
    .withMessage("too long Description, max must be 1000 character"),
  check("image").optional().notEmpty().withMessage("image required"),
  check("benefits").optional().notEmpty().withMessage("benefits required"),

  check("vimeo_video_Url")
    .optional()
    .notEmpty()
    .withMessage("videoUrl required")
    .isURL()
    .withMessage("videoUrl must be a valid URL"),
  // TODO: Check if the video URL is unique or not
  // .custom((val, { req }) => {
  //   return Supplement.findById(req.params.id).then((Supplement) => {
  //     if (Supplement.videoUrl === val) {
  //       return;
  //     }
  //     return Supplement.findOne({ videoUrl: val }).then((Supplement) => {
  //       if (Supplement) {
  //         throw new Error(
  //           `Supplement video Url already exists and must it to be unique`
  //         );
  //       }
  //     });
  //   });
  // })

  validatorMiddleware,
];
exports.deleteSupplementValidator = [
  check("id").isMongoId().withMessage("Invalid Supplement id format"),
  validatorMiddleware,
];
