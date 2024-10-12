const { RegisterResponseDTO } = require("./RegisterResponseDTO");

class LoginResponseDTO extends RegisterResponseDTO {
  constructor(user) {
    super(user);
  }
}

module.exports = { LoginResponseDTO };
