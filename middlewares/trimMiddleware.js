// Middleware to trim all string fields in the request body, query, and params
const trimAll = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    }
  }

  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = req.query[key].trim();
      }
    }
  }

  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = req.params[key].trim();
      }
    }
  }

  // console.log("Trimmed Request:", {
  //   body: req.body,
  //   query: req.query,
  //   params: req.params,
  // });

  next();
};

module.exports = trimAll;
