const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const SocialMediaLinks = require("../../models/socialMediaLinksModel");

// التحقق عند جلب رابط باستخدام ID
exports.getSocialMediaLinkValidator = [
  check("id").isMongoId().withMessage("Invalid social media link ID format"),
  validatorMiddleware,
];

// التحقق عند إنشاء رابط جديد
exports.createSocialMediaLinkValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title is too short")
    .isLength({ max: 100 })
    .withMessage("Title is too long")
    .custom((val) =>
      SocialMediaLinks.findOne({ title: val }).then((link) => {
        if (link) {
          throw new Error("Title already exists and must be unique");
        }
      })
    ),
  check("link")
    .notEmpty()
    .withMessage("Link is required")
    .isURL()
    .withMessage("Invalid URL format"),

  validatorMiddleware,
];

// التحقق عند تحديث رابط
exports.updateSocialMediaLinkValidator = [
  check("id").isMongoId().withMessage("Invalid social media link ID format"),
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title is too short")
    .isLength({ max: 100 })
    .withMessage("Title is too long")
    .custom((val, { req }) =>
      SocialMediaLinks.findOne({ title: val }).then((link) => {
        if (link && link._id.toString() !== req.params.id) {
          throw new Error("Title already exists and must be unique");
        }
      })
    ),
  body("link").optional().isURL().withMessage("Invalid URL format"),

  validatorMiddleware,
];


// التحقق عند حذف رابط
exports.deleteSocialMediaLinkValidator = [
  check("id").isMongoId().withMessage("Invalid social media link ID format"),
  validatorMiddleware,
];
