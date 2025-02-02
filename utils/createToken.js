const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn:
      "JWT_EXPIRE_TIME" in process.env
        ? process.env.JWT_EXPIRE_TIME
        : undefined,
  });
};
module.exports = createToken;
