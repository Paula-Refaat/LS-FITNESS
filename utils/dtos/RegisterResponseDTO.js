class RegisterResponseDTO {
  constructor(user) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.phone = user.phone;
    this.isOAuthUser = user.isOAuthUser;
    this.role = user.role;
    this.active = user.active;

    if (user?.goalsData && user.goalsData?.gender) {
      this.gender = user.goalsData.gender;
    }
  }
}

module.exports = { RegisterResponseDTO };
