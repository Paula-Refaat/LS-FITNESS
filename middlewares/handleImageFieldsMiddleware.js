exports.handleImageMiddleware = (req, res, next) => {
  if (
    ["PUT", "PATCH"].includes(req.method) &&
    "image" in req?.body &&
    (req.body.image.startsWith("https://") ||
      req.body.image.startsWith("http://"))
  ) {
    console.log("Deleting IMAGE!");

    delete req.body.image;
  }

  return next();
};
