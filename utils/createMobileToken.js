const jwt = require("jsonwebtoken");

const createMobileToken = (userId, deviceId) => {
  return jwt.sign(
    { userId, deviceId: deviceId ?? undefined },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn:
        "JWT_EXPIRE_TIME" in process.env
          ? process.env.JWT_EXPIRE_TIME
          : undefined,
    }
  );
};

module.exports = createMobileToken;
