const jwt = require("jsonwebtoken");

const createMobileToken = (userId, deviceId) => {
  const tokenOptions =
    "JWT_EXPIRE_TIME" in process.env
      ? { expiresIn: process.env.JWT_EXPIRE_TIME }
      : undefined;

  return jwt.sign(
    { userId, deviceId: deviceId ?? undefined },
    process.env.JWT_SECRET_KEY,
    tokenOptions
  );
};

module.exports = createMobileToken;
