const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Name required"],
    minLength: [3, "Too short user name"],
  },
  google: {
    id: String,
    email: String,
  },
  facebook: { // Add Facebook fields
    id: String,
    email: String,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email Required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [
      function () {
        return !this.isOAuthUser;
      },
      "Password required",
    ],
    minlength: [8, "Too short Password"],
  },
  isOAuthUser: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  phone: String,
  profileImg: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const setProfileImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.profileImg) {
    const URL = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = URL;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
userSchema.post("init", (doc) => {
  setProfileImageURL(doc);
});
// it work with create
userSchema.post("save", (doc) => {
  setProfileImageURL(doc);
});

module.exports = mongoose.model("User", userSchema);
