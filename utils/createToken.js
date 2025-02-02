const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const tokenOptions =
    "JWT_EXPIRE_TIME" in process.env
      ? { expiresIn: process.env.JWT_EXPIRE_TIME }
      : undefined;

  return jwt.sign(
    { userId: payload },
    process.env.JWT_SECRET_KEY,
    tokenOptions
  );
};

module.exports = createToken;
