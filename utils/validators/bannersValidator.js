const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createBannerValidator = [
  check("vimeo_video_Url")
    .optional()
    .isURL()
    .withMessage("vimeo_video_Url must be a valid URL"),

  check("targetGender")
    .notEmpty()
    .withMessage("targetGender required")
    .toLowerCase()
    .isIn(["men", "women"])
    .withMessage("targetGender must be men or women"),

  validatorMiddleware,
];

exports.updateBannerValidator = [
  check("id").isMongoId().withMessage("Invalid Banner id format"),

  ...this.createBannerValidator,
];

exports.getOneBannerValidator = [
  check("id").isMongoId().withMessage("Invalid Banner id format"),
  validatorMiddleware,
];

exports.deleteBannerValidator = [...this.getOneBannerValidator];
