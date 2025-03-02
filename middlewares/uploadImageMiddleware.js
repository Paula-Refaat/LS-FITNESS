const multer = require("multer");
const ApiError = require("../utils/ApiError");

const multerOptions = (media) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    console.log("Received file:", file);

    const allowedMediaTypes = media.split("|");
    if (allowedMediaTypes.some((type) => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new ApiError(`Only ${media} Allowed`, 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleMedia = (fieldName, media) =>
  multerOptions(media).single(fieldName);

exports.uploadMixOfMedia = (arrayOfFields, media) =>
  multerOptions(media).fields(arrayOfFields);
